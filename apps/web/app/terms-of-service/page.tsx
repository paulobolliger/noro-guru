import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Serviço | Noro Guru',
  description: 'Termos e condições de uso da plataforma Noro Guru.',
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

export default function TermsPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', padding: '80px 24px 96px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Voltar
        </Link>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>
            Termos de Serviço
          </h1>
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0 }}>Última atualização: 24 de maio de 2026</p>
        </div>

        {/* TOC */}
        <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8C1E0', marginBottom: 16 }}>Índice</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOC.map((item, i) => (
              <li key={item}>
                <a href={`#t-${i + 1}`} style={{ fontSize: 14, color: '#1DD3C0', textDecoration: 'none', display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#B8C1E0', fontFamily: 'var(--font-mono)', width: 20 }}>{i + 1}.</span>
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div style={{ fontSize: 16, color: '#D1D5F0', lineHeight: 1.8 }}>
          {[
            { id: 't-1', title: '1. Aceitação dos termos', content: 'Ao criar uma conta e usar a plataforma Noro Guru, você concorda com estes Termos de Serviço e nossa Política de Privacidade. Se você usa a plataforma em nome de uma empresa, você declara que tem autoridade para vincular essa empresa a estes termos.' },
            { id: 't-2', title: '2. Descrição dos serviços', content: 'A Noro Guru é uma plataforma SaaS para agências de turismo que inclui CRM, financeiro, atendimento omnichannel, geração de sites e IA operacional. Os serviços disponíveis variam conforme o plano contratado.' },
            { id: 't-3', title: '3. Cadastro e conta', content: 'Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente em caso de uso não autorizado. A Noro Guru não se responsabiliza por perdas decorrentes do uso não autorizado de sua conta.' },
            { id: 't-4', title: '4. Planos e pagamento', content: 'Os planos são cobrados mensalmente ou anualmente (com desconto). O preço é fixado no momento da contratação. Ajustes de plano entram em vigor no próximo ciclo. Cancelamentos não geram reembolso proporcional do período já pago, salvo nos primeiros 14 dias (política de satisfação garantida).' },
            { id: 't-5', title: '5. Uso aceitável', content: 'Você concorda em não usar a plataforma para atividades ilegais, envio de spam, violação de direitos de terceiros, engenharia reversa ou qualquer atividade que possa prejudicar a Noro Guru ou outros usuários. A Noro Guru reserva o direito de suspender contas que violem estas regras.' },
            { id: 't-6', title: '6. Propriedade intelectual', content: 'Todo o conteúdo e software da plataforma Noro Guru é propriedade da Nomade Group. Os dados inseridos por você permanecem de sua propriedade. Ao usar a plataforma, você concede à Noro Guru licença limitada para processar esses dados conforme necessário para prestar os serviços.' },
            { id: 't-7', title: '7. Limitação de responsabilidade', content: 'Na extensão máxima permitida por lei, a Noro Guru não será responsável por danos indiretos, incidentais, especiais ou consequenciais. Nossa responsabilidade total não excederá o valor pago por você nos 12 meses anteriores ao evento que gerou a reclamação.' },
            { id: 't-8', title: '8. Rescisão', content: 'Você pode cancelar sua conta a qualquer momento. A Noro Guru pode suspender ou encerrar sua conta por violação destes termos, com aviso prévio de 30 dias salvo em casos graves. Após o encerramento, seus dados ficam disponíveis por 90 dias para exportação.' },
            { id: 't-9', title: '9. Alterações nos termos', content: 'A Noro Guru pode atualizar estes termos com aviso prévio de 30 dias por e-mail e dentro da plataforma. O uso continuado após a data de vigência implica aceite das novas condições.' },
            { id: 't-10', title: '10. Foro e lei aplicável', content: 'Estes termos são regidos pelas leis da República Federativa do Brasil. O foro da Comarca de São Paulo, SP, é eleito para resolução de quaisquer disputas, com renúncia a qualquer outro, por mais privilegiado que seja.' },
          ].map((section) => (
            <div key={section.id} id={section.id} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, margin: '0 0 16px' }}>
                {section.title}
              </h2>
              <p style={{ margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
