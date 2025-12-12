import Link from "next/link";
import Image from "next/image";

import { Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

export default function Home() {
  return (
    <PageShell
      title="Kryptage DAO"
      subtitle="On-chain stable vault, airdrop points, and governance — all in one dApp."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="text-sm text-slate-300">
            Welcome to the Kryptage DAO portal. Use the Stable Vault to deposit USDC and earn USDK yield, track your KTG airdrop points,
            and follow governance proposals.
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/vault1">
              <PrimaryButton>Open Stable Vault</PrimaryButton>
            </Link>
            <Link href="/dashboard">
              <SecondaryButton>Open Dashboard</SecondaryButton>
            </Link>
            <Link href="/governance">
              <SecondaryButton>Governance</SecondaryButton>
            </Link>
            <Link href="/airdrop">
              <SecondaryButton>Airdrop</SecondaryButton>
            </Link>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Network: Sepolia testnet. Connect your wallet from the header.
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-100">Quick start</div>
          <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Verify your wallet on the Faucet page.</li>
            <li>Claim test tokens (USDC, WBTC, XAUT, SPYON).</li>
            <li>Deposit USDC in Stable Vault and monitor your yield.</li>
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
          <div className="text-sm font-semibold">Stable Vault</div>
          <div className="mt-2 text-sm text-slate-300">Deposit USDC, receive USDK exposure and earn protocol yield.</div>
          <div className="mt-3">
            <Link href="/vault1" className="text-sm text-blue-400 hover:text-blue-300">
              Open vault →
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Airdrop points</div>
          <div className="mt-2 text-sm text-slate-300">Points accrue over time and with faucet claims. Track leaderboard and status.</div>
          <div className="mt-3">
            <Link href="/airdrop" className="text-sm text-blue-400 hover:text-blue-300">
              View airdrop →
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Governance</div>
          <div className="mt-2 text-sm text-slate-300">Snapshot/Tally-style portal. Proposals and voting will be enabled next.</div>
          <div className="mt-3">
            <Link href="/governance" className="text-sm text-blue-400 hover:text-blue-300">
              View governance →
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
