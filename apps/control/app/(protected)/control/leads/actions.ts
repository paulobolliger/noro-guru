"use server";
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function listLeads() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .schema('cp')
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createLead(formData: FormData) {
  const supabase = createAdminSupabaseClient();
  const payload: any = {
    organization_name: String(formData.get('organization_name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    source: String(formData.get('source') || '').trim(),
    value_cents: Number(formData.get('value_cents') || 0) || 0,
  };
  if (!payload.organization_name) throw new Error('organization_name required');
  const { error } = await supabase.schema('cp').from('leads').insert(payload);
  if (error) throw new Error(error.message);
}

export async function convertLead(formData: FormData) {
  const supabase = createAdminSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) throw new Error('id required');
  const { data: lead } = await supabase.schema('cp').from('leads').select('*').eq('id', id).maybeSingle();
  // Aqui poderíamos criar tenant etc. Por enquanto, só marca ganho.
  const { error } = await supabase.schema('cp').from('leads').update({ stage: 'ganho' }).eq('id', id);
  if (error) throw new Error(error.message);
  return lead;
}

