/**
 * Multi-Tenant Context Utilities
 *
 * Funções para gerenciar o contexto de tenant na aplicação.
 * IMPORTANTE: Sempre use estas funções em server actions para garantir isolamento de dados.
 */

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * Obtém o tenant_id do contexto atual
 *
 * Ordem de resolução:
 * 1. Header x-tenant-id (setado pelo middleware)
 * 2. Lookup em user_tenant_roles (fallback)
 *
 * @throws Error se usuário não estiver autenticado ou sem tenant
 * @returns tenant_id UUID
 */
export async function getCurrentTenantId(): Promise<string> {
  // Tentar obter do header (setado pelo middleware)
  const headersList = headers()
  const tenantId = headersList.get('x-tenant-id')

  if (tenantId) {
    console.log('[Tenant] Resolved from header:', tenantId)
    return tenantId
  }

  // Fallback: obter do user_tenant_roles
  console.log('[Tenant] Header not found, resolving from database')

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (error || !data) {
    console.error('[Tenant] Error resolving tenant:', error)
    throw new Error('Usuário sem tenant associado. Contate o administrador.')
  }

  console.log('[Tenant] Resolved from database:', data.tenant_id)
  return data.tenant_id
}

/**
 * Obtém a role do usuário no tenant atual
 *
 * @returns Role do usuário ('admin', 'manager', 'agent', 'finance', 'viewer')
 */
export async function getCurrentTenantRole(): Promise<string> {
  // Tentar obter do header
  const headersList = headers()
  const role = headersList.get('x-tenant-role')

  if (role) {
    return role
  }

  // Fallback: buscar no banco
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const tenantId = await getCurrentTenantId()

  const { data } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .single()

  return data?.role || 'viewer'
}

/**
 * Verifica se o usuário atual tem uma role específica
 *
 * @param requiredRole Role necessária
 * @returns true se usuário tem a role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const role = await getCurrentTenantRole()
  return role === requiredRole
}

/**
 * Verifica se o usuário atual tem permissão de admin
 *
 * @returns true se usuário é admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin')
}

/**
 * Verifica se o usuário pertence ao tenant especificado
 *
 * @param tenantId Tenant ID para verificar
 * @returns true se usuário tem acesso ao tenant
 */
export async function userBelongsToTenant(tenantId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .maybeSingle()

  return !!data
}

/**
 * Obtém informações completas do tenant atual
 *
 * @returns Dados do tenant (nome, slug, plano, status, etc)
 */
export async function getCurrentTenant() {
  const tenantId = await getCurrentTenantId()
  const supabase = createClient()

  const { data, error } = await supabase
    .schema('cp')
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single()

  if (error) {
    throw new Error('Erro ao buscar informações do tenant')
  }

  return data
}

/**
 * Lista todos os tenants do usuário atual
 *
 * @returns Array de tenants com role do usuário
 */
export async function getUserTenants() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select(`
      role,
      tenant:tenants (
        id,
        name,
        slug,
        plan,
        status
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Erro ao buscar tenants do usuário')
  }

  return data?.map(item => ({
    ...item.tenant,
    role: item.role
  })) || []
}

/**
 * Valida que um registro pertence ao tenant atual
 * Útil para verificações de segurança antes de operações UPDATE/DELETE
 *
 * @param recordTenantId tenant_id do registro
 * @throws Error se tenant_id não corresponde ao tenant atual
 */
export async function validateTenantOwnership(recordTenantId: string): Promise<void> {
  const currentTenantId = await getCurrentTenantId()

  if (recordTenantId !== currentTenantId) {
    console.error('[Security] Tenant ownership violation:', {
      currentTenantId,
      recordTenantId
    })
    throw new Error('Acesso negado: registro pertence a outro tenant')
  }
}
