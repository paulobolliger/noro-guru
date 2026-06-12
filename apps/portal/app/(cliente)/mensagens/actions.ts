'use server';

import { revalidatePath } from 'next/cache';
import { createDatabaseClient, proposalMessagesRepository } from '@noro/db';
import { resolveTenantFromRequest } from '@/lib/tenant-context';

export async function sendClientMessageAction(
  proposalId: string,
  formData: FormData,
  clientId: string,
) {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) return { success: false };

  const content = (formData.get('content') as string | null)?.trim();
  if (!content) return { success: false };

  const { db, close } = createDatabaseClient();
  try {
    await proposalMessagesRepository.sendMessage(db, {
      tenantId: tenant.tenantId,
      proposalId,
      senderType: 'client',
      senderClientId: clientId,
      content,
    });
    revalidatePath('/mensagens');
    return { success: true };
  } finally {
    await close();
  }
}
