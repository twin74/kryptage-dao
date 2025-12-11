"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

const usdkIcon = "/usdc.svg";
const susdkIcon = "/usdc.svg";

export default function Vault1Page() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [usdkInVault, setUsdkInVault] = useState<string>("0");
  const [susdkBalance, setSusdkBalance] = useState<string>("0");
  const [pendingRewards, setPendingRewards] = useState<string>("0");
  const [apy, setApy] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");

  const VAULT = process.env.NEXT_PUBLIC_STABLE_VAULT as string;
  const CONTROLLER = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as string;
  const FARM = process.env.NEXT_PUBLIC_STABLE_FARM as string;
  const USDK = process.env.NEXT_PUBLIC_TOKEN_USDK as string;
  const USDC = process.env.NEXT_PUBLIC_TOKEN_USDC as string;

  const usdcAbi = [
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
  ];
  const usdkAbi = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];
  const susdkAbi = [
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];
  const controllerAbi = [
    "function depositUSDC(uint256 amount)",
    "function withdrawShares(uint256 shares)",
    "function compoundGlobal()",
  ];
  const farmAbi = [
    "function pendingRewards() view returns (uint256)",
    "function stake(uint256 amount)",
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(p);
      p.send("eth_requestAccounts", []).then(async () => {
        const s = await p.getSigner();
        setSigner(s);
        setAddress(await s.getAddress());
      });
    }
  }, []);

  const formatUnits = (value: bigint, decimals = 18) => {
    try { return ethers.formatUnits(value, decimals); } catch { return "0"; }
  };

  const refresh = async () => {
    if (!provider || !address) return;
    setLoading(true);
    try {
      const usdkC = new ethers.Contract(USDK, usdkAbi, provider);
      const susdkC = new ethers.Contract(VAULT, susdkAbi, provider);
      const farmC = new ethers.Contract(FARM, farmAbi, provider);
      const usdcC = new ethers.Contract(USDC, usdcAbi, provider);

      const [usdkDec, susdkDec, usdcDec] = await Promise.all([
        usdkC.decimals(),
        susdkC.decimals(),
        usdcC.decimals(),
      ]);
      const [usdkBalVault, susdkBalUser, rewards, usdcBalUser] = await Promise.all([
        usdkC.balanceOf(VAULT),
        susdkC.balanceOf(address),
        farmC.pendingRewards(),
        usdcC.balanceOf(address),
      ]);
      setUsdkInVault(formatUnits(usdkBalVault, usdkDec));
      setSusdkBalance(formatUnits(susdkBalUser, susdkDec));
      setPendingRewards(formatUnits(rewards, 18));
      setUsdcBalance(formatUnits(usdcBalUser, usdcDec));
      // Simple APY placeholder: assume rewards per day from pending ~ linear → apy = (rewards * 365) / stake
      // In assenza di stake totale, mostrare un valore indicativo
      setApy("—");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [provider, address]);

  const onDeposit = async (amountStr: string) => {
    if (!provider || !signer) return;
    setLoading(true);
    setStatus("Attendi conferma dal wallet...");
    try {
      const usdcC = new ethers.Contract(USDC, usdcAbi, signer);
      const dec = await usdcC.decimals();
      const amount = ethers.parseUnits(amountStr || "0", dec);
      // Approve Controller to pull USDC from user
      await (await usdcC.approve(CONTROLLER, amount)).wait();
      // Call deposit on Controller
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.depositUSDC(amount)).wait();
      setStatus(null);
      setStatus("Deposito eseguito.");
      await refresh();
    } catch (e: any) {
      setStatus(e?.message || "Errore nel deposito");
    } finally {
      setLoading(false);
    }
  };

  const onWithdraw = async (sharesStr: string) => {
    if (!signer) return;
    setLoading(true);
    setStatus("Attendi conferma dal wallet...");
    try {
      const susdkC = new ethers.Contract(VAULT, susdkAbi, signer);
      const dec = await susdkC.decimals();
      const shares = ethers.parseUnits(sharesStr || "0", dec);
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.withdrawShares(shares)).wait();
      setStatus(null);
      setStatus("Prelievo eseguito.");
      await refresh();
    } catch (e: any) {
      setStatus(e?.message || "Errore nel prelievo");
    } finally {
      setLoading(false);
    }
  };

  const onCompound = async () => {
    if (!signer) return;
    setLoading(true);
    setStatus("Attendi conferma dal wallet...");
    try {
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.compoundGlobal()).wait();
      setStatus(null);
      setStatus("Compound eseguito.");
      await refresh();
    } catch (e: any) {
      setStatus(e?.message || "Errore nel compound");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">StableVault</h1>
      <div className="rounded-xl bg-white p-4 mb-2">
        <p className="text-sm text-gray-800">Deposita USDC, ricevi sUSDK, accumula rendimenti e preleva USDK. Tutte le operazioni sono gestite dal controller.</p>
      </div>
      <div className="space-y-6">
        <div className="rounded-xl border p-6 bg-white flex items-center gap-3 w-full">
          <img src={usdkIcon} alt="USDK" className="h-8 w-8 rounded" />
          <div>
            <div className="text-sm text-gray-600">USDK nel Vault</div>
            <div className="text-2xl font-bold text-gray-900">{usdkInVault}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-6 bg-white flex items-center gap-3 w-full">
            <img src={susdkIcon} alt="sUSDK" className="h-8 w-8 rounded" />
            <div>
              <div className="text-sm text-gray-600">sUSDK dell’utente</div>
              <div className="text-2xl font-bold text-gray-900">{susdkBalance}</div>
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-white w-48">
            <div className="text-sm text-gray-600">APY</div>
            <div className="text-xl font-semibold text-gray-900">{apy}</div>
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-white w-full">
          <div className="text-sm text-gray-600">Rendimento maturato (pending)</div>
          <div className="text-xl font-semibold text-gray-900">{pendingRewards}</div>
        </div>
      </div>
      <div className="rounded-xl border p-6 space-y-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Azioni</h2>
        <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const v = (e.target as any).amount.value; onDeposit(v); }}>
          <label className="block text-sm font-medium text-gray-700" htmlFor="vault-deposit">Deposita USDC</label>
          <div className="flex items-center gap-2">
            <input id="vault-deposit" name="amount" type="number" step="any" placeholder="USDC da depositare" className="w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-50" />
            <button type="button" className="rounded-md border px-3 py-2 text-gray-900" onClick={(e) => { const form = (e.currentTarget.closest("form") as any); if (form && form.amount) form.amount.value = usdcBalance; }}>Max</button>
            <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50" disabled={loading}>Deposita</button>
          </div>
        </form>
        <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const v = (e.target as any).shares.value; onWithdraw(v); }}>
          <label className="block text-sm font-medium text-gray-700" htmlFor="vault-withdraw">Preleva sUSDK</label>
          <div className="flex items-center gap-2">
            <input id="vault-withdraw" name="shares" type="number" step="any" placeholder="sUSDK da ritirare" className="w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-50" />
            <button type="button" className="rounded-md border px-3 py-2 text-gray-900" onClick={(e) => { const form = (e.currentTarget.closest("form") as any); if (form && form.shares) form.shares.value = susdkBalance; }}>Max</button>
            <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50" disabled={loading}>Withdraw</button>
          </div>
        </form>
        <button className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50 w-full" onClick={onCompound} disabled={loading}>Compound</button>
      </div>
      {status && (
        <div
          className={
            `mt-4 rounded-md border p-3 text-sm ` +
            (status.includes("eseguito")
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : status.includes("Errore") || status.includes("error") || status.includes("failed")
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-gray-300 bg-gray-50 text-gray-900")
          }
        >
          {status}
        </div>
      )}
    </div>
  );
}
