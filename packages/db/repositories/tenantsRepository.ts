import { asc, eq } from 'drizzle-orm';
import { tenants, type TenantBillingStatus, type TenantStatus } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateTenantInput = {
  name: string;
  slug: string;
  legalName?: string | null;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: TenantStatus;
  planId?: string | null;
  billingStatus?: TenantBillingStatus;
  metadata?: Record<string, unknown> | null;
  portalSlug?: string | null;
  portalDomain?: string | null;
  portalTheme?: Record<string, unknown> | null;
};

export async function createTenant(db: NoroDatabase, input: CreateTenantInput) {
  const [created] = await db.insert(tenants).values(input).returning();
  return created ?? null;
}

export async function getTenantById(db: NoroDatabase, tenantId: string) {
  return db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });
}

export async function getTenantBySlug(db: NoroDatabase, slug: string) {
  return db.query.tenants.findFirst({
    where: eq(tenants.slug, slug),
  });
}

export async function listTenants(db: NoroDatabase, limit = 100) {
  return db.query.tenants.findMany({
    orderBy: [asc(tenants.name)],
    limit,
  });
}

export async function updateTenantStatus(
  db: NoroDatabase,
  tenantId: string,
  status: TenantStatus,
) {
  const [updated] = await db
    .update(tenants)
    .set({ status, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId))
    .returning();

  return updated ?? null;
}

export async function updateTenantPlan(db: NoroDatabase, tenantId: string, planId: string | null) {
  const [updated] = await db
    .update(tenants)
    .set({ planId, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId))
    .returning();

  return updated ?? null;
}

// Lookups para resolução de tenant pelo middleware do apps/portal
export async function getTenantByPortalSlug(db: NoroDatabase, portalSlug: string) {
  return db.query.tenants.findFirst({
    where: eq(tenants.portalSlug, portalSlug),
  });
}

export async function getTenantByPortalDomain(db: NoroDatabase, portalDomain: string) {
  return db.query.tenants.findFirst({
    where: eq(tenants.portalDomain, portalDomain),
  });
}

export async function updateTenantPortal(
  db: NoroDatabase,
  tenantId: string,
  input: {
    portalSlug?: string | null;
    portalDomain?: string | null;
    portalTheme?: Record<string, unknown> | null;
  },
) {
  const [updated] = await db
    .update(tenants)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId))
    .returning();
  return updated ?? null;
}

export async function updateTenantBillingStatus(
  db: NoroDatabase,
  tenantId: string,
  billingStatus: TenantBillingStatus,
) {
  const [updated] = await db
    .update(tenants)
    .set({ billingStatus, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId))
    .returning();

  return updated ?? null;
}
