import { useEffect, useMemo, useState } from "react";
import { Contract, JsonRpcProvider, ethers } from "ethers";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STABLE_VAULT!;
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL;

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

export function useVaultClaimableAssetsEthers(userAddress?: string) {
  const [data, setData] = useState<VaultClaimableAssets>({
    sharesRaw: 0n,
    assetsRaw: 0n,
    sharesFormatted: "0",
    assetsFormatted: "0",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const provider = useMemo(() => {
    if (!SEPOLIA_RPC_URL) return null;
    return new JsonRpcProvider(SEPOLIA_RPC_URL);
  }, []);

  const refetch = async () => {
    if (!userAddress || !provider) return;
    setIsLoading(true);
    setError(null);

    try {
      const vault = new Contract(VAULT_ADDRESS, vaultAbi, provider);
      const [sharesRaw, dec] = await Promise.all([
        vault.balanceOf(userAddress) as Promise<bigint>,
        vault.decimals() as Promise<number>,
      ]);

      const assetsRaw = (await vault.convertToAssets(sharesRaw)) as bigint;

      setData({
        sharesRaw,
        assetsRaw,
        // shares are sUSDK (same decimals as vault shares)
        sharesFormatted: ethers.formatUnits(sharesRaw, dec),
        // assets are USDK (USDK is 6 decimals in this project)
        assetsFormatted: ethers.formatUnits(assetsRaw, 6),
      });
    } catch (e: any) {
      setError(e?.reason || e?.message || "Failed to read vault state");
      setData({
        sharesRaw: 0n,
        assetsRaw: 0n,
        sharesFormatted: "0",
        assetsFormatted: "0",
      });
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
