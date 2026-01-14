import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import OrgsClientPage from "@/components/orgs/OrgsClientPage";

export default async function OrgsPage() {
  const supabase = createAdminSupabaseClient();

  // Get tenants
  const { data: tenantsData, error } = await supabase
    .schema('cp')
    .from('tenants')
    .select('id, name, slug, plan, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  const tenants = tenantsData || [];

  // Get API keys count per tenant
  const { data: apiKeysData } = await supabase
    .schema('cp')
    .from('api_keys')
    .select('tenant_id');

  const apiKeysByTenant = (apiKeysData || []).reduce((acc: Record<string, number>, key: any) => {
    acc[key.tenant_id] = (acc[key.tenant_id] || 0) + 1;
    return acc;
  }, {});

  // Enrich tenants with service info
  const enrichedTenants = tenants.map(t => ({
    ...t,
    apiKeysCount: apiKeysByTenant[t.id] || 0,
  }));

  const ativos = enrichedTenants.filter(t => (t.status || '').toLowerCase() === 'active').length;

  const planosCount = enrichedTenants.reduce((acc: Record<string, number>, t: any) => {
    const k = (t.plan || '—').toString();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return <OrgsClientPage tenants={enrichedTenants} ativos={ativos} planosCount={planosCount} />;
}
