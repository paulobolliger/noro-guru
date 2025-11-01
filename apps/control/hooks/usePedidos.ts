// apps/control/hooks/usePedidos.ts
// Hooks para gerenciar pedidos do tenant
// RLS garante isolamento - não precisa filtrar manualmente por tenant_id!

"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface Pedido {
  id: string;
  tenant_id: string;
  numero_pedido: string;
  cliente_id: string;
  titulo: string;
  destinos: string[];
  data_viagem_inicio: string;
  data_viagem_fim: string;
  num_dias: number;
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  moeda: string;
  status: string;
  status_pagamento: string;
  created_at: string;
  updated_at: string;
}

export interface PedidoFilters {
  search?: string;
  status?: string;
  status_pagamento?: string;
}

/**
 * Hook para buscar todos os pedidos do tenant
 * RLS automaticamente filtra por tenant do usuário logado
 */
export function usePedidos(filters: PedidoFilters = {}) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const supabase = createClient();
        
        let query = supabase
          .from('noro_pedidos')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtros opcionais (RLS já cuida do tenant_id)
        if (filters.search) {
          query = query.or(`numero_pedido.ilike.%${filters.search}%,titulo.ilike.%${filters.search}%`);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.status_pagamento) {
          query = query.eq('status_pagamento', filters.status_pagamento);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setPedidos(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPedidos();
  }, [filters.search, filters.status, filters.status_pagamento]);

  return { pedidos, isLoading, error };
}

/**
 * Hook para buscar um pedido específico por ID
 * RLS valida se o pedido pertence ao tenant do usuário
 */
export function usePedido(pedidoId: string | null) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pedidoId) {
      setIsLoading(false);
      return;
    }

    async function fetchPedido() {
      try {
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('noro_pedidos')
          .select('*')
          .eq('id', pedidoId)
          .single();

        if (fetchError) throw fetchError;
        setPedido(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPedido();
  }, [pedidoId]);

  return { pedido, isLoading, error };
}

/**
 * Hook para estatísticas dos pedidos
 */
export function usePedidosStats() {
  const [stats, setStats] = useState({
    total: 0,
    confirmado: 0,
    em_andamento: 0,
    concluido: 0,
    cancelado: 0,
    valor_total: 0,
    valor_pago: 0,
    valor_pendente: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        
        // RLS já filtra por tenant
        const { data: allPedidos } = await supabase
          .from('noro_pedidos')
          .select('status, valor_total, valor_pago, valor_pendente');

        if (allPedidos) {
          const total = allPedidos.length;
          const confirmado = allPedidos.filter((p: any) => p.status === 'confirmado').length;
          const em_andamento = allPedidos.filter((p: any) => p.status === 'em_andamento').length;
          const concluido = allPedidos.filter((p: any) => p.status === 'concluido').length;
          const cancelado = allPedidos.filter((p: any) => p.status === 'cancelado').length;
          
          const valor_total = allPedidos.reduce((sum: number, p: any) => sum + (p.valor_total || 0), 0);
          const valor_pago = allPedidos.reduce((sum: number, p: any) => sum + (p.valor_pago || 0), 0);
          const valor_pendente = allPedidos.reduce((sum: number, p: any) => sum + (p.valor_pendente || 0), 0);

          setStats({ 
            total, 
            confirmado, 
            em_andamento, 
            concluido, 
            cancelado,
            valor_total,
            valor_pago,
            valor_pendente
          });
        }
      } catch (err) {
        console.error('Error fetching pedido stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
