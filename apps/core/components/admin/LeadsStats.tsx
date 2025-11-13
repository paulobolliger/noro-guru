'use client';

import type { Database } from '@/types/supabase';
import { TrendingUp, DollarSign, Users, Target, Award, AlertTriangle } from 'lucide-react';

type Lead = Database['public']['Tables']['noro_leads']['Row'];

interface LeadsStatsProps {
  leads: Lead[];
}

export default function LeadsStats({ leads }: LeadsStatsProps) {
  // Calcular estatísticas
  const stats = {
    total: leads.length,
    novo: leads.filter((l) => l.status === 'novo').length,
    qualificado: leads.filter((l) => l.status === 'qualificado').length,
    negociacao: leads.filter((l) => l.status === 'negociacao').length,
    ganho: leads.filter((l) => l.status === 'ganho').length,
    perdido: leads.filter((l) => l.status === 'perdido').length,
  };

  const valorTotal = leads.reduce((sum, lead) => sum + (lead.valor_estimado || 0), 0);
  const valorGanho = leads
    .filter((l) => l.status === 'ganho')
    .reduce((sum, lead) => sum + (lead.valor_estimado || 0), 0);
  const valorNegociacao = leads
    .filter((l) => l.status === 'negociacao')
    .reduce((sum, lead) => sum + (lead.valor_estimado || 0), 0);

  const taxaConversao = stats.total > 0 ? ((stats.ganho / stats.total) * 100).toFixed(1) : '0';
  const ticketMedio = stats.ganho > 0 ? (valorGanho / stats.ganho).toFixed(0) : '0';

  const leadsRoteiroPronto = leads.filter((l) => l.tipo === 'roteiro_pronto').length;
  const leadsGeracaoIA = leads.filter((l) => l.tipo === 'geracao_ia').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total de Leads */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Users size={24} />
          </div>
          <span className="text-3xl font-bold">{stats.total}</span>
        </div>
        <h3 className="text-sm font-medium opacity-90">Total de Leads</h3>
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs opacity-80">
          <span>{leadsRoteiroPronto} roteiros prontos</span>
          <span>{leadsGeracaoIA} IA</span>
        </div>
      </div>

      {/* Valor Total */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <DollarSign size={24} />
          </div>
          <span className="text-3xl font-bold">€{(valorTotal / 1000).toFixed(0)}k</span>
        </div>
        <h3 className="text-sm font-medium opacity-90">Valor Total Pipeline</h3>
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs opacity-80">
          <span>Ganho: €{(valorGanho / 1000).toFixed(0)}k</span>
          <span>Negoc: €{(valorNegociacao / 1000).toFixed(0)}k</span>
        </div>
      </div>

      {/* Taxa de Conversão */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <span className="text-3xl font-bold">{taxaConversao}%</span>
        </div>
        <h3 className="text-sm font-medium opacity-90">Taxa de Conversão</h3>
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs opacity-80">
          <span className="flex items-center gap-1">
            <Award size={12} />
            {stats.ganho} ganhos
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle size={12} />
            {stats.perdido} perdidos
          </span>
        </div>
      </div>

      {/* Ticket Médio */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Target size={24} />
          </div>
          <span className="text-3xl font-bold">€{ticketMedio}</span>
        </div>
        <h3 className="text-sm font-medium opacity-90">Ticket Médio</h3>
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs opacity-80">
          <span>{stats.qualificado} qualificados</span>
          <span>{stats.negociacao} em negociação</span>
        </div>
      </div>
    </div>
  );
}
