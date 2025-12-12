"use client";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { Card, PageShell, PrimaryButton, SecondaryButton } from "@/components/UI";

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

  const refreshVerification = async (walletAddr: string) => {
    try {
      const res = await fetch(`/api/faucet/status?wallet=${walletAddr}`);
      const data = await res.json();
      if (res.ok && data.verified) {
        setVerified(true);
        localStorage.setItem(`faucet_verified_${walletAddr.toLowerCase()}`, "true");
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
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

          // Prefer server truth (DB + on-chain sync) over local cache
          await refreshVerification(addr);
        }
      });
    }

    // Listen for account changes
    (window as any).ethereum?.on?.("accountsChanged", async (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setAddress(addr);
        setIsConnected(true);
        await refreshPoints(addr);
        await refreshVerification(addr);
      } else {
        setAddress(null);
        setIsConnected(false);
        setVerified(false);
        setKtgPoints("0.0000");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      setStatus("Install MetaMask to continue.");
      return;
    }
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setAddress(addr);
        setIsConnected(true);
        await refreshPoints(addr);
        await refreshVerification(addr);
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
    <PageShell
      title="Faucet"
      subtitle="Get test tokens to try the dApp. Connect your wallet, register your email once, then claim when eligible."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="font-semibold text-slate-100">
            Need Sepolia ETH?{" "}
            <a
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Open Sepolia faucet
            </a>
          </div>
        </Card>

        <Card>
          <div className="font-semibold">KTG Points</div>
          <div className="mt-1">
            Current: <span className="font-mono">{ktgPoints}</span>
          </div>
          <div className="mt-1 text-xs text-slate-300">
            Each faucet claim adds <span className="font-mono">+10</span> points
          </div>
        </Card>
      </div>

      {!verified ? (
        <Card className="mt-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="faucet-email">
              Email
            </label>
            <input
              id="faucet-email"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-slate-100"
            />
            <PrimaryButton onClick={register} disabled={!isConnected || !email} className="w-full">
              Register & Send Confirmation
            </PrimaryButton>
            <div className="text-xs text-slate-400">
              You will receive a confirmation email. Once verified, your wallet will be allowed to claim.
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mt-6">
          <div className="space-y-2">
            <p className="text-sm text-emerald-300">Email verified. You can proceed with the claim.</p>
            <PrimaryButton onClick={claim} disabled={!isConnected} className="w-full">
              Execute Claim
            </PrimaryButton>
          </div>
        </Card>
      )}

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available tokens</h2>
          <SecondaryButton disabled={!isConnected} onClick={async () => address && refreshPoints(address)}>
            Refresh points
          </SecondaryButton>
        </div>
        <ul className="mt-4 space-y-2">
          {tokens.map((t) => (
            <li key={t.symbol} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/30 p-3">
              <div className="flex items-center gap-3">
                <img src={t.icon} alt={t.symbol} className="h-6 w-6 rounded" />
                <div>
                  <div className="text-sm font-semibold">{t.symbol}</div>
                  <div className="text-xs text-slate-400 font-mono">{t.address}</div>
                </div>
              </div>
              <SecondaryButton onClick={() => importToken(t.symbol, t.address, t.decimals)}>Import</SecondaryButton>
            </li>
          ))}
        </ul>
      </Card>

      {status && (
        <div className="mt-6 rounded-md border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">{status}</div>
      )}
    </PageShell>
  );
}
