import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Globe, ExternalLink, Check, Sparkles, Layout, BarChart2, Settings, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchSiteData() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { tenant: null };

  const { data: tenantRow } = await supabase
    .from('user_tenants')
    .select('tenant_id, tenants(nome, slug, dominio_customizado, logo_url, cor_primaria)')
    .eq('user_id', user.id)
    .single();

  return { tenant: (tenantRow as any)?.tenants ?? null, tenant_id: tenantRow?.tenant_id };
}

const QUICK_ACTIONS = [
  { icon: Layout, label: 'Editar design', href: '/site/editor', color: '#232452', bg: 'rgba(35,36,82,0.08)' },
  { icon: Plus, label: 'Novo destino', href: '/site/destinos/novo', color: '#19b8a8', bg: 'rgba(25,184,168,0.10)' },
  { icon: BarChart2, label: 'Ver analytics', href: '/site/analytics', color: '#7a4ff0', bg: 'rgba(122,79,240,0.10)' },
  { icon: Settings, label: 'Configurar domínio', href: '/configuracoes', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
];

export default async function MeuSitePage() {
  const { tenant } = await fetchSiteData();

  const dominio = (tenant as any)?.dominio_customizado || (tenant ? `${(tenant as any).slug}.noro.guru` : 'sua-agencia.noro.guru');
  const nomeAgencia = (tenant as any)?.nome || 'Minha Agência';
  const isPublished = !!(tenant as any)?.slug;
  const corPrimaria = (tenant as any)?.cor_primaria || '#232452';

  return (
    <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: 0, color: '#1f2433' }}>
            Meu Site
          </h1>
          <div style={{ fontSize: 12.5, color: 'rgba(31,36,51,0.55)', marginTop: 3 }}>
            Gerencie o site público da sua agência — sem precisar de programação.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={`https://${dominio}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 13px', borderRadius: 8, border: '1px solid #dfe2ea',
              background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#1f2433',
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={13}/> Ver site
          </a>
          <Link
            href="/site/editor"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: '#232452', fontSize: 12.5, fontWeight: 700, color: '#fff',
              textDecoration: 'none',
            }}
          >
            <Layout size={13}/> Editar site
          </Link>
        </div>
      </div>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div style={{
        background: '#fff', border: '1px solid #eceef3', borderRadius: 12,
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: isPublished ? '#22a558' : '#f59e0b',
            boxShadow: isPublished ? '0 0 0 3px rgba(34,165,88,.15)' : '0 0 0 3px rgba(245,158,11,.15)',
            display: 'inline-block',
          }}/>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1f2433' }}>
            {isPublished ? 'Site publicado' : 'Não publicado ainda'}
          </span>
        </div>
        <div style={{ height: 16, width: 1, background: '#eceef3' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(31,36,51,0.55)', fontSize: 12 }}>
          <Globe size={13}/>
          <span style={{ fontFamily: 'monospace' }}>{dominio}</span>
          {isPublished && (
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: '#dcfce7', color: '#0e8a4f' }}>SSL OK</span>
          )}
        </div>
        {!isPublished && (
          <Link
            href="/configuracoes"
            style={{
              marginLeft: 'auto', padding: '6px 13px', borderRadius: 7,
              background: '#232452', color: '#fff',
              fontSize: 12, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            Configurar e publicar →
          </Link>
        )}
      </div>

      {/* ── Two columns: preview + quick actions ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Left: site preview mockup */}
        <div style={{
          background: '#fff', border: '1px solid #eceef3', borderRadius: 12,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* Browser bar */}
          <div style={{
            background: '#f6f7fb', padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            borderBottom: '1px solid #eceef3',
          }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#ef4444', display: 'inline-block' }}/>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#f59e0b', display: 'inline-block' }}/>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#22a558', display: 'inline-block' }}/>
            <div style={{
              flex: 1, marginLeft: 8, background: '#fff', padding: '4px 10px',
              borderRadius: 6, fontSize: 11, color: 'rgba(31,36,51,0.5)',
              fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid #eceef3',
            }}>
              🔒 {dominio}
            </div>
          </div>

          {/* Site nav mock */}
          <div style={{
            padding: '12px 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', borderBottom: '1px solid #eceef3',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7, background: corPrimaria,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13,
              }}>
                {nomeAgencia.charAt(0)}
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1f2433', letterSpacing: '-.01em' }}>{nomeAgencia}</span>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'rgba(31,36,51,0.55)' }}>
              <span>Destinos</span><span>Sobre</span><span>Blog</span><span>Contato</span>
            </div>
            <div style={{
              background: '#19b8a8', color: '#232452',
              fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999,
            }}>
              Solicitar orçamento
            </div>
          </div>

          {/* Hero mock */}
          <div style={{
            position: 'relative', padding: '32px 20px', minHeight: 220,
            background: `linear-gradient(135deg, ${corPrimaria} 0%, rgba(22,22,55,0.95) 100%)`,
            color: '#fff', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: -60, top: -60, width: 240, height: 240,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,184,168,0.2), transparent 65%)',
            }}/>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
              <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#19b8a8', fontWeight: 700, marginBottom: 8 }}>
                Viagens sob medida
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.015em', margin: '0 0 14px', lineHeight: 1.15 }}>
                O Brasil que cabe em você,<br/>do litoral à serra.
              </h2>
              <div style={{
                display: 'inline-block', background: '#19b8a8', color: corPrimaria,
                padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700,
              }}>
                Explorar destinos
              </div>
            </div>
          </div>

          {/* Destinos grid */}
          <div style={{ padding: '18px 20px', flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#1f2433' }}>Destinos em destaque</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { n: 'Fernando de Noronha', color: 'linear-gradient(135deg, #19b8a8, #0e6963)', p: 'R$ 4.2k' },
                { n: 'Bonito + Pantanal',   color: 'linear-gradient(135deg, #f59e0b, #b9501f)', p: 'R$ 2.8k' },
                { n: 'Gramado / Canela',    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', p: 'R$ 1.9k' },
              ].map((d) => (
                <div key={d.n} style={{ borderRadius: 9, overflow: 'hidden', border: '1px solid #eceef3' }}>
                  <div style={{ height: 80, background: d.color }}/>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2433' }}>{d.n}</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(31,36,51,0.5)', fontFamily: 'monospace', marginTop: 2 }}>a partir de {d.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Quick actions */}
          <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2433', marginBottom: 12 }}>Ações rápidas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 9,
                    border: '1px solid #eceef3', background: '#fff',
                    textDecoration: 'none', transition: 'background .12s',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: action.bg, color: action.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <action.icon size={16}/>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2433' }}>{action.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(31,36,51,0.35)', fontSize: 14 }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: '#fff', border: '1px solid #eceef3', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2433', marginBottom: 12 }}>Visitas este mês</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Visitantes únicos', value: '1.284', delta: '+23%' },
                { label: 'Visualizações', value: '4.712', delta: '+18%' },
                { label: 'Orçamentos solicitados', value: '38', delta: '+42%' },
              ].map((stat) => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12.5, color: 'rgba(31,36,51,0.6)' }}>{stat.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#1f2433' }}>{stat.value}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0e8a4f' }}>{stat.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade nudge */}
          <div style={{
            background: 'linear-gradient(135deg, #232452, #161637)',
            color: '#fff', borderRadius: 12, padding: '18px 18px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,184,168,0.2), transparent)' }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Sparkles size={14} style={{ color: '#19b8a8' }}/>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#19b8a8', letterSpacing: '.06em', textTransform: 'uppercase' }}>Domínio próprio</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                Use wanderlust.com.br no lugar de wanderlust.noro.guru
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
                Disponível no plano Pro. Conecte seu domínio em minutos.
              </div>
              {['SSL grátis', 'Redirect automático', 'Suporte técnico'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                  <Check size={12} style={{ color: '#19b8a8' }}/> {f}
                </div>
              ))}
              <Link
                href="/configuracoes"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginTop: 14, padding: '8px 16px', borderRadius: 8,
                  background: '#19b8a8', color: '#232452',
                  fontSize: 12.5, fontWeight: 700, textDecoration: 'none',
                }}
              >
                Fazer upgrade → Pro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
