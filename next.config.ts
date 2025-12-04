import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        pino: "pino/browser",
        "pino-pretty": false,
        "thread-stream": false,
        "sonic-boom": false,
        tap: false,
        tape: false,
        "why-is-node-running": false,
        "pino-elasticsearch": false,
        desm: false,
        fastbench: false,
      },
    },
  },
  // Force Webpack instead of Turbopack to avoid WalletConnect/thread-stream test files issues during build
  turbo: { enabled: false },
  reactCompiler: true,
};

export default nextConfig;
