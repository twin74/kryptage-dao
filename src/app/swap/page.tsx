"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

type TokenInfo = {
  symbol: "USDK" | "USDC";
  address: string;
  decimals: number;
};

function sanitizeNumericInput(raw: string) {
  // Normalize user input (accept both 1,23 and 1.23 and ignore thousands separators)
  const s = (raw || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/\.(?=.*\.)/g, "")
    .replace(/,(?=\d{3}(\D|$))/g, "");
  const parts = s.split(",");
  if (parts.length === 1) return s;
  const intPart = parts[0];
  const fracPart = parts.slice(1).join("");
  return fracPart.length ? `${intPart}.${fracPart}` : intPart;
}

function clampRawAmountToBalance(raw: bigint, balance: bigint) {
  if (balance <= 0n) return 0n;
  if (raw <= balance) return raw;
  return balance;
}

function friendlySwapError(e: any): string {
  const msg: string = String(e?.shortMessage || e?.reason || e?.message || "");
  const data: string = String(e?.data || e?.error?.data || e?.info?.error?.data || "");

  // Custom error selector for OpenZeppelin ERC20InsufficientBalance(address,uint256,uint256)
  if ((data && data.startsWith("0xe450d38c")) || msg.toLowerCase().includes("insufficientbalance")) {
    return "Insufficient funds";
  }

  // Allowance issues (some tokens revert with a string)
  if (/insufficient_allowance|insufficient allowance/i.test(msg)) {
    return "Approve required";
  }

  // User rejected / cancelled
  if ((e?.code === 4001) || /user rejected|user denied|rejected the request/i.test(msg)) {
    return "Transaction rejected";
  }

  // Gas estimation reverts (generic)
  if (/estimategas|cannot estimate gas|call_exception/i.test(msg)) {
    return "Transaction would fail";
  }

  // Fallback with minimal diagnostics
  const code = e?.code ? String(e.code) : "";
  const sm = e?.shortMessage ? String(e.shortMessage) : "";
  const tail = [code && `code=${code}`, sm && `msg=${sm}`].filter(Boolean).join(" ");
  return tail ? `Swap failed (${tail})` : "Swap failed";
}

