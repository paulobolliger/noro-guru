"use server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function getOrg(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.schema('cp').from('tenants').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function listNotes(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.schema('cp').from('notes').select('*').eq('tenant_id', id).order('created_at', { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return data;
}

export async function addNote(formData: FormData) {
  const supabase = createAdminSupabaseClient();
  const tenant_id = String(formData.get('tenant_id') || '');
  const content = String(formData.get('content') || '');
  if (!tenant_id || !content) throw new Error('Campos obrigatórios');
  const { data: user } = await supabase.auth.getUser();
  const uid = user?.user?.id;
  const { error } = await supabase.schema('cp').from('notes').insert({ tenant_id, entity_type: 'tenant', entity_id: tenant_id, content, created_by: uid });
  if (error) throw new Error(error.message);
}

export async function createContact(formData: FormData) {
  const supabase = createAdminSupabaseClient();
  const tenant_id = String(formData.get('tenant_id') || '');
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const role = String(formData.get('role') || '');
  const is_primary = String(formData.get('is_primary') || '') === 'on';
  if (!tenant_id || !name) throw new Error('Campos obrigatórios');
  const { error } = await supabase.schema('cp').from('contacts').insert({ tenant_id, name, email, phone, role, is_primary });
  if (error) throw new Error(error.message);
}

export async function deleteContact(formData: FormData) {
  const supabase = createAdminSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) throw new Error('Contato inválido');
  const { error } = await supabase.schema('cp').from('contacts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateContact(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) throw new Error('Contato inválido');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const role = String(formData.get('role') || '');
  const is_primary = String(formData.get('is_primary') || '') === 'on';
  const { error } = await supabase.schema('cp').from('contacts').update({ email, phone, role, is_primary }).eq('id', id);
  if (error) throw new Error(error.message);
}
