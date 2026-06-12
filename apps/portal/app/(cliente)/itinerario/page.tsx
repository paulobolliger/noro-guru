import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { createDatabaseClient, proposalItineraryRepository } from '@noro/db';

const SESSION_COOKIE = 'portal_session_id';

const TIPO_ICON: Record<string, string> = {
  transporte: '✈️',
  hospedagem: '🏨',
  passeio: '🗺️',
  refeicao: '🍽️',
  livre: '☀️',
  outro: '📌',
};

const TIPO_COLOR: Record<string, string> = {
  transporte: '#3b82f6',
  hospedagem: '#8b5cf6',
  passeio: '#10b981',
  refeicao: '#f59e0b',
  livre: '#06b6d4',
  outro: '#94a3b8',
};

function formatDateLong(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default async function ItinerarioPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let items: Awaited<ReturnType<typeof proposalItineraryRepository.getItineraryByClient>> = [];

  try {
    items = await proposalItineraryRepository.getItineraryByClient(
      db,
      tenant.tenantId,
      session.clientId,
    );
  } finally {
    await close();
  }

  // Agrupa por proposta → por data
  type GroupedProposal = {
    id: string;
    titulo: string;
    destinoPrincipal: string | null;
    byDate: Map<string, typeof items>;
  };

  const byProposal = new Map<string, GroupedProposal>();
  for (const item of items) {
    if (!item.proposal) continue;
    const pid = item.proposal.id;
    if (!byProposal.has(pid)) {
      byProposal.set(pid, {
        id: pid,
        titulo: item.proposal.titulo,
        destinoPrincipal: item.proposal.destinoPrincipal,
        byDate: new Map(),
      });
    }
    const dateKey = item.data ?? 'sem-data';
    const group = byProposal.get(pid)!;
    if (!group.byDate.has(dateKey)) group.byDate.set(dateKey, []);
    group.byDate.get(dateKey)!.push(item);
  }

  const proposalList = Array.from(byProposal.values());

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Itinerário</h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
        Cronograma completo da sua viagem
      </p>

      {proposalList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🗓️</p>
          <p style={{ fontWeight: 600, color: '#64748b' }}>Nenhum itinerário disponível</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Seu agente ainda não adicionou o cronograma da viagem.
          </p>
        </div>
      ) : (
        proposalList.map((proposal) => (
          <div key={proposal.id} style={{ marginBottom: 40 }}>
            {proposalList.length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                  {proposal.destinoPrincipal ?? proposal.titulo}
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>{proposal.titulo}</p>
              </div>
            )}

            {Array.from(proposal.byDate.entries()).map(([dateKey, dayItems]) => (
              <div key={dateKey} style={{ marginBottom: 24 }}>
                {/* Cabeçalho do dia */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {dateKey !== 'sem-data' ? (
                      <span style={{ fontWeight: 800, fontSize: 13, color: '#475569' }}>
                        {new Date(dateKey + 'T12:00:00').getDate()}
                      </span>
                    ) : (
                      <span style={{ fontSize: 16 }}>📅</span>
                    )}
                  </div>
                  <p style={{ fontWeight: 700, color: '#334155', fontSize: 15 }}>
                    {dateKey === 'sem-data'
                      ? 'Sem data definida'
                      : formatDateLong(dateKey)}
                  </p>
                </div>

                {/* Itens do dia */}
                <div style={{ paddingLeft: 48 }}>
                  {dayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        position: 'relative',
                        paddingBottom: idx < dayItems.length - 1 ? 16 : 0,
                      }}
                    >
                      {/* Linha vertical conectando itens */}
                      {idx < dayItems.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: -25,
                          top: 24,
                          bottom: 0,
                          width: 2,
                          background: '#e2e8f0',
                        }} />
                      )}

                      {/* Ponto na linha */}
                      <div style={{
                        position: 'absolute',
                        left: -30,
                        top: 10,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: TIPO_COLOR[item.tipo] ?? '#94a3b8',
                        border: '2px solid white',
                        boxShadow: '0 0 0 2px #e2e8f0',
                      }} />

                      <div style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 14,
                        padding: '14px 16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                            {TIPO_ICON[item.tipo] ?? '📌'}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {item.horaInicio && (
                                <span style={{
                                  fontSize: 12,
                                  fontFamily: 'monospace',
                                  color: '#64748b',
                                  background: '#f8fafc',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                }}>
                                  {item.horaInicio}
                                  {item.horaFim ? ` → ${item.horaFim}` : ''}
                                </span>
                              )}
                              <p style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                                {item.titulo}
                              </p>
                            </div>
                            {item.local && (
                              <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                                📍 {item.local}
                              </p>
                            )}
                            {item.descricao && (
                              <p style={{ fontSize: 13, color: '#475569', marginTop: 6, lineHeight: 1.5 }}>
                                {item.descricao}
                              </p>
                            )}
                            {item.endereco && !item.local && (
                              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                                {item.endereco}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
