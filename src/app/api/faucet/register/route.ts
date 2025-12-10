import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, wallet } = await req.json();
    if (!email || !wallet) return NextResponse.json({ error: "Missing" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("kryptage");
    const col = db.collection("faucet_users");

    // Upsert user
    const token = crypto.randomBytes(16).toString("hex");
    await col.updateOne(
      { wallet },
      {
        $set: { email, wallet, verified: false },
        $setOnInsert: { createdAt: new Date(), tokens: [] },
        $addToSet: { tokens: token },
      },
      { upsert: true }
    );

    // TODO: send email with confirmation link including token
    // e.g. /api/faucet/confirm?token=...

    return NextResponse.json({ ok: true, message: "Check your email to confirm.", token });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
