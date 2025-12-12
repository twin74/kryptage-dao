import { useAccount, useReadContract } from 'wagmi';
import StableControllerAbi from '../abi/StableController.json';

const STABLE_CONTROLLER_ADDRESS = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as `0x${string}`;

export function usePendingRewards() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: STABLE_CONTROLLER_ADDRESS,
    abi: StableControllerAbi,
    functionName: 'pendingRewards',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  return {
    pendingRewards: data,
    isLoading,
    refetch,
  };
}
