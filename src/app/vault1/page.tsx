"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

export default function Vault1Page() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
    try {
      const usdcC = new ethers.Contract(USDC, usdcAbi, signer);
      const dec = await usdcC.decimals();
      const amount = ethers.parseUnits(amountStr || "0", dec);
      // Approve Controller to pull USDC from user
      await (await usdcC.approve(CONTROLLER, amount)).wait();
      // Call deposit on Controller
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.depositUSDC(amount)).wait();
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const onWithdraw = async (sharesStr: string) => {
    if (!signer) return;
    setLoading(true);
    try {
      const susdkC = new ethers.Contract(VAULT, susdkAbi, signer);
      const dec = await susdkC.decimals();
      const shares = ethers.parseUnits(sharesStr || "0", dec);
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.withdrawShares(shares)).wait();
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const onCompound = async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const controllerC = new ethers.Contract(CONTROLLER, controllerAbi, signer);
      await (await controllerC.compoundGlobal()).wait();
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">StableVault</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">USDK nel Vault</div>
          <div className="text-xl font-medium">{usdkInVault}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">sUSDK dell’utente</div>
          <div className="text-xl font-medium">{susdkBalance}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Rendimento maturato (pending)</div>
          <div className="text-xl font-medium">{pendingRewards}</div>
        </div>
      </div>
      <div className="rounded-xl border p-4">
        <div className="text-sm text-gray-500">APY</div>
        <div className="text-xl font-medium">{apy}</div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <h2 className="text-lg font-semibold">Azioni</h2>
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); const v = (e.target as any).amount.value; onDeposit(v); }}>
          <input name="amount" type="number" step="any" placeholder="USDC da depositare" className="input input-bordered w-full p-2 border rounded" />
          <button type="button" className="px-3 py-2 rounded border" onClick={(e) => { const form = (e.currentTarget.closest("form") as any); if (form && form.amount) form.amount.value = usdcBalance; }}>Max</button>
          <button className="btn px-4 py-2 rounded bg-black text-white" disabled={loading}>Deposita</button>
        </form>
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); const v = (e.target as any).shares.value; onWithdraw(v); }}>
          <input name="shares" type="number" step="any" placeholder="sUSDK da ritirare" className="input input-bordered w-full p-2 border rounded" />
          <button type="button" className="px-3 py-2 rounded border" onClick={(e) => { const form = (e.currentTarget.closest("form") as any); if (form && form.shares) form.shares.value = susdkBalance; }}>Max</button>
          <button className="btn px-4 py-2 rounded bg-black text-white" disabled={loading}>Withdraw</button>
        </form>
        <button className="btn px-4 py-2 rounded bg-black text-white" onClick={onCompound} disabled={loading}>Compound</button>
      </div>
    </div>
  );
}
