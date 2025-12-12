"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

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

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/airdrop/leaderboard?limit=10", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load leaderboard");
        if (alive) setEntries((json?.entries || []) as Entry[]);
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load leaderboard");
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Airdrop</h1>
      <p className="text-slate-300">
        Connect your wallet and stay tuned for upcoming airdrop campaigns. This page will display eligibility and claim options when available.
      </p>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leaderboard (Top 10)</h2>
          <button
            className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
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
            }}
          >
            Refresh
          </button>
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
          <h3 className="text-base font-semibold">Kryptage Newsletter</h3>
          <p className="mt-1 text-sm text-slate-300">
            Subscribe to the Kryptage newsletter to get platform updates, upcoming events, points announcements and the token launch timeline.
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Subscribing to the newsletter adds <span className="font-mono">+10</span> points.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              disabled
            />
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              disabled
              title="Coming soon"
            >
              Subscribe (coming soon)
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-400">Newsletter signup integration coming soon.</div>
        </div>
      </div>
    </div>
  );
}
