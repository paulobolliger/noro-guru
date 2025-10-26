// app/admin/(protected)/orcamentos/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import OrcamentoDetalhes from "@/components/admin/orcamentos/OrcamentoDetalhes";
import { getOrcamentoById } from '../orcamentos-actions'; 
import { createServerSupabaseClient } from "@lib/supabase/server";

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
  
  // Para fins de demonstração, cria um objeto simulado para o lead (cliente)
  // Em um projeto real, você faria um JOIN na Server Action.
  const orcamentoComLead = {
      ...orcamentoResult.data,
      lead: { 
          id: orcamentoResult.data.lead_id || '', 
          nome: orcamentoResult.data.lead_id ? `Cliente ID ${orcamentoResult.data.lead_id.substring(0, 8)}` : 'Cliente Não Vinculado'
      }
  };


  return <OrcamentoDetalhes orcamento={orcamentoComLead} />;
}