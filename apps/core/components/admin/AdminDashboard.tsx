// components/admin/AdminDashboard.tsx
'use client';

import { DollarSign, Users, CreditCard, TrendingUp, Plus } from 'lucide-react'; // Importei o ícone Plus
import StatCard from './StatCard';
import LeadsRecentes from './LeadsRecentes';
import TarefasList from './TarefasList';
import Link from 'next/link';
import type { Database } from '@/types/supabase';

// Tipos para as props
type Lead = Database['public']['Tables']['noro_leads']['Row'];
type Tarefa = Database['public']['Tables']['noro_tarefas']['Row'] & {
    noro_leads?: { nome: string } | null;
};

interface AdminDashboardProps {
  metrics: any; 
  leadsRecentes: Lead[];
  tarefas: Tarefa[];
}

export default function AdminDashboard({ metrics, leadsRecentes, tarefas }: AdminDashboardProps) {
  
  // Dados de variação estáticos, apenas para exibição
  const variacao = {
    receita: 12.5,
    leads: 8.3,
    pedidos: -5.2,
    conversao: 3.1,
  };

  return (
    <div className="space-y-6">
      {/* Header do Conteúdo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo! 👋</h1>
          <p className="text-gray-600 mt-1">Aqui está um resumo do seu negócio</p>
        </div>
        {/* BOTÃO ALTERADO */}
        <Link
          href="/leads/novo"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Novo Lead
        </Link>
      </div>

      {/* Cartões de Estatísticas */}
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
    </div>
  );
}