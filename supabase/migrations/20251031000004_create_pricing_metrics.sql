-- Função para calcular métricas de preços
CREATE OR REPLACE FUNCTION calcular_metricas_precos(
  IN p_tenant_id UUID,
  IN p_data_inicial DATE,
  IN p_data_final DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  periodo DATE,
  margem_media DECIMAL(10,2),
  markup_medio DECIMAL(10,2),
  margem_minima DECIMAL(10,2),
  margem_maxima DECIMAL(10,2),
  total_produtos INTEGER,
  regras_ativas INTEGER,
  distribuicao_regras JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH historico_precos AS (
    SELECT 
      DATE_TRUNC('day', created_at)::DATE as data,
      valor_custo,
      valor_venda,
      ((valor_venda - valor_custo) / valor_custo * 100) as margem
    FROM historico_preco
    WHERE tenant_id = p_tenant_id
    AND created_at BETWEEN p_data_inicial AND p_data_final
  ),
  metricas_diarias AS (
    SELECT 
      data,
      AVG(margem) as margem_media,
      MIN(margem) as margem_minima,
      MAX(margem) as margem_maxima,
      COUNT(DISTINCT produto_id) as total_produtos
    FROM historico_precos
    GROUP BY data
  ),
  regras_distribuicao AS (
    SELECT 
      tipo,
      COUNT(*) as quantidade,
      SUM(CASE 
        WHEN tipo_markup = 'percentual' THEN valor_markup 
        ELSE valor_markup / 100 
      END) as valor_total
    FROM regras_preco
    WHERE tenant_id = p_tenant_id
    AND ativo = true
    GROUP BY tipo
  )
  SELECT 
    h.data as periodo,
    ROUND(h.margem_media::DECIMAL(10,2), 2) as margem_media,
    ROUND((
      SELECT AVG(CASE 
        WHEN tipo_markup = 'percentual' THEN valor_markup 
        ELSE valor_markup / 100 
      END)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
      AND (data_inicio IS NULL OR data_inicio <= h.data)
      AND (data_fim IS NULL OR data_fim >= h.data)
    )::DECIMAL(10,2), 2) as markup_medio,
    ROUND(h.margem_minima::DECIMAL(10,2), 2) as margem_minima,
    ROUND(h.margem_maxima::DECIMAL(10,2), 2) as margem_maxima,
    h.total_produtos,
    (
      SELECT COUNT(*)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
    ) as regras_ativas,
    (
      SELECT jsonb_agg(jsonb_build_object(
        'tipo', tipo,
        'quantidade', quantidade,
        'valor_total', valor_total
      ))
      FROM regras_distribuicao
    ) as distribuicao_regras
  FROM metricas_diarias h
  ORDER BY h.data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter métricas gerais
CREATE OR REPLACE FUNCTION obter_metricas_gerais(
  IN p_tenant_id UUID
)
RETURNS TABLE (
  total_produtos INTEGER,
  margem_media_global DECIMAL(10,2),
  markup_medio_global DECIMAL(10,2),
  regras_ativas INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (
      SELECT COUNT(DISTINCT produto_id)
      FROM historico_preco
      WHERE tenant_id = p_tenant_id
    ) as total_produtos,
    (
      SELECT ROUND(AVG(
        ((valor_venda - valor_custo) / valor_custo * 100)
      )::DECIMAL(10,2), 2)
      FROM historico_preco
      WHERE tenant_id = p_tenant_id
    ) as margem_media_global,
    (
      SELECT ROUND(AVG(CASE 
        WHEN tipo_markup = 'percentual' THEN valor_markup 
        ELSE valor_markup / 100 
      END)::DECIMAL(10,2), 2)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
    ) as markup_medio_global,
    (
      SELECT COUNT(*)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
    ) as regras_ativas;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;