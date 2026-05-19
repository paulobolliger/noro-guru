// app/admin/(protected)/leads/page.tsx
import { getSupabaseAdmin } from "@lib/supabase/admin";
import type { Database } from "@noro-types/supabase";
import { format } from 'date-fns';
import LeadsClientPage from "@/components/LeadsClientPage"; // Vamos usar um componente de cliente

type Lead = Database['public']['Tables']['noro_leads']['Row'];

async function fetchLeads(): Promise<Lead[]> {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        const { data, error } = await supabaseAdmin
            .from('noro_leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar leads:', error);
            throw error;
        }

        return data || [];
    } catch (err) {
        // Retorna um array vazio em caso de erro para não quebrar a página
        return [];
    }
}

export default async function LeadsPage() {
    const leads = await fetchLeads();

    // Passa os dados para um componente de cliente que irá gerir o estado da visualização
    return <LeadsClientPage leads={leads} />;
}

