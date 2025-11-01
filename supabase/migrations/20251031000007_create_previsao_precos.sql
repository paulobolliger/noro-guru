-- Função para calcular tendências e previsões de preços
CREATE OR REPLACE FUNCTION calcular_previsoes_precos(
  p_tenant_id uuid,
  data_inicial timestamptz,
  data_final timestamptz,
  periodos_futuros int DEFAULT 12  -- Número de períodos para prever (default 12 meses)
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  resultado jsonb;
BEGIN
  WITH dados_historicos AS (
    -- Agrega dados por mês para análise de tendência
    SELECT 
      date_trunc('month', p.data_atualizacao) as periodo,
      avg(p.custo) as custo_medio,
      avg(p.preco_venda) as preco_medio,
      avg(p.markup) as markup_medio,
      avg((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_media,
      count(*) as total_produtos
    FROM produtos p
    WHERE p.tenant_id = p_tenant_id
    AND p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY date_trunc('month', p.data_atualizacao)
    ORDER BY periodo
  ),
  analise_tendencia AS (
    -- Calcula coeficientes de tendência linear
    SELECT 
      regr_slope(custo_medio, extract(epoch from periodo)) as tendencia_custo,
      regr_slope(preco_medio, extract(epoch from periodo)) as tendencia_preco,
      regr_slope(markup_medio, extract(epoch from periodo)) as tendencia_markup,
      regr_slope(margem_media, extract(epoch from periodo)) as tendencia_margem,
      avg(custo_medio) as media_custo,
      avg(preco_medio) as media_preco,
      avg(markup_medio) as media_markup,
      avg(margem_media) as media_margem,
      stddev(custo_medio) as desvio_custo,
      stddev(preco_medio) as desvio_preco,
      stddev(markup_medio) as desvio_markup,
      stddev(margem_media) as desvio_margem
    FROM dados_historicos
  ),
  previsoes_mensais AS (
    -- Gera previsões para os próximos períodos
    SELECT 
      (data_final + (interval '1 month' * n))::date as periodo_previsto,
      (
        SELECT media_custo + (tendencia_custo * (n * 2629746))  -- segundos em um mês
        FROM analise_tendencia
      ) as custo_previsto,
      (
        SELECT media_preco + (tendencia_preco * (n * 2629746))
        FROM analise_tendencia
      ) as preco_previsto,
      (
        SELECT media_markup + (tendencia_markup * (n * 2629746))
        FROM analise_tendencia
      ) as markup_previsto,
      (
        SELECT media_margem + (tendencia_margem * (n * 2629746))
        FROM analise_tendencia
      ) as margem_prevista
    FROM generate_series(1, periodos_futuros) n
  ),
  categorias_tendencia AS (
    -- Analisa tendências por categoria
    SELECT 
      p.categoria,
      regr_slope(p.preco_venda, extract(epoch from p.data_atualizacao)) as tendencia_preco,
      regr_slope(p.markup, extract(epoch from p.data_atualizacao)) as tendencia_markup,
      regr_slope((p.preco_venda - p.custo) / p.preco_venda * 100, 
                 extract(epoch from p.data_atualizacao)) as tendencia_margem,
      avg(p.preco_venda) as preco_medio,
      avg(p.markup) as markup_medio,
      avg((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_media
    FROM produtos p
    WHERE p.tenant_id = p_tenant_id
    AND p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY p.categoria
    HAVING count(*) > 5  -- Apenas categorias com dados suficientes
  ),
  sazonalidade AS (
    -- Identifica padrões sazonais
    SELECT 
      extract(month from p.data_atualizacao) as mes,
      avg(p.preco_venda) / (
        SELECT avg(preco_venda) 
        FROM produtos 
        WHERE tenant_id = p_tenant_id
        AND data_atualizacao BETWEEN data_inicial AND data_final
      ) as indice_sazonal_preco,
      avg(p.markup) / (
        SELECT avg(markup) 
        FROM produtos 
        WHERE tenant_id = p_tenant_id
        AND data_atualizacao BETWEEN data_inicial AND data_final
      ) as indice_sazonal_markup
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY extract(month from p.data_atualizacao)
  )
  SELECT jsonb_build_object(
    'tendencias_gerais', (
      SELECT jsonb_build_object(
        'custos', jsonb_build_object(
          'tendencia', tendencia_custo,
          'media', media_custo,
          'desvio', desvio_custo
        ),
        'precos', jsonb_build_object(
          'tendencia', tendencia_preco,
          'media', media_preco,
          'desvio', desvio_preco
        ),
        'markup', jsonb_build_object(
          'tendencia', tendencia_markup,
          'media', media_markup,
          'desvio', desvio_markup
        ),
        'margem', jsonb_build_object(
          'tendencia', tendencia_margem,
          'media', media_margem,
          'desvio', desvio_margem
        )
      )
      FROM analise_tendencia
    ),
    'previsoes', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'periodo', to_char(periodo_previsto, 'YYYY-MM-DD'),
          'custo', round(custo_previsto::numeric, 2),
          'preco', round(preco_previsto::numeric, 2),
          'markup', round(markup_previsto::numeric, 2),
          'margem', round(margem_prevista::numeric, 2)
        )
        ORDER BY periodo_previsto
      )
      FROM previsoes_mensais
    ),
    'tendencias_categorias', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'categoria', categoria,
          'tendencia_preco', round(tendencia_preco::numeric, 4),
          'tendencia_markup', round(tendencia_markup::numeric, 4),
          'tendencia_margem', round(tendencia_margem::numeric, 4),
          'preco_medio', round(preco_medio::numeric, 2),
          'markup_medio', round(markup_medio::numeric, 2),
          'margem_media', round(margem_media::numeric, 2)
        )
        ORDER BY tendencia_margem DESC
      )
      FROM categorias_tendencia
    ),
    'sazonalidade', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'mes', mes,
          'indice_preco', round(indice_sazonal_preco::numeric, 4),
          'indice_markup', round(indice_sazonal_markup::numeric, 4)
        )
        ORDER BY mes
      )
      FROM sazonalidade
    ),
    'metricas_confianca', jsonb_build_object(
      'periodo_analise', jsonb_build_object(
        'inicio', data_inicial,
        'fim', data_final
      ),
      'total_registros', (
        SELECT count(*) 
        FROM produtos 
        WHERE tenant_id = p_tenant_id
        AND data_atualizacao BETWEEN data_inicial AND data_final
      ),
      'categorias_analisadas', (
        SELECT count(*) 
        FROM categorias_tendencia
      )
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$;