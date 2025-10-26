// app/admin/(protected)/sobre-noro/page.tsx
import { Info } from 'lucide-react';
import packageJson from '@/../package.json';

export default function SobreNoroPage() {
  const version = packageJson.version;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Info size={32} className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sobre o NORO</h1>
          <p className="text-gray-600 mt-1">O cérebro digital do agente de viagens moderno.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-800 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-700 prose-p:text-gray-600 prose-blockquote:border-l-blue-600 prose-blockquote:text-gray-800 prose-blockquote:font-semibold">
          
          <h2>Noro — O app inteligente do agente moderno</h2>
          <p>
            Noro nasceu da ideia de que a vida do agente de viagens independente pode — e deve — ser mais simples, rápida e inteligente. É muito mais do que um CRM ou ERP: é o cérebro digital que organiza, conecta e potencializa cada operação, cada cliente e cada oportunidade.
          </p>

          <h3>Por que Noro existe</h3>
          <p>
            Ser agente independente é liberdade, mas também exige gestão eficiente, visão completa e decisões rápidas. Noro resolve isso: centraliza dados, automatiza processos, gera insights e ainda mantém a experiência leve, intuitiva e prazerosa.
          </p>

          <h3>O que Noro oferece</h3>
          <ul>
            <li><strong>Inteligência prática:</strong> organiza contatos, vendas, passeios e reservas sem complicação.</li>
            <li><strong>Autonomia real:</strong> você decide como trabalhar, o sistema se adapta ao seu fluxo.</li>
            <li><strong>Acesso rápido:</strong> app ágil, moderno, na palma da mão.</li>
            <li><strong>Custo justo:</strong> tecnologia premium sem pesar no bolso do agente.</li>
            <li><strong>Conexão .guru:</strong> cada ação do sistema reflete a filosofia de profissionalismo consciente, liberdade e propósito.</li>
          </ul>

          <h3>Nossa promessa</h3>
          <blockquote>
            “Noro pensa como você, mas mais rápido. Você faz negócios, Noro faz o resto.”
          </blockquote>

          <h3>O futuro é Noro</h3>
          <p>
            Ao adotar Noro, o agente não apenas gerencia clientes — ele vive o que importa, cresce com autonomia e mantém o equilíbrio entre trabalho e liberdade, enquanto entrega experiências inesquecíveis aos viajantes.
          </p>

          <div className="mt-12 text-center text-sm text-gray-400">
            Versão {version}
          </div>

        </div>
      </div>
    </div>
  );
}