"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

type ProposalStatus = "Active" | "Pending" | "Succeeded" | "Defeated" | "Executed";

type Proposal = {
  id: string;
  title: string;
  summary: string;
  status: ProposalStatus;
  start: string;
  end: string;
  forPct: number;
  againstPct: number;
  quorumPct: number;
  proposer: string;
};

function shortAddr(a: string) {
  return a && a.length > 10 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

function statusTone(status: ProposalStatus) {
  switch (status) {
    case "Active":
      return "blue";
    case "Succeeded":
      return "green";
    case "Executed":
      return "green";
    case "Defeated":
      return "red";
    case "Pending":
      return "amber";
    default:
      return "neutral";
  }
}

export default function GovernancePage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ProposalStatus | "All">("All");

  // Mock data (UI-first). Later we can wire to on-chain / subgraph.
  const proposals: Proposal[] = useMemo(
    () => [
      {
        id: "KIP-1",
        title: "Enable Stable Vault v1 incentives",
        summary: "Route a portion of protocol revenue to boost stable vault rewards for the next 30 days.",
        status: "Active",
        start: "Dec 12",
        end: "Dec 15",
        forPct: 71,
        againstPct: 29,
        quorumPct: 54,
        proposer: "0xAbC00c1AD0C57878d116dFcE50172055557Af97B",
      },
      {
        id: "KIP-2",
        title: "Update KTG Points parameters",
        summary: "Adjust minimum update interval and bonus distribution rules to reduce friction for new users.",
        status: "Pending",
        start: "Dec 16",
        end: "Dec 18",
        forPct: 0,
        againstPct: 0,
        quorumPct: 0,
        proposer: "0x2062ed5315ac15eaeb3d10fd7c02767d0454803a",
      },
      {
        id: "KIP-3",
        title: "Add new collateral asset: XAUT",
        summary: "List XAUT collateral with conservative LTV/threshold settings and enable borrowing.",
        status: "Succeeded",
        start: "Dec 01",
        end: "Dec 04",
        forPct: 88,
        againstPct: 12,
        quorumPct: 67,
        proposer: "0xa77bc75F3d312136a8bA425D4f92742f2C03DA84",
      },
    ],
    []
  );

  const visible = proposals.filter((p) => {
    const okStatus = filter === "All" ? true : p.status === filter;
    const qq = q.trim().toLowerCase();
    const okQuery = !qq ? true : p.title.toLowerCase().includes(qq) || p.summary.toLowerCase().includes(qq) || p.id.toLowerCase().includes(qq);
    return okStatus && okQuery;
  });

  return (
    <PageShell
      title="Governance"
      subtitle="Create proposals, vote and shape the future of Kryptage. (UI preview — on-chain integration coming next.)"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs text-slate-400">Voting power</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-slate-400">Connect wallet to see your votes.</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400">Active proposals</div>
          <div className="mt-1 text-2xl font-semibold">{proposals.filter((p) => p.status === "Active").length}</div>
          <div className="mt-1 text-xs text-slate-400">Snapshot-style governance UI.</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400">Quorum target</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-slate-400">Will be read from governance contract.</div>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search proposals..."
            className="w-full rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Succeeded">Succeeded</option>
            <option value="Defeated">Defeated</option>
            <option value="Executed">Executed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <SecondaryButton disabled>Delegate</SecondaryButton>
          <PrimaryButton disabled>Create proposal</PrimaryButton>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {visible.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{p.id}</span>
                  <Badge tone={statusTone(p.status) as any}>{p.status}</Badge>
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{p.summary}</p>
                <div className="mt-3 text-xs text-slate-400">
                  Proposed by <span className="font-mono">{shortAddr(p.proposer)}</span> • {p.start} → {p.end}
                </div>
              </div>

              <div className="min-w-[160px]">
                <div className="text-xs text-slate-400">For / Against</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-emerald-500" style={{ width: `${p.forPct}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-300">
                  <span>For {p.forPct}%</span>
                  <span>Against {p.againstPct}%</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">Quorum: {p.quorumPct}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Link href={`/proposals`} className="text-sm text-blue-400 hover:text-blue-300">
                View details
              </Link>
              <PrimaryButton disabled={p.status !== "Active"}>Vote</PrimaryButton>
            </div>
          </Card>
        ))}

        {visible.length === 0 && (
          <Card>
            <div className="text-sm text-slate-300">No proposals found.</div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
