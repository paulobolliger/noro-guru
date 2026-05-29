import { platformRolesRepository } from '@noro/db';
import { PlatformRoleRequiredError } from '../errors';
import type {
  PlatformContext,
  RequirePlatformRoleInput,
} from '../types';

export async function requirePlatformRole(
  input: RequirePlatformRoleInput,
): Promise<PlatformContext> {
  for (const role of input.roles) {
    const hasRole = await platformRolesRepository.hasPlatformRole(
      input.db,
      input.userContext.user.id,
      role,
    );

    if (hasRole) {
      return {
        user: input.userContext.user,
        roles: input.roles,
        matchedRole: role,
      };
    }
  }

  throw new PlatformRoleRequiredError();
}

export async function resolvePlatformContext(input: RequirePlatformRoleInput) {
  return requirePlatformRole(input);
}

export async function assertPlatformAccess(input: RequirePlatformRoleInput) {
  return requirePlatformRole(input);
}
