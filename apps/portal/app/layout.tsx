import type { Metadata } from 'next';
import { resolveTenantFromRequest } from '@/lib/tenant-context';

export const metadata: Metadata = {
  title: 'Portal',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = await resolveTenantFromRequest();

  const primaryColor = tenant?.portalTheme?.primaryColor ?? '#0f172a';
  const displayName = tenant?.portalTheme?.agencyDisplayName ?? tenant?.name ?? 'Portal';

  return (
    <html lang="pt-BR">
      <head>
        <style>{`:root { --color-primary: ${primaryColor}; }`}</style>
        {tenant?.portalTheme?.logoUrl && (
          <link rel="icon" href={tenant.portalTheme.faviconUrl ?? '/favicon.ico'} />
        )}
        <title>{displayName}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
