import { getCurrentUser } from '@noro/lib/services/authService';
import { getTenantIdForUser } from '@noro/lib/services/tenantService';

export async function getCurrentTenantId(): Promise<string> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  return getTenantIdForUser(user.id);
}

export async function hasAccessToTenant(tenantId: string): Promise<boolean> {
  try {
    const currentTenantId = await getCurrentTenantId();
    return currentTenantId === tenantId;
  } catch {
    return false;
  }
}
