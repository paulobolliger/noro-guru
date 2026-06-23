'use server';
import { createDatabaseClient } from "@noro/db";

export async function listAllCustomDomains() {
  const { client, close } = createDatabaseClient();
  try {
    // 1. Fetch all domains
    const domains = await client`
      SELECT *
      FROM sites.domains
      ORDER BY created_at DESC
    `;

    if (!domains || !domains.length) return [];

    // 2. Fetch related company names (Application-side Join)
    const tenantIds = Array.from(new Set(domains.map((d: any) => d.tenant_id)));
    
    const companyMap = new Map();
    if (tenantIds.length > 0) {
      const companies = await client`
        SELECT tenant_id, nome_empresa
        FROM sites.empresa
        WHERE tenant_id IN ${client(tenantIds)}
      `;
      companies?.forEach((c: any) => companyMap.set(c.tenant_id, c.nome_empresa));
    }

    return domains.map((d: any) => ({
      id: d.id,
      domain: d.domain,
      status: d.status,
      verified: d.verified,
      tenant_name: companyMap.get(d.tenant_id) || 'N/A', 
      tenant_id: d.tenant_id,
      created_at: d.created_at
    }));
  } catch (error) {
    console.error("Error fetching custom domains:", error);
    return [];
  } finally {
    await close();
  }
}
