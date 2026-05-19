import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Sparkles, Eye, Edit, Plus, Filter, Wand2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

const THUMB_COLORS: Record<string, string> = {
  teal: 'linear-gradient(135deg, #19b8a8, #0e6963)',
  warm: 'linear-gradient(135deg, #f59e0b, #b9501f)',
  cool: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  purple: 'linear-gradient(135deg, #7a4ff0, #4338ca)',
};

function thumbColor(index: number) {
  const keys = Object.keys(THUMB_COLORS);
  return THUMB_COLORS[keys[index % keys.length]];
}

async function fetchRoteiros() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { roteiros: [], total: 0, aPublicar: 0, publicados: 0, tenant_id: null };

  const { data: tenantRow } = await supabase
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  const tenant_id = tenantRow?.tenant_id;
  if (!tenant_id) return { roteiros: [], total: 0, aPublicar: 0, publicados: 0, tenant_id: null };

  const { data: roteiros, count } = await supabase
    .from('noro_ai_roteiros')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenant_id)
    .order('created_at', { ascending: false })
    .limit(9);

  const aPublicar = (roteiros ?? []).filter((r: any) => r.status === 'draft').length;
  const publicados = (roteiros ?? []).filter((r: any) => r.status === 'published').length;

  return {
    roteiros: roteiros ?? [],
    total: count ?? 0,
    aPublicar,
    publicados,
    tenant_id,
  };
}

