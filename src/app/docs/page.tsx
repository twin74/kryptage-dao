import Link from "next/link";
import { Badge, Card, PageShell, SecondaryButton } from "@/components/UI";

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        <Badge tone="blue">Docs</Badge>
      </div>
      <div className="mt-3 space-y-3 text-sm text-slate-300 leading-relaxed">{children}</div>
    </Card>
  );
}

export default function DocsPage() {
  return (
    <PageShell title="Docs" subtitle="Kryptage DAO — Documents Section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <DocSection title="Kryptage DAO — Documents Section (Descriptive DeFi Edition)">
            <p>
              Kryptage DAO is the governance backbone of a new financial architecture — the{" "}
              <span className="text-slate-100 font-semibold">Real Yield Layer</span> — designed to merge non-custodial yield strategies, a sustainable
              stablecoin, and fintech-grade accessibility.
            </p>
            <p>
              Rather than merely copying the governance models of MakerDAO, Aave, or Lido, Kryptage DAO takes inspiration from them to build a framework
              aligned with the requirements of MiCA, institutional safety, and mainstream adoption.
            </p>
            <p>
              The ecosystem rests on three pillars:{" "}
              <span className="text-slate-100 font-semibold">USDK</span>, a yield-backed and transparently collateralized ART-compliant stablecoin;{" "}
              <span className="text-slate-100 font-semibold">multi-strategy Vaults</span> that generate measurable returns across stable, BTC, gold, and
              equity-backed assets; and a{" "}
              <span className="text-slate-100 font-semibold">Risk Manager</span> designed for institutional-grade oversight (automated deleveraging, LTV
              targeting, and internal liquidation safety mechanisms).
            </p>
          </DocSection>

          <DocSection title="1. The Role and Identity of Kryptage DAO">
            <p>
              Kryptage DAO exists to ensure that the Real Yield Layer remains community-directed, trust-minimized, and non-custodial. Its mandate is not merely
              operational: the DAO safeguards the principles on which Kryptage was built — radical transparency, security by design, and accessibility for all
              users.
            </p>
            <p>
              Where many DAOs primarily govern product features or incentives, Kryptage DAO governs a financial substrate: the stablecoin, the yield ecosystem,
              the risk engine, and an integration layer used by fintech companies. This requires a governance philosophy that balances decentralization with
              professional-grade risk management.
            </p>
            <p>
              Kryptage DAO is therefore not just a community; it is the steward of an emerging financial category. Its responsibility is to ensure that the
              Real Yield Layer evolves safely, sustainably, and in alignment with the needs of millions of future users.
            </p>
          </DocSection>

          <DocSection title="2. A Governance Philosophy Built for Stability and Expansion">
            <p>
              Kryptage adopts a{" "}
              <span className="text-slate-100 font-semibold">progressive decentralization</span> model, ensuring that governance expands at the pace of
              infrastructure maturity. In early stages, core contributors and risk experts oversee critical parameters so that USDK, Vaults, and the Risk
              Manager operate correctly and securely.
            </p>
            <p>
              As the system stabilizes, governance power transitions outward to token holders and institutional partners, moving toward a bicameral model
              inspired by MakerDAO’s multi-unit structure and Lido’s dual-layer governance.
            </p>
            <p className="text-slate-200">
              The core principle:{" "}
              <span className="font-semibold">decentralize control, never decentralize responsibility</span>.
            </p>
          </DocSection>

          <DocSection title="3. What the DAO Governs: Parameters, Processes, and Protocol Health">
            <p>
              Kryptage DAO governs the configuration and evolution of the Real Yield Layer without ever assuming custodial control over user funds.
            </p>

            <div>
              <div className="text-slate-100 font-semibold">3.1 USDK Governance</div>
              <p className="mt-2">
                USDK is designed as a fully backed, non-custodial ART stablecoin. Governance focuses on collateralization rules, reserve transparency standards,
                peg-monitoring thresholds, and the interplay between mint/burn mechanics and the stable liquidity layer.
              </p>
            </div>

            <div>
              <div className="text-slate-100 font-semibold">3.2 Vault Strategy Oversight</div>
              <p className="mt-2">
                Vaults use modular strategies linked to measurable yield sources. The DAO approves new strategies, adjusts risk parameters, evaluates performance,
                and decides when to phase out or upgrade modules.
              </p>
            </div>

            <div>
              <div className="text-slate-100 font-semibold">3.3 Risk Manager Parameters</div>
              <p className="mt-2">
                Governance calibrates LTVs, health factor thresholds, deleveraging curves, slippage tolerances, and emergency shutdown logic. Adjustments
                require expertise and community scrutiny, turning governance into a collective risk intelligence system.
              </p>
            </div>

            <div>
              <div className="text-slate-100 font-semibold">3.4 Treasury Stewardship</div>
              <p className="mt-2">
                The DAO directs treasury resources derived from Vault value generation and protocol fees. The treasury is designed to fund audits, research,
                ecosystem growth, liquidity stability, and grants — emphasizing long-term resilience over short-term speculation.
              </p>
            </div>
          </DocSection>

          <DocSection title="4. Participation, Incentives, and the Role of the KTG Token">
            <p>
              Governance participation revolves around{" "}
              <span className="text-slate-100 font-semibold">KTG</span>, distributed through a merit-based points system. Influence is earned through
              contribution: testing, education, analysis, integrations, strategy reviews, and thoughtful proposals.
            </p>
            <p>
              KTG is not a revenue-sharing token. It does not entitle holders to profits, yield, or backing — a deliberate design choice intended to avoid the
              regulatory pitfalls that affected earlier DeFi models.
            </p>
          </DocSection>

          <DocSection title="5. The Kryptage Documentation Framework">
            <p>
              Kryptage DAO maintains a suite of living documents — a transparent knowledge layer ensuring that governance decisions remain informed, accountable,
              and accessible.
            </p>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>
                <span className="text-slate-100 font-semibold">Governance Charter</span>: how proposals move, delegation, emergency powers, and
                decentralization phases.
              </li>
              <li>
                <span className="text-slate-100 font-semibold">USDK Governance Standards</span>: backing, reserves architecture, peg monitoring, and
                transparency.
              </li>
              <li>
                <span className="text-slate-100 font-semibold">Vault Frameworks</span>: criteria for new strategies, performance review, and risk
                constraints.
              </li>
              <li>
                <span className="text-slate-100 font-semibold">Risk Management Handbook</span>: LTV logic, internal liquidations, delever flows, stress
                tests.
              </li>
              <li>
                <span className="text-slate-100 font-semibold">Treasury Policy</span>: audits, liquidity provisioning, grants, and long-term stability.
              </li>
            </ul>
            <div className="mt-3 text-xs text-slate-400">
              Note: this section describes the intended documentation set. Individual documents may be published iteratively.
            </div>
          </DocSection>

          <DocSection title="6. Why Participate: The Future Being Built by Kryptage DAO">
            <p>
              Kryptage DAO is coordinating an entire financial layer. Participants can shape the evolution of sustainable stablecoins, non-custodial real-yield
              strategies, compliant fintech integrations, and robust risk frameworks designed for mainstream adoption.
            </p>
            <p>
              Where many DAOs govern features, Kryptage governs foundations. Participation is an invitation to help build a financial system that is transparent,
              inclusive, and aligned with the principles of non-custodial finance.
            </p>
          </DocSection>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="text-sm font-semibold text-slate-100">Quick links</div>
            <div className="mt-3 space-y-2">
              <Link href="/vault">
                <SecondaryButton className="w-full">Open Vaults</SecondaryButton>
              </Link>
              <Link href="/dashboard">
                <SecondaryButton className="w-full">Open Dashboard</SecondaryButton>
              </Link>
              <Link href="/airdrop">
                <SecondaryButton className="w-full">KTG Points</SecondaryButton>
              </Link>
              <Link href="/governance">
                <SecondaryButton className="w-full">Governance</SecondaryButton>
              </Link>
            </div>
          </Card>

          <Card>
            <div className="text-sm font-semibold text-slate-100">Coming next</div>
            <div className="mt-2 text-sm text-slate-300">
              This Docs page is a narrative overview. Next iterations can include a structured library (Charter, Risk Handbook, Strategy Specs) with versioned
              PDFs.
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
