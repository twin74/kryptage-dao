"use client";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

export default function FaucetPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const tokens = useMemo(() => {
    return [
      { symbol: "USDK", address: process.env.NEXT_PUBLIC_TOKEN_USDK as string, decimals: 18 },
      { symbol: "USDC", address: process.env.NEXT_PUBLIC_TOKEN_USDC as string, decimals: 18 },
      { symbol: "WBTC", address: process.env.NEXT_PUBLIC_TOKEN_WBTC as string, decimals: 18 },
      { symbol: "XAUT", address: process.env.NEXT_PUBLIC_TOKEN_XAUT as string, decimals: 18 },
      { symbol: "SPYON", address: process.env.NEXT_PUBLIC_TOKEN_SPYON as string, decimals: 18 },
    ].filter(t => !!t.address);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("verified");
    setVerified(v === "1" || v === "true");
    // Try to restore connection if already authorized
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      });
      // Listen for account changes
      (window as any).ethereum.on?.("accountsChanged", (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      });
    }
  }, []);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      setStatus("Installa MetaMask per continuare.");
      return;
    }
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setStatus(null);
      }
    } catch (e: any) {
      setStatus(e?.message || "Connessione wallet fallita");
    }
  }

  function disconnectWallet() {
    // No real disconnect in EIP-1193; clear local state
    setAddress(null);
    setIsConnected(false);
  }

  async function register() {
    setStatus("Invio richiesta...");
    try {
      const res = await fetch("/api/faucet/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wallet: address }),
      });
      const data = await res.json();
      if (res.ok) setStatus("Controlla la tua email per confermare.");
      else setStatus(data.error || "Errore");
    } catch (e) {
      setStatus("Errore di rete");
    }
  }

  async function claim() {
    setStatus("Claim in corso...");
    try {
      if (!(window as any).ethereum) throw new Error("Wallet non disponibile");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as string;
      const abi = ["function claim() external"];
      const contract = new ethers.Contract(faucetAddress, abi, signer);
      const tx = await contract.claim();
      await tx.wait();
      setStatus("Claim eseguito. Controlla il tuo wallet.");
    } catch (e: any) {
      setStatus(e?.message || "Errore durante il claim");
    }
  }

  async function importToken(symbol: string, tokenAddress: string, decimals: number) {
    try {
      if (!(window as any).ethereum) throw new Error("MetaMask non disponibile");
      const wasAdded = await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol,
            decimals,
          },
        },
      });
      if (wasAdded) setStatus(`${symbol} importato su MetaMask`);
      else setStatus(`Import di ${symbol} annullato`);
    } catch (e: any) {
      setStatus(e?.message || `Errore import ${symbol}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Faucet</h1>

      {!isConnected ? (
        <div className="space-y-2">
          <button onClick={connectWallet} className="w-full rounded-md bg-black text-white py-2">
            Connetti Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">Connesso: {address}</p>
          <button onClick={disconnectWallet} className="rounded-md border px-3 py-2">
            Disconnetti
          </button>
        </div>
      )}

      {!verified ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2"
          />
          <button onClick={register} disabled={!isConnected || !email} className="w-full rounded-md bg-blue-600 text-white py-2 disabled:opacity-50">
            Registra & Invia conferma
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-green-700">Email verificata. Puoi procedere al claim.</p>
          <button onClick={claim} disabled={!isConnected} className="w-full rounded-md bg-emerald-600 text-white py-2 disabled:opacity-50">
            Esegui Claim
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Token disponibili</h2>
        <ul className="space-y-2">
          {tokens.map((t) => (
            <li key={t.symbol} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t.symbol}</p>
                <p className="text-xs text-gray-500 break-all">{t.address}</p>
              </div>
              <button
                onClick={() => importToken(t.symbol, t.address, t.decimals)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Importa su MetaMask
              </button>
            </li>
          ))}
        </ul>
      </div>

      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
}
