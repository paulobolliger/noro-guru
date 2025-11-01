-- Função para obter métricas comparativas de preços
CREATE OR REPLACE FUNCTION obter_metricas_comparativas(
  data_inicial_atual timestamptz,
  data_final_atual timestamptz,
  data_inicial_anterior timestamptz,
  data_final_anterior timestamptz
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  resultado jsonb;
  metricas_atual jsonb;
  metricas_anterior jsonb;
BEGIN
  -- Calcula métricas do período atual
  WITH dados_periodo AS (
    SELECT 
      p.custo,
      p.preco_venda,
      p.markup,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem,
      p.categoria,
      p.data_atualizacao,
      r.id as regra_id,
      r.ativo as regra_ativa
    FROM produtos p
    LEFT JOIN regras_preco r ON r.categoria = p.categoria
    WHERE p.data_atualizacao BETWEEN data_inicial_atual AND data_final_atual
  ),
  evolucao AS (
    SELECT 
      date_trunc('day', data_atualizacao) as data,
      avg(margem) as margem,
      avg(markup) as markup
    FROM dados_periodo
    GROUP BY date_trunc('day', data_atualizacao)
    ORDER BY data
  ),
  distribuicao AS (
    SELECT 
      CASE 
        WHEN margem < 0 THEN 'Negativa'
        WHEN margem BETWEEN 0 AND 10 THEN '0-10%'
        WHEN margem BETWEEN 10 AND 20 THEN '10-20%'
        WHEN margem BETWEEN 20 AND 30 THEN '20-30%'
        WHEN margem BETWEEN 30 AND 40 THEN '30-40%'
        ELSE '40%+'
      END as faixa,
      count(*) as quantidade,
      (count(*)::float / (SELECT count(*) FROM dados_periodo) * 100) as percentual
    FROM dados_periodo
    GROUP BY 1
    ORDER BY 1
  )
  SELECT jsonb_build_object(
    'margemMedia', (SELECT avg(margem) FROM dados_periodo),
    'markupMedio', (SELECT avg(markup) FROM dados_periodo),
    'variacaoCustos', (
      SELECT ((max(custo) - min(custo)) / min(custo) * 100)
      FROM dados_periodo
    ),
    'variacaoPrecos', (
      SELECT ((max(preco_venda) - min(preco_venda)) / min(preco_venda) * 100)
      FROM dados_periodo
    ),
    'efetividadeRegras', (
      SELECT (count(*) FILTER (WHERE regra_ativa) * 100.0 / nullif(count(*), 0))
      FROM dados_periodo
      WHERE regra_id IS NOT NULL
    ),
    'distribuicaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'faixa', faixa,
          'quantidade', quantidade,
          'percentual', percentual
        )
      )
      FROM distribuicao
    ),
    'evolucaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'data', to_char(data, 'DD/MM/YYYY'),
          'margem', round(margem::numeric, 2),
          'markup', round(markup::numeric, 2)
        )
      )
      FROM evolucao
    )
  ) INTO metricas_atual;

  -- Calcula métricas do período anterior
  WITH dados_periodo AS (
    SELECT 
      p.custo,
      p.preco_venda,
      p.markup,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem,
      p.categoria,
      p.data_atualizacao,
      r.id as regra_id,
      r.ativo as regra_ativa
    FROM produtos p
    LEFT JOIN regras_preco r ON r.categoria = p.categoria
    WHERE p.data_atualizacao BETWEEN data_inicial_anterior AND data_final_anterior
  ),
  evolucao AS (
    SELECT 
      date_trunc('day', data_atualizacao) as data,
      avg(margem) as margem,
      avg(markup) as markup
    FROM dados_periodo
    GROUP BY date_trunc('day', data_atualizacao)
    ORDER BY data
  ),
  distribuicao AS (
    SELECT 
      CASE 
        WHEN margem < 0 THEN 'Negativa'
        WHEN margem BETWEEN 0 AND 10 THEN '0-10%'
        WHEN margem BETWEEN 10 AND 20 THEN '10-20%'
        WHEN margem BETWEEN 20 AND 30 THEN '20-30%'
        WHEN margem BETWEEN 30 AND 40 THEN '30-40%'
        ELSE '40%+'
      END as faixa,
      count(*) as quantidade,
      (count(*)::float / (SELECT count(*) FROM dados_periodo) * 100) as percentual
    FROM dados_periodo
    GROUP BY 1
    ORDER BY 1
  )
  SELECT jsonb_build_object(
    'margemMedia', (SELECT avg(margem) FROM dados_periodo),
    'markupMedio', (SELECT avg(markup) FROM dados_periodo),
    'variacaoCustos', (
      SELECT ((max(custo) - min(custo)) / min(custo) * 100)
      FROM dados_periodo
    ),
    'variacaoPrecos', (
      SELECT ((max(preco_venda) - min(preco_venda)) / min(preco_venda) * 100)
      FROM dados_periodo
    ),
    'efetividadeRegras', (
      SELECT (count(*) FILTER (WHERE regra_ativa) * 100.0 / nullif(count(*), 0))
      FROM dados_periodo
      WHERE regra_id IS NOT NULL
    ),
    'distribuicaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'faixa', faixa,
          'quantidade', quantidade,
          'percentual', percentual
        )
      )
      FROM distribuicao
    ),
    'evolucaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'data', to_char(data, 'DD/MM/YYYY'),
          'margem', round(margem::numeric, 2),
          'markup', round(markup::numeric, 2)
        )
      )
      FROM evolucao
    )
  ) INTO metricas_anterior;

  -- Monta o resultado final
  SELECT jsonb_build_object(
    'periodoAtual', jsonb_build_object(
      'dataInicial', data_inicial_atual,
      'dataFinal', data_final_atual,
      'metricas', metricas_atual
    ),
    'periodoAnterior', jsonb_build_object(
      'dataInicial', data_inicial_anterior,
      'dataFinal', data_final_anterior,
      'metricas', metricas_anterior
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$;