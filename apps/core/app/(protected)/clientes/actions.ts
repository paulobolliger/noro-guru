'use server';

import { createDatabaseClient } from '@noro/db';
import type { ClientStatus, ClientTipo, ClientNivel, ClientSegmento } from '@noro/db';
import { randomUUID } from 'crypto';

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

export async function getClientes(tenantId: string, filters?: {
  status?: ClientStatus;
  assignedTo?: string;
  segmento?: string;
  limit?: number;
  offset?: number;
}): Promise<any[]> {
  const { client, close } = createDatabaseClient();
  try {
    const status = filters?.status || null;
    const assignedTo = filters?.assignedTo || null;
    const segmento = filters?.segmento || null;
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;

    const rows = await client`
      SELECT *
      FROM crm.clients
      WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        AND (${status}::text IS NULL OR status = ${status})
        AND (${assignedTo}::uuid IS NULL OR agente_responsavel_id = ${assignedTo})
        AND (${segmento}::text IS NULL OR segmento = ${segmento})
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return rows.map((row: any) => ({
      ...row,
      phone: row.telefone,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    }));
  } finally {
    await close();
  }
}

export async function getClienteById(tenantId: string, clienteId: string): Promise<any> {
  const { client, close } = createDatabaseClient();
  try {
    const [row] = await client`
      SELECT *
      FROM crm.clients
      WHERE id = ${clienteId} AND tenant_id = ${tenantId} AND deleted_at IS NULL
      LIMIT 1
    `;
    if (!row) return null;
    return {
      ...row,
      phone: row.telefone,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    };
  } finally {
    await close();
  }
}

export async function getClientesStats(tenantId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT status, count(*)::int as count
      FROM crm.clients
      WHERE tenant_id = ${tenantId} AND deleted_at IS NULL
      GROUP BY status
    `;

    return rows.reduce<Record<string, number>>((acc, row: any) => {
      acc[row.status] = row.count;
      return acc;
    }, {});
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
  nivel?: ClientNivel;
  segmento?: ClientSegmento;
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
}): Promise<{ success: boolean; cliente?: any; message?: string }> {
  const { client, close } = createDatabaseClient();
  try {
    const id = randomUUID();
    const now = new Date().toISOString();

    const columns = {
      id,
      tenant_id: tenantId,
      tipo: data.tipo || 'pessoa_fisica',
      nome: data.nome,
      email: data.email || null,
      telefone: data.phone || null,
      whatsapp: data.whatsapp || null,
      observacoes: data.observacoes || null,
      status: data.status || 'ativo',
      nivel: data.nivel || 'standard',
      segmento: data.segmento || null,
      cpf: data.cpf || null,
      cnpj: data.cnpj || null,
      nacionalidade: data.nacionalidade || 'brasileira',
      profissao: null as string | null, // Wait, data doesn't have a direct profissao but we can support standard fields
      data_nascimento: data.dataNascimento || null,
      razao_social: null as string | null,
      nome_fantasia: null as string | null,
      responsavel_nome: null as string | null,
      responsavel_cargo: null as string | null,
      created_at: now,
      updated_at: now,
    };

    const [created] = await client`
      INSERT INTO crm.clients (
        id, tenant_id, tipo, nome, email, telefone, whatsapp, observacoes, status, nivel, segmento,
        cpf, cnpj, nacionalidade, data_nascimento, created_at, updated_at
      ) VALUES (
        ${columns.id}, ${columns.tenant_id}, ${columns.tipo}, ${columns.nome}, ${columns.email},
        ${columns.telefone}, ${columns.whatsapp}, ${columns.observacoes}, ${columns.status},
        ${columns.nivel}, ${columns.segmento}, ${columns.cpf}, ${columns.cnpj}, ${columns.nacionalidade},
        ${columns.data_nascimento}, ${columns.created_at}, ${columns.updated_at}
      )
      RETURNING *
    `;

    // If sub-table fields are passed, write them to respective tables
    if (data.passaporteNumero) {
      await client`
        INSERT INTO crm.client_documents (
          tenant_id, cliente_id, tipo, numero, pais_emissor, data_validade, arquivo_url
        ) VALUES (
          ${tenantId}, ${id}, 'passaporte', ${data.passaporteNumero}, ${data.passaportePais || null}, 
          ${data.passaporteValidade || null}, ${data.passaporteDocUrl || null}
        )
      `;
    }

    if (data.enderecoCidade || data.enderecoEstado || data.enderecoPais) {
      await client`
        INSERT INTO crm.client_addresses (
          tenant_id, cliente_id, cidade, estado, pais, principal, logradouro, tipo
        ) VALUES (
          ${tenantId}, ${id}, ${data.enderecoCidade || 'Não Informado'}, ${data.enderecoEstado || ''}, 
          ${data.enderecoPais || 'Brasil'}, true, 'Não Informado', 'residencial'
        )
      `;
    }

    if (data.contatoEmergenciaNome || data.contatoEmergenciaPhone) {
      await client`
        INSERT INTO sales.emergency_contacts (
          tenant_id, cliente_id, nome, telefone, parentesco
        ) VALUES (
          ${tenantId}, ${id}, ${data.contatoEmergenciaNome || null}, 
          ${data.contatoEmergenciaPhone || null}, ${data.contatoEmergenciaParentesco || null}
        )
      `;
    }

    if (data.destinosDesejados || data.destinosVisitados || data.restricoesAlimentares || data.classeVooPref) {
      await client`
        INSERT INTO crm.client_preferences (
          tenant_id, cliente_id, estilo_viagem, destinos_favoritos, destinos_desejados,
          classe_preferida, restricoes_alimentares, updated_at
        ) VALUES (
          ${tenantId}, ${id}, ${data.destinosVisitados || []}, ${data.destinosVisitados || []}, 
          ${data.destinosDesejados || []}, ${data.classeVooPref || null}, 
          ${data.restricoesAlimentares || []}, NOW()
        )
      `;
    }

    return {
      success: true,
      cliente: created ? {
        ...created,
        phone: created.telefone,
        createdAt: created.created_at ? new Date(created.created_at) : new Date(),
        updatedAt: created.updated_at ? new Date(created.updated_at) : new Date(),
      } : null
    };
  } catch (err: any) {
    console.error('Error in createClienteAction:', err);
    return { success: false, message: err.message || 'Erro ao criar cliente' };
  } finally {
    await close();
  }
}

