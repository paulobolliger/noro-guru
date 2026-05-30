import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { createDatabaseClient, paymentChargesRepository } from '@noro/db';
import { PixQrCode } from './PixQrCode';

const SESSION_COOKIE = 'portal_session_id';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Rascunho',
  pending: 'Aguardando pagamento',
  processing: 'Em análise',
  confirmed: 'Confirmado',
  received: 'Pago',
  overdue: 'Vencido',
  refunded: 'Estornado',
  canceled: 'Cancelado',
  failed: 'Falhou',
};

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  draft:      { bg: '#f1f5f9', color: '#64748b' },
  pending:    { bg: '#fef9c3', color: '#854d0e' },
  processing: { bg: '#ede9fe', color: '#6d28d9' },
  confirmed:  { bg: '#dcfce7', color: '#166534' },
  received:   { bg: '#dcfce7', color: '#166534' },
  overdue:    { bg: '#fee2e2', color: '#991b1b' },
  refunded:   { bg: '#f1f5f9', color: '#64748b' },
  canceled:   { bg: '#f1f5f9', color: '#64748b' },
  failed:     { bg: '#fee2e2', color: '#991b1b' },
};

const BILLING_LABEL: Record<string, string> = {
  PIX: 'Pix',
  BOLETO: 'Boleto bancário',
  CREDIT_CARD: 'Cartão de crédito',
};

function formatBRL(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
}

export default async function PagamentosPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let cobranças: Awaited<ReturnType<typeof paymentChargesRepository.getChargesByClient>> = [];
  try {
    cobranças = await paymentChargesRepository.getChargesByClient(db, tenant.tenantId, session.clientId);
  } finally {
    await close();
  }

  const isPending = (status: string) => ['pending', 'overdue', 'processing'].includes(status);
  const isPaid = (status: string) => ['confirmed', 'received'].includes(status);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Meus pagamentos</h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
        Cobranças emitidas pela agência para suas viagens
      </p>

      {cobranças.length === 0 ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          border: '1px dashed #e2e8f0',
          borderRadius: 16,
          color: '#94a3b8',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>💳</p>
          <p style={{ fontWeight: 600, color: '#64748b' }}>Nenhuma cobrança ainda</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Suas cobranças aparecerão aqui quando a agência emitir um pagamento.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cobranças.map((c) => {
            const statusStyle = STATUS_COLOR[c.status] ?? STATUS_COLOR.draft;
            const perParcela = c.installments && c.installments > 1
              ? Math.round(c.amountCents / c.installments)
              : null;

            return (
              <div
                key={c.id}
                style={{
                  border: `1px solid ${c.status === 'overdue' ? '#fca5a5' : '#e2e8f0'}`,
                  borderRadius: 16,
                  padding: 24,
                  background: '#fff',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem' }}>
                      {c.proposal?.titulo ?? 'Cobrança avulsa'}
                    </p>
                    {c.proposal?.destinoPrincipal && (
                      <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                        {c.proposal.destinoPrincipal}
                      </p>
                    )}
                  </div>
                  <span style={{
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </div>

                {/* Valor */}
                <div style={{ marginTop: 16, display: 'flex', gap: 24, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Valor total
                    </p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 2 }}>
                      {formatBRL(c.amountCents)}
                    </p>
                  </div>
                  {perParcela && (
                    <div>
                      <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Parcelamento
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: 600, marginTop: 2, color: '#475569' }}>
                        {c.installments}x de {formatBRL(perParcela)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Forma
                    </p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 2, color: '#475569' }}>
                      {BILLING_LABEL[c.billingType] ?? c.billingType}
                    </p>
                  </div>
                  {c.dueDate && (
                    <div>
                      <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Vencimento
                      </p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 2, color: c.status === 'overdue' ? '#ef4444' : '#475569' }}>
                        {formatDate(c.dueDate)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pago em */}
                {isPaid(c.status) && c.paidAt && (
                  <p style={{ marginTop: 12, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                    ✓ Pago em {new Date(c.paidAt).toLocaleDateString('pt-BR')}
                  </p>
                )}

                {/* Ações de pagamento — apenas para cobranças pendentes */}
                {isPending(c.status) && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                    {c.billingType === 'PIX' && c.pixCopyPaste && (
                      <PixQrCode pixCopyPaste={c.pixCopyPaste} />
                    )}

                    {c.billingType === 'BOLETO' && c.bankSlipUrl && (
                      <a
                        href={c.bankSlipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '12px 24px',
                          background: '#1e293b',
                          color: '#fff',
                          borderRadius: 10,
                          fontWeight: 700,
                          textDecoration: 'none',
                          fontSize: 15,
                        }}
                      >
                        Abrir boleto
                      </a>
                    )}

                    {c.billingType === 'CREDIT_CARD' && (c.checkoutUrl ?? c.invoiceUrl) && (
                      <a
                        href={(c.checkoutUrl ?? c.invoiceUrl)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '12px 24px',
                          background: '#1e293b',
                          color: '#fff',
                          borderRadius: 10,
                          fontWeight: 700,
                          textDecoration: 'none',
                          fontSize: 15,
                        }}
                      >
                        Pagar com cartão
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
