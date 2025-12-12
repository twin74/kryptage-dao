"use client";

import { ethers } from "ethers";
import { Card, PageShell, SecondaryButton } from "@/components/UI";
import { useEffect, useState } from "react";

type Entry = {
  wallet: string;
  points1e18: string;
};

function shortAddr(a: string) {
  return a && a.length === 42 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

export default function AirdropPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/airdrop/leaderboard?limit=10", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load leaderboard");
      setEntries((json?.entries || []) as Entry[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      await load();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell
      title="Airdrop"
      subtitle="Track your points and follow the leaderboard. Campaign eligibility and claiming will be available here."
    >
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leaderboard (Top 10)</h2>
          <SecondaryButton disabled={loading} onClick={load}>
            Refresh
          </SecondaryButton>
        </div>

        {error && <div className="mt-3 rounded-md border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</div>}

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr className="text-left text-slate-200">
                <th className="px-4 py-2 w-16">#</th>
                <th className="px-4 py-2">Wallet</th>
                <th className="px-4 py-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-3 text-slate-300" colSpan={3}>
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && entries.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-slate-300" colSpan={3}>
                    No entries.
                  </td>
                </tr>
              )}
              {!loading &&
                entries.map((e, idx) => {
                  const points = (() => {
                    try {
                      return Number(ethers.formatUnits(BigInt(e.points1e18 || "0"), 18)).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                        minimumFractionDigits: 4,
                      });
                    } catch {
                      return "0.0000";
                    }
                  })();

                  return (
                    <tr key={e.wallet} className="border-t border-slate-800">
                      <td className="px-4 py-2 text-slate-300">{idx + 1}</td>
                      <td className="px-4 py-2 font-mono text-slate-200">{shortAddr(e.wallet)}</td>
                      <td className="px-4 py-2 text-right text-slate-200">{points}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-base font-semibold">Kryptage Newsletter</h3>
              <p className="mt-1 text-sm text-slate-300">
                Subscribe to the Kryptage newsletter to get platform updates, upcoming events, points announcements and the token launch timeline.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                  disabled
                />
                <SecondaryButton disabled className="sm:w-56">
                  Subscribe (coming soon)
                </SecondaryButton>
              </div>
              <div className="mt-2 text-xs text-slate-400">UI preview  on-chain integration coming next.</div>
            </div>

            <div className="md:col-span-1">
              <div className="h-full rounded-md border border-slate-800 bg-slate-900/30 p-3">
                <div className="text-sm font-semibold text-slate-100">KTG Points</div>
                <div className="mt-1 text-sm text-slate-300">
                  Current: <span className="font-mono">0.0000</span>
                </div>
                <div className="mt-1 text-sm text-slate-200">Subscribing to the newsletter adds +10 points.</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
