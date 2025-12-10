"use client";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const TOKENS = [
  { symbol: "USDC", address: process.env.NEXT_PUBLIC_TOKEN_USDC! },
  { symbol: "WBTC", address: process.env.NEXT_PUBLIC_TOKEN_WBTC! },
  { symbol: "XAUT", address: process.env.NEXT_PUBLIC_TOKEN_XAUT! },
  { symbol: "SPYON", address: process.env.NEXT_PUBLIC_TOKEN_SPYON! },
];

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [claiming, setClaiming] = useState(false);

  const handleRegister = async () => {
    if (!address) return;
    setStatus("Invio richiesta...");
    const res = await fetch("/api/faucet/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, wallet: address }),
    });
    const data = await res.json();
    if (res.ok) setStatus("Controlla la tua email per confermare.");
    else setStatus(data.error || "Errore");
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const faucetAddr = process.env.NEXT_PUBLIC_FAUCET_ADDRESS!;
      const abi = [
        "function claim()",
      ];
      const contract = new ethers.Contract(faucetAddr, abi, signer);
      const tx = await contract.claim();
      setStatus("Transazione inviata: " + tx.hash);
      await tx.wait();
      setStatus("Token ricevuti.");
    } catch (e: any) {
      setStatus(e?.message || "Errore claim");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Faucet</h1>
      {!isConnected ? (
        <button className="btn" onClick={() => connect({ connector: connectors[0] })}>
          Connetti Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <div>Wallet: {address}</div>
          <button className="btn" onClick={() => disconnect()}>Disconnetti</button>
        </div>
      )}

      <div className="space-y-2">
        <label>Email</label>
        <input className="input w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn" onClick={handleRegister} disabled={!isConnected || !email}>
          Registra & Conferma via email
        </button>
      </div>

      <div className="space-y-2">
        <div className="text-sm">Token distributi:</div>
        <ul className="list-disc ml-5">
          {TOKENS.map((t) => (
            <li key={t.address}>{t.symbol} - {t.address}</li>
          ))}
        </ul>
      </div>

      <button className="btn" onClick={handleClaim} disabled={!isConnected || claiming}>
        Claim test tokens
      </button>

      {status && <div className="text-sm text-gray-700">{status}</div>}
    </div>
  );
}
