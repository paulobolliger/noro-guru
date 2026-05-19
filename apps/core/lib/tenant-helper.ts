import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function getCurrentTenantId(userId: string): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`Erro ao buscar tenant do usuário ${userId}:`, error);
    throw new Error('Falha ao resolver tenant do usuário.');
  }

  const tenantRow = data as { tenant_id?: string } | null;
  if (tenantRow?.tenant_id) {
    return tenantRow.tenant_id;
  }

  // Usuário sem tenant vinculado — não fazer fallback silencioso para evitar cross-tenant leak
  throw new Error(
    `Usuário ${userId} não possui tenant vinculado. Configure a associação em user_tenants.`
  );
}
