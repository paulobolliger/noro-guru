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

  const { id, title } = await req.json();
  if (!id || !title) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    const [lead] = await client`
      SELECT tenant_id
      FROM platform_crm.leads
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!lead) return NextResponse.json({ error: 'not_found' }, { status: 400 });

    await client`
      INSERT INTO platform.tasks (tenant_id, title, status, assigned_to, entity_type, entity_id)
      VALUES (${lead.tenant_id}, ${title}, 'aberta', ${userId}, 'lead', ${id})
    `;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erro no task route:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
