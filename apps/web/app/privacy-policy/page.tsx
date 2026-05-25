import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Noro Guru',
  description: 'Como a Noro Guru coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
};

const TOC = [
  'Introdução',
  'Dados que coletamos',
  'Como usamos seus dados',
  'Compartilhamento de dados',
  'Seus direitos (LGPD)',
  'Cookies e rastreamento',
  'Segurança dos dados',
  'Alterações nesta política',
  'Contato e DPO',
];

const LGPD_RIGHTS = [
  'Confirmar a existência de tratamento de seus dados',
  'Acessar os dados que mantemos sobre você',
  'Corrigir dados incompletos, inexatos ou desatualizados',
  'Solicitar anonimização, bloqueio ou eliminação',
  'Solicitar portabilidade dos dados para outro fornecedor',
  'Revogar o consentimento a qualquer momento',
  'Se opor a tratamento baseado em legítimo interesse',
  'Não ser submetido a decisões exclusivamente automatizadas',
];

const SECTIONS = [
  {
    id: 'p-1',
    title: '1. Introdução',
    content: 'A Noro Guru (Nomade Group) respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política informa como coletamos, usamos, compartilhamos e protegemos seus dados ao usar nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e demais normas aplicáveis.',
  },
  {
    id: 'p-2',
    title: '2. Dados que coletamos',
    content: 'Coletamos: (a) Dados fornecidos por você — nome, e-mail, CNPJ, telefone, dados de pagamento, informações de clientes inseridas no CRM; (b) Dados de uso — logs de acesso, funcionalidades utilizadas, histórico de ações, preferências de configuração; (c) Dados técnicos — endereço IP, tipo de navegador, sistema operacional, identificadores de dispositivo.',
  },
  {
    id: 'p-3',
    title: '3. Como usamos seus dados',
    content: 'Usamos seus dados para: prestar e melhorar os serviços contratados; processar pagamentos e emitir cobranças; enviar comunicações sobre a plataforma (atualizações, segurança, suporte); personalizar a experiência de uso; cumprir obrigações legais e regulatórias; prevenir fraudes e garantir a segurança da plataforma. Não vendemos seus dados para terceiros.',
  },
  {
    id: 'p-4',
    title: '4. Compartilhamento de dados',
    content: 'Compartilhamos dados apenas com: parceiros de infraestrutura necessários para operar a plataforma (processadores de pagamento, CDN, provedores de e-mail transacional); autoridades quando exigido por lei ou ordem judicial; terceiros com seu consentimento explícito e documentado. Todos os parceiros assinam Acordos de Processamento de Dados (DPA) compatíveis com a LGPD.',
  },
  {
    id: 'p-5',
    title: '5. Seus direitos (LGPD)',
    lgpdRights: true,
    content: 'Como titular dos dados, você tem os seguintes direitos garantidos pela LGPD. Para exercê-los, entre em contato: privacidade@noro.guru. Respondemos em até 15 dias úteis.',
  },
  {
    id: 'p-6',
    title: '6. Cookies e rastreamento',
    content: 'Usamos cookies essenciais (necessários para funcionamento), cookies analíticos (para entender como você usa a plataforma, via dados agregados e anonimizados) e cookies de preferências (para lembrar suas configurações). Você pode gerenciar cada categoria pelo banner de consentimento ou pela nossa Política de Cookies.',
  },
  {
    id: 'p-7',
    title: '7. Segurança dos dados',
    content: 'Todos os dados são armazenados em servidores no Brasil, com criptografia AES-256 em repouso e TLS 1.3 em trânsito. Realizamos auditorias de segurança semestrais, testes de penetração anuais e monitoramento contínuo. Em caso de incidente de segurança com risco aos titulares, notificaremos a ANPD e os afetados em até 72 horas.',
  },
  {
    id: 'p-8',
    title: '8. Alterações nesta política',
    content: 'Podemos atualizar esta Política periodicamente. Quando houver alterações materiais — mudanças nas finalidades de tratamento, novos tipos de dados coletados ou novos compartilhamentos — notificaremos por e-mail e dentro da plataforma com pelo menos 30 dias de antecedência. Alterações menores podem ser publicadas sem aviso prévio.',
  },
  {
    id: 'p-9',
    title: '9. Contato e DPO',
    content: 'Encarregado de Dados (DPO): Rafael Souza · privacidade@noro.guru · Noro Guru — Nomade Group · São Paulo, SP, Brasil. Para solicitações relacionadas a LGPD, usamos o canal dedicado: privacidade@noro.guru com prazo de resposta de 15 dias úteis.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Início
          </Link>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', padding: '3px 12px', borderRadius: 999, marginBottom: 16 }}>
            Política de Privacidade
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.15 }}>
            Como protegemos seus dados
          </h1>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>
            Última atualização: maio de 2026 · Vigência: LGPD / Lei 13.709/2018
          </p>
        </div>
      </div>

      {/* Body — 2-column */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 96px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48, alignItems: 'start' }}>

        {/* Sidebar TOC */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8C1E0', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Índice</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {TOC.map((item, i) => (
                <li key={item} style={{ marginBottom: 10 }}>
                  <a href={`#p-${i + 1}`} style={{ fontSize: 13, color: '#1DD3C0', textDecoration: 'none', display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.4 }}>
                    <span style={{ fontSize: 11, color: '#4B5578', fontFamily: 'var(--font-mono)', flexShrink: 0, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}.</span>
                    {item}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Main content */}
        <div>
          {SECTIONS.map((section, i) => (
            <div key={section.id} id={section.id} style={{ marginBottom: 0 }}>
              <div style={{ paddingBottom: 40, paddingTop: i === 0 ? 0 : 40, borderBottom: i < SECTIONS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.75, margin: section.lgpdRights ? '0 0 20px' : 0 }}>
                  {section.content}
                </p>
                {section.lgpdRights && (
                  <div style={{ background: 'rgba(52,44,164,0.1)', border: '1px solid rgba(52,44,164,0.25)', borderRadius: 12, padding: 20 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {LGPD_RIGHTS.map((right) => (
                        <li key={right} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#D1D5F0', lineHeight: 1.5, marginBottom: 10 }}>
                          <span style={{ color: '#1DD3C0', flexShrink: 0, marginTop: 1 }}>✓</span>
                          {right}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Footer links */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, marginTop: 8, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/terms-of-service" style={{ color: '#1DD3C0', fontSize: 13, textDecoration: 'none' }}>Termos de Uso →</Link>
            <Link href="/cookies" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Política de Cookies →</Link>
            <Link href="/lgpd" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>LGPD →</Link>
            <Link href="/seguranca" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Segurança →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
