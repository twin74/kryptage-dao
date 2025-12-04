"use client";
import { ReactNode, useMemo } from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { http } from "viem";
import { sepolia } from "wagmi/chains";
import { injected, coinbaseWallet } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Web3Providers({ children }: { children: ReactNode }) {
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || "";
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Kryptage DAO";

  const config = useMemo(() => {
    return createConfig({
      chains: [sepolia],
      connectors: [
        injected({ shimDisconnect: true }),
        coinbaseWallet({ appName }),
      ],
      transports: {
        [sepolia.id]: http(`https://sepolia.infura.io/v3/${infuraKey}`),
      },
      ssr: true,
    });
  }, [appName, infuraKey]);

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
