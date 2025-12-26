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
  metadataBase: new URL("https://kryptage.com"),
  title: {
    default: "Kryptage DAO",
    template: "%s | Kryptage DAO",
  },
  description:
    "Kryptage is a non-custodial DeFi protocol built around USDK (a 1:1 stablecoin, non-algorithmic) and real yield vaults, governed by a DAO.",
  applicationName: "Kryptage DAO",
  keywords: [
    "Kryptage",
    "USDK",
    "stablecoin 1:1",
    "non-algorithmic stablecoin",
    "real yield",
    "DeFi vaults",
    "ERC-4626",
    "non-custodial",
    "DAO governance",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
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
