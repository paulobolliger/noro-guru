import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@lib/supabase/server";

function slugify(input: string) {
  return input
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function POST(req: Request) {
  const supabase = createAdminSupabaseClient();
  const server = createServerSupabaseClient();
  const form = await req.formData();
  const name = String(form.get('name') || '').trim();
  const slugIn = String(form.get('slug') || '').trim();
  const plan = String(form.get('plan') || 'pro');
  const status = String(form.get('status') || 'active');

  if (!name) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }
  const slug = slugIn || slugify(name);

  const { data: inserted, error } = await supabase
    .schema('cp')
    .from('tenants')
    .insert({ name, slug, plan, status })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  // Vincula o usuário atual como owner do tenant criado e define como ativo
  try {
    const { data: auth } = await server.auth.getUser();
    const userId = auth?.user?.id;
    if (userId && inserted?.id) {
      await supabase
        .schema('cp')
        .from('user_tenant_roles')
        .upsert({ user_id: userId, tenant_id: inserted.id, role: 'owner' }, { onConflict: 'user_id,tenant_id' });
      const res = NextResponse.redirect(new URL('/control/orgs', req.url));
      res.cookies.set('active_tenant_id', String(inserted.id), { path: '/', httpOnly: true, sameSite: 'lax' });
      return res;
    }
  } catch {}
  return NextResponse.redirect(new URL('/control/orgs', req.url));
}
