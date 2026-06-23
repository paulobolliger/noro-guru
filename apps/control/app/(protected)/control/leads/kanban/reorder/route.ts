import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export async function POST(req: Request) {
  const { stage, ids } = await req.json();
  if (!stage || !Array.isArray(ids)) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    await client.begin(async (sql) => {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        await sql`
          UPDATE platform_crm.leads
          SET position = ${i + 1}, stage = ${stage}
          WHERE id = ${id}
        `;
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erro no reorder route:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
