// apps/core/app/(protected)/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Users, UserCheck, DollarSign, TrendingUp, TrendingDown,
  Bell, ChevronRight, Columns2, Package, FileText,
  type LucideIcon,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusTone(status: string): { bg: string; fg: string; dot: string } {
  if (['PAGO', 'CONCLUIDO', 'pago'].includes(status))
    return { bg: '#dcf5e7', fg: '#166c3f', dot: '#22a558' };
  if (['AGUARDANDO_PAGAMENTO', 'confirmado'].includes(status))
    return { bg: '#fdf1cc', fg: '#7a4f0a', dot: '#e2a615' };
  if (['cancelado', 'CANCELADO'].includes(status))
    return { bg: '#fde2e2', fg: '#8c1f1f', dot: '#dc3a3a' };
  return { bg: '#f1f3f8', fg: '#475065', dot: '#94a3b8' };
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    confirmado: 'Confirmado',
    AGUARDANDO_PAGAMENTO: 'Aguardando Pgto',
    PAGO: 'Pago',
    CONCLUIDO: 'Concluído',
    cancelado: 'Cancelado',
  };
  return map[status] ?? status;
}

function greeting(nome: string | null) {
  const h = new Date().getHours();
  const saudacao = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  return `${saudacao}, ${nome?.split(' ')[0] ?? 'gestor'} 👋`;
}

// ─── data fetching ─────────────────────────────────────────────────────────────

