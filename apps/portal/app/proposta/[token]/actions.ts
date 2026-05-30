'use server';

import { createDatabaseClient, proposalsRepository } from '@noro/db';

export async function aceitarPropostaPorToken(token: string, aceitaPorNome?: string) {
  const { db, close } = createDatabaseClient();
  try {
    const proposal = await proposalsRepository.acceptProposal(db, token, aceitaPorNome);
    if (!proposal) return { success: false, message: 'Proposta não encontrada ou não pode ser aceita.' };
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao aceitar proposta';
    return { success: false, message };
  } finally {
    await close();
  }
}
