import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email, wallet } = await req.json();
    if (!email || !wallet) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("kryptage");
    const users = db.collection("faucet_users");

    const token = new ObjectId().toHexString();
    const now = new Date();

    await users.updateOne(
      { wallet },
      {
        $set: { email, wallet, verified: false, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
    await db.collection("faucet_tokens").insertOne({ token, wallet, email, createdAt: now, used: false });

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const confirmUrl = `${origin}/api/faucet/confirm?token=${token}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "no-reply@kryptage.com";
    if (!resendApiKey) return NextResponse.json({ error: "Email not configured" }, { status: 500 });

    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from,
      to: email,
      subject: "Verify your email for Kryptage Faucet",
      html: `
        <p>Hi,</p>
        <p>Please verify your email to access the Kryptage Faucet.</p>
        <p><a href="${confirmUrl}">Click here to confirm</a></p>
        <p>If you did not request this, ignore this message.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
