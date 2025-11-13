// apps/core/app/financeiro/page.tsx
import MainLayout from '@/components/layout/MainLayout';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function FinanceiroPage() {
  const mockUser = { 
    email: 'dev@noro.com.br',
    nome: 'Desenvolvedor'
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-2">
            Controle suas receitas, despesas e fluxo de caixa
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Receitas</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
            <p className="text-sm text-gray-500 mt-1">Este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Despesas</h3>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
            <p className="text-sm text-gray-500 mt-1">Este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Saldo</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
            <p className="text-sm text-gray-500 mt-1">Disponível</p>
          </div>
        </div>

        {/* Transações recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Transações Recentes</h2>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma transação registrada
              </h3>
              <p className="text-gray-600">
                As transações aparecerão aqui quando forem registradas
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
