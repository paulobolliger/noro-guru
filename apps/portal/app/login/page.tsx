import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { notFound } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const displayName = tenant.portalTheme?.agencyDisplayName ?? tenant.name;

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 400, margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{displayName}</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>
        Digite seu e-mail para receber o link de acesso ao portal.
      </p>
      <LoginForm tenantId={tenant.tenantId} agencyDisplayName={displayName} />
    </main>
  );
}
