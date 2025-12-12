import Link from "next/link";
import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

function VaultCard({
  title,
  asset,
  href,
  status,
  description,
  cta,
  enabled,
}: {
  title: string;
  asset: string;
  href: string;
  status: "Live" | "Preview";
  description: string;
  cta: string;
  enabled: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="mt-1 text-lg font-semibold text-slate-100">{asset}</div>
        </div>
        <Badge tone={status === "Live" ? "green" : "blue"}>{status}</Badge>
      </div>

      <div className="mt-3 text-sm text-slate-300">{description}</div>

      {status === "Preview" && (
        <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
          UI preview — on-chain integration coming next.
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        {enabled ? (
          <Link href={href}>
            <PrimaryButton>{cta}</PrimaryButton>
          </Link>
        ) : (
          <PrimaryButton disabled>{cta}</PrimaryButton>
        )}
        <Link href={href}>
          <SecondaryButton disabled={!enabled}>Details</SecondaryButton>
        </Link>
      </div>
    </Card>
  );
}

export default function VaultPage() {
  return (
    <PageShell
      title="Vaults"
      subtitle="Choose a vault to deposit collateral and earn yield. Vault 1 is live; other vaults are UI previews."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <VaultCard
          title="Vault 1"
          asset="USDC → USDK (Stable Vault)"
          href="/vault1"
          status="Live"
          description="Deposit USDC, receive USDK exposure and earn yield. Tracks KTG airdrop points." 
          cta="Open"
          enabled
        />

        <VaultCard
          title="Vault 2"
          asset="WBTC Vault"
          href="/vault2"
          status="Preview"
          description="BTC-collateral vault UI. Deposit WBTC and manage your vault position." 
          cta="Preview"
          enabled={false}
        />

        <VaultCard
          title="Vault 3"
          asset="XAUT Vault"
          href="/vault3"
          status="Preview"
          description="Gold-collateral vault UI. Deposit XAUT and manage your vault position." 
          cta="Preview"
          enabled={false}
        />

        <VaultCard
          title="Vault 4"
          asset="SPYON Vault"
          href="/vault4"
          status="Preview"
          description="Index-collateral vault UI. Deposit SPYON and manage your vault position." 
          cta="Preview"
          enabled={false}
        />
      </div>

      <Card className="mt-8">
        <div className="text-sm font-semibold text-slate-100">Notes</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
          <li>Vault 1 is already connected to on-chain contracts via Sepolia.</li>
          <li>Vault 2–4 are UI previews only and will be wired to contracts next.</li>
        </ul>
      </Card>
    </PageShell>
  );
}
