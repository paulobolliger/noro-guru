-- Migração para sistema de aprovações de planos
BEGIN;

-- Enum para status de aprovação
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
        CREATE TYPE approval_status AS ENUM (
            'pending',      -- Aguardando aprovação
            'approved',     -- Aprovado
            'rejected',     -- Rejeitado
            'cancelled'     -- Cancelado pelo solicitante
        );
    END IF;
END$$;

-- Tabela de solicitações de aprovação
CREATE TABLE IF NOT EXISTS cp.plan_approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid REFERENCES cp.subscription_plans(id),
    requested_by uuid REFERENCES auth.users(id),
    approved_by uuid REFERENCES auth.users(id),
    status approval_status NOT NULL DEFAULT 'pending',
    request_date timestamptz NOT NULL DEFAULT now(),
    response_date timestamptz,
    
    -- Mudanças propostas
    current_data jsonb NOT NULL,  -- Estado atual do plano
    proposed_changes jsonb NOT NULL, -- Alterações propostas
    impact_analysis jsonb NOT NULL,  -- Análise de impacto nas assinaturas
    
    -- Campos de controle
    notification_sent boolean DEFAULT false,
    comments text[],
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de métricas de uso de planos
CREATE TABLE IF NOT EXISTS cp.plan_usage_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid REFERENCES cp.subscription_plans(id),
    tenant_id uuid REFERENCES cp.tenants(id),
    metric_date date NOT NULL,
    
    -- Métricas de uso
    active_users integer DEFAULT 0,
    storage_used bigint DEFAULT 0,  -- em bytes
    api_requests integer DEFAULT 0,
    features_used jsonb DEFAULT '{}',
    modules_used jsonb DEFAULT '{}',
    
    -- Limites do plano
    plan_limits jsonb NOT NULL,
    
    -- Alertas e status
    alerts jsonb[] DEFAULT '{}',
    status jsonb DEFAULT '{}',
    
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- Garantir uma entrada por plano/tenant/dia
    CONSTRAINT unique_daily_metric UNIQUE (plan_id, tenant_id, metric_date)
);

-- Tabela de histórico de mudanças em planos
CREATE TABLE IF NOT EXISTS cp.plan_change_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid REFERENCES cp.subscription_plans(id),
    changed_by uuid REFERENCES auth.users(id),
    approval_id uuid REFERENCES cp.plan_approvals(id),
    
    -- O que mudou
    changed_fields text[],
    old_values jsonb NOT NULL,
    new_values jsonb NOT NULL,
    
    -- Metadados
    change_reason text,
    affected_subscriptions integer,
    change_type text NOT NULL,  -- 'update', 'create', 'delete'
    
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_plan_approvals_status ON cp.plan_approvals(status);
CREATE INDEX IF NOT EXISTS idx_plan_approvals_dates ON cp.plan_approvals(request_date, response_date);
CREATE INDEX IF NOT EXISTS idx_plan_approvals_plan ON cp.plan_approvals(plan_id);

CREATE INDEX IF NOT EXISTS idx_plan_usage_metrics_date ON cp.plan_usage_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_plan_usage_metrics_tenant ON cp.plan_usage_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_plan_usage_metrics_plan ON cp.plan_usage_metrics(plan_id);

