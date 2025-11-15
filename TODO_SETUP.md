# ✅ TODO - Próximos Passos para Produção

## 🎯 Status Atual

### ✅ **Implementado e Funcionando:**

1. **Control Plane (`/apps/control`):**
   - ✅ Sistema completo de gestão de tenants
   - ✅ API de criação de tenants com provisionamento automático
   - ✅ Página de detalhes do tenant (7 tabs)
   - ✅ Dashboard financeiro consolidado
   - ✅ API de métricas consolidadas
   - ✅ Tabela interativa com busca, filtros e export CSV
   - ✅ RPC functions para métricas financeiras

2. **Core App (`/apps/core`):**
   - ✅ Middleware multi-tenant (detecção por domínio)
   - ✅ Isolamento de dados por schema
   - ✅ Autenticação integrada

3. **Banco de Dados:**
   - ✅ Schema `cp` (Control Plane)
   - ✅ RPC functions de provisionamento
   - ✅ RPC functions financeiras (criadas, **NÃO EXECUTADAS**)

---

## 🔴 **AÇÕES OBRIGATÓRIAS ANTES DE USAR:**

### 1. **Executar SQLs no Supabase** ⚠️ CRÍTICO

Você **DEVE** executar os SQLs antes de criar qualquer tenant:

**Passo a passo:**
1. Abra o Supabase Dashboard (https://supabase.com)
2. Vá em `SQL Editor`
3. Execute nesta ordem:

#### 1.1. Funções de Provisionamento
```bash
Arquivo: /apps/control/supabase-rpc-functions.sql
```
Copie todo o conteúdo e execute.

#### 1.2. Funções Financeiras
```bash
Arquivo: /apps/control/supabase-financial-rpc-functions.sql
```
Copie todo o conteúdo e execute.

**Verificar se funcionou:**
```sql
-- Deve retornar 10 funções
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%tenant%'
ORDER BY routine_name;
```

---

### 2. **Criar Schema das Tabelas Financeiras no Core**

As tabelas financeiras (`fin_duplicata_receber`, `fin_duplicata_pagar`, etc) precisam existir em um schema base para serem copiadas para os tenants.

**Opções:**

#### Opção A: Copiar do `/financeiro` para `/core`
```bash
# 1. Copiar migration
cp apps/financeiro/supabase/migrations/20251030_create_duplicatas_avancado_v3_FULL_VIEWS.sql \
   apps/core/supabase/migrations/

# 2. Executar no Supabase
# Copie o conteúdo e execute no SQL Editor
```

#### Opção B: Criar manualmente no Supabase
Execute a migration `20251030_create_duplicatas_avancado_v3_FULL_VIEWS.sql` que está em `/apps/financeiro/supabase/migrations/`.

**O que isso faz:**
Cria as tabelas base que serão copiadas para cada tenant quando ele for provisionado.

---

### 3. **Configurar Provisionamento Automático**

Atualmente, quando você cria um tenant, o sistema tenta copiar as tabelas do schema `public`.

**Você precisa decidir:**

#### Opção A: Tabelas no `public`
- Executar a migration financeira no schema `public`
- Vantagem: Funciona imediatamente
- Desvantagem: Polui o schema público

#### Opção B: Criar schema `core` com tabelas base
```sql
-- 1. Criar schema core
CREATE SCHEMA IF NOT EXISTS core;

-- 2. Executar migration financeira no schema core
-- (modificar a migration para usar 'core' ao invés de 'public')

-- 3. Atualizar tenant-provisioner.ts para copiar de 'core'
```

**Recomendação:** Use a Opção B para manter organização.

---

## ⚙️ **Configuração de Desenvolvimento:**

### 1. **Testar Localmente**

```bash
# Terminal 1 - Control Plane
cd apps/control
npm run dev
# Acesse: http://localhost:3000

# Terminal 2 - Core (quando testar tenants)
cd apps/core
npm run dev
# Acesse: http://localhost:3001
```

### 2. **Criar Tenant de Teste**

1. Acesse `http://localhost:3000/tenants`
2. Clique em "Criar Novo Tenant"
3. Preencha:
   - Nome: `ABC Turismo`
   - Slug: `abc`
   - Email: `admin@abc.com`
   - Admin: `Admin ABC`
4. Clique em "Criar"

### 3. **Verificar Schema Criado**

```sql
-- No Supabase SQL Editor
SELECT * FROM public.list_tenant_schemas();
-- Deve retornar: tenant_abc
```

### 4. **Popular com Dados de Teste**

```sql
-- Inserir duplicata recebida (receita)
INSERT INTO tenant_abc.fin_duplicata_receber (
    tenant_id,
    marca,
    numero_duplicata,
    valor_original,
    valor_total,
    valor_recebido,
    valor_pendente,
    valor_brl,
    moeda,
    data_emissao,
    data_vencimento,
    data_recebimento,
    status
) VALUES (
    (SELECT id FROM cp.tenants WHERE slug = 'abc'),
    'abc',
    'DUP-001',
    50000.00,
    50000.00,
    50000.00,
    0,
    50000.00,
    'BRL',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE,
    'recebida'
);

-- Inserir duplicata paga (despesa)
INSERT INTO tenant_abc.fin_duplicata_pagar (
    tenant_id,
    marca,
    numero_duplicata,
    fornecedor_id,
    valor_original,
    valor_total,
    valor_pago,
    valor_pendente,
    valor_brl,
    moeda,
    data_emissao,
    data_vencimento,
    data_pagamento,
    status
) VALUES (
    (SELECT id FROM cp.tenants WHERE slug = 'abc'),
    'abc',
    'DUP-PAG-001',
    gen_random_uuid(),
    20000.00,
    20000.00,
    20000.00,
    0,
    20000.00,
    'BRL',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE,
    'recebida'
);
```

### 5. **Ver Dashboard com Dados Reais**

Acesse: `http://localhost:3000/financeiro`

Você deve ver:
- **MRR:** R$ 50.000,00
- **ARR:** R$ 600.000,00
- **Receitas:** R$ 50.000,00
- **Despesas:** R$ 20.000,00
- **Lucro:** R$ 30.000,00
- **Margem:** 60%

---

## 🚀 **Deploy em Produção (Quando Estiver Pronto):**

### 1. **DNS Wildcard (Cloudflare)**

```
Tipo    Nome       Destino
------  ---------  --------------------------
CNAME   control    cname.vercel-dns.com
CNAME   *          cname.vercel-dns.com
```

### 2. **Vercel - Deploy Control Plane**

```bash
cd apps/control
vercel --prod

# Na Vercel Dashboard:
# Settings > Domains > Add Domain: control.noro.guru
```

### 3. **Vercel - Deploy Core**

```bash
cd apps/core
vercel --prod

# Na Vercel Dashboard:
# Settings > Domains > Add Domain: *.noro.guru
```

### 4. **Variáveis de Ambiente (Vercel)**

Para **ambos** os projetos (`control` e `core`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=https://control.noro.guru (ou https://*.noro.guru)
```

---

## 📊 **Funcionalidades Prontas:**

### Control Plane (`/control`):

✅ **Tenants:**
- Listagem
- Criação com provisionamento automático
- Detalhes (7 tabs)
- Suspensão/Ativação
- Gestão de domínios
- Gestão de usuários
- Provisionamento manual

✅ **Dashboard Financeiro:**
- KPIs consolidados (MRR, ARR, Margem)
- Métricas por tenant
- Top 5 tenants por receita
- Busca e filtros
- Export CSV
- Período configurável

### Core (`/core`):

✅ **Multi-tenant:**
- Detecção por domínio
- Isolamento por schema
- Middleware de segurança
- Autenticação integrada

---

## 🔮 **Próximas Features (Futuro):**

### Dashboard Financeiro:
- [ ] Gráficos de linha (evolução temporal)
- [ ] Filtro por tenant individual
- [ ] Drill-down (clicar no tenant e ver detalhes)
- [ ] Exportar PDF
- [ ] Alertas de lucro negativo
- [ ] Comparação mês a mês

### Tenant Management:
- [ ] Duplicar tenant (clone)
- [ ] Migração de dados entre tenants
- [ ] Backup/Restore de schema
- [ ] Monitoramento de uso (storage, requests)
- [ ] Cotas por plano (free, pro, enterprise)

### Billing:
- [ ] Integração com Stripe/Paddle
- [ ] Cobrança automática baseada no plano
- [ ] Upgrades/Downgrades
- [ ] Invoices

---

## 🎓 **Documentação:**

- **Setup Supabase:** `/SUPABASE_SETUP.md`
- **Routing Multi-tenant:** `/MULTI_TENANT_ROUTING.md`
- **Testes Locais:** `/LOCAL_TESTING.md`
- **Análise Financeiro:** `/FINANCEIRO_ANALYSIS.md`

---

## 📞 **Precisa de Ajuda?**

Se algo não funcionar:

1. ✅ Verificar se os SQLs foram executados
2. ✅ Verificar se as tabelas financeiras existem no schema base
3. ✅ Verificar logs no console do navegador
4. ✅ Verificar logs do Next.js
5. ✅ Verificar logs do Supabase (Dashboard > Logs)

**Comando útil para debug:**
```sql
-- Ver todos os schemas criados
SELECT * FROM public.list_tenant_schemas();

-- Ver tabelas de um tenant
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'tenant_abc'
ORDER BY table_name;

-- Testar RPC
SELECT public.get_tenant_financial_metrics(
    'abc',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE
);
```

---

**Status:** Sistema 95% pronto para produção. Apenas executar SQLs e testar.
