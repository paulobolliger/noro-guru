-- Migração: View e funções para facilitar consulta de tenants ativos
-- Data: 2025-11-15
-- Descrição: Cria view e funções para consultar tenants ativos baseado em subscriptions

-- View que combina tenants com suas subscriptions ativas
CREATE OR REPLACE VIEW cp.active_tenants_with_billing AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.status as tenant_status,
    t.plan,
    t.created_at,
    t.updated_at,
    s.id as subscription_id,
    s.status as subscription_status,
    s.plan_id,
    s.current_period_start,
    s.current_period_end,
    p.name as plan_name,
    p.price_brl,
    p.price_usd,
    p.interval as billing_interval,
    -- Determinar se o tenant está realmente ativo
    CASE
        WHEN s.status IN ('active', 'trialing') THEN true
        ELSE false
    END as is_active
FROM cp.tenants t
LEFT JOIN LATERAL (
    SELECT *
    FROM billing.subscriptions
    WHERE tenant_id = t.id
    ORDER BY current_period_end DESC
    LIMIT 1
) s ON true
LEFT JOIN billing.plans p ON s.plan_id = p.id;

-- Função para buscar apenas tenants com subscriptions ativas
CREATE OR REPLACE FUNCTION cp.get_active_tenants()
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    tenant_status text,
    plan text,
    created_at timestamptz,
    updated_at timestamptz,
    subscription_id uuid,
    subscription_status billing.subscription_status,
    plan_id uuid,
    current_period_start timestamptz,
    current_period_end timestamptz,
    plan_name varchar,
    price_brl numeric,
    price_usd numeric,
    billing_interval billing.billing_interval
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        v.id,
        v.name,
        v.slug,
        v.tenant_status,
        v.plan,
        v.created_at,
        v.updated_at,
        v.subscription_id,
        v.subscription_status,
        v.plan_id,
        v.current_period_start,
        v.current_period_end,
        v.plan_name,
        v.price_brl,
        v.price_usd,
        v.billing_interval
    FROM cp.active_tenants_with_billing v
    WHERE v.is_active = true;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Função para buscar métricas de billing por tenant
CREATE OR REPLACE FUNCTION billing.get_tenant_billing_metrics(p_tenant_id uuid)
RETURNS TABLE (
    tenant_id uuid,
    current_plan varchar,
    subscription_status billing.subscription_status,
    mrr_brl numeric,
    mrr_usd numeric,
    next_invoice_date timestamptz,
    last_payment_date timestamptz,
    total_invoices_paid numeric,
    total_amount_paid_brl numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p_tenant_id as tenant_id,
        p.name as current_plan,
        s.status as subscription_status,
        -- MRR calculado baseado no plano
        CASE p.interval
            WHEN 'monthly' THEN p.price_brl
            WHEN 'quarterly' THEN p.price_brl / 3
            WHEN 'yearly' THEN p.price_brl / 12
            ELSE 0
        END as mrr_brl,
        CASE p.interval
            WHEN 'monthly' THEN p.price_usd
            WHEN 'quarterly' THEN p.price_usd / 3
            WHEN 'yearly' THEN p.price_usd / 12
            ELSE 0
        END as mrr_usd,
        s.current_period_end as next_invoice_date,
        (
            SELECT MAX(paid_at)
            FROM billing.invoices
            WHERE billing.invoices.tenant_id = p_tenant_id
            AND status = 'succeeded'
        ) as last_payment_date,
        (
            SELECT COUNT(*)::numeric
            FROM billing.invoices
            WHERE billing.invoices.tenant_id = p_tenant_id
            AND status = 'succeeded'
        ) as total_invoices_paid,
        (
            SELECT COALESCE(SUM(amount_brl), 0)
            FROM billing.invoices
            WHERE billing.invoices.tenant_id = p_tenant_id
            AND status = 'succeeded'
        ) as total_amount_paid_brl
    FROM billing.subscriptions s
    LEFT JOIN billing.plans p ON s.plan_id = p.id
    WHERE s.tenant_id = p_tenant_id
    ORDER BY s.current_period_end DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grants para permitir acesso
GRANT SELECT ON cp.active_tenants_with_billing TO authenticated;
GRANT EXECUTE ON FUNCTION cp.get_active_tenants() TO authenticated;
GRANT EXECUTE ON FUNCTION billing.get_tenant_billing_metrics(uuid) TO authenticated;

-- Comentários
COMMENT ON VIEW cp.active_tenants_with_billing IS
'View que combina informações de tenants com suas subscriptions e planos ativos';

COMMENT ON FUNCTION cp.get_active_tenants() IS
'Retorna apenas os tenants que possuem subscriptions ativas ou em trial';

COMMENT ON FUNCTION billing.get_tenant_billing_metrics(uuid) IS
'Retorna métricas de billing consolidadas para um tenant específico';
