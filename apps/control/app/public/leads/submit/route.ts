import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from "@lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const contentType = req.headers.get('content-type') || '';
  let organization_name = '', email = '', phone = '', source = 'public', value_cents = 0;
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
  if (!organization_name) return NextResponse.json({ error: 'organization_name required' }, { status: 400 });
  const { error } = await supabase.schema('cp').from('leads').insert({ organization_name, email, phone, source, value_cents });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

