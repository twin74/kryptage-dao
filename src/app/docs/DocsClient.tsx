"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card } from "@/components/UI";

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

function isValidId(id: string | null): id is DocChapterId {
  return !!id && CHAPTERS.some((c) => c.id === id);
}

function getHashChapter(): DocChapterId {
  if (typeof window === "undefined") return CHAPTERS[0].id;
  const raw = (window.location.hash || "").replace(/^#/, "");
  return isValidId(raw) ? raw : CHAPTERS[0].id;
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
                transparency, and decentralization.
                <br />
                This section will guide you step by step, from understanding Kryptage in under a minute to making your first interaction on-chain.
              </p>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/M5sgnB8X/ktg-MM-2.png" alt="Connect wallet to Kryptage" className="h-auto w-1/2 max-w-full" loading="lazy" />
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/yLspZZ5/fl-1.png" alt="Deposit → Yield → Withdraw flow" className="w-full h-auto" loading="lazy" />
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

          <div className="mt-6">
            <Link
              href="#ecosystem"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
            >
              Next: 2) Ecosystem →
            </Link>
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
                The Kryptage Ecosystem is designed as a modular, risk-aware, real-yield infrastructure for decentralized finance. Instead of chasing unsustainable APYs,
                Kryptage focuses on capital preservation, predictable yield, and DAO-aligned incentives, making it suitable for both retail users and institutional integrations.
              </P>
            </div>
            <Badge tone="green">EN</Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/ccjySMyh/fl-2.png" alt="Kryptage ecosystem overview" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>🧱 The Real Yield Layer — Why Kryptage Exists</SectionTitle>
          <P>Most DeFi yields fall into one of these categories:</P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Token emissions (inflationary)</Li>
            <Li>Speculative leverage</Li>
            <Li>Reflexive algorithms</Li>
          </ul>
          <P className="mt-4">
            Kryptage is different. It is built as a <b>Real Yield Layer</b>, meaning:
          </P>
          <ul className="mt-3 list-disc list-inside">
            <Li>Yield comes from productive on-chain activity</Li>
            <Li>Revenue is measurable and auditable</Li>
            <Li>Returns are not dependent on new users</Li>
          </ul>

          <SectionTitle>🧭 High-Level Architecture</SectionTitle>
          <P>At a high level, Kryptage is composed of independent but interconnected modules.</P>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/TDdZBrPc/fl3.png" alt="High-level architecture" className="w-full h-auto" loading="lazy" />
          </div>

          <SectionTitle>🧠 Design Principles</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.ibb.co/xKGrGPcJ/fl5.png" alt="Design principles" className="w-full h-auto" loading="lazy" />
          </div>
        </div>
      );

    default:
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{CHAPTERS.find((c) => c.id === chapter)?.title}</h1>
          <P>Coming soon.</P>
        </div>
      );
  }
}

export default function DocsClient() {
  const [selected, setSelected] = useState<DocChapterId>(CHAPTERS[0].id);

  useEffect(() => {
    const update = () => setSelected(getHashChapter());
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:h-[calc(100vh-220px)]">
      <Card className="md:col-span-1 bg-white border-slate-200 md:sticky md:top-6 md:self-start">
        <div className="text-xs font-semibold text-slate-700">Table of Contents</div>
        <div className="mt-3 space-y-1">
          {CHAPTERS.map((c) => {
            const active = c.id === selected;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {c.title}
              </a>
            );
          })}
        </div>
      </Card>

      <Card className="md:col-span-3 bg-white border-slate-200 md:overflow-y-auto md:h-full">
        <DocContent chapter={selected} />
      </Card>
    </div>
  );
}
