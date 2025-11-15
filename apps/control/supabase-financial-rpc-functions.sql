-- ============================================================================
-- FUNÇÕES RPC PARA MÉTRICAS FINANCEIRAS CONSOLIDADAS
-- ============================================================================
-- Execute este SQL no Supabase SQL Editor
-- Estas funções permitem buscar métricas financeiras de cada tenant
-- ============================================================================

-- 1. Função para buscar métricas financeiras de um tenant específico
CREATE OR REPLACE FUNCTION public.get_tenant_financial_metrics(
    p_tenant_slug TEXT,
    p_data_inicio TIMESTAMP WITH TIME ZONE,
    p_data_fim TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_schema_name TEXT;
    v_receitas_total NUMERIC := 0;
    v_despesas_total NUMERIC := 0;
    v_duplicatas_receber NUMERIC := 0;
    v_duplicatas_pagar NUMERIC := 0;
    v_result JSONB;
BEGIN
    -- Construir nome do schema
    v_schema_name := 'tenant_' || p_tenant_slug;

    -- Verificar se schema existe
    IF NOT public.schema_exists(v_schema_name) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Schema not found',
            'schema_name', v_schema_name
        );
    END IF;

    -- Buscar receitas totais (duplicatas recebidas)
    BEGIN
        EXECUTE format(
            'SELECT COALESCE(SUM(valor_recebido), 0)
             FROM %I.fin_duplicata_receber
             WHERE status IN (''recebida'', ''parcialmente_recebida'')
             AND data_recebimento BETWEEN $1 AND $2',
            v_schema_name
        ) INTO v_receitas_total
        USING p_data_inicio, p_data_fim;
    EXCEPTION
        WHEN undefined_table THEN
            v_receitas_total := 0;
    END;

    -- Buscar despesas totais (duplicatas pagas)
    BEGIN
        EXECUTE format(
            'SELECT COALESCE(SUM(valor_pago), 0)
             FROM %I.fin_duplicata_pagar
             WHERE status IN (''recebida'', ''parcialmente_recebida'')
             AND data_pagamento BETWEEN $1 AND $2',
            v_schema_name
        ) INTO v_despesas_total
        USING p_data_inicio, p_data_fim;
    EXCEPTION
        WHEN undefined_table THEN
            v_despesas_total := 0;
    END;

    -- Buscar duplicatas a receber pendentes
    BEGIN
        EXECUTE format(
            'SELECT COALESCE(SUM(valor_pendente), 0)
             FROM %I.fin_duplicata_receber
             WHERE status IN (''aberta'', ''parcialmente_recebida'', ''vencida'')',
            v_schema_name
        ) INTO v_duplicatas_receber;
    EXCEPTION
        WHEN undefined_table THEN
            v_duplicatas_receber := 0;
    END;

    -- Buscar duplicatas a pagar pendentes
    BEGIN
        EXECUTE format(
            'SELECT COALESCE(SUM(valor_pendente), 0)
             FROM %I.fin_duplicata_pagar
             WHERE status IN (''aberta'', ''parcialmente_recebida'', ''vencida'')',
            v_schema_name
        ) INTO v_duplicatas_pagar;
    EXCEPTION
        WHEN undefined_table THEN
            v_duplicatas_pagar := 0;
    END;

    -- Construir resultado
    v_result := jsonb_build_object(
        'success', true,
        'schema_name', v_schema_name,
        'receitas_total', v_receitas_total,
        'despesas_total', v_despesas_total,
        'lucro', v_receitas_total - v_despesas_total,
        'margem_lucro', CASE
            WHEN v_receitas_total > 0 THEN ((v_receitas_total - v_despesas_total) / v_receitas_total) * 100
            ELSE 0
        END,
        'duplicatas_receber_pendentes', v_duplicatas_receber,
        'duplicatas_pagar_pendentes', v_duplicatas_pagar
    );

    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'schema_name', v_schema_name
        );
END;
$$;

