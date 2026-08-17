import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';
import { getServerSession, getSessionClaims } from '@/lib/session';

export async function POST(req: Request) {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const uid = ctx.isAuthenticated && ctx.claims?.sub ? ctx.claims.sub : null;

  const form = await req.formData();
  const organization_name = String(form.get('organization_name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const source = String(form.get('source') || '').trim();
  const value_cents = Number(form.get('value_cents') || 0) || 0;

  if (!organization_name) {
    return NextResponse.json({ error: 'organization_name required' }, { status: 400 });
  }

  const { client, close } = createDatabaseClient();
  try {
    await client`
      INSERT INTO platform_crm.leads (organization_name, email, phone, source, value_cents, owner_id)
      VALUES (${organization_name}, ${email}, ${phone}, ${source}, ${value_cents}, ${uid})
    `;
    return NextResponse.redirect(new URL('/control/leads', req.url));
  } catch (error: any) {
    console.error('Erro no create lead route:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
