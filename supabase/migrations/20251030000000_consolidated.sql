-- Consolidated migration for Control Plane
BEGIN;

-- Criar schema cp se não existir
CREATE SCHEMA IF NOT EXISTS cp;

-- Enum para status do tenant
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_status') THEN
        CREATE TYPE tenant_status AS ENUM (
            'pending',        -- Aguardando verificação/aprovação
            'active',        -- Ativo e operacional
            'suspended',     -- Temporariamente suspenso
            'cancelled',     -- Cancelado pelo cliente
            'blocked'        -- Bloqueado por violação ou inadimplência
        );
    END IF;
END$$;

-- Criar tabela de tenants (empresas/pessoas jurídicas)
CREATE TABLE IF NOT EXISTS cp.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,                           -- Nome comercial
    slug text NOT NULL UNIQUE,                    -- Identificador único para URLs/subdomínios
    razao_social text,                           -- Razão social da empresa
    cnpj text UNIQUE,                            -- CNPJ da empresa
    plan text NOT NULL DEFAULT 'free',           -- Plano contratado (free, basic, pro, enterprise)
    status tenant_status NOT NULL DEFAULT 'pending',
    
    -- Informações de contato
    billing_email text NOT NULL,                 -- Email principal para faturamento
    contact_email text,                          -- Email para contato técnico/suporte
    phone text,                                  -- Telefone principal
    whatsapp text,                              -- WhatsApp para contato
    
    -- Endereço
    address jsonb DEFAULT '{
        "cep": null,
        "logradouro": null,
        "numero": null,
        "complemento": null,
        "bairro": null,
        "cidade": null,
        "estado": null
    }'::jsonb,
    
    -- Configurações e limites
    modules jsonb DEFAULT '{
        "core": true,
        "visa": false,
        "crm": false,
        "billing": false,
        "support": false
    }'::jsonb,
    
    features jsonb DEFAULT '{
        "custom_domain": false,
        "api_access": false,
        "white_label": false,
        "priority_support": false
    }'::jsonb,
    
    limites jsonb DEFAULT '{
        "max_users": 5,
        "max_leads": 100,
        "storage_gb": 1,
        "api_requests_per_day": 1000
    }'::jsonb,
    
    -- Branding e personalização
    branding jsonb DEFAULT '{
        "logo_url": null,
        "primary_color": null,
        "favicon_url": null,
        "company_website": null
    }'::jsonb,
    
    -- Domínios
    domains jsonb DEFAULT '[]'::jsonb,           -- Lista de domínios permitidos
    
    -- Datas importantes
    trial_ends_at timestamptz,                   -- Fim do período de trial
    subscription_ends_at timestamptz,            -- Fim da assinatura atual
    last_billing_at timestamptz,                 -- Data do último faturamento
    cancelled_at timestamptz,                    -- Data de cancelamento (se aplicável)
    
    -- Metadados e rastreabildiade
    metadata jsonb DEFAULT '{}'::jsonb,          -- Dados adicionais flexíveis
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),   -- Quem criou o tenant
    updated_by uuid REFERENCES auth.users(id)    -- Última pessoa que atualizou
);

-- Garantir que temos um tenant principal
INSERT INTO cp.tenants (id, name, slug, plan, status, billing_email)
SELECT 
    'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0',
    'Noro Guru',
    'noro',
    'pro',
    'active',
    'paulo.bolliger@gmail.com'
WHERE NOT EXISTS (
    SELECT 1 FROM cp.tenants WHERE slug = 'noro'
);

