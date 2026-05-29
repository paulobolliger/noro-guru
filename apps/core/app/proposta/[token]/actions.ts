'use server';

import { createDatabaseClient, proposalsRepository } from '@noro/db';

function getDb() {
  return createDatabaseClient();
}

// Chamado ao carregar a página pública da proposta —
// muda status de 'enviada' para 'visualizada' automaticamente
export async function visualizarPropostaPorToken(token: string) {
  const { db, close } = getDb();
  try {
    const proposal = await proposalsRepository.markProposalVisualizadaByToken(db, token);
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao registrar visualização';
    return { success: false, message };
  } finally {
    await close();
  }
}

// Chamado quando o cliente clica em "Aceitar proposta" no link público
export async function aceitarPropostaPorToken(token: string, aceitaPorNome?: string) {
  const { db, close } = getDb();
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

// Leitura pública da proposta pelo token (sem autenticação)
export async function getPropostaPorToken(token: string) {
  const { db, close } = getDb();
  try {
    const proposal = await proposalsRepository.getProposalByToken(db, token);
    return proposal ?? null;
  } finally {
    await close();
  }
}
