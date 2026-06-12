import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { createDatabaseClient, proposalsRepository } from '@noro/db';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { notFound } from 'next/navigation';

const SESSION_COOKIE = 'portal_session_id';

export default async function PropostasPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let propostas: Awaited<ReturnType<typeof proposalsRepository.getProposalsByTenant>> = [];
  try {
    propostas = await proposalsRepository.getProposalsByTenant(db, tenant.tenantId, {
      clientId: session.clientId,
      limit: 50,
    });
  } finally {
    await close();
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Minhas propostas</h1>
      {propostas.length === 0 ? (
        <p style={{ color: '#64748b' }}>Nenhuma proposta disponível no momento.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {propostas.map((p) => (
            <a
              key={p.id}
              href={p.aceiteToken ? `/proposta/${p.aceiteToken}` : '#'}
              style={{
                display: 'block',
                padding: '16px 20px',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{p.titulo}</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    #{p.numero} · {p.destinoPrincipal ?? '—'}
                  </p>
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: p.status === 'aceita' ? '#dcfce7' : p.status === 'enviada' || p.status === 'visualizada' ? '#fef9c3' : '#f1f5f9',
                  color: p.status === 'aceita' ? '#16a34a' : p.status === 'enviada' || p.status === 'visualizada' ? '#854d0e' : '#64748b',
                }}>
                  {p.status}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
