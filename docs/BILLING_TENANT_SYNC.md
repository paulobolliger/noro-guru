# Sincronização de Status: Billing ↔ Tenants

## Problema Identificado

O sistema de financeiro não estava identificando corretamente os tenants ativos porque:

1. **Dados separados**: Os planos/assinaturas ficam em `billing.subscriptions` com status próprio
2. **Sem sincronização**: O campo `status` em `cp.tenants` não era automaticamente atualizado
3. **Query incorreta**: O código buscava apenas `cp.tenants.status = 'active'`, ignorando subscriptions

### Exemplo do Problema

```sql
-- Tenant com subscription ativa, mas status "provisioning"
SELECT * FROM cp.tenants WHERE id = 'xxx';
-- status: 'provisioning', plan: NULL

SELECT * FROM billing.subscriptions WHERE tenant_id = 'xxx';
-- status: 'active', plan_id: 'yyy'

-- A query no consolidado NÃO retornava este tenant!
```

## Solução Implementada

### 1. Trigger Automático (Migration `20251115000000_sync_tenant_status_with_billing.sql`)

Criado um trigger que sincroniza automaticamente o status:

```sql
CREATE TRIGGER sync_tenant_status_on_subscription_change
    AFTER INSERT OR UPDATE OF status
    ON billing.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION billing.sync_tenant_status();
```

**Mapeamento de Status:**

| Subscription Status | Tenant Status |
|---------------------|---------------|
| `active` | `active` |
| `trialing` | `active` |
| `past_due` | `past_due` |
| `canceled` | `suspended` |
| `incomplete_expired` | `suspended` |
| outros | `provisioning` |

### 2. View Consolidada (Migration `20251115000001_active_tenants_view.sql`)

Criada uma view que combina tenants com suas subscriptions:

```sql
CREATE VIEW cp.active_tenants_with_billing AS
SELECT
    t.*,
    s.status as subscription_status,
    s.plan_id,
    p.name as plan_name,
    p.price_brl,
    CASE
        WHEN s.status IN ('active', 'trialing') THEN true
        ELSE false
    END as is_active
FROM cp.tenants t
LEFT JOIN LATERAL (
    SELECT * FROM billing.subscriptions
    WHERE tenant_id = t.id
    ORDER BY current_period_end DESC
    LIMIT 1
) s ON true
LEFT JOIN billing.plans p ON s.plan_id = p.id;
```

### 3. Funções Auxiliares

**`cp.get_active_tenants()`**
- Retorna apenas tenants com subscriptions ativas ou em trial
- Inclui informações de billing (plano, preço, período)

**`billing.get_tenant_billing_metrics(tenant_id)`**
- Retorna métricas de billing para um tenant específico
- Calcula MRR (Monthly Recurring Revenue)
- Histórico de pagamentos

### 4. API Atualizada

O endpoint `/api/admin/financeiro/consolidado` foi atualizado para:

```typescript
// ANTES (incorreto)
.from('tenants')
.eq('status', 'active')

// DEPOIS (correto)
.from('active_tenants_with_billing')
.eq('is_active', true)
```

Agora também calcula MRR corretamente baseado nos planos de billing:

```typescript
mrr_estimado: tenants.reduce((acc, t) => acc + (t.price_brl || 0), 0)
```

## Como Usar

### Consultar Tenants Ativos

```sql
-- Usando a view
SELECT * FROM cp.active_tenants_with_billing
WHERE is_active = true;

-- Usando a função
SELECT * FROM cp.get_active_tenants();
```

### Obter Métricas de Billing

```sql
SELECT * FROM billing.get_tenant_billing_metrics('tenant-uuid-here');
```

### API Endpoint

```bash
# Todos os tenants ativos
GET /api/admin/financeiro/consolidado

# Tenant específico
GET /api/admin/financeiro/consolidado?tenant_id=xxx

# Período customizado
GET /api/admin/financeiro/consolidado?periodo=ultimos_12_meses
```

## Atualização de Dados Existentes

A migration `20251115000000` inclui um bloco que atualiza automaticamente todos os tenants existentes baseado em suas subscriptions:

```sql
DO $$
DECLARE
    subscription_record RECORD;
BEGIN
    FOR subscription_record IN
        SELECT DISTINCT ON (tenant_id) ...
        FROM billing.subscriptions
        ORDER BY tenant_id, current_period_end DESC
    LOOP
        UPDATE cp.tenants
        SET status = ..., plan = ..., updated_at = now()
        WHERE id = subscription_record.tenant_id;
    END LOOP;
END $$;
```

## Impacto

### Antes
- ❌ Tenants com subscriptions ativas não apareciam no dashboard
- ❌ MRR/ARR calculados incorretamente
- ❌ Sem visibilidade de billing nos relatórios financeiros

### Depois
- ✅ Todos os tenants com subscriptions ativas são detectados
- ✅ MRR/ARR calculados com base nos planos reais
- ✅ Sincronização automática de status
- ✅ Visibilidade completa de billing + financeiro

## Manutenção

### Criar Nova Subscription

O trigger automaticamente atualiza o tenant:

```sql
INSERT INTO billing.subscriptions (tenant_id, plan_id, status, ...)
VALUES ('tenant-uuid', 'plan-uuid', 'active', ...);
-- cp.tenants.status será atualizado para 'active' automaticamente
```

### Cancelar Subscription

```sql
UPDATE billing.subscriptions
SET status = 'canceled'
WHERE id = 'subscription-uuid';
-- cp.tenants.status será atualizado para 'suspended' automaticamente
```

## Troubleshooting

### Tenant não aparece como ativo

1. Verificar subscription:
   ```sql
   SELECT * FROM billing.subscriptions WHERE tenant_id = 'xxx';
   ```

2. Verificar status do tenant:
   ```sql
   SELECT * FROM cp.tenants WHERE id = 'xxx';
   ```

3. Verificar a view:
   ```sql
   SELECT * FROM cp.active_tenants_with_billing WHERE id = 'xxx';
   ```

### Forçar sincronização manual

```sql
-- Para um tenant específico
UPDATE billing.subscriptions
SET updated_at = now()
WHERE tenant_id = 'xxx' AND status = 'active';
-- Isso dispara o trigger

-- Ou executar a função diretamente
SELECT billing.sync_tenant_status()
FROM billing.subscriptions
WHERE tenant_id = 'xxx'
ORDER BY current_period_end DESC
LIMIT 1;
```

## Testes

Para testar a solução:

1. Criar um novo tenant
2. Criar uma subscription ativa para ele
3. Verificar que o tenant aparece como ativo
4. Cancelar a subscription
5. Verificar que o tenant muda para suspended

```sql
-- 1. Criar tenant
INSERT INTO cp.tenants (name, slug, status)
VALUES ('Test Company', 'test-company', 'provisioning')
RETURNING id;

-- 2. Criar subscription
INSERT INTO billing.subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end)
VALUES ('tenant-id', 'plan-id', 'active', now(), now() + interval '1 month');

-- 3. Verificar tenant foi atualizado
SELECT status FROM cp.tenants WHERE id = 'tenant-id';
-- Deve retornar 'active'

-- 4. Verificar aparece na view
SELECT * FROM cp.active_tenants_with_billing WHERE id = 'tenant-id';
-- is_active deve ser true
```
