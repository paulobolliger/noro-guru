import { and, asc, eq, sql } from 'drizzle-orm';
import {
  products,
  type ProductCategoria,
  type ProductStatus,
  type ProductPrecoTipo,
  type ProductMoeda,
} from '../schema';
import type { NoroDatabase } from '../index';

export type CreateProductInput = {
  supplierId?: string | null;
  categoria: ProductCategoria;
  nome: string;
  descricao?: string | null;
  destinoPais?: string | null;
  destinoCidade?: string | null;
  destinoRegiao?: string | null;
  duracaoMinutos?: number | null;
  capacidadeMin?: number | null;
  capacidadeMax?: number | null;
  incluiIngresso?: boolean | null;
  incluiTransfer?: boolean | null;
  moeda?: ProductMoeda;
  precoTipo: ProductPrecoTipo;
  status?: ProductStatus;
  tags?: string[] | null;
  observacoesInternas?: string | null;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  precoAtualizadoAt?: Date | null;
};

export type ProductFilters = {
  categoria?: ProductCategoria;
  status?: ProductStatus;
  supplierId?: string;
  precoTipo?: ProductPrecoTipo;
  moeda?: ProductMoeda;
  limit?: number;
  offset?: number;
};

export async function createProduct(db: NoroDatabase, input: CreateProductInput) {
  const [created] = await db.insert(products).values(input).returning();
  return created ?? null;
}

export async function getProductById(db: NoroDatabase, productId: string) {
  return db.query.products.findFirst({
    where: eq(products.id, productId),
    with: { supplier: true },
  });
}

export async function getProducts(db: NoroDatabase, filters: ProductFilters = {}) {
  const { categoria, status, supplierId, precoTipo, moeda, limit = 100, offset = 0 } = filters;

  const conditions = [];
  if (categoria) conditions.push(eq(products.categoria, categoria));
  if (status) conditions.push(eq(products.status, status));
  if (supplierId) conditions.push(eq(products.supplierId, supplierId));
  if (precoTipo) conditions.push(eq(products.precoTipo, precoTipo));
  if (moeda) conditions.push(eq(products.moeda, moeda));

  return db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: { supplier: true },
    orderBy: [asc(products.nome)],
    limit,
    offset,
  });
}

export async function updateProduct(
  db: NoroDatabase,
  productId: string,
  input: UpdateProductInput,
) {
  const [updated] = await db
    .update(products)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning();
  return updated ?? null;
}

export async function deleteProduct(db: NoroDatabase, productId: string) {
  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, productId))
    .returning();
  return deleted ?? null;
}

export async function getProductsCountByCategoria(db: NoroDatabase) {
  const rows = await db
    .select({ categoria: products.categoria, count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.status, 'ativo'))
    .groupBy(products.categoria);

  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.categoria] = row.count;
    return acc;
  }, {});
}
