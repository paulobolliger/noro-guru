import { NextResponse } from "next/server";
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { createDatabaseClient } from '@noro/db';
import { sendSupportEmail } from "@/lib/supportEmail";

export async function GET() {
  const ctx = await getLogtoContext(logtoConfig);
  const userId = ctx.claims?.sub;
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT *
      FROM platform.support_tickets
      ORDER BY updated_at DESC
      LIMIT 100
    `;
    return NextResponse.json({ tickets: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}

export async function POST(request: Request) {
  const ctx = await getLogtoContext(logtoConfig);
  const userId = ctx.claims?.sub;
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const email = ctx.claims?.email || null;

  const body = await request.json().catch(() => null);
  const subject = String(body?.subject || '').trim();
  const summary = String(body?.summary || '').trim() || null;
  const tenant_id = String(body?.tenant_id || '').trim();
  const priority = String(body?.priority || 'normal').trim().toLowerCase() || 'normal';
  const source = String(body?.source || 'manual').trim().toLowerCase() || 'manual';
  if (!subject || !tenant_id) return NextResponse.json({ error: 'subject and tenant_id required' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      INSERT INTO platform.support_tickets (
        subject, summary, tenant_id, priority, source, requester_id, requester_email
      ) VALUES (
        ${subject}, ${summary}, ${tenant_id}, ${priority}, ${source}, ${userId}, ${email}
      )
      RETURNING *
    `;

    await sendSupportEmail({ type: 'ticket_created', ticketId: data.id, tenantId: tenant_id });

    return NextResponse.json({ ticket: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}
