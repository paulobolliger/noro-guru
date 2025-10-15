// components/admin/AdminDashboard.tsx
'use client';

import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import LeadsRecentes from './LeadsRecentes';
import TarefasList from './TarefasList';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Link from 'next/link';

interface AdminDashboardProps {
  user: any;
  metrics: any;
  leadsRecentes: any[];
  tarefas: any[];
}

export default function AdminDashboard({ user, metrics, leadsRecentes, tarefas }: AdminDashboardProps) {
  const variacao = {
    receita: 12.5,
    leads: 8.3,
    pedidos: -5.2,
    conversao: 3.1,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bem-vindo! 👋</h1>
                <p className="text-gray-600 mt-1">Aqui está um resumo do seu negócio</p>
              </div>
              <Link
                href="/admin/roteiros/novo"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                + Novo Roteiro
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Receita (mês)"
                value={`R$ ${((metrics?.receita_periodo || 0) / 1000).toFixed(1)}k`}
                change={variacao.receita}
                icon={DollarSign}
                color="text-green-600"
              />
              <StatCard
                title="Novos Leads"
                value={metrics?.leads_novos_periodo || 0}
                change={variacao.leads}
                icon={Users}
                color="text-orange-500"
              />
              <StatCard
                title="Pedidos Ativos"
                value={metrics?.pedidos_ativos || 0}
                change={variacao.pedidos}
                icon={CreditCard}
                color="text-indigo-500"
              />
              <StatCard
                title="Taxa Conversão"
                value={`${metrics?.taxa_conversao || 0}%`}
                change={variacao.conversao}
                icon={TrendingUp}
                color="text-blue-600"
              />
            </div>

            {/* Leads Recentes + Tarefas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadsRecentes leads={leadsRecentes} />
              <TarefasList tarefas={tarefas} />
            </div>

            {/* CTA Integração APIs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Integração de APIs</h2>
                  <p className="text-blue-100">
                    Conecte suas APIs de fornecedores para automação completa
                  </p>
                </div>
                <Link
                  href="/admin/configuracoes/apis"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Configurar APIs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}