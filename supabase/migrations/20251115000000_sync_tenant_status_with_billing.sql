-- Migração: Sincronizar status do tenant com status da subscription
-- Data: 2025-11-15
-- Descrição: Cria trigger para atualizar automaticamente o status do tenant
--            quando uma subscription é criada ou atualizada

-- Função para sincronizar o status do tenant baseado na subscription mais recente
CREATE OR REPLACE FUNCTION billing.sync_tenant_status()
RETURNS TRIGGER AS $$
DECLARE
    v_tenant_status text;
BEGIN
    -- Determinar o novo status do tenant baseado no status da subscription
    CASE NEW.status
        WHEN 'active' THEN
            v_tenant_status := 'active';
        WHEN 'trialing' THEN
            v_tenant_status := 'active';  -- Trial também é considerado ativo
        WHEN 'past_due' THEN
            v_tenant_status := 'past_due';
        WHEN 'canceled' THEN
            v_tenant_status := 'suspended';
        WHEN 'incomplete_expired' THEN
            v_tenant_status := 'suspended';
        ELSE
            v_tenant_status := 'provisioning';
    END CASE;

    -- Atualizar o status do tenant
    UPDATE cp.tenants
    SET
        status = v_tenant_status,
        plan = (SELECT name FROM billing.plans WHERE id = NEW.plan_id),
        updated_at = now()
    WHERE id = NEW.tenant_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para sincronizar quando subscription é criada ou atualizada
DROP TRIGGER IF EXISTS sync_tenant_status_on_subscription_change ON billing.subscriptions;

CREATE TRIGGER sync_tenant_status_on_subscription_change
    AFTER INSERT OR UPDATE OF status
    ON billing.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION billing.sync_tenant_status();

-- Atualizar os tenants existentes baseado nas subscriptions ativas
-- Esta é uma atualização one-time para corrigir o estado atual
DO $$
DECLARE
    subscription_record RECORD;
    v_tenant_status text;
    v_plan_name text;
BEGIN
    -- Para cada subscription, atualizar o tenant correspondente
    FOR subscription_record IN
        SELECT DISTINCT ON (tenant_id)
            s.tenant_id,
            s.status,
            s.plan_id,
            p.name as plan_name
        FROM billing.subscriptions s
        LEFT JOIN billing.plans p ON s.plan_id = p.id
        ORDER BY tenant_id, current_period_end DESC
    LOOP
        -- Determinar o status do tenant
        CASE subscription_record.status
            WHEN 'active' THEN
                v_tenant_status := 'active';
            WHEN 'trialing' THEN
                v_tenant_status := 'active';
            WHEN 'past_due' THEN
                v_tenant_status := 'past_due';
            WHEN 'canceled' THEN
                v_tenant_status := 'suspended';
            WHEN 'incomplete_expired' THEN
                v_tenant_status := 'suspended';
            ELSE
                v_tenant_status := 'provisioning';
        END CASE;

        -- Atualizar tenant
        UPDATE cp.tenants
        SET
            status = v_tenant_status,
            plan = subscription_record.plan_name,
            updated_at = now()
        WHERE id = subscription_record.tenant_id;

        RAISE NOTICE 'Updated tenant % to status %', subscription_record.tenant_id, v_tenant_status;
    END LOOP;
END $$;

-- Criar índice para melhorar performance das queries
CREATE INDEX IF NOT EXISTS idx_tenants_status ON cp.tenants(status);

-- Comentários para documentação
COMMENT ON FUNCTION billing.sync_tenant_status() IS
'Sincroniza automaticamente o status do tenant (cp.tenants.status) baseado no status da subscription mais recente';

COMMENT ON TRIGGER sync_tenant_status_on_subscription_change ON billing.subscriptions IS
'Atualiza o status do tenant sempre que uma subscription é criada ou tem seu status alterado';
