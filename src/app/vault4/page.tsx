import Link from "next/link";
import { Badge, Card, PageShell, SecondaryButton } from "@/components/UI";

export default function Vault4Page() {
  return (
    <PageShell title="Vault 4" subtitle="SPYON Vault">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-slate-400">Collateral</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">SPYON</div>
          </div>
          <Badge tone="blue">Preview</Badge>
        </div>

        <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
          UI preview — on-chain integration coming next.
        </div>

        <div className="mt-4 text-sm text-slate-300">
          This page will show your SPYON vault position and enable collateral management once the on-chain integration is ready.
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/vault" className="text-sm text-blue-400 hover:text-blue-300">
            ← Back to Vaults
          </Link>
          <SecondaryButton disabled>Actions coming soon</SecondaryButton>
        </div>
      </Card>
    </PageShell>
  );
}
