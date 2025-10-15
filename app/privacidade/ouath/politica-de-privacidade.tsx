import { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

// --- METADADOS (SEO) ---
export const metadata: Metadata = {
  title: 'Política de Privacidade - Nomade Guru',
  description: 'Conheça como a Nomade Guru coleta, utiliza e protege seus dados ao utilizar o site e o aplicativo NOMADE GURU OAUTH.',
};

// --- COMPONENTE DA PÁGINA ---
export default function PrivacyPage() {
  return (
    <main className="pt-20 bg-neutral-dark text-white">
      <LegalPageLayout title="Política de Privacidade" lastUpdated="15 de Outubro de 2025">
          <p className="lead">
            A proteção da sua privacidade é essencial para nós. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações ao usar nosso site e o aplicativo NOMADE GURU OAUTH, incluindo login via Google e Meta.
          </p>

          <h2>1. Informações que Coletamos</h2>
          <p>Ao utilizar o login via Google ou Meta, podemos coletar: nome, e-mail, foto de perfil, identificador único das plataformas, informações públicas do seu perfil (quando autorizadas) e dados de uso do aplicativo.</p>

          <h2>2. Uso das Informações</h2>
          <p>As informações são usadas para autenticação, personalização da experiência, envio de notificações importantes, análises de desempenho e cumprimento de obrigações legais.</p>

          <h2>3. Compartilhamento de Dados</h2>
          <p>Não vendemos ou alugamos seus dados. Podemos compartilhar informações com prestadores de serviços, autoridades legais ou plataformas OAuth apenas para fins de autenticação.</p>

          <h2>4. Armazenamento e Segurança</h2>
          <p>Os dados são armazenados com segurança, com criptografia e acesso restrito a funcionários autorizados.</p>

          <h2>5. Seus Direitos</h2>
          <p>Você pode solicitar acesso, correção ou exclusão de seus dados, revogar o acesso do aplicativo às suas contas e gerenciar informações diretamente nas plataformas Google ou Meta.</p>

          <h2>6. Cookies e Tecnologias Semelhantes</h2>
          <p>Utilizamos cookies apenas para autenticação segura, melhoria da experiência e análises anônimas.</p>

          <h2>7. Contato</h2>
          <p>
            Para dúvidas sobre esta Política de Privacidade, entre em contato:<br />
            <strong>NOMADE GURU OAUTH</strong><br />
            E-mail: <a href="mailto:dpo@nomade.guru">dpo@nomade.guru</a><br />
            Telefone: <a href="tel:+5511947745710">+55 11 94774-5710</a><br />
            Endereço: Rua Comendador Torlogo Dauntre, 74 - Sala 1207 - Cambuí - Campinas/SP - CEP 13025-270
          </p>

          <h2>8. Links de OAuth</h2>
          <p>
            Para mais informações sobre como Google e Meta gerenciam seus dados de login:<br />
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a><br />
            <a href="https://www.facebook.com/about/privacy/" target="_blank" rel="noopener noreferrer">Meta (Facebook/Instagram) Privacy Policy</a>
          </p>
      </LegalPageLayout>
    </main>
  );
}
