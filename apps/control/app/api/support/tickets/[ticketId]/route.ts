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
    const [data] = await client`
      SELECT *
      FROM platform.support_tickets
      WHERE id = ${params.ticketId}
      LIMIT 1
    `;
    if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ ticket: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as any;
  const patch: any = {};
  if (typeof body?.status === 'string') patch.status = body.status;
  if (typeof body?.assigned_to === 'string') patch.assigned_to = body.assigned_to;
  if (typeof body?.priority === 'string') patch.priority = body.priority;
  if (!Object.keys(patch).length) return NextResponse.json({ error: 'no updates' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      UPDATE platform.support_tickets
      SET
        status = CASE WHEN ${patch.status !== undefined ? patch.status : null}::text IS NULL THEN status ELSE ${patch.status !== undefined ? patch.status : null} END,
        assigned_to = CASE WHEN ${patch.assigned_to !== undefined ? patch.assigned_to : null}::uuid IS NULL THEN assigned_to ELSE ${patch.assigned_to !== undefined ? patch.assigned_to : null} END,
        priority = CASE WHEN ${patch.priority !== undefined ? patch.priority : null}::text IS NULL THEN priority ELSE ${patch.priority !== undefined ? patch.priority : null} END
      WHERE id = ${params.ticketId}
      RETURNING *
    `;

    if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 });

    await sendSupportEmail({ type: 'ticket_updated', ticketId: data.id });

    return NextResponse.json({ ticket: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}
