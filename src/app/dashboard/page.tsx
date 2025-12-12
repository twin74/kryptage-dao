"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

type VaultRow = {
  id: 1 | 2 | 3 | 4;
  name: string;
  symbol: string;
  status: "Live" | "Preview";
  deposited: string;
  pendingYield: string;
  apy: string;
  href: string;
};

export default function DashboardPage() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Live (Vault 1 on-chain)
  const [v1Deposited, setV1Deposited] = useState<string>("0.0");
  const [v1Pending, setV1Pending] = useState<string>("0.0000");
  const [v1Apy, setV1Apy] = useState<string>("-");
  const [ktgPoints, setKtgPoints] = useState<string>("0.0000");

  const VAULT1 = process.env.NEXT_PUBLIC_STABLE_VAULT as string;
  const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const KTG_POINTS = process.env.NEXT_PUBLIC_KTG_POINTS as string | undefined;
  const FARM = process.env.NEXT_PUBLIC_STABLE_FARM as string | undefined;

  const susdkAbi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"] as const;
  const controllerAbi = ["function pendingRewards(address) view returns (uint256)"] as const;
  const farmAbi = ["function apr1e18() view returns (uint256)"] as const;
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
        setV1Deposited("0.0");
        setV1Pending("0.0000");
        setV1Apy("-");
        setKtgPoints("0.0000");
        return;
      }

      const addr = accounts[0];
      setAddress(addr);

      const susdkC = new ethers.Contract(VAULT1, susdkAbi, provider);
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, provider);
      const farmC = FARM ? new ethers.Contract(FARM, farmAbi, provider) : null;
      const pointsC = KTG_POINTS ? new ethers.Contract(KTG_POINTS, pointsAbi, provider) : null;

      const [susdkDec, susdkBal, pending, apr1e18Raw, pts, ptsPend] = await Promise.all([
        susdkC.decimals() as Promise<number>,
        susdkC.balanceOf(addr) as Promise<bigint>,
        controllerC.pendingRewards(addr) as Promise<bigint>,
        farmC ? (farmC.apr1e18() as Promise<bigint>) : Promise.resolve(0n),
        pointsC ? (pointsC.points(addr) as Promise<bigint>) : Promise.resolve(0n),
        pointsC ? (pointsC.pendingEarned(addr) as Promise<bigint>) : Promise.resolve(0n),
      ]);

      // APY (same computation used in /vault1)
      try {
        const aprPercent = Number(ethers.formatUnits(apr1e18Raw, 18));
        setV1Apy(((aprPercent / 6) * 5).toFixed(2) + " %");
      } catch {
        setV1Apy("-");
      }

      setV1Deposited(
        Number(ethers.formatUnits(susdkBal, susdkDec)).toLocaleString(undefined, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })
      );

      setV1Pending(
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

  const vaultRows = useMemo((): VaultRow[] => {
    return [
      {
        id: 1,
        name: "Stable Vault 1",
        symbol: "USDK",
        status: "Live",
        deposited: v1Deposited,
        pendingYield: v1Pending,
        apy: v1Apy,
        href: "/vault1",
      },
      {
        id: 2,
        name: "Stable Vault 2",
        symbol: "WBTC",
        status: "Preview",
        deposited: "-",
        pendingYield: "-",
        apy: "-",
        href: "/vault2",
      },
      {
        id: 3,
        name: "Stable Vault 3",
        symbol: "XAUT",
        status: "Preview",
        deposited: "-",
        pendingYield: "-",
        apy: "-",
        href: "/vault3",
      },
      {
        id: 4,
        name: "Stable Vault 4",
        symbol: "SPYON",
        status: "Preview",
        deposited: "-",
        pendingYield: "-",
        apy: "-",
        href: "/vault4",
      },
    ];
  }, [v1Deposited, v1Pending, v1Apy]);

  const totals = useMemo(() => {
    const sumDeposited = vaultRows.reduce((acc, v) => {
      const n = Number(String(v.deposited).replace(/,/g, ""));
      return acc + (Number.isFinite(n) ? n : 0);
    }, 0);

    const sumPending = vaultRows.reduce((acc, v) => {
      const n = Number(String(v.pendingYield).replace(/,/g, ""));
      return acc + (Number.isFinite(n) ? n : 0);
    }, 0);

    return {
      deposited: sumDeposited.toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 }),
      pending: sumPending.toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 4 }),
    };
  }, [vaultRows]);

  return (
    <PageShell title="Dashboard" subtitle="A complete portfolio overview across 4 vaults.">
      {!address && (
        <div className="rounded-md border border-amber-800 bg-amber-950/40 text-amber-200 p-3 text-sm">
          Wallet not connected. Connect from the header to see your dashboard.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">Wallet</div>
          <div className="mt-1 text-base font-semibold text-slate-100">{address ? shortAddr(address) : "-"}</div>
          <div className="mt-3">
            <SecondaryButton disabled={loading} onClick={load}>
              Refresh
            </SecondaryButton>
          </div>
        </Card>

        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">Total deposited</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{address ? totals.deposited : "-"}</div>
          <div className="mt-1 text-xs text-slate-400">Across all vaults</div>
        </Card>

        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">Pending yield</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{address ? totals.pending : "-"}</div>
          <div className="mt-1 text-xs text-slate-400">Claim/compound per-vault</div>
        </Card>

        <Card className="flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold">KTG points</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{address ? ktgPoints : "-"}</div>
          <div className="mt-3">
            <Link href="/airdrop">
              <SecondaryButton>Open Airdrop</SecondaryButton>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">Vaults overview</div>
            <div className="mt-2 text-sm text-slate-300">All vaults in one place. Vault 1 is live; others are shown as preview.</div>
          </div>
          <Badge tone="blue">Portfolio</Badge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="py-2 pr-4">Vault</th>
                <th className="py-2 pr-4">Asset</th>
                <th className="py-2 pr-4">Deposited</th>
                <th className="py-2 pr-4">Pending yield</th>
                <th className="py-2 pr-4">APY</th>
                <th className="py-2 pr-0 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {vaultRows.map((v) => (
                <tr key={v.id} className="border-t border-slate-800">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-100">{v.name}</span>
                      <Badge tone={v.status === "Live" ? "green" : "blue"}>{v.status}</Badge>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-300 font-mono">{v.symbol}</td>
                  <td className="py-3 pr-4 text-slate-200">{address ? v.deposited : "-"}</td>
                  <td className="py-3 pr-4 text-slate-200">{address ? v.pendingYield : "-"}</td>
                  <td className="py-3 pr-4 text-slate-200">{v.apy}</td>
                  <td className="py-3 pr-0 text-right">
                    <Link href={v.href}>
                      <SecondaryButton>Open</SecondaryButton>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
          Note: Only Vault 1 numbers are currently sourced from on-chain contracts. Vault 24 are displayed as UI preview.
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm font-semibold text-slate-100">Actions</div>
          <div className="mt-2 text-sm text-slate-300">Deposit, withdraw and compound from each vault page.</div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/vault">
              <PrimaryButton className="w-full">Go to Vaults</PrimaryButton>
            </Link>
            <Link href="/swap">
              <SecondaryButton className="w-full">Swap</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Governance</div>
          <div className="mt-2 text-sm text-slate-300">Follow proposals and future parameter updates.</div>
          <div className="mt-4">
            <Link href="/governance">
              <SecondaryButton className="w-full">Open Governance</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Docs</div>
          <div className="mt-2 text-sm text-slate-300">Read the protocol overview and architecture notes.</div>
          <div className="mt-4">
            <Link href="/docs">
              <SecondaryButton className="w-full">Open Docs</SecondaryButton>
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
