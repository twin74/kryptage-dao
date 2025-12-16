"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card, PageShell } from "@/components/UI";
import { useVaultClaimableAssetsEthers } from "@/hooks/useVaultClaimableAssetsEthers";

export default function Vault1Page() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [walletChainId, setWalletChainId] = useState<number | null>(null);

  const [usdkInVault, setUsdkInVault] = useState<string>("0");
  const [susdkBalance, setSusdkBalance] = useState<string>("0");
  const [pendingRewardsOnchain, setPendingRewardsOnchain] = useState<string>("0");
  const [pendingRewardsFarmEst, setPendingRewardsFarmEst] = useState<string>("0");
  const [pendingRewardsTotalEst, setPendingRewardsTotalEst] = useState<string>("0");
  const [apy, setApy] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [ktgPoints, setKtgPoints] = useState<string>("0.0000");

  // Raw on-chain balances/decimals (for MAX buttons + tx safety)
  const [usdcBalanceRaw, setUsdcBalanceRaw] = useState<bigint>(0n);
  const [usdcDecimals, setUsdcDecimals] = useState<number>(6);
  const [susdkBalanceRaw, setSusdkBalanceRaw] = useState<bigint>(0n);
  const [susdkDecimals, setSusdkDecimals] = useState<number>(18);

  // Claimable USDK displayed in the top card (string already formatted for UI)
  const [claimableUsdKDisplay, setClaimableUsdKDisplay] = useState<string>("0.0000");

  // Track previous share balance to avoid attributing pre-existing global Farm pending
  // to a newly-created position right after the first deposit.
  const [prevSusdkBalUser, setPrevSusdkBalUser] = useState<bigint>(0n);

  const VAULT = process.env.NEXT_PUBLIC_STABLE_VAULT as string;
  const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const FARM = process.env.NEXT_PUBLIC_STABLE_FARM as string;
  const USDK = process.env.NEXT_PUBLIC_TOKEN_USDK as string;
  const USDC = process.env.NEXT_PUBLIC_TOKEN_USDC as string;
  const KTG_POINTS = process.env.NEXT_PUBLIC_KTG_POINTS as string | undefined;

  const usdcAbi = [
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address) view returns (uint256)",
  ];

  const usdkAbi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];

  // Vault (sUSDK shares)
  const susdkAbi = [
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function totalAssets() view returns (uint256)",
    "function convertToAssets(uint256 shares) view returns (uint256)",
  ];

  const controllerAbi = [
    "function depositUSDC(uint256 amount)",
    "function withdrawShares(uint256 shares)",
    "function harvestAndSync()",
  ];

  const farmAbi = [
    "function pendingRewards(address) view returns (uint256)",
    "function apr1e18() view returns (uint256)",
  ];
  const ktgPointsAbi = [
    "function points(address) view returns (uint256)",
    "function pendingEarned(address) view returns (uint256)",
    "function update(address user) returns (uint256)",
  ];

  const resetWalletState = () => {
    setSigner(null);
    setAddress("");
    // reset UI numbers
    setUsdkInVault("0");
    setSusdkBalance("0");
    setPendingRewardsOnchain("0");
    setPendingRewardsFarmEst("0");
    setPendingRewardsTotalEst("0");
    setApy("0");
    setUsdcBalance("0");
    setKtgPoints("0.0000");
    setPrevSusdkBalUser(0n);
  };

  useEffect(() => {
    const eth = (window as any)?.ethereum;
    if (typeof window === "undefined" || !eth) return;

    const p = new ethers.BrowserProvider(eth);
    setProvider(p);

    const syncAccounts = async (accounts?: string[]) => {
      const accs = accounts ?? (await p.send("eth_accounts", []));
      if (!accs || accs.length === 0) {
        resetWalletState();
        return;
      }
      const s = await p.getSigner();
      setSigner(s);
      setAddress(await s.getAddress());
    };

    // initial: don't force connect; just sync if already connected
    syncAccounts();

    const onAccountsChanged = (accounts: string[]) => {
      // when user disconnects all accounts -> reset
      // when user switches account -> update + refresh
      syncAccounts(accounts);
    };

    const onDisconnect = () => {
      resetWalletState();
    };

    eth.on?.("accountsChanged", onAccountsChanged);
    eth.on?.("disconnect", onDisconnect);

    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("disconnect", onDisconnect);
    };
  }, []);

  const connectWallet = async () => {
    const eth = (window as any)?.ethereum;
    if (!provider || !eth) return;
    try {
      await provider.send("eth_requestAccounts", []);
      const s = await provider.getSigner();
      setSigner(s);
      setAddress(await s.getAddress());
    } catch {
      // ignore
    }
  };

  const formatUnits = (value: bigint, decimals = 18) => {
    try {
      return ethers.formatUnits(value, decimals);
    } catch {
      return "0";
    }
  };

  const clearEstimates = () => {
    setPendingRewardsOnchain("0.0000");
    setPendingRewardsFarmEst("0.0000");
    setPendingRewardsTotalEst("0.0000");
    setKtgPoints("0.0000");
  };

  const { data: claimable, error: claimableError, refetch: refetchClaimable } = useVaultClaimableAssetsEthers(address || undefined);

  const refresh = async () => {
    if (!provider || !address) return;
    setLoading(true);
    clearEstimates();
    try {
      // Ensure wallet network matches Sepolia to avoid reading different chain (wallet) vs fixed RPC (hook)
      try {
        const net = await provider.getNetwork();
        setWalletChainId(Number(net.chainId));
      } catch {
        setWalletChainId(null);
      }

      const usdkC = new ethers.Contract(USDK, usdkAbi, provider);
      const susdkC = new ethers.Contract(VAULT, susdkAbi, provider);
      const farmC = new ethers.Contract(FARM, farmAbi, provider);
      const usdcC = new ethers.Contract(USDC, usdcAbi, provider);

      const [usdkDec, susdkDec, usdcDec, apr1e18Raw] = await Promise.all([
        usdkC.decimals(),
        susdkC.decimals(),
        usdcC.decimals(),
        farmC.apr1e18(),
      ]);

      // keep raw decimals for MAX buttons / txs
      setUsdcDecimals(Number(usdcDec));
      setSusdkDecimals(Number(susdkDec));

      const pointsC = KTG_POINTS ? new ethers.Contract(KTG_POINTS, ktgPointsAbi, provider) : null;

      const [
        usdkBalVault,
        susdkBalUser,
        susdkTotal,
        usdcBalUser,
        globalPendingFarm,
        onchainPoints,
        pendingPointsEarned,
      ] = await Promise.all([
        usdkC.balanceOf(VAULT),
        susdkC.balanceOf(address),
        susdkC.totalSupply(),
        usdcC.balanceOf(address),
        farmC.pendingRewards(CONTROLLER),
        pointsC ? pointsC.points(address) : Promise.resolve(0n),
        pointsC ? pointsC.pendingEarned(address) : Promise.resolve(0n),
      ]);

      // keep raw balances for MAX buttons
      setUsdcBalanceRaw(usdcBalUser);
      setSusdkBalanceRaw(susdkBalUser);

      // Best-effort: realize points accrual so UI shows up-to-date value
      try {
        if (pointsC) {
          await pointsC.update(address);
        }
      } catch {
        // ignore (may fail if not authorized on some deployments)
      }

      setUsdkInVault(
        Number(formatUnits(usdkBalVault, usdkDec)).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );

      const susdkBalUserNum = Number(formatUnits(susdkBalUser, susdkDec));
      const susdkTotalNum = Number(formatUnits(susdkTotal, susdkDec));

      setSusdkBalance(
        susdkBalUserNum.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );

      // Get fresh claimable directly from refetch return (avoid stale hook state)
      const freshClaimable = await refetchClaimable();
      const claimableNum = Number(freshClaimable.assetsFormatted || "0");

      // Show claimable in the top card from the same fresh read
      setClaimableUsdKDisplay(
        claimableNum.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );

      // Claimable USDK for THIS user (shares -> assets)
      setPendingRewardsOnchain(
        claimableNum.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );

      // Farm pending (global, controller stake) shown as monitoring metric only.
      // NOTE: This is NOT user-specific yield and must NOT be added to user totals.
      const globalPendingUsdk6 = (globalPendingFarm as bigint) / 1_000_000_000_000n;
      setPendingRewardsFarmEst(
        Number(formatUnits(globalPendingUsdk6, 6)).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );

      // Total pending for user == claimable (do not include global farm pending)
      setPendingRewardsTotalEst(
        claimableNum.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );

      setUsdcBalance(formatUnits(usdcBalUser, usdcDec));

      const aprPercent = Number(ethers.formatUnits(apr1e18Raw, 18));
      setApy(((aprPercent / 6) * 5).toFixed(2) + "%");

      const pointsTotal1e18 = (onchainPoints as bigint) + (pendingPointsEarned as bigint);
      setKtgPoints(
        Number(formatUnits(pointsTotal1e18, 18)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      );

      setPrevSusdkBalUser(susdkBalUser as bigint);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [provider, address]);

  const isUserRejected = (e: any) => {
    // ethers v6: code === 'ACTION_REJECTED' or error.code === 4001 or error.message includes 'denied'
    return (
      e?.code === 'ACTION_REJECTED' ||
      e?.code === 4001 ||
      e?.error?.code === 4001 ||
      (typeof e?.message === 'string' && e.message.toLowerCase().includes('denied'))
    );
  };

  const onDeposit = async (amountStr: string) => {
    if (!provider || !signer) return;
    setLoading(true);
    setStatus("Awaiting wallet confirmation...");
    try {
      const usdcC = new ethers.Contract(USDC, usdcAbi, signer);
      const dec = await usdcC.decimals();
      const amount = ethers.parseUnits(amountStr || "0", dec);
      await (await usdcC.approve(CONTROLLER, amount)).wait();
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.depositUSDC(amount)).wait();
      setStatus(null);
      setStatus("Deposit successful. Check your wallet.");
      clearEstimates();
      await refresh();
    } catch (e: any) {
      if (isUserRejected(e)) {
        setStatus("Transaction rejected by user.");
      } else if (e?.message?.toLowerCase().includes("cooldown")) {
        setStatus("You must wait before your next deposit (cooldown active). Try again later.");
      } else if (e?.message?.toLowerCase().includes("insufficient")) {
        setStatus("Insufficient balance for deposit.");
      } else {
        setStatus("Deposit failed. " + (e?.reason || e?.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const onWithdraw = async (sharesStr: string) => {
    if (!signer) return;
    setLoading(true);
    setStatus("Awaiting wallet confirmation...");
    try {
      const susdkC = new ethers.Contract(VAULT, susdkAbi, signer);
      const dec = await susdkC.decimals();
      const shares = ethers.parseUnits(sharesStr || "0", dec);
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.withdrawShares(shares)).wait();
      setStatus(null);
      setStatus("Withdraw successful. Check your wallet.");
      clearEstimates();
      await refresh();
    } catch (e: any) {
      if (isUserRejected(e)) {
        setStatus("Transaction rejected by user.");
      } else if (e?.message?.toLowerCase().includes("cooldown")) {
        setStatus("You must wait before your next withdrawal (cooldown active). Try again later.");
      } else if (e?.message?.toLowerCase().includes("insufficient")) {
        setStatus("Insufficient balance for withdrawal.");
      } else {
        setStatus("Withdraw failed. " + (e?.reason || e?.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const sanitizeNumericInput = (v: string) => {
    // remove thousands separators/spaces, keep digits and at most one decimal separator
    // accept both "." and "," as decimal separators, normalize to "." for consistency
    const s = (v || "").trim();
    const noSpaces = s.replace(/\s/g, "");

    // If both '.' and ',' exist, assume the last one is the decimal separator and
    // the other ones are thousands separators.
    const lastDot = noSpaces.lastIndexOf(".");
    const lastComma = noSpaces.lastIndexOf(",");
    const decIdx = Math.max(lastDot, lastComma);

    if (decIdx === -1) {
      return noSpaces.replace(/[^0-9]/g, "");
    }

    const intPart = noSpaces.slice(0, decIdx).replace(/[^0-9]/g, "");
    const fracPart = noSpaces.slice(decIdx + 1).replace(/[^0-9]/g, "");
    return fracPart.length ? `${intPart}.${fracPart}` : intPart;
  };

  const floorToDecimals = (valueStr: string, decimals: number) => {
    const cleaned = sanitizeNumericInput(valueStr);
    if (!cleaned) return "0";
    const [intPartRaw, fracRaw = ""] = cleaned.split(".");
    const intPart = (intPartRaw || "0").replace(/^0+(?=\d)/, "") || "0";
    const frac = fracRaw.replace(/[^0-9]/g, "").slice(0, Math.max(0, decimals));
    return decimals > 0 ? `${intPart}.${frac}` : intPart;
  };

  return (
    <PageShell
      title="Stable Vault"
      subtitle="Deposit USDC, receive USDK, earn yield in USDK and KTG airdrop points."
    >
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading || !address}
          className="rounded-md border border-slate-800 bg-slate-950/30 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {walletChainId !== null && walletChainId !== 11155111 && (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/40 text-red-200 p-3 text-sm">
          Rete non corretta: sei su chainId {walletChainId}. Passa a <b>Sepolia</b> per vedere i dati corretti.
        </div>
      )}

      {!address && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 text-amber-200 p-3 text-sm">
          Wallet not connected.
          <button className="ml-2 underline" onClick={connectWallet} disabled={loading}>
            Connect
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center">
          <img src="/sUSDK.svg" alt="sUSDK" className="h-8 w-8 rounded mb-2" />
          <div className="text-xs text-slate-400 font-semibold">Your Shares (sUSDK)</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{susdkBalance}</div>
        </Card>

        <Card className="flex flex-col items-center">
          <img src="/USDK.svg" alt="USDK" className="h-8 w-8 mb-2" />
          <div className="text-xs text-slate-400 font-semibold">Claimable USDK</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{claimableUsdKDisplay}</div>
        </Card>

        <Card className="flex flex-col items-center">
          <img src="/ktg.svg" alt="KTG" className="h-8 w-8 mb-2" />
          <div className="text-xs text-slate-400 font-semibold">KTG Airdrop Points</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{ktgPoints}</div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 flex flex-col items-center">
          <img src="/USDK.svg" alt="USDK" className="h-8 w-8 mb-2" />
          <div className="text-xs text-slate-400 font-semibold">Total USDK in Vault</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{usdkInVault}</div>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <div className="text-xs text-slate-400 font-semibold">APY</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{apy}</div>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">Actions</h2>

        <div className="mt-4 grid grid-cols-1 gap-6">
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              const v = (e.target as any).amount.value;
              onDeposit(v);
            }}
          >
            <label className="block text-sm font-medium text-slate-200" htmlFor="vault-deposit">
              Deposit USDC
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <input
                  id="vault-deposit"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  placeholder="USDC to deposit"
                  className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-slate-100 appearance-none pr-14"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-700 px-2 py-0.5 text-xs text-slate-200 hover:bg-slate-900"
                  onClick={(e) => {
                    const form = (e.currentTarget.closest("form") as any);
                    // Deposit MAX: use exact on-chain USDC balance (no format->parse round-trip)
                    if (form && form.amount) form.amount.value = ethers.formatUnits(usdcBalanceRaw, usdcDecimals);
                  }}
                >
                  Max
                </button>
              </div>
              <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50 w-28" disabled={loading}>
                Deposit
              </button>
            </div>
          </form>

          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              const v = (e.target as any).shares.value;
              onWithdraw(v);
            }}
          >
            <label className="block text-sm font-medium text-slate-200" htmlFor="vault-withdraw">
              Burn sUSDK • Get USDK
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <input
                  id="vault-withdraw"
                  name="shares"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  placeholder="Burn sUSDK"
                  className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-slate-100 appearance-none pr-14"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-700 px-2 py-0.5 text-xs text-slate-200 hover:bg-slate-900"
                  onClick={(e) => {
                    const form = (e.currentTarget.closest("form") as any);
                    // Burn MAX: use exact on-chain sUSDK balance (no format->parse round-trip)
                    if (form && form.shares) form.shares.value = ethers.formatUnits(susdkBalanceRaw, susdkDecimals);
                  }}
                >
                  Max
                </button>
              </div>
              <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50 w-28" disabled={loading}>
                Burn
              </button>
            </div>
          </form>
        </div>

        {status && (
          <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
            {status}
          </div>
        )}
      </Card>
    </PageShell>
  );
}
