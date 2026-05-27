"use server";
import { createServerSupabaseClient } from "@noro/lib/supabase/server";

export async function listTasks() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.schema('cp').from('tasks').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return data;
}

export async function createTask(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  const payload = {
    title: String(formData.get('title') || ''),
    tenant_id: String(formData.get('tenant_id') || '') || null,
    due_date: String(formData.get('due_date') || '') || null,
    assigned_to: uid || null,
    entity_type: String(formData.get('entity_type') || '') || null,
    entity_id: String(formData.get('entity_id') || '') || null,
  } as any;
  if (!payload.title) throw new Error('Título é obrigatório');
  const { error } = await supabase.schema('cp').from('tasks').insert(payload);
  if (error) throw new Error(error.message);
}

export async function createTicket(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  const subject = String(formData.get('subject') || '').trim();
  const summary = String(formData.get('description') || '').trim() || null;
  const priority = String(formData.get('priority') || 'normal').trim().toLowerCase() || 'normal';
  const tenantId = String(formData.get('tenant_id') || '').trim() || null;

  if (!subject) throw new Error('Assunto é obrigatório');

  const { error } = await supabase.schema('cp').from('support_tickets').insert({
    subject,
    summary,
    priority,
    tenant_id: tenantId,
    source: 'manual',
    requester_id: auth?.user?.id || null,
    requester_email: auth?.user?.email || null,
  });

  if (error) throw new Error(error.message);
}

