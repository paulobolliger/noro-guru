import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = createAdminSupabaseClient();
  const form = await req.formData();
  // Admin client bypasses RLS; owner_id será preenchido por trigger quando autenticado.
  const uid = null;

  const organization_name = String(form.get('organization_name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const source = String(form.get('source') || '').trim();
  const value_cents = Number(form.get('value_cents') || 0) || 0;

  if (!organization_name) {
    return NextResponse.json({ error: 'organization_name required' }, { status: 400 });
  }

  const { error } = await supabase
    .schema('platform')
    .from('leads')
    .insert({ organization_name, email, phone, source, value_cents, owner_id: uid });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.redirect(new URL('/control/leads', req.url));
}
