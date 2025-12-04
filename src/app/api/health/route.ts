import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, app: process.env.NEXT_PUBLIC_APP_NAME || 'Kryptage DAO' });
}
