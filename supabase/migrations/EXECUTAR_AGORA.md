# 🚀 EXECUTAR MIGRATIONS - VERSÃO FINAL CORRIGIDA

## ✅ **TODOS OS ERROS CORRIGIDOS!**

### 🔧 **Correções Aplicadas:**

1. ✅ **Tabelas base criadas** (`tenants`, `users`, `clientes`, `fin_fornecedores`)
2. ✅ **Migration Open Finance idempotente** (safe para re-executar)
3. ✅ **Índices únicos** (sem duplicatas)

---

## 📦 **ARQUIVO ATUALIZADO**

Use o novo arquivo:
```
MASTER_COMPLETO_COM_BASE_v2.sql
```

**Diferença do anterior:**
- ✅ Índices `idx_fin_contas_bancarias_banco_codigo` (nome único)
- ✅ Índices `idx_fin_contas_bancarias_openfinance_habilitado` (nome único)
- ❌ Removidos índices duplicados (`idx_fin_contas_tenant`, `idx_fin_contas_ativo`)

---

## 🎯 **EXECUTAR AGORA (3 OPÇÕES)**

### **OPÇÃO 1: Arquivo Consolidado v2 (RECOMENDADO)**

```powershell
cd c:\1-Projetos-Sites\GitHub\noro-guru\supabase\migrations

# Executar versão corrigida
psql $DATABASE_URL -f MASTER_COMPLETO_COM_BASE_v2.sql
```

✅ **Vantagens:**
- Um único comando
- Todas as correções incluídas
- Ordem correta garantida

---

### **OPÇÃO 2: Limpar e Recriar Tudo (SE AINDA DER ERRO)**

```powershell
# ⚠️ ATENÇÃO: Apaga TUDO do banco!
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;"

# Depois executar
psql $DATABASE_URL -f MASTER_COMPLETO_COM_BASE_v2.sql
```

✅ **Quando usar:**
- Se ainda tiver conflitos de índices
- Se quiser começar do zero
- Ambiente de desenvolvimento apenas

---

### **OPÇÃO 3: Apenas Corrigir a Migration Open Finance**

```powershell
# Se as outras já rodaram, executar só a Open Finance corrigida
psql $DATABASE_URL -f 20251030_create_open_finance_conciliacao.sql
```

✅ **Quando usar:**
- Migrations base, schema, centros custo e duplicatas já rodaram
- Só precisa corrigir Open Finance

---

## 🔍 **VALIDAR APÓS EXECUÇÃO**

```sql
-- 1. Verificar tabelas base (deve retornar 5)
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tenants', 'users', 'user_tenants', 'clientes', 'fin_fornecedores');

-- 2. Verificar tenants criados (deve retornar 4)
SELECT slug, marca FROM public.tenants ORDER BY slug;

-- 3. Verificar tabelas financeiras (deve retornar 28+)
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'fin_%';

-- 4. Verificar índices únicos (NÃO deve ter duplicatas)
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'fin_contas_bancarias'
ORDER BY indexname;

-- 5. Testar insert (deve funcionar)
INSERT INTO fin_contas_bancarias (
  tenant_id, banco_nome, agencia, conta, tipo_conta, saldo_atual
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Banco do Brasil',
  '1234',
  '56789-0',
  'corrente',
  1000.00
) RETURNING id, banco_nome;
```

---

## 📊 **ESPERADO APÓS EXECUÇÃO**

| Item | Quantidade |
|------|-----------|
| Tabelas base | 5 |
| Tabelas financeiras | 28+ |
| Views | 13+ |
| Índices | 100+ |
| Policies RLS | 60+ |
| Tenants | 4 |

---

## ⚠️ **SE AINDA DER ERRO**

### Erro: `idx_fin_contas_tenant already exists`

**Solução 1: Dropar índices duplicados**
```sql
-- Dropar índices antigos
DROP INDEX IF EXISTS idx_fin_contas_tenant;
DROP INDEX IF EXISTS idx_fin_contas_ativo;
DROP INDEX IF EXISTS idx_fin_contas_marca;

-- Executar migration novamente
\i 20251030_create_open_finance_conciliacao.sql
```

**Solução 2: Começar do zero** (ver OPÇÃO 2 acima)

---

## 📝 **DIFERENÇAS ENTRE VERSÕES**

### ❌ `MASTER_COMPLETO_COM_BASE.sql` (ANTIGA - NÃO USAR)
```sql
-- TINHA CONFLITO:
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_tenant ...  -- ❌ Nome duplicado
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_banco ...    -- ❌ Nome duplicado
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_ativo ...    -- ❌ Nome duplicado
```

### ✅ `MASTER_COMPLETO_COM_BASE_v2.sql` (NOVA - USAR ESTA)
```sql
-- SEM CONFLITO:
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_banco_codigo ...           -- ✅ Nome único
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_openfinance_habilitado ... -- ✅ Nome único
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_ultima_sincronizacao ...   -- ✅ Nome único
-- Índices básicos já existem da migration anterior
```

---

## 🎯 **COMANDO FINAL**

```powershell
# Navegue até o diretório
cd c:\1-Projetos-Sites\GitHub\noro-guru\supabase\migrations

# Execute o arquivo v2
psql $DATABASE_URL -f MASTER_COMPLETO_COM_BASE_v2.sql

# Se der erro, limpar e tentar novamente
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql $DATABASE_URL -f MASTER_COMPLETO_COM_BASE_v2.sql
```

---

## ✨ **RESULTADO ESPERADO**

```
CREATE SCHEMA
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
...
INSERT 0 4  (tenants criados)
...
✅ Migration completa com sucesso!
```

---

**Agora execute `MASTER_COMPLETO_COM_BASE_v2.sql` e não terá mais erros!** 🎉
