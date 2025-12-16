import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";
import crypto from "crypto";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "no-reply@kryptage.com";
    if (!resendApiKey) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db("kryptage");
    const subs = db.collection("newsletter_subscriptions");
    const tokens = db.collection("newsletter_tokens");

    const now = new Date();

    // If already confirmed, do nothing.
    const existing = await subs.findOne({ email: normalizedEmail });
    if (existing?.status === "confirmed") {
      return NextResponse.json({ ok: true, status: "confirmed" });
    }

    // Create a new confirm token (opaque string)
    const token = new ObjectId().toHexString() + crypto.randomBytes(16).toString("hex");

    await subs.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          status: "pending",
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    await tokens.insertOne({
      token,
      email: normalizedEmail,
      createdAt: now,
      used: false,
    });

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const confirmUrl = `${origin}/api/newsletter/confirm?token=${token}`;

    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from,
      to: normalizedEmail,
      subject: "Confirm your subscription to the Kryptage Newsletter",
      html: `
        <p>Hi,</p>
        <p>Thanks for subscribing to the Kryptage Newsletter.</p>
        <p><a href="${confirmUrl}">Click here to confirm your email</a></p>
        <p>If you did not request this subscription, you can ignore this message.</p>
      `,
    });

    return NextResponse.json({ ok: true, status: "pending" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
