// apps/control/hooks/useOrcamentos.ts
// Hooks para gerenciar orçamentos do tenant
// RLS garante isolamento - não precisa filtrar manualmente por tenant_id!

"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface Orcamento {
  id: string;
  tenant_id: string;
  numero_orcamento: string;
  cliente_id: string | null;
  lead_id: string | null;
  titulo: string;
  descricao: string | null;
  destinos: string[];
  data_viagem_inicio: string | null;
  data_viagem_fim: string | null;
  num_dias: number | null;
  num_pessoas: number;
  valor_total: number;
  valor_custo: number;
  margem_lucro: number;
  margem_percentual: number;
  moeda: string;
  status: string;
  validade_ate: string | null;
  prioridade: string;
  enviado_em: string | null;
  visualizado_em: string | null;
  aprovado_em: string | null;
  recusado_em: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrcamentoFilters {
  search?: string;
  status?: string;
  prioridade?: string;
}

/**
 * Hook para buscar todos os orçamentos do tenant
 * RLS automaticamente filtra por tenant do usuário logado
 */
export function useOrcamentos(filters: OrcamentoFilters = {}) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOrcamentos() {
      try {
        const supabase = createClient();
        
        let query = supabase
          .from('noro_orcamentos')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtros opcionais (RLS já cuida do tenant_id)
        if (filters.search) {
          query = query.or(`numero_orcamento.ilike.%${filters.search}%,titulo.ilike.%${filters.search}%`);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.prioridade) {
          query = query.eq('prioridade', filters.prioridade);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setOrcamentos(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrcamentos();
  }, [filters.search, filters.status, filters.prioridade]);

  return { orcamentos, isLoading, error };
}

/**
 * Hook para buscar um orçamento específico por ID
 * RLS valida se o orçamento pertence ao tenant do usuário
 */
export function useOrcamento(orcamentoId: string | null) {
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orcamentoId) {
      setIsLoading(false);
      return;
    }

    async function fetchOrcamento() {
      try {
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('noro_orcamentos')
          .select('*')
          .eq('id', orcamentoId)
          .single();

        if (fetchError) throw fetchError;
        setOrcamento(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrcamento();
  }, [orcamentoId]);

  return { orcamento, isLoading, error };
}

/**
 * Hook para estatísticas dos orçamentos
 */
export function useOrcamentosStats() {
  const [stats, setStats] = useState({
    total: 0,
    rascunho: 0,
    enviado: 0,
    visualizado: 0,
    aprovado: 0,
    recusado: 0,
    expirado: 0,
    valor_total: 0,
    taxa_conversao: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        
        // RLS já filtra por tenant
        const { data: allOrcamentos } = await supabase
          .from('noro_orcamentos')
          .select('status, valor_total');

        if (allOrcamentos) {
          const total = allOrcamentos.length;
          const rascunho = allOrcamentos.filter((o: any) => o.status === 'rascunho').length;
          const enviado = allOrcamentos.filter((o: any) => o.status === 'enviado').length;
          const visualizado = allOrcamentos.filter((o: any) => o.status === 'visualizado').length;
          const aprovado = allOrcamentos.filter((o: any) => o.status === 'aprovado').length;
          const recusado = allOrcamentos.filter((o: any) => o.status === 'recusado').length;
          const expirado = allOrcamentos.filter((o: any) => o.status === 'expirado').length;
          
          const valor_total = allOrcamentos.reduce((sum: number, o: any) => sum + (o.valor_total || 0), 0);
          const taxa_conversao = enviado > 0 ? (aprovado / enviado) * 100 : 0;

          setStats({ 
            total, 
            rascunho, 
            enviado, 
            visualizado, 
            aprovado, 
            recusado,
            expirado,
            valor_total,
            taxa_conversao: Math.round(taxa_conversao * 100) / 100
          });
        }
      } catch (err) {
        console.error('Error fetching orcamento stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
