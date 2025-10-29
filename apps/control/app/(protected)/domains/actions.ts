"use server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getActiveTenantId } from "../tenants/actions";

export async function listDomains() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.schema('cp').from('domains').select('id, tenant_id, domain, is_default, created_at').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createDomain(formData: FormData) {
  const supabase = createAdminSupabaseClient();
  const tenantId = await getActiveTenantId();
  const domain = String(formData.get('domain') || '').trim().toLowerCase();
  const is_default = formData.get('is_default') === 'on';
  if (!tenantId) throw new Error('Tenant ativo não encontrado');
  if (!domain) throw new Error('Domínio obrigatório');

  // Validação simples de FQDN
  const fqdn = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  if (!fqdn.test(domain)) throw new Error('Domínio inválido');

  const suffixes = (process.env.NEXT_PUBLIC_ALLOWED_DOMAIN_SUFFIXES || '').split(',').map(s => s.trim()).filter(Boolean);
  if (suffixes.length && !suffixes.some(suf => domain.endsWith(suf))) {
    throw new Error('Domínio não autorizado para esta instância');
  }

  // Unicidade global
  const { data: exists } = await supabase.schema('cp').from('domains').select('id').eq('domain', domain).maybeSingle();
  if (exists) throw new Error('Domínio já cadastrado');

  // Se marcar default, zera anteriores do tenant
  if (is_default) {
    await supabase.schema('cp').from('domains').update({ is_default: false }).eq('tenant_id', tenantId);
  }

  const { error } = await supabase.schema('cp').from('domains').insert({ tenant_id: tenantId, domain, is_default });
  if (error) throw new Error(error.message);
}

export async function deleteDomain(id: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.schema('cp').from('domains').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function setDefaultDomain(id: string) {
  const supabase = createAdminSupabaseClient();
  // Obter domínio para saber o tenant
  const { data: dom, error: getErr } = await supabase.schema('cp').from('domains').select('tenant_id').eq('id', id).maybeSingle();
  if (getErr || !dom) throw new Error(getErr?.message || 'Domínio não encontrado');
  // Desmarcar anteriores e marcar este
  await supabase.schema('cp').from('domains').update({ is_default: false }).eq('tenant_id', dom.tenant_id);
  const { error } = await supabase.schema('cp').from('domains').update({ is_default: true }).eq('id', id);
  if (error) throw new Error(error.message);
}
