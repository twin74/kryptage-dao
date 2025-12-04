import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

const Web3Providers = dynamic(() => import("@/components/Web3Providers"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Kryptage DAO",
  description: "Kryptage DAO frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}>
        <Web3Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Web3Providers>
      </body>
    </html>
  );
}
