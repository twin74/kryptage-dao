"use client";
import { PropsWithChildren, useMemo } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";

export default function Web3Providers({ children }: PropsWithChildren<{}>) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const rpcUrl =
    process.env.NEXT_PUBLIC_RPC_URL || process.env.SEPOLIA_RPC_URL || "";
  const config = useMemo(
    () =>
      createConfig({
        chains: [sepolia],
        transports: {
          [sepolia.id]: http(rpcUrl),
        },
      }),
    [rpcUrl]
  );

  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
