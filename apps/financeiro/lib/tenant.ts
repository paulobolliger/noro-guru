import { createClient } from './supabase/server';

/**
 * Obtém o tenant_id do usuário autenticado
 *
 * Esta função:
 * 1. Verifica se o usuário está autenticado
 * 2. Busca o tenant_id associado ao usuário em cp.user_tenant_roles
 * 3. Retorna o tenant_id para uso em queries filtradas
 *
 * @throws Error se usuário não estiver autenticado ou tenant não for encontrado
 * @returns Promise<string> - ID do tenant do usuário
 */
export async function getCurrentTenantId(): Promise<string> {
  const supabase = createClient();

  // 1. Obter usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Usuário não autenticado');
  }

  // 2. Buscar tenant_id do usuário na tabela cp.user_tenant_roles
  const { data: tenantRole, error: roleError } = await supabase
    .from('user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  if (roleError || !tenantRole) {
    throw new Error('Tenant não encontrado para o usuário');
  }

  return tenantRole.tenant_id;
}

/**
 * Verifica se o usuário tem acesso a um tenant específico
 *
 * @param tenantId - ID do tenant a verificar
 * @returns Promise<boolean> - true se o usuário tem acesso ao tenant
 */
export async function hasAccessToTenant(tenantId: string): Promise<boolean> {
  try {
    const currentTenantId = await getCurrentTenantId();
    return currentTenantId === tenantId;
  } catch {
    return false;
  }
}
