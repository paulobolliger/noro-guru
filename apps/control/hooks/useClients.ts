// apps/control/hooks/useClients.ts
// Hooks para gerenciar clientes do tenant
// RLS garante isolamento - não precisa filtrar manualmente por tenant_id!

"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface Client {
  id: string;
  tenant_id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  status: string;
  tipo: string;
  segmento: string | null;
  nivel: string;
  total_viagens: number;
  total_gasto: number;
  ticket_medio: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFilters {
  search?: string;
  status?: string;
  nivel?: string;
  tipo?: string;
}

/**
 * Hook para buscar todos os clientes do tenant
 * RLS automaticamente filtra por tenant do usuário logado
 */
export function useClients(filters: ClientFilters = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const supabase = createClient();
        
        let query = supabase
          .from('noro_clientes')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtros opcionais (RLS já cuida do tenant_id)
        if (filters.search) {
          query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.nivel) {
          query = query.eq('nivel', filters.nivel);
        }
        if (filters.tipo) {
          query = query.eq('tipo', filters.tipo);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setClients(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, [filters.search, filters.status, filters.nivel, filters.tipo]);

  return { clients, isLoading, error };
}

/**
 * Hook para buscar um cliente específico por ID
 * RLS valida se o cliente pertence ao tenant do usuário
 */
export function useClient(clientId: string | null) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientId) {
      setIsLoading(false);
      return;
    }

    async function fetchClient() {
      try {
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('noro_clientes')
          .select('*')
          .eq('id', clientId)
          .single();

        if (fetchError) throw fetchError;
        setClient(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClient();
  }, [clientId]);

  return { client, isLoading, error };
}

/**
 * Hook para estatísticas dos clientes
 */
export function useClientsStats() {
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    por_nivel: {
      bronze: 0,
      prata: 0,
      ouro: 0,
      platina: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        
        // RLS já filtra por tenant
        const { data: allClients } = await supabase
          .from('noro_clientes')
          .select('status, nivel');

        if (allClients) {
          const total = allClients.length;
          const ativos = allClients.filter((c: any) => c.status === 'ativo').length;
          const inativos = allClients.filter((c: any) => c.status === 'inativo').length;
          
          const por_nivel = {
            bronze: allClients.filter((c: any) => c.nivel === 'bronze').length,
            prata: allClients.filter((c: any) => c.nivel === 'prata').length,
            ouro: allClients.filter((c: any) => c.nivel === 'ouro').length,
            platina: allClients.filter((c: any) => c.nivel === 'platina').length
          };

          setStats({ total, ativos, inativos, por_nivel });
        }
      } catch (err) {
        console.error('Error fetching client stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
