import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ethers } from "ethers";

const faucetAbi = [
	{
		inputs: [
			{ internalType: "address", name: "user", type: "address" },
			{ internalType: "bool", name: "allowed", type: "bool" }
		],
		name: "setAllowed",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
] as const;

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const token = url.searchParams.get("token");
		if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

		const client = await clientPromise;
		const db = client.db("kryptage");
		const tokens = db.collection("faucet_tokens");
		const users = db.collection("faucet_users");

		const record = await tokens.findOne({ token, used: false });
		if (!record) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

		await users.updateOne({ wallet: record.wallet }, { $set: { verified: true, updatedAt: new Date() } });
		await tokens.updateOne({ token }, { $set: { used: true, usedAt: new Date() } });

		const rpcUrl = process.env.SEPOLIA_RPC_URL;
		const pk = process.env.DEPLOY_PRIVATE_KEY?.replace(/^0x/, "");
		const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as string;
		if (!rpcUrl || !pk || !faucetAddress) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

		const provider = new ethers.JsonRpcProvider(rpcUrl);
		const wallet = new ethers.Wallet(pk, provider);
		const faucet = new ethers.Contract(faucetAddress, faucetAbi, wallet);
		await faucet.setAllowed(record.wallet, true);

		return NextResponse.redirect(`${url.origin}/faucet?verified=1`);
	} catch (e) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
