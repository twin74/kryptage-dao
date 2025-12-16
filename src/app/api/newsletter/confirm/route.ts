import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kryptage");
    const tokens = db.collection("newsletter_tokens");
    const subs = db.collection("newsletter_subscriptions");

    const now = new Date();

    const t = await tokens.findOne({ token });
    if (!t) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    if (t.used) {
      // idempotent
      return NextResponse.redirect(new URL("/airdrop?newsletter=confirmed", req.url));
    }

    await tokens.updateOne({ token }, { $set: { used: true, usedAt: now } });
    await subs.updateOne(
      { email: t.email },
      {
        $set: {
          status: "confirmed",
          confirmedAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.redirect(new URL("/airdrop?newsletter=confirmed", req.url));
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
