import { headers } from 'next/headers';
import { createDatabaseClient, tenantsRepository } from '@noro/db';

export type PortalTenantContext = {
  tenantId: string;
  name: string;
  portalSlug: string | null;
  portalDomain: string | null;
  portalTheme: {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    agencyDisplayName?: string;
  } | null;
};

/**
 * Resolve o tenant a partir dos headers injetados pelo middleware.
 * Deve ser chamado apenas em Server Components ou Server Actions.
 * Retorna null se o tenant não for encontrado.
 */
export async function resolveTenantFromRequest(): Promise<PortalTenantContext | null> {
  const headersList = await headers();
  const portalSlug = headersList.get('x-portal-slug') ?? '';
  const portalDomain = headersList.get('x-portal-domain') ?? '';

  if (!portalSlug && !portalDomain) return null;

  const { db, close } = createDatabaseClient();
  try {
    const tenant = portalSlug
      ? await tenantsRepository.getTenantByPortalSlug(db, portalSlug)
      : await tenantsRepository.getTenantByPortalDomain(db, portalDomain);

    if (!tenant || tenant.status !== 'active') return null;

    return {
      tenantId: tenant.id,
      name: tenant.name,
      portalSlug: tenant.portalSlug ?? null,
      portalDomain: tenant.portalDomain ?? null,
      portalTheme: tenant.portalTheme as PortalTenantContext['portalTheme'] ?? null,
    };
  } finally {
    await close();
  }
}
