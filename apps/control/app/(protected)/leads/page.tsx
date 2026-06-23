import { createDatabaseClient } from "@noro/db";
import LeadsClientPage from "@/components/LeadsClientPage";

export const dynamic = 'force-dynamic';

async function fetchLeads(): Promise<any[]> {
    const { client, close } = createDatabaseClient();
    try {
        const data = await client`
            SELECT *
            FROM platform_crm.leads
            ORDER BY created_at DESC
            LIMIT 200
        `;
        return data || [];
    } catch (err) {
        console.error('Erro ao buscar leads:', err);
        return [];
    } finally {
        await close();
    }
}

export default async function LeadsPage() {
    const leads = await fetchLeads();
    return <LeadsClientPage leads={leads} />;
}
