// apps/control/hooks/useTenant.ts
// Hook para obter o tenant atual do usuário logado
// Confia no RLS - não precisa passar tenant_id manualmente nas queries!

"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  billing_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserTenantRole {
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'readonly';
  created_at: string;
  tenant?: Tenant;
}

/**
 * Hook que retorna os tenants aos quais o usuário tem acesso
 * RLS garante que só vemos tenants onde temos vínculo em cp.user_tenant_roles
 */
export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTenants() {
      try {
        const supabase = createClient();
        
        // Busca user_tenant_roles com tenant expandido
        // RLS já filtra para mostrar apenas tenants do usuário logado
        const { data, error: fetchError } = await supabase
          .from('user_tenant_roles')
          .select(`
            tenant_id,
            role,
            tenant:tenants(*)
          `)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (fetchError) throw fetchError;

        // Extrai os tenants únicos
        const uniqueTenants = data
          ?.map((utr: any) => utr.tenant)
          .filter((t: any) => t !== null) as Tenant[];

        setTenants(uniqueTenants || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenants();
  }, []);

  return { tenants, isLoading, error };
}

/**
 * Hook que retorna o tenant ativo
 * Por padrão, retorna o primeiro tenant do usuário
 * TODO: Implementar persistência em localStorage para trocar tenant
 */
export function useCurrentTenant() {
  const { tenants, isLoading, error } = useTenants();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (!isLoading && tenants.length > 0) {
      // TODO: Verificar localStorage para tenant salvo
      // Por enquanto, usa o primeiro tenant
      setCurrentTenant(tenants[0]);
    }
  }, [tenants, isLoading]);

  return { 
    currentTenant, 
    tenants,
    isLoading, 
    error,
    setCurrentTenant 
  };
}

/**
 * Hook que retorna apenas o tenant_id do tenant ativo
 * Útil para queries que precisam do ID
 */
export function useTenantId() {
  const { currentTenant, isLoading } = useCurrentTenant();
  return { 
    tenantId: currentTenant?.id || null, 
    isLoading 
  };
}
