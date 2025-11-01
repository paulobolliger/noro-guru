-- Migration: Criar tenant NORO se não existir
-- Data: 2025-10-30
-- Descrição: Garantir que o tenant NORO existe no banco antes de rodar seed data

BEGIN;

-- Verificar se tenant NORO já existe
DO $$
DECLARE
    v_tenant_id uuid;
    v_noro_exists boolean;
BEGIN
    -- Verificar se já existe
    SELECT EXISTS (
        SELECT 1 FROM cp.tenants WHERE slug = 'noro'
    ) INTO v_noro_exists;
    
    IF NOT v_noro_exists THEN
        -- Criar tenant NORO
        INSERT INTO cp.tenants (
            name,
            slug,
            domain,
            status,
            plan,
            features,
            settings
        ) VALUES (
            'NORO Guru',
            'noro',
            'noro.guru',
            'active',
            'enterprise',
            jsonb_build_object(
                'multi_brand', true,
                'financial_module', true,
                'crm', true,
                'support', true,
                'api_access', true,
                'custom_domain', true,
                'white_label', true
            ),
            jsonb_build_object(
                'brands', jsonb_build_array('nomade', 'safetrip', 'vistos', 'noro'),
                'timezone', 'America/Sao_Paulo',
                'currency', 'BRL',
                'language', 'pt-BR'
            )
        ) RETURNING id INTO v_tenant_id;
        
        RAISE NOTICE 'Tenant NORO criado com sucesso! ID: %', v_tenant_id;
    ELSE
        SELECT id INTO v_tenant_id FROM cp.tenants WHERE slug = 'noro';
        RAISE NOTICE 'Tenant NORO já existe. ID: %', v_tenant_id;
    END IF;
    
END $$;

COMMIT;
