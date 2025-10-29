import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

async function resolveActiveTenantId() {
  const admin = createAdminSupabaseClient();
  const { data: auth } = await admin.auth.getUser();
  const uid = auth?.user?.id;
  if (uid) {
    const { data: utr } = await admin
      .schema('cp')
      .from('user_tenant_roles')
      .select('tenant_id')
      .eq('user_id', uid)
      .limit(1)
      .maybeSingle();
    if (utr?.tenant_id) return utr.tenant_id as string;
  }
  const { data: tenantNoro } = await admin.schema('cp').from('tenants').select('id').eq('slug', 'noro').maybeSingle();
  return tenantNoro?.id ?? null;
}

export async function POST(req: Request) {
  const admin = createAdminSupabaseClient();
  const form = await req.formData();
  const code = String(form.get('code') || '').trim();
  const url = String(form.get('url') || '').trim();
  const secret = String(form.get('secret') || '').trim() || null;
  const is_active = !!form.get('is_active');
  if (!code || !url) return NextResponse.json({ error: 'code and url required' }, { status: 400 });
  const tenant_id = await resolveActiveTenantId();
  const { error } = await admin.schema('cp').from('webhooks').insert({ tenant_id, code, url, secret, is_active });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

