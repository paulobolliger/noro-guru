import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Search, Filter, Calendar, Download, Plus, MoreHorizontal, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  CONFIRMADO:          { label: 'Confirmado',          color: '#1d4ed8', bg: '#dbeafe' },
  AGUARDANDO_PAGAMENTO:{ label: 'Ag. pagamento',       color: '#92400e', bg: '#fef3c7' },
  PAGO:                { label: 'Pago',                color: '#0e8a4f', bg: '#dcfce7' },
  CONCLUIDO:           { label: 'Concluído',           color: '#4b5563', bg: '#f3f4f6' },
  CANCELADO:           { label: 'Cancelado',           color: '#dc2626', bg: '#fee2e2' },
};

const STATUS_TABS = [
  { label: 'Todos',              key: null,                 color: '#1f2433' },
  { label: 'Confirmados',        key: 'CONFIRMADO',         color: '#1d4ed8' },
  { label: 'Ag. pagamento',      key: 'AGUARDANDO_PAGAMENTO', color: '#92400e' },
  { label: 'Pagos',              key: 'PAGO',               color: '#0e8a4f' },
  { label: 'Concluídos',         key: 'CONCLUIDO',          color: '#4b5563' },
  { label: 'Cancelados',         key: 'CANCELADO',          color: '#dc2626' },
];

async function fetchPedidos() {
  const supabase = createServerSupabaseClient();
  const { data, error, count } = await supabase
    .from('noro_pedidos')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return { pedidos: [], counts: {}, total: 0 };

  const pedidos = data ?? [];
  const counts: Record<string, number> = {};
  pedidos.forEach((p: any) => {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  });
  return { pedidos, counts, total: count ?? 0 };
}

export default async function PedidosPage() {
  const { pedidos, counts, total } = await fetchPedidos();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 28px', borderBottom: '1px solid #eceef3',
        background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ flex: '1 1 220px', maxWidth: 320, display: 'flex', alignItems: 'center', gap: 8, background: '#f6f7fb', borderRadius: 8, padding: '7px 11px', color: 'rgba(31,36,51,0.45)', fontSize: 12.5 }}>
          <Search size={14}/>
          <span>Buscar pedido, cliente ou destino</span>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
          <Filter size={13}/> Status
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
          <Calendar size={13}/> Período
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
            <Download size={13}/> Exportar
          </button>
          <Link href="/pedidos/novo" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#232452', fontSize: 12.5, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
            <Plus size={13}/> Novo pedido
          </Link>
        </div>
      </div>

      {/* ── Status filter chips ──────────────────────────────────── */}
      <div style={{ padding: '12px 28px', background: '#fff', borderBottom: '1px solid #eceef3', display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {STATUS_TABS.map((tab, i) => {
          const n = tab.key === null ? total : (counts[tab.key] ?? 0);
          const isActive = i === 0;
          return (
            <div key={tab.label} style={{
              padding: '5px 11px', borderRadius: 999,
              background: isActive ? '#232452' : '#f6f7fb',
              color: isActive ? '#fff' : '#1f2433',
              fontSize: 11.5, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              {tab.label}
              <span style={{
                fontFamily: 'monospace', fontSize: 10,
                background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.07)',
                padding: '1px 6px', borderRadius: 999,
              }}>{n}</span>
            </div>
          );
        })}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px', background: '#f6f7fb' }}>
        {pedidos.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
            <Package style={{ width: 44, height: 44, color: '#d1d5db', margin: '0 auto 12px' }}/>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1f2433', margin: 0 }}>Nenhum pedido ainda</p>
            <p style={{ fontSize: 13, color: 'rgba(31,36,51,0.5)', marginTop: 6 }}>
              Os pedidos criados aparecerão aqui.
            </p>
            <Link href="/pedidos/novo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '9px 18px', borderRadius: 9, background: '#232452', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <Plus size={14}/> Criar primeiro pedido
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f6f7fb', color: 'rgba(31,36,51,0.5)', textAlign: 'left', fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 18px', fontWeight: 600 }}>Número</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Destino</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Datas</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Valor</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 18px', fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p: any, i: number) => {
                  const st = STATUS_META[p.status] ?? { label: p.status, color: '#6b7280', bg: '#f3f4f6' };
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #eceef3', background: i % 2 === 0 ? '#fff' : 'rgba(246,247,251,0.5)' }}>
                      <td style={{ padding: '12px 18px' }}>
                        <Link href={`/pedidos/${p.id}`} style={{ fontFamily: 'monospace', fontSize: 11.5, fontWeight: 700, color: '#232452', textDecoration: 'none' }}>
                          #{p.numero_pedido || p.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 12px', fontWeight: 500, color: '#1f2433' }}>
                        <div>{p.cliente_nome || '—'}</div>
                        {p.pax && <div style={{ fontSize: 10.5, color: 'rgba(31,36,51,0.5)', marginTop: 1 }}>{p.pax} pax</div>}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        {p.destino ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1f2433' }}>
                            <MapPin size={12} color="rgba(31,36,51,0.45)"/>
                            {p.destino}
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(31,36,51,0.35)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 12px', fontFamily: 'monospace', fontSize: 11.5, color: 'rgba(31,36,51,0.55)' }}>
                        {p.data_inicio
                          ? `${format(new Date(p.data_inicio), 'dd/MM')}${p.data_fim ? ` – ${format(new Date(p.data_fim), 'dd/MM')}` : ''}`
                          : format(new Date(p.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td style={{ padding: '12px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#1f2433', textAlign: 'right' }}>
                        {p.valor_total ? formatCurrency(p.valor_total) : '—'}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <Link href={`/pedidos/${p.id}`} style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: '#f6f7fb', color: 'rgba(31,36,51,0.5)', textDecoration: 'none' }}>
                          <MoreHorizontal size={14}/>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(31,36,51,0.5)', borderTop: '1px solid #eceef3' }}>
              <span>Exibindo {pedidos.length} de {total} pedidos</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ padding: '5px 11px', borderRadius: 7, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>Anterior</button>
                <button style={{ padding: '5px 11px', borderRadius: 7, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>Próxima</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}