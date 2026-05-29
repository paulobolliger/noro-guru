import { membershipsRepository, tenantsRepository } from '@noro/db';
import {
  TenantAccessDeniedError,
  TenantRequiredError,
} from '../errors';
import type {
  ResolveTenantContextInput,
  RequireTenantMembershipInput,
  TenantContext,
} from '../types';

export async function requireTenantMembership(
  input: RequireTenantMembershipInput,
): Promise<TenantContext> {
  if (input.allowPlatformOverride && input.platformContext) {
    const tenant = await tenantsRepository.getTenantById(input.db, input.tenantId);
    if (!tenant || tenant.status !== 'active') {
      throw new TenantAccessDeniedError();
    }

    return {
      tenant,
      source: 'control',
      selectedByPlatformUser: true,
    };
  }

  const membership = await membershipsRepository.getMembership(
    input.db,
    input.tenantId,
    input.userContext.user.id,
  );

  if (!membership || membership.status !== 'active') {
    throw new TenantAccessDeniedError();
  }

  if (input.roles?.length && !input.roles.includes(membership.role)) {
    throw new TenantAccessDeniedError();
  }

  const tenant = await tenantsRepository.getTenantById(input.db, input.tenantId);
  if (!tenant || tenant.status !== 'active') {
    throw new TenantAccessDeniedError();
  }

  return {
    tenant,
    source: 'core',
    membership: {
      id: membership.id,
      tenantId: membership.tenantId,
      userId: membership.userId,
      role: membership.role,
      status: membership.status,
    },
  };
}

export async function resolveTenantContext(
  input: ResolveTenantContextInput,
): Promise<TenantContext> {
  if (input.source === 'sites') {
    throw new TenantRequiredError();
  }

  if (input.source === 'control') {
    const tenantId = input.selectedTenantId;
    const tenantSlug = input.selectedTenantSlug;

    if (!input.platformContext || (!tenantId && !tenantSlug)) {
      throw new TenantRequiredError();
    }

    const tenant = tenantId
      ? await tenantsRepository.getTenantById(input.db, tenantId)
      : await tenantsRepository.getTenantBySlug(input.db, tenantSlug as string);

    if (!tenant || tenant.status !== 'active') {
      throw new TenantAccessDeniedError();
    }

    return {
      tenant,
      source: 'control',
      selectedByPlatformUser: true,
    };
  }

  const tenantId = input.selectedTenantId;
  const tenantSlug = input.pathTenantSlug ?? input.selectedTenantSlug;

  if (!input.userContext || (!tenantId && !tenantSlug)) {
    throw new TenantRequiredError();
  }

  const tenant = tenantId
    ? await tenantsRepository.getTenantById(input.db, tenantId)
    : await tenantsRepository.getTenantBySlug(input.db, tenantSlug as string);

  if (!tenant) {
    throw new TenantRequiredError();
  }

  return requireTenantMembership({
    db: input.db,
    userContext: input.userContext,
    tenantId: tenant.id,
  });
}

export async function assertTenantAccess(input: RequireTenantMembershipInput) {
  return requireTenantMembership(input);
}
