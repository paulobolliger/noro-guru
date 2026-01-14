'use server';
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function listAllCustomDomains() {
  const supabase = createAdminSupabaseClient();
  
  // 1. Fetch all domains
  const { data: domains, error } = await supabase
    .from('noro_domains')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
      console.error("Error fetching custom domains:", error);
      return [];
  }

  if (!domains.length) return [];

  // 2. Fetch related company names (Application-side Join)
  const tenantIds = Array.from(new Set(domains.map((d: any) => d.tenant_id)));
  
  const { data: companies } = await supabase
    .from('noro_empresa')
    .select('tenant_id, nome_empresa')
    .in('tenant_id', tenantIds);

  const companyMap = new Map(
      companies?.map((c: any) => [c.tenant_id, c.nome_empresa]) || []
  );

  return domains.map((d: any) => ({
      id: d.id,
      domain: d.domain,
      status: d.status,
      verified: d.verified,
      tenant_name: companyMap.get(d.tenant_id) || 'N/A', 
      tenant_id: d.tenant_id,
      created_at: d.created_at
  }));
}
