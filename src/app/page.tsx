import Link from "next/link";

import { Badge, Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

export default function Home() {
  return (
    <PageShell
      title="Kryptage DAO"
      subtitle="Stable vaults, points and governance 
 (Sepolia)."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-300">
                Use the Stable Vault to deposit USDC and earn USDK yield, track your KTG airdrop points, and follow governance proposals.
              </div>
              <div className="mt-3 text-xs text-slate-400">Network: Sepolia testnet. Connect your wallet from the header.</div>
            </div>
            <Badge tone="green">Live</Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/vault">
              <PrimaryButton>Open Vaults</PrimaryButton>
            </Link>
            <Link href="/vault1">
              <SecondaryButton>Stable Vault (v1)</SecondaryButton>
            </Link>
            <Link href="/dashboard">
              <SecondaryButton>Dashboard</SecondaryButton>
            </Link>
            <Link href="/faucet">
              <SecondaryButton>Faucet</SecondaryButton>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Quick start</div>
          <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Verify your wallet on the Faucet page.</li>
            <li>Claim test tokens (USDC, WBTC, XAUT, SPYON).</li>
            <li>Deposit collateral in Vault 1 and monitor your yield.</li>
          </ol>
          <div className="mt-4">
            <Link href="/faucet">
              <SecondaryButton>Go to Faucet</SecondaryButton>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Vaults</div>
            <Badge tone="blue">Mixed</Badge>
          </div>
          <div className="mt-2 text-sm text-slate-300">Vault 1 is live. Vault 24 are previews.</div>
          <div className="mt-3">
            <Link href="/vault" className="text-sm text-blue-400 hover:text-blue-300">
              Browse vaults 

            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Airdrop points</div>
            <Badge tone="green">Live</Badge>
          </div>
          <div className="mt-2 text-sm text-slate-300">Points accrue over time and with faucet claims. Track leaderboard.</div>
          <div className="mt-3">
            <Link href="/airdrop" className="text-sm text-blue-400 hover:text-blue-300">
              View airdrop 

            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Governance</div>
            <Badge tone="blue">Preview</Badge>
          </div>
          <div className="mt-2 text-sm text-slate-300">UI preview  on-chain integration coming next.</div>
          <div className="mt-3">
            <Link href="/governance" className="text-sm text-blue-400 hover:text-blue-300">
              View governance 

            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Pool</div>
            <Badge tone="blue">Preview</Badge>
          </div>
          <div className="mt-2 text-sm text-slate-300">UI preview  on-chain integration coming next.</div>
          <div className="mt-3">
            <Link href="/pool" className="text-sm text-blue-400 hover:text-blue-300">
              Open pool 

            </Link>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="text-sm font-semibold">Tips</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>If you see 0 pending yield, it may be because global harvest hasnt been triggered yet.</li>
            <li>For test tokens, use the Faucet page (email verification required).</li>
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
