import { authIdentityRepository } from '@noro/db';
import {
  UnauthenticatedError,
  UserBlockedError,
  UserNotFoundError,
} from '../errors';
import type { AuthClaims, AuthContextInput, AuthUserContext } from '../types';

async function resolveClaims(input: AuthContextInput): Promise<AuthClaims | null> {
  if (input.claims) {
    return input.claims;
  }

  if (input.sessionAdapter) {
    return input.sessionAdapter();
  }

  // TODO Sprint futura: ligar este adapter ao SDK/runtime Logto escolhido para Next.js.
  return null;
}

export async function requireUser(input: AuthContextInput): Promise<AuthUserContext> {
  const claims = await resolveClaims(input);
  const provider = claims?.provider ?? 'logto';
  const providerSubject = claims?.subject;

  if (!providerSubject) {
    throw new UnauthenticatedError();
  }

  const identity = await authIdentityRepository.findUserByProviderSubject(
    input.db,
    provider,
    providerSubject,
  );

  if (!identity?.user) {
    throw new UserNotFoundError();
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
