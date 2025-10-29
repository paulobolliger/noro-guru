import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_INGEST_URL || process.env.SUPABASE_INGEST_URL;
    if (!url) return NextResponse.json({ error: 'INGEST_URL not configured' }, { status: 500 });
    const body = await req.json();
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ error: 'proxy_failed', details: e?.message }, { status: 500 });
  }
}
