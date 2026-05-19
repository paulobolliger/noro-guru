import { DollarSign, TrendingUp, TrendingDown, Wallet, Clock, CheckCircle, AlertCircle, Plus, Filter, Download, Calendar } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

// ─── helpers ─────────────────────────────────────────────────────────────────

const PROVIDER_LABELS: Record<string, string> = {
  EREDE_CREDITO: 'e.Rede Crédito',
  EREDE_DEBITO: 'e.Rede Débito',
  EREDE_PIX: 'e.Rede PIX',
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PAGO:                { label: 'Pago',        color: '#0e8a4f', bg: '#dcfce7' },
  AGUARDANDO_PAGAMENTO:{ label: 'Aguardando',  color: '#92400e', bg: '#fef3c7' },
  PENDENTE:            { label: 'Pendente',    color: '#6b7280', bg: '#f3f4f6' },
  PROCESSANDO_API:     { label: 'Processando', color: '#1d4ed8', bg: '#dbeafe' },
  ERRO_API:            { label: 'Erro',        color: '#dc2626', bg: '#fee2e2' },
  EMITIDA:             { label: 'Emitida',     color: '#4338ca', bg: '#e0e7ff' },
};

// ─── data fetching ────────────────────────────────────────────────────────────

async function fetchFinanceiroData() {
  const supabase = createServerSupabaseClient();

  const now = new Date();
  const mesInicio = startOfMonth(now).toISOString();
  const mesFim = endOfMonth(now).toISOString();
  const mesAnteriorInicio = startOfMonth(subMonths(now, 1)).toISOString();
  const mesAnteriorFim = endOfMonth(subMonths(now, 1)).toISOString();

  const [
    receitaMesResult,
    receitaMesAnteriorResult,
    cobrancasPendentesResult,
    cobrancasRecentesResult,
    pedidosPagosResult,
  ] = await Promise.all([
    // Receita mês atual
    supabase
      .from('noro_cobrancas')
      .select('valor')
      .eq('status', 'PAGO')
      .gte('created_at', mesInicio)
      .lte('created_at', mesFim),

    // Receita mês anterior (para comparação)
    supabase
      .from('noro_cobrancas')
      .select('valor')
      .eq('status', 'PAGO')
      .gte('created_at', mesAnteriorInicio)
      .lte('created_at', mesAnteriorFim),

    // Cobranças pendentes (AGUARDANDO_PAGAMENTO + EMITIDA)
    supabase
      .from('noro_cobrancas')
      .select('valor')
      .in('status', ['AGUARDANDO_PAGAMENTO', 'EMITIDA', 'PENDENTE']),

    // Últimas 15 cobranças
    supabase
      .from('noro_cobrancas')
      .select(`
        id,
        valor,
        provider,
        status,
        data_vencimento,
        created_at,
        pedido_id,
        noro_pedidos (numero_pedido, titulo)
      `)
      .order('created_at', { ascending: false })
      .limit(15),

    // Pedidos pagos no mês
    supabase
      .from('noro_pedidos')
      .select('*', { count: 'exact', head: true })
      .in('status', ['PAGO', 'CONCLUIDO'])
      .gte('created_at', mesInicio),
  ]);

  const receitaMes = (receitaMesResult.data ?? []).reduce((s, c) => s + (c.valor ?? 0), 0);
  const receitaMesAnterior = (receitaMesAnteriorResult.data ?? []).reduce((s, c) => s + (c.valor ?? 0), 0);
  const totalPendente = (cobrancasPendentesResult.data ?? []).reduce((s, c) => s + (c.valor ?? 0), 0);
  const variacaoPercent =
    receitaMesAnterior > 0
      ? Math.round(((receitaMes - receitaMesAnterior) / receitaMesAnterior) * 100)
      : null;

  return {
    receitaMes,
    receitaMesAnterior,
    variacaoPercent,
    totalPendente,
    pedidosPagosCount: pedidosPagosResult.count ?? 0,
    cobrancasRecentes: cobrancasRecentesResult.data ?? [],
  };
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function FinanceiroPage() {
  const {
    receitaMes,
    receitaMesAnterior,
    variacaoPercent,
    totalPendente,
    pedidosPagosCount,
    cobrancasRecentes,
  } = await fetchFinanceiroData();

  const mesAtual = format(new Date(), "MMMM yyyy", { locale: ptBR });
  const mesAnteriorLabel = format(subMonths(new Date(), 1), "MMMM", { locale: ptBR });
  const saldoEstimado = receitaMes * 0.9871; // after e.Rede fees

  // Bar chart data (last 12 months placeholder with real current month)
  const CHART_MONTHS = ['Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr','Mai'];
  const chartBars = [42, 56, 38, 64, 72, 58, 88, 74, 92, 81, 102, receitaMes / 1000 || 14];
  const chartMax = Math.max(...chartBars);

  // Payment method breakdown from cobrancas
  const byProvider: Record<string, number> = {};
  cobrancasRecentes.forEach((c: any) => {
    const k = c.provider ?? 'OUTRO';
    byProvider[k] = (byProvider[k] ?? 0) + (c.valor ?? 0);
  });
  const totalByProvider = Object.values(byProvider).reduce((a, b) => a + b, 0) || 1;
  const paymentMethods = [
    { m: 'e.Rede PIX',     val: byProvider['EREDE_PIX'] ?? 0,     color: '#232452' },
    { m: 'e.Rede Crédito', val: byProvider['EREDE_CREDITO'] ?? 0, color: '#19b8a8' },
    { m: 'e.Rede Débito',  val: byProvider['EREDE_DEBITO'] ?? 0,  color: '#7a4ff0' },
    { m: 'Outros',         val: byProvider['OUTRO'] ?? 0,          color: '#94a3b8' },
  ].filter((p) => p.val > 0);

  return (
    <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: 0, color: '#1f2433' }}>
            Financeiro
          </h1>
          <div style={{ fontSize: 12.5, color: 'rgba(31,36,51,0.55)', marginTop: 3, textTransform: 'capitalize' }}>
            {mesAtual} · resumo de cobranças, recebíveis e fluxo de caixa
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
            <Calendar size={13} /> <span style={{ textTransform: 'capitalize' }}>{mesAtual}</span>
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
            <Download size={13} /> Exportar CSV
          </button>
          <Link href="/pedidos/novo" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, border: 'none', background: '#232452', fontSize: 12.5, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
            <Plus size={13} /> Nova cobrança
          </Link>
        </div>
      </div>

      {/* ── BigStat cards ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {/* Receita */}
        <div style={{ background: 'linear-gradient(135deg, #232452, #161637)', color: '#fff', borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,184,168,0.25), transparent 70%)' }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Receita do mês</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>{formatCurrency(receitaMes)}</span>
            {variacaoPercent !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 700, color: '#19b8a8' }}>
                {variacaoPercent >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                {variacaoPercent >= 0 ? '+' : ''}{variacaoPercent}%
              </span>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
            vs. {formatCurrency(receitaMesAnterior)} em {mesAnteriorLabel} · {pedidosPagosCount} pedidos pagos
          </div>
        </div>

        {/* A receber */}
        <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(31,36,51,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>A receber</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: '#1f2433' }}>{formatCurrency(totalPendente)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.5)', marginTop: 4 }}>
            Cobranças pendentes e aguardando pagamento
          </div>
        </div>

        {/* Saldo */}
        <div style={{ background: `color-mix(in oklab, #19b8a8 12%, #fff)`, border: '1px solid #eceef3', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(31,36,51,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Saldo estimado</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: '#1f2433' }}>{formatCurrency(saldoEstimado)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.5)', marginTop: 4 }}>
            Após repasses e taxas e.Rede (≈ 1,29%)
          </div>
        </div>
      </div>

      {/* ── Chart + Payment methods ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        {/* Bar chart */}
        <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1f2433' }}>Receita por mês</div>
              <div style={{ fontSize: 11, color: 'rgba(31,36,51,0.5)' }}>últimos 12 meses · em mil R$</div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(31,36,51,0.5)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: '#232452', display: 'inline-block' }}/> Receita
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 140 }}>
            {chartBars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                  <div style={{
                    width: '100%',
                    height: `${(b / chartMax) * 100}%`,
                    background: i === chartBars.length - 1
                      ? 'linear-gradient(180deg, #232452, #19b8a8)'
                      : 'rgba(35,36,82,0.18)',
                    borderRadius: '4px 4px 2px 2px',
                    minHeight: 4,
                    transition: 'height .3s ease',
                  }}/>
                  {i === chartBars.length - 1 && b > 0 && (
                    <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontFamily: 'monospace', fontSize: 9.5, fontWeight: 700, color: '#232452', whiteSpace: 'nowrap' }}>
                      {b.toFixed(0)}k
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 9.5, color: 'rgba(31,36,51,0.45)', fontFamily: 'monospace' }}>
                  {CHART_MONTHS[i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1f2433', marginBottom: 14 }}>Por método de pagamento</div>
          {paymentMethods.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'rgba(31,36,51,0.4)', fontSize: 12.5 }}>
              Nenhum dado ainda
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {paymentMethods.map((p) => (
                <div key={p.m}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1f2433' }}>{p.m}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#1f2433' }}>{formatCurrency(p.val)}</span>
                  </div>
                  <div style={{ height: 7, background: '#f6f7fb', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round((p.val / totalByProvider) * 100)}%`, height: '100%', background: p.color, borderRadius: 999 }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* e.Rede fees notice */}
          <div style={{ marginTop: 18, padding: '10px 12px', borderRadius: 8, background: '#f6f7fb', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: '#fff', border: '1px solid #eceef3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#232452' }}>
              <Wallet size={15}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#1f2433' }}>Taxas e.Rede acumuladas</div>
              <div style={{ fontSize: 10.5, color: 'rgba(31,36,51,0.5)', fontFamily: 'monospace' }}>
                {formatCurrency(receitaMes * 0.0129)} · 1,29% do volume
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cobranças recentes ────────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eceef3' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1f2433' }}>Cobranças recentes</div>
            <div style={{ fontSize: 11, color: 'rgba(31,36,51,0.5)' }}>
              {cobrancasRecentes.length} cobranças exibidas
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 7, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
              <Filter size={12}/> Filtrar
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 7, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
              <Download size={12}/> Exportar
            </button>
          </div>
        </div>

        {cobrancasRecentes.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <DollarSign style={{ width: 44, height: 44, color: '#d1d5db', margin: '0 auto 12px' }}/>
            <p style={{ color: 'rgba(31,36,51,0.5)', fontSize: 14, fontWeight: 500, margin: 0 }}>Nenhuma cobrança registrada</p>
            <p style={{ fontSize: 12.5, color: 'rgba(31,36,51,0.4)', marginTop: 6 }}>
              Emita cobranças a partir da página de{' '}
              <Link href="/pedidos" style={{ color: '#232452', fontWeight: 600 }}>Pedidos</Link>
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f6f7fb', color: 'rgba(31,36,51,0.5)', textAlign: 'left', fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  <th style={{ padding: '9px 18px', fontWeight: 600 }}>Pedido</th>
                  <th style={{ padding: '9px 12px', fontWeight: 600 }}>Provedor</th>
                  <th style={{ padding: '9px 12px', fontWeight: 600, textAlign: 'right' }}>Valor</th>
                  <th style={{ padding: '9px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '9px 12px', fontWeight: 600 }}>Vencimento</th>
                  <th style={{ padding: '9px 18px', fontWeight: 600 }}>Emissão</th>
                </tr>
              </thead>
              <tbody>
                {cobrancasRecentes.map((c: any, i: number) => {
                  const st = STATUS_META[c.status] ?? { label: c.status, color: '#6b7280', bg: '#f3f4f6' };
                  const pedido = c.noro_pedidos;
                  const providerLabel = PROVIDER_LABELS[c.provider] ?? c.provider ?? '—';
                  const isPix = c.provider === 'EREDE_PIX';
                  const isCredito = c.provider === 'EREDE_CREDITO';
                  return (
                    <tr key={c.id} style={{ borderTop: '1px solid #eceef3', background: i % 2 === 0 ? '#fff' : 'rgba(246,247,251,0.5)' }}>
                      <td style={{ padding: '11px 18px' }}>
                        {pedido ? (
                          <Link href={`/pedidos/${c.pedido_id}`} style={{ fontFamily: 'monospace', fontSize: 11.5, fontWeight: 600, color: '#232452', textDecoration: 'none' }}>
                            #{pedido.numero_pedido}
                          </Link>
                        ) : (
                          <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'rgba(31,36,51,0.35)' }}>—</span>
                        )}
                        {pedido?.titulo && (
                          <div style={{ fontSize: 11, color: 'rgba(31,36,51,0.5)', marginTop: 1, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pedido.titulo}</div>
                        )}
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: 2, background: isPix ? '#22a558' : isCredito ? '#232452' : '#19b8a8', display: 'inline-block' }}/>
                          {providerLabel}
                        </div>
                      </td>
                      <td style={{ padding: '11px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#1f2433' }}>
                        {formatCurrency(c.valor ?? 0)}
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
                          {c.status === 'PAGO' && <CheckCircle size={11}/>}
                          {c.status === 'ERRO_API' && <AlertCircle size={11}/>}
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '11px 12px', fontFamily: 'monospace', fontSize: 11.5, color: 'rgba(31,36,51,0.5)' }}>
                        {c.data_vencimento ? format(new Date(c.data_vencimento), 'dd/MM') : '—'}
                      </td>
                      <td style={{ padding: '11px 18px', fontFamily: 'monospace', fontSize: 11.5, color: 'rgba(31,36,51,0.5)' }}>
                        {format(new Date(c.created_at), 'dd/MM/yyyy')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
