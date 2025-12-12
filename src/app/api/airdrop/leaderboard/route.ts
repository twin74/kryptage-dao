import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ethers } from "ethers";

const pointsAbi = [
  "function points(address) view returns (uint256)",
  "function pendingEarned(address) view returns (uint256)",
] as const;

type LeaderboardEntry = {
  wallet: string;
  points1e18: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get("limit") || "10");
    const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(100, limitParam)) : 10;

    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const pointsAddress = process.env.NEXT_PUBLIC_KTG_POINTS;
    if (!rpcUrl || !pointsAddress) {
      return NextResponse.json({ error: "Missing SEPOLIA_RPC_URL or NEXT_PUBLIC_KTG_POINTS" }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db("kryptage");

    // Only MongoDB users (optionally restrict to verified)
    const cursor = db
      .collection("faucet_users")
      .find({ verified: true }, { projection: { wallet: 1 } });

    const users = await cursor.toArray();
    const wallets = users
      .map((u: any) => (typeof u?.wallet === "string" ? u.wallet.toLowerCase() : ""))
      .filter((w: string) => /^0x[a-f0-9]{40}$/.test(w));

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const pointsC = new ethers.Contract(pointsAddress, pointsAbi, provider);

    // Batch with limited concurrency to avoid RPC rate limits.
    const concurrency = 10;
    const results: LeaderboardEntry[] = [];

    for (let i = 0; i < wallets.length; i += concurrency) {
      const chunk = wallets.slice(i, i + concurrency);
      const chunkRes = await Promise.all(
        chunk.map(async (wallet) => {
          try {
            const [p, pend] = await Promise.all([
              pointsC.points(wallet) as Promise<bigint>,
              pointsC.pendingEarned(wallet) as Promise<bigint>,
            ]);
            const total = (p ?? 0n) + (pend ?? 0n);
            return { wallet, points1e18: total.toString() } as LeaderboardEntry;
          } catch {
            return { wallet, points1e18: "0" } as LeaderboardEntry;
          }
        })
      );
      results.push(...chunkRes);
    }

    results.sort((a, b) => {
      const aa = BigInt(a.points1e18);
      const bb = BigInt(b.points1e18);
      return aa === bb ? 0 : aa > bb ? -1 : 1;
    });

    const top = results.slice(0, limit);

    return NextResponse.json({ count: top.length, entries: top });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
