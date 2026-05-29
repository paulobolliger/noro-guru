'use server';

import { createDatabaseClient, productsRepository } from '@noro/db';
import type { ProductCategoria, ProductStatus, ProductPrecoTipo, ProductMoeda } from '@noro/db';

function getDb() {
  return createDatabaseClient();
}

export async function getProdutos(filters?: {
  categoria?: ProductCategoria;
  status?: ProductStatus;
  supplierId?: string;
  precoTipo?: ProductPrecoTipo;
  moeda?: ProductMoeda;
  limit?: number;
  offset?: number;
}) {
  const { db, close } = getDb();
  try {
    return await productsRepository.getProducts(db, filters);
  } finally {
    await close();
  }
}

export async function getProdutoById(id: string) {
  const { db, close } = getDb();
  try {
    return await productsRepository.getProductById(db, id);
  } finally {
    await close();
  }
}

export async function getProdutosStats() {
  const { db, close } = getDb();
  try {
    return await productsRepository.getProductsCountByCategoria(db);
  } finally {
    await close();
  }
}

export async function createProdutoAction(data: {
  categoria: ProductCategoria;
  nome: string;
  precoTipo: ProductPrecoTipo;
  supplierId?: string;
  descricao?: string;
  destinoPais?: string;
  destinoCidade?: string;
  destinoRegiao?: string;
  duracaoMinutos?: number;
  capacidadeMin?: number;
  capacidadeMax?: number;
  incluiIngresso?: boolean;
  incluiTransfer?: boolean;
  moeda?: ProductMoeda;
  tags?: string[];
  observacoesInternas?: string;
}) {
  const { db, close } = getDb();
  try {
    const produto = await productsRepository.createProduct(db, data);
    return { success: true, produto };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar produto';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function updateProdutoAction(
  id: string,
  data: Parameters<typeof productsRepository.updateProduct>[2],
) {
  const { db, close } = getDb();
  try {
    const produto = await productsRepository.updateProduct(db, id, data);
    return { success: true, produto };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar produto';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function deleteProdutoAction(id: string) {
  const { db, close } = getDb();
  try {
    const produto = await productsRepository.deleteProduct(db, id);
    return { success: true, produto };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir produto';
    return { success: false, message };
  } finally {
    await close();
  }
}
