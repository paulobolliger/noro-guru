import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { stage, ids } = await req.json();
  if (!stage || !Array.isArray(ids)) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const supabase = createAdminSupabaseClient();
  // assign incremental positions (1..n)
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const { error } = await supabase.schema('cp').from('leads').update({ position: i + 1, stage }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

