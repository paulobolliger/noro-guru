import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { id, stage } = await req.json();
  if (!id || !stage) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const supabase = createAdminSupabaseClient();
  // Fetch old stage
  const { data: lead } = await supabase.schema('cp').from('leads').select('id, stage').eq('id', id).maybeSingle();
  const oldStage = lead?.stage || null;
  const { error } = await supabase.schema('cp').from('leads').update({ stage }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  // Log activity (best-effort)
  await supabase.schema('cp').from('lead_activity').insert({
    lead_id: id,
    action: 'status_changed',
    details: { from: oldStage, to: stage }
  });
  return NextResponse.json({ ok: true });
}
