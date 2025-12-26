import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Web3Providers from "@/components/Web3Providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kryptage DAO",
  description:
    "Kryptage DAO is a real-yield DeFi protocol designed to generate sustainable returns from stable and crypto assets while preserving capital efficiency, transparency, and decentralization.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    // Hint crawlers to avoid generating rich previews/cards.
    // Not all platforms strictly follow this, but it's the strongest standards-based signal.
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0,
    },
  },
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}>
        <Header />
        <Web3Providers>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <Footer />
        </Web3Providers>
      </body>
    </html>
  );
}

export default RootLayout;