export default function SwapPage() {
  const USDK = process.env.NEXT_PUBLIC_TOKEN_USDK as string;
  const USDC = process.env.NEXT_PUBLIC_TOKEN_USDC as string;
  const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [approving, setApproving] = useState(false);

  const [from, setFrom] = useState<TokenInfo["symbol"]>("USDC");
  const [amountIn, setAmountIn] = useState<string>("");

  const to = from === "USDC" ? "USDK" : "USDC";

  const [feeBps, setFeeBps] = useState<number>(0);
  const [previewGrossOut, setPreviewGrossOut] = useState<string>("0");
  const [previewFeeOut, setPreviewFeeOut] = useState<string>("0");
  const [previewNetOut, setPreviewNetOut] = useState<string>("0");

  const [usdcBalRaw, setUsdcBalRaw] = useState<bigint>(0n);
  const [usdkBalRaw, setUsdkBalRaw] = useState<bigint>(0n);

  const tokens = useMemo((): Record<string, TokenInfo> => {
    return {
      // Sepolia USDC in this project is 6 decimals (USDT-style); using 18 breaks parse/format and can prevent tx flows.
      USDC: { symbol: "USDC", address: USDC, decimals: 18 },
      USDK: { symbol: "USDK", address: USDK, decimals: 6 },
    };
  }, [USDC, USDK]);

  const connectIfPossible = async () => {
    const eth = (window as any)?.ethereum;
    if (!eth) return;
    try {
      const provider = new ethers.BrowserProvider(eth);
      const accounts: string[] = await provider.send("eth_accounts", []);
      if (accounts?.[0]) setAddress(accounts[0]);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    connectIfPossible();
    const eth = (window as any)?.ethereum;
    const onAcc = (accs: string[]) => setAddress(accs?.[0] || "");
    eth?.on?.("accountsChanged", onAcc);
    return () => eth?.removeListener?.("accountsChanged", onAcc);
  }, []);

  const controllerAbi = [
    "function swapUSDCForUSDK(uint256 usdcIn) returns (uint256 usdkOut)",
    "function swapUSDKForUSDC(uint256 usdkIn) returns (uint256 usdcNetOut)",
    "function swapFeeBps() view returns (uint256)",
    "function previewSwapUSDKForUSDC(uint256 usdkIn) view returns (uint256 usdcNetOut, uint256 feeUsdc, uint256 usdcGrossOut)",
  ];

  const erc20Abi = [
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
  ];

  const flip = () => {
    setFrom(to);
    setAmountIn("");
    setStatus(null);
    setPreviewGrossOut("0");
    setPreviewFeeOut("0");
    setPreviewNetOut("0");
  };

  const loadFeeBps = async () => {
    const eth = (window as any)?.ethereum;
    if (!eth) return;
    try {
      const provider = new ethers.BrowserProvider(eth);
      const c = new ethers.Contract(CONTROLLER, controllerAbi, provider);
      const bps: bigint = await c.swapFeeBps();
      setFeeBps(Number(bps));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void loadFeeBps();
  }, [CONTROLLER]);

  const loadBalances = async () => {
    const eth = (window as any)?.ethereum;
    if (!eth || !address) return;
    try {
      const provider = new ethers.BrowserProvider(eth);
      const usdc = new ethers.Contract(USDC, erc20Abi, provider);
      const usdk = new ethers.Contract(USDK, erc20Abi, provider);
      const [bUsdc, bUsdk]: [bigint, bigint] = await Promise.all([
        usdc.balanceOf(address),
        usdk.balanceOf(address),
      ]);
      setUsdcBalRaw(bUsdc);
      setUsdkBalRaw(bUsdk);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void loadBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, USDC, USDK]);

  const updatePreview = async () => {
    try {
      const cleaned = sanitizeNumericInput(amountIn);
      if (!cleaned || Number(cleaned) <= 0) {
        setPreviewGrossOut("0");
        setPreviewFeeOut("0");
        setPreviewNetOut("0");
        return;
      }

      // Only show fee breakdown on exit (USDK -> USDC)
      if (from !== "USDK") {
        setPreviewGrossOut("0");
        setPreviewFeeOut("0");
        setPreviewNetOut(cleaned);
        return;
      }

      const eth = (window as any)?.ethereum;
      if (!eth) return;
      const provider = new ethers.BrowserProvider(eth);
      const c = new ethers.Contract(CONTROLLER, controllerAbi, provider);

      const usdkIn = ethers.parseUnits(cleaned, tokens.USDK.decimals);
      const [netOut, feeUsdc, grossOut]: [bigint, bigint, bigint] = await c.previewSwapUSDKForUSDC(usdkIn);

      setPreviewGrossOut(ethers.formatUnits(grossOut, tokens.USDC.decimals));
      setPreviewFeeOut(ethers.formatUnits(feeUsdc, tokens.USDC.decimals));
      setPreviewNetOut(ethers.formatUnits(netOut, tokens.USDC.decimals));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void updatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountIn, from, feeBps]);

  const ensureAllowance = async (tokenAddr: string, owner: string, spender: string, needed: bigint, signer: ethers.Signer) => {
    console.debug("[swap] ensureAllowance:start", { tokenAddr, owner, spender, needed: needed.toString() });

    const t = new ethers.Contract(tokenAddr, erc20Abi, signer);
    const allowance: bigint = await t.allowance(owner, spender);

    console.debug("[swap] ensureAllowance:allowance", {
      allowance: allowance.toString(),
      needed: needed.toString(),
      ok: allowance >= needed,
    });

    if (allowance >= needed) return;

    setApproving(true);
    setStatus("Approve in wallet...");
    console.debug("[swap] ensureAllowance:approve:request");

    // Approve max and wait deterministically for mining
    const approveTx = await t.approve(spender, ethers.MaxUint256);
    console.debug("[swap] ensureAllowance:approve:sent", { hash: approveTx.hash });

    const provider = signer.provider as ethers.Provider | null;
    if (provider) {
      await provider.waitForTransaction(approveTx.hash);
    } else {
      await approveTx.wait();
    }

    console.debug("[swap] ensureAllowance:approve:mined", { hash: approveTx.hash });

    // Small delay helps some wallets/providers propagate state
    await new Promise((r) => setTimeout(r, 350));

    setApproving(false);
  };

  const swap = async () => {
    const eth = (window as any)?.ethereum;
    console.debug("[swap] click", { from, to, amountIn });

    if (!eth) {
      setStatus("Connect wallet in header");
      console.debug("[swap] no window.ethereum");
      return;
    }
    if (!CONTROLLER) {
      setStatus("Missing NEXT_PUBLIC_STABLE_CONTROLLER");
      console.debug("[swap] missing controller env");
      return;
    }

    const cleaned = sanitizeNumericInput(amountIn);
    if (!cleaned || Number(cleaned) <= 0) {
      setStatus("Enter an amount");
      console.debug("[swap] invalid amount", { cleaned });
      return;
    }

    setLoading(true);
    setStatus("Awaiting wallet confirmation...");

    try {
      console.debug("[swap] provider:init");
      const provider = new ethers.BrowserProvider(eth);

      console.debug("[swap] signer:get");
      const signer = await provider.getSigner();

      console.debug("[swap] signer:address:get");
      const user = await signer.getAddress();
      console.debug("[swap] user", { user });

      const controller = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      console.debug("[swap] controller", { CONTROLLER });

      if (from === "USDC") {
        console.debug("[swap] path USDC->USDK", { decimals: tokens.USDC.decimals });
        const usdcIn = ethers.parseUnits(cleaned, tokens.USDC.decimals);
        const safeIn = clampRawAmountToBalance(usdcIn, usdcBalRaw);
        console.debug("[swap] usdcIn", { usdcIn: usdcIn.toString(), safeIn: safeIn.toString(), bal: usdcBalRaw.toString() });

        if (safeIn === 0n) {
          setStatus("Insufficient USDC balance");
          console.debug("[swap] insufficient USDC");
          return;
        }

        setStatus("Checking allowance...");
        await ensureAllowance(USDC, user, CONTROLLER, safeIn, signer);

        setStatus("Confirm swap in wallet...");
        console.debug("[swap] swapUSDCForUSDK:send", { safeIn: safeIn.toString() });
        const tx = await controller.swapUSDCForUSDK(safeIn);
        console.debug("[swap] swapUSDCForUSDK:sent", { hash: tx.hash });
        await tx.wait();
        console.debug("[swap] swapUSDCForUSDK:mined", { hash: tx.hash });

        setStatus("Swap successful (USDC → USDK)");
      } else {
        console.debug("[swap] path USDK->USDC", { decimals: tokens.USDK.decimals });
        const usdkIn = ethers.parseUnits(cleaned, tokens.USDK.decimals);
        const maxSpendable = usdkBalRaw > 1n ? usdkBalRaw - 1n : usdkBalRaw;
        const safeIn = usdkIn > maxSpendable ? maxSpendable : usdkIn;
        console.debug("[swap] usdkIn", { usdkIn: usdkIn.toString(), safeIn: safeIn.toString(), bal: usdkBalRaw.toString() });

        if (safeIn === 0n) {
          setStatus("Insufficient USDK balance");
          console.debug("[swap] insufficient USDK");
          return;
        }

        setStatus("Checking allowance...");
        console.debug("[swap] ensureAllowance USDK:start");
        await ensureAllowance(USDK, user, CONTROLLER, safeIn, signer);
        console.debug("[swap] ensureAllowance USDK:done");

        setStatus("Confirm swap in wallet...");
        console.debug("[swap] swapUSDKForUSDC:send", { safeIn: safeIn.toString() });
        const tx = await controller.swapUSDKForUSDC(safeIn);
        console.debug("[swap] swapUSDKForUSDC:sent", { hash: tx.hash });
        await tx.wait();
        console.debug("[swap] swapUSDKForUSDC:mined", { hash: tx.hash });

        setStatus("Swap successful (USDK → USDC)");
      }

      setAmountIn("");
      await loadFeeBps();
    } catch (e: any) {
      console.error("[swap] failed", e);
      setStatus(friendlySwapError(e));
    } finally {
      setApproving(false);
      setLoading(false);
    }
  };

  const onMax = async () => {
    if (!address) return;
    await loadBalances();
    const t = tokens[from];

    if (from === "USDK") {
      // Keep 1 minimal unit to avoid insufficient-balance reverts caused by UI rounding or strict checks.
      const raw = usdkBalRaw > 1n ? usdkBalRaw - 1n : usdkBalRaw;
      setAmountIn(ethers.formatUnits(raw, t.decimals));
      return;
    }

    const raw = usdcBalRaw;
    setAmountIn(ethers.formatUnits(raw, t.decimals));
  };

  const feePct = (feeBps / 100).toFixed(2);

  return (
    <PageShell title="Swap" subtitle="Swap between USDC and USDK (1:1).">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-100">USDK / USDC</div>
              <div className="mt-1 text-sm text-slate-300">Fixed 1:1 peg swap (USDK is minted/burned by the controller).</div>
            </div>
            <Badge tone="green">Live</Badge>
          </div>

          <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
            Liquidity/Ops fee: <b>{feePct}%</b> (applied only on USDK → USDC).
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">From</div>
                <div className="text-xs text-slate-400 font-mono">{from}</div>
              </div>
              <div className="relative mt-2">
                <input
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  inputMode="decimal"
                  placeholder={`Amount in ${from}`}
                  className="w-full rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 pr-16 text-slate-100 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => void onMax()}
                  disabled={!address || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-800 bg-slate-950/40 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900 disabled:opacity-50"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={flip}
                aria-label="Flip swap direction"
                title="Flip USDC ↔ USDK"
                className="rounded-full border border-slate-800 bg-slate-950/30 px-3 py-1 text-sm text-slate-200 hover:bg-slate-900"
              >
                ↔
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">To</div>
                <div className="text-xs text-slate-400 font-mono">{to}</div>
              </div>

              <div className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 text-slate-200">
                {from === "USDK" ? (
                  <div className="space-y-1">
                    <div>
                      Receive: <b>{previewNetOut}</b> {to}
                    </div>
                    <div className="text-xs text-slate-400">
                      Gross: {previewGrossOut} {to}  Fee: {previewFeeOut} {to}
                    </div>
                  </div>
                ) : (
                  <div>
                    Receive: <b>{(() => {
                      const cleaned = sanitizeNumericInput(amountIn);
                      if (!cleaned || Number(cleaned) <= 0) return "0";
                      try {
                        const usdcIn = ethers.parseUnits(cleaned, tokens.USDC.decimals);
                        // 1:1 in value; controller scales internally, but UI should show correct decimals on output
                        const usdkOut = ethers.formatUnits(usdcIn, tokens.USDK.decimals);
                        return usdkOut;
                      } catch {
                        return "0";
                      }
                    })()}</b> {to}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <SecondaryButton disabled>{address ? "Wallet connected" : "Connect wallet in header"}</SecondaryButton>
              <PrimaryButton onClick={swap} disabled={loading || approving || !address}>
                {approving ? "Approving..." : loading ? "Swapping..." : "Swap"}
              </PrimaryButton>
            </div>

            {status && <div className="text-sm text-slate-300">{status}</div>}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Notes</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>USDC ↔ USDK swaps are fixed 1:1 in value.</li>
            <li>USDK ↔ USDC includes a small liquidity/ops fee.</li>
          </ul>
          <div className="mt-4">
            <Link href="/vault" className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900">
              Browse vaults
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