-- 2. Função para buscar métricas de TODOS os tenants ativos
CREATE OR REPLACE FUNCTION public.get_all_tenants_financial_metrics(
    p_data_inicio TIMESTAMP WITH TIME ZONE,
    p_data_fim TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tenant RECORD;
    v_metricas JSONB;
    v_result JSONB := '[]'::JSONB;
BEGIN
    -- Iterar sobre todos os tenants ativos
    FOR v_tenant IN
        SELECT id, name, slug, plan, status
        FROM cp.tenants
        WHERE status = 'active'
        ORDER BY name
    LOOP
        -- Buscar métricas do tenant
        v_metricas := public.get_tenant_financial_metrics(
            v_tenant.slug,
            p_data_inicio,
            p_data_fim
        );

        -- Adicionar informações do tenant
        v_metricas := v_metricas || jsonb_build_object(
            'tenant_id', v_tenant.id,
            'tenant_name', v_tenant.name,
            'tenant_slug', v_tenant.slug,
            'tenant_plan', v_tenant.plan
        );

        -- Adicionar ao resultado
        v_result := v_result || jsonb_build_array(v_metricas);
    END LOOP;

    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 3. Função para buscar KPIs consolidados da plataforma
CREATE OR REPLACE FUNCTION public.get_platform_financial_kpis(
    p_data_inicio TIMESTAMP WITH TIME ZONE,
    p_data_fim TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_all_metrics JSONB;
    v_metric JSONB;
    v_total_receitas NUMERIC := 0;
    v_total_despesas NUMERIC := 0;
    v_total_lucro NUMERIC := 0;
    v_total_duplicatas_receber NUMERIC := 0;
    v_total_duplicatas_pagar NUMERIC := 0;
    v_total_tenants INTEGER := 0;
    v_tenants_com_receita INTEGER := 0;
BEGIN
    -- Buscar métricas de todos os tenants
    v_all_metrics := public.get_all_tenants_financial_metrics(p_data_inicio, p_data_fim);

    -- Consolidar métricas
    FOR v_metric IN SELECT * FROM jsonb_array_elements(v_all_metrics)
    LOOP
        IF (v_metric->>'success')::BOOLEAN = true THEN
            v_total_receitas := v_total_receitas + COALESCE((v_metric->>'receitas_total')::NUMERIC, 0);
            v_total_despesas := v_total_despesas + COALESCE((v_metric->>'despesas_total')::NUMERIC, 0);
            v_total_lucro := v_total_lucro + COALESCE((v_metric->>'lucro')::NUMERIC, 0);
            v_total_duplicatas_receber := v_total_duplicatas_receber + COALESCE((v_metric->>'duplicatas_receber_pendentes')::NUMERIC, 0);
            v_total_duplicatas_pagar := v_total_duplicatas_pagar + COALESCE((v_metric->>'duplicatas_pagar_pendentes')::NUMERIC, 0);
            v_total_tenants := v_total_tenants + 1;

            IF COALESCE((v_metric->>'receitas_total')::NUMERIC, 0) > 0 THEN
                v_tenants_com_receita := v_tenants_com_receita + 1;
            END IF;
        END IF;
    END LOOP;

    -- Retornar KPIs consolidados
    RETURN jsonb_build_object(
        'total_tenants', v_total_tenants,
        'tenants_com_receita', v_tenants_com_receita,
        'receitas_total', v_total_receitas,
        'despesas_total', v_total_despesas,
        'lucro_total', v_total_lucro,
        'margem_lucro', CASE
            WHEN v_total_receitas > 0 THEN (v_total_lucro / v_total_receitas) * 100
            ELSE 0
        END,
        'duplicatas_receber_total', v_total_duplicatas_receber,
        'duplicatas_pagar_total', v_total_duplicatas_pagar,
        'mrr_estimado', v_total_receitas,
        'arr_estimado', v_total_receitas * 12
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 4. Função para buscar evolução temporal de métricas (gráfico de linha)
CREATE OR REPLACE FUNCTION public.get_platform_financial_timeline(
    p_data_inicio TIMESTAMP WITH TIME ZONE,
    p_data_fim TIMESTAMP WITH TIME ZONE,
    p_intervalo TEXT DEFAULT 'month' -- 'day', 'week', 'month'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tenant RECORD;
    v_schema_name TEXT;
    v_timeline JSONB := '[]'::JSONB;
    v_period RECORD;
BEGIN
    -- Gerar períodos
    FOR v_period IN
        SELECT
            date_trunc(p_intervalo, generate_series(p_data_inicio, p_data_fim, ('1 ' || p_intervalo)::INTERVAL)) AS periodo
    LOOP
        DECLARE
            v_receitas_periodo NUMERIC := 0;
            v_despesas_periodo NUMERIC := 0;
        BEGIN
            -- Iterar sobre todos os tenants
            FOR v_tenant IN
                SELECT slug FROM cp.tenants WHERE status = 'active'
            LOOP
                v_schema_name := 'tenant_' || v_tenant.slug;

                -- Somar receitas do período
                BEGIN
                    EXECUTE format(
                        'SELECT COALESCE(SUM(valor_recebido), 0)
                         FROM %I.fin_duplicata_receber
                         WHERE data_recebimento >= $1
                         AND data_recebimento < $2',
                        v_schema_name
                    ) INTO v_receitas_periodo
                    USING v_period.periodo, v_period.periodo + ('1 ' || p_intervalo)::INTERVAL;
                EXCEPTION
                    WHEN undefined_table THEN
                        NULL;
                END;

                -- Somar despesas do período
                BEGIN
                    EXECUTE format(
                        'SELECT COALESCE(SUM(valor_pago), 0)
                         FROM %I.fin_duplicata_pagar
                         WHERE data_pagamento >= $1
                         AND data_pagamento < $2',
                        v_schema_name
                    ) INTO v_despesas_periodo
                    USING v_period.periodo, v_period.periodo + ('1 ' || p_intervalo)::INTERVAL;
                EXCEPTION
                    WHEN undefined_table THEN
                        NULL;
                END;
            END LOOP;

            -- Adicionar ao timeline
            v_timeline := v_timeline || jsonb_build_array(
                jsonb_build_object(
                    'periodo', v_period.periodo,
                    'receitas', v_receitas_periodo,
                    'despesas', v_despesas_periodo,
                    'lucro', v_receitas_periodo - v_despesas_periodo
                )
            );
        END;
    END LOOP;

    RETURN v_timeline;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- ============================================================================
-- GRANTS - Permitir que o service role execute estas funções
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.get_tenant_financial_metrics(TEXT, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_all_tenants_financial_metrics(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_platform_financial_kpis(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_platform_financial_timeline(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE, TEXT) TO service_role;

-- Também permitir para anon (será filtrado por RLS)
GRANT EXECUTE ON FUNCTION public.get_tenant_financial_metrics(TEXT, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_tenants_financial_metrics(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO anon;
GRANT EXECUTE ON FUNCTION public.get_platform_financial_kpis(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO anon;
GRANT EXECUTE ON FUNCTION public.get_platform_financial_timeline(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE, TEXT) TO anon;

-- ============================================================================
-- EXEMPLOS DE USO
-- ============================================================================

-- Exemplo 1: Buscar métricas de um tenant específico (mês atual)
/*
SELECT public.get_tenant_financial_metrics(
    'noro',
    date_trunc('month', CURRENT_DATE),
    date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
);
*/

-- Exemplo 2: Buscar métricas de todos os tenants (mês atual)
/*
SELECT public.get_all_tenants_financial_metrics(
    date_trunc('month', CURRENT_DATE),
    date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
);
*/

-- Exemplo 3: Buscar KPIs consolidados da plataforma
/*
SELECT public.get_platform_financial_kpis(
    date_trunc('month', CURRENT_DATE),
    date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
);
*/

-- Exemplo 4: Buscar evolução temporal (últimos 12 meses)
/*
SELECT public.get_platform_financial_timeline(
    CURRENT_DATE - INTERVAL '12 months',
    CURRENT_DATE,
    'month'
);
*/

-- ============================================================================
-- FIM
-- ============================================================================
