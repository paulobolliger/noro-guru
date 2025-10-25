# SQL Migrations — Control Plane (cp)

Objetivo: padronizar setup do schema `cp` (funções + permissões) e evitar problemas de cache do PostgREST e GRANTs entre ambientes.

## Pré‑requisitos

- Supabase: Settings → API → Exposed schemas deve conter ao menos `public, cp` (e opcionalmente `storage, graphql_public`).
- Após aplicar migrations: sempre recarregue o cache do PostgREST.

```sql
NOTIFY pgrst, 'reload schema';
-- (alguns projetos expõem também)
-- select pgrst.rebuild_schema_cache();
```

## Ordem sugerida (cp)

1. `infra/sql/006_create_cp_schema.sql` — cria o schema e estruturas base (se aplicável).
2. `infra/sql/007_seed_cp.sql` — dados de exemplo (opcional).
3. `infra/sql/008_cp_permissions_and_functions.sql` — funções `cp_dashboard_overview`, `cp_select_tenants` e GRANTs.

Obs.: existem scripts anteriores (001–005) para multi‑tenant; rode conforme a sua necessidade. O essencial para o control plane é o passo 3 acima.

## O que o 008 faz

- Recria `cp.cp_dashboard_overview()` como `SECURITY DEFINER` (conta usuários/eventos com fallback).
- Cria `cp.cp_select_tenants()` como `SECURITY DEFINER` (lista tenants sem depender de permissões indiretas).
- Concede `USAGE/SELECT` no schema `cp` (inclusive `ALTER DEFAULT PRIVILEGES`) a `anon, authenticated, service_role`.
- Concede baseline no schema `auth` para `service_role` (evita "permission denied" indireto em `auth.users`).
- Dispara `NOTIFY pgrst, 'reload schema';` para recarregar cache do PostgREST.

## Smoke tests

Execute no SQL Editor:

```sql
-- cp exposto e cache ok
NOTIFY pgrst, 'reload schema';

-- leitura direta
default: select * from cp.tenants limit 1;

-- RPCs
select * from cp.cp_select_tenants();
select * from cp.cp_dashboard_overview();
```

Se todas retornarem (mesmo que sem linhas), o backend está correto.

## Troubleshooting rápido

- `public.cp.*` / `PGRST202`: o schema `cp` não está exposto ou o cache não recarregou. Verifique Exposed schemas e rode `NOTIFY`.
- `permission denied for table users`: a chamada direta toca `auth.users` via defaults/triggers/FKs. Use a RPC `cp_select_tenants()` (SECURITY DEFINER) ou conceda:

```sql
grant usage on schema auth to service_role;
grant select on all tables in schema auth to service_role;
alter default privileges in schema auth grant select on tables to service_role;
```

- Conceder permissões a todos os schemas `tenant_%` (se aplicável):

```sql
do $$
declare tenant_schema text; begin
  for tenant_schema in
    select s.schema_name from information_schema.schemata s
    where s.schema_name like 'tenant\_%' escape '\\'
  loop
    execute format('grant usage on schema %I to service_role;', tenant_schema);
    execute format('grant select on all tables in schema %I to service_role;', tenant_schema);
    execute format('alter default privileges in schema %I grant select on tables to service_role;', tenant_schema);
  end loop;
end $$;
```

Após qualquer ajuste de permissão, rode novamente:

```sql
NOTIFY pgrst, 'reload schema';
```

## Frontend (referência)

- O client usa `supabase.schema('cp')` e helpers que evitam duplicar `cp.`:
  - `lib/supabase/cp.ts` → `fromCp(table)`, `rpcCp(fn)`, `getDashboardOverview()`, `getTenants()`.
- Páginas:
  - `app/control/dashboard/page.tsx` → `getDashboardOverview()`
  - `app/control/tenants/page.tsx` → `getTenants()`
  - `app/control/billing/page.tsx` → `getTenants()`

Se trocar/renomear funções, lembre de ajustar os helpers e rodar `NOTIFY` para recarregar o cache do PostgREST.
