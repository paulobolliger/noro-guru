import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase/server';

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const { error } = await supabase.schema('cp').from('leads').update({ owner_id: user.id }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.schema('cp').from('lead_activity').insert({ lead_id: id, action: 'assigned', details: { to: user.id } });
  return NextResponse.json({ ok: true });
}

