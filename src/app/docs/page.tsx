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
  return <h2 className="mt-8 text-xl font-semibold text-slate-100">{children}</h2>;
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-3 text-sm leading-6 text-slate-300 ${className}`}>{children}</p>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="mt-2 text-sm leading-6 text-slate-300">{children}</li>;
}

function DocContent({ chapter }: { chapter: DocChapterId }) {
  switch (chapter) {
    case "get-started":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Get Started with Kryptage DAO</h1>
              <p className="mt-2 text-sm text-slate-300">
                Welcome to Kryptage DAO, a real-yield DeFi protocol designed to generate sustainable returns from stable and crypto assets while preserving capital efficiency,
                transparency, and decentralization.
              </p>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>What is Kryptage (in 60 seconds)</SectionTitle>
          <P>
            Kryptage is a DeFi ecosystem built around USDK, a next-generation stablecoin designed to be 1:1 redeemable with major stablecoins (USDC / USDT), backed
            by real on-chain yield, risk-managed (not speculative), and DAO-governed.
          </P>
          <P>
            Unlike traditional DeFi protocols that rely on inflationary token emissions, Kryptage generates yield from productive capital deployment (stable strategies,
            lending, controlled leverage) and redistributes it transparently.
          </P>
          <P>
            Deposit stablecoins → USDK is minted → Capital is deployed → Yield is generated → Users & the DAO benefit.
          </P>

          <SectionTitle>Core Concepts</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              <b>USDK</b>: the core stablecoin of the ecosystem.
            </Li>
            <Li>
              <b>Vault</b>: smart contract that deploys capital into yield strategies.
            </Li>
            <Li>
              <b>Shares</b>: your proportional ownership of a Vault.
            </Li>
            <Li>
              <b>Peg Pool</b>: liquidity pool that keeps USDK ≈ $1.
            </Li>
            <Li>
              <b>KTG</b>: governance & utility token of Kryptage DAO.
            </Li>
          </ul>

          <SectionTitle>Step 1 — Create or Import a Wallet</SectionTitle>
          <P>To interact with Kryptage, you need a non-custodial Web3 wallet (e.g. MetaMask, Rabby, WalletConnect-compatible wallets).</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Write down your seed phrase offline.</Li>
            <Li>Never share your private keys.</Li>
            <Li>Use a hardware wallet if possible.</Li>
          </ul>

          <SectionTitle>Step 2 — Fund Your Wallet</SectionTitle>
          <P>
            You’ll need USDC or USDT (to mint USDK) plus a small amount of native gas token (depending on the chain). USDK is always minted 1:1 from supported
            stablecoins.
          </P>

          <SectionTitle>Step 3 — Connect Your Wallet</SectionTitle>
          <ol className="mt-3 list-decimal list-inside">
            <Li>Go to Kryptage.com</Li>
            <Li>Click “Connect Wallet”</Li>
            <Li>Approve the connection in your wallet</Li>
            <Li>Select the correct network</Li>
          </ol>
          <P>
            Once connected, the interface shows your balances, available Vaults, and (when enabled) KTG Points.
          </P>

          <SectionTitle>Step 4 — Deposit into a Vault</SectionTitle>
          <P>
            Choose your stablecoin amount, confirm the transaction, mint USDK 1:1, deposit into a Vault, receive Vault Shares, and earn yield that accrues over time.
          </P>

          <SectionTitle>Your First Complete Flow</SectionTitle>
          <P>
            Deposit → Yield → Withdraw: Deposit USDC/USDT → Mint USDK into a Vault → Earn real yield → Withdraw USDK → Burn USDK → Receive USDC/USDT.
          </P>

          <SectionTitle>Disclaimer</SectionTitle>
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

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const selectedRaw = typeof sp?.ch === "string" ? sp.ch : Array.isArray(sp?.ch) ? sp.ch[0] : null;
  const selected = isValidId(selectedRaw) ? selectedRaw : CHAPTERS[0].id;

  return (
    <PageShell title="Docs" subtitle={titleFor(selected)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
        <Card className="md:sticky md:top-6 h-fit">
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

        <Card>
          <DocContent chapter={selected} />
        </Card>
      </div>
    </PageShell>
  );
}
