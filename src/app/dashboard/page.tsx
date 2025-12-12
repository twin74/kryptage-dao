"use client";
import { usePendingRewards } from "@/hooks/usePendingRewards";

export default function DashboardPage() {
  const { pendingRewards, isLoading } = usePendingRewards();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-300">User deposits and yields overview will appear here.</p>
      <div className="mt-4">
        <span className="font-semibold">Rewards claimabili:</span>{" "}
        {isLoading ? "Loading..." : (pendingRewards ? Number(pendingRewards) / 1e6 : 0)} USDK
      </div>
    </section>
  );
}
