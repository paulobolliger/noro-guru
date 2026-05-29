import { createCollectionService, type RuntimeDocument } from './runtimeCrud';

export interface Tenant extends RuntimeDocument {
  nome?: string;
  slug?: string;
  email?: string;
  billingEmail?: string;
  stripeCustomerId?: string;
}

export interface UserTenant extends RuntimeDocument {
  userId: string;
  tenantId: string;
  role?: string;
}

export const tenantsService = createCollectionService<Tenant>('tenants');
export const userTenantsService = createCollectionService<UserTenant>(
  'user_tenants',
);

export async function getTenantIdForUser(userId: string): Promise<string> {
  void userId;
  throw new Error('Tenant lookup pela camada legada desativado. Use packages/db na próxima fase.');
}

export async function getTenantForUser(userId: string): Promise<Tenant> {
  const tenantId = await getTenantIdForUser(userId);
  const tenant = await tenantsService.getById(tenantId);

  if (!tenant) {
    throw new Error('Tenant não encontrado.');
  }

  return tenant;
}
