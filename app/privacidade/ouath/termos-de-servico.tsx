import { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

// --- METADADOS (SEO) ---
export const metadata: Metadata = {
  title: 'Termos de Serviço - Nomade Guru',
  description: 'Leia os Termos de Serviço que regem a utilização do site e do aplicativo NOMADE GURU OAUTH.',
};

// --- COMPONENTE DA PÁGINA ---
export default function TermsPage() {
  return (
    <main className="pt-20 bg-neutral-dark text-white">
      <LegalPageLayout title="Termos de Serviço" lastUpdated="15 de Outubro de 2025">
          <p className="lead">
            Bem-vindo ao site e aplicativo NOMADE GURU OAUTH (“nós”, “nosso” ou “empresa”). Ao acessar ou utilizar nosso site ou app, você concorda com estes Termos de Serviço e com a nossa Política de Privacidade.
          </p>

          <h2>1. Uso do Aplicativo</h2>
          <p>Você concorda em utilizar o aplicativo apenas para fins legais e de acordo com estes Termos. O login via Google e Meta serve exclusivamente para autenticação e personalização da sua experiência.</p>

          <h2>2. Responsabilidades do Usuário</h2>
          <p>Manter suas credenciais seguras, não compartilhar a conta e não tentar acessar dados de outros usuários sem autorização.</p>

          <h2>3. Propriedade Intelectual</h2>
          <p>Todo conteúdo do site e app é propriedade da NOMADE GURU ou licenciado. Reprodução não autorizada é proibida.</p>

          <h2>4. Limitação de Responsabilidade</h2>
          <p>O aplicativo é fornecido “como está”. Não nos responsabilizamos por interrupções, perda de dados ou mau uso das plataformas de login (Google/Meta).</p>

          <h2>5. Modificações</h2>
          <p>Podemos atualizar estes Termos a qualquer momento. O uso continuado do aplicativo constitui aceitação das alterações.</p>

          <h2>6. Encerramento da Conta</h2>
          <p>Podemos suspender ou encerrar contas em caso de violação dos Termos. Você pode encerrar sua conta a qualquer momento nas configurações do aplicativo.</p>

          <h2>7. Contato</h2>
          <p>
            Para dúvidas sobre estes Termos de Serviço, entre em contato:<br />
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
