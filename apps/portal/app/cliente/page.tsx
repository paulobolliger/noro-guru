import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { createDatabaseClient, proposalsRepository, paymentChargesRepository } from '@noro/db';

const SESSION_COOKIE = 'portal_session_id';

function formatBRL(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const STATUS_LABEL: Record<string, string> = {
  rascunho:  'Rascunho',
  enviada:   'Enviada',
  visualizada: 'Visualizada',
  aceita:    'Aceita',
  recusada:  'Recusada',
  expirada:  'Expirada',
  cancelada: 'Cancelada',
};

export default async function ClienteDashboardPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let nextTrip: Awaited<ReturnType<typeof proposalsRepository.getProposalsByTenant>>[number] | null = null;
  let lastProposal: Awaited<ReturnType<typeof proposalsRepository.getProposalsByTenant>>[number] | null = null;
  let pendingCharge: Awaited<ReturnType<typeof paymentChargesRepository.getChargesByClient>>[number] | null = null;

  try {
    const todayStr = new Date().toISOString().split('T')[0]!;

    // Próxima viagem — proposta aceita com data futura
    const accepted = await proposalsRepository.getProposalsByTenant(db, tenant.tenantId, {
      clientId: session.clientId,
      status: 'aceita',
      limit: 20,
    });
    nextTrip = accepted
      .filter((p) => p.dataViagemInicio != null && p.dataViagemInicio >= todayStr)
      .sort((a, b) => (a.dataViagemInicio ?? '').localeCompare(b.dataViagemInicio ?? ''))
      [0] ?? null;

    // Última proposta
    const proposals = await proposalsRepository.getProposalsByTenant(db, tenant.tenantId, {
      clientId: session.clientId,
      limit: 1,
    });
    lastProposal = proposals[0] ?? null;

    // Cobrança pendente
    const charges = await paymentChargesRepository.getChargesByClient(db, tenant.tenantId, session.clientId, { limit: 20 });
    pendingCharge = charges.find((c) => ['pending', 'overdue'].includes(c.status)) ?? null;
  } finally {
    await close();
  }

  const dias = nextTrip?.dataViagemInicio ? daysUntil(nextTrip.dataViagemInicio) : null;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
        Meu painel
      </h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
        Resumo da sua viagem e pendências
      </p>

      {/* Próxima viagem */}
      {nextTrip && dias !== null ? (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 20,
          padding: '32px 28px',
          color: '#fff',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: 8 }}>
            Próxima viagem
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>
            {nextTrip.destinoPrincipal ?? nextTrip.titulo}
          </h2>
          {nextTrip.dataViagemInicio && (
            <p style={{ color: '#cbd5e1', fontSize: 14 }}>
              {formatDate(nextTrip.dataViagemInicio)}
              {nextTrip.dataViagemFim ? ` → ${formatDate(nextTrip.dataViagemFim)}` : ''}
            </p>
          )}
          <div style={{
            marginTop: 24,
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '12px 20px',
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{dias}</span>
            <span style={{ fontSize: 16, color: '#94a3b8', marginLeft: 8 }}>
              {dias === 1 ? 'dia' : 'dias'}
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          border: '1px dashed #e2e8f0',
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: '1.75rem', marginBottom: 8 }}>✈️</p>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Nenhuma viagem programada</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Quando sua proposta for aceita, ela aparecerá aqui.</p>
        </div>
      )}

      {/* Cards de status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {/* Última proposta */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          padding: 20,
          background: '#fff',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 12 }}>
            Última proposta
          </p>
          {lastProposal ? (
            <>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{lastProposal.titulo}</p>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                {lastProposal.destinoPrincipal ?? '—'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: '#f1f5f9', color: '#475569' }}>
                  {STATUS_LABEL[lastProposal.status] ?? lastProposal.status}
                </span>
                {lastProposal.totalCents != null && lastProposal.totalCents > 0 && (
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>
                    {formatBRL(lastProposal.totalCents)}
                  </span>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Nenhuma proposta ainda</p>
          )}
          <a href="/cliente/propostas" style={{ display: 'block', marginTop: 16, fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
            Ver todas →
          </a>
        </div>

        {/* Cobrança pendente */}
        <div style={{
          border: `1px solid ${pendingCharge?.status === 'overdue' ? '#fca5a5' : '#e2e8f0'}`,
          borderRadius: 16,
          padding: 20,
          background: pendingCharge?.status === 'overdue' ? '#fff5f5' : '#fff',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 12 }}>
            Pagamento pendente
          </p>
          {pendingCharge ? (
            <>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>
                {pendingCharge.proposal?.titulo ?? 'Cobrança avulsa'}
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: pendingCharge.status === 'overdue' ? '#ef4444' : '#1e293b',
                marginBottom: 4,
              }}>
                {formatBRL(pendingCharge.amountCents)}
              </p>
              {pendingCharge.dueDate && (
                <p style={{ fontSize: 13, color: pendingCharge.status === 'overdue' ? '#ef4444' : '#64748b' }}>
                  {pendingCharge.status === 'overdue' ? 'Venceu em ' : 'Vence em '}
                  {formatDate(pendingCharge.dueDate)}
                </p>
              )}
            </>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Nenhum pagamento pendente</p>
          )}
          <a href="/cliente/pagamentos" style={{ display: 'block', marginTop: 16, fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
            Ver pagamentos →
          </a>
        </div>
      </div>

      {/* Atalhos */}
      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 12 }}>
        Acesso rápido
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Propostas', href: '/cliente/propostas', emoji: '📋' },
          { label: 'Pagamentos', href: '/cliente/pagamentos', emoji: '💳' },
          { label: 'Documentos', href: '/cliente/documentos', emoji: '📂' },
          { label: 'Itinerário', href: '/cliente/itinerario', emoji: '🗓️' },
          { label: 'Mensagens', href: '/cliente/mensagens', emoji: '💬' },
          { label: 'Emergência', href: '/cliente/emergencia', emoji: '🆘' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '20px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              textDecoration: 'none',
              color: 'inherit',
              background: '#fff',
            }}
          >
            <span style={{ fontSize: 28 }}>{item.emoji}</span>
            <p style={{ fontWeight: 600, marginTop: 10, fontSize: '0.95rem' }}>{item.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
