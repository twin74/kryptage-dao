import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ethers } from "ethers";

const faucetAbi = [
  "function allowed(address) view returns (bool)",
  "function setAllowed(address user, bool ok) external",
] as const;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletRaw = searchParams.get("wallet") || "";
    const wallet = walletRaw.toLowerCase();
    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kryptage");

    const user = await db.collection("faucet_users").findOne({ wallet });
    const verified = !!user?.verified;

    // If DB says verified, ensure on-chain faucet.allowed(wallet) is also true (auto-sync)
    let allowedOnchain: boolean | null = null;
    let synced = false;
    if (verified) {
      try {
        const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as string;
        const rpcUrl = process.env.SEPOLIA_RPC_URL;
        const pk = process.env.DEPLOY_PRIVATE_KEY?.replace(/^0x/, "");

        if (faucetAddress && rpcUrl) {
          const provider = new ethers.JsonRpcProvider(rpcUrl);
          const faucetView = new ethers.Contract(faucetAddress, faucetAbi, provider);
          allowedOnchain = (await faucetView.allowed(wallet)) as boolean;

          if (!allowedOnchain && pk) {
            const signer = new ethers.Wallet(pk, provider);
            const faucet = new ethers.Contract(faucetAddress, faucetAbi, signer);
            const tx = await faucet.setAllowed(wallet, true);
            await tx.wait();
            synced = true;
            allowedOnchain = true;
          }
        }
      } catch {
        // keep status endpoint resilient; do not fail DB lookup because chain call failed
      }
    }

    return NextResponse.json({ verified, allowedOnchain, synced });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
