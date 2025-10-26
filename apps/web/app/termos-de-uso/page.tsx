import { Metadata } from 'next';
import LegalPageLayout from "@/components/LegalPageLayout";

// --- METADADOS (SEO) ---
export const metadata: Metadata = {
  title: 'Termos de Uso - Nomade Guru',
  description: 'Leia os Termos de Uso que regem a utilização do site e dos serviços da Nomade Guru.',
};

// --- COMPONENTE DA PÁGINA ---
export default function TermosPage() {
  return (
    <main className="pt-20 bg-neutral-dark text-white">
      <LegalPageLayout title="Termos de Uso" lastUpdated="14 de Outubro de 2024">
          <p className="lead">Bem-vindo ao site Nomade Guru (“nós”, “nosso” ou “empresa”). Ao aceder ou utilizar o nosso site nomade.guru, concorda com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde com qualquer parte destes termos, pedimos que não utilize o nosso site.</p>
          
          <h2>1. Uso do Site</h2>
          <p>Concorda em utilizar o site apenas para fins legais e de acordo com estes Termos de Uso. É proibido utilizar o site para qualquer atividade que viole leis locais, nacionais ou internacionais.</p>
          
          <h2>2. Propriedade Intelectual</h2>
          <p>Todo o conteúdo do site, incluindo textos, imagens, logótipos e design, é propriedade da Nomade Guru. É proibida a reprodução ou uso comercial de qualquer conteúdo sem autorização prévia.</p>
          
          <h2>3. Reservas e Serviços</h2>
          <p>As informações sobre roteiros, preços e disponibilidade podem sofrer alterações sem aviso prévio. A Nomade Guru atua como intermediária entre o cliente e os fornecedores de viagem (hotéis, transportadoras, etc.).</p>
          
          <h2>4. Limitação de Responsabilidade</h2>
          <p>O uso do site é por sua conta e risco. A Nomade Guru não garante que o site esteja livre de erros ou vírus e não se responsabiliza por quaisquer danos decorrentes do uso dos nossos serviços.</p>

          <h2>5. Alterações nos Termos</h2>
          <p>Podemos atualizar estes Termos de Uso a qualquer momento. O uso continuado do site após alterações constitui a aceitação das novas condições.</p>
          
          <h2>6. Legislação</h2>
          <p>Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro da comarca de Campinas/SP, Brasil.</p>

          <h2>7. Contacto</h2>
          <p>Para dúvidas sobre estes Termos de Uso, entre em contacto:</p>
          <p><strong>Nomade Guru</strong><br />
          E-mail: <a href="mailto:contato@nomade.guru">contato@nomade.guru</a><br />
          Telefone: <a href="tel:+5511947745710">+55 11 94774-5710</a></p>
      </LegalPageLayout>
    </main>
  );
}