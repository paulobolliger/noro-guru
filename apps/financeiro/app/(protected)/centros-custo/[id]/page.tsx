import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CentroCustoDetalhesClient } from './centro-custo-detalhes-client';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2'; // NORO

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: centroCusto } = await supabase
    .from('fin_centros_custo')
    .select('nome')
    .eq('id', params.id)
    .eq('tenant_id', TENANT_ID)
    .single();

  return {
    title: centroCusto ? `${centroCusto.nome} | Centro de Custos` : 'Centro de Custos',
    description: 'Análise detalhada de rentabilidade',
  };
}

export default async function CentroCustoDetalhesPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { id } = params;

  // Buscar centro de custo
  const { data: centroCusto, error } = await supabase
    .from('fin_centros_custo')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', TENANT_ID)
    .single();

  if (error || !centroCusto) {
    notFound();
  }

  // Buscar rentabilidade via view
  const { data: rentabilidade } = await supabase
    .from('vw_rentabilidade_centros_custo')
    .select('*')
    .eq('id', id)
    .single();

  // Buscar alocações com receitas
  const { data: alocacoesReceitas } = await supabase
    .from('fin_alocacoes')
    .select(`
      *,
      receita:fin_receitas(*)
    `)
    .eq('centro_custo_id', id)
    .eq('tenant_id', TENANT_ID)
    .not('receita_id', 'is', null)
    .order('created_at', { ascending: false });

  // Buscar alocações com despesas
  const { data: alocacoesDespesas } = await supabase
    .from('fin_alocacoes')
    .select(`
      *,
      despesa:fin_despesas(*),
      categoria:fin_categorias(nome)
    `)
    .eq('centro_custo_id', id)
    .eq('tenant_id', TENANT_ID)
    .not('despesa_id', 'is', null)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto p-6">
      <CentroCustoDetalhesClient
        centroCusto={centroCusto}
        rentabilidade={rentabilidade}
        alocacoesReceitas={alocacoesReceitas || []}
        alocacoesDespesas={alocacoesDespesas || []}
        tenantId={TENANT_ID}
      />
    </div>
  );
}
