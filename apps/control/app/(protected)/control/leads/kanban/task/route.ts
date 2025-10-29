import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase/server';

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id, title } = await req.json();
  if (!id || !title) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const { data: lead, error: lerr } = await supabase.schema('cp').from('leads').select('tenant_id').eq('id', id).maybeSingle();
  if (lerr || !lead) return NextResponse.json({ error: lerr?.message || 'not_found' }, { status: 400 });
  const { error } = await supabase.schema('cp').from('tasks').insert({
    tenant_id: lead.tenant_id,
    title,
    status: 'aberta',
    assigned_to: user.id,
    entity_type: 'lead',
    entity_id: id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

