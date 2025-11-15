# 🔧 SETUP DO SUPABASE PARA MULTI-TENANT

## Pré-requisitos

- Acesso ao Supabase Dashboard (https://supabase.com)
- Projeto criado
- Variáveis de ambiente configuradas em `/apps/control/.env.local` e `/apps/core/.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## 📋 ORDEM DE EXECUÇÃO DOS SQLs

Execute os SQLs **nesta ordem** no Supabase SQL Editor:

### 1️⃣ **Criar Schema Control Plane (cp)**

**Arquivo:** Não temos ainda - deve existir a migration que cria o schema `cp` com as tabelas:
- `cp.tenants`
- `cp.domains`
- `cp.user_tenant_roles`
- `cp.system_events`
- `cp.ledger_accounts`
- `cp.ledger_entries`

Se ainda não existe, verifique se já foi executado.

**Verificar se existe:**
```sql
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'cp';
```

---

### 2️⃣ **Funções RPC de Provisionamento**

**Arquivo:** `/apps/control/supabase-rpc-functions.sql`

**O que faz:**
- `create_tenant_schema(schema_name, tenant_id)` - Cria schema dedicado para o tenant
- `copy_table_structure(source_schema, source_table, target_schema, target_table)` - Copia estrutura de tabela
- `schema_exists(schema_name)` - Verifica se schema existe
- `delete_tenant_schema(schema_name)` - Deleta schema (PERIGOSO!)
- `list_tenant_schemas()` - Lista todos os schemas de tenants
- `exec_sql(sql)` - Executa SQL dinâmico (dev only)

**Como executar:**
1. Abra o Supabase SQL Editor
2. Copie todo o conteúdo de `/apps/control/supabase-rpc-functions.sql`
3. Cole e execute
4. Verifique se não houve erros

**Testar:**
```sql
-- Deve retornar uma lista (pode estar vazia se nenhum tenant foi criado)
SELECT * FROM public.list_tenant_schemas();
```

---

### 3️⃣ **Funções RPC Financeiras**

**Arquivo:** `/apps/control/supabase-financial-rpc-functions.sql`

**O que faz:**
- `get_tenant_financial_metrics(tenant_slug, data_inicio, data_fim)` - Busca métricas financeiras de um tenant
- `get_all_tenants_financial_metrics(data_inicio, data_fim)` - Busca métricas de todos os tenants
- `get_platform_financial_kpis(data_inicio, data_fim)` - Calcula KPIs consolidados da plataforma
- `get_platform_financial_timeline(data_inicio, data_fim, intervalo)` - Evolução temporal de métricas

**Como executar:**
1. Abra o Supabase SQL Editor
2. Copie todo o conteúdo de `/apps/control/supabase-financial-rpc-functions.sql`
3. Cole e execute
4. Verifique se não houve erros

**Testar (requer ao menos 1 tenant criado):**
```sql
-- Buscar métricas de um tenant específico (substitua 'noro' pelo slug do seu tenant)
SELECT public.get_tenant_financial_metrics(
    'noro',
    date_trunc('month', CURRENT_DATE),
    date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
);
```

---

### 4️⃣ **Tabelas Financeiras do Tenant (Core Schema)**

**Arquivo:** `/apps/financeiro/supabase/migrations/20251030_create_duplicatas_avancado_v3_FULL_VIEWS.sql` (provavelmente)

**O que faz:**
Cria as tabelas financeiras no schema do tenant:
- `fin_condicao_pagamento`
- `fin_duplicata_receber`
- `fin_duplicata_pagar`
- `fin_adiantamento`
- `fin_credito`
- `fin_utilizacao`
- `fin_lembrete`

**Como executar:**
Essas tabelas devem ser criadas automaticamente quando um tenant é provisionado.
Quando você criar um tenant no `/control`, o sistema vai:
1. Criar schema `tenant_{slug}`
2. Copiar estrutura das tabelas do schema `public` ou `core`

Se você quiser criar manualmente para teste:
```sql
-- Criar schema de teste
SELECT public.create_tenant_schema('tenant_teste', gen_random_uuid());

-- Copiar estrutura de uma tabela (exemplo)
SELECT public.copy_table_structure('public', 'fin_duplicata_receber', 'tenant_teste');
```

---

## ✅ VERIFICAÇÃO FINAL

Após executar todos os SQLs, verifique:

### 1. **Funções RPC existem:**
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%tenant%'
ORDER BY routine_name;
```

**Deve retornar:**
- `create_tenant_schema`
- `copy_table_structure`
- `delete_tenant_schema`
- `exec_sql`
- `get_all_tenants_financial_metrics`
- `get_platform_financial_kpis`
- `get_platform_financial_timeline`
- `get_tenant_financial_metrics`
- `list_tenant_schemas`
- `schema_exists`

### 2. **Schema `cp` existe:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'cp'
ORDER BY table_name;
```

**Deve retornar:**
- `domains`
- `ledger_accounts`
- `ledger_entries`
- `system_events`
- `tenants`
- `user_tenant_roles`

---

## 🧪 TESTE COMPLETO

### Passo 1: Criar um Tenant de Teste

1. Rode o `/control` app:
   ```bash
   cd apps/control
   npm run dev
   ```

2. Acesse `http://localhost:3000/tenants`

3. Clique em "Criar Novo Tenant"

4. Preencha:
   - Nome: `ABC Turismo`
   - Slug: `abc`
   - Email do Admin: `admin@abc.com`
   - Nome do Admin: `Admin ABC`
   - Plano: `free`

5. Clique em "Criar Tenant"

### Passo 2: Verificar Schema Criado

```sql
-- Deve retornar 'tenant_abc'
SELECT * FROM public.list_tenant_schemas();

-- Deve retornar true
SELECT public.schema_exists('tenant_abc');
```

### Passo 3: Popular com Dados de Teste (Opcional)

```sql
-- Inserir duplicata a receber de teste
INSERT INTO tenant_abc.fin_duplicata_receber (
    tenant_id, marca, numero_duplicata, valor_original, valor_total,
    valor_pendente, valor_brl, moeda, data_emissao, data_vencimento,
    status
)
VALUES (
    (SELECT id FROM cp.tenants WHERE slug = 'abc'),
    'abc',
    'DUP-001',
    50000.00,
    50000.00,
    0,
    50000.00,
    'BRL',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    'recebida'
);
```

### Passo 4: Testar API Consolidada

```bash
curl http://localhost:3000/api/admin/financeiro/consolidado?periodo=mes_atual
```

**Deve retornar:**
```json
{
  "periodo": {
    "tipo": "mes_atual",
    "data_inicio": "2025-01-01T00:00:00Z",
    "data_fim": "2025-01-31T23:59:59Z"
  },
  "metricas_consolidadas": {
    "total_tenants": 1,
    "total_tenants_ativos": 1,
    "receitas_total": 50000,
    "despesas_total": 0,
    "lucro_total": 50000,
    "mrr_estimado": 50000,
    "arr_estimado": 600000
  },
  "metricas_por_tenant": [
    {
      "tenant_id": "...",
      "tenant_name": "ABC Turismo",
      "tenant_slug": "abc",
      "receitas_total": 50000,
      ...
    }
  ]
}
```

### Passo 5: Ver Dashboard

Acesse: `http://localhost:3000/financeiro`

Você deve ver:
- KPI cards com os valores
- Gráfico top 5 tenants
- Tabela com todos os tenants

---

## 🚨 TROUBLESHOOTING

### Erro: "function public.create_tenant_schema does not exist"
**Solução:** Execute o SQL do arquivo `supabase-rpc-functions.sql`

### Erro: "schema cp does not exist"
**Solução:** Verifique se o schema `cp` foi criado. Se não, procure a migration inicial.

### Erro: "relation fin_duplicata_receber does not exist"
**Solução:** As tabelas financeiras não foram criadas no schema do tenant. Execute o provisioning manualmente ou crie as tabelas.

### Dashboard mostra valores zerados
**Possíveis causas:**
1. Tenant não tem dados financeiros ainda
2. RPC functions não foram executadas
3. Período selecionado não tem dados

### Erro: "permission denied for function get_tenant_financial_metrics"
**Solução:** Execute os GRANTs no final do arquivo `supabase-financial-rpc-functions.sql`

---

## 📚 Próximos Passos

Após setup completo:

1. ✅ Criar tenants no `/control`
2. ✅ Popular com dados de teste ou aguardar dados reais
3. ✅ Acessar dashboard financeiro consolidado
4. ⏳ Deploy na Vercel (quando estiver pronto)
5. ⏳ Configurar DNS wildcard (produção)
6. ⏳ Adicionar gráficos de tendência temporal

---

## 📝 Referências

- **Control Plane:** `/apps/control`
- **Core App:** `/apps/core`
- **Financeiro App:** `/apps/financeiro`
- **Docs Multi-tenant:** `/MULTI_TENANT_ROUTING.md`
- **Docs Local Testing:** `/LOCAL_TESTING.md`
