// apps/core/app/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // TEMPORÁRIO: Comentado para desenvolvimento
  // if (!user) {
  //   return redirect('/login?redirect=/'); 
  // }

  // Usuário mock para desenvolvimento
  const userProfile = user ? await supabase
    .from('noro_users')
    .select('nome, email')
    .eq('id', user.id)
    .single()
    .then(res => res.data) : null;

  const mockUser = userProfile || { 
    email: 'dev@noro.com.br',
    nome: 'Desenvolvedor'
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do seu negócio
          </p>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita do Mês</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">R$ 0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Área de conteúdo principal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bem-vindo ao NORO Core</h2>
          <p className="text-gray-600">
            Este é o portal do tenant. Aqui você terá acesso ao sistema financeiro,
            comunicação, CRM e todos os módulos específicos do seu negócio.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Relatórios</h3>
              <p className="text-sm text-gray-600">
                Acompanhe métricas e KPIs do seu negócio
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold mb-1">Gestão de Leads</h3>
              <p className="text-sm text-gray-600">
                Capture e gerencie seus leads
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold mb-1">Financeiro</h3>
              <p className="text-sm text-gray-600">
                Controle receitas, despesas e fluxo de caixa
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

