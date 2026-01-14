import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: Get from context
import type { FinRelatorioRentabilidade } from '@noro/types/financeiro';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    console.log('📊 Calculando rentabilidade para centro de custo:', id);

    // 1. Buscar centro de custo
    const { data: centroCusto, error: errorCC } = await supabase
      .from('fin_centros_custo')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (errorCC || !centroCusto) {
      return NextResponse.json({ error: 'Centro de custo não encontrado' }, { status: 404 });
    }

    // 2. Buscar alocações com receitas
    const { data: alocacoesReceitas, error: errorAlocReceitas } = await supabase
      .from('fin_alocacoes')
      .select(`
        *,
        receita:fin_receitas(id, descricao, valor_brl, data_competencia, status)
      `)
      .eq('centro_custo_id', id)
      .eq('tenant_id', tenantId)
      .not('receita_id', 'is', null);

    // 3. Buscar alocações com despesas
    const { data: alocacoesDespesas, error: errorAlocDespesas } = await supabase
      .from('fin_alocacoes')
      .select(`
        *,
        despesa:fin_despesas(id, descricao, valor_brl, data_competencia, status, categoria_id),
        categoria:fin_despesas(categoria_id(nome))
      `)
      .eq('centro_custo_id', id)
      .eq('tenant_id', tenantId)
      .not('despesa_id', 'is', null);

    // 4. Calcular totais
    const receitasTotal = alocacoesReceitas?.reduce((sum, a) => sum + (a.valor_alocado || 0), 0) || 0;
    const despesasTotal = alocacoesDespesas?.reduce((sum, a) => sum + (a.valor_alocado || 0), 0) || 0;
    const margemLiquida = receitasTotal - despesasTotal;
    const margemPercentual = receitasTotal > 0 ? (margemLiquida / receitasTotal) * 100 : 0;
    
    const saldoOrcamento = centroCusto.orcamento_previsto - despesasTotal;
    const percentualOrcamentoUtilizado = centroCusto.orcamento_previsto > 0 
      ? (despesasTotal / centroCusto.orcamento_previsto) * 100 
      : 0;

    // 5. Montar receitas detalhadas
    const receitas = alocacoesReceitas?.map((a: any) => ({
      id: a.receita?.id || '',
      descricao: a.receita?.descricao || '',
      valor: a.receita?.valor_brl || 0,
      valor_alocado: a.valor_alocado,
      percentual_alocacao: a.percentual_alocacao,
      data_competencia: a.receita?.data_competencia || '',
      status: a.receita?.status || 'pendente',
    })) || [];

    // 6. Montar despesas detalhadas
    const despesas = alocacoesDespesas?.map((a: any) => ({
      id: a.despesa?.id || '',
      descricao: a.despesa?.descricao || '',
      valor: a.despesa?.valor_brl || 0,
      valor_alocado: a.valor_alocado,
      percentual_alocacao: a.percentual_alocacao,
      data_competencia: a.despesa?.data_competencia || '',
      status: a.despesa?.status || 'pendente',
      categoria: a.despesa?.categoria_id || null,
    })) || [];

    // 7. Composição de custos por categoria
    const custosPorCategoria = new Map<string, number>();
    despesas.forEach(d => {
      const cat = d.categoria || 'Sem categoria';
      custosPorCategoria.set(cat, (custosPorCategoria.get(cat) || 0) + d.valor_alocado);
    });

    const composicaoCustos = Array.from(custosPorCategoria.entries()).map(([categoria, valor]) => ({
      categoria,
      valor,
      percentual: despesasTotal > 0 ? (valor / despesasTotal) * 100 : 0,
    })).sort((a, b) => b.valor - a.valor);

    // 8. Maiores despesas
    const maioresDespesas = [...despesas]
      .sort((a, b) => b.valor_alocado - a.valor_alocado)
      .slice(0, 5)
      .map(d => ({
        descricao: d.descricao,
        valor: d.valor_alocado,
        categoria: d.categoria,
      }));

    // 9. Montar relatório
    const relatorio: FinRelatorioRentabilidade = {
      centro_custo: centroCusto,
      rentabilidade: {
        id: centroCusto.id,
        tenant_id: centroCusto.tenant_id,
        codigo: centroCusto.codigo,
        nome: centroCusto.nome,
        tipo: centroCusto.tipo,
        marca: centroCusto.marca,
        status: centroCusto.status,
        data_inicio: centroCusto.data_inicio,
        data_fim: centroCusto.data_fim,
        orcamento_previsto: centroCusto.orcamento_previsto,
        meta_margem_percentual: centroCusto.meta_margem_percentual,
        meta_receita: centroCusto.meta_receita,
        receitas_total: receitasTotal,
        despesas_total: despesasTotal,
        margem_liquida: margemLiquida,
        margem_percentual: margemPercentual,
        saldo_orcamento: saldoOrcamento,
        percentual_orcamento_utilizado: percentualOrcamentoUtilizado,
        qtd_receitas: receitas.length,
        qtd_despesas: despesas.length,
        created_at: centroCusto.created_at,
        updated_at: centroCusto.updated_at,
      },
      receitas,
      despesas,
      composicao_custos: composicaoCustos,
      maiores_despesas: maioresDespesas,
      comparativo_orcamento: {
        previsto: centroCusto.orcamento_previsto,
        realizado: despesasTotal,
        diferenca: saldoOrcamento,
        percentual_execucao: percentualOrcamentoUtilizado,
      },
      comparativo_meta: {
        meta_margem: centroCusto.meta_margem_percentual,
        margem_atual: margemPercentual,
        diferenca: margemPercentual - centroCusto.meta_margem_percentual,
        atingiu_meta: margemPercentual >= centroCusto.meta_margem_percentual,
      },
    };

    console.log('✅ Relatório de rentabilidade calculado:', {
      receitas: receitasTotal,
      despesas: despesasTotal,
      margem: margemPercentual.toFixed(2) + '%',
    });

    return NextResponse.json(relatorio);
  } catch (error: any) {
    console.error('❌ Erro ao calcular rentabilidade:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
