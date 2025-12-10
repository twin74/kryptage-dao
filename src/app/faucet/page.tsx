"use client";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("verified");
    setVerified(v === "1" || v === "true");
  }, []);

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
      const res = await fetch("/api/faucet/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
      const data = await res.json();
      if (res.ok) setStatus("Claim eseguito. Controlla il tuo wallet.");
      else setStatus(data.error || "Errore claim");
    } catch (e) {
      setStatus("Errore di rete durante il claim");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Faucet</h1>

      {!isConnected ? (
        <div className="space-y-2">
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => connect({ connector: c })}
              className="w-full rounded-md bg-black text-white py-2"
            >
              Connetti {c.name}
            </button>
          ))}
          {isPending && <p className="text-sm text-gray-600">Connessione in corso...</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">Connesso: {address}</p>
          <button onClick={() => disconnect()} className="rounded-md border px-3 py-2">
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

      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
}
