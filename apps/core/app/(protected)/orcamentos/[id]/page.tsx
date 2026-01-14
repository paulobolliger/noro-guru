// app/admin/(protected)/orcamentos/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import OrcamentoDetalhes from '@/components/admin/orcamentos/OrcamentoDetalhes';
import { getOrcamentoById } from '../orcamentos-actions'; 
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface PageProps {
  params: { id: string };
}

// Configuração de metadados
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getOrcamentoById(params.id);

  if (!result.success || !result.data) {
    return { title: 'Orçamento não encontrado' };
  }

  return {
    title: `Orçamento ${result.data.numero_orcamento || result.data.titulo} | Noro`,
    description: `Detalhes e status do orçamento ${result.data.titulo}.`,
  };
}

export default async function OrcamentoDetalhesPage({ params }: PageProps) {
  const { id } = params;

  // Busca o orçamento
  const orcamentoResult = await getOrcamentoById(id);

  if (!orcamentoResult.success || !orcamentoResult.data) {
    notFound();
  }

  // Buscar dados do lead se existir lead_id
  let leadData = null;
  if (orcamentoResult.data.lead_id) {
    const supabase = createServerSupabaseClient();
    const { data: lead } = await supabase
      .from('noro_leads')
      .select('id, nome, email')
      .eq('id', orcamentoResult.data.lead_id)
      .single();

    if (lead) {
      leadData = lead;
    }
  }

  const orcamentoComLead = {
    ...orcamentoResult.data,
    lead: leadData || null
  };

  return <OrcamentoDetalhes orcamento={orcamentoComLead} />;
}