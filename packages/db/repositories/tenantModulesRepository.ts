import { and, asc, eq } from 'drizzle-orm';
import {
  modules,
  planModules,
  tenantModules,
  tenants,
  type ModuleKey,
  type TenantModuleSource,
  type TenantModuleStatus,
} from '../schema';
import type { NoroDatabase } from '../index';

export async function getTenantModule(db: NoroDatabase, tenantId: string, moduleId: string) {
  return db.query.tenantModules.findFirst({
    where: and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.moduleId, moduleId)),
    with: {
      module: true,
    },
  });
}

export async function listTenantModules(db: NoroDatabase, tenantId: string) {
  return db.query.tenantModules.findMany({
    where: eq(tenantModules.tenantId, tenantId),
    orderBy: [asc(tenantModules.createdAt)],
    with: {
      module: true,
    },
  });
}

export async function enableTenantModule(
  db: NoroDatabase,
  input: {
    tenantId: string;
    moduleId: string;
    source?: TenantModuleSource;
    startsAt?: Date | null;
    endsAt?: Date | null;
    limits?: Record<string, unknown> | null;
    settings?: Record<string, unknown> | null;
  },
) {
  const [created] = await db
    .insert(tenantModules)
    .values({
      ...input,
      status: 'enabled',
      source: input.source ?? 'manual',
    })
    .returning();

  return created ?? null;
}

export async function disableTenantModule(db: NoroDatabase, tenantId: string, moduleId: string) {
  return setTenantModuleStatus(db, tenantId, moduleId, 'disabled');
}

export async function suspendTenantModule(db: NoroDatabase, tenantId: string, moduleId: string) {
  return setTenantModuleStatus(db, tenantId, moduleId, 'suspended');
}

export async function setTenantModuleStatus(
  db: NoroDatabase,
  tenantId: string,
  moduleId: string,
  status: TenantModuleStatus,
) {
  const [updated] = await db
    .update(tenantModules)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.moduleId, moduleId)))
    .returning();

  return updated ?? null;
}

export async function resolveEffectiveModuleAccess(
  db: NoroDatabase,
  tenantId: string,
  moduleKey: ModuleKey,
) {
  const module = await db.query.modules.findFirst({
    where: eq(modules.key, moduleKey),
  });

  if (!module || module.status !== 'active') {
    return { enabled: false, source: 'module_unavailable' as const, module, tenantModule: null };
  }

  const tenantModule = await getTenantModule(db, tenantId, module.id);
  if (tenantModule) {
    return {
      enabled: tenantModule.status === 'enabled' || tenantModule.status === 'trial',
      source: 'tenant_modules' as const,
      module,
      tenantModule,
    };
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant?.planId) {
    return { enabled: false, source: 'no_plan' as const, module, tenantModule: null };
  }

  const planModule = await db.query.planModules.findFirst({
    where: and(eq(planModules.planId, tenant.planId), eq(planModules.moduleId, module.id)),
  });

  return {
    enabled: Boolean(planModule && planModule.status === 'enabled'),
    source: 'plan_modules' as const,
    module,
    tenantModule: null,
    planModule,
  };
}

export async function assertModuleEnabled(
  db: NoroDatabase,
  tenantId: string,
  moduleKey: ModuleKey,
) {
  const access = await resolveEffectiveModuleAccess(db, tenantId, moduleKey);

  if (!access.enabled) {
    throw new Error('Tenant module is not enabled.');
  }

  return access;
}
