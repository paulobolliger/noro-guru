import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export async function POST(req: Request) {
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

  const { client, close } = createDatabaseClient();
  try {
    await client.begin(async (sql) => {
      for (const row of rows) {
        await sql`
          INSERT INTO platform_crm.leads (organization_name, email, phone, source, value_cents, stage)
          VALUES (${row.organization_name}, ${row.email}, ${row.phone}, ${row.source}, ${row.value_cents}, ${row.stage})
        `;
      }
    });

    return NextResponse.json({ ok: true, imported: rows.length });
  } catch (error: any) {
    console.error('Erro no import route:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
