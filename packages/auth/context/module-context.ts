import { tenantModulesRepository } from '@noro/db';
import { ModuleNotEnabledError } from '../errors';
import type {
  ModuleAccessContext,
  RequireModuleEnabledInput,
} from '../types';

function isWithinWindow(
  startsAt: Date | null | undefined,
  endsAt: Date | null | undefined,
  now: Date,
) {
  if (startsAt && startsAt > now) {
    return false;
  }

  if (endsAt && endsAt < now) {
    return false;
  }

  return true;
}

export async function requireModuleEnabled(
  input: RequireModuleEnabledInput,
): Promise<ModuleAccessContext> {
  const access = await tenantModulesRepository.resolveEffectiveModuleAccess(
    input.db,
    input.tenantContext.tenant.id,
    input.moduleKey,
  );

  if (!access.module || access.module.status !== 'active') {
    throw new ModuleNotEnabledError();
  }

  const now = input.now ?? new Date();
  const tenantModule = access.tenantModule ?? null;
  const planModule = 'planModule' in access ? access.planModule ?? null : null;

  const tenantModuleEnabled =
    tenantModule &&
    (tenantModule.status === 'enabled' || tenantModule.status === 'trial') &&
    isWithinWindow(tenantModule.startsAt, tenantModule.endsAt, now);

  const planModuleEnabled = !tenantModule && planModule?.status === 'enabled';
  const enabled = Boolean(tenantModuleEnabled || planModuleEnabled);

  if (!enabled) {
    throw new ModuleNotEnabledError();
  }

  return {
    module: {
      id: access.module.id,
      key: access.module.key,
      status: access.module.status,
    },
    tenantModule,
    planModule,
    enabled,
    source: access.source,
    limits: tenantModule?.limits ?? planModule?.limits ?? null,
    settings: tenantModule?.settings ?? planModule?.settings ?? null,
  };
}
