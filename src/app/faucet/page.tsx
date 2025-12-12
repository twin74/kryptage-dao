"use client";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

export default function FaucetPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [ktgPoints, setKtgPoints] = useState<string>("0.0000");

  const KTG_POINTS = process.env.NEXT_PUBLIC_KTG_POINTS as string | undefined;

  const tokens = useMemo(() => {
    const iconFor = (symbol: string) => {
      switch (symbol) {
        case "USDC":
          return "/usdc.svg"; // local SVG
        case "WBTC":
          return "https://cdn.simpleicons.org/bitcoin"; // BTC icon for WBTC
        case "XAUT":
          return "/xaut.svg"; // local SVG
        case "SPYON":
          return "/SPY.svg"; // local SVG for S&P 500 ETF
        default:
          return "https://cdn.simpleicons.org/circle";
      }
    };
    const list = [
      { symbol: "USDC", address: process.env.NEXT_PUBLIC_TOKEN_USDC as string, decimals: 18 },
      { symbol: "WBTC", address: process.env.NEXT_PUBLIC_TOKEN_WBTC as string, decimals: 18 },
      { symbol: "XAUT", address: process.env.NEXT_PUBLIC_TOKEN_XAUT as string, decimals: 18 },
      { symbol: "SPYON", address: process.env.NEXT_PUBLIC_TOKEN_SPYON as string, decimals: 18 },
    ].filter(t => !!t.address);
    return list.map(t => ({ ...t, icon: iconFor(t.symbol) }));
  }, []);

  const refreshPoints = async (walletAddr: string) => {
    try {
      if (!KTG_POINTS || !(window as any).ethereum) {
        setKtgPoints("0.0000");
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const pointsAbi = [
        "function points(address) view returns (uint256)",
        "function pendingEarned(address) view returns (uint256)",
      ];
      const pointsC = new ethers.Contract(KTG_POINTS, pointsAbi, provider);
      const [p, pend] = await Promise.all([
        pointsC.points(walletAddr) as Promise<bigint>,
        pointsC.pendingEarned(walletAddr) as Promise<bigint>,
      ]);
      const total = (p ?? 0n) + (pend ?? 0n);
      setKtgPoints(
        Number(ethers.formatUnits(total, 18)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      );
    } catch {
      setKtgPoints("0.0000");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("verified");
    setVerified(v === "1" || v === "true");
    // Try to restore connection if already authorized
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.request({ method: "eth_accounts" }).then(async (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          setAddress(addr);
          setIsConnected(true);
          await refreshPoints(addr);
          // Check persisted verification in DB or localStorage
          const cached = localStorage.getItem(`faucet_verified_${addr.toLowerCase()}`);
          if (cached === "true") {
            setVerified(true);
          } else {
            try {
              const res = await fetch(`/api/faucet/status?wallet=${addr}`);
              const data = await res.json();
              if (res.ok && data.verified) {
                setVerified(true);
                localStorage.setItem(`faucet_verified_${addr.toLowerCase()}`, "true");
              }
            } catch {}
          }
        }
      });
      // Listen for account changes
      (window as any).ethereum.on?.("accountsChanged", async (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          setAddress(addr);
          setIsConnected(true);
          await refreshPoints(addr);
          const cached = localStorage.getItem(`faucet_verified_${addr.toLowerCase()}`);
          if (cached === "true") setVerified(true);
          else {
            try {
              const res = await fetch(`/api/faucet/status?wallet=${addr}`);
              const data = await res.json();
              if (res.ok && data.verified) {
                setVerified(true);
                localStorage.setItem(`faucet_verified_${addr.toLowerCase()}`, "true");
              } else {
                setVerified(false);
              }
            } catch {
              setVerified(false);
            }
          }
        } else {
          setAddress(null);
          setIsConnected(false);
          setVerified(false);
          setKtgPoints("0.0000");
        }
      });
    }
  }, [KTG_POINTS]);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      setStatus("Install MetaMask to continue.");
      return;
    }
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        await refreshPoints(accounts[0]);
        setStatus(null);
      }
    } catch (e: any) {
      setStatus(e?.message || "Wallet connection failed");
    }
  }

  function disconnectWallet() {
    // No real disconnect in EIP-1193; clear local state
    setAddress(null);
    setIsConnected(false);
    setKtgPoints("0.0000");
  }

  async function register() {
    setStatus("Sending request...");
    try {
      const res = await fetch("/api/faucet/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wallet: address }),
      });
      const data = await res.json();
      if (res.ok) setStatus("Check your email to confirm.");
      else setStatus(data.error || "Error");
    } catch (e) {
      setStatus("Network error");
    }
  }

  async function claim() {
    setStatus("Claim in progress...");
    try {
      if (!(window as any).ethereum) throw new Error("Wallet not available");
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
        setStatus(`You must wait ${seconds} more seconds before the next claim (cooldown active).`);
        return;
      }

      const tx = await contract.claim();
      await tx.wait();

      await refreshPoints(await signer.getAddress());
      setStatus("Claim executed. Check your wallet. (+10 KTG points)");
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
            setStatus(`You must wait ${seconds} more seconds before the next claim (cooldown active).`);
            return;
          }
        }
      } catch {}
      setStatus("Error during claim. Please try again later.");
    }
  }

  async function importToken(symbol: string, tokenAddress: string, decimals: number) {
    try {
      if (!(window as any).ethereum) throw new Error("MetaMask not available");
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
      if (wasAdded) setStatus(`${symbol} imported to MetaMask`);
      else setStatus(`Import of ${symbol} cancelled`);
    } catch (e: any) {
      setStatus(e?.message || `Error importing ${symbol}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Faucet</h1>
      <p className="text-sm text-gray-300">Get test tokens to try the dApp. Connect your wallet from the header, register your email once, then claim when eligible.</p>

      <div className="rounded-md border border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-200">
        <div className="font-semibold">KTG Points</div>
        <div className="mt-1">Current: <span className="font-mono">{ktgPoints}</span></div>
        <div className="mt-1 text-xs text-slate-300">Each faucet claim adds <span className="font-mono">+10</span> points (and updates daily accrual).</div>
      </div>

      {!verified ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="faucet-email">Email</label>
          <input
            id="faucet-email"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2"
          />
          <button onClick={register} disabled={!isConnected || !email} className="w-full rounded-md bg-blue-600 hover:bg-blue-500 text-white py-2 disabled:opacity-50">
            Register & Send Confirmation
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-green-700">Email verified. You can proceed with the claim.</p>
          <button onClick={claim} disabled={!isConnected} className="w-full rounded-md bg-blue-600 hover:bg-blue-500 text-white py-2 disabled:opacity-50">
            Execute Claim
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Available tokens</h2>
        <ul className="space-y-2">
          {tokens.map((t) => (
            <li key={t.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={t.icon} alt={`${t.symbol} icon`} className="h-6 w-6 rounded" />
                <div>
                  <p className="text-sm font-medium">{t.symbol}</p>
                  <p className="text-xs text-gray-500 break-all">{t.address}</p>
                </div>
              </div>
              <button
                onClick={() => importToken(t.symbol, t.address, t.decimals)}
                className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M2 7a3 3 0 0 1 3-3h13a2 2 0 1 1 0 4H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h13a2 2 0 1 1 0 4H5a3 3 0 0 1-3-3V7Z" />
                  <path d="M19 10a2 2 0 1 1 0 4h-6a2 2 0 1 1 0-4h6Z" />
                  <circle cx="19" cy="12" r="1" />
                </svg>
                import to Wallet
              </button>
            </li>
          ))}
        </ul>
      </div>

      {status && (
        <div
          className={
            `mt-4 rounded-md border p-3 text-sm ` +
            (status.includes("Claim executed")
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : status.includes("Check your email")
              ? "border-blue-300 bg-blue-50 text-blue-800"
              : status.includes("Error") || status.includes("error") || status.includes("failed")
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-gray-300 bg-gray-50 text-gray-800")
          }
        >
          {status}
        </div>
      )}

      {/* Moved Sepolia faucet link to the bottom */}
      <p className="text-sm text-blue-300">
        Need Sepolia ETH for fees? Get it here:
        <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-blue-400">Ethereum Sepolia Faucet</a>
      </p>
    </div>
  );
}
