import { and, asc, eq, sql } from 'drizzle-orm';
import { suppliers, type SupplierStatus, type SupplierTipo, type SupplierApiTipo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateSupplierInput = {
  nome: string;
  tipo?: SupplierTipo | null;
  cnpj?: string | null;
  website?: string | null;
  pais?: string | null;
  cidade?: string | null;
  contatoNome?: string | null;
  contatoEmail?: string | null;
  contatoPhone?: string | null;
  contatoWhatsapp?: string | null;
  observacoes?: string | null;
  apiTipo?: SupplierApiTipo;
  apiAtivo?: boolean;
  status?: SupplierStatus;
};

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export type SupplierFilters = {
  status?: SupplierStatus;
  tipo?: SupplierTipo;
  apiAtivo?: boolean;
  limit?: number;
  offset?: number;
};

export async function createSupplier(db: NoroDatabase, input: CreateSupplierInput) {
  const [created] = await db.insert(suppliers).values(input).returning();
  return created ?? null;
}

export async function getSupplierById(db: NoroDatabase, supplierId: string) {
  return db.query.suppliers.findFirst({
    where: eq(suppliers.id, supplierId),
    with: { products: true },
  });
}

export async function getSuppliers(db: NoroDatabase, filters: SupplierFilters = {}) {
  const { status, tipo, apiAtivo, limit = 100, offset = 0 } = filters;

  const conditions = [];
  if (status) conditions.push(eq(suppliers.status, status));
  if (tipo) conditions.push(eq(suppliers.tipo, tipo));
  if (apiAtivo !== undefined) conditions.push(eq(suppliers.apiAtivo, apiAtivo));

  return db.query.suppliers.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [asc(suppliers.nome)],
    limit,
    offset,
  });
}

export async function updateSupplier(
  db: NoroDatabase,
  supplierId: string,
  input: UpdateSupplierInput,
) {
  const [updated] = await db
    .update(suppliers)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(suppliers.id, supplierId))
    .returning();
  return updated ?? null;
}

export async function deleteSupplier(db: NoroDatabase, supplierId: string) {
  const [deleted] = await db
    .delete(suppliers)
    .where(eq(suppliers.id, supplierId))
    .returning();
  return deleted ?? null;
}

export async function getSuppliersCountByTipo(db: NoroDatabase) {
  const rows = await db
    .select({ tipo: suppliers.tipo, count: sql<number>`count(*)::int` })
    .from(suppliers)
    .where(eq(suppliers.status, 'ativo'))
    .groupBy(suppliers.tipo);

  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.tipo ?? 'outro'] = row.count;
    return acc;
  }, {});
}
