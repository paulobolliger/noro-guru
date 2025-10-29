import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

type Params = { ticketId: string };

export async function GET(_request: Request, { params }: { params: Params }) {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .schema('cp')
    .from('support_tickets')
    .select('*')
    .eq('id', params.ticketId)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ticket: data });
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as any;
  const patch: any = {};
  if (typeof body?.status === 'string') patch.status = body.status;
  if (typeof body?.assigned_to === 'string') patch.assigned_to = body.assigned_to;
  if (typeof body?.priority === 'string') patch.priority = body.priority;
  if (!Object.keys(patch).length) return NextResponse.json({ error: 'no updates' }, { status: 400 });
  const { data, error } = await supabase
    .schema('cp')
    .from('support_tickets')
    .update(patch)
    .eq('id', params.ticketId)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.rpc('enqueue_job', {
    identifier: 'send_support_email',
    payload: { type: 'ticket_updated', ticketId: data.id }
  }).catch(() => null);

  return NextResponse.json({ ticket: data });
}
