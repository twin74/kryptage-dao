import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kryptage");
    const subs = db.collection("newsletter_subscriptions");

    const s = await subs.findOne({ email });
    return NextResponse.json({
      ok: true,
      status: s?.status || "none",
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
