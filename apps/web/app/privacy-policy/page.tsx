import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Noro Guru',
  description: 'Como a Noro Guru coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
};

const TOC = [
  { id: 'intro', label: 'Introdução' },
  { id: 'dados', label: 'Dados que coletamos' },
  { id: 'uso', label: 'Como usamos seus dados' },
  { id: 'compartilhamento', label: 'Compartilhamento de dados' },
  { id: 'direitos', label: 'Seus direitos (LGPD)' },
  { id: 'cookies', label: 'Cookies e rastreamento' },
  { id: 'seguranca', label: 'Segurança dos dados' },
  { id: 'alteracoes', label: 'Alterações nesta política' },
  { id: 'contato', label: 'Contato e DPO' },
];

const LGPD_RIGHTS = [
  'Confirmação de tratamento',
  'Acesso imediato aos dados',
  'Correção de dados incompletos',
  'Anonimização ou bloqueio',
  'Portabilidade das informações',
  'Eliminação de dados tratados',
  'Informação sobre compartilhamento',
  'Revogação do consentimento',
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', fontFamily: 'var(--font-sans)', color: '#D1D5F0' }}>
      {/* Hero */}
      <header style={{ background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingTop: 80, paddingBottom: 56, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 28, fontWeight: 500 }}>
            ← Políticas
          </Link>
          <div>
            <span style={{ display: 'inline-block', background: '#7C3AED', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 999, marginBottom: 20, letterSpacing: '0.06em' }}>
              Política de Privacidade
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,36px)', fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Como protegemos seus dados
            </h1>
            <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, fontWeight: 500 }}>
              Última atualização: maio de 2026 · Vigência: LGPD / Lei 13.709/2018
            </p>
          </div>
        </div>
      </header>

      {/* Body — 2-column: sidebar 260px + content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px 80px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48, alignItems: 'start' }}>
        {/* Sidebar TOC */}
        <aside style={{ position: 'sticky', top: 28, background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, opacity: 0.7 }}>
            Nesta página
          </h3>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {TOC.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#1DD3C0', textDecoration: 'none', padding: '9px 0', borderBottom: i < TOC.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', lineHeight: 1.4, fontWeight: 400 }}
              >
                <span style={{ opacity: 0.45, fontSize: 11, flexShrink: 0, marginTop: 1, fontFamily: 'var(--font-mono)' }}>{String(i + 1).padStart(2, '0')}.</span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* 1. Introdução */}
          <section id="intro">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 14 }}>1. Introdução</h2>
            <div style={{ fontSize: 14, color: '#D1D5F0', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0 }}>A privacidade dos seus dados é um pilar fundamental da operação do Noro Guru. Elaboramos esta política para ser transparente sobre como coletamos, armazenamos, processamos e protegemos as informações que você confia à nossa plataforma.</p>
              <p style={{ margin: 0 }}>Ao utilizar nossos serviços, você concorda com as práticas descritas neste documento, que foi estruturado em total conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
            </div>
          </section>

          {/* 2. Dados que coletamos */}
          <section id="dados">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 14 }}>2. Dados que coletamos</h2>
            <div style={{ fontSize: 14, color: '#D1D5F0', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0 }}>Para fornecer uma experiência personalizada e garantir a segurança das suas operações, coletamos diferentes categorias de informações:</p>
              <ul style={{ listStyle: 'disc', paddingLeft: 20, margin: 0, color: '#B8C1E0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><strong style={{ color: '#fff', fontWeight: 500 }}>Dados de Cadastro:</strong> Nome, e-mail corporativo, cargo e informações de faturamento.</li>
                <li><strong style={{ color: '#fff', fontWeight: 500 }}>Dados de Uso:</strong> Logs de acesso, interações com a interface, tempo de permanência em dashboards específicos.</li>
                <li><strong style={{ color: '#fff', fontWeight: 500 }}>Dados de Integração:</strong> Metadados técnicos gerados quando você conecta o Noro Guru às suas fontes de dados internas.</li>
              </ul>
            </div>
          </section>

          {/* 3. Como usamos */}
          <section id="uso">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 14 }}>3. Como usamos seus dados</h2>
            <div style={{ fontSize: 14, color: '#D1D5F0', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0 }}>A finalidade principal do tratamento dos seus dados é a prestação dos serviços contratados. Utilizamos suas informações estritamente para:</p>
              <ul style={{ listStyle: 'disc', paddingLeft: 20, margin: 0, color: '#B8C1E0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Autenticar seu acesso e garantir a segurança do seu workspace.</li>
                <li>Processar pagamentos e gerenciar assinaturas.</li>
                <li>Melhorar a experiência da plataforma (utilizando dados anonimizados).</li>
                <li>Enviar alertas críticos de sistema e notificações sobre atualizações.</li>
              </ul>
            </div>
          </section>

          {/* 4. Compartilhamento */}
          <section id="compartilhamento">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 14 }}>4. Compartilhamento de dados</h2>
            <p style={{ fontSize: 14, color: '#D1D5F0', lineHeight: 1.75, margin: 0 }}>Compartilhamos dados apenas com parceiros de infraestrutura necessários para operar a plataforma (processadores de pagamento, CDN, provedores de e-mail transacional) ou quando exigido por lei. Não vendemos seus dados. Todos os parceiros assinam Acordos de Processamento de Dados (DPA) compatíveis com a LGPD.</p>
          </section>

          {/* 5. Direitos LGPD — grid 2 colunas igual ao Stitch */}
          <section id="direitos">
            <div style={{ background: 'rgba(52,44,164,0.1)', border: '1px solid rgba(52,44,164,0.25)', borderRadius: 12, padding: 28, position: 'relative', overflow: 'hidden' }}>
              {/* Glow */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'rgba(52,44,164,0.1)', borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#1DD3C0', fontSize: 22 }}>🛡️</span>
                Seus direitos (LGPD)
              </h3>
              <p style={{ fontSize: 13, color: '#B8C1E0', margin: '0 0 20px' }}>Como titular dos dados, você tem o direito garantido por lei de requisitar a qualquer momento:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px' }}>
                {LGPD_RIGHTS.map((right) => (
                  <div key={right} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: '#1DD3C0', fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>✓</span>
                    <span style={{ fontSize: 13, color: '#D1D5F0', lineHeight: 1.45 }}>{right}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(52,44,164,0.2)' }}>
                <p style={{ fontSize: 12, color: '#B8C1E0', margin: 0 }}>
                  Para exercer seus direitos, envie um e-mail para{' '}
                  <a href="mailto:privacidade@noro.guru" style={{ color: '#fff', textDecoration: 'none' }}>privacidade@noro.guru</a>.
                </p>
              </div>
            </div>
          </section>

          {/* 6-9 restantes */}
          {[
            { id: 'cookies', n: 6, title: 'Cookies e rastreamento', text: 'Usamos cookies essenciais (necessários para funcionamento), cookies analíticos (para entender como você usa a plataforma, via dados agregados e anonimizados) e cookies de preferências. Você pode gerenciar cada categoria pelo banner de consentimento ou pela nossa Política de Cookies.' },
            { id: 'seguranca', n: 7, title: 'Segurança dos dados', text: 'Todos os dados são armazenados em servidores no Brasil, com criptografia AES-256 em repouso e TLS 1.3 em trânsito. Realizamos auditorias de segurança semestrais e testes de penetração anuais. Em caso de incidente, notificaremos a ANPD e os afetados em até 72 horas.' },
            { id: 'alteracoes', n: 8, title: 'Alterações nesta política', text: 'Quando houver alterações materiais, notificaremos por e-mail e dentro da plataforma com pelo menos 30 dias de antecedência. Alterações menores podem ser publicadas sem aviso prévio. O uso continuado após a vigência implica aceite das novas condições.' },
            { id: 'contato', n: 9, title: 'Contato e DPO', text: 'Encarregado de Dados (DPO): Rafael Souza · privacidade@noro.guru · Noro Guru — Nomade Group · São Paulo, SP, Brasil. Prazo de resposta: 15 dias úteis.' },
          ].map((s) => (
            <section key={s.id} id={s.id}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 14 }}>{s.n}. {s.title}</h2>
              <p style={{ fontSize: 14, color: '#D1D5F0', lineHeight: 1.75, margin: 0 }}>{s.text}</p>
            </section>
          ))}

          {/* Footer legal links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, marginTop: 8, fontSize: 13, fontWeight: 500 }}>
            <Link href="/terms-of-service" style={{ color: '#1DD3C0', textDecoration: 'none' }}>Termos de Serviço</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <Link href="/cookies" style={{ color: '#1DD3C0', textDecoration: 'none' }}>Política de Cookies</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <Link href="/sla" style={{ color: '#1DD3C0', textDecoration: 'none' }}>Acordo de Nível de Serviço (SLA)</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
