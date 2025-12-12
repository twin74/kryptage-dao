import Link from "next/link";
import { Badge, Card, PageShell, SecondaryButton } from "@/components/UI";

export default function PoolPage() {
  return (
    <PageShell title="Pool" subtitle="This page has moved.">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">Pool  deprecated</div>
            <div className="mt-2 text-sm text-slate-300">
              The Pool page has been replaced by the Swap page (USDK/USDC).
            </div>
          </div>
          <Badge tone="amber">Moved</Badge>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link href="/swap">
            <SecondaryButton>Go to Swap</SecondaryButton>
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}