CREATE INDEX IF NOT EXISTS idx_plan_change_history_plan ON cp.plan_change_history(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_change_history_date ON cp.plan_change_history(created_at);
CREATE INDEX IF NOT EXISTS idx_plan_change_history_approval ON cp.plan_change_history(approval_id);

-- Triggers
CREATE OR REPLACE FUNCTION cp.log_plan_change()
RETURNS TRIGGER AS $$
DECLARE
    v_changed_fields text[] := '{}';
    v_old_values jsonb := '{}'::jsonb;
    v_new_values jsonb := '{}'::jsonb;
BEGIN
    -- Verifica quais campos mudaram
    IF TG_OP = 'UPDATE' THEN
        IF OLD.name != NEW.name THEN
            v_changed_fields := array_append(v_changed_fields, 'name');
            v_old_values := jsonb_set(v_old_values, '{name}', to_jsonb(OLD.name));
            v_new_values := jsonb_set(v_new_values, '{name}', to_jsonb(NEW.name));
        END IF;
        
        IF OLD.description != NEW.description THEN
            v_changed_fields := array_append(v_changed_fields, 'description');
            v_old_values := jsonb_set(v_old_values, '{description}', to_jsonb(OLD.description));
            v_new_values := jsonb_set(v_new_values, '{description}', to_jsonb(NEW.description));
        END IF;
        
        IF OLD.monthly_price != NEW.monthly_price THEN
            v_changed_fields := array_append(v_changed_fields, 'monthly_price');
            v_old_values := jsonb_set(v_old_values, '{monthly_price}', to_jsonb(OLD.monthly_price));
            v_new_values := jsonb_set(v_new_values, '{monthly_price}', to_jsonb(NEW.monthly_price));
        END IF;
        
        -- ... outros campos ...
        
        -- Registra a mudança
        IF array_length(v_changed_fields, 1) > 0 THEN
            INSERT INTO cp.plan_change_history (
                plan_id,
                changed_by,
                changed_fields,
                old_values,
                new_values,
                change_type,
                affected_subscriptions
            ) VALUES (
                NEW.id,
                auth.uid(),
                v_changed_fields,
                v_old_values,
                v_new_values,
                'update',
                (SELECT count(*) FROM cp.subscriptions WHERE plan_id = NEW.id)
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_plan_change_history
    AFTER UPDATE ON cp.subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION cp.log_plan_change();

-- Função para coletar métricas diárias
CREATE OR REPLACE FUNCTION cp.collect_daily_metrics()
RETURNS void AS $$
BEGIN
    INSERT INTO cp.plan_usage_metrics (
        plan_id,
        tenant_id,
        metric_date,
        active_users,
        storage_used,
        api_requests,
        features_used,
        modules_used,
        plan_limits
    )
    SELECT 
        s.plan_id,
        s.tenant_id,
        current_date,
        -- Contagem de usuários ativos
        (SELECT count(*) FROM cp.control_plane_users WHERE tenant_id = s.tenant_id AND status = 'ativo'),
        -- Storage usado (exemplo)
        0,  -- TODO: Implementar cálculo real
        -- Requisições API (exemplo)
        0,  -- TODO: Implementar cálculo real
        -- Features usadas
        '{}'::jsonb,  -- TODO: Implementar cálculo real
        -- Módulos usados
        '{}'::jsonb,  -- TODO: Implementar cálculo real
        -- Limites do plano
        (SELECT features FROM cp.subscription_plans WHERE id = s.plan_id)
    FROM cp.subscriptions s
    WHERE s.status = 'active'
    ON CONFLICT (plan_id, tenant_id, metric_date)
    DO UPDATE SET
        active_users = EXCLUDED.active_users,
        storage_used = EXCLUDED.storage_used,
        api_requests = EXCLUDED.api_requests,
        features_used = EXCLUDED.features_used,
        modules_used = EXCLUDED.modules_used,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aprovar mudanças em plano
CREATE OR REPLACE FUNCTION cp.approve_plan_changes(
    p_approval_id uuid,
    p_approved_by uuid,
    p_comments text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
    v_approval cp.plan_approvals;
BEGIN
    -- Busca a aprovação
    SELECT * INTO v_approval
    FROM cp.plan_approvals
    WHERE id = p_approval_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Atualiza o plano
    UPDATE cp.subscription_plans
    SET 
        monthly_price = (v_approval.proposed_changes->>'monthly_price')::decimal,
        quarterly_price = (v_approval.proposed_changes->>'quarterly_price')::decimal,
        yearly_price = (v_approval.proposed_changes->>'yearly_price')::decimal,
        features = v_approval.proposed_changes->'features',
        modules = v_approval.proposed_changes->'modules',
        updated_at = now()
    WHERE id = v_approval.plan_id;
    
    -- Atualiza status da aprovação
    UPDATE cp.plan_approvals
    SET 
        status = 'approved',
        approved_by = p_approved_by,
        response_date = now(),
        comments = array_append(comments, p_comments)
    WHERE id = p_approval_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE cp.plan_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.plan_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.plan_change_history ENABLE ROW LEVEL SECURITY;

-- Policies para plan_approvals
CREATE POLICY "Permitir leitura de aprovações"
    ON cp.plan_approvals FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir criação de aprovações"
    ON cp.plan_approvals FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Permitir atualização de aprovações"
    ON cp.plan_approvals FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cp.control_plane_users u
            WHERE u.auth_id = auth.uid()
            AND u.role IN ('super_admin', 'admin')
        )
    );

-- Policies para plan_usage_metrics
CREATE POLICY "Permitir leitura de métricas"
    ON cp.plan_usage_metrics FOR SELECT
    TO authenticated
    USING (true);

-- Policies para plan_change_history
CREATE POLICY "Permitir leitura de histórico"
    ON cp.plan_change_history FOR SELECT
    TO authenticated
    USING (true);

COMMIT;