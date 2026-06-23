import { createDatabaseClient } from "@noro/db";
import OrgsClientPage from "@/components/orgs/OrgsClientPage";

export const dynamic = 'force-dynamic';

export default async function OrgsPage() {
  const { client, close } = createDatabaseClient();
  try {
    // Get tenants
    const tenantsData = await client`
      SELECT id, name, slug, plan, status, created_at
      FROM platform.tenants
      ORDER BY created_at DESC
      LIMIT 100
    `;

    // Get API keys count per tenant
    const apiKeysData = await client`
      SELECT tenant_id
      FROM platform.api_keys
    `;

    const apiKeysByTenant = (apiKeysData || []).reduce((acc: Record<string, number>, key: any) => {
      acc[key.tenant_id] = (acc[key.tenant_id] || 0) + 1;
      return acc;
    }, {});

    // Enrich tenants with service info
    const enrichedTenants = (tenantsData || []).map((t: any) => ({
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
  } finally {
    await close();
  }
}
