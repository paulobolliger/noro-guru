import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = createAdminSupabaseClient();
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.rows)) {
    return NextResponse.json({ error: 'rows required' }, { status: 400 });
  }
  const rows = (body.rows as any[]).map((r) => ({
    organization_name: String(r.organization_name || '').trim(),
    email: String(r.email || '').trim() || null,
    phone: String(r.phone || '').trim() || null,
    source: String(r.source || '').trim() || null,
    value_cents: Number(r.value_cents || 0) || 0,
    stage: r.stage ? String(r.stage).trim() : null,
  })).filter((r) => r.organization_name);

  if (!rows.length) {
    return NextResponse.json({ error: 'no valid rows' }, { status: 400 });
  }

  const { error } = await supabase.schema('cp').from('leads').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, imported: rows.length });
}

