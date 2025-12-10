import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ethers } from "ethers";

const faucetAbi = [
  "function setAllowed(address user, bool ok) external",
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("kryptage");
    const col = db.collection("faucet_users");

    const doc = await col.findOne({ tokens: token });
    if (!doc) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    await col.updateOne({ _id: doc._id }, { $set: { verified: true, verifiedAt: new Date() } });

    // Call faucet.setAllowed(wallet, true) using server signer (owner)
    const rpcUrl = process.env.SEPOLIA_RPC_URL!;
    const pk = process.env.DEPLOY_PRIVATE_KEY!; // consider a dedicated faucet admin key
    const faucetAddr = process.env.NEXT_PUBLIC_FAUCET_ADDRESS!;

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(pk, provider);
    const faucet = new ethers.Contract(faucetAddr, faucetAbi, wallet);
    const tx = await faucet.setAllowed(doc.wallet, true);
    await tx.wait();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
