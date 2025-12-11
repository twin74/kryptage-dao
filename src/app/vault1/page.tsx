"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

export default function Vault1Page() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [usdkInVault, setUsdkInVault] = useState<string>("0");
  const [susdkBalance, setSusdkBalance] = useState<string>("0");
  const [pendingRewards, setPendingRewards] = useState<string>("0");
  const [apy, setApy] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");

  const VAULT = process.env.NEXT_PUBLIC_STABLE_VAULT as string;
  const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const FARM = process.env.NEXT_PUBLIC_STABLE_FARM as string;
  const USDK = process.env.NEXT_PUBLIC_TOKEN_USDK as string;
  const USDC = process.env.NEXT_PUBLIC_TOKEN_USDC as string;

  const usdcAbi = [
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
  ];
  const usdkAbi = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];
  const susdkAbi = [
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];
  const controllerAbi = [
    "function depositUSDC(uint256 amount)",
    "function withdrawShares(uint256 shares)",
    "function compoundGlobal()",
  ];
  const farmAbi = [
    "function pendingRewards() view returns (uint256)",
    "function stake(uint256 amount)",
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(p);
      p.send("eth_requestAccounts", []).then(async () => {
        const s = await p.getSigner();
        setSigner(s);
        setAddress(await s.getAddress());
      });
    }
  }, []);

  const formatUnits = (value: bigint, decimals = 18) => {
    try { return ethers.formatUnits(value, decimals); } catch { return "0"; }
  };

  const refresh = async () => {
    if (!provider || !address) return;
    setLoading(true);
    try {
      const usdkC = new ethers.Contract(USDK, usdkAbi, provider);
      const susdkC = new ethers.Contract(VAULT, susdkAbi, provider);
      const farmC = new ethers.Contract(FARM, farmAbi, provider);
      const usdcC = new ethers.Contract(USDC, usdcAbi, provider);

      const [usdkDec, susdkDec, usdcDec] = await Promise.all([
        usdkC.decimals(),
        susdkC.decimals(),
        usdcC.decimals(),
      ]);
      const [usdkBalVault, susdkBalUser, rewards, usdcBalUser] = await Promise.all([
        usdkC.balanceOf(VAULT),
        susdkC.balanceOf(address),
        farmC.pendingRewards(),
        usdcC.balanceOf(address),
      ]);
      setUsdkInVault(formatUnits(usdkBalVault, usdkDec));
      setSusdkBalance(formatUnits(susdkBalUser, susdkDec));
      setPendingRewards(formatUnits(rewards, 18));
      setUsdcBalance(formatUnits(usdcBalUser, usdcDec));
      // Simple APY placeholder: assume rewards per day from pending ~ linear → apy = (rewards * 365) / stake
      // In assenza di stake totale, mostrare un valore indicativo
      setApy("—");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [provider, address]);

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

  const onCompound = async () => {
    if (!signer) return;
    setLoading(true);
    setStatus("Awaiting wallet confirmation...");
    try {
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.compoundGlobal()).wait();
      setStatus(null);
      setStatus("Compound successful.");
      await refresh();
    } catch (e: any) {
      if (isUserRejected(e)) {
        setStatus("Transaction rejected by user.");
      } else {
        setStatus("Compound failed. " + (e?.reason || e?.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Stable Vault</h1>
      <p className="text-sm text-white mb-2">Deposit USDC, receive U$DK, earn yield in U$DK and KTG airdrop points.</p>

      <div className="flex gap-4 w-full">
        {/* sU$DK box */}
        <div className="rounded-xl border p-6 bg-white flex flex-col items-center w-1/3 min-w-[120px]">
          <img src="/USDK.svg" alt="sU$DK" className="h-8 w-8 rounded mb-2" />
          <div className="text-xs text-gray-800">Your sU$DK</div>
          <div className="text-xl font-semibold text-gray-900">{susdkBalance}</div>
        </div>
        {/* Yield box */}
        <div className="rounded-xl border p-6 bg-white flex flex-col items-center w-1/3 min-w-[120px]">
          <img src="/USDK.svg" alt="U$DK" className="h-8 w-8 rounded mb-2" />
          <div className="text-xs text-gray-800">Yield earned (pending)</div>
          <div className="text-xl font-semibold text-gray-900">{pendingRewards}</div>
        </div>
        {/* KTG Airdrop Points box */}
        <div className="rounded-xl border p-6 bg-white flex flex-col items-center w-1/3 min-w-[120px]">
          <div className="text-xs text-gray-800">KTG Airdrop Points</div>
          <div className="text-xl font-semibold text-gray-900">0</div>
        </div>
      </div>

      <div className="flex gap-4 w-full mt-4">
        {/* U$DK in Vault box - set to w-2/3 min-w-[240px] */}
        <div className="rounded-xl border p-6 bg-white flex flex-col items-center w-2/3 min-w-[240px]">
          <img src="/USDK.svg" alt="U$DK" className="h-8 w-8 rounded mb-2" />
          <div className="text-xs text-gray-800">U$DK in Vault</div>
          <div className="text-xl font-semibold text-gray-900">{usdkInVault}</div>
        </div>
        {/* APY box - same as KTG Airdrop Points */}
        <div className="rounded-xl border p-6 bg-white flex flex-col items-center w-1/3 min-w-[120px]">
          <div className="text-xs text-gray-800">APY</div>
          <div className="text-xl font-semibold text-gray-900">{apy}</div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-lg font-semibold text-white">Actions</h2>
        <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const v = (e.target as any).amount.value; onDeposit(v); }}>
          <label className="block text-sm font-medium text-white" htmlFor="vault-deposit">
            Deposit USDC
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <input id="vault-deposit" name="amount" type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="USDC to deposit" className="w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-50 appearance-none pr-14" />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border px-2 py-0.5 text-xs text-gray-900" onClick={(e) => { const form = (e.currentTarget.closest('form') as any); if (form && form.amount) form.amount.value = usdcBalance; }}>Max</button>
            </div>
            <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50" disabled={loading}>Deposit</button>
          </div>
        </form>
        <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const v = (e.target as any).shares.value; onWithdraw(v); }}>
          <label className="block text-sm font-medium text-white" htmlFor="vault-withdraw">
            Withdraw sU$DK
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <input id="vault-withdraw" name="shares" type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="sU$DK to withdraw" className="w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-50 appearance-none pr-14" />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border px-2 py-0.5 text-xs text-gray-900" onClick={(e) => { const form = (e.currentTarget.closest('form') as any); if (form && form.shares) form.shares.value = susdkBalance; }}>Max</button>
            </div>
            <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50" disabled={loading}>Withdraw</button>
          </div>
        </form>
      </div>

      {/* Status/feedback area, armonizzato con faucet */}
      {status && (
        <div
          className={
            `mt-4 rounded-md border p-3 text-sm ` +
            (status.includes("success")
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : status.includes("error") || status.includes("failed")
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-gray-300 bg-gray-50 text-gray-800")
          }
        >
          {status}
        </div>
      )}
    </div>
  );
}
