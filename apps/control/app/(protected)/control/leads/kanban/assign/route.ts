import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';
import { getServerSession, getSessionClaims } from '@/lib/session';

export async function POST(req: Request) {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  if (!ctx.isAuthenticated) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const userId = ctx.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    await client.begin(async (sql) => {
      await sql`
        UPDATE platform_crm.leads
        SET owner_id = ${userId}
        WHERE id = ${id}
      `;

      await sql`
        INSERT INTO platform_crm.lead_activity (lead_id, actor_id, action, details)
        VALUES (${id}, ${userId}, 'assigned', ${JSON.stringify({ to: userId })}::jsonb)
      `;
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erro no assign route:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
