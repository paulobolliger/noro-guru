-- ============================================================================
-- FUNÇÕES RPC PARA PROVISIONAMENTO DE TENANTS
-- ============================================================================
-- Execute este SQL no Supabase SQL Editor
-- Estas funções permitem criar schemas dedicados para cada tenant
-- ============================================================================

-- 1. Função para criar schema do tenant
CREATE OR REPLACE FUNCTION public.create_tenant_schema(
    p_schema_name TEXT,
    p_tenant_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Criar schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', p_schema_name);

    -- Garantir que o schema foi criado
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.schemata
        WHERE schema_name = p_schema_name
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Failed to create schema'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'schema_name', p_schema_name
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 2. Função para copiar estrutura de tabela
CREATE OR REPLACE FUNCTION public.copy_table_structure(
    p_source_schema TEXT,
    p_source_table TEXT,
    p_target_schema TEXT,
    p_target_table TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_target_table TEXT;
BEGIN
    -- Se target_table não foi fornecido, usar o mesmo nome da source_table
    v_target_table := COALESCE(p_target_table, p_source_table);

    -- Copiar estrutura da tabela (sem dados)
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I.%I (LIKE %I.%I INCLUDING ALL)',
        p_target_schema,
        v_target_table,
        p_source_schema,
        p_source_table
    );

    -- Habilitar RLS na nova tabela
    EXECUTE format(
        'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY',
        p_target_schema,
        v_target_table
    );

    RETURN jsonb_build_object(
        'success', true,
        'table', format('%s.%s', p_target_schema, v_target_table)
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 3. Função para verificar se schema existe
CREATE OR REPLACE FUNCTION public.schema_exists(
    p_schema_name TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.schemata
        WHERE schema_name = p_schema_name
    );
$$;

-- 4. Função para deletar schema do tenant (PERIGOSO!)
CREATE OR REPLACE FUNCTION public.delete_tenant_schema(
    p_schema_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verificar se schema existe
    IF NOT public.schema_exists(p_schema_name) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Schema does not exist'
        );
    END IF;

    -- Deletar schema e todo seu conteúdo
    EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE', p_schema_name);

    RETURN jsonb_build_object(
        'success', true,
        'schema_name', p_schema_name,
        'message', 'Schema deleted successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 5. Função para listar todos os schemas de tenants
CREATE OR REPLACE FUNCTION public.list_tenant_schemas()
RETURNS TABLE(schema_name TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT schema_name::TEXT
    FROM information_schema.schemata
    WHERE schema_name LIKE 'tenant_%'
    ORDER BY schema_name;
$$;

-- 6. Função auxiliar para executar SQL dinâmico (apenas para desenvolvimento)
CREATE OR REPLACE FUNCTION public.exec_sql(
    p_sql TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE p_sql;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'SQL executed successfully'
    );
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

GRANT EXECUTE ON FUNCTION public.create_tenant_schema(TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.copy_table_structure(TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.schema_exists(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_tenant_schema(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_tenant_schemas() TO service_role;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO service_role;

-- ============================================================================
-- TESTE - Você pode descomentar para testar
-- ============================================================================

-- Teste 1: Criar schema de teste
-- SELECT public.create_tenant_schema('tenant_test', gen_random_uuid());

-- Teste 2: Verificar se schema existe
-- SELECT public.schema_exists('tenant_test');

-- Teste 3: Copiar estrutura de uma tabela
-- SELECT public.copy_table_structure('public', 'noro_clientes', 'tenant_test');

-- Teste 4: Listar schemas de tenants
-- SELECT * FROM public.list_tenant_schemas();

-- Teste 5: Deletar schema de teste
-- SELECT public.delete_tenant_schema('tenant_test');

-- ============================================================================
-- FIM
-- ============================================================================
