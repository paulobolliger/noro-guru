import { Metadata } from 'next';
import LegalPageLayout from "@/components/LegalPageLayout";

// --- METADADOS (SEO) ---
export const metadata: Metadata = {
  title: 'Exclusão de Dados - Nomade Guru',
  description: 'Saiba como solicitar a exclusão dos seus dados do NOMADE GURU OAUTH de forma segura.',
};

// --- COMPONENTE DA PÁGINA ---
export default function ExclusaoPage() {
  return (
    <main className="pt-20 bg-neutral-dark text-white">
      <LegalPageLayout title="Exclusão de Dados" lastUpdated="15 de Outubro de 2025">
          <p className="lead">
            Prezado usuário, respeitamos sua privacidade e garantimos que você pode solicitar a exclusão de todos os seus dados pessoais armazenados em nosso aplicativo NOMADE GURU OAUTH.
          </p>

          <h2>Como Solicitar a Exclusão dos Seus Dados</h2>
          <p>
            Para solicitar a exclusão de seus dados, por favor envie um e-mail com as seguintes informações:
          </p>
          <ul className="list-disc pl-6">
            <li>Nome completo</li>
            <li>Endereço de e-mail usado no aplicativo</li>
            <li>Assunto do e-mail: "Solicitação de Exclusão de Dados"</li>
          </ul>

          <p>Envie a solicitação para:</p>
          <p>
            <strong>NOMADE GURU OAUTH</strong><br />
            E-mail: <a href="mailto:dpo@nomade.guru">dpo@nomade.guru</a><br />
            Telefone: <a href="tel:+5511947745710">+55 11 94774-5710</a><br />
            Endereço: Rua Comendador Torlogo Dauntre, 74 - Sala 1207 - Cambuí - Campinas/SP - CEP 13025-270
          </p>

          <h2>Prazo para Exclusão</h2>
          <p>
            Após receber sua solicitação, processaremos a exclusão dos seus dados pessoais em até 30 dias úteis. Você receberá uma confirmação por e-mail assim que todos os dados forem removidos.
          </p>

          <h2>Observações Importantes</h2>
          <ul className="list-disc pl-6">
            <li>Esta exclusão é irreversível: todos os seus dados serão permanentemente removidos do nosso sistema.</li>
            <li>Dados obrigatórios para fins legais ou regulatórios podem ser retidos conforme legislação aplicável, mas serão devidamente anonimizados sempre que possível.</li>
          </ul>
      </LegalPageLayout>
    </main>
  );
}
