import { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract } from 'ethers';
import StableControllerAbi from '@/abi/StableController.json';

const STABLE_CONTROLLER_ADDRESS = process.env.NEXT_PUBLIC_STABLE_CONTROLLER!;
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL;

export function usePendingRewardsEthers(userAddress?: string) {
  const [pendingRewards, setPendingRewards] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userAddress) return;
    setIsLoading(true);
    const provider = new JsonRpcProvider(SEPOLIA_RPC_URL);
    const contract = new Contract(STABLE_CONTROLLER_ADDRESS, StableControllerAbi, provider);
    contract.pendingRewards(userAddress)
      .then((res: bigint) => setPendingRewards(res.toString()))
      .finally(() => setIsLoading(false));
  }, [userAddress]);

  return { pendingRewards, isLoading };
}
