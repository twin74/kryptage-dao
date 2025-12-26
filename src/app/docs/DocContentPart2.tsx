"use client";

import React from "react";
import { Badge } from "@/components/UI";
import ZoomableImage from "@/components/ZoomableImage";

export type DocChapterIdPart2 = "dao" | "developers" | "safety" | "compliance" | "faq" | "contacts";

type Props = {
  chapter: DocChapterIdPart2;
  SectionTitle: React.FC<{ children: React.ReactNode }>;
  P: React.FC<{ children: React.ReactNode; className?: string }>;
  Li: React.FC<{ children: React.ReactNode; className?: string }>;
};

export function DocContentPart2({ chapter, SectionTitle, P, Li }: Props) {
  switch (chapter) {
    case "dao":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🏛️ 6) Kryptage DAO</h1>
              <P>
                Kryptage DAO is the governance layer of the protocol.
                <br />
                It ensures that control, upgrades, and value allocation are progressively decentralized and aligned with the long-term health of the ecosystem.
              </P>
              <P>The DAO is not just a voting system — it is the operating system of Kryptage.</P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🎯 Purpose of the DAO</SectionTitle>
          <P>Kryptage DAO exists to:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Define the long-term vision of the protocol</Li>
            <Li>Protect users and USDK stability</Li>
            <Li>Balance growth, risk, and sustainability</Li>
            <Li>Coordinate contributors and builders</Li>
          </ul>
          <P className="mt-4">The DAO governs rules, not users.</P>

          <SectionTitle>🧠 Core Principles</SectionTitle>
          <P>The DAO is built around a few non-negotiable principles:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Governance before speculation</Li>
            <Li>Modular &amp; auditable decisions</Li>
            <Li>Transparency by default</Li>
            <Li>Risk-first mindset</Li>
            <Li>Progressive decentralization</Li>
          </ul>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/spL1PT5H/fl13.png" alt="DAO core principles" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>🗳️ Governance Scope — What the DAO Controls</SectionTitle>
          <P>The DAO has authority over:</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🪙 Monetary Layer</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>USDK mint/burn parameters</Li>
            <Li>Peg mechanisms</Li>
            <Li>Yield Reserve policies</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🏦 Product Layer</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Vault creation and shutdown</Li>
            <Li>Strategy whitelisting</Li>
            <Li>Risk thresholds and limits</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🏦 Treasury</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Budget allocation</Li>
            <Li>Contributor compensation</Li>
            <Li>Ecosystem grants</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">⚙️ Protocol Upgrades</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Smart contract upgrades</Li>
            <Li>New modules</Li>
            <Li>Emergency procedures</Li>
          </ul>

          <SectionTitle>🧾 Kryptage Improvement Proposals (KIPs)</SectionTitle>
          <P>All major decisions flow through KIPs.</P>
          <P className="mt-4 text-slate-900 font-semibold">KIP lifecycle</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Draft — idea discussion</Li>
            <Li>Review — risk &amp; feasibility checks</Li>
            <Li>Vote — on-chain or snapshot</Li>
            <Li>Execution — automated or multisig</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">KIPs ensure:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Clear accountability</Li>
            <Li>Public discussion</Li>
            <Li>Immutable records</Li>
          </ul>

          <SectionTitle>🧑‍🔧 Contributors &amp; Working Groups</SectionTitle>
          <P>Kryptage DAO coordinates work via contributors, not employees.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Contributor roles</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Protocol engineers</Li>
            <Li>Risk analysts</Li>
            <Li>Community stewards</Li>
            <Li>Governance facilitators</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Compensation model</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Performance-based</Li>
            <Li>DAO-approved budgets</Li>
            <Li>Transparent payouts</Li>
          </ul>
          <P className="mt-4">Work is permissionless. Compensation is earned.</P>

          <SectionTitle>🏦 DAO Treasury — Mandate &amp; Transparency</SectionTitle>
          <P>The Treasury is the economic backbone of the DAO.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Inflows</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Vault performance fees</Li>
            <Li>Protocol-level revenues</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Outflows</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Contributor compensation</Li>
            <Li>Audits &amp; security</Li>
            <Li>Ecosystem growth</Li>
            <Li>Stability reserves</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">All treasury movements are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>On-chain</Li>
            <Li>Publicly auditable</Li>
            <Li>Governed by DAO votes</Li>
          </ul>

          <SectionTitle>🧯 Emergency Powers &amp; Safeguards</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/spQTrWkp/fl14.png" alt="Emergency powers and safeguards" className="w-full h-auto" loading="lazy" />
          </div>

          <P className="mt-4">While decentralization is the goal, safety comes first.</P>

          <P className="mt-4 text-slate-900 font-semibold">Emergency mechanisms</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Temporary pausing of Vaults</Li>
            <Li>Strategy exits</Li>
            <Li>Mint/burn throttling</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">These powers are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Limited in scope</Li>
            <Li>Time-bound</Li>
            <Li>Accountable to the DAO</Li>
          </ul>

          <P className="mt-4">Centralization is used only to buy time, not control outcomes.</P>

          <SectionTitle>⏳ Progressive Decentralization Roadmap</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/39tnk4Wh/fl15.png" alt="Progressive decentralization roadmap" className="w-full h-auto" loading="lazy" />
          </div>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Phase 1 — Bootstrap</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Core team + multisig</Li>
            <Li>Conservative parameters</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Phase 2 — Council</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Elected risk &amp; strategy councils</Li>
            <Li>Partial DAO control</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Phase 3 — Full DAO</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>On-chain governance</Li>
            <Li>Permissionless proposals</Li>
            <Li>Treasury fully DAO-managed</Li>
          </ul>

          <SectionTitle>👤 Who Should Participate?</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>$KTG holders</Li>
            <Li>Contributors</Li>
            <Li>Strategic partners</Li>
            <Li>Long-term aligned users</Li>
          </ul>

          <P className="mt-4">Governance is not mandatory — but alignment is rewarded.</P>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 7) Developers — smart contracts &amp; integrations</Li>
            <Li>➡️ 8) Safety &amp; Risk — audits &amp; safeguards</Li>
            <Li>➡️ 9) Compliance &amp; Legal — high-level framework</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 7) Developers</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Dive into smart contracts, integrations, and the building blocks for developers.</p>
            <div className="mt-4">
              <a
                href="#developers"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 7
              </a>
            </div>
          </div>
        </div>
      );

    case "developers":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🧑‍💻 7) Developers — Smart Contracts &amp; Integrations</h1>
              <P>
                Kryptage is built as a developer-first DeFi infrastructure.
                <br />
                Its smart contracts are modular, composable, and governance-controlled, designed to support both direct integrations and advanced protocol-level use cases.
              </P>
              <P className="mt-4 text-slate-900 font-semibold">This section is for:</P>
              <ul className="mt-2 list-disc list-inside">
                <Li>Protocol developers</Li>
                <Li>Integrators &amp; partners</Li>
                <Li>DAOs &amp; on-chain treasuries</Li>
                <Li>Auditors &amp; researchers</Li>
              </ul>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🧩 Smart Contract Architecture (High-Level)</SectionTitle>
          <P>Kryptage follows a layered and modular architecture:</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/Kxbh4b3H/fl16.png" alt="Smart contract architecture" className="w-full h-auto" loading="lazy" />
          </div>
          <P className="mt-4">Each contract has:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>A single responsibility</Li>
            <Li>Clearly defined permissions</Li>
            <Li>Minimal trust assumptions</Li>
          </ul>

          <SectionTitle>🪙 USDK Contract — Monetary Primitive</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">Responsibilities</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Mint USDK 1:1 from approved stablecoins</Li>
            <Li>Burn USDK for redemption</Li>
            <Li>Enforce mint/burn limits</Li>
            <Li>Interface with Peg Pool &amp; Vaults</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Key properties</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Non-algorithmic</Li>
            <Li>Fully collateralized</Li>
            <Li>DAO-governed parameters</Li>
          </ul>

          <P className="mt-4">USDK acts as the base settlement layer for the entire protocol.</P>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/PZDGxS4Y/fl17.png" alt="USDK monetary primitive" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>🏦 Vault Contracts — ERC-4626 Compatible</SectionTitle>
          <P>Kryptage Vaults follow the ERC-4626 standard wherever possible.</P>

          <P className="mt-4 text-slate-900 font-semibold">Vault responsibilities</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Accept USDK deposits</Li>
            <Li>Mint and burn Vault Shares</Li>
            <Li>Track NAV and yield</Li>
            <Li>Route funds to Strategies</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Developer benefits</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Standardized interfaces</Li>
            <Li>Plug-and-play integrations</Li>
            <Li>Compatibility with DeFi tooling</Li>
          </ul>

          <P className="mt-4">Vaults abstract complexity without hiding risk.</P>

          <SectionTitle>🌾 Strategy Contracts — Yield Modules</SectionTitle>
          <P>Strategies define how capital is deployed.</P>

          <P className="mt-4 text-slate-900 font-semibold">Strategy design rules</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stateless where possible</Li>
            <Li>Explicit risk limits</Li>
            <Li>Governance-whitelisted</Li>
            <Li>Monitored by Risk Manager</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Examples</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stable lending adapters</Li>
            <Li>Liquidity provision modules</Li>
            <Li>Hedged yield strategies</Li>
          </ul>

          <P className="mt-4">Strategies can be:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Added</Li>
            <Li>Paused</Li>
            <Li>Removed</Li>
          </ul>
          <P className="mt-4">via governance without affecting user funds.</P>

          <SectionTitle>🛡️ Risk Manager — On-Chain Safety Logic</SectionTitle>
          <P>The Risk Manager is a core system contract.</P>

          <P className="mt-4 text-slate-900 font-semibold">What it does</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Enforces LTV ceilings</Li>
            <Li>Caps exposure per strategy</Li>
            <Li>Monitors volatility thresholds</Li>
            <Li>Triggers deleveraging or exits</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Why it matters</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Reduces tail-risk</Li>
            <Li>Prevents silent insolvency</Li>
            <Li>Makes risk explicit and auditable</Li>
          </ul>

          <P className="mt-4">Risk is code, not discretion.</P>

          <SectionTitle>🔐 Roles &amp; Permissions</SectionTitle>
          <P>Kryptage uses strict role separation:</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-900">Role</th>
                  <th className="px-4 py-2 text-left text-slate-900">Capability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">DAO</td>
                  <td className="px-4 py-2 text-slate-700">Parameter changes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Multisig</td>
                  <td className="px-4 py-2 text-slate-700">Emergency actions</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Vault</td>
                  <td className="px-4 py-2 text-slate-700">Capital routing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Strategy</td>
                  <td className="px-4 py-2 text-slate-700">Yield execution</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-slate-900">Keeper</td>
                  <td className="px-4 py-2 text-slate-700">Automation (bounded)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <P className="mt-4 text-slate-900 font-semibold">All privileged roles are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Visible on-chain</Li>
            <Li>Time-limited where possible</Li>
            <Li>Accountable to governance</Li>
          </ul>

          <SectionTitle>🔌 Integration Guide (B2B &amp; Protocols)</SectionTitle>
          <P>Kryptage supports Yield-as-a-Service integrations.</P>

          <P className="mt-4 text-slate-900 font-semibold">Typical integrations</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Deposit USDK → receive yield-bearing shares</Li>
            <Li>Use Vault Shares as collateral</Li>
            <Li>Treasury optimization for DAOs</Li>
            <Li>White-label yield products</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Integration surfaces</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Smart contract calls</Li>
            <Li>Read-only on-chain data</Li>
            <Li>Governance participation</Li>
          </ul>

          <P className="mt-4">Kryptage is infrastructure, not just an app.</P>

          <SectionTitle>🧪 Testnets, Deployments &amp; Verification</SectionTitle>
          <P>When available, developers will find:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>📍 Contract addresses</Li>
            <Li>🔎 Verified source code</Li>
            <Li>🧪 Testnet deployments</Li>
            <Li>📘 Integration examples</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">All deployments follow:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Reproducible builds</Li>
            <Li>Open-source standards</Li>
            <Li>Audit-first practices</Li>
          </ul>

          <SectionTitle>🧠 Developer Principles</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>🧩 Modularity over monoliths</Li>
            <Li>🔍 Explicit risk over hidden leverage</Li>
            <Li>🛡️ Safety before optimization</Li>
            <Li>🗳️ Governance-controlled evolution</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 8) Safety &amp; Risk — audits, controls &amp; safeguards</Li>
            <Li>➡️ 9) Compliance &amp; Legal — high-level framework</Li>
            <Li>➡️ 10) FAQ — common questions</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 8) Safety &amp; Risk</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Review audits, safeguards, risk controls and how the protocol handles extreme scenarios.</p>
            <div className="mt-4">
              <a
                href="#safety"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 8
              </a>
            </div>
          </div>

          <SectionTitle>🧾 Public Contract Addresses (Sepolia)</SectionTitle>
          <P className="mt-2">
            Below are the currently published <b>Sepolia</b> testnet addresses for the public contracts used by the app. Always verify the address and ABI before integrating.
          </P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-900">Contract</th>
                  <th className="px-4 py-2 text-left text-slate-900">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2 text-slate-900">USDC (test token)</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0xe348F9b576DDf00489eD7E69f1Be89558Eca5fAb</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">WBTC (test token)</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0x67989EDC2c639c7F005e0a1A0F118B0F20Dfe4Ea</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">XAUT (test token)</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0x4b137335a68529f15d4beBDB511f150bb284CF01</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">SPYON (test token)</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0xb495E97c321682d5f6082F2e096375eedb84a50A</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">USDK</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0x1dbE838274D601B6908b6f0a61f0fc4A6b6923B5</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">sUSDK</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0xd17A198D51359a6979061D410d8ca72F6ad3B909</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Stable Vault</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0xd17A198D51359a6979061D410d8ca72F6ad3B909</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Stable Controller</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0x385423d45202e63EceBa15cBa45AFd78ed2f1158</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">KTG Points</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0xb35552EE5D34b259191ca1af0A27204585A8eF5B</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Stable Farm</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0x41b5266665137e69BfCb38f101b8E8a5004d0DE5</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-900">Faucet Address</td>
                  <td className="px-4 py-2 font-mono text-slate-900">0x1C237015c927ca302F3A759b09C7b26c0d6DB07f</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 8) Safety &amp; Risk — audits, controls &amp; safeguards</Li>
            <Li>➡️ 9) Compliance &amp; Legal — high-level framework</Li>
            <Li>➡️ 10) FAQ — common questions</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 8) Safety &amp; Risk</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Review audits, safeguards, risk controls and how the protocol handles extreme scenarios.</p>
            <div className="mt-4">
              <a
                href="#safety"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 8
              </a>
            </div>
          </div>
        </div>
      );

    case "safety":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">🛡️ 8) Safety &amp; Risk</h1>
              <P>
                Security and risk management are foundational to Kryptage.
                <br />
                The protocol is designed to minimize tail risk, protect USDK stability, and ensure predictable behavior under stress, even in adverse market conditions.
              </P>
              <P>This section explains how risks are identified, mitigated, and managed — transparently and on-chain.</P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🧠 Risk Philosophy</SectionTitle>
          <P>Kryptage follows a risk-first DeFi design:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Safety over APY</Li>
            <Li>Explicit risk over hidden leverage</Li>
            <Li>Bounded exposure over open-ended strategies</Li>
            <Li>Modular containment over monolithic systems</Li>
          </ul>
          <P className="mt-4">If a risk cannot be measured, it is not deployed.</P>

          <SectionTitle>🔍 Risk Categories</SectionTitle>
          <P>Kryptage models and mitigates several risk classes:</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/1fz5s3v5/fl18.png" alt="Risk categories" className="w-full h-auto" loading="lazy" />
          </div>

          <ol className="mt-4 list-decimal list-inside">
            <Li className="mt-2">
              <b>Smart Contract Risk</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Bugs or vulnerabilities in code</Li>
                <Li>Mitigated via audits, formal reviews, and modular design</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Market Risk</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Sudden volatility or depegging events</Li>
                <Li>Mitigated via conservative strategies and buffers</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Liquidity Risk</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Insufficient liquidity during redemptions</Li>
                <Li>Mitigated via Peg Pools and reserves</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Oracle Risk</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Incorrect price feeds</Li>
                <Li>Mitigated via robust oracle selection and validation</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Governance Risk</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Malicious or rushed decisions</Li>
                <Li>Mitigated via timelocks and proposal review processes</Li>
              </ul>
            </Li>
          </ol>

          <SectionTitle>🧪 Audits &amp; Code Reviews</SectionTitle>
          <P>All critical contracts undergo:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Independent security audits</Li>
            <Li>Internal reviews</Li>
            <Li>Continuous monitoring</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Audit principles:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Public audit reports</Li>
            <Li>Transparent remediation</Li>
            <Li>No silent fixes</Li>
          </ul>
          <P className="mt-4">Security is a process, not a checkbox.</P>

          <SectionTitle>🛡️ On-Chain Risk Controls</SectionTitle>
          <P>The Risk Manager enforces constraints in real time:</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/bjHZ3Ygh/fl19.png" alt="On-chain risk controls" className="w-full h-auto" loading="lazy" />
          </div>

          <ul className="mt-4 list-disc list-inside">
            <Li>📉 Maximum LTV per strategy</Li>
            <Li>📊 Exposure caps per protocol</Li>
            <Li>⚠️ Volatility thresholds</Li>
            <Li>🧮 Capital concentration limits</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">If limits are breached:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Positions are scaled down</Li>
            <Li>Capital is rebalanced</Li>
            <Li>Emergency exits are triggered</Li>
          </ul>

          <SectionTitle>🧯 Emergency Controls &amp; Incident Response</SectionTitle>
          <P>Emergency actions (last resort)</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ZoomableImage src="https://i.ibb.co/xSnNZpfY/fl20.png" alt="Emergency controls" className="w-full h-auto" loading="lazy" />
          </div>

          <ul className="mt-4 list-disc list-inside">
            <Li>Pause Vault deposits</Li>
            <Li>Disable new minting</Li>
            <Li>Exit strategies safely</Li>
            <Li>Isolate affected modules</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Emergency powers are:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Limited in scope</Li>
            <Li>Time-bound</Li>
            <Li>Accountable to the DAO</Li>
          </ul>
          <P className="mt-4">Emergency tools exist to preserve optionality, not control users.</P>

          <SectionTitle>🏦 Yield Reserve &amp; Safety Buffers</SectionTitle>
          <P>Kryptage maintains multiple buffers:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Yield Reserve funded by real yield</Li>
            <Li>Liquidity buffers in Peg Pools</Li>
            <Li>Conservative capital deployment ratios</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">These buffers:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Absorb losses</Li>
            <Li>Smooth volatility</Li>
            <Li>Protect USDK peg</Li>
          </ul>

          <SectionTitle>📉 Stress Scenarios &amp; Protocol Behavior</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">Example scenarios</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Sudden market drawdown</Li>
            <Li>Stablecoin depeg</Li>
            <Li>External protocol failure</Li>
            <Li>Oracle outage</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Expected behavior</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Automatic deleveraging</Li>
            <Li>Capital preservation</Li>
            <Li>Graceful degradation</Li>
            <Li>Transparent communication</Li>
          </ul>

          <P className="mt-4">
            The goal is not zero risk —
            <br />
            it is predictable outcomes.
          </P>

          <SectionTitle>👤 User Best Practices</SectionTitle>
          <P>Users are encouraged to:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Use hardware wallets</Li>
            <Li>Diversify exposure</Li>
            <Li>Monitor protocol updates</Li>
            <Li>Understand Vault risk profiles</Li>
          </ul>
          <P className="mt-4">Self-custody implies responsibility.</P>

          <SectionTitle>🔍 Transparency &amp; Monitoring</SectionTitle>
          <P>All critical data is:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>On-chain</Li>
            <Li>Public</Li>
            <Li>Verifiable</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">This includes:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Vault balances</Li>
            <Li>Strategy exposure</Li>
            <Li>Risk parameters</Li>
            <Li>Treasury movements</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 9) Compliance &amp; Legal (High-Level)</Li>
            <Li>➡️ 10) FAQ</Li>
            <Li>➡️ 11) Contacts &amp; Links</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 9) Compliance &amp; Legal</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Understand legal and compliance considerations and the protocol’s approach to transparency.</p>
            <div className="mt-4">
              <a
                href="#compliance"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 9
              </a>
            </div>
          </div>
        </div>
      );

    case "compliance":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">⚖️ 9) Compliance &amp; Legal (High-Level)</h1>
              <P>
                Kryptage is designed to operate at the intersection of decentralized finance and regulatory awareness.
                <br />
                While remaining permissionless and non-custodial, the protocol adopts architectural choices that favor clarity, transparency, and regulatory resilience.
              </P>
              <P className="mt-4 text-slate-900 font-semibold">This section provides a high-level overview — not legal advice — of how Kryptage approaches compliance-related topics.</P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🧠 Design Philosophy: Compliance by Architecture</SectionTitle>
          <P>
            Kryptage does not rely on legal wrappers to appear compliant.
            <br />
            Instead, it embeds compliance-friendly principles directly into protocol design.
          </P>
          <P className="mt-4 text-slate-900 font-semibold">Core ideas:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Transparency over opacity</Li>
            <Li>Modularity over discretion</Li>
            <Li>Non-custodial by default</Li>
            <Li>Clear separation of roles</Li>
          </ul>
          <P className="mt-4">The protocol is code. Governance defines rules, not outcomes.</P>

          <SectionTitle>🔐 Non-Custodial Boundaries</SectionTitle>
          <P>Kryptage never takes custody of user funds.</P>

          <P className="mt-4 text-slate-900 font-semibold">What this means:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Users control their wallets at all times</Li>
            <Li>No pooled off-chain custody</Li>
            <Li>No discretionary fund management</Li>
            <Li>All interactions require user signatures</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">What Kryptage does not do:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>❌ Hold private keys</Li>
            <Li>❌ Execute trades off-chain</Li>
            <Li>❌ Freeze user balances</Li>
            <Li>❌ Promise returns</Li>
          </ul>
          <P className="mt-4">Self-custody is a technical fact, not a disclaimer.</P>

          <SectionTitle>🛡️ Data Protection &amp; GDPR Alignment (High-Level)</SectionTitle>
          <P>
            Kryptage is designed to minimize data processing by default, aligning structurally with GDPR principles.
            <br />
            The protocol does not collect, store, or process personal data.
          </P>

          <ul className="mt-4 list-disc list-inside">
            <Li>No user accounts, profiles, or identifiers exist at protocol level</Li>
            <Li>All interactions are pseudonymous and on-chain</Li>
            <Li>No off-chain databases or user tracking mechanisms are used</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">As a result:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Kryptage acts as a data-minimizing infrastructure, not a data controller</Li>
            <Li>GDPR obligations, where applicable, are shifted to interfaces or third-party frontends</Li>
            <Li>The protocol itself is privacy-preserving by architecture</Li>
          </ul>

          <P className="mt-4">
            Privacy is not enforced by policy —
            <br />
            it emerges from non-custodial, permissionless design.
          </P>

          <SectionTitle>🪙 USDK &amp; Regulatory Positioning (MiCA-Oriented)</SectionTitle>
          <P>USDK is designed with MiCA-like principles in mind.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">High-level positioning</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>USDK may resemble an Asset-Referenced Token (ART)</Li>
            <Li>Fully backed by on-chain assets</Li>
            <Li>No algorithmic stabilization</Li>
            <Li>Clear mint &amp; burn mechanics</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">Key design choices</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>1:1 redeemability</Li>
            <Li>On-chain reserves</Li>
            <Li>Transparent supply</Li>
            <Li>Conservative risk exposure</Li>
          </ul>
          <P className="mt-4">USDK stability comes from structure, not discretion.</P>

          <SectionTitle>🏦 DAO vs Centralized Issuer</SectionTitle>
          <P>Kryptage is governed by a DAO, not a company acting as issuer.</P>
          <P className="mt-4 text-slate-900 font-semibold">Implications:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>No single legal entity controls USDK</Li>
            <Li>Decisions are collective and auditable</Li>
            <Li>Treasury actions require governance approval</Li>
            <Li>Progressive decentralization reduces key-person risk</Li>
          </ul>
          <P className="mt-4">Governance is distributed. Responsibility is shared.</P>

          <SectionTitle>🧾 Disclosures &amp; Transparency Commitments</SectionTitle>
          <P>Kryptage commits to radical transparency:</P>

          <P className="mt-4 text-slate-900 font-semibold">Always public:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Smart contract code</Li>
            <Li>Vault balances</Li>
            <Li>Risk parameters</Li>
            <Li>Treasury movements</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Communicated clearly:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Protocol upgrades</Li>
            <Li>Risk changes</Li>
            <Li>Emergency actions</Li>
            <Li>Governance outcomes</Li>
          </ul>

          <P className="mt-4">Transparency is treated as a core safety feature.</P>

          <SectionTitle>🧯 Jurisdictional Neutrality</SectionTitle>
          <P>
            Kryptage is:
          </P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Globally accessible</Li>
            <Li>On-chain by default</Li>
            <Li>Jurisdiction-agnostic</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">The protocol:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Does not onboard users</Li>
            <Li>Does not perform KYC</Li>
            <Li>Does not restrict geography at protocol level</Li>
          </ul>

          <P className="mt-4">Interfaces built on top may apply their own compliance layers.</P>

          <SectionTitle>⚠️ User Responsibility &amp; Disclaimers</SectionTitle>
          <P>By interacting with Kryptage:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Users act autonomously</Li>
            <Li>Users assess their own legal obligations</Li>
            <Li>Users bear smart contract and market risks</Li>
          </ul>
          <P className="mt-4">DeFi is permissionless — participation implies responsibility.</P>

          <SectionTitle>🧠 What This Section Is (and Is Not)</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">✅ This section is:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>A design overview</Li>
            <Li>A transparency commitment</Li>
            <Li>A regulatory-awareness statement</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">❌ This section is not:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Legal advice</Li>
            <Li>A compliance guarantee</Li>
            <Li>A jurisdiction-specific opinion</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <P>Continue with:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 10) FAQ — common questions &amp; answers</Li>
            <Li>➡️ 11) Contacts &amp; Links — official channels</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 10) FAQ</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Quick answers to common questions about USDK, Vaults, and governance.</p>
            <div className="mt-4">
              <a
                href="#faq"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 10
              </a>
            </div>
          </div>
        </div>
      );

    case "faq":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">❓ 10) FAQ — Frequently Asked Questions</h1>
              <P>
                This section answers the most common questions about Kryptage, USDK, Vaults, $KTG, and DAO governance.
                <br />
                If you’re new to DeFi or just want quick clarity, start here.
              </P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>🔹 General</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">What is Kryptage in one sentence?</P>
          <P>Kryptage is a real-yield DeFi protocol that turns stablecoins into sustainable, risk-managed yield through DAO-governed Vaults.</P>

          <P className="mt-4 text-slate-900 font-semibold">Is Kryptage a company?</P>
          <P>
            No. Kryptage is a decentralized protocol governed by Kryptage DAO.
            <br />
            There is no central issuer managing user funds.
          </P>

          <P className="mt-4 text-slate-900 font-semibold">Is Kryptage custodial?</P>
          <P>
            No. Kryptage is fully non-custodial.
            <br />
            You always control your wallet and your assets.
          </P>

          <SectionTitle>💵 USDK — Stablecoin</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">What backs USDK?</P>
          <P>USDK is backed 1:1 by stable assets deployed into productive on-chain strategies, with additional yield and liquidity buffers.</P>

          <P className="mt-4 text-slate-900 font-semibold">Is USDK algorithmic?</P>
          <P>No. USDK is not algorithmic and does not rely on reflexive mechanisms or token emissions.</P>

          <P className="mt-4 text-slate-900 font-semibold">Can I always redeem USDK?</P>
          <P>Yes. USDK can be burned 1:1 for supported stablecoins, subject only to normal on-chain liquidity conditions.</P>

          <P className="mt-4 text-slate-900 font-semibold">How does USDK keep its peg?</P>
          <P className="mt-2">Through:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              <b>Hard 1:1 backing</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>For every USDK in circulation, there is exactly one USDC or USDT deployed and retrievable.</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Controller-enforced mint &amp; burn</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>USDK is minted only when USDC/USDT is deposited and deployed.</Li>
                <Li>USDK is burned only when the underlying USDC/USDT is withdrawn for redemption.</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Swap as a redemption gate, not a peg defense</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>The swap exists solely to guarantee instant 1:1 conversion, not price discovery.</Li>
              </ul>
            </Li>
            <Li className="mt-3">
              <b>Yield is external to the peg</b>
              <ul className="mt-2 list-disc list-inside ml-6">
                <Li>Yield is surplus value used as a safety buffer and for protocol growth.</Li>
                <Li>The peg remains intact even if yield goes to zero.</Li>
              </ul>
            </Li>
          </ul>
          <P className="mt-4">USDK stays at $1 because it cannot exist without $1 underneath it. Stability comes from enforcement, not incentives.</P>

          <SectionTitle>🏦 Vaults &amp; Yield</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">How do Vaults generate yield?</P>
          <P>Vaults deploy USDK into low-volatility, risk-bounded strategies such as:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Stable lending</Li>
            <Li>Market-neutral liquidity provision</Li>
            <Li>Structured DeFi positions</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">Is yield guaranteed?</P>
          <P>No. Yield is not guaranteed, but it is generated from real economic activity, not emissions.</P>

          <P className="mt-4 text-slate-900 font-semibold">Can I withdraw anytime?</P>
          <P>Yes. Vaults are designed to allow continuous entry and exit, except during rare emergency situations.</P>

          <P className="mt-4 text-slate-900 font-semibold">What happens if a strategy underperforms?</P>
          <P>Exposure is reduced, capital is rebalanced, buffers absorb losses, and all actions are governed by the Risk Manager.</P>

          <SectionTitle>🪙 $KTG Token</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">What is $KTG used for?</P>
          <P>$KTG is used for:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>🗳️ Governance voting</Li>
            <Li>⚙️ Protocol parameter control</Li>
            <Li>🧩 Ecosystem alignment</Li>
          </ul>
          <P className="mt-4">It is not a profit-sharing token.</P>

          <P className="mt-4 text-slate-900 font-semibold">What are KTG Points?</P>
          <P>KTG Points are non-transferable participation credits earned by:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Using the protocol</Li>
            <Li>Contributing</Li>
            <Li>Participating in governance</Li>
          </ul>
          <P className="mt-4">They may convert into $KTG under DAO rules.</P>

          <P className="mt-4 text-slate-900 font-semibold">Is $KTG inflationary?</P>
          <P>No. There are no perpetual emissions by default. Supply decisions are governed by the DAO.</P>

          <SectionTitle>🏛️ DAO &amp; Governance</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">Who controls Kryptage?</P>
          <P>Kryptage is controlled by Kryptage DAO, through on-chain governance and proposals (KIPs).</P>

          <P className="mt-4 text-slate-900 font-semibold">How are decisions made?</P>
          <P>Via Kryptage Improvement Proposals (KIPs): Draft → Community review → Vote → Execution</P>

          <P className="mt-4 text-slate-900 font-semibold">Can anyone submit a proposal?</P>
          <P>Yes. Proposal rights are permissionless, subject to governance rules.</P>

          <SectionTitle>🛡️ Safety &amp; Risk</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">Has Kryptage been audited?</P>
          <P>Audits are planned and/or ongoing for all critical contracts. Reports will be published publicly.</P>

          <P className="mt-4 text-slate-900 font-semibold">What happens in an emergency?</P>
          <P>
            Emergency tools can pause Vaults, exit strategies, and protect USDK stability.
            <br />
            All actions are time-bound and DAO-accountable.
          </P>

          <P className="mt-4 text-slate-900 font-semibold">Is smart contract risk eliminated?</P>
          <P>
            No. Smart contract risk exists in all DeFi systems.
            <br />
            Kryptage mitigates it through modular design, audits, and conservative parameters.
          </P>

          <SectionTitle>⚖️ Legal &amp; Compliance</SectionTitle>

          <P className="mt-4 text-slate-900 font-semibold">Does Kryptage do KYC?</P>
          <P>No. The protocol is permissionless and does not onboard users.</P>

          <P className="mt-4 text-slate-900 font-semibold">Is this legal in my country?</P>
          <P>
            Users are responsible for understanding local regulations.
            <br />
            Kryptage provides infrastructure, not legal advice.
          </P>

          <P className="mt-4 text-slate-900 font-semibold">Is this investment advice?</P>
          <P>No. Nothing in these docs constitutes financial or investment advice.</P>

          <SectionTitle>📬 Still Have Questions?</SectionTitle>
          <P>If your question isn’t answered here:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Check the Docs sections above</Li>
            <Li>Join community channels (when available)</Li>
            <Li>Review on-chain data directly</Li>
          </ul>

          <SectionTitle>👉 What’s Next</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>➡️ 11) Contacts &amp; Links — official resources &amp; channels</Li>
          </ul>

          {/* Next chapter CTA */}
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Next</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Continue to 11) Contacts &amp; Links</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Find official links, community channels, and resources.</p>
            <div className="mt-4">
              <a
                href="#contacts"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Chapter 11
              </a>
            </div>
          </div>
        </div>
      );

    case "contacts":
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">📬 11) Contacts &amp; Links</h1>
              <P>
                This section gathers all official Kryptage resources in one place.
                <br />
                To stay safe, always verify that you are interacting only with links listed here.
              </P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <SectionTitle>⚠️ Security Notice</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">Kryptage will never DM you first, ask for private keys, or request off-chain payments.</P>

          <SectionTitle>🌐 Official Resources</SectionTitle>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🧠 Documentation</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              Docs: <a href="https://kryptage.com/docs" target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4 hover:text-slate-900">kryptage.com/docs</a>
            </Li>
            <Li>
              Protocol Dashboard: <a href="https://kryptage.com" target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4 hover:text-slate-900">kryptage.com</a>
            </Li>
            <Li>
              Governance (KIPs): <a href="https://kryptage.com/governance" target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4 hover:text-slate-900">kryptage.com/governance</a>
            </Li>
          </ul>
          <P className="mt-4">Always check URLs carefully to avoid phishing.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🐦 Social &amp; Community</h3>
          <P className="mt-4 text-slate-900 font-semibold">Official Channels</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>
              X (Twitter):{" "}
              <a
                href="https://x.com/DeFiforDummies"
                target="_blank"
                rel="noreferrer"
                className="font-mono underline underline-offset-4 hover:text-slate-900"
              >
                @DeFiforDummies
              </a>
            </Li>
            <Li>Discord: Kryptage Community</Li>
            <Li>Telegram: Kryptage Announcements</Li>
            <Li>
              Website:{" "}
              <a href="https://kryptage.com" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-slate-900">
                kryptage.com
              </a>
            </Li>
          </ul>
          <P className="mt-4">Community channels are used for:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Protocol updates</Li>
            <Li>Governance discussions</Li>
            <Li>Educational content</Li>
            <Li>Community support (non-custodial)</Li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🏛️ Governance &amp; DAO</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>Voting: Snapshot / On-chain (when enabled)</Li>
            <Li>Proposals: Kryptage Improvement Proposals (KIPs)</Li>
            <Li>Discussions: Governance forum / Discord</Li>
          </ul>
          <P className="mt-4">Governance participation is permissionless but responsibility-driven.</P>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">🧑‍💻 Developers &amp; Open Source</h3>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              GitHub: <a href="https://github.com/twin74" target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4 hover:text-slate-900">github.com/twin74</a>
            </Li>
            <Li>
              Developer Docs: <a href="https://docs.kryptage.com/docs" target="_blank" rel="noreferrer" className="font-mono underline underline-offset-4 hover:text-slate-900">docs.kryptage.com/docs</a>
            </Li>
            <Li>Contract Verification: Linked from GitHub &amp; Docs</Li>
          </ul>
          <P className="mt-4">Developers are encouraged to:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Review code</Li>
            <Li>Submit issues</Li>
            <Li>Propose improvements via KIPs</Li>
          </ul>

          <SectionTitle>✉️ Contact &amp; Support</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">Official Contact</P>
          <P>
            Email: <a href="mailto:info@kryptage.com" className="font-mono underline underline-offset-4 hover:text-slate-900">info@kryptage.com</a>
          </P>
          <P className="mt-4 text-slate-900 font-semibold">For:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Partnerships</Li>
            <Li>Integrations</Li>
            <Li>Security disclosures</Li>
          </ul>
          <P className="mt-4">Never share sensitive information via email or chat.</P>

          <SectionTitle>🛡️ Security &amp; Reporting</SectionTitle>
          <ul className="mt-3 list-disc list-inside">
            <Li>
              Security disclosures: <a href="mailto:info@kryptage.com" className="font-mono underline underline-offset-4 hover:text-slate-900">info@kryptage.com</a>
            </Li>
            <Li>Responsible disclosure policy: Available in Docs</Li>
            <Li>Bug bounty: When announced</Li>
          </ul>
          <P className="mt-4">Security reports are treated with priority and confidentiality.</P>

          <SectionTitle>⚠️ Anti-Scam Reminder</SectionTitle>
          <P className="mt-4 text-slate-900 font-semibold">Kryptage will never:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Ask for private keys</Li>
            <Li>Offer guaranteed returns</Li>
            <Li>Request direct messages for support</Li>
            <Li>Run surprise airdrops via DMs</Li>
          </ul>

          <P className="mt-4 text-slate-900 font-semibold">If in doubt:</P>
          <ul className="mt-2 list-disc list-inside">
            <Li>Verify links here</Li>
            <Li>Ask publicly in official channels</Li>
            <Li>Do not rush</Li>
          </ul>

          <SectionTitle>🧠 Final Note</SectionTitle>
          <P>
            Kryptage is built:
            <br />
            In public
            <br />
            On-chain
            <br />
            With the community
          </P>
          <P className="mt-4">Thank you for being part of the Kryptage DAO.</P>
          <P className="mt-4 text-slate-900 font-semibold">Stable. Transparent. DAO-Governed.</P>
        </div>
      );

    default:
      return null;
  }
}