export async function updateClienteAction(
  tenantId: string,
  clienteId: string,
  data: Partial<Omit<Parameters<typeof createClienteAction>[1], 'tenantId'>>,
): Promise<{ success: boolean; cliente?: any; message?: string }> {
  const { client, close } = createDatabaseClient();
  try {
    const now = new Date().toISOString();

    const [existing] = await client`
      SELECT * FROM crm.clients WHERE id = ${clienteId} AND tenant_id = ${tenantId} AND deleted_at IS NULL LIMIT 1
    `;
    if (!existing) {
      return { success: false, message: 'Cliente não encontrado' };
    }

    const updates = {
      tipo: data.tipo !== undefined ? data.tipo : existing.tipo,
      nome: data.nome !== undefined ? data.nome : existing.nome,
      email: data.email !== undefined ? data.email : existing.email,
      telefone: data.phone !== undefined ? data.phone : existing.telefone,
      whatsapp: data.whatsapp !== undefined ? data.whatsapp : existing.whatsapp,
      observacoes: data.observacoes !== undefined ? data.observacoes : existing.observacoes,
      status: data.status !== undefined ? data.status : existing.status,
      nivel: data.nivel !== undefined ? data.nivel : existing.nivel,
      segmento: data.segmento !== undefined ? data.segmento : existing.segmento,
      cpf: data.cpf !== undefined ? data.cpf : existing.cpf,
      cnpj: data.cnpj !== undefined ? data.cnpj : existing.cnpj,
      nacionalidade: data.nacionalidade !== undefined ? data.nacionalidade : existing.nacionalidade,
      data_nascimento: data.dataNascimento !== undefined ? data.dataNascimento : existing.data_nascimento,
      updated_at: now,
    };

    const [updated] = await client`
      UPDATE crm.clients
      SET
        tipo = ${updates.tipo},
        nome = ${updates.nome},
        email = ${updates.email},
        telefone = ${updates.telefone},
        whatsapp = ${updates.whatsapp},
        observacoes = ${updates.observacoes},
        status = ${updates.status},
        nivel = ${updates.nivel},
        segmento = ${updates.segmento},
        cpf = ${updates.cpf},
        cnpj = ${updates.cnpj},
        nacionalidade = ${updates.nacionalidade},
        data_nascimento = ${updates.data_nascimento},
        updated_at = ${updates.updated_at}
      WHERE id = ${clienteId} AND tenant_id = ${tenantId} AND deleted_at IS NULL
      RETURNING *
    `;

    return {
      success: true,
      cliente: updated ? {
        ...updated,
        phone: updated.telefone,
        createdAt: updated.created_at ? new Date(updated.created_at) : new Date(),
        updatedAt: updated.updated_at ? new Date(updated.updated_at) : new Date(),
      } : null
    };
  } catch (err: any) {
    console.error('Error in updateClienteAction:', err);
    return { success: false, message: err.message || 'Erro ao atualizar cliente' };
  } finally {
    await close();
  }
}

export async function deleteClienteAction(tenantId: string, clienteId: string): Promise<{ success: boolean; cliente?: any; message?: string }> {
  const { client, close } = createDatabaseClient();
  try {
    const [deleted] = await client`
      UPDATE crm.clients
      SET deleted_at = NOW()
      WHERE id = ${clienteId} AND tenant_id = ${tenantId}
      RETURNING *
    `;
    return {
      success: true,
      cliente: deleted ? {
        ...deleted,
        phone: deleted.telefone,
        createdAt: deleted.created_at ? new Date(deleted.created_at) : new Date(),
        updatedAt: deleted.updated_at ? new Date(deleted.updated_at) : new Date(),
      } : null
    };
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir cliente';
    return { success: false, message };
  } finally {
    await close();
  }
}

