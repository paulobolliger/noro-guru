// lib/tenant-helper.ts
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getCurrentTenantId(userId: string): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin();
  
  // 1. Tenta buscar o tenant do usuário
  const { data, error } = await supabaseAdmin
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle(); 

  if (data) {
    return data.tenant_id;
  }

  console.warn(`Usuário ${userId} sem tenant vinculado. Tentando fallback para tenant padrão...`);

  // 2. Fallback: Busca o primeiro tenant disponível
  const { data: defaultTenant, error: fallbackError } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .limit(1)
    .single();

  if (defaultTenant) {
    return defaultTenant.id;
  }

  console.error("Erro fatal: Nenhum tenant encontrado no sistema.", fallbackError);
  throw new Error("Erro de configuração: Sistema sem tenants cadastrados.");
}
