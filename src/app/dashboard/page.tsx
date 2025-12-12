"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

export default function DashboardPage() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [susdkBalance, setSusdkBalance] = useState<string>("0.0");
  const [pendingRewards, setPendingRewards] = useState<string>("0.0000");
  const [ktgPoints, setKtgPoints] = useState<string>("0.0000");

  const VAULT = process.env.NEXT_PUBLIC_STABLE_VAULT as string;
  const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const KTG_POINTS = process.env.NEXT_PUBLIC_KTG_POINTS as string | undefined;

  const susdkAbi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"] as const;
  const controllerAbi = ["function pendingRewards(address) view returns (uint256)"] as const;
  const pointsAbi = [
    "function points(address) view returns (uint256)",
    "function pendingEarned(address) view returns (uint256)",
  ] as const;

  const shortAddr = (a: string) => (a && a.length > 10 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);

  const load = async () => {
    const eth = (window as any)?.ethereum;
    if (!eth) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(eth);
      const accounts: string[] = await provider.send("eth_accounts", []);
      if (!accounts?.[0]) {
        setAddress("");
        setSusdkBalance("0.0");
        setPendingRewards("0.0000");
        setKtgPoints("0.0000");
        return;
      }

      const addr = accounts[0];
      setAddress(addr);

      const susdkC = new ethers.Contract(VAULT, susdkAbi, provider);
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, provider);
      const pointsC = KTG_POINTS ? new ethers.Contract(KTG_POINTS, pointsAbi, provider) : null;

      const [susdkDec, susdkBal, pending, pts, ptsPend] = await Promise.all([
        susdkC.decimals() as Promise<number>,
        susdkC.balanceOf(addr) as Promise<bigint>,
        controllerC.pendingRewards(addr) as Promise<bigint>,
        pointsC ? (pointsC.points(addr) as Promise<bigint>) : Promise.resolve(0n),
        pointsC ? (pointsC.pendingEarned(addr) as Promise<bigint>) : Promise.resolve(0n),
      ]);

      setSusdkBalance(
        Number(ethers.formatUnits(susdkBal, susdkDec)).toLocaleString(undefined, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })
      );

      setPendingRewards(
        Number(ethers.formatUnits(pending, 6)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      );

      const totalPoints = pts + ptsPend;
      setKtgPoints(
        Number(ethers.formatUnits(totalPoints, 18)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      );
    } catch {
      // keep previous values
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const eth = (window as any)?.ethereum;
    const onAcc = () => load();
    eth?.on?.("accountsChanged", onAcc);
    return () => eth?.removeListener?.("accountsChanged", onAcc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell title="Dashboard" subtitle="Your position overview across the Stable Vault and points system.">
      {!address && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 text-amber-200 p-3 text-sm">
          Wallet not connected. Connect from the header to see your dashboard.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">Wallet</div>
          <div className="mt-1 text-base font-semibold text-slate-100">{address ? shortAddr(address) : "—"}</div>
          <div className="mt-3">
            <SecondaryButton disabled={loading} onClick={load}>
              Refresh
            </SecondaryButton>
          </div>
        </Card>

        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">USDK Staked (sUSDK)</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{susdkBalance}</div>
          <div className="mt-3">
            <Link href="/vault1">
              <SecondaryButton>Manage Vault</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">Yield earned (pending)</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{pendingRewards}</div>
          <div className="mt-3">
            <Link href="/vault1">
              <PrimaryButton>Open Vault</PrimaryButton>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="text-sm font-semibold text-slate-100">KTG Airdrop Points</div>
          <div className="mt-2 text-2xl font-semibold text-slate-100">{ktgPoints}</div>
          <div className="mt-2 text-sm text-slate-300">
            Includes both accumulated points and currently pending earned points.
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/airdrop">
              <SecondaryButton>View leaderboard</SecondaryButton>
            </Link>
            <Link href="/faucet">
              <SecondaryButton>Claim faucet (+10)</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Next steps</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>Verify wallet email on Faucet.</li>
            <li>Deposit USDC in Stable Vault v1.</li>
            <li>Follow proposals in Governance.</li>
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/governance">
              <SecondaryButton>Go to Governance</SecondaryButton>
            </Link>
            <Link href="/docs">
              <SecondaryButton>Read Docs</SecondaryButton>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="mt-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">Multi-vault dashboard</div>
            <div className="mt-2 text-sm text-slate-300">
              Vault 24 will appear here once their on-chain integration is enabled.
            </div>
          </div>
          <Badge tone="blue">Preview</Badge>
        </div>
        <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
          UI preview  on-chain integration coming next.
        </div>
      </Card>
    </PageShell>
  );
}
