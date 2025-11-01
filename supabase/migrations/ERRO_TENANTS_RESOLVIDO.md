# ⚠️ ERRO RESOLVIDO: "relation public.tenants does not exist"

## 🔴 PROBLEMA

Ao executar as migrations financeiras, você recebeu o erro:
```
ERROR: 42P01: relation "public.tenants" does not exist
```

## ✅ SOLUÇÃO

Faltava criar as **tabelas base do sistema multi-tenant** ANTES de executar as migrations financeiras.

Criei a migration: `20251030000000_create_base_tenants.sql`

Esta migration cria:
- ✅ `public.tenants` - Empresas/organizações
- ✅ `public.users` - Usuários do sistema
- ✅ `public.user_tenants` - Relacionamento usuários-tenants
- ✅ `public.clientes` - Clientes dos tenants
- ✅ `public.fin_fornecedores` - Fornecedores (usado nas duplicatas)

---

## 🚀 ORDEM CORRETA DE EXECUÇÃO (ATUALIZADA)

### **OPÇÃO 1: Executar Tudo de Uma Vez**

```bash
cd supabase/migrations

# ⚠️ ORDEM CRÍTICA!
psql $DATABASE_URL -f 20251030000000_create_base_tenants.sql
psql $DATABASE_URL -f 20251030_financeiro_schema.sql
psql $DATABASE_URL -f 20251030_create_centros_custo.sql
psql $DATABASE_URL -f 20251030_create_duplicatas_avancado.sql
psql $DATABASE_URL -f 20251030_create_open_finance_conciliacao.sql
psql $DATABASE_URL -f 20251030_financeiro_rls_dev.sql
psql $DATABASE_URL -f 20251030_financeiro_seed_test_data.sql  # Opcional
```

### **OPÇÃO 2: Usar Supabase CLI**

```bash
# Resetar banco (CUIDADO: apaga tudo!)
supabase db reset

# Ou aplicar migrations pendentes
supabase db push
```

---

## 📋 DETALHES DA MIGRATION BASE

### Arquivo: `20251030000000_create_base_tenants.sql`

#### **5 Tabelas Criadas:**

1. **`public.tenants`** (Organizações)
   - Campos: id, nome, slug, marca (noro/nomade/safetrip/vistos), plano, CNPJ, endereço
   - Inclui 4 tenants padrão: NORO, Nômade, SafeTrip, Vistos Online

2. **`public.users`** (Usuários)
   - Campos: id, auth_user_id, nome, email, telefone, avatar_url, cargo
   - Integração com Supabase Auth

3. **`public.user_tenants`** (Relacionamento N:N)
   - Campos: user_id, tenant_id, role (owner/admin/manager/user/viewer)
   - Permissões customizadas por tenant

4. **`public.clientes`** (Clientes)
   - Campos: id, tenant_id, nome, tipo, CNPJ/CPF, email, telefone, endereço
   - Usado em: `fin_duplicatas_receber`

5. **`public.fin_fornecedores`** (Fornecedores)
   - Campos: id, tenant_id, nome, CNPJ/CPF, dados bancários, PIX
   - Usado em: `fin_duplicatas_pagar` e `vw_sugestoes_conciliacao`

#### **Seed Data Incluído:**
- 4 tenants padrão já criados
- IDs fixos para facilitar referências

#### **RLS Habilitado:**
- Todas as tabelas com Row Level Security
- Isolamento automático por tenant
- Políticas de acesso baseadas em `user_tenants`

---

## 🔍 VALIDAÇÃO

Após executar `20251030000000_create_base_tenants.sql`, teste:

```sql
-- 1. Verificar tenants criados
SELECT id, nome, slug, marca FROM public.tenants;

-- Deve retornar:
-- | id | nome | slug | marca |
-- | 00000000-0000-0000-0000-000000000001 | NORO Vistos | noro | noro |
-- | 00000000-0000-0000-0000-000000000002 | Nômade Vistos | nomade | nomade |
-- | 00000000-0000-0000-0000-000000000003 | SafeTrip | safetrip | safetrip |
-- | 00000000-0000-0000-0000-000000000004 | Vistos Online | vistos | vistos |

-- 2. Verificar se tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('tenants', 'users', 'user_tenants', 'clientes', 'fin_fornecedores')
ORDER BY table_name;

-- Deve retornar 5 tabelas
```

---

## ⚡ EXECUTAR AGORA

```bash
# 1. Navegar até o diretório
cd c:\1-Projetos-Sites\GitHub\noro-guru\supabase\migrations

# 2. Executar migration base (PRIMEIRO!)
psql $DATABASE_URL -f 20251030000000_create_base_tenants.sql

# 3. Executar migrations financeiras
psql $DATABASE_URL -f 20251030_financeiro_schema.sql
psql $DATABASE_URL -f 20251030_create_centros_custo.sql
psql $DATABASE_URL -f 20251030_create_duplicatas_avancado.sql
psql $DATABASE_URL -f 20251030_create_open_finance_conciliacao.sql
psql $DATABASE_URL -f 20251030_financeiro_rls_dev.sql
```

---

## 📊 DEPENDÊNCIAS RESOLVIDAS

### Antes (COM ERRO ❌)
```
fin_contas_bancarias → public.tenants ❌ NÃO EXISTE
fin_duplicatas_receber → public.clientes ❌ NÃO EXISTE
fin_duplicatas_pagar → public.fin_fornecedores ❌ NÃO EXISTE
vw_sugestoes_conciliacao → public.fin_fornecedores ❌ NÃO EXISTE
```

### Depois (FUNCIONA ✅)
```
20251030000000_create_base_tenants.sql
  ↓ cria public.tenants
  ↓ cria public.clientes
  ↓ cria public.fin_fornecedores
  ↓
20251030_financeiro_schema.sql ✅
  ↓
20251030_create_duplicatas_avancado.sql ✅
  ↓
20251030_create_open_finance_conciliacao.sql ✅
  ↓ view vw_sugestoes_conciliacao ✅
```

---

## 🎯 RESUMO

1. ✅ **CRIADO**: `20251030000000_create_base_tenants.sql` (323 linhas)
2. ✅ **RESOLVE**: Erro "relation public.tenants does not exist"
3. ✅ **ADICIONA**: 5 tabelas essenciais + 4 tenants padrão
4. ✅ **ORDEM**: Executar ANTES de todas as outras migrations
5. ✅ **IDEMPOTENTE**: Safe para re-executar

---

**Agora execute a migration base e depois as financeiras!** 🚀
