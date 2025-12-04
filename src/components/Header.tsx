"use client";
import Link from 'next/link';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <KLogo className="h-8 w-8" />
          <span className="font-semibold">Kryptage DAO</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/vault" className="hover:text-blue-400">Vault</Link>
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/docs" className="hover:text-blue-400">Docs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ConnectButton chainStatus="icon" showBalance={false} accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <span className="i-[hamburger]">☰</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-800">
          <nav className="px-4 py-2 flex flex-col gap-2">
            <Link href="/" onClick={() => setOpen(false)} className="hover:text-blue-400">Home</Link>
            <Link href="/vault" onClick={() => setOpen(false)} className="hover:text-blue-400">Vault</Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="hover:text-blue-400">Dashboard</Link>
            <Link href="/docs" onClick={() => setOpen(false)} className="hover:text-blue-400">Docs</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function KLogo({ className = '' }: { className?: string }) {
  // Hexagonal K logo SVG
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <polygon points="60,5 110,35 110,85 60,115 10,85 10,35" fill="#0f172a" stroke="url(#g)" strokeWidth="6" />
      <path d="M40 30 v60 M40 60 l40 -30 M40 60 l40 30" stroke="url(#g)" strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  );
}
