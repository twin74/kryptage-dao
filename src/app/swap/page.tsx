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

export default function SwapPage() {
  const USDK = process.env.NEXT_PUBLIC_TOKEN_USDK as string;
  const USDC = process.env.NEXT_PUBLIC_TOKEN_USDC as string;

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [from, setFrom] = useState<TokenInfo["symbol"]>("USDC");
  const [amountIn, setAmountIn] = useState<string>("");

  const to = from === "USDC" ? "USDK" : "USDC";

  const tokens = useMemo((): Record<string, TokenInfo> => {
    return {
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

  const flip = () => {
    setFrom(to);
    setAmountIn("");
    setStatus(null);
  };

  const previewOut = () => {
    // Pure UI preview for now: USDK has 6 decimals, USDC has 18.
    // Convert assuming 1:1 value.
    try {
      const cleaned = sanitizeNumericInput(amountIn);
      const n = Number(cleaned || "0");
      if (!Number.isFinite(n) || n <= 0) return "0";
      // 1:1
      return n.toLocaleString(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 0 });
    } catch {
      return "0";
    }
  };

  const swap = async () => {
    // No swap contract/router integrated yet.
    setStatus("UI preview — on-chain integration coming next.");
  };

  return (
    <PageShell title="Swap" subtitle="Swap between USDC and USDK (1:1).">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-100">USDK / USDC</div>
              <div className="mt-1 text-sm text-slate-300">
                Simple stable swap UI. Routing and on-chain execution will be wired next.
              </div>
            </div>
            <Badge tone="blue">Preview</Badge>
          </div>

          <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
            UI preview — on-chain integration coming next.
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">From</div>
                <div className="text-xs text-slate-400 font-mono">{from}</div>
              </div>
              <input
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                inputMode="decimal"
                placeholder={`Amount in ${from}`}
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={flip}
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
                {previewOut()} {to}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <SecondaryButton disabled>{address ? "Wallet connected" : "Connect wallet in header"}</SecondaryButton>
              <PrimaryButton onClick={swap} disabled={loading}>
                Swap (coming soon)
              </PrimaryButton>
            </div>

            {status && <div className="text-sm text-slate-300">{status}</div>}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Notes</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>Pairs supported: USDK/USDC only.</li>
            <li>Rate shown assumes 1:1 for UI preview.</li>
            <li>On-chain swap integration will be added next.</li>
          </ul>
          <div className="mt-4">
            <Link href="/vault" className="text-sm text-blue-400 hover:text-blue-300">
              Browse vaults 
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
