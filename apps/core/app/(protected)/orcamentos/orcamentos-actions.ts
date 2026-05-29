'use server';

import { createDatabaseClient, proposalsRepository } from '@noro/db';
import type { ProposalStatus } from '@noro/db';
import { randomUUID } from 'crypto';

function getDb() {
  return createDatabaseClient();
}

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

export async function getOrcamentos(tenantId: string, filters?: {
  status?: ProposalStatus;
  leadId?: string;
  clientId?: string;
  limit?: number;
  offset?: number;
}) {
  const { db, close } = getDb();
  try {
    return await proposalsRepository.getProposalsByTenant(db, tenantId, filters);
  } finally {
    await close();
  }
}

export async function getOrcamentoById(tenantId: string, proposalId: string) {
  const { db, close } = getDb();
  try {
    return await proposalsRepository.getProposalById(db, tenantId, proposalId);
  } finally {
    await close();
  }
}

export async function getOrcamentosStats(tenantId: string) {
  const { db, close } = getDb();
  try {
    return await proposalsRepository.getProposalsCountByStatus(db, tenantId);
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Criação e edição de proposta
// ---------------------------------------------------------------------------

export async function createOrcamento(tenantId: string, createdBy: string, data: {
  titulo: string;
  leadId?: string;
  clientId?: string;
  dataViagemInicio?: string;
  dataViagemFim?: string;
  numPax?: number;
  destinoPrincipal?: string;
  moedaBase?: string;
  valorSinalCents?: number;
  condicoesPagamento?: string;
  aceiteTipo?: 'manual' | 'link_publico';
  validadeAte?: string;
  descricao?: string;
  observacoes?: string;
  termosCondicoes?: string;
}) {
  const { db, close } = getDb();
  try {
    const numero = await proposalsRepository.generateProposalNumber(db, tenantId);
    const aceiteToken = data.aceiteTipo === 'link_publico' ? randomUUID() : undefined;

    const proposal = await proposalsRepository.createProposal(db, {
      tenantId,
      createdBy,
      numero,
      aceiteToken,
      ...data,
    });
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar orçamento';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateOrcamento(
  tenantId: string,
  proposalId: string,
  data: Parameters<typeof proposalsRepository.updateProposal>[3],
) {
  const { db, close } = getDb();
  try {
    const proposal = await proposalsRepository.updateProposal(db, tenantId, proposalId, data);
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar orçamento';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function deleteOrcamento(tenantId: string, proposalId: string) {
  const { db, close } = getDb();
  try {
    const proposal = await proposalsRepository.deleteProposal(db, tenantId, proposalId);
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir orçamento';
    return { success: false, message };
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Fluxo de envio e aceite
// ---------------------------------------------------------------------------

export async function enviarOrcamento(tenantId: string, proposalId: string) {
  const { db, close } = getDb();
  try {
    const proposal = await proposalsRepository.sendProposal(db, tenantId, proposalId);
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao enviar orçamento';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateOrcamentoStatus(
  tenantId: string,
  proposalId: string,
  status: ProposalStatus,
) {
  const { db, close } = getDb();
  try {
    const proposal = await proposalsRepository.updateProposalStatus(db, tenantId, proposalId, status);
    return { success: true, proposal };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar status';
    return { success: false, message };
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Itens
// ---------------------------------------------------------------------------

export async function addItemOrcamento(data: {
  proposalId: string;
  tipo: 'produto_catalogo' | 'manual';
  nome: string;
  precoVendaCents: number;
  productId?: string;
  descricao?: string;
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
  numPax?: number;
  moedaOriginal?: string;
  taxaCambio?: string;
  custoBaseCents?: number;
  markupPercentual?: string;
  snapshotPricingRules?: Record<string, unknown>;
  ordem?: number;
}) {
  const { db, close } = getDb();
  try {
    const item = await proposalsRepository.addProposalItem(db, data);
    return { success: true, item };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao adicionar item';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateItemOrcamento(
  tenantId: string,
  itemId: string,
  data: Parameters<typeof proposalsRepository.updateProposalItem>[3],
) {
  const { db, close } = getDb();
  try {
    const item = await proposalsRepository.updateProposalItem(db, tenantId, itemId, data);
    return { success: true, item };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar item';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function removeItemOrcamento(tenantId: string, itemId: string) {
  const { db, close } = getDb();
  try {
    const item = await proposalsRepository.removeProposalItem(db, tenantId, itemId);
    return { success: true, item };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao remover item';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function reorderItensOrcamento(
  tenantId: string,
  proposalId: string,
  orderedIds: string[],
) {
  const { db, close } = getDb();
  try {
    const ok = await proposalsRepository.reorderProposalItems(db, tenantId, proposalId, orderedIds);
    return { success: ok };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao reordenar itens';
    return { success: false, message };
  } finally {
    await close();
  }
}
