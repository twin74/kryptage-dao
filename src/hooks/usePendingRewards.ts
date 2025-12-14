const STABLE_CONTROLLER_ADDRESS = process.env.NEXT_PUBLIC_STABLE_CONTROLLER as `0x${string}`;

// This module was removed: the new protocol no longer exposes StableController.pendingRewards().
// Use `useVaultClaimableAssetsEthers` (shares -> assets via vault.convertToAssets) instead.

export const REMOVED_usePendingRewards = true;
