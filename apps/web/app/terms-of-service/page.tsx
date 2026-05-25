import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso | Noro Guru',
  description: 'Termos e condições de uso da plataforma Noro Guru. Conheça seus direitos e obrigações.',
};

const TOC = [
  'Aceitação dos termos',
  'Descrição dos serviços',
  'Cadastro e conta',
  'Planos e pagamento',
  'Uso aceitável',
  'Propriedade intelectual',
  'Limitação de responsabilidade',
  'Rescisão',
  'Alterações nos termos',
  'Foro e lei aplicável',
];

const SECTIONS = [
  {
    id: 't-1',
    title: '1. Aceitação dos termos',
    content: 'Ao criar uma conta e usar a plataforma Noro Guru, você concorda com estes Termos de Uso e nossa Política de Privacidade. Se você usa a plataforma em nome de uma empresa, você declara que tem autoridade para vincular essa empresa a estes termos. O uso da plataforma sem concordância com estes termos não é permitido.',
  },
  {
    id: 't-2',
    title: '2. Descrição dos serviços',
    content: 'A Noro Guru é uma plataforma SaaS para agências de turismo que inclui CRM, financeiro, atendimento omnichannel, geração de sites com IA e assistência operacional. Os serviços, funcionalidades e limites de uso disponíveis variam conforme o plano contratado e podem ser atualizados com aviso prévio.',
  },
  {
    id: 't-3',
    title: '3. Cadastro e conta',
    content: 'Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente em caso de acesso não autorizado pelo e-mail seguranca@noro.guru. A Noro Guru não se responsabiliza por perdas decorrentes do uso não autorizado de credenciais.',
  },
  {
    id: 't-4',
    title: '4. Planos e pagamento',
    content: 'Os planos são cobrados mensalmente ou anualmente (com desconto). O preço é fixado no momento da contratação e atualizado conforme comunicado com 30 dias de antecedência. Ajustes de plano entram em vigor no próximo ciclo de cobrança. Cancelamentos não geram reembolso do período já pago, exceto nos primeiros 14 dias corridos da contratação (garantia de satisfação).',
  },
  {
    id: 't-5',
    title: '5. Uso aceitável',
    content: 'Você concorda em não usar a plataforma para atividades ilegais, envio de spam, violação de direitos de terceiros, engenharia reversa do software ou qualquer atividade que possa prejudicar a Noro Guru ou outros usuários. A Noro Guru reserva o direito de suspender ou encerrar contas que violem estas regras, com ou sem aviso prévio dependendo da gravidade.',
  },
  {
    id: 't-6',
    title: '6. Propriedade intelectual',
    content: 'Todo o conteúdo, software e marca da plataforma Noro Guru é propriedade da Nomade Group. Os dados inseridos por você na plataforma permanecem de sua propriedade. Ao usar a plataforma, você concede à Noro Guru licença limitada, não exclusiva e revogável para processar esses dados conforme necessário para prestar os serviços contratados.',
  },
  {
    id: 't-7',
    title: '7. Limitação de responsabilidade',
    content: 'Na extensão máxima permitida pela legislação brasileira, a Noro Guru não será responsável por danos indiretos, incidentais, especiais, punitivos ou consequenciais. Nossa responsabilidade total por qualquer reclamação não excederá o valor pago por você nos 12 meses anteriores ao evento que originou a reclamação.',
  },
  {
    id: 't-8',
    title: '8. Rescisão',
    content: 'Você pode cancelar sua conta a qualquer momento pelo painel de configurações. A Noro Guru pode suspender ou encerrar sua conta por violação destes termos, com aviso prévio de 30 dias salvo em casos de violação grave ou fraude. Após o encerramento, seus dados ficam disponíveis para exportação por 90 dias corridos.',
  },
  {
    id: 't-9',
    title: '9. Alterações nos termos',
    content: 'A Noro Guru pode atualizar estes termos com aviso prévio mínimo de 30 dias, comunicado por e-mail cadastrado e notificação dentro da plataforma. Alterações de menor relevância podem entrar em vigor imediatamente. O uso continuado após a data de vigência implica aceite automático das novas condições.',
  },
  {
    id: 't-10',
    title: '10. Foro e lei aplicável',
    content: 'Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, em especial a Lei nº 13.709/2018 (LGPD), o Código de Defesa do Consumidor e o Marco Civil da Internet. O foro da Comarca de São Paulo, Estado de São Paulo, é eleito para resolução de quaisquer disputas, com renúncia a qualquer outro, por mais privilegiado que seja.',
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Início
          </Link>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#342CA4', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', background: 'rgba(52,44,164,0.12)', border: '1px solid rgba(52,44,164,0.3)', padding: '3px 12px', borderRadius: 999, marginBottom: 16 }}>
            Termos de Uso
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.15 }}>
            Termos e condições de uso
          </h1>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>
            Última atualização: maio de 2026 · Vigência: LGPD / Lei 13.709/2018 · Marco Civil da Internet
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
                  <a href={`#t-${i + 1}`} style={{ fontSize: 13, color: '#1DD3C0', textDecoration: 'none', display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.4 }}>
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
                <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.75, margin: 0 }}>
                  {section.content}
                </p>
              </div>
            </div>
          ))}

          {/* Footer links */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, marginTop: 8, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ color: '#1DD3C0', fontSize: 13, textDecoration: 'none' }}>Política de Privacidade →</Link>
            <Link href="/cookies" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Política de Cookies →</Link>
            <Link href="/sla" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>SLA →</Link>
            <Link href="/seguranca" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Segurança →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