-- Enums
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_plane_role') THEN
        CREATE TYPE control_plane_role AS ENUM (
            'super_admin',
            'admin',
            'operador',
            'auditor',
            'readonly'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM (
            'ativo',
            'inativo',
            'pendente',
            'bloqueado'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_cycle') THEN
        CREATE TYPE billing_cycle AS ENUM (
            'monthly',    -- Mensal
            'quarterly', -- Trimestral
            'yearly'     -- Anual
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_status') THEN
        CREATE TYPE billing_status AS ENUM (
            'active',     -- Assinatura ativa
            'trialing',   -- Em período de trial
            'past_due',   -- Pagamento atrasado
            'canceled',   -- Cancelada
            'pending'     -- Aguardando ativação/pagamento
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM (
            'credit_card',    -- Cartão de crédito
            'pix',           -- PIX
            'bank_transfer', -- Transferência bancária
            'boleto'        -- Boleto bancário
        );
    END IF;
END$$;

-- Tabelas para gestão de planos e assinaturas
CREATE TABLE IF NOT EXISTS cp.subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,                    -- Nome do plano (Basic, Pro, Enterprise)
    slug text NOT NULL UNIQUE,             -- Identificador único do plano
    description text,                      -- Descrição do plano
    is_public boolean DEFAULT true,        -- Se o plano aparece publicamente
    is_custom boolean DEFAULT false,       -- Se é um plano customizado
    sort_order integer DEFAULT 0,          -- Ordem de exibição
    
    -- Preços e billing
    monthly_price decimal(10,2),           -- Preço mensal
    quarterly_price decimal(10,2),         -- Preço trimestral
    yearly_price decimal(10,2),            -- Preço anual
    setup_fee decimal(10,2) DEFAULT 0,     -- Taxa de setup (se houver)
    trial_days integer DEFAULT 0,          -- Dias de trial
    
    -- Limites e recursos incluídos
    features jsonb NOT NULL DEFAULT '{
        "users": 5,
        "storage_gb": 10,
        "api_requests_per_day": 1000,
        "custom_domain": false,
        "white_label": false,
        "priority_support": false,
        "api_access": false
    }'::jsonb,
    
    -- Módulos incluídos
    modules jsonb NOT NULL DEFAULT '{
        "core": true,
        "visa": false,
        "crm": false,
        "billing": false,
        "support": false
    }'::jsonb,
    
    -- Metadados
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS cp.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    plan_id uuid REFERENCES cp.subscription_plans(id),
    status billing_status NOT NULL DEFAULT 'pending',
    billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
    
    -- Datas importantes
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    trial_start timestamptz,
    trial_end timestamptz,
    canceled_at timestamptz,
    
    -- Informações de pagamento
    payment_method payment_method,
    auto_renew boolean DEFAULT true,
    next_billing_date timestamptz,
    
    -- Preços aplicados
    base_price decimal(10,2) NOT NULL,     -- Preço base do plano
    discounts decimal(10,2) DEFAULT 0,     -- Descontos aplicados
    add_ons decimal(10,2) DEFAULT 0,       -- Add-ons cobrados
    final_price decimal(10,2) NOT NULL,    -- Preço final
    
    -- Features e módulos customizados (override do plano se necessário)
    custom_features jsonb,
    custom_modules jsonb,
    
    -- Metadados
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_subscription_dates CHECK (
        current_period_start < current_period_end
        AND (trial_start IS NULL OR trial_start <= trial_end)
        AND (canceled_at IS NULL OR canceled_at >= current_period_start)
    )
);

-- Tabela de add-ons disponíveis
CREATE TABLE IF NOT EXISTS cp.subscription_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    type text NOT NULL,                    -- 'feature', 'module', 'service'
    price decimal(10,2) NOT NULL,
    billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
    is_public boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de add-ons ativos por assinatura
CREATE TABLE IF NOT EXISTS cp.subscription_addon_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id uuid REFERENCES cp.subscriptions(id) ON DELETE CASCADE,
    addon_id uuid REFERENCES cp.subscription_addons(id),
    quantity integer DEFAULT 1,
    unit_price decimal(10,2) NOT NULL,
    total_price decimal(10,2) NOT NULL,
    started_at timestamptz NOT NULL DEFAULT now(),
    ends_at timestamptz,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT valid_prices CHECK (
        unit_price >= 0 
        AND total_price = quantity * unit_price
    )
);

-- Configuração global do Control Plane
CREATE TABLE IF NOT EXISTS cp.control_plane_config (
    id bigint PRIMARY KEY DEFAULT 1,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    limites jsonb NOT NULL DEFAULT '{
        "max_usuarios_por_tenant": 5,
        "max_leads_por_tenant": 100,
        "max_armazenamento_por_tenant": 1024,
        "max_requisicoes_api_por_dia": 1000
    }'::jsonb,
    instancia jsonb NOT NULL DEFAULT '{
        "modo_manutencao": false,
        "versao_minima_cli": "1.0.0",
        "versao_atual_api": "1.0.0",
        "dominios_permitidos": []
    }'::jsonb,
    servicos jsonb NOT NULL DEFAULT '{
        "api_publica_habilitada": true,
        "registro_publico_habilitado": true,
        "convites_habilitados": true,
        "oauth_habilitado": false
    }'::jsonb,
    CONSTRAINT control_plane_config_singleton CHECK (id = 1)
);

-- Usuários do Control Plane
CREATE TABLE IF NOT EXISTS cp.control_plane_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id uuid REFERENCES auth.users(id),
    tenant_id uuid REFERENCES cp.tenants(id),
    email text NOT NULL UNIQUE,
    nome text,
    role text NOT NULL DEFAULT 'readonly',
    status text NOT NULL DEFAULT 'pendente',
    two_factor_enabled boolean NOT NULL DEFAULT false,
    permissoes jsonb[] DEFAULT '{}',
    metadata jsonb DEFAULT '{}',
    avatar_url text,
    ultimo_acesso timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    CONSTRAINT unique_user_per_tenant UNIQUE (auth_id, tenant_id)
);

-- Atividades dos usuários
CREATE TABLE IF NOT EXISTS cp.control_plane_user_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES cp.control_plane_users(id) ON DELETE CASCADE,
    tenant_id uuid REFERENCES cp.tenants(id),
    tipo text NOT NULL,
    descricao text NOT NULL,
    ip_address text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_tenant_user CHECK (
        true  -- Removed subquery-based check constraint because PostgreSQL does not allow
        -- subqueries in CHECK constraints. We'll enforce consistency via a trigger
        -- created below (ensure tenant_id of the activity matches the user's tenant).
    )
);

-- Função helper para updated_at
CREATE OR REPLACE FUNCTION cp.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enforce tenant consistency for control_plane_user_activities via trigger
CREATE OR REPLACE FUNCTION cp.ensure_activity_tenant_matches_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tenant_id IS NOT NULL AND NEW.user_id IS NOT NULL THEN
        PERFORM 1 FROM cp.control_plane_users u WHERE u.id = NEW.user_id AND u.tenant_id = NEW.tenant_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'tenant_id (%) does not match control_plane_user tenant for user %', NEW.tenant_id, NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_control_plane_user_activities_tenant_check ON cp.control_plane_user_activities;
CREATE TRIGGER tr_control_plane_user_activities_tenant_check
    BEFORE INSERT OR UPDATE ON cp.control_plane_user_activities
    FOR EACH ROW
    EXECUTE FUNCTION cp.ensure_activity_tenant_matches_user();
-- Triggers para updated_at
DROP TRIGGER IF EXISTS tr_control_plane_users_updated_at ON cp.control_plane_users;
CREATE TRIGGER tr_control_plane_users_updated_at
    BEFORE UPDATE ON cp.control_plane_users
    FOR EACH ROW
    EXECUTE FUNCTION cp.set_updated_at();

DROP TRIGGER IF EXISTS tr_control_plane_config_updated_at ON cp.control_plane_config;
CREATE TRIGGER tr_control_plane_config_updated_at
    BEFORE UPDATE ON cp.control_plane_config
    FOR EACH ROW
    EXECUTE FUNCTION cp.set_updated_at();


-- Função para adicionar domínio a um tenant
CREATE OR REPLACE FUNCTION cp.add_tenant_domain(
    p_tenant_id uuid,
    p_domain text,
    p_is_primary boolean DEFAULT false
)
RETURNS uuid AS $$
DECLARE
    v_id uuid;
    v_verification_token text;
BEGIN
    -- Gera token de verificação
    v_verification_token := encode(gen_random_bytes(32), 'hex');
    
    -- Insere o novo domínio
    INSERT INTO cp.tenant_domains (
        tenant_id,
        domain,
        verification_token,
        is_primary
    ) VALUES (
        p_tenant_id,
        p_domain,
        v_verification_token,
        p_is_primary
    ) RETURNING id INTO v_id;
    
    -- Se for primário, remove flag primário de outros domínios
    IF p_is_primary THEN
        UPDATE cp.tenant_domains
        SET is_primary = false
        WHERE tenant_id = p_tenant_id
        AND id != v_id;
    END IF;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar domínio
CREATE OR REPLACE FUNCTION cp.verify_tenant_domain(
    p_domain_id uuid
)
RETURNS boolean AS $$
BEGIN
    UPDATE cp.tenant_domains
    SET 
        status = 'verified',
        verified_at = now()
    WHERE id = p_domain_id
    AND status = 'pending_verification';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar nova fatura
CREATE OR REPLACE FUNCTION cp.generate_tenant_invoice(
    p_tenant_id uuid,
    p_amount decimal,
    p_due_date timestamptz,
    p_period_start timestamptz,
    p_period_end timestamptz,
    p_items jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid AS $$
DECLARE
    v_invoice_id uuid;
    v_invoice_number text;
    v_tenant_address jsonb;
BEGIN
    -- Busca endereço do tenant
    SELECT address INTO v_tenant_address
    FROM cp.tenants
    WHERE id = p_tenant_id;
    
    -- Gera número da fatura (ANO/MES/SEQUENCIAL)
    SELECT 'INV-' || to_char(now(), 'YYYYMM') || '-' || 
           LPAD(COALESCE(
               (SELECT COUNT(*) + 1 FROM cp.tenant_invoices 
                WHERE invoice_number LIKE 'INV-' || to_char(now(), 'YYYYMM') || '-%'),
               1)::text, 
           4, '0')
    INTO v_invoice_number;
    
    -- Insere a nova fatura
    INSERT INTO cp.tenant_invoices (
        tenant_id,
        invoice_number,
        amount,
        due_date,
        period_start,
        period_end,
        items,
        billing_address
    ) VALUES (
        p_tenant_id,
        v_invoice_number,
        p_amount,
        p_due_date,
        p_period_start,
        p_period_end,
        p_items,
        v_tenant_address
    ) RETURNING id INTO v_invoice_id;
    
    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Índices para tabelas do Control Plane
CREATE INDEX IF NOT EXISTS idx_subscription_plans_slug ON cp.subscription_plans(slug);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_public ON cp.subscription_plans(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort ON cp.subscription_plans(sort_order) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON cp.subscriptions(tenant_id);
-- Ensure columns added by later iterations exist before creating indexes
ALTER TABLE cp.subscriptions ADD COLUMN IF NOT EXISTS next_billing_date timestamptz;
ALTER TABLE cp.subscriptions ADD COLUMN IF NOT EXISTS base_price decimal(10,2) DEFAULT 0;
ALTER TABLE cp.subscriptions ADD COLUMN IF NOT EXISTS final_price decimal(10,2) DEFAULT 0;
ALTER TABLE cp.subscriptions ADD COLUMN IF NOT EXISTS discounts decimal(10,2) DEFAULT 0;
ALTER TABLE cp.subscriptions ADD COLUMN IF NOT EXISTS add_ons decimal(10,2) DEFAULT 0;
ALTER TABLE cp.subscriptions ADD COLUMN IF NOT EXISTS trial_end timestamptz;
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON cp.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_dates ON cp.subscriptions(current_period_end, next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_trial ON cp.subscriptions(trial_end) WHERE trial_end IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscription_addons_public ON cp.subscription_addons(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_subscription_addon_items_subscription ON cp.subscription_addon_items(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_addon_items_dates ON cp.subscription_addon_items(ends_at) WHERE ends_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_control_plane_users_auth_id ON cp.control_plane_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_control_plane_users_role ON cp.control_plane_users(role);
CREATE INDEX IF NOT EXISTS idx_control_plane_users_status ON cp.control_plane_users(status);
CREATE INDEX IF NOT EXISTS idx_control_plane_users_email_lower ON cp.control_plane_users(lower(email));
CREATE INDEX IF NOT EXISTS idx_control_plane_users_tenant ON cp.control_plane_users(tenant_id);

CREATE INDEX IF NOT EXISTS idx_control_plane_user_activities_user_id ON cp.control_plane_user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_control_plane_user_activities_tipo ON cp.control_plane_user_activities(tipo);
CREATE INDEX IF NOT EXISTS idx_control_plane_user_activities_created_at ON cp.control_plane_user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_control_plane_user_activities_tenant ON cp.control_plane_user_activities(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tenants_slug_lower ON cp.tenants(lower(slug));
CREATE INDEX IF NOT EXISTS idx_tenants_status ON cp.tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_cnpj ON cp.tenants(cnpj);
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON cp.tenants(plan);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription ON cp.tenants(subscription_ends_at);

-- Tabelas de histórico e faturamento para tenants
CREATE TABLE IF NOT EXISTS cp.tenant_plan_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    old_plan text,
    new_plan text NOT NULL,
    change_reason text,
    old_features jsonb,
    new_features jsonb,
    old_modules jsonb,
    new_modules jsonb,
    old_limites jsonb,
    new_limites jsonb,
    changed_by uuid REFERENCES auth.users(id),
    changed_at timestamptz NOT NULL DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS cp.tenant_invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    invoice_number text UNIQUE,
    status text NOT NULL DEFAULT 'pending',
    amount decimal(10,2) NOT NULL,
    currency text NOT NULL DEFAULT 'BRL',
    due_date timestamptz NOT NULL,
    paid_at timestamptz,
    payment_method text,
    payment_metadata jsonb DEFAULT '{}',
    period_start timestamptz NOT NULL,
    period_end timestamptz NOT NULL,
    items jsonb NOT NULL DEFAULT '[]',
    billing_address jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cp.tenant_domains (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    domain text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'pending_verification',
    verification_token text,
    verified_at timestamptz,
    ssl_status text,
    ssl_expires_at timestamptz,
    is_primary boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT unique_primary_domain_per_tenant UNIQUE (tenant_id, is_primary)
);

-- Índices para as novas tabelas
CREATE INDEX IF NOT EXISTS idx_tenant_plan_history_tenant ON cp.tenant_plan_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_plan_history_date ON cp.tenant_plan_history(changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_tenant_invoices_tenant ON cp.tenant_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_status ON cp.tenant_invoices(status);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_due_date ON cp.tenant_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_number ON cp.tenant_invoices(invoice_number);

CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant ON cp.tenant_domains(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_status ON cp.tenant_domains(status);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_domain ON cp.tenant_domains(domain);

-- Triggers para atualização automática
CREATE OR REPLACE FUNCTION cp.log_tenant_plan_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.plan != NEW.plan OR OLD.features != NEW.features OR OLD.modules != NEW.modules OR OLD.limites != NEW.limites) THEN
        INSERT INTO cp.tenant_plan_history (
            tenant_id,
            old_plan,
            new_plan,
            old_features,
            new_features,
            old_modules,
            new_modules,
            old_limites,
            new_limites,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.plan,
            NEW.plan,
            OLD.features,
            NEW.features,
            OLD.modules,
            NEW.modules,
            OLD.limites,
            NEW.limites,
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_tenant_plan_history
    AFTER UPDATE ON cp.tenants
    FOR EACH ROW
    EXECUTE FUNCTION cp.log_tenant_plan_change();

-- Função para verificação automática de status do tenant
CREATE OR REPLACE FUNCTION cp.check_tenant_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se há faturas vencidas
    IF EXISTS (
        SELECT 1 FROM cp.tenant_invoices
        WHERE tenant_id = NEW.id
        AND status = 'pending'
        AND due_date < now() - interval '7 days'
    ) THEN
        NEW.status = 'suspended';
    END IF;

    -- Verifica se a assinatura expirou
    IF NEW.subscription_ends_at < now() THEN
        NEW.status = 'suspended';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_tenant_status_check
    BEFORE UPDATE ON cp.tenants
    FOR EACH ROW
    EXECUTE FUNCTION cp.check_tenant_status();

-- Funções helpers para tenants
CREATE OR REPLACE FUNCTION cp.check_tenant_module_access(tenant_id uuid, module_name text)
RETURNS boolean AS $$
BEGIN
    RETURN (
        SELECT (t.modules->>module_name)::boolean
        FROM cp.tenants t
        WHERE t.id = tenant_id
        AND t.status = 'active'
        AND (t.subscription_ends_at IS NULL OR t.subscription_ends_at > now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cp.check_tenant_feature_access(tenant_id uuid, feature_name text)
RETURNS boolean AS $$
BEGIN
    RETURN (
        SELECT (t.features->>feature_name)::boolean
        FROM cp.tenants t
        WHERE t.id = tenant_id
        AND t.status = 'active'
        AND (t.subscription_ends_at IS NULL OR t.subscription_ends_at > now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cp.get_user_tenants(user_auth_id uuid)
RETURNS TABLE (
    tenant_id uuid,
    tenant_name text,
    tenant_slug text,
    user_role text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.slug,
        cpu.role
    FROM cp.tenants t
    JOIN cp.control_plane_users cpu ON cpu.tenant_id = t.id
    WHERE cpu.auth_id = user_auth_id
    AND t.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE cp.control_plane_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.control_plane_user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.control_plane_config ENABLE ROW LEVEL SECURITY;

-- Policies para control_plane_users
CREATE POLICY "Permitir leitura para usuários logados"
    ON cp.control_plane_users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir atualização apenas para super_admin e admin"
    ON cp.control_plane_users FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Permitir inserção apenas para super_admin e admin"
    ON cp.control_plane_users FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Permitir deleção apenas para super_admin"
    ON cp.control_plane_users FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role = 'super_admin'
        )
    );

-- Policies para control_plane_user_activities
CREATE POLICY "Permitir leitura de atividades para usuários logados"
    ON cp.control_plane_user_activities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserção de atividades para usuários logados"
    ON cp.control_plane_user_activities FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policies para control_plane_config
CREATE POLICY "Permitir leitura de config para usuários logados"
    ON cp.control_plane_config FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir alteração de config apenas para super_admin"
    ON cp.control_plane_config FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role = 'super_admin'
        )
    );

-- Criar usuário inicial no auth.users somente se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'paulo.bolliger@gmail.com'
  ) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      aud,
      role
    ) VALUES (
      'c21f969b-5f03-433d-95e6-469923255a1d',  -- ID fixo para admin
      '00000000-0000-0000-0000-000000000000',
      'paulo.bolliger@gmail.com',
      crypt('senha_padrao_temporaria', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"nome":"Paulo Bolliger"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  END IF;
END $$;

-- Criar tabela noro_users se não existir
CREATE TABLE IF NOT EXISTS public.noro_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    nome text,
    role text NOT NULL DEFAULT 'user',
    avatar_url text,
    tenant_id uuid REFERENCES cp.tenants(id),
    control_plane_user_id uuid REFERENCES cp.control_plane_users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_control_plane_user CHECK (
        control_plane_user_id = (
            SELECT id 
            FROM cp.control_plane_users 
            WHERE auth_id = noro_users.id
        )
    )
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_noro_users_role ON public.noro_users(role);
CREATE INDEX IF NOT EXISTS idx_noro_users_email_lower ON public.noro_users(lower(email));

-- Trigger para updated_at em noro_users
DROP TRIGGER IF EXISTS tr_noro_users_updated_at ON public.noro_users;
CREATE TRIGGER tr_noro_users_updated_at
    BEFORE UPDATE ON public.noro_users
    FOR EACH ROW
    EXECUTE FUNCTION cp.set_updated_at();

-- Habilitar RLS
ALTER TABLE public.noro_users ENABLE ROW LEVEL SECURITY;

-- Policies para noro_users
CREATE POLICY "Permitir leitura para usuários autenticados"
    ON public.noro_users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir atualização pelo próprio usuário ou admin"
    ON public.noro_users FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = id OR EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Permitir inserção apenas para admin"
    ON public.noro_users FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Permitir deleção apenas para admin"
    ON public.noro_users FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

-- Inserir usuário admin inicial em noro_users
INSERT INTO public.noro_users (
    id,  -- Usando mesmo ID do auth.users
    email,
    nome,
    role
) VALUES (
    'c21f969b-5f03-433d-95e6-469923255a1d',
    'paulo.bolliger@gmail.com',
    'Paulo Bolliger',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Seed inicial do Control Plane
INSERT INTO cp.control_plane_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Importar usuários existentes do noro_users (apenas se existirem em auth.users)
INSERT INTO cp.control_plane_users (auth_id, tenant_id, email, nome, role, status)
SELECT 
    nu.id as auth_id,
    (SELECT id FROM cp.tenants WHERE slug = 'noro') as tenant_id,
    nu.email,
    nu.nome,
    CASE 
        WHEN nu.role = 'admin' THEN 'super_admin'
        ELSE 'readonly'
    END as role,
    'ativo' as status
FROM public.noro_users nu
JOIN auth.users au ON au.id = nu.id  -- Garante que o usuário existe em auth.users
ON CONFLICT (email) DO NOTHING;

-- Garantir super admin inicial
INSERT INTO cp.control_plane_users (auth_id, tenant_id, email, nome, role, status)
SELECT 
    u.id as auth_id,
    (SELECT id FROM cp.tenants WHERE slug = 'noro') as tenant_id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'nome', 'Admin'),
    'super_admin'::text as role,
    'ativo'::text as status
FROM auth.users u
WHERE u.email = 'paulo.bolliger@gmail.com'
ON CONFLICT (email) DO 
    UPDATE SET role = 'super_admin', status = 'ativo', tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- Seeds iniciais dos planos
INSERT INTO cp.subscription_plans (
    name, 
    slug, 
    description,
    monthly_price,
    quarterly_price,
    yearly_price,
    trial_days,
    features,
    modules,
    sort_order
) VALUES 
(
    'Basic',
    'basic',
    'Plano básico ideal para pequenas empresas iniciarem sua jornada',
    99.90,
    269.70,    -- 10% desconto no trimestral
    999.00,    -- ~17% desconto no anual
    7,         -- 7 dias de trial
    '{
        "users": 5,
        "storage_gb": 10,
        "api_requests_per_day": 1000,
        "custom_domain": false,
        "white_label": false,
        "priority_support": false,
        "api_access": false
    }',
    '{
        "core": true,
        "visa": false,
        "crm": false,
        "billing": false,
        "support": false
    }',
    10
),
(
    'Pro',
    'pro',
    'Plano profissional com recursos avançados para empresas em crescimento',
    199.90,
    539.73,    -- 10% desconto no trimestral
    1999.00,   -- ~17% desconto no anual
    14,        -- 14 dias de trial
    '{
        "users": 15,
        "storage_gb": 50,
        "api_requests_per_day": 5000,
        "custom_domain": true,
        "white_label": false,
        "priority_support": true,
        "api_access": true
    }',
    '{
        "core": true,
        "visa": true,
        "crm": true,
        "billing": false,
        "support": true
    }',
    20
),
(
    'Enterprise',
    'enterprise',
    'Plano empresarial completo com recursos ilimitados e suporte dedicado',
    499.90,
    1349.73,   -- 10% desconto no trimestral
    4999.00,   -- ~17% desconto no anual
    30,        -- 30 dias de trial
    '{
        "users": 50,
        "storage_gb": 200,
        "api_requests_per_day": 20000,
        "custom_domain": true,
        "white_label": true,
        "priority_support": true,
        "api_access": true
    }',
    '{
        "core": true,
        "visa": true,
        "crm": true,
        "billing": true,
        "support": true
    }',
    30
)
ON CONFLICT (slug) DO UPDATE SET
    monthly_price = EXCLUDED.monthly_price,
    quarterly_price = EXCLUDED.quarterly_price,
    yearly_price = EXCLUDED.yearly_price,
    features = EXCLUDED.features,
    modules = EXCLUDED.modules,
    trial_days = EXCLUDED.trial_days;

-- Funções helpers para planos e assinaturas
CREATE OR REPLACE FUNCTION cp.get_plan_price(
    plan_id uuid,
    billing_cycle billing_cycle
)
RETURNS decimal AS $$
    SELECT 
        CASE billing_cycle
            WHEN 'monthly' THEN monthly_price
            WHEN 'quarterly' THEN quarterly_price
            WHEN 'yearly' THEN yearly_price
        END
    FROM cp.subscription_plans
    WHERE id = plan_id;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION cp.calculate_next_billing_date(
    current_date timestamptz,
    cycle billing_cycle
)
RETURNS timestamptz AS $$
BEGIN
    RETURN current_date + 
        CASE cycle
            WHEN 'monthly' THEN interval '1 month'
            WHEN 'quarterly' THEN interval '3 months'
            WHEN 'yearly' THEN interval '1 year'
        END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION cp.create_subscription(
    p_tenant_id uuid,
    p_plan_id uuid,
    p_billing_cycle billing_cycle,
    p_start_date timestamptz DEFAULT now()
)
RETURNS uuid AS $$
DECLARE
    v_base_price decimal;
    v_subscription_id uuid;
    v_trial_days integer;
BEGIN
    -- Busca preço e dias de trial do plano
    SELECT cp.get_plan_price(p_plan_id, p_billing_cycle), trial_days
    INTO v_base_price, v_trial_days
    FROM cp.subscription_plans
    WHERE id = p_plan_id;

    -- Cria a assinatura
    INSERT INTO cp.subscriptions (
        tenant_id,
        plan_id,
        status,
        billing_cycle,
        current_period_start,
        current_period_end,
        trial_start,
        trial_end,
        next_billing_date,
        base_price,
        final_price
    ) VALUES (
        p_tenant_id,
        p_plan_id,
        CASE WHEN v_trial_days > 0 THEN 'trialing' ELSE 'active' END,
        p_billing_cycle,
        p_start_date,
        cp.calculate_next_billing_date(p_start_date, p_billing_cycle),
        CASE WHEN v_trial_days > 0 THEN p_start_date ELSE NULL END,
        CASE WHEN v_trial_days > 0 THEN p_start_date + (v_trial_days || ' days')::interval ELSE NULL END,
        CASE 
            WHEN v_trial_days > 0 THEN p_start_date + (v_trial_days || ' days')::interval
            ELSE cp.calculate_next_billing_date(p_start_date, p_billing_cycle)
        END,
        v_base_price,
        v_base_price
    ) RETURNING id INTO v_subscription_id;

    RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;