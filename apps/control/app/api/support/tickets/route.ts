import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { sendSupportEmail } from "@/lib/supportEmail";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .schema('cp')
    .from('support_tickets')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ tickets: data || [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const subject = String(body?.subject || '').trim();
  const summary = String(body?.summary || '').trim() || null;
  const tenant_id = String(body?.tenant_id || '').trim();
  const priority = String(body?.priority || 'normal').trim().toLowerCase() || 'normal';
  if (!subject || !tenant_id) return NextResponse.json({ error: 'subject and tenant_id required' }, { status: 400 });

  const { data, error } = await supabase
    .schema('cp')
    .from('support_tickets')
    .insert({ subject, summary, tenant_id, priority, requester_id: auth.user.id, requester_email: auth.user.email || null })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await sendSupportEmail({ type: 'ticket_created', ticketId: data.id, tenantId: tenant_id });

  return NextResponse.json({ ticket: data });
}
