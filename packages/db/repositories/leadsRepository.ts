import { and, desc, eq, sql } from 'drizzle-orm';
import { leads, type LeadStatus, type LeadSource } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateLeadInput = {
  tenantId: string;
  nome: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  organizationName?: string | null;
  source: LeadSource;
  sourceDetail?: string | null;
  assignedTo?: string | null;
  budgetMinCents?: number | null;
  budgetMaxCents?: number | null;
  destinosInteresse?: string[] | null;
  dataViagemInicio?: string | null;
  dataViagemFim?: string | null;
  numPax?: number | null;
  tipoViagem?: string | null;
  status?: LeadStatus;
};

export type UpdateLeadInput = Partial<Omit<CreateLeadInput, 'tenantId'>>;

export type LeadFilters = {
  status?: LeadStatus;
  assignedTo?: string;
  source?: LeadSource;
  limit?: number;
  offset?: number;
};

export async function createLead(db: NoroDatabase, input: CreateLeadInput) {
  const [created] = await db.insert(leads).values(input).returning();
  return created ?? null;
}

export async function getLeadById(db: NoroDatabase, tenantId: string, leadId: string) {
  return db.query.leads.findFirst({
    where: and(eq(leads.id, leadId), eq(leads.tenantId, tenantId)),
  });
}

export async function getLeadsByTenant(
  db: NoroDatabase,
  tenantId: string,
  filters: LeadFilters = {},
) {
  const { status, assignedTo, source, limit = 100, offset = 0 } = filters;

  const conditions = [eq(leads.tenantId, tenantId)];
  if (status) conditions.push(eq(leads.status, status));
  if (assignedTo) conditions.push(eq(leads.assignedTo, assignedTo));
  if (source) conditions.push(eq(leads.source, source));

  return db.query.leads.findMany({
    where: and(...conditions),
    orderBy: [desc(leads.createdAt)],
    limit,
    offset,
  });
}

export async function updateLead(
  db: NoroDatabase,
  tenantId: string,
  leadId: string,
  input: UpdateLeadInput,
) {
  const [updated] = await db
    .update(leads)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(leads.id, leadId), eq(leads.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

export async function updateLeadStatus(
  db: NoroDatabase,
  tenantId: string,
  leadId: string,
  status: LeadStatus,
  extras?: { lostReason?: string; convertedTo?: string; convertedAt?: Date },
) {
  const [updated] = await db
    .update(leads)
    .set({
      status,
      updatedAt: new Date(),
      ...(status === 'ganho' && extras?.convertedTo
        ? { convertedTo: extras.convertedTo, convertedAt: extras.convertedAt ?? new Date() }
        : {}),
      ...(status === 'perdido' && extras?.lostReason
        ? { lostReason: extras.lostReason as any }
        : {}),
    })
    .where(and(eq(leads.id, leadId), eq(leads.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

export async function deleteLead(db: NoroDatabase, tenantId: string, leadId: string) {
  const [deleted] = await db
    .delete(leads)
    .where(and(eq(leads.id, leadId), eq(leads.tenantId, tenantId)))
    .returning();
  return deleted ?? null;
}

export async function getLeadsCountByStatus(db: NoroDatabase, tenantId: string) {
  const rows = await db
    .select({ status: leads.status, count: sql<number>`count(*)::int` })
    .from(leads)
    .where(eq(leads.tenantId, tenantId))
    .groupBy(leads.status);

  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {});
}
