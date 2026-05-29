import {
  AuthorizationDeniedError,
  ModuleNotEnabledError,
  PlatformRoleRequiredError,
  TenantAccessDeniedError,
} from '../errors';
import type {
  AuthorizationAction,
  AuthorizationResult,
  AuthorizeInput,
} from '../types';

const platformActionRoles: Partial<Record<AuthorizationAction, string[]>> = {
  'platform:tenants:read': ['platform_owner', 'platform_admin', 'platform_ops', 'platform_support'],
  'platform:tenants:write': ['platform_owner', 'platform_admin', 'platform_ops'],
  'platform:modules:manage': ['platform_owner', 'platform_admin'],
  'platform:billing:read': ['platform_owner', 'platform_admin', 'platform_finance'],
  'platform:billing:write': ['platform_owner', 'platform_admin', 'platform_finance'],
};

const tenantActionRoles: Partial<Record<AuthorizationAction, string[]>> = {
  'tenant:crm:read': ['tenant_owner', 'tenant_admin', 'tenant_manager', 'tenant_agent', 'tenant_viewer'],
  'tenant:crm:write': ['tenant_owner', 'tenant_admin', 'tenant_manager', 'tenant_agent'],
  'tenant:settings:read': ['tenant_owner', 'tenant_admin', 'tenant_manager'],
  'tenant:settings:write': ['tenant_owner', 'tenant_admin'],
  'tenant:finance:read': ['tenant_owner', 'tenant_admin', 'tenant_finance'],
  'tenant:finance:write': ['tenant_owner', 'tenant_admin', 'tenant_finance'],
  'tenant:proposals:read': ['tenant_owner', 'tenant_admin', 'tenant_manager', 'tenant_agent', 'tenant_viewer'],
  'tenant:proposals:write': ['tenant_owner', 'tenant_admin', 'tenant_manager', 'tenant_agent'],
  'tenant:sites:read': ['tenant_owner', 'tenant_admin', 'tenant_manager', 'tenant_viewer'],
  'tenant:sites:write': ['tenant_owner', 'tenant_admin', 'tenant_manager'],
};

function deny(reason: string, assert = false): AuthorizationResult {
  if (assert) {
    throw new AuthorizationDeniedError();
  }

  return { allowed: false, reason };
}

export function authorize(input: AuthorizeInput): AuthorizationResult {
  const platformRoles = platformActionRoles[input.action];
  if (platformRoles) {
    const matchedRole = input.platformContext?.matchedRole;
    if (!matchedRole) {
      if (input.assert) {
        throw new PlatformRoleRequiredError();
      }

      return { allowed: false, reason: 'platform_role_required' };
    }

    if (platformRoles.includes(matchedRole)) {
      return { allowed: true, matchedRule: `platform:${matchedRole}` };
    }

    return deny('platform_role_not_allowed', input.assert);
  }

  const tenantRoles = tenantActionRoles[input.action];
  if (!tenantRoles) {
    return deny('unknown_action', input.assert);
  }

  if (!input.tenantContext?.membership) {
    if (input.assert) {
      throw new TenantAccessDeniedError();
    }

    return { allowed: false, reason: 'tenant_membership_required' };
  }

  if (input.resourceTenantId && input.resourceTenantId !== input.tenantContext.tenant.id) {
    return deny('resource_tenant_mismatch', input.assert);
  }

  if (input.moduleContext && !input.moduleContext.enabled) {
    if (input.assert) {
      throw new ModuleNotEnabledError();
    }

    return { allowed: false, reason: 'module_not_enabled' };
  }

  const role = input.tenantContext.membership.role;
  if (tenantRoles.includes(role)) {
    return { allowed: true, matchedRule: `tenant:${role}` };
  }

  return deny('tenant_role_not_allowed', input.assert);
}
