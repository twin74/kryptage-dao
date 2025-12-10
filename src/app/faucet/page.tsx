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
      // Removed USDK per request
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
      const abi = [
        "function claim() external",
        "function remainingCooldown(address user) view returns (uint256)",
      ];
      const contract = new ethers.Contract(faucetAddress, abi, signer);

      // Pre-check cooldown
      const rc: bigint = await contract.remainingCooldown(await signer.getAddress());
      if (rc > BigInt(0)) {
        const seconds = Number(rc);
        setStatus(`Devi attendere ancora ${seconds} secondi prima del prossimo prelievo (cooldown attivo).`);
        return;
      }

      const tx = await contract.claim();
      await tx.wait();
      setStatus("Claim eseguito. Controlla il tuo wallet.");
    } catch (e: any) {
      // Try to provide a friendly message if cooldown likely caused the revert or nonce error occurred
      try {
        if ((window as any).ethereum) {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as string;
          const abi = ["function remainingCooldown(address user) view returns (uint256)"];
          const contractView = new ethers.Contract(faucetAddress, abi, provider);
          const rc: bigint = await contractView.remainingCooldown(await signer.getAddress());
          if (rc > BigInt(0)) {
            const seconds = Number(rc);
            setStatus(`Devi attendere ancora ${seconds} secondi prima del prossimo prelievo (cooldown attivo).`);
            return;
          }
        }
      } catch {}
      setStatus("Errore durante il claim. Riprova più tardi.");
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
          <button onClick={connectWallet} className="w-full rounded-md bg-blue-600 hover:bg-blue-500 text-white py-2">
            Connetti Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-200">Connesso: {address}</p>
          <button onClick={disconnectWallet} className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-2">
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
          <button onClick={register} disabled={!isConnected || !email} className="w-full rounded-md bg-blue-600 hover:bg-blue-500 text-white py-2 disabled:opacity-50">
            Registra & Invia conferma
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-green-700">Email verificata. Puoi procedere al claim.</p>
          <button onClick={claim} disabled={!isConnected} className="w-full rounded-md bg-blue-600 hover:bg-blue-500 text-white py-2 disabled:opacity-50">
            Esegui Claim
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Token disponibili</h2>
        <p className="text-sm text-blue-300">
          Hai bisogno di ETH di Sepolia per le fee? Prendili qui:
          <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-blue-400">Ethereum Sepolia Faucet</a>
        </p>
        <ul className="space-y-2">
          {tokens.map((t) => (
            <li key={t.symbol} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t.symbol}</p>
                <p className="text-xs text-gray-500 break-all">{t.address}</p>
              </div>
              <button
                onClick={() => importToken(t.symbol, t.address, t.decimals)}
                className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-sm"
              >
                importa su Wallet
              </button>
            </li>
          ))}
        </ul>
      </div>

      {status && (
        <div
          className={
            `mt-4 rounded-md border p-3 text-sm ` +
            (status.includes("Claim eseguito")
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : status.includes("Controlla la tua email")
              ? "border-blue-300 bg-blue-50 text-blue-800"
              : status.includes("Errore") || status.includes("fallita")
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-gray-300 bg-gray-50 text-gray-800")
          }
        >
          {status}
        </div>
      )}
    </div>
  );
}
