// apps/control/hooks/useLeads.ts
// Hooks para gerenciar leads do tenant
// RLS garante isolamento - não precisa filtrar manualmente por tenant_id!

"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface Lead {
  id: string;
  tenant_id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  origem: string | null;
  canal_preferencial: string | null;
  status: string;
  valor_estimado: number | null;
  probabilidade: number;
  destino_interesse: string | null;
  periodo_viagem: string | null;
  num_pessoas: number | null;
  observacoes: string | null;
  proxima_acao: string | null;
  data_proxima_acao: string | null;
  responsavel: string | null;
  tags: string[] | null;
  metadata: any;
  perdido_motivo: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadFilters {
  search?: string;
  status?: string;
  origem?: string;
}

/**
 * Hook para buscar todos os leads do tenant
 * RLS automaticamente filtra por tenant do usuário logado
 */
export function useLeads(filters: LeadFilters = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const supabase = createClient();
        
        let query = supabase
          .from('noro_leads')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtros opcionais (RLS já cuida do tenant_id)
        if (filters.search) {
          query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.origem) {
          query = query.eq('origem', filters.origem);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setLeads(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, [filters.search, filters.status, filters.origem]);

  return { leads, isLoading, error };
}

/**
 * Hook para buscar um lead específico por ID
 * RLS valida se o lead pertence ao tenant do usuário
 */
export function useLead(leadId: string | null) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!leadId) {
      setIsLoading(false);
      return;
    }

    async function fetchLead() {
      try {
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('noro_leads')
          .select('*')
          .eq('id', leadId)
          .single();

        if (fetchError) throw fetchError;
        setLead(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLead();
  }, [leadId]);

  return { lead, isLoading, error };
}

/**
 * Hook para estatísticas dos leads
 */
export function useLeadsStats() {
  const [stats, setStats] = useState({
    total: 0,
    novo: 0,
    contato: 0,
    proposta: 0,
    negociacao: 0,
    ganho: 0,
    perdido: 0,
    conversion_rate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        
        // RLS já filtra por tenant
        const { data: allLeads } = await supabase
          .from('noro_leads')
          .select('status');

        if (allLeads) {
          const total = allLeads.length;
          const novo = allLeads.filter((l: any) => l.status === 'novo').length;
          const contato = allLeads.filter((l: any) => l.status === 'contato').length;
          const proposta = allLeads.filter((l: any) => l.status === 'proposta').length;
          const negociacao = allLeads.filter((l: any) => l.status === 'negociacao').length;
          const ganho = allLeads.filter((l: any) => l.status === 'ganho').length;
          const perdido = allLeads.filter((l: any) => l.status === 'perdido').length;
          
          const conversion_rate = total > 0 ? (ganho / total) * 100 : 0;

          setStats({ 
            total, 
            novo, 
            contato, 
            proposta, 
            negociacao, 
            ganho, 
            perdido,
            conversion_rate: Math.round(conversion_rate * 100) / 100
          });
        }
      } catch (err) {
        console.error('Error fetching lead stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}

/**
 * Hook para pipeline de vendas (funil)
 */
export function useLeadsPipeline() {
  const [pipeline, setPipeline] = useState<Array<{
    status: string;
    count: number;
    value: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPipeline() {
      try {
        const supabase = createClient();
        
        // RLS já filtra por tenant
        const { data: allLeads } = await supabase
          .from('noro_leads')
          .select('status, valor_estimado');

        if (allLeads) {
          const stages = ['novo', 'contato', 'proposta', 'negociacao', 'ganho'];
          const pipelineData = stages.map(status => ({
            status,
            count: allLeads.filter((l: any) => l.status === status).length,
            value: allLeads
              .filter((l: any) => l.status === status)
              .reduce((sum: number, l: any) => sum + (l.valor_estimado || 0), 0)
          }));

          setPipeline(pipelineData);
        }
      } catch (err) {
        console.error('Error fetching pipeline:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPipeline();
  }, []);

  return { pipeline, isLoading };
}
