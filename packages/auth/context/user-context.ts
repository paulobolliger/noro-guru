import { authIdentityRepository, usersRepository, tenantsRepository, membershipsRepository } from '@noro/db';
import {
  UnauthenticatedError,
  UserBlockedError,
  UserNotFoundError,
} from '../errors';
import type { AuthClaims, AuthContextInput, AuthUserContext, AuthProvider } from '../types';

async function resolveClaims(input: AuthContextInput): Promise<AuthClaims | null> {
  if (input.claims) {
    return input.claims;
  }

  if (input.sessionAdapter) {
    return input.sessionAdapter();
  }

  return null;
}

export async function requireUser(input: AuthContextInput): Promise<AuthUserContext> {
  const claims = await resolveClaims(input);
  const provider: AuthProvider = (claims?.provider as AuthProvider) || 'keycloak';
  const providerSubject = claims?.subject;

  if (!providerSubject) {
    throw new UnauthenticatedError();
  }

  let identity = await authIdentityRepository.findUserByProviderSubject(
    input.db,
    provider,
    providerSubject,
  );

  if (!identity?.user) {
    const email = claims?.email ?? null;
    const name = claims?.name ?? null;

    if (!email) {
      throw new UserNotFoundError();
    }

    // 1. Check if user already exists by email
    let user = await usersRepository.getUserByEmail(input.db, email);

    if (!user) {
      // 2. Create user profile
      user = await usersRepository.createUserProfile(input.db, {
        email,
        displayName: name ?? email.split('@')[0],
        status: 'active',
      });
    }

    if (!user) {
      throw new UserNotFoundError();
    }

    // 3. Resolve tenant context for the new user
    const existingMemberships = await membershipsRepository.listMembershipsByUser(input.db, user.id);
    let tenantId: string;

    if (existingMemberships && existingMemberships.length > 0) {
      tenantId = existingMemberships[0].tenantId;
    } else {
      // 4. Create a new tenant
      const slugBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const tenantSlug = `${slugBase}-${uniqueSuffix}`;

      const tenant = await tenantsRepository.createTenant(input.db, {
        name: `Agência de ${name ?? email.split('@')[0]}`,
        slug: tenantSlug,
        status: 'active',
      });

      if (!tenant) {
        throw new Error('Falha ao auto-provisionar tenant');
      }

      tenantId = tenant.id;

      // 5. Create membership
      await membershipsRepository.createMembership(input.db, {
        tenantId,
        userId: user.id,
        role: 'tenant_owner',
        status: 'active',
      });
    }

    // 6. Create identity link
    await authIdentityRepository.createIdentityLink(input.db, {
      userId: user.id,
      provider,
      providerSubject,
      providerEmail: email,
    });

    // 7. Re-query identity
    identity = await authIdentityRepository.findUserByProviderSubject(
      input.db,
      provider,
      providerSubject,
    );

    if (!identity?.user) {
      throw new UserNotFoundError();
    }
  }

  if (identity.user.status === 'blocked' || identity.user.status === 'archived') {
    throw new UserBlockedError();
  }

  return {
    user: {
      id: identity.user.id,
      email: identity.user.email,
      status: identity.user.status,
      displayName: identity.user.displayName,
    },
    identityLink: {
      id: identity.id,
      provider: identity.provider,
      providerSubject: identity.providerSubject,
      providerEmail: identity.providerEmail,
    },
    provider,
    providerSubject,
    claims,
  };
}

export async function getCurrentUser(input: AuthContextInput): Promise<AuthUserContext | null> {
  try {
    return await requireUser(input);
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof UserNotFoundError) {
      return null;
    }

    throw error;
  }
}
