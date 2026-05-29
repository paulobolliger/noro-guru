'use server';

import { createDatabaseClient } from '@noro/db';
import { leadsRepository } from '@noro/db';
import type { LeadSource, LeadStatus } from '@noro/db';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDb() {
  return createDatabaseClient();
}

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

export async function getLeads(tenantId: string, filters?: {
  status?: LeadStatus;
  assignedTo?: string;
  source?: LeadSource;
  limit?: number;
  offset?: number;
}) {
  const { db, close } = getDb();
  try {
    return await leadsRepository.getLeadsByTenant(db, tenantId, filters);
  } finally {
    await close();
  }
}

export async function getLeadById(tenantId: string, leadId: string) {
  const { db, close } = getDb();
  try {
    return await leadsRepository.getLeadById(db, tenantId, leadId);
  } finally {
    await close();
  }
}

export async function getLeadsStats(tenantId: string) {
  const { db, close } = getDb();
  try {
    return await leadsRepository.getLeadsCountByStatus(db, tenantId);
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Escrita
// ---------------------------------------------------------------------------

export async function createLeadAction(tenantId: string, data: {
  nome: string;
  source: LeadSource;
  email?: string;
  phone?: string;
  whatsapp?: string;
  organizationName?: string;
  sourceDetail?: string;
  assignedTo?: string;
  budgetMinCents?: number;
  budgetMaxCents?: number;
  destinosInteresse?: string[];
  dataViagemInicio?: string;
  dataViagemFim?: string;
  numPax?: number;
  tipoViagem?: string;
}) {
  const { db, close } = getDb();
  try {
    const lead = await leadsRepository.createLead(db, { tenantId, ...data });
    return { success: true, lead };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar lead';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateLeadAction(
  tenantId: string,
  leadId: string,
  data: Parameters<typeof leadsRepository.updateLead>[3],
) {
  const { db, close } = getDb();
  try {
    const lead = await leadsRepository.updateLead(db, tenantId, leadId, data);
    return { success: true, lead };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar lead';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateLeadStatusAction(
  tenantId: string,
  leadId: string,
  status: LeadStatus,
  extras?: { lostReason?: string; convertedTo?: string },
) {
  const { db, close } = getDb();
  try {
    const lead = await leadsRepository.updateLeadStatus(db, tenantId, leadId, status, extras);
    return { success: true, lead };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar status';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function deleteLeadAction(tenantId: string, leadId: string) {
  const { db, close } = getDb();
  try {
    const lead = await leadsRepository.deleteLead(db, tenantId, leadId);
    return { success: true, lead };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir lead';
    return { success: false, message };
  } finally {
    await close();
  }
}