export default async function ConteudoPage() {
  const { roteiros, total, aPublicar, publicados, tenant_id } = await fetchRoteiros();

  const QUOTA_USED = Math.min(total, 5);
  const QUOTA_MAX = 5;
  const quotaPct = Math.round((QUOTA_USED / QUOTA_MAX) * 100);

  const STATUS_TABS = [
    { l: 'Todos', n: total, active: true },
    { l: 'A Publicar', n: aPublicar, tone: 'warn' },
    { l: 'Publicados', n: publicados, tone: 'success' },
    { l: 'Rascunhos', n: Math.max(0, total - aPublicar - publicados) },
  ];

  return (
    <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: 0, color: '#1f2433' }}>
            Conteúdo <span style={{ color: '#19b8a8' }}>IA</span>
          </h1>
          <div style={{ fontSize: 12.5, color: 'rgba(31,36,51,0.55)', marginTop: 3 }}>
            Roteiros e artigos gerados por IA para uso no seu site e propostas.
          </div>
        </div>
        <Link
          href="/conteudo/gerar"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 9, border: 'none',
            background: '#232452', color: '#fff',
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}
        >
          <Sparkles size={15} /> Gerar novo roteiro com IA
        </Link>
      </div>

      {/* ── Usage banner ──────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(25,184,168,0.10), rgba(35,36,82,0.07))',
        border: '1px solid rgba(25,184,168,0.35)',
        borderRadius: 12, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: 'rgba(25,184,168,0.18)', color: '#232452',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={17} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2433' }}>
            {QUOTA_USED} de {QUOTA_MAX} roteiros gratuitos utilizados este mês
          </div>
          <div style={{ height: 6, background: '#f6f7fb', borderRadius: 999, overflow: 'hidden', marginTop: 6, maxWidth: 320 }}>
            <div style={{ width: `${quotaPct}%`, height: '100%', background: 'linear-gradient(90deg, #19b8a8, #232452)', borderRadius: 999, transition: 'width .4s ease' }}/>
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.5)', marginTop: 4 }}>
            Faça upgrade para o plano Pro e gere roteiros ilimitados.
          </div>
        </div>
        <Link
          href="/configuracoes"
          style={{
            padding: '7px 13px', borderRadius: 8, border: '1px solid #dfe2ea',
            background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2433',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          Fazer upgrade →
        </Link>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_TABS.map((tab) => {
            const toneColor = tab.tone === 'warn'
              ? '#92400e' : tab.tone === 'success'
              ? '#0e8a4f' : 'rgba(31,36,51,0.5)';
            return (
              <div
                key={tab.l}
                style={{
                  padding: '6px 12px', borderRadius: 8,
                  background: tab.active ? '#fff' : 'transparent',
                  border: `1px solid ${tab.active ? '#dfe2ea' : 'transparent'}`,
                  fontSize: 12, fontWeight: 600,
                  color: tab.active ? '#1f2433' : toneColor,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer',
                }}
              >
                {tab.l}
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(31,36,51,0.45)' }}>{tab.n}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 7, border: '1px solid #dfe2ea', background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2433', cursor: 'pointer' }}>
            <Filter size={12}/> Categoria
          </button>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      {roteiros.length === 0 ? (
        /* Empty state */
        <div style={{
          background: 'linear-gradient(135deg, rgba(35,36,82,0.06), rgba(25,184,168,0.06))',
          border: '1.5px dashed rgba(35,36,82,0.25)',
          borderRadius: 14, padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', gap: 12,
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: '#232452', color: '#19b8a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wand2 size={26}/>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1f2433' }}>Nenhum roteiro ainda</div>
          <div style={{ fontSize: 13, color: 'rgba(31,36,51,0.55)', maxWidth: 320 }}>
            Gere seu primeiro roteiro com IA e ele aparecerá aqui para revisão antes de publicar.
          </div>
          <Link
            href="/conteudo/gerar"
            style={{
              marginTop: 8, padding: '10px 18px', borderRadius: 9,
              background: '#232452', color: '#fff',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 7,
            }}
          >
            <Sparkles size={15}/> Gerar primeiro roteiro
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {roteiros.map((r: any, i: number) => {
            const isDraft = r.status === 'draft';
            const statusLabel = isDraft ? 'A Publicar' : r.status === 'published' ? 'Publicado' : r.status;
            const statusColor = isDraft ? '#92400e' : '#0e8a4f';
            const statusBg = isDraft ? '#fef3c7' : '#dcfce7';

            return (
              <div
                key={r.id}
                style={{
                  background: '#fff', border: '1px solid #eceef3',
                  borderRadius: 12, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: 130, background: thumbColor(i), overflow: 'hidden' }}>
                  {/* Grid pattern overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 20px)',
                  }}/>
                  <div style={{
                    position: 'absolute', bottom: 12, left: 14,
                    color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '-.01em',
                    textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    maxWidth: 'calc(100% - 80px)',
                  }}>
                    {r.destino || r.titulo}
                  </div>
                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span style={{ padding: '3px 9px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: statusBg, color: statusColor }}>
                      {statusLabel}
                    </span>
                  </div>
                  {/* AI badge */}
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, color: '#232452', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={10}/> IA
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.012em', color: '#1f2433' }}>
                    {r.destino || r.titulo}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.55)' }}>
                    {r.tipo || 'Roteiro'}{r.dificuldade ? ` · ${r.dificuldade}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
                    {r.dificuldade && (
                      <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600, background: '#f6f7fb', color: 'rgba(31,36,51,0.6)' }}>
                        {r.dificuldade}
                      </span>
                    )}
                    {r.tipo && (
                      <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600, background: 'rgba(25,184,168,0.12)', color: '#0e6963' }}>
                        {r.tipo}
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #eceef3', gap: 8 }}>
                    <span style={{ fontSize: 10.5, color: 'rgba(31,36,51,0.45)', fontFamily: 'monospace' }}>
                      {r.created_at ? format(new Date(r.created_at), "dd/MM/yy HH:mm", { locale: ptBR }) : '—'}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link
                        href={`/conteudo/roteiros/${r.id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: '1px solid #dfe2ea', background: '#fff', fontSize: 11.5, fontWeight: 600, color: '#1f2433', textDecoration: 'none' }}
                      >
                        <Eye size={11}/> Ver
                      </Link>
                      <Link
                        href={`/conteudo/roteiros/${r.id}/editar`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: 'none', background: 'transparent', fontSize: 11.5, fontWeight: 600, color: 'rgba(31,36,51,0.55)', textDecoration: 'none' }}
                      >
                        <Edit size={11}/> Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New card */}
          <Link
            href="/conteudo/gerar"
            style={{
              background: 'linear-gradient(135deg, rgba(35,36,82,0.07), rgba(25,184,168,0.07))',
              border: '1.5px dashed rgba(35,36,82,0.28)',
              borderRadius: 12, padding: '20px 18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', gap: 8, minHeight: 240, textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 11, background: '#232452', color: '#19b8a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wand2 size={22}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2433' }}>Gerar com IA</div>
            <div style={{ fontSize: 12, color: 'rgba(31,36,51,0.5)', maxWidth: 200 }}>
              Escolha o destino e deixe a IA criar o roteiro completo
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
