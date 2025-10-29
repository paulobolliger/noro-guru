import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

type Params = { ticketId: string };

export async function GET(_request: Request, { params }: { params: Params }) {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .schema('cp')
    .from('support_messages')
    .select('*')
    .eq('ticket_id', params.ticketId)
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ messages: data || [] });
}

export async function POST(request: Request, { params }: { params: Params }) {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const content = String(body?.body || '').trim();
  const internal = !!body?.internal;
  const tenant_id = String(body?.tenant_id || '').trim();
  if (!content || !tenant_id) return NextResponse.json({ error: 'body and tenant_id required' }, { status: 400 });
  const { data, error } = await supabase
    .schema('cp')
    .from('support_messages')
    .insert({ ticket_id: params.ticketId, tenant_id, sender_id: auth.user.id, sender_role: 'agent', body: content, internal })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.rpc('enqueue_job', {
    identifier: 'send_support_email',
    payload: { type: 'message_created', ticketId: params.ticketId, messageId: data.id }
  }).catch(() => null);

  return NextResponse.json({ message: data });
}
