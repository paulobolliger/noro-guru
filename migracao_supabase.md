# Migração Supabase → Appwrite: Introspecção e Planejamento

## 1. Queries SQL de Introspecção Completa

### Listar todos os schemas
```sql
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;
```

### Listar todas as tabelas (por schema)
```sql
SELECT table_schema, table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' ORDER BY table_schema, table_name;
```

### Listar todas as colunas, tipos de dados, constraints
```sql
SELECT table_schema, table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
ORDER BY table_schema, table_name, ordinal_position;
```

### Listar chaves primárias
```sql
SELECT
    kcu.table_schema,
    kcu.table_name,
    tco.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tco
JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tco.constraint_name
  AND kcu.constraint_schema = tco.constraint_schema
WHERE tco.constraint_type = 'PRIMARY KEY'
ORDER BY kcu.table_schema, kcu.table_name, tco.constraint_name;
```

### Listar chaves estrangeiras
```sql
SELECT
    tc.table_schema, tc.table_name, kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.constraint_schema = tc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_schema, tc.table_name;
```

### Listar índices
```sql
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
ORDER BY schemaname, tablename, indexname;
```

### Listar constraints (todas)
```sql
SELECT
    conrelid::regclass AS table,
    conname AS constraint_name,
    contype AS type,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
ORDER BY conrelid::regclass::text, conname;
```

### Listar enums
```sql
SELECT n.nspname AS enum_schema, t.typname AS enum_name, e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
ORDER BY enum_schema, enum_name, e.enumsortorder;
```

### Listar views
```sql
SELECT table_schema, table_name, view_definition
FROM information_schema.views
ORDER BY table_schema, table_name;
```

### Listar functions
```sql
SELECT routine_schema, routine_name, data_type, routine_definition
FROM information_schema.routines
WHERE routine_type='FUNCTION'
ORDER BY routine_schema, routine_name;
```

### Listar triggers
```sql
SELECT event_object_schema AS table_schema, event_object_table AS table_name, trigger_name, action_timing, event_manipulation, action_statement
FROM information_schema.triggers
ORDER BY table_schema, table_name, trigger_name;
```

### Listar policies RLS
```sql
SELECT
    pol.polname AS policy_name,
    sch.nspname AS schema_name,
    tab.relname AS table_name,
    pol.permissive,
    pol.cmd AS command,
    pol.roles,
    pg_get_expr(pol.qual, pol.polrelid) AS using_expression,
    pg_get_expr(pol.with_check, pol.polrelid) AS with_check_expression
FROM pg_policy pol
JOIN pg_class tab ON pol.polrelid = tab.oid
JOIN pg_namespace sch ON tab.relnamespace = sch.oid
ORDER BY sch.nspname, tab.relname, pol.polname;
```

### Listar buckets/storage (Supabase)
```sql
SELECT * FROM storage.buckets ORDER BY id;
```

### Mapear relações entre tabelas (FKs)
```sql
SELECT
    tc.table_schema, tc.table_name, kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.constraint_schema = tc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_schema, tc.table_name;
```

### Dependências entre módulos (views/functions/triggers)
```sql
SELECT
    d.refobjid::regclass AS dependent_object,
    d.classid::regclass AS dependent_type,
    d.objid::regclass AS referenced_object
FROM pg_depend d
WHERE d.refobjid != d.objid
ORDER BY dependent_object;
```

### Uso de tenant_id
```sql
SELECT table_schema, table_name, column_name
FROM information_schema.columns
WHERE column_name = 'tenant_id'
ORDER BY table_schema, table_name;
```

### Tabelas mais críticas (por tamanho)
```sql
SELECT
    schemaname,
    relname AS table_name,
    n_live_tup AS estimated_rows
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC
LIMIT 20;
```

### Tabelas mais acessadas (por seq_scan e idx_scan)
```sql
SELECT
    schemaname,
    relname AS table_name,
    seq_scan + idx_scan AS total_scans
FROM pg_stat_user_tables
ORDER BY total_scans DESC
LIMIT 20;
```

### Estrutura multi-tenant completa (tabelas, policies, constraints)
```sql
-- Tabelas com tenant_id
SELECT table_schema, table_name
FROM information_schema.columns
WHERE column_name = 'tenant_id'
ORDER BY table_schema, table_name;

-- Policies RLS por tenant
SELECT
    pol.polname AS policy_name,
    sch.nspname AS schema_name,
    tab.relname AS table_name,
    pg_get_expr(pol.qual, pol.polrelid) AS using_expression
FROM pg_policy pol
JOIN pg_class tab ON pol.polrelid = tab.oid
JOIN pg_namespace sch ON tab.relnamespace = sch.oid
WHERE pg_get_expr(pol.qual, pol.polrelid) ILIKE '%tenant_id%'
ORDER BY sch.nspname, tab.relname, pol.polname;
```

---

## 2. Próximos passos

Após rodar as queries acima, salve os resultados para análise. Com eles, será possível:
- Gerar o mapa ER completo
- Identificar tabelas/relacionamentos críticos
- Planejar a modelagem no Appwrite
- Avaliar gaps de features

---

## 3. Observações
- Algumas queries podem ser adaptadas conforme o uso de schemas customizados.
- Para buckets/storage, é necessário que o Supabase Storage esteja habilitado.
- Para dependências, views e funções, revise manualmente se necessário.

---

Após executar as queries, envie os resultados para análise e continuação do plano de migração.
