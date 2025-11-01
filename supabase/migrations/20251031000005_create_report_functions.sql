-- Criação de tipos para os relatórios
CREATE TYPE pricing_report_margins AS (
  categoria text,
  produto text,
  custo decimal,
  preco_venda decimal,
  markup decimal,
  margem_lucro decimal,
  variacao_periodo_anterior decimal
);

CREATE TYPE pricing_report_rules AS (
  nome text,
  tipo text,
  condicao text,
  markup decimal,
  data_criacao timestamptz,
  data_modificacao timestamptz,
  status text
);

CREATE TYPE pricing_report_simulations AS (
  id uuid,
  produto text,
  preco_base decimal,
  markup_aplicado decimal,
  preco_final decimal,
  data_simulacao timestamptz,
  usuario text
);

-- Função para gerar relatório de margens
CREATE OR REPLACE FUNCTION gerar_relatorio_margens(
  data_inicial timestamptz,
  data_final timestamptz,
  incluir_comparativo boolean DEFAULT true
)
RETURNS SETOF pricing_report_margins
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH dados_periodo_atual AS (
    SELECT 
      p.categoria,
      p.nome as produto,
      p.custo,
      p.preco_venda,
      p.markup,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_lucro
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
  ),
  dados_periodo_anterior AS (
    SELECT 
      p.categoria,
      p.nome as produto,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_anterior
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN 
      data_inicial - (data_final - data_inicial) AND 
      data_inicial
  )
  SELECT 
    d.categoria,
    d.produto,
    d.custo,
    d.preco_venda,
    d.markup,
    d.margem_lucro,
    CASE 
      WHEN incluir_comparativo THEN
        COALESCE(d.margem_lucro - da.margem_anterior, 0)
      ELSE 0
    END as variacao_periodo_anterior
  FROM dados_periodo_atual d
  LEFT JOIN dados_periodo_anterior da 
    ON d.categoria = da.categoria 
    AND d.produto = da.produto;
END;
$$;

-- Função para gerar relatório de regras de preço
CREATE OR REPLACE FUNCTION gerar_relatorio_regras(
  data_inicial timestamptz,
  data_final timestamptz
)
RETURNS SETOF pricing_report_rules
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.nome,
    r.tipo,
    r.condicao,
    r.markup,
    r.created_at as data_criacao,
    r.updated_at as data_modificacao,
    r.status
  FROM regras_preco r
  WHERE r.created_at BETWEEN data_inicial AND data_final
  ORDER BY r.created_at DESC;
END;
$$;

-- Função para gerar relatório de simulações
CREATE OR REPLACE FUNCTION gerar_relatorio_simulacoes(
  data_inicial timestamptz,
  data_final timestamptz
)
RETURNS SETOF pricing_report_simulations
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    p.nome as produto,
    s.preco_base,
    s.markup_aplicado,
    s.preco_final,
    s.created_at as data_simulacao,
    u.nome as usuario
  FROM simulacoes_preco s
  JOIN produtos p ON s.produto_id = p.id
  JOIN usuarios u ON s.usuario_id = u.id
  WHERE s.created_at BETWEEN data_inicial AND data_final
  ORDER BY s.created_at DESC;
END;
$$;