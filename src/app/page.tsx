import Link from "next/link";

import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

export default function Home() {
  return (
    <PageShell title="Kryptage DAO" subtitle="Stable vaults, points and governance (Sepolia).">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-300">
                Deposit collateral, earn yield, collect points and follow proposals. This portal is optimized for Sepolia testnet.
              </div>
              <div className="mt-3 text-xs text-slate-400">Connect your wallet from the header to interact with contracts.</div>
            </div>
            <Badge tone="green">Live</Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/vault">
              <PrimaryButton>Open Vaults</PrimaryButton>
            </Link>
            <Link href="/dashboard">
              <SecondaryButton>Dashboard</SecondaryButton>
            </Link>
            <Link href="/swap">
              <SecondaryButton>Swap</SecondaryButton>
            </Link>
            <Link href="/faucet">
              <SecondaryButton>Faucet</SecondaryButton>
            </Link>
          </div>

          <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
            Tip: Vault 1 is live. Vault 24 are UI previews (on-chain integration coming next).
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Quick start</div>
          <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Verify your wallet on Faucet.</li>
            <li>Claim test tokens.</li>
            <li>Deposit in Vault 1 and monitor rewards.</li>
          </ol>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/faucet">
              <SecondaryButton className="w-full">Go to Faucet</SecondaryButton>
            </Link>
            <Link href="/vault1">
              <SecondaryButton className="w-full">Open Vault 1</SecondaryButton>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm font-semibold text-slate-100">Airdrop</div>
          <div className="mt-2 text-sm text-slate-300">
            Track points, eligibility and leaderboard.
          </div>
          <div className="mt-4">
            <Link href="/airdrop">
              <SecondaryButton className="w-full">Open Airdrop</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Governance</div>
          <div className="mt-2 text-sm text-slate-300">
            Explore proposals and voting (UI preview).
          </div>
          <div className="mt-4">
            <Link href="/governance">
              <SecondaryButton className="w-full">Open Governance</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Docs</div>
          <div className="mt-2 text-sm text-slate-300">Protocol docs and integration notes.</div>
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
