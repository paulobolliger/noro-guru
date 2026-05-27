import { getTenantIdForUser } from '@noro/lib/services/tenantService';

export async function getCurrentTenantId(userId: string): Promise<string> {
  return getTenantIdForUser(userId);
}
