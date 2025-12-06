"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BrowserProvider, getAddress } from 'ethers';

type Ethereumish = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
};

type EthWindow = Window & { ethereum?: Ethereumish };

export default function Header() {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // hydrate account on mount
  useEffect(() => {
    const eth = (window as EthWindow).ethereum;
    if (!eth) return;
    (async () => {
      try {
        const accounts: string[] = await eth.request({ method: 'eth_accounts' });
        if (accounts?.[0]) setAddress(getAddress(accounts[0]));
        const cid: string = await eth.request({ method: 'eth_chainId' });
        setChainId(cid);
      } catch {}
    })();

    const onAccountsChanged = (accs: string[]) => setAddress(accs[0] ? getAddress(accs[0]) : null);
    const onChainChanged = (cid: string) => setChainId(cid);
    eth.on?.('accountsChanged', onAccountsChanged);
    eth.on?.('chainChanged', onChainChanged);
    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged);
      eth.removeListener?.('chainChanged', onChainChanged);
    };
  }, []);

  const connect = async () => {
    const eth = (window as EthWindow).ethereum;
    if (!eth) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    try {
      setConnecting(true);
      // ensure Sepolia (0xaa36a7)
      const sepolia = { chainId: '0xaa36a7' };
      try {
        await eth.request({ method: 'wallet_switchEthereumChain', params: [sepolia] });
      } catch (e: any) {
        if (e?.code === 4902) {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.infura.io/v3/' + (process.env.NEXT_PUBLIC_INFURA_API_KEY || '')],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        }
      }
      const provider = new BrowserProvider(eth as any);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(getAddress(addr));
      const cid: string = await eth.request({ method: 'eth_chainId' });
      setChainId(cid);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    // No standard EIP-1193 disconnect; clear local state
    setAddress(null);
  };

  const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
  const isSepolia = chainId?.toLowerCase() === '0xaa36a7';

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
          <Link href="/governance" className="hover:text-blue-400">Governance</Link>
          <Link href="/airdrop" className="hover:text-blue-400">Airdrop</Link>
        </nav>
        <div className="flex items-center gap-3">
          {address ? (
            <div className="flex items-center gap-2">
              {!isSepolia && (
                <span className="rounded bg-amber-600/30 text-amber-300 px-2 py-1 text-xs">Wrong network</span>
              )}
              <button onClick={disconnect} className="rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-500">
                {short(address)}
              </button>
            </div>
          ) : (
            <button onClick={connect} disabled={connecting} className="rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-500 disabled:opacity-50">
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
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
            <Link href="/governance" onClick={() => setOpen(false)} className="hover:text-blue-400">Governance</Link>
            <Link href="/airdrop" onClick={() => setOpen(false)} className="hover:text-blue-400">Airdrop</Link>
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
