import React from 'react';

const MODULES = [
  {
    icon: '👥',
    title: 'CRM & Vendas',
    copy: 'Funil de leads, pedidos, propostas e cobranças num só lugar. Esqueça a planilha.',
    featured: false,
  },
  {
    icon: '🌐',
    title: 'Meu Site',
    copy: 'Construa, publique e gerencie o site da agência sem código. Domínio próprio incluso.',
    featured: true,
  },
  {
    icon: '💰',
    title: 'Financeiro',
    copy: 'Recebíveis, fluxo de caixa, comissões e fechamento — tudo conciliado automaticamente.',
    featured: false,
  },
  {
    icon: '✨',
    title: 'Conteúdo IA',
    copy: 'Roteiros, descrições e artigos prontos em segundos. Estilo da sua agência, sempre.',
    featured: false,
  },
  {
    icon: '💬',
    title: 'Comunicação',
    copy: 'WhatsApp, email e Instagram numa caixa só. Histórico do cliente em cada conversa.',
    featured: false,
  },
  {
    icon: '📣',
    title: 'Marketing',
    copy: 'Campanhas, social media e relatórios de performance — sem terceirizar para 3 ferramentas.',
    featured: false,
  },
];

const Features: React.FC = () => {
  return (
    <section style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 56px' }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 24, marginBottom: 48, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#232452', marginBottom: 14,
          }}>
            Tudo em um portal
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display, Georgia)', fontWeight: 500,
            fontSize: 'clamp(36px, 4.5vw, 52px)', lineHeight: 1.06, letterSpacing: '-0.022em',
            margin: 0, color: '#1f2433', maxWidth: 640,
          }}>
            6 módulos que substituem<br/>10 ferramentas avulsas.
          </h2>
        </div>
        <a
          href="/funcionalidades"
          style={{
            fontSize: 14, fontWeight: 600, color: '#232452',
            display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          }}
        >
          Ver todos os recursos →
        </a>
      </div>

      {/* Module cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 18,
      }}>
        {MODULES.map((m) => (
          <div
            key={m.title}
            style={{
              background: m.featured ? '#232452' : '#fff',
              color: m.featured ? '#fff' : '#1f2433',
              border: m.featured ? 'none' : '1px solid #eceef3',
              borderRadius: 18,
              padding: '32px 30px',
              display: 'flex', flexDirection: 'column', gap: 14,
              position: 'relative',
              minHeight: 240,
            }}
          >
            {m.featured && (
              <div style={{
                position: 'absolute', top: 24, right: 24,
                fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                background: '#19b8a8', color: '#232452',
                padding: '3px 8px', borderRadius: 999, letterSpacing: '.08em',
              }}>
                DIFERENCIAL
              </div>
            )}
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: m.featured ? 'rgba(255,255,255,0.10)' : 'rgba(35,36,82,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              {m.icon}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display, Georgia)', fontWeight: 500,
              fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.1,
              margin: 0,
            }}>
              {m.title}
            </h3>
            <p style={{
              fontSize: 14, lineHeight: 1.55, margin: 0,
              color: m.featured ? 'rgba(255,255,255,0.75)' : 'rgba(31,36,51,0.65)',
              maxWidth: 320,
            }}>
              {m.copy}
            </p>
            <div style={{ flex: 1 }}/>
            <a
              href="#"
              style={{
                fontSize: 13, fontWeight: 600,
                color: m.featured ? '#19b8a8' : '#232452',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                textDecoration: 'none',
              }}
            >
              Saiba mais →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
