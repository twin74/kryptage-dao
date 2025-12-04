"use client";
import { ReactNode, useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { http } from "viem";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

export default function Web3Providers({ children }: { children: ReactNode }) {
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || "";
  const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || "";
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Kryptage DAO";

  const config = useMemo(() => {
    return getDefaultConfig({
      appName,
      projectId,
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(`https://sepolia.infura.io/v3/${infuraKey}`),
      },
      ssr: true,
    });
  }, [appName, projectId, infuraKey]);

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#1d4ed8" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
