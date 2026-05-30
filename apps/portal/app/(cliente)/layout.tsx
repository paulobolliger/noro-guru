import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { notFound } from 'next/navigation';

const SESSION_COOKIE = 'portal_session_id';

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    redirect('/login');
  }

  const session = await getSessionFromCookie(sessionId);

  if (!session || session.tenantId !== tenant.tenantId) {
    redirect('/login?error=session_expired');
  }

  return (
    <div>
      {/* Navigation — UI completa na Sprint 7 */}
      <nav style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 700 }}>
          {tenant.portalTheme?.agencyDisplayName ?? tenant.name}
        </span>
        <a href="/auth/signout" style={{ color: '#64748b', fontSize: 14 }}>Sair</a>
      </nav>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  );
}
