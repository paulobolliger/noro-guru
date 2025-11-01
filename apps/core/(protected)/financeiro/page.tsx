// apps/core/(protected)/financeiro/page.tsx
import { DollarSign } from 'lucide-react';

export default function FinanceiroPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <DollarSign size={32} className="text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
            <p className="text-gray-600 mt-1">Controle as receitas, despesas e o fluxo de caixa.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Página em Construção</h2>
        <p className="text-gray-500 mt-2">A funcionalidade de gestão financeira está a ser desenvolvida.</p>
      </div>
    </div>
  );
}
