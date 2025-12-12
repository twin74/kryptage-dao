import Link from "next/link";
import { Badge, Card, PageShell, SecondaryButton } from "@/components/UI";

export default function PoolPage() {
  return (
    <PageShell
      title="Pool"
      subtitle="Protocol liquidity and markets overview. (UI preview — on-chain integration coming next.)"
    >
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-slate-400">Lending Pool</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">Markets & liquidity</div>
          </div>
          <Badge tone="blue">Preview</Badge>
        </div>

        <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
          UI preview — on-chain integration coming next.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-xs text-slate-400">Total liquidity</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">—</div>
            <div className="mt-1 text-xs text-slate-400">Will be fetched from the pool contract.</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-slate-400">Total borrows</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">—</div>
            <div className="mt-1 text-xs text-slate-400">Will be fetched from the pool contract.</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-slate-400">Utilization</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">—</div>
            <div className="mt-1 text-xs text-slate-400">Will be computed from on-chain state.</div>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-300">
            For now, use the vault pages to interact with the protocol.
          </div>
          <Link href="/vault">
            <SecondaryButton>Go to Vaults</SecondaryButton>
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}
