import { NextResponse } from "next/server";
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';
import { sendSupportEmail } from "@/lib/supportEmail";

type Params = { ticketId: string };

export async function GET(_request: Request, { params }: { params: Params }) {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT *
      FROM platform.support_messages
      WHERE ticket_id = ${params.ticketId}
      ORDER BY created_at ASC
      LIMIT 200
    `;
    return NextResponse.json({ messages: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}

export async function POST(request: Request, { params }: { params: Params }) {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const content = String(body?.body || '').trim();
  const internal = !!body?.internal;
  const tenant_id = String(body?.tenant_id || '').trim();
  if (!content || !tenant_id) return NextResponse.json({ error: 'body and tenant_id required' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      INSERT INTO platform.support_messages (
        ticket_id, tenant_id, sender_id, sender_role, body, internal
      ) VALUES (
        ${params.ticketId}, ${tenant_id}, ${userId}, 'agent', ${content}, ${internal}
      )
      RETURNING *
    `;

    await sendSupportEmail({ type: 'message_created', ticketId: params.ticketId, messageId: data.id, tenantId: tenant_id });

    return NextResponse.json({ message: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}
