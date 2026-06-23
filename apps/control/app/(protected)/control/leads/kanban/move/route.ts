import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export async function POST(req: Request) {
  const { id, stage } = await req.json();
  if (!id || !stage) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    const [lead] = await client`
      SELECT stage
      FROM platform_crm.leads
      WHERE id = ${id}
      LIMIT 1
    `;
    const oldStage = lead?.stage || null;

    await client.begin(async (sql) => {
      await sql`
        UPDATE platform_crm.leads
        SET stage = ${stage}
        WHERE id = ${id}
      `;

      await sql`
        INSERT INTO platform_crm.lead_activity (lead_id, action, details)
        VALUES (${id}, 'status_changed', ${JSON.stringify({ from: oldStage, to: stage })}::jsonb)
      `;
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erro no move route:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
