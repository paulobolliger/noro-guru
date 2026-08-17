'use server';

import { createDatabaseClient } from '@noro/db';
import { requireUser, keycloakSessionAdapter } from '@noro/auth';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createLeadAction as createLeadActionProtected } from '../(protected)/leads/actions';

export async function createLeadAction(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;

    const data = {
      nome: (formData.get('organization_name') as string) || 'Novo Lead',
      organizationName: (formData.get('organization_name') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      source: (formData.get('source') as any) || 'manual',
      budgetMaxCents: formData.get('value_cents') ? parseInt(formData.get('value_cents') as string) : undefined,
      sourceDetail: (formData.get('notes') as string) || undefined,
    };

    return await createLeadActionProtected(tenantId, data);
  } catch (error: any) {
    console.error('Error in createLeadAction:', error);
    return { success: false, message: error.message || 'Erro interno' };
  } finally {
    await close();
  }
}
