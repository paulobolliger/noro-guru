import { getTickets } from "./actions";
import { getUserTenants } from "../tenants/actions";
import SupportPageClient from "./SupportPageClient";

export default async function SupportPage() {
  console.log('[SupportPage] Loading...');
  
  const [tickets, tenants] = await Promise.all([
    getTickets(),
    getUserTenants()
  ]);

  console.log('[SupportPage] Loaded:', { 
    ticketsCount: tickets?.length || 0, 
    tenantsCount: tenants?.length || 0,
    tenants 
  });

  return (
    <SupportPageClient 
      tickets={tickets || []} 
      tenants={tenants || []}
      activeTenantId={tenants?.[0]?.id}
    />
  );
}
