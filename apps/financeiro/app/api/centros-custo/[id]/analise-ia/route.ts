import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { FinAnaliseIA } from '@/types/financeiro';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2'; // NORO

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    console.log('🤖 Gerando análise IA para centro de custo:', id);

    // Buscar centro de custo e rentabilidade
    const { data: centroCusto } = await supabase
      .from('fin_centros_custo')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .single();

    if (!centroCusto) {
      return NextResponse.json({ error: 'Centro de custo não encontrado' }, { status: 404 });
    }

    const { data: rentabilidade } = await supabase
      .from('vw_rentabilidade_centros_custo')
      .select('*')
      .eq('id', id)
      .single();

    // Buscar despesas alocadas com categorias
    const { data: alocacoesDespesas } = await supabase
      .from('fin_alocacoes')
      .select(`
        *,
        despesa:fin_despesas(*),
        categoria:fin_categorias(nome)
      `)
      .eq('centro_custo_id', id)
      .not('despesa_id', 'is', null);

    // Buscar projetos similares para comparação
    const { data: projetosSimilares } = await supabase
      .from('vw_rentabilidade_centros_custo')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .eq('tipo', centroCusto.tipo)
      .neq('id', id)
      .limit(10);

    // ====================
    // ANÁLISE DE ALERTAS
    // ====================
    const alertas: any[] = [];

    // Alerta 1: Margem baixa
    if (rentabilidade && rentabilidade.margem_percentual < centroCusto.meta_margem_percentual) {
      const diferenca = centroCusto.meta_margem_percentual - rentabilidade.margem_percentual;
      alertas.push({
        tipo: 'margem_baixa',
        severidade: diferenca > 5 ? 'alta' : diferenca > 3 ? 'media' : 'baixa',
        titulo: 'Margem Abaixo da Meta',
        descricao: `A margem atual de ${rentabilidade.margem_percentual.toFixed(1)}% está ${diferenca.toFixed(1)} pontos percentuais abaixo da meta de ${centroCusto.meta_margem_percentual}%.`,
        valor_impacto: (rentabilidade.receitas_total * (diferenca / 100)),
      });
    }

    // Alerta 2: Orçamento estourado
    if (rentabilidade && rentabilidade.percentual_orcamento_utilizado > 100) {
      const percentualExtra = rentabilidade.percentual_orcamento_utilizado - 100;
      alertas.push({
        tipo: 'orcamento_estourado',
        severidade: percentualExtra > 20 ? 'critica' : percentualExtra > 10 ? 'alta' : 'media',
        titulo: 'Orçamento Ultrapassado',
        descricao: `As despesas ultrapassaram o orçamento previsto em ${percentualExtra.toFixed(1)}% (${Math.abs(rentabilidade.saldo_orcamento).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`,
        valor_impacto: Math.abs(rentabilidade.saldo_orcamento),
      });
    }

    // Alerta 3: Meta de receita não atingida
    if (centroCusto.meta_receita && rentabilidade && rentabilidade.receitas_total < centroCusto.meta_receita) {
      const percentualFaltante = ((centroCusto.meta_receita - rentabilidade.receitas_total) / centroCusto.meta_receita) * 100;
      alertas.push({
        tipo: 'meta_nao_atingida',
        severidade: percentualFaltante > 20 ? 'alta' : percentualFaltante > 10 ? 'media' : 'baixa',
        titulo: 'Meta de Receita Não Atingida',
        descricao: `Faltam ${percentualFaltante.toFixed(1)}% para atingir a meta de receita de ${centroCusto.meta_receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
        valor_impacto: centroCusto.meta_receita - rentabilidade.receitas_total,
      });
    }

    // Alerta 4: Categoria de custo alto
    if (alocacoesDespesas && alocacoesDespesas.length > 0) {
      const custosPorCategoria = new Map<string, number>();
      alocacoesDespesas.forEach((aloc: any) => {
        const cat = aloc.categoria?.nome || 'Sem categoria';
        custosPorCategoria.set(cat, (custosPorCategoria.get(cat) || 0) + aloc.valor_alocado);
      });

      const totalDespesas = Array.from(custosPorCategoria.values()).reduce((a, b) => a + b, 0);
      custosPorCategoria.forEach((valor, categoria) => {
        const percentual = (valor / totalDespesas) * 100;
        if (percentual > 40) {
          alertas.push({
            tipo: 'custo_alto',
            severidade: percentual > 60 ? 'alta' : 'media',
            titulo: `Categoria "${categoria}" com Custo Elevado`,
            descricao: `A categoria "${categoria}" representa ${percentual.toFixed(1)}% do total de despesas (${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`,
            valor_impacto: valor,
          });
        }
      });
    }

    // ====================
    // INSIGHTS
    // ====================
    const insights: any[] = [];

    // Insight 1: Análise de fornecedores (simulado - baseado em categorias)
    if (alocacoesDespesas && alocacoesDespesas.length > 0) {
      const despesasOrdenadas = [...alocacoesDespesas].sort((a, b) => b.valor_alocado - a.valor_alocado);
      const top3Despesas = despesasOrdenadas.slice(0, 3);
      const valorTop3 = top3Despesas.reduce((sum, d) => sum + d.valor_alocado, 0);
      const percentualTop3 = rentabilidade ? (valorTop3 / rentabilidade.despesas_total) * 100 : 0;

      if (percentualTop3 > 50) {
        insights.push({
          tipo: 'fornecedor',
          titulo: 'Concentração de Despesas',
          descricao: `As 3 maiores despesas representam ${percentualTop3.toFixed(1)}% do total. Considere negociar melhores condições ou buscar alternativas.`,
          recomendacao: 'Revise contratos com os principais fornecedores e busque cotações alternativas para reduzir custos.',
        });
      }
    }

    // Insight 2: Sazonalidade (baseado em datas)
    const dataInicio = new Date(centroCusto.data_inicio);
    const mes = dataInicio.getMonth();
    if ([11, 0, 1, 6, 7].includes(mes)) { // Dez, Jan, Fev, Jul, Ago
      insights.push({
        tipo: 'sazonalidade',
        titulo: 'Período de Alta Temporada',
        descricao: 'Este projeto está em período de alta temporada turística. Custos operacionais tendem a ser mais elevados.',
        recomendacao: 'Antecipe reservas e negocie preços fixos com fornecedores para evitar aumentos sazonais.',
      });
    }

    // Insight 3: Comparação com projetos similares
    if (projetosSimilares && projetosSimilares.length > 0 && rentabilidade) {
      const mediaMargem = projetosSimilares.reduce((sum, p) => sum + (p.margem_percentual || 0), 0) / projetosSimilares.length;
      const melhorMargem = Math.max(...projetosSimilares.map(p => p.margem_percentual || 0));
      
      if (rentabilidade.margem_percentual < mediaMargem) {
        insights.push({
          tipo: 'categoria',
          titulo: 'Margem Abaixo da Média do Tipo',
          descricao: `Projetos similares do tipo "${centroCusto.tipo}" têm margem média de ${mediaMargem.toFixed(1)}%, enquanto este projeto está em ${rentabilidade.margem_percentual.toFixed(1)}%.`,
          recomendacao: 'Analise os custos detalhadamente e identifique oportunidades de otimização para se aproximar da média do mercado.',
        });
      }
    }

    // Insight 4: Análise de câmbio (simulado - baseado em moeda e marca)
    if (centroCusto.moeda !== 'BRL' || centroCusto.marca === 'nomade') {
      insights.push({
        tipo: 'cambio',
        titulo: 'Exposição Cambial',
        descricao: 'Este projeto envolve operações internacionais. Variações cambiais podem impactar significativamente a margem.',
        recomendacao: 'Considere usar hedge cambial ou fixar taxas antecipadamente para proteger a margem de lucro.',
      });
    }

    // ====================
    // PREVISÕES
    // ====================
    let previsaoMargemFinal = rentabilidade?.margem_percentual || 0;
    let confiancaPrevisao = 70;
    let riscoNivel: 'baixo' | 'medio' | 'alto' = 'medio';

    // Ajustar previsão baseado em status
    if (centroCusto.status === 'planejamento') {
      previsaoMargemFinal = centroCusto.meta_margem_percentual * 0.9; // 90% da meta
      confiancaPrevisao = 50;
      riscoNivel = 'medio';
    } else if (centroCusto.status === 'ativo') {
      if (rentabilidade && rentabilidade.margem_percentual < centroCusto.meta_margem_percentual) {
        previsaoMargemFinal = rentabilidade.margem_percentual * 0.95; // Tendência de piora
        riscoNivel = 'alto';
      } else {
        previsaoMargemFinal = rentabilidade?.margem_percentual || 0;
        riscoNivel = 'baixo';
      }
      confiancaPrevisao = 85;
    } else if (centroCusto.status === 'concluido') {
      previsaoMargemFinal = rentabilidade?.margem_percentual || 0;
      confiancaPrevisao = 100;
      riscoNivel = 'baixo';
    }

    // Ajustar risco baseado em orçamento
    if (rentabilidade && rentabilidade.percentual_orcamento_utilizado > 90) {
      riscoNivel = riscoNivel === 'baixo' ? 'medio' : 'alto';
    }

    // ====================
    // COMPARAÇÕES
    // ====================
    let comparacaoProjetos = undefined;
    if (projetosSimilares && projetosSimilares.length > 0 && rentabilidade) {
      const mediaMargem = projetosSimilares.reduce((sum, p) => sum + (p.margem_percentual || 0), 0) / projetosSimilares.length;
      const melhorMargem = Math.max(...projetosSimilares.map(p => p.margem_percentual || 0));
      const ranking = projetosSimilares.filter(p => (p.margem_percentual || 0) > rentabilidade.margem_percentual).length + 1;

      comparacaoProjetos = {
        media_margem: mediaMargem,
        melhor_margem: melhorMargem,
        posicao_ranking: ranking,
      };
    }

    // ====================
    // MONTAR RESPOSTA
    // ====================
    const analise: FinAnaliseIA = {
      centro_custo_id: id,
      data_analise: new Date().toISOString(),
      alertas: alertas.sort((a, b) => {
        const severidadeOrder = { critica: 4, alta: 3, media: 2, baixa: 1 };
        return (severidadeOrder[b.severidade as keyof typeof severidadeOrder] || 0) - 
               (severidadeOrder[a.severidade as keyof typeof severidadeOrder] || 0);
      }),
      insights,
      previsao_margem_final: previsaoMargemFinal,
      confianca_previsao: confiancaPrevisao,
      risco_nivel: riscoNivel,
      comparacao_projetos_similares: comparacaoProjetos,
    };

    console.log('✅ Análise IA gerada:', {
      alertas: analise.alertas.length,
      insights: analise.insights.length,
      risco: riscoNivel,
    });

    return NextResponse.json(analise);
  } catch (error: any) {
    console.error('❌ Erro ao gerar análise IA:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
