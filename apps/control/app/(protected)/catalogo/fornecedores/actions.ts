'use server';

import { createDatabaseClient, suppliersRepository } from '@noro/db';
import type { SupplierStatus, SupplierTipo, SupplierApiTipo } from '@noro/db';

function getDb() {
  return createDatabaseClient();
}

export async function getFornecedores(filters?: {
  status?: SupplierStatus;
  tipo?: SupplierTipo;
  apiAtivo?: boolean;
  limit?: number;
  offset?: number;
}) {
  const { db, close } = getDb();
  try {
    return await suppliersRepository.getSuppliers(db, filters);
  } finally {
    await close();
  }
}

export async function getFornecedorById(id: string) {
  const { db, close } = getDb();
  try {
    return await suppliersRepository.getSupplierById(db, id);
  } finally {
    await close();
  }
}

export async function getFornecedoresStats() {
  const { db, close } = getDb();
  try {
    return await suppliersRepository.getSuppliersCountByTipo(db);
  } finally {
    await close();
  }
}

export async function createFornecedorAction(data: {
  nome: string;
  tipo?: SupplierTipo;
  cnpj?: string;
  website?: string;
  pais?: string;
  cidade?: string;
  contatoNome?: string;
  contatoEmail?: string;
  contatoPhone?: string;
  contatoWhatsapp?: string;
  observacoes?: string;
  apiTipo?: SupplierApiTipo;
  apiAtivo?: boolean;
}) {
  const { db, close } = getDb();
  try {
    const fornecedor = await suppliersRepository.createSupplier(db, data);
    return { success: true, fornecedor };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar fornecedor';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateFornecedorAction(
  id: string,
  data: Parameters<typeof suppliersRepository.updateSupplier>[2],
) {
  const { db, close } = getDb();
  try {
    const fornecedor = await suppliersRepository.updateSupplier(db, id, data);
    return { success: true, fornecedor };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar fornecedor';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function deleteFornecedorAction(id: string) {
  const { db, close } = getDb();
  try {
    const fornecedor = await suppliersRepository.deleteSupplier(db, id);
    return { success: true, fornecedor };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir fornecedor';
    return { success: false, message };
  } finally {
    await close();
  }
}
