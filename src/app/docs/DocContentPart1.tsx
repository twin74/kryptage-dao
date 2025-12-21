"use client";

import React from "react";
import { Badge } from "@/components/UI";
import ZoomableImage from "@/components/ZoomableImage";

export type DocChapterIdPart1 = "get-started" | "ecosystem" | "usdk" | "products" | "ktg";

type Props = {
  chapter: DocChapterIdPart1;
  SectionTitle: React.FC<{ children: React.ReactNode }>;
  P: React.FC<{ children: React.ReactNode; className?: string }>;
  Li: React.FC<{ children: React.ReactNode; className?: string }>;
};

export function DocContentPart1({ chapter, SectionTitle, P, Li }: Props) {
  switch (chapter) {
    case "get-started":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🚀 1) Get Started with Kryptage DAO</h1>
              <p className="mt-2 text-sm text-slate-700">
                Welcome to Kryptage DAO, a real-yield DeFi protocol designed to generate sustainable returns from stable and crypto assets while preserving capital efficiency,
                transparency, and decentralization.
                <br />
                This section will guide you step by step, from understanding Kryptage in under a minute to making your first interaction on-chain.
              </p>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage
              src="https://i.ibb.co/VYFWpCb6/Screenshot-2025-12-20-alle-10-33-41.png"
              alt="Kryptage DAO docs - Get Started"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          <SectionTitle>🧩 What is Kryptage (in 60 seconds)</SectionTitle>
          <P>Kryptage is a DeFi ecosystem built around USDK, a next-generation stablecoin designed to be:</P>
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
          <P className="mt-4 text-slate-900 font-semibold">In short:</P>
          <P>Deposit stablecoins → USDK is minted → Capital is deployed → Yield is generated → Users & DAO benefit.</P>

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
          <P className="mt-4 text-slate-900 font-semibold">Recommended wallets</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>MetaMask</Li>
            <Li>Rabby</Li>
            <Li>WalletConnect-compatible wallets</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Best practices</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Write down your seed phrase offline</Li>
            <Li>Never share your private keys</Li>
            <Li>Use a hardware wallet if possible</Li>
          </ul>
          <P>
            Kryptage is non-custodial.
            <br />
            You are always in control of your funds.
          </P>

          <SectionTitle>💳 Step 2 — Fund Your Wallet</SectionTitle>
          <P>You’ll need:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>USDC or USDT (to mint USDK)</Li>
            <Li>A small amount of native gas token (depending on the chain)</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Where funds come from</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Centralized exchanges (withdraw to your wallet)</Li>
            <Li>Other DeFi protocols</Li>
            <Li>Cross-chain bridges</Li>
          </ul>
          <P>💡 Tip: USDK is always minted 1:1 from supported stablecoins.</P>

          <SectionTitle>🔗 Step 3 — Connect Your Wallet to Kryptage</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="w-fit max-w-full">
              <ZoomableImage
                src="https://i.ibb.co/M5sgnB8X/ktg-MM-2.png"
                alt="Connect wallet to Kryptage"
                className="h-auto w-1/2 max-w-full"
                loading="lazy"
              />
            </div>
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
          <P>Once you hold USDC/USDT, you can deploy it into Kryptage Vaults.</P>

          <P className="mt-4 text-slate-900 font-semibold">What happens when you deposit</P>
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
          <P className="mt-4">There are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>❌ No hidden leverage</Li>
            <Li>❌ No algorithmic minting</Li>
            <Li>✅ Full on-chain traceability</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Vaults are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Transparent</Li>
            <Li>Non-custodial</Li>
            <Li>Managed by a Risk Manager module</Li>
          </ul>

          <SectionTitle>🔁 Your First Complete Flow</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage
              src="https://i.ibb.co/yLspZZ5/fl-1.png"
              alt="Deposit → Yield → Withdraw flow"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          <P className="mt-4 text-slate-900 font-semibold">Deposit → Yield → Withdraw</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Deposit USDC/USDT</Li>
            <Li>Mint USDK into a Vault</Li>
            <Li>Earn real yield</Li>
            <Li>Withdraw USDK</Li>
            <Li>Burn USDK</Li>
            <Li>Receive USDC/USDT</Li>
          </ul>
          <P>
            You can burn USDK at any time to redeem the underlying stablecoin.
            <br />
            Simple. Predictable. Sustainable.
          </P>

          <SectionTitle>🧠 What to Read Next</SectionTitle>
          <P>Once you’re comfortable with the basics, continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 2) Kryptage Ecosystem</Li>
            <Li>➡️ 3) USDK Stablecoin</Li>
            <Li>➡️ 4) Vaults & Strategies</Li>
          </ul>

          <SectionTitle>⚠️ Disclaimer</SectionTitle>
          <P>
            DeFi involves smart contract and market risks.
            <br />
            Always do your own research and never invest more than you can afford to lose.
          </P>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 2) Kryptage Ecosystem</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Learn how the protocol is structured, where yield comes from, and how value flows through the ecosystem.
            </p>
            <div className="mt-4">
              <a
                href="#ecosystem"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 2
              </a>
            </div>
          </div>
        </div>
      );

    case "ecosystem":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🌐 2) Kryptage Ecosystem</h1>
              <P>
                The Kryptage Ecosystem is designed as a modular, risk-aware, real-yield infrastructure for decentralized finance.
                <br />
                Instead of chasing unsustainable APYs, Kryptage focuses on capital preservation, predictable yield, and DAO-aligned incentives, making it suitable for both retail
                users and institutional integrations.
              </P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <ZoomableImage src="https://i.ibb.co/ccjySMyh/fl-2.png" alt="Kryptage ecosystem" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>🧱 The Real Yield Layer — Why Kryptage Exists</SectionTitle>
          <P>Most DeFi yields fall into one of these categories:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Token emissions (inflationary)</Li>
            <Li>Speculative leverage</Li>
            <Li>Reflexive algorithms</Li>
          </ul>
          <P className="mt-4">Kryptage is different.</P>
          <P>
            It is built as a <b>Real Yield Layer</b>, meaning:
          </P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Yield comes from productive on-chain activity</Li>
            <Li>Revenue is measurable and auditable</Li>
            <Li>Returns are not dependent on new users</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Sources of real yield</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stables Farm</Li>
            <Li>Stable lending markets</Li>
            <Li>Low-volatility arbitrage</Li>
            <Li>Controlled leverage strategies</Li>
            <Li>Structured DeFi positions</Li>
          </ul>
          <P className="mt-4">
            <b>Principle:</b> Yield must exist before it is distributed.
          </P>

          <SectionTitle>🧭 High-Level Architecture</SectionTitle>
          <P>At a high level, Kryptage is composed of independent but interconnected module</P>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/TDdZBrPc/fl3.png" alt="Kryptage architecture" className="w-full h-auto" loading="lazy" />
          </div>

          <P className="mt-4">Each module has a single responsibility, improving:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Transparency</Li>
            <Li>Security</Li>
            <Li>Upgradeability (via governance)</Li>
          </ul>

          <SectionTitle>🧩 Core Components</SectionTitle>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🪙 USDK — The Monetary Layer</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>1:1 minted and redeemable</Li>
            <Li>Backed by productive capital</Li>
            <Li>Pegged via liquidity pools</Li>
            <Li>Yield-resilient by design</Li>
          </ul>
          <P>USDK acts as the unit of account for the entire ecosystem.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🏦 Vaults — The Yield Engine</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Accept USDK deposits</Li>
            <Li>Issue Vault Shares</Li>
            <Li>Deploy funds into strategies</Li>
            <Li>Accrue yield automatically</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Each Vault:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Has a defined risk profile</Li>
            <Li>Is monitored continuously</Li>
            <Li>Can be paused or rebalanced if needed</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🌾 Strategies — Capital Deployment</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/XrtsH4kB/fl4.png" alt="Strategies capital deployment" className="w-full h-auto" loading="lazy" />
          </div>
          <P className="mt-4">Vaults route capital into Strategies, which define:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Where funds go</Li>
            <Li>How yield is generated</Li>
            <Li>When to rebalance or exit</Li>
          </ul>
          <P className="mt-4">Strategies are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Modular</Li>
            <Li>Whitelisted by governance</Li>
            <Li>Bound by strict risk parameters</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🛡️ Risk Manager — The Safety Layer</h3>
          <P>The Risk Manager is a core differentiator of Kryptage. It continuously monitors:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>📉 Loan-to-Value (LTV)</Li>
            <Li>Utilization ratios</Li>
            <Li>Volatility thresholds</Li>
            <Li>Exposure per strategy</Li>
          </ul>
          <P className="mt-4">If risk increases:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Positions are reduced</Li>
            <Li>Capital is rebalanced</Li>
            <Li>Emergency actions can be triggered</Li>
          </ul>
          <P>Risk is managed on-chain, not by discretion.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🏦 DAO Treasury — Value Accumulation</h3>
          <P>The Treasury collects:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Vault performance fees</Li>
            <Li>Strategy revenues</Li>
            <Li>Protocol-level fees</Li>
          </ul>
          <P className="mt-4">Treasury funds are used for:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Contributors</Li>
            <Li>Security & audits</Li>
            <Li>Ecosystem growth</Li>
            <Li>USDK stability mechanisms</Li>
          </ul>
          <P className="mt-4">All treasury movements are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>On-chain</Li>
            <Li>Transparent</Li>
            <Li>Governed by the DAO</Li>
          </ul>

          <SectionTitle>🤝 B2C vs B2B — One Protocol, Two Faces</SectionTitle>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">👤 B2C (Retail Users)</h3>
          <ul className="mt-2 list-disc list-inside">
            <Li>Simple UX</Li>
            <Li>One-click Vault deposits</Li>
            <Li>Passive yield</Li>
            <Li>Non-custodial ownership</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🏢 B2B (Yield-as-a-Service)</h3>
          <P>Kryptage can be integrated by:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Fintech platforms</Li>
            <Li>DAOs</Li>
            <Li>Neobanks</Li>
            <Li>On-chain funds</Li>
          </ul>
          <P className="mt-4">Providing:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stable yield infrastructure</Li>
            <Li>Treasury management</Li>
            <Li>White-label yield products</Li>
          </ul>
          <P>Same protocol. Different interfaces.</P>

          <SectionTitle>🔁 How Value Flows Through the Ecosystem</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>Users deposit stablecoins</Li>
            <Li>USDK is minted</Li>
            <Li>Capital is deployed</Li>
            <Li>Yield is generated</Li>
            <Li>
              Yield is split between:
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Users</Li>
                <Li>Treasury</Li>
              </ul>
            </Li>
            <Li>DAO reinvests or redistributes value</Li>
          </ul>
          <P>This creates a closed, sustainable loop.</P>

          <SectionTitle>🧠 Design Principles</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/xKGrGPcJ/fl5.png" alt="Design principles" className="w-full h-auto" loading="lazy" />
          </div>
          <ul className="mt-4 list-disc list-inside">
            <Li>Non-custodial by default</Li>
            <Li>Modular architecture</Li>
            <Li>Risk-first design</Li>
            <Li>Sustainable yield</Li>
            <Li>Progressive decentralization</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Now that you understand the ecosystem, continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 3) USDK Stablecoin — deep dive into mechanics</Li>
            <Li>➡️ 4) Vaults & Strategies — how yield is generated</Li>
            <Li>➡️ 5) $KTG Token — governance & incentives</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 3) USDK Stablecoin</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Understand USDK mechanics: mint, burn, redemption and why the 1:1 is structural.</p>
            <div className="mt-4">
              <a
                href="#usdk"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 3
              </a>
            </div>
          </div>
        </div>
      );

    case "usdk":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">💵 3) USDK Stablecoin</h1>
              <P>
                USDK is the core monetary primitive of the Kryptage ecosystem.
                <br />
                It is a fully redeemable, 1:1 stablecoin designed to combine price stability, capital efficiency, and non-inflationary yield generation.
              </P>
              <P>
                USDK is <b>not</b> stabilized by yield.
                <br />
                Its stability is enforced by deterministic on-chain backing, while yield is generated on top of the core mechanism.
              </P>
              <P>
                Unlike algorithmic or emission-driven stablecoins, USDK is built to be:
                <br />
                <b>Structurally conservative</b> / <b>Fully transparent</b> / <b>Risk-managed by design</b>
              </P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🪙 What is USDK (and what it is not)</SectionTitle>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">✅ What USDK is</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>A 1:1 redeemable stablecoin</Li>
            <Li>Fully backed by USDC / USDT at all times</Li>
            <Li>Integrated with Vault-based capital deployment</Li>
            <Li>Designed to generate external, non-reflexive yield</Li>
            <Li>Governed by Kryptage DAO</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">❌ What USDK is not</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>❌ Not an algorithmic stablecoin</Li>
            <Li>❌ Not partially collateralized</Li>
            <Li>❌ Not dependent on yield for redemption</Li>
            <Li>❌ Not dependent on token emissions</Li>
            <Li>❌ Not discretionary or off-chain managed</Li>
          </ul>

          <P className="mt-4">
            USDK does not rely on reflexivity.
            <br />
            Redemption comes from structure, not from yield.
          </P>

          <SectionTitle>🧾 USDK Mint &amp; Burn Lifecycle</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/ns2GBnQs/fl6.png" alt="USDK mint and burn lifecycle" className="w-full h-auto" loading="lazy" />
          </div>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🔼 Minting USDK</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>User deposits USDC or USDT</Li>
            <Li>Smart contract mints USDK 1:1</Li>
            <Li>USDK is sent to the Vault</Li>
            <Li>Underlying capital becomes productive</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🔽 Burning USDK</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>User burns USDK</Li>
            <Li>USDK supply is reduced</Li>
            <Li>User receives USDC or USDT 1:1</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Key properties</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Always reversible</Li>
            <Li>Fully on-chain</Li>
            <Li>Auditable at any time</Li>
          </ul>

          <SectionTitle>🧷 USDK Mechanism — How USDK Really Works</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/jk9ZRV3X/fl7.png" alt="USDK mechanism" className="w-full h-auto" loading="lazy" />
          </div>

          <P className="mt-4">
            USDK is not stabilized by arbitrage layers or abstract reserves.
            <br />
            Its stability comes from a direct, deterministic 1:1 backing at all times, enforced by smart contracts.
          </P>
          <P>
            For every USDK in circulation, there is always one USDC or USDT deployed and retrievable.
            <br />
            There is no algorithmic peg defense and no discretionary reserve usage.
          </P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🔼 Deposit &amp; Mint Flow (Creation of USDK)</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>User deposits USDC or USDT into the Vault</Li>
            <Li>The Controller smart contract mints exactly 1 USDK</Li>
            <Li>The minted USDK is credited to the user inside the Vault</Li>
            <Li>The deposited USDC/USDT is sent by the Controller to an external yield farm</Li>
            <Li>The underlying capital becomes productive and generates yield</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Key property</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>USDK is minted only if an equivalent USDC/USDT is deployed</Li>
            <Li>Minting is fully deterministic and reversible</Li>
          </ul>

          <SectionTitle>🌾 Yield Generation — What Yield Really Is</SectionTitle>
          <P>Yield is generated outside the USDK accounting logic.</P>
          <P className="mt-4 text-slate-900 font-semibold">Yield comes from:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stable farms</Li>
            <Li>Lending markets</Li>
            <Li>Low-risk structured positions</Li>
          </ul>

          <ul className="mt-4 list-disc list-inside">
            <Li>Yield is not required to maintain the USDK peg</Li>
            <Li>Yield is excess value, not collateral</Li>
            <Li>USDK would remain perfectly redeemable even with zero yield</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🔽 Withdraw, Burn &amp; Swap Flow (Redemption of USDK)</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>User withdraws USDK from the Vault</Li>
            <Li>
              The Controller immediately:
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Withdraws the corresponding USDC/USDT from the external farm</Li>
                <Li>The withdrawn USDC/USDT is sent to the Swap</Li>
              </ul>
            </Li>
            <Li>
              The user swaps:
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>1 USDK → 1 USDC or USDT</Li>
                <Li>USDK is burned, supply is reduced</Li>
              </ul>
            </Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Why the 1:1 always works</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>USDK exists only because USDC/USDT exists</Li>
            <Li>The Swap is never undercollateralized</Li>
            <Li>There is no price discovery on USDK itself</Li>
          </ul>

          <SectionTitle>🔄 The Swap — Not a Peg Defense, but a Redemption Gate</SectionTitle>
          <P>
            The swap is not used to maintain price via liquidity depth.
            <br />
            It exists to:
          </P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Convert USDK back to USDC/USDT</Li>
            <Li>Enforce hard 1:1 redemption</Li>
            <Li>Guarantee immediate exit</Li>
          </ul>
          <P>USDK does not “float” and does not rely on market incentives to stay at $1.</P>

          <SectionTitle>🛡️ The Role of Yield — Safety Cushion, Not Collateral</SectionTitle>
          <P>Yield has three functions, none of which are required for redemption:</P>
          <ol className="mt-3 list-decimal list-inside">
            <Li>
              <b>Safety Buffer</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Absorbs stress during adverse conditions</Li>
                <Li>Covers slippage, temporary inefficiencies, or delays</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Platform Growth</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Funds development</Li>
                <Li>Funds audits and infrastructure</Li>
                <Li>Sustains DAO operations</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>System Resilience</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Improves confidence</Li>
                <Li>Allows conservative behavior during volatility</Li>
              </ul>
            </Li>
          </ol>
          <P className="mt-4">Yield is a plus, not a dependency.</P>

          <SectionTitle>⚖️ Risk Control — What Is Actually Managed</SectionTitle>
          <P>Risk management focuses on capital deployment, not on the peg.</P>
          <P className="mt-4 text-slate-900 font-semibold">Controlled variables:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Where USDC/USDT is deployed</Li>
            <Li>How much capital per strategy</Li>
            <Li>Exposure caps</Li>
            <Li>Exit conditions</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">If risk increases:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Capital is withdrawn from external farms</Li>
            <Li>Exposure is reduced</Li>
            <Li>No impact on USDK redeemability</Li>
          </ul>
          <P>Risk is managed upstream, before it can affect users.</P>

          <SectionTitle>🧠 The Correct Mental Model for USDK</SectionTitle>
          <P>
            USDK is best understood as:
            <br />
            <b>A vault receipt token</b>
            <br />
            With guaranteed 1:1 underlying
            <br />
            Plus external yield on top
          </P>
          <P className="mt-4 text-slate-900 font-semibold">Not:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>❌ An algorithmic stablecoin</Li>
            <Li>❌ A partially collateralized stable</Li>
            <Li>❌ A reflexive peg system</Li>
          </ul>

          <SectionTitle>🧩 Why This Design Is Strong</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-900">Aspect</th>
                  <th className="px-4 py-2 text-left text-slate-900">USDK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2 text-slate-900">Backing</td>
                  <td className="px-4 py-2 text-slate-700">Hard 1:1 USDC/USDT</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Redemption</td>
                  <td className="px-4 py-2 text-slate-700">Immediate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Peg Defense</td>
                  <td className="px-4 py-2 text-slate-700">Structural, not market-based</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Yield</td>
                  <td className="px-4 py-2 text-slate-700">Extra, not required</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Failure Mode</td>
                  <td className="px-4 py-2 text-slate-700">Graceful (yield → 0, peg intact)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Trust Model</td>
                  <td className="px-4 py-2 text-slate-700">Smart-contract enforced</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionTitle>🔐 Final Principle</SectionTitle>
          <P>
            Yield must exist before it is distributed —
            <br />
            but redemption must exist even without yield.
          </P>

          <SectionTitle>👤 Who Is USDK For?</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>👤 Retail users → stable, passive yield</Li>
            <Li>🏦 DAOs → treasury management</Li>
            <Li>🏢 Institutions → yield-bearing stable exposure</Li>
            <Li>🔗 Protocols → composable stablecoin layer</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Now that you understand USDK, continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 4) Products &amp; Vaults — how yield is generated</Li>
            <Li>➡️ 5) $KTG Token — governance &amp; incentives</Li>
            <Li>➡️ 6) Kryptage DAO — decentralization in practice</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 4) Products — Vaults &amp; Yield Strategies</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Learn how Vaults work, how yield is generated, and how risk is managed.</p>
            <div className="mt-4">
              <a
                href="#products"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 4
              </a>
            </div>
          </div>
        </div>
      );

    case "products":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🏦 4) Products — Vaults &amp; Yield Strategies</h1>
              <P>
                Kryptage Vaults are the core yield-generating products of the ecosystem.
                <br />
                They transform USDK deposits into sustainable, risk-managed returns, without requiring users to actively manage positions.
              </P>
              <P>This section explains how Vaults work, how yield is generated, and how risk is controlled.</P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🧰 What Is a Vault?</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/DDKHc4nH/fl8.png" alt="What is a Vault" className="w-full h-auto" loading="lazy" />
          </div>
          <P className="mt-4">A Vault is a smart contract that:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Accepts USDK deposits</Li>
            <Li>Issues Vault Shares</Li>
            <Li>Deploys capital into predefined strategies</Li>
            <Li>Accrues yield automatically</Li>
          </ul>
          <P className="mt-4">Vaults abstract complexity while preserving:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Transparency</Li>
            <Li>Non-custodial ownership</Li>
            <Li>Risk discipline</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">You deposit. The Vault does the rest.</P>

          <SectionTitle>📊 Vault Shares &amp; NAV</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/vxs1spqY/fl9.png" alt="Vault Shares and NAV" className="w-full h-auto" loading="lazy" />
          </div>
          <P className="mt-4">When you deposit into a Vault:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>You receive Shares</Li>
            <Li>Shares represent a pro-rata claim on the Vault’s assets</Li>
            <Li>Yield increases the Net Asset Value (NAV) per share</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Key properties</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Shares appreciate over time</Li>
            <Li>Shares are redeemable anytime</Li>
            <Li>Fully ERC-4626–compatible (where applicable)</Li>
          </ul>
          <P className="mt-4">
            You don’t earn yield via emissions.
            <br />
            You earn yield via asset appreciation.
          </P>

          <SectionTitle>🌾 Strategy Layer — How Yield Is Generated</SectionTitle>
          <P>Vaults route capital into Strategies, each with a clear mandate.</P>
          <P className="mt-4 text-slate-900 font-semibold">Common strategy categories</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stable lending/farm (low volatility)</Li>
            <Li>Liquidity provision (market-neutral)</Li>
            <Li>Controlled leverage (strict LTV caps)</Li>
            <Li>Structured DeFi positions</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Strategies are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Whitelisted by governance</Li>
            <Li>Bounded by risk limits</Li>
            <Li>Continuously monitored</Li>
          </ul>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/4nm8Gbjd/fl10.png" alt="Strategy layer" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>🛡️ Risk-Managed by Design</SectionTitle>
          <P>Every Vault is supervised by the Risk Manager.</P>
          <P className="mt-4 text-slate-900 font-semibold">What is monitored</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Loan-to-Value (LTV)</Li>
            <Li>Utilization rates</Li>
            <Li>Volatility metrics</Li>
            <Li>Strategy exposure</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">If risk increases</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Positions are scaled down</Li>
            <Li>Capital is rebalanced</Li>
            <Li>Emergency exits can be triggered</Li>
          </ul>
          <P>Risk is reduced before it becomes loss.</P>

          <SectionTitle>🔁 The Stable Flow (End-to-End)</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">Step-by-step</P>
          <ol className="mt-3 list-decimal list-inside">
            <Li>User deposits USDK</Li>
            <Li>Vault issues Shares</Li>
            <Li>Capital is deployed into strategies</Li>
            <Li>Yield accrues continuously</Li>
            <Li>Performance fees are collected</Li>
            <Li>User redeems Shares for USDK</Li>
          </ol>
          <P className="mt-4">All flows are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>On-chain</Li>
            <Li>Deterministic</Li>
            <Li>Fully transparent</Li>
          </ul>

          <SectionTitle>💸 Fees &amp; Value Distribution</SectionTitle>
          <P>Vault fees are:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Performance-based</Li>
            <Li>Transparent</Li>
            <Li>DAO-governed</Li>
          </ul>
          <P className="mt-4 text-slate-900 font-semibold">Fee distribution</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Users retain net yield</Li>
            <Li>DAO Treasury accrues value</Li>
            <Li>Yield Reserve is strengthened</Li>
          </ul>
          <P className="mt-4">Fees align incentives — no yield, no fees.</P>

          <SectionTitle>👤 Who Are Vaults For?</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>Retail users → passive stable yield</Li>
            <Li>DAOs → treasury optimization</Li>
            <Li>Institutions → low-volatility yield exposure</Li>
            <Li>Protocols → composable yield layer</Li>
          </ul>

          <SectionTitle>🧠 Design Principles</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>Non-custodial</Li>
            <Li>Modular strategies</Li>
            <Li>Risk-first allocation</Li>
            <Li>Full transparency</Li>
            <Li>DAO-controlled evolution</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Now continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 5) $KTG Token — governance &amp; utility</Li>
            <Li>➡️ 6) Kryptage DAO — decentralized control</Li>
            <Li>➡️ 7) Developers — contracts &amp; integrations</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 5) $KTG Token</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Explore governance, utility, and how participation is designed and measured.</p>
            <div className="mt-4">
              <a
                href="#ktg"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 5
              </a>
            </div>
          </div>
        </div>
      );

    case "ktg":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🪙 5) $KTG Token</h1>
              <P>
                $KTG is the governance and coordination token of the Kryptage ecosystem.
                <br />
                It aligns users, contributors, and the DAO around long-term, sustainable growth — without relying on inflationary emissions.
              </P>
              <P>$KTG is designed to reward participation, alignment, and responsibility, not short-term speculation.</P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>📌 Token Overview</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2 text-slate-900 font-semibold">Token name</td>
                  <td className="px-4 py-2 text-slate-700">Kryptage Token</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900 font-semibold">Ticker</td>
                  <td className="px-4 py-2 text-slate-700">KTG</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900 font-semibold">Category</td>
                  <td className="px-4 py-2 text-slate-700">Governance &amp; Utility</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900 font-semibold">Issuance</td>
                  <td className="px-4 py-2 text-slate-700">DAO-controlled</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900 font-semibold">Inflation</td>
                  <td className="px-4 py-2 text-slate-700">None by default</td>
                </tr>
              </tbody>
            </table>
          </div>

          <P className="mt-4 text-slate-900 font-semibold">$KTG does not represent:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>❌ Ownership of a company</Li>
            <Li>❌ Guaranteed profit rights</Li>
            <Li>❌ Automatic revenue distribution</Li>
          </ul>
          <P className="mt-4">$KTG represents voice, alignment, and long-term optionality.</P>

          <SectionTitle>🧠 What $KTG Is Used For</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/Wj3mC2n/fl11.png" alt="$KTG utility overview" className="w-full h-auto" loading="lazy" />
          </div>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🗳️ Governance</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Propose and vote on KIPs (Kryptage Improvement Proposals)</Li>
            <Li>Control protocol parameters</Li>
            <Li>Approve new strategies and Vaults</Li>
            <Li>Allocate Treasury resources</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">⚙️ Protocol Utility</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Access advanced features (Pro Mode)</Li>
            <Li>Boost governance weight via locking</Li>
            <Li>Participate in incentive programs (when active)</Li>
            <Li>Fees discount</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🧩 Alignment Mechanism</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Incentivizes long-term behavior</Li>
            <Li>Discourages mercenary capital</Li>
            <Li>Rewards contributors and ecosystem builders</Li>
          </ul>

          <SectionTitle>⭐ KTG Points — Participation Before Tokens</SectionTitle>
          <P>Before full token activation, Kryptage uses KTG Points.</P>
          <P className="mt-4 text-slate-900 font-semibold">What are KTG Points?</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Non-transferable</Li>
            <Li>Off-chain or semi-on-chain</Li>
            <Li>Earned through participation</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">How points are earned</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Using Vaults</Li>
            <Li>Participating in governance</Li>
            <Li>Contributing to the ecosystem</Li>
            <Li>Community building</Li>
          </ul>

          <P className="mt-4">Points reward behavior, not speculation.</P>
          <P className="mt-4 text-slate-900 font-semibold">KTG Points are designed to:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Bootstrap governance</Li>
            <Li>Measure alignment</Li>
            <Li>Convert into $KTG under DAO rules</Li>
          </ul>

          <SectionTitle>🧾 Tokenomics (High-Level)</SectionTitle>
          <P>While final parameters are DAO-defined, core principles include:</P>
          <P className="mt-4 text-slate-900 font-semibold">Supply philosophy</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Fixed/Capped supply</Li>
            <Li>No perpetual emissions</Li>
            <Li>Gradual unlocks</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Allocation buckets (illustrative)</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Contributors &amp; Builders</Li>
            <Li>DAO Treasury</Li>
            <Li>Ecosystem growth</Li>
            <Li>KTG Points conversion</Li>
          </ul>

          <P className="mt-4">Tokenomics are a governance outcome, not a marketing promise.</P>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <ZoomableImage src="https://i.ibb.co/MkwwC2x9/fl12.png" alt="Tokenomics allocation" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>⏳ Vesting &amp; Unlock Logic</SectionTitle>
          <P>To ensure sustainability:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Tokens vest over time (Linear vesting)</Li>
            <Li>Long-term contributors are favored</Li>
            <Li>Sudden supply shocks are avoided</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Vesting mechanics are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Transparent</Li>
            <Li>On-chain where possible</Li>
            <Li>Governed by DAO votes</Li>
          </ul>

          <SectionTitle>🗳️ Governance Power &amp; Delegation</SectionTitle>
          <P>$KTG holders can:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Vote directly</Li>
            <Li>Delegate voting power</Li>
            <Li>Participate in working groups</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Governance evolves in phases:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Founder-led</Li>
            <Li>Council-based</Li>
            <Li>Full DAO</Li>
          </ul>
          <P className="mt-4">Decentralization is progressive, not abrupt.</P>

          <SectionTitle>🔒 Locking, Staking &amp; Future Utility</SectionTitle>
          <P>Future DAO-approved utilities may include:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Time-locking for increased voting power</Li>
            <Li>Fee-sharing mechanisms</Li>
            <Li>Backstop roles for protocol safety</Li>
          </ul>
          <P className="mt-4">Nothing is automatic — all features require governance approval.</P>

          <SectionTitle>⚠️ Important Notes &amp; Disclosures</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>$KTG is not an investment contract</Li>
            <Li>Governance power ≠ profit guarantee</Li>
            <Li>Participation implies responsibility</Li>
            <Li>The value of $KTG emerges from protocol success, not speculation.</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 6) Kryptage DAO — how governance works</Li>
            <Li>➡️ 7) Developers — contracts &amp; integrations</Li>
            <Li>➡️ 8) Safety &amp; Risk — audits &amp; safeguards</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 6) Kryptage DAO</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">See how governance works, how proposals are made, and how upgrades are decided.</p>
            <div className="mt-4">
              <a
                href="#dao"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 6
              </a>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
