// apps/core/(protected)/relatorios/page.tsx
import { BarChart3 } from 'lucide-react';

export default function RelatoriosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BarChart3 size={32} className="text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
            <p className="text-gray-600 mt-1">Extraia insights e acompanhe a performance do seu negócio.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Página em Construção</h2>
        <p className="text-gray-500 mt-2">A funcionalidade de relatórios e análises está a ser desenvolvida.</p>
      </div>
    </div>
  );
}
