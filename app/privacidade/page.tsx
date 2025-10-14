import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LegalPageLayout from '@/components/LegalPageLayout';

// --- METADADOS (SEO) ---
export const metadata: Metadata = {
  title: 'Política de Privacidade - Nomade Guru',
  description: 'Entenda como a Nomade Guru recolhe, usa e protege os seus dados pessoais.',
};

// --- COMPONENTE DA PÁGINA ---
export default function PrivacidadePage() {
  return (
    <>
      <Header onCrieRoteiroClick={() => {}} />
      <main className="pt-24 md:pt-32 bg-neutral-dark text-white">
        <LegalPageLayout title="Política de Privacidade" lastUpdated="14 de Outubro de 2025">
          <p className="lead">A Nomade Guru (“nós”, “nosso” ou “empresa”) valoriza a sua privacidade e está comprometida em proteger os dados pessoais de todos os visitantes do nosso site nomade.guru e dos nossos serviços relacionados. Esta Política de Privacidade explica como recolhemos, usamos, partilhamos e protegemos as suas informações pessoais, além de informar os seus direitos em relação a esses dados.</p>
          
          <h2>1. Informações que Recolhemos</h2>
          <p>Podemos recolher diferentes tipos de informações quando visita o nosso site, utiliza os nossos serviços ou interage connosco:</p>
          <h3>1.1 Informações fornecidas por si</h3>
          <ul>
            <li>Nome, apelido, e-mail, telefone, morada;</li>
            <li>Informações de pagamento (cartão de crédito, dados bancários, PayPal);</li>
            <li>Preferências de viagem, destinos e informações pessoais relacionadas com a reserva.</li>
          </ul>

          <h3>1.2 Informações recolhidas automaticamente</h3>
          <ul>
            <li>Dados de navegação, como endereço IP, tipo de navegador, páginas visitadas, tempo de permanência no site e cliques;</li>
            <li>Cookies e tecnologias semelhantes para melhorar a experiência do utilizador e para fins de análise.</li>
          </ul>

          <h2>2. Como Usamos as suas Informações</h2>
          <p>Usamos as suas informações para:</p>
          <ul>
            <li>Processar reservas e pagamentos;</li>
            <li>Personalizar e melhorar a sua experiência nos nossos roteiros;</li>
            <li>Enviar informações sobre os nossos serviços, promoções e novidades (com o seu consentimento);</li>
            <li>Cumprir obrigações legais ou regulatórias.</li>
          </ul>

          <h2>3. Partilha de Informações</h2>
          <p>Não vendemos, alugamos ou negociamos os seus dados pessoais com terceiros para fins de marketing.</p>

          <h2>4. Segurança dos Dados</h2>
          <p>Implementamos medidas técnicas e administrativas para proteger os seus dados pessoais contra perda, uso indevido, acesso não autorizado, alteração ou divulgação.</p>

          <h2>5. Os Seus Direitos</h2>
          <p>Você possui direitos relacionados com os seus dados pessoais, incluindo o acesso, correção ou exclusão das suas informações. Para exercer os seus direitos, entre em contacto através do e-mail: <a href="mailto:privacidade@nomade.guru">privacidade@nomade.guru</a>.</p>
          
          <h2>6. Contacto</h2>
          <p>Se tiver dúvidas sobre esta Política de Privacidade, entre em contacto:</p>
          <p><strong>Nomade Guru</strong><br />
          E-mail: <a href="mailto:privacidade@nomade.guru">privacidade@nomade.guru</a><br />
          Telefone: <a href="tel:+5511947745710">+55 (11) 94774-5710</a></p>
        </LegalPageLayout>
      </main>
      <Footer />
    </>
  );
}
