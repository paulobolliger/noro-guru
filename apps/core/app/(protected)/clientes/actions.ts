'use server';

import { createDatabaseClient } from '@noro/db';
import { clientsRepository } from '@noro/db';
import type { ClientStatus, ClientTipo } from '@noro/db';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDb() {
  return createDatabaseClient();
}

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

export async function getClientes(tenantId: string, filters?: {
  status?: ClientStatus;
  assignedTo?: string;
  segmento?: string;
  limit?: number;
  offset?: number;
}) {
  const { db, close } = getDb();
  try {
    return await clientsRepository.getClientsByTenant(db, tenantId, filters);
  } finally {
    await close();
  }
}

export async function getClienteById(tenantId: string, clienteId: string) {
  const { db, close } = getDb();
  try {
    return await clientsRepository.getClientById(db, tenantId, clienteId);
  } finally {
    await close();
  }
}

export async function getClientesStats(tenantId: string) {
  const { db, close } = getDb();
  try {
    return await clientsRepository.getClientsCountByStatus(db, tenantId);
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Escrita
// ---------------------------------------------------------------------------

export async function createClienteAction(tenantId: string, data: {
  tipo: ClientTipo;
  nome: string;
  leadId?: string;
  nomePreferido?: string;
  cpf?: string;
  cnpj?: string;
  dataNascimento?: string;
  genero?: string;
  nacionalidade?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  enderecoCidade?: string;
  enderecoEstado?: string;
  enderecoPais?: string;
  passaporteNumero?: string;
  passaportePais?: string;
  passaporteValidade?: string;
  passaporteDocUrl?: string;
  rg?: string;
  cnhNumero?: string;
  cnhValidade?: string;
  cnhCategorias?: string[];
  restricoesAlimentares?: string[];
  restricoesMedicas?: string;
  nivelMobilidade?: string;
  aptoAtividadeFisica?: boolean;
  status?: ClientStatus;
  nivel?: string;
  segmento?: string;
  assignedTo?: string;
  destinosVisitados?: string[];
  destinosDesejados?: string[];
  tipoAcomodacaoPref?: string;
  classeVooPref?: string;
  viajacom?: string[];
  contatoEmergenciaNome?: string;
  contatoEmergenciaPhone?: string;
  contatoEmergenciaParentesco?: string;
  lgpdAceito?: boolean;
  lgpdAceitoAt?: Date;
  lgpdVersao?: string;
  observacoes?: string;
}) {
  const { db, close } = getDb();
  try {
    const cliente = await clientsRepository.createClient(db, { tenantId, ...data });
    return { success: true, cliente };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar cliente';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateClienteAction(
  tenantId: string,
  clienteId: string,
  data: Parameters<typeof clientsRepository.updateClient>[3],
) {
  const { db, close } = getDb();
  try {
    const cliente = await clientsRepository.updateClient(db, tenantId, clienteId, data);
    return { success: true, cliente };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function deleteClienteAction(tenantId: string, clienteId: string) {
  const { db, close } = getDb();
  try {
    const cliente = await clientsRepository.deleteClient(db, tenantId, clienteId);
    return { success: true, cliente };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir cliente';
    return { success: false, message };
  } finally {
    await close();
  }
}