async function fetchDashboard() {
  const supabase = createServerSupabaseClient();
  const now = new Date();
  const mesInicio = startOfMonth(now).toISOString();
  const mesFim    = endOfMonth(now).toISOString();

  const [
    leadsRes, clientesRes, receitaRes,
    pedidosPendentesRes, pedidosRecentesRes, orcamentosRes,
    userRes,
  ] = await Promise.all([
    supabase.from('noro_leads').select('*', { count: 'exact', head: true }),
    supabase.from('noro_clientes').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
    supabase.from('noro_cobrancas').select('valor').eq('status', 'PAGO').gte('created_at', mesInicio).lte('created_at', mesFim),
    supabase.from('noro_pedidos').select('*', { count: 'exact', head: true }).eq('status', 'AGUARDANDO_PAGAMENTO'),
    supabase.from('noro_pedidos').select('id, numero_pedido, titulo, valor_total, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('noro_orcamentos').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
    supabase.auth.getUser(),
  ]);

  const totalLeads     = leadsRes.count ?? 0;
  const clientesAtivos = clientesRes.count ?? 0;
  const receitaMes     = (receitaRes.data ?? []).reduce((s, c) => s + (c.valor ?? 0), 0);
  const taxaConversao  = totalLeads > 0 ? Math.round((clientesAtivos / totalLeads) * 100) : 0;

  // Get user profile for greeting
  let nomeUsuario: string | null = null;
  if (userRes.data.user) {
    const { data: prof } = await supabase
      .from('noro_users').select('nome').eq('id', userRes.data.user.id).single();
    nomeUsuario = prof?.nome ?? null;
  }

  return {
    totalLeads,
    clientesAtivos,
    receitaMes,
    taxaConversao,
    pedidosPendentes:   pedidosPendentesRes.count ?? 0,
    pedidosRecentes:    pedidosRecentesRes.data ?? [],
    orcamentosPendentes: orcamentosRes.count ?? 0,
    nomeUsuario,
  };
}

// ─── components ───────────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  iconBg,
  iconFg,
  label,
  value,
  delta,
  trend = 'up',
  href,
}: {
  icon: LucideIcon;
  iconBg: string; iconFg: string;
  label: string; value: string;
  delta?: string; trend?: 'up' | 'down';
  href?: string;
}) {
  const card = (
    <div
      className="flex flex-col gap-2 rounded-xl p-[18px] transition-shadow hover:shadow-md"
      style={{ background: '#fff', border: '1px solid #eceef3', boxShadow: '0 1px 2px rgba(15,20,40,.03)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: iconBg, color: iconFg }}>
          <Icon size={16} />
        </div>
        <ChevronRight size={14} style={{ color: 'rgba(31,36,51,0.35)' }} />
      </div>
      <div>
        <div className="font-semibold uppercase tracking-wide" style={{ fontSize: 11, color: 'rgba(31,36,51,0.55)', letterSpacing: '0.02em' }}>
          {label}
        </div>
        <div className="font-bold font-display leading-none mt-0.5" style={{ fontSize: 26, letterSpacing: '-0.02em', color: '#1f2433' }}>
          {value}
        </div>
      </div>
      {delta && (
        <div className="flex items-center gap-1.5" style={{ fontSize: 11 }}>
          <span
            className="inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded-full"
            style={{
              color: trend === 'up' ? '#0e8a4f' : '#b91c1c',
              background: trend === 'up' ? '#dcf5e7' : '#fde2e2',
            }}
          >
            {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {delta}
          </span>
          <span style={{ color: 'rgba(31,36,51,0.55)' }}>vs. mês anterior</span>
        </div>
      )}
    </div>
  );

  return href ? <Link href={href} className="block">{card}</Link> : card;
}

// ─── page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const {
    totalLeads, clientesAtivos, receitaMes, taxaConversao,
    pedidosPendentes, pedidosRecentes, orcamentosPendentes, nomeUsuario,
  } = await fetchDashboard();

  const hoje = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const totalPendentes = pedidosPendentes + orcamentosPendentes;

  return (
    <div className="flex flex-col gap-[18px]">

      {/* ── Greeting row ──────────────────────────────────────────────── */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-bold font-display m-0" style={{ fontSize: 22, letterSpacing: '-0.02em', color: '#1f2433' }}>
            {greeting(nomeUsuario)}
          </h1>
          <div style={{ fontSize: 12.5, color: 'rgba(31,36,51,0.55)', marginTop: 3 }}>
            Aqui está o panorama da sua agência hoje — <span className="capitalize">{hoje}</span>.
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 rounded-lg font-semibold transition-colors"
            style={{ fontSize: 13, padding: '7px 14px', background: '#f6f7fb', color: '#1f2433', border: '1px solid #eceef3' }}
          >
            <Package size={14} /> Novo pedido
          </Link>
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ fontSize: 13, padding: '7px 14px', background: '#232452' }}
          >
            <Columns2 size={14} /> Novo lead
          </Link>
        </div>
      </div>

      {/* ── Metric cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          icon={Users}
          iconBg="#e0eaff" iconFg="#1f3da8"
          label="Total de Leads"
          value={totalLeads.toLocaleString('pt-BR')}
          href="/leads"
        />
        <MetricCard
          icon={UserCheck}
          iconBg="#dcf5e7" iconFg="#0e8a4f"
          label="Clientes Ativos"
          value={clientesAtivos.toLocaleString('pt-BR')}
          href="/clientes"
        />
        <MetricCard
          icon={DollarSign}
          iconBg="#ece5fb" iconFg="#5a35bf"
          label="Receita do Mês"
          value={formatCurrency(receitaMes)}
          href="/financeiro"
        />
        <MetricCard
          icon={TrendingUp}
          iconBg="#ffe7d6" iconFg="#b9501f"
          label="Taxa de Conversão"
          value={`${taxaConversao}%`}
        />
      </div>

      {/* ── Alert banner — pending payments ───────────────────────────── */}
      {totalPendentes > 0 && (
        <Link href="/pedidos" className="block">
          <div
            className="flex items-center gap-3.5 rounded-[10px] cursor-pointer"
            style={{
              background: 'linear-gradient(90deg, #fef6d6, #fdf1cc)',
              border: '1px solid #f3d77d',
              padding: '12px 16px',
            }}
          >
            <div className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ width: 32, height: 32, background: '#fbe18a', color: '#7a4f0a' }}>
              <Bell size={15} />
            </div>
            <div className="flex-1">
              <div className="font-semibold" style={{ fontSize: 13, color: '#5a3a06' }}>
                {pedidosPendentes > 0
                  ? `${pedidosPendentes} ${pedidosPendentes === 1 ? 'pedido aguardando' : 'pedidos aguardando'} pagamento`
                  : `${orcamentosPendentes} ${orcamentosPendentes === 1 ? 'orçamento pendente' : 'orçamentos pendentes'} de aprovação`}
              </div>
              <div style={{ fontSize: 11.5, color: '#7a4f0a' }}>
                Acesse agora para verificar e emitir cobranças.
              </div>
            </div>
            <span className="font-semibold flex items-center gap-1" style={{ fontSize: 12, color: '#7a4f0a' }}>
              Ver agora <ChevronRight size={13} />
            </span>
          </div>
        </Link>
      )}

      {/* ── Orders table + shortcuts ───────────────────────────────────── */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 280px' }}>

        {/* Orders table */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #eceef3' }}>
          <div className="flex items-center justify-between" style={{ padding: '14px 18px', borderBottom: '1px solid #eceef3' }}>
            <div>
              <div className="font-bold" style={{ fontSize: 14, color: '#1f2433' }}>Pedidos recentes</div>
              <div style={{ fontSize: 11, color: 'rgba(31,36,51,0.55)', marginTop: 1 }}>
                Últimas movimentações da sua agência
              </div>
            </div>
            <Link
              href="/pedidos"
              className="font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ fontSize: 12, color: '#232452' }}
            >
              Ver todos <ChevronRight size={12} />
            </Link>
          </div>

          {pedidosRecentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14" style={{ color: 'rgba(31,36,51,0.4)' }}>
              <FileText size={36} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p style={{ fontSize: 13 }}>Nenhum pedido ainda</p>
              <Link href="/orcamentos" className="mt-2 font-semibold text-xs" style={{ color: '#232452' }}>
                Converter orçamento em pedido →
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f6f7fb', color: 'rgba(31,36,51,0.55)', textAlign: 'left' }}>
                  {['Título / Cliente', 'Número', 'Valor', 'Status', ''].map((h, i) => (
                    <th
                      key={i}
                      className="font-semibold uppercase"
                      style={{
                        padding: '9px ' + (i === 0 || i === 4 ? '18px' : '12px'),
                        fontSize: 10.5,
                        letterSpacing: '0.06em',
                        textAlign: i === 2 ? 'right' : 'left',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidosRecentes.map((p) => {
                  const tone = statusTone(p.status);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #eceef3' }}>
                      <td style={{ padding: '11px 18px' }}>
                        <div className="font-semibold" style={{ color: '#1f2433' }}>
                          {p.titulo ?? p.numero_pedido}
                        </div>
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        <span className="font-mono" style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.55)' }}>
                          {p.numero_pedido}
                        </span>
                      </td>
                      <td style={{ padding: '11px 12px', textAlign: 'right' }}>
                        <span className="font-mono font-semibold" style={{ color: '#1f2433' }}>
                          {formatCurrency(p.valor_total ?? 0)}
                        </span>
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        <span
                          className="inline-flex items-center gap-1 font-semibold rounded-full"
                          style={{ fontSize: 11, padding: '3px 9px', background: tone.bg, color: tone.fg }}
                        >
                          <span className="rounded-full" style={{ width: 5, height: 5, background: tone.dot, display: 'inline-block' }} />
                          {statusLabel(p.status)}
                        </span>
                      </td>
                      <td style={{ padding: '11px 18px' }}>
                        <Link href={`/pedidos/${p.id}`} style={{ color: 'rgba(31,36,51,0.35)' }}>
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick shortcuts */}
        <div className="flex flex-col gap-3.5">
          <div className="font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.08em', color: 'rgba(31,36,51,0.55)' }}>
            Atalhos rápidos
          </div>
          {[
            { icon: Columns2,   title: 'Novo lead',       sub: 'Adicionar contato ao funil',  href: '/leads',      bg: '#e0eaff', fg: '#1f3da8' },
            { icon: Package,    title: 'Criar pedido',    sub: 'Gerar orçamento ou contrato', href: '/pedidos',    bg: '#d6f5f1', fg: '#0e6963' },
            { icon: DollarSign, title: 'Emitir cobrança', sub: 'PIX, crédito ou débito',      href: '/financeiro', bg: '#ece5fb', fg: '#5a35bf' },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-3 rounded-[10px] cursor-pointer transition-shadow hover:shadow-sm"
              style={{ background: '#fff', border: '1px solid #eceef3', padding: '12px 14px' }}
            >
              <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 36, height: 36, background: s.bg, color: s.fg }}>
                <s.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="font-semibold" style={{ fontSize: 12.5, color: '#1f2433' }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(31,36,51,0.55)' }}>{s.sub}</div>
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(31,36,51,0.35)' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
