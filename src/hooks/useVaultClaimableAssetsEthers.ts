import { useEffect, useMemo, useState } from "react";
import { Contract, JsonRpcProvider, ethers } from "ethers";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STABLE_VAULT;

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const FALLBACK_INFURA_RPC = INFURA_KEY ? `https://sepolia.infura.io/v3/${INFURA_KEY}` : undefined;

const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  process.env.SEPOLIA_RPC_URL ||
  FALLBACK_INFURA_RPC;

// Minimal ERC4626-like / sUSDK ABI we need.
const vaultAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
] as const;

export type VaultClaimableAssets = {
  sharesRaw: bigint;
  assetsRaw: bigint;
  sharesFormatted: string;
  assetsFormatted: string;
};

const ZERO: VaultClaimableAssets = {
  sharesRaw: 0n,
  assetsRaw: 0n,
  sharesFormatted: "0",
  assetsFormatted: "0",
};

export function useVaultClaimableAssetsEthers(userAddress?: string) {
  const [data, setData] = useState<VaultClaimableAssets>(ZERO);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const provider = useMemo(() => {
    if (!SEPOLIA_RPC_URL) return null;
    return new JsonRpcProvider(SEPOLIA_RPC_URL);
  }, []);

  const refetch = async (): Promise<VaultClaimableAssets> => {
    // Diagnose missing config explicitly (avoid silent zeros)
    if (!userAddress) {
      setError(null);
      setData(ZERO);
      return ZERO;
    }

    if (!VAULT_ADDRESS) {
      const msg = "Missing NEXT_PUBLIC_STABLE_VAULT (build-time env)";
      setError(msg);
      setData(ZERO);
      return ZERO;
    }

    if (!SEPOLIA_RPC_URL || !provider) {
      const msg = "Missing SEPOLIA RPC URL (set NEXT_PUBLIC_SEPOLIA_RPC_URL or SEPOLIA_RPC_URL or NEXT_PUBLIC_INFURA_API_KEY)";
      setError(msg);
      setData(ZERO);
      return ZERO;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Helpful client-side trace (shows effective config used in the deployed build)
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.debug("[useVaultClaimableAssetsEthers]", {
          vault: VAULT_ADDRESS,
          rpc: SEPOLIA_RPC_URL,
          user: userAddress,
        });
      }

      const vault = new Contract(VAULT_ADDRESS, vaultAbi, provider);
      const [sharesRaw, dec] = await Promise.all([
        vault.balanceOf(userAddress) as Promise<bigint>,
        vault.decimals() as Promise<number>,
      ]);

      const assetsRaw = (await vault.convertToAssets(sharesRaw)) as bigint;

      const next: VaultClaimableAssets = {
        sharesRaw,
        assetsRaw,
        sharesFormatted: ethers.formatUnits(sharesRaw, dec),
        assetsFormatted: ethers.formatUnits(assetsRaw, 6),
      };

      setData(next);
      return next;
    } catch (e: any) {
      setError(e?.reason || e?.message || "Failed to read vault state");
      setData(ZERO);
      return ZERO;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return { data, isLoading, error, refetch };
}
