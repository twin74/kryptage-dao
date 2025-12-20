import { PageShell, Card, Badge } from "@/components/UI";
import Link from "next/link";

type DocChapterId =
  | "get-started"
  | "ecosystem"
  | "usdk"
  | "products"
  | "ktg"
  | "dao"
  | "developers"
  | "safety"
  | "compliance"
  | "faq"
  | "contacts";

type Chapter = {
  id: DocChapterId;
  title: string;
  short?: string;
};

const CHAPTERS: Chapter[] = [
  { id: "get-started", title: "1) Get Started" },
  { id: "ecosystem", title: "2) Ecosystem" },
  { id: "usdk", title: "3) USDK Stablecoin" },
  { id: "products", title: "4) Products" },
  { id: "ktg", title: "5) $KTG Token" },
  { id: "dao", title: "6) Kryptage DAO" },
  { id: "developers", title: "7) Developers" },
  { id: "safety", title: "8) Safety & Risk" },
  { id: "compliance", title: "9) Compliance & Legal" },
  { id: "faq", title: "10) FAQ" },
  { id: "contacts", title: "11) Contacts & Links" },
];

function titleFor(id: string | null | undefined) {
  return CHAPTERS.find((c) => c.id === id)?.title || CHAPTERS[0].title;
}

function isValidId(id: string | null): id is DocChapterId {
  return !!id && CHAPTERS.some((c) => c.id === id);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-semibold text-slate-900">{children}</h2>;
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-3 text-sm leading-6 text-slate-700 ${className}`}>{children}</p>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="mt-2 text-sm leading-6 text-slate-700">{children}</li>;
}

function DocContent({ chapter }: { chapter: DocChapterId }) {
  switch (chapter) {
    case "get-started":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🚀 1) Get Started with Kryptage DAO</h1>
              <p className="mt-2 text-sm text-slate-700">
                Welcome to Kryptage DAO, a real-yield DeFi protocol designed to generate sustainable returns from stable and crypto assets while preserving capital efficiency,
                transparency, and decentralization. This section will guide you step by step, from understanding Kryptage in under a minute to making your first interaction on-chain.
              </p>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* Remote image hosted externally */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.ibb.co/VYFWpCb6/Screenshot-2025-12-20-alle-10-33-41.png"
              alt="Kryptage DAO docs - Get Started"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          <SectionTitle>🧩 What is Kryptage (in 60 seconds)</SectionTitle>
          <P>
            Kryptage is a DeFi ecosystem built around USDK, a next-generation stablecoin designed to be:
          </P>
          <ul className="mt-3 list-disc list-inside">
            <Li>1:1 redeemable with major stablecoins (USDC / USDT)</Li>
            <Li>Backed by real, on-chain yield</Li>
            <Li>Risk-managed, not speculative</Li>
            <Li>DAO-governed, not centrally controlled</Li>
          </ul>
          <P>
            Unlike traditional DeFi protocols that rely on inflationary token emissions, Kryptage generates yield from productive capital deployment (stable strategies, lending,
            controlled leverage) and redistributes it transparently.
          </P>
          <P>
            In short: Deposit stablecoins → USDK is minted → Capital is deployed → Yield is generated → Users & DAO benefit.
          </P>

          <SectionTitle>🧠 Core Concepts You’ll See Everywhere</SectionTitle>
          <P>Before continuing, here are a few key terms you’ll encounter throughout the docs:</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-900">Concept</th>
                  <th className="px-4 py-2 text-left text-slate-900">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">USDK</td>
                  <td className="px-4 py-2 text-slate-700">The core stablecoin of the ecosystem</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Vault</td>
                  <td className="px-4 py-2 text-slate-700">Smart contract that deploys capital into yield strategies</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Shares</td>
                  <td className="px-4 py-2 text-slate-700">Your proportional ownership of a Vault</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Peg Pool</td>
                  <td className="px-4 py-2 text-slate-700">Liquidity pool that keeps USDK ≈ $1</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">KTG</td>
                  <td className="px-4 py-2 text-slate-700">Governance & utility token of Kryptage DAO</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>Don’t worry — each concept is explained in depth later.</P>

          <SectionTitle>👛 Step 1 — Create or Import a Wallet</SectionTitle>
          <P>To interact with Kryptage, you need a non-custodial Web3 wallet.</P>
          <P className="mt-4 text-slate-200 font-semibold">Recommended wallets</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>MetaMask</Li>
            <Li>Rabby</Li>
            <Li>WalletConnect-compatible wallets</Li>
          </ul>
          <P className="mt-4 text-slate-200 font-semibold">Best practices</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Write down your seed phrase offline</Li>
            <Li>Never share your private keys</Li>
            <Li>Use a hardware wallet if possible</Li>
          </ul>
          <P>
            Kryptage is non-custodial. You are always in control of your funds.
          </P>

          <SectionTitle>💳 Step 2 — Fund Your Wallet</SectionTitle>
          <P>You’ll need:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>USDC or USDT (to mint USDK)</Li>
            <Li>A small amount of native gas token (depending on the chain)</Li>
          </ul>
          <P className="mt-4 text-slate-200 font-semibold">Where funds come from</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Centralized exchanges (withdraw to your wallet)</Li>
            <Li>Other DeFi protocols</Li>
            <Li>Cross-chain bridges</Li>
          </ul>
          <P>💡 Tip: USDK is always minted 1:1 from supported stablecoins.</P>

          <SectionTitle>🔗 Step 3 — Connect Your Wallet to Kryptage</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.ibb.co/M5sgnB8X/ktg-MM-2.png"
              alt="Connect wallet to Kryptage"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          <ol className="mt-4 list-decimal list-inside">
            <Li>Go to Kryptage.com</Li>
            <Li>Click “Connect Wallet”</Li>
            <Li>Approve the connection in your wallet</Li>
            <Li>Select the correct network</Li>
          </ol>
          <P>Once connected, the interface will automatically display:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Wallet balance</Li>
            <Li>Available Vaults</Li>
            <Li>Dashboard</Li>
            <Li>KTG Points</Li>
          </ul>

          <SectionTitle>🏦 Step 4 — Deposit USDK into a Vault</SectionTitle>
          <P>
            Once you hold USDC/USDT, you can deploy it into Kryptage Vaults.
          </P>
          <P className="mt-4 text-slate-200 font-semibold">What happens when you deposit</P>
          <P>Minting USDK is simple and transparent:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Choose USDC or USDT</Li>
            <Li>Enter the amount</Li>
            <Li>Confirm the transaction</Li>
            <Li>Mint USDK 1:1</Li>
            <Li>USDK is deposited into a Vault</Li>
            <Li>You receive Vault Shares</Li>
            <Li>Capital is deployed into yield strategies</Li>
            <Li>Yield accrues automatically</Li>
          </ul>
          <P>There are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>❌ No hidden leverage</Li>
            <Li>❌ No algorithmic minting</Li>
            <Li>✅ Full on-chain traceability</Li>
          </ul>
          <P>Vaults are: Transparent, non-custodial, managed by a Risk Manager module.</P>

          <SectionTitle>🔁 Your First Complete Flow</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.ibb.co/yLspZZ5/fl-1.png"
              alt="Deposit → Yield → Withdraw flow"
              className="h-auto w-1/2 max-w-full"
              loading="lazy"
            />
          </div>
          <P className="mt-4 text-slate-200 font-semibold">Deposit → Yield → Withdraw</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Deposit USDC/USDT</Li>
            <Li>Mint USDK into a Vault</Li>
            <Li>Earn real yield</Li>
            <Li>Withdraw USDK</Li>
            <Li>Burn USDK</Li>
            <Li>Receive USDC/USDT</Li>
          </ul>
          <P>
            You can burn USDK at any time to redeem the underlying stablecoin. Simple. Predictable. Sustainable.
          </P>

          <SectionTitle>🧠 What to Read Next</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 2) Kryptage Ecosystem</Li>
            <Li>➡️ 3) USDK Stablecoin</Li>
            <Li>➡️ 4) Vaults & Strategies</Li>
          </ul>

          <SectionTitle>⚠️ Disclaimer</SectionTitle>
          <P>DeFi involves smart contract and market risks. Always do your own research and never invest more than you can afford to lose.</P>
        </div>
      );

    case "ecosystem":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kryptage Ecosystem</h1>
          <P>
            The Kryptage Ecosystem is designed as a modular, risk-aware, real-yield infrastructure for decentralized finance. Instead of chasing unsustainable APYs,
            Kryptage focuses on capital preservation, predictable yield, and DAO-aligned incentives.
          </P>

          <SectionTitle>The Real Yield Layer — Why Kryptage Exists</SectionTitle>
          <P>
            Many DeFi yields are driven by token emissions, speculative leverage, or reflexive algorithms. Kryptage is built as a Real Yield Layer: yield must exist
            before it is distributed.
          </P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Stable farms</Li>
            <Li>Stable lending markets</Li>
            <Li>Low-volatility arbitrage</Li>
            <Li>Controlled leverage strategies</Li>
            <Li>Structured DeFi positions</Li>
          </ul>

          <SectionTitle>High-Level Architecture</SectionTitle>
          <P>
            Kryptage is composed of independent but interconnected modules. Each module has a single responsibility, improving transparency, security, and
            upgradeability (via governance).
          </P>

          <SectionTitle>Core Components</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              <b>USDK</b>: the monetary layer (1:1 minted and redeemable).
            </Li>
            <Li>
              <b>Vaults</b>: the yield engine (shares, strategies, automatic accrual).
            </Li>
            <Li>
              <b>Strategies</b>: capital deployment modules (whitelisted, bounded by risk parameters).
            </Li>
            <Li>
              <b>Risk Manager</b>: monitors LTV, utilization, volatility thresholds; can trigger rebalancing and emergency actions.
            </Li>
            <Li>
              <b>Treasury</b>: accumulates fees/revenues and funds audits, operations, growth, and stability mechanisms.
            </Li>
          </ul>

          <SectionTitle>B2C vs B2B (Yield-as-a-Service)</SectionTitle>
          <P>
            The same protocol serves both retail users (simple UX, one-click deposits) and partners/integrators (treasury optimization, white-label yield products,
            standardized interfaces).
          </P>
        </div>
      );

    case "usdk":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">USDK Stablecoin</h1>
          <P>
            USDK is the core monetary primitive of Kryptage: a fully redeemable, 1:1 stablecoin designed to combine price stability, capital efficiency, and non-inflationary
            yield generation.
          </P>

          <SectionTitle>What USDK is (and what it is not)</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              <b>USDK is</b>: 1:1 redeemable, fully backed by USDC/USDT at all times, governed by the DAO.
            </Li>
            <Li>
              <b>USDK is not</b>: algorithmic, partially collateralized, emission-dependent, or stabilized by reflexive incentives.
            </Li>
          </ul>

          <SectionTitle>Mint & Burn Lifecycle</SectionTitle>
          <P>
            Minting: user deposits USDC/USDT → contracts mint USDK 1:1 → USDK is routed into a Vault. Burning: user burns USDK → supply decreases → user receives USDC/USDT 1:1.
          </P>

          <SectionTitle>Stability Model — Structural, Not Algorithmic</SectionTitle>
          <P>
            USDK stability is enforced by deterministic 1:1 backing and contract-controlled mint/burn. Yield is external, surplus value; redemption remains available even if yield goes to zero.
          </P>

          <SectionTitle>The Correct Mental Model</SectionTitle>
          <P>
            Think of USDK as a vault receipt token with guaranteed 1:1 underlying plus external yield on top — not as an algorithmic stablecoin.
          </P>
        </div>
      );

    case "products":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products — Vaults & Strategies</h1>
          <P>
            Kryptage Vaults are yield-generating smart contracts that accept USDK, issue shares, deploy capital into predefined strategies, and accrue yield automatically.
          </P>

          <SectionTitle>Vault Shares & NAV</SectionTitle>
          <P>
            Shares represent a pro-rata claim on vault assets. As yield accrues, NAV per share increases. Users earn via asset appreciation, not emissions.
          </P>

          <SectionTitle>Risk-Managed by Design</SectionTitle>
          <P>
            Each Vault is supervised by a Risk Manager that monitors LTV, utilization, volatility, and exposure; it can rebalance or exit positions if risk increases.
          </P>

          <SectionTitle>Fees & Value Distribution</SectionTitle>
          <P>
            Fees are performance-based and governance-controlled. Users retain net yield while the DAO Treasury accrues value to fund security, growth, and stability buffers.
          </P>
        </div>
      );

    case "ktg":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">$KTG Token</h1>
          <P>
            $KTG is the governance and coordination token of the Kryptage ecosystem. It aligns users, contributors, and the DAO around long-term growth — without relying on inflationary emissions.
          </P>

          <SectionTitle>Governance + Utility</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>Vote on protocol parameters, strategies, and upgrades.</Li>
            <Li>Coordinate working groups and contributor incentives.</Li>
            <Li>Access potential future utility (locking, delegation, discounts) subject to governance approval.</Li>
          </ul>

          <SectionTitle>KTG Points</SectionTitle>
          <P>
            Before full token activation, Kryptage may use KTG Points: non-transferable participation credits earned by using the protocol and contributing to the ecosystem.
          </P>
        </div>
      );

    case "dao":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kryptage DAO</h1>
          <P>
            Kryptage DAO is the governance layer of the protocol. It coordinates upgrades, risk policies, treasury allocation, and progressive decentralization.
          </P>

          <SectionTitle>Governance Scope</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>USDK parameters and stability mechanisms</Li>
            <Li>Vault lifecycle + strategy whitelisting</Li>
            <Li>Treasury budgets and contributor compensation</Li>
            <Li>Protocol upgrades and emergency procedures</Li>
          </ul>

          <SectionTitle>KIPs (Kryptage Improvement Proposals)</SectionTitle>
          <P>
            Major decisions flow through KIPs: Draft → Review → Vote → Execution. This creates clear accountability, public discussion, and immutable records.
          </P>
        </div>
      );

    case "developers":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Developers</h1>
          <P>
            Kryptage is built as modular, composable infrastructure. Contracts have single responsibilities and strict role separation.
          </P>

          <SectionTitle>Roles & Permissions</SectionTitle>
          <P>
            Privileged actions are separated across roles (DAO/multisig, keepers, controllers). All roles are visible on-chain and, when possible, time-limited and governed.
          </P>

          <SectionTitle>Integrations (B2B)</SectionTitle>
          <P>
            Integrators can deposit USDK and receive yield-bearing shares, use shares as collateral, and build white-label yield products on top of the same protocol.
          </P>
        </div>
      );

    case "safety":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Safety & Risk</h1>
          <P>
            Security and risk management are foundational. Kryptage is designed to minimize tail risk, protect USDK stability, and ensure predictable behavior under stress.
          </P>

          <SectionTitle>Risk Philosophy</SectionTitle>
          <P>
            Safety over APY; explicit risk over hidden leverage; bounded exposure over open-ended strategies. If a risk cannot be measured, it is not deployed.
          </P>

          <SectionTitle>Emergency Controls</SectionTitle>
          <P>
            Emergency tools can pause vaults, exit strategies, and protect stability. These powers are limited in scope, time-bound, and accountable to governance.
          </P>
        </div>
      );

    case "compliance":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Compliance & Legal (High-Level)</h1>
          <P>
            This section is a design and transparency overview — not legal advice. Kryptage is permissionless and non-custodial by architecture.
          </P>

          <SectionTitle>Non-Custodial Boundaries</SectionTitle>
          <P>
            Kryptage never takes custody of user funds. Users control their wallets and all interactions require user signatures; no private keys are held by the protocol.
          </P>

          <SectionTitle>MiCA Positioning (High-Level)</SectionTitle>
          <P>
            USDK is designed with structural principles aligned with transparent, fully-backed asset-referenced models: 1:1 redeemability, visible on-chain reserves, and conservative risk exposure.
          </P>
        </div>
      );

    case "faq":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">FAQ</h1>

          <SectionTitle>General</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              <b>What is Kryptage in one sentence?</b> A real-yield DeFi protocol that turns stablecoins into sustainable, risk-managed yield through DAO-governed Vaults.
            </Li>
            <Li>
              <b>Is Kryptage custodial?</b> No. You always control your wallet and assets.
            </Li>
          </ul>

          <SectionTitle>USDK</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              <b>Is USDK algorithmic?</b> No.
            </Li>
            <Li>
              <b>How does USDK keep its peg?</b> Structural 1:1 backing and contract-enforced mint/burn; swap is a redemption gate, not price discovery.
            </Li>
          </ul>

          <SectionTitle>Troubleshooting</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>Check you’re on the correct network.</Li>
            <Li>Ensure you have gas for fees.</Li>
            <Li>Refresh and reconnect your wallet if transactions don’t prompt.</Li>
          </ul>
        </div>
      );

    case "contacts":
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts & Links</h1>
          <P>
            Always verify links to avoid phishing. Kryptage will never DM you first or ask for private keys.
          </P>

          <SectionTitle>Official Resources</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              Docs: <span className="font-mono">kryptage.com/docs</span>
            </Li>
            <Li>
              Website: <span className="font-mono">kryptage.com</span>
            </Li>
            <Li>
              GitHub: <span className="font-mono">github.com/twin74</span>
            </Li>
          </ul>

          <SectionTitle>Contact</SectionTitle>
          <P>
            Email: <a className="underline" href="mailto:info@kryptage.com">info@kryptage.com</a>
          </P>
          <P className="mt-6 text-xs text-slate-400">
            Security notice: never share seed phrases or private keys. If in doubt, ask publicly in official channels.
          </P>
        </div>
      );

    default:
      return null;
  }
}

export default function DocsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const sp = searchParams;
  const selectedRaw = typeof sp?.ch === "string" ? sp.ch : Array.isArray(sp?.ch) ? sp.ch[0] : null;
  const selected = isValidId(selectedRaw) ? selectedRaw : CHAPTERS[0].id;

  return (
    <PageShell title="Docs" subtitle="Learn how Kryptage works, step-by-step.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="md:col-span-1 bg-white border-slate-200">
          <div className="text-xs font-semibold text-slate-200">Table of Contents</div>
          <div className="mt-3 space-y-1">
            {CHAPTERS.map((c) => {
              const active = c.id === selected;
              return (
                <Link
                  key={c.id}
                  href={`/docs?ch=${c.id}`}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  {c.title}
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="md:col-span-3 bg-white border-slate-200">
          <DocContent chapter={selected} />
        </Card>
      </div>
    </PageShell>
  );
}
