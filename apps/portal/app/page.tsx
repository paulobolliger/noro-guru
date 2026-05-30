import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Vitrine pública da agência — Sprint 7 adiciona conteúdo real
export default async function VitrinePublicaPage() {
  const tenant = await resolveTenantFromRequest();

  if (!tenant) notFound();

  const displayName = tenant.portalTheme?.agencyDisplayName ?? tenant.name;
  const logoUrl = tenant.portalTheme?.logoUrl;

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      {logoUrl && <img src={logoUrl} alt={displayName} style={{ maxHeight: 80, marginBottom: 32 }} />}
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{displayName}</h1>
      <p style={{ color: '#64748b', marginTop: 12 }}>
        Bem-vindo ao portal de viagens.
      </p>
      <Link
        href="/cliente"
        style={{
          display: 'inline-block',
          marginTop: 32,
          padding: '12px 28px',
          background: 'var(--color-primary, #0f172a)',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Acessar meu portal
      </Link>
    </main>
  );
}
