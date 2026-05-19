import { getTickets } from "./actions";
import { getUserTenants } from "../tenants/actions";
import SupportPageClient from "./SupportPageClient";

export default async function SupportPage() {
  const [tickets, tenants] = await Promise.all([
    getTickets(),
    getUserTenants()
  ]);

  return (
    <SupportPageClient 
      tickets={tickets || []} 
      tenants={tenants || []}
      activeTenantId={tenants?.[0]?.id}
    />
  );
}
