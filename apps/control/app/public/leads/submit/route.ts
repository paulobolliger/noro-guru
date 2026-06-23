import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let organization_name = '', email = '', phone = '', source = 'public', value_cents = 0;
  
  try {
    if (contentType.includes('application/json')) {
      const body = await req.json();
      organization_name = String(body.organization_name || '').trim();
      email = String(body.email || '').trim();
      phone = String(body.phone || '').trim();
      source = String(body.source || 'public').trim();
      value_cents = Number(body.value_cents || 0) || 0;
    } else {
      const form = await req.formData();
      organization_name = String(form.get('organization_name') || '').trim();
      email = String(form.get('email') || '').trim();
      phone = String(form.get('phone') || '').trim();
      source = String(form.get('source') || 'public').trim();
      value_cents = Number(form.get('value_cents') || 0) || 0;
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!organization_name) {
    return NextResponse.json({ error: 'organization_name required' }, { status: 400 });
  }

  const { client, close } = createDatabaseClient();
  try {
    await client`
      INSERT INTO platform_crm.leads (organization_name, email, phone, source, value_cents)
      VALUES (${organization_name}, ${email}, ${phone}, ${source}, ${value_cents})
    `;
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}
