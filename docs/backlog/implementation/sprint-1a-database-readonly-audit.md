# Sprint 1A — Auditoria Read-only Do Banco PostgreSQL Atual

Data de referencia: 2026-05-27

Status: auditoria read-only concluida.

Fonte arquitetural vigente:

- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/backlog/implementation/noro-foundation-sprint-plan.md`
- `docs/SPRINT_STATUS.md`

Observacao operacional: este documento nao transforma o banco atual em arquitetura canonica. O banco auditado contem estruturas Supabase legadas/transicionais e modelos historicos que precisam ser classificados antes de qualquer migration nova.

## 1. Resumo executivo

Foi encontrada configuracao `DATABASE_URL` em arquivos `.env.local` do projeto, apontando para PostgreSQL em `noro_guru_db`. A conexao foi realizada com sucesso usando somente consultas de leitura e transacao `begin read only`.

O banco auditado e grande e carrega forte heranca Supabase: schemas `auth`, `storage`, `realtime`, `supabase_migrations`, `vault`, `graphql`/`graphql_public`, alem de tabelas de negocio em `public`, `cp` e `billing`. Tambem ha objetos que parecem refletir fases anteriores do produto: CRM, financeiro, billing, sites, vistos, produtos, propostas/orcamentos e tabelas multi-tenant.

Risco principal: criar schemas Drizzle ou migrations novas por cima deste banco sem antes separar modelo canonico NORO, residuos Supabase e estruturas reaproveitaveis. O proximo passo recomendado e a Sprint 1B como desenho/mapeamento de schema canonico, sem rodar migrations ainda.

## 2. Configuracao de conexao encontrada

Valores sensiveis foram mascarados e nao foram registrados.

| Origem | `DATABASE_URL` | Tipo | Host mascarado | Banco | Usuario mascarado | Ambiente aparente | Conexao |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `.env.local` | encontrada | PostgreSQL | `45.***.***.173` | `noro_guru_db` | `no***r` | local apontando para VPS/provavel ambiente compartilhado | sim |
| `apps/control/.env.local` | encontrada | PostgreSQL | `45.***.***.173` | `noro_guru_db` | `no***r` | local apontando para VPS/provavel ambiente compartilhado | nao testada separadamente |
| `apps/core/.env.local` | encontrada | PostgreSQL | `45.***.***.173` | `noro_guru_db` | `no***r` | local apontando para VPS/provavel ambiente compartilhado | nao testada separadamente |
| `apps/billing/.env.local` | encontrada | PostgreSQL | `45.***.***.173` | `noro_guru_db` | `no***r` | local apontando para VPS/provavel ambiente compartilhado | nao testada separadamente |
| `apps/financeiro/.env.local` | encontrada | PostgreSQL | `45.***.***.173` | `noro_guru_db` | `no***r` | local apontando para VPS/provavel ambiente compartilhado | nao testada separadamente |
| `apps/core/.env.example` | encontrada | PostgreSQL | `45.***.***.173` | `noro_guru_db` | `no***r` | example com valor real aparente | nao testada |
| `apps/web/.env.local` | nao encontrada | n/a | n/a | n/a | n/a | local | n/a |
| `apps/sites/.env.local` | nao encontrada | n/a | n/a | n/a | n/a | local | n/a |
| `apps/visa-api/.env.local` | nao encontrada | n/a | n/a | n/a | n/a | local | n/a |
| `process.env` | nao encontrada | n/a | n/a | n/a | n/a | shell atual | n/a |

Conexao auditada:

- banco atual: `noro_guru_db`;
- usuario atual: mascarado como `no***r`;
- porta: `5432`;
- driver usado: pacote `postgres` ja existente no workspace;
- modo: somente leitura, com `begin read only` e `rollback`.

## 3. Estado de `packages/db` e Drizzle

`packages/db/` existe e esta configurado como bootstrap de conexao PostgreSQL/Drizzle:

- `packages/db/index.ts` cria client `postgres` e `drizzle(client)`;
- `packages/db/index.ts` usa `getDatabaseUrl()` de `@noro/config`;
- `packages/config/index.ts` define `DATABASE_URL` como variavel obrigatoria e registra referencia esperada para `noro_guru_db`;
- `packages/db/package.json` depende de `drizzle-orm` e `postgres`.

O que nao foi encontrado:

- nenhum `drizzle.config.ts/js/mjs/cjs`;
- nenhum diretorio de migrations Drizzle;
- nenhum schema Drizzle com `pgTable`;
- nenhum comando `db:migrate`, `drizzle-kit`, `drizzle push` ou equivalente nos scripts de raiz;
- nenhuma tabela de migrations Drizzle no banco auditado.

Comandos perigosos a evitar:

- qualquer `drizzle push` futuro contra este banco antes de backup/mapeamento;
- qualquer migration Supabase em `supabase/migrations/`;
- qualquer script que execute `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `DELETE` ou `UPDATE` sem plano aprovado.

## 4. Inventario read-only do banco

Resumo quantitativo:

| Item | Quantidade |
| --- | ---: |
| Schemas listados | 18 |
| Objetos em schemas nao internos | 207 |
| Colunas | 2826 |
| Constraints | 1598 |
| Foreign keys | 258 |
| Indexes | 626 |
| Enums | 46 |
| Triggers | 92 |
| Tabelas de migrations encontradas | 4 |

Schemas encontrados:

```txt
auth
billing
cp
extensions
graphql
graphql_public
information_schema
pg_catalog
pg_toast
pgbouncer
pgsodium
public
realtime
staging_vistos
storage
supabase_migrations
tenant_abc
vault
```

Objetos por schema relevante:

| Schema | Total | Objetos principais |
| --- | ---: | --- |
| `auth` | 23 | `users`, `identities`, `sessions`, `refresh_tokens`, `mfa_*`, `sso_*`, `schema_migrations` e demais tabelas padrao de Supabase Auth. |
| `billing` | 5 | `plans`, `subscriptions`, `invoices`, `payment_methods`, `transactions`. Contem referencias a `stripe_*` e `cielo_*` em colunas. |
| `cp` | 47 | `tenants`, `user_tenant_roles`, `leads`, `lead_stages`, `payments`, `billing_events`, `ledger_accounts`, `ledger_entries`, `plans`, `subscriptions`, `invoices`, `produtos`, `webhooks`, `stripe_webhook_logs`, views operacionais. |
| `extensions` | 2 | `pg_stat_statements`, `pg_stat_statements_info`. |
| `public` | 108 | `tenants`, `users`, `user_tenants`, `leads`, `clientes`, `noro_clientes`, `noro_leads`, `noro_orcamentos`, `noro_orcamentos_itens`, `produtos`, `noro_fornecedores`, `sites`, muitas tabelas `fin_*`, tabelas `visa_*`, views financeiras e comerciais. |
| `realtime` | 9 | `messages`, particoes historicas de `messages`, `subscription`, `schema_migrations`. |
| `staging_vistos` | 1 | `visa_info`. |
| `storage` | 8 | `buckets`, `objects`, `migrations`, objetos S3/vector. |
| `supabase_migrations` | 2 | `schema_migrations`, `seed_files`. |
| `vault` | 2 | `secrets`, `decrypted_secrets` view. |

Tabelas/views de migration registradas:

```txt
auth.schema_migrations
realtime.schema_migrations
storage.migrations
supabase_migrations.schema_migrations
```

Enums observados por area:

- Supabase/Auth: `auth.aal_level`, `auth.factor_status`, `auth.factor_type`, `auth.oauth_*`, `auth.one_time_token_type`.
- Billing: `billing.billing_interval`, `billing.payment_method_type`, `billing.payment_provider`, `billing.payment_status`, `billing.subscription_status`.
- Public/financeiro: `billing_cycle`, `billing_status`, `fin_*`, `gateway_*`, `payment_method`, `tenant_status`, `user_status`, `moeda`, `marca`, entre outros.
- Supabase Storage/Realtime: `storage.buckettype`, `realtime.action`, `realtime.equality_op`.

## 5. Possiveis residuos Supabase

Classificacao: `possivel_legado_supabase`. Nenhum item deve ser apagado automaticamente.

| Objeto | Evidencia | Observacao |
| --- | --- | --- |
| `auth.*` | schema padrao Supabase Auth com `auth.users`, `identities`, `sessions`, `refresh_tokens`, `mfa_*`, `sso_*` | Supabase Auth e legado/transicional; Logto e direcao vigente. |
| `storage.*` | `buckets`, `objects`, `migrations`, objetos S3/vector | Pode sustentar runtime legado de logos/sites/arquivos; nao remover sem migracao. |
| `realtime.*` | `subscription`, `messages`, particoes e `schema_migrations` | Residuo de Supabase Realtime. |
| `supabase_migrations.*` | `schema_migrations`, `seed_files` | Historico de migrations Supabase; nao usar como plano novo. |
| `vault.*` | `secrets`, `decrypted_secrets` | Componente Supabase/Vault; pode conter dependencia operacional. |
| `graphql`, `graphql_public`, `pgsodium`, `pgbouncer` | schemas de suporte Supabase/infra | Classificar como ambiente restaurado/legado. |
| `public.users`, `public.tenants`, `public.user_tenants` | modelo multi-tenant historico em `public` | Pode ser util como referencia, mas nao e automaticamente canonico. |
| `public.noro_*`, `public.fin_*`, `public.visa_*` | batem com temas e snapshots de migrations Supabase antigas | Reaproveitamento deve passar por mapeamento Drizzle, tenant e Logto. |

## 6. Lacunas contra a arquitetura NORO

| Dominio | Status | Evidencia | Observacao |
| --- | --- | --- | --- |
| Tenants | parcial | `cp.tenants`, `public.tenants`, schema `tenant_abc` | Ha mais de um modelo. Precisa escolher modelo canonico antes de codar. |
| Users | legado/parcial | `auth.users`, `public.users`, `cp.v_users`, `cp.control_plane_users` | `auth.users` e Supabase; Logto ainda nao esta refletido como schema canonico. |
| Memberships | parcial | `public.user_tenants`, `cp.user_tenant_roles` | Falta confirmar tabela canonica `tenant_memberships` ou equivalente. |
| Roles | parcial | `cp.user_tenant_roles`, enums/colunas de role em modelos antigos | Roles existem, mas precisam ser normalizadas para Logto + tenant context. |
| CRM NORO | parcial | `cp.leads`, `cp.lead_stages`, `cp.contacts`, `cp.notes`, `cp.tasks` | Parece existir base Control Plane, mas nao deve ser assumida como canonica sem schema Drizzle. |
| CRM tenant | parcial/legado | `public.leads`, `public.clientes`, `public.noro_leads`, `public.noro_clientes` | Ha sobreposicao de modelos. Precisa consolidar. |
| Produtos | parcial | `cp.produtos`, `cp.produtos_precos`, `public.produtos`, `produtos_*` | Existem modelos de produto globais e tenant; falta decisao canonica. |
| Fornecedores | parcial | `public.noro_fornecedores`, `public.fin_fornecedores` | Existem duas linhas de fornecedores; precisa separar fornecedor operacional vs financeiro. |
| Propostas | parcial/legado | `public.noro_orcamentos`, `public.noro_orcamentos_itens` | Estrutura existe, mas deve ser revalidada com quote builder canonico e snapshot financeiro. |
| Payments | parcial/legado | `cp.payments`, `billing.transactions`, `public.fin_gateway_transacoes` | Ha objetos de pagamento, mas com Stripe/Cielo/gateway generico legado. |
| Billing NORO | parcial/legado | `billing.*`, `cp.plans`, `cp.subscriptions`, `cp.invoices`, `cp.billing_events` | Billing existe, mas carrega Stripe/Cielo. Asaas ainda nao aparece como provider canonico. |
| Billing tenant | parcial/legado | `public.fin_gateway_*`, `fin_duplicatas_*`, `fin_receitas` | Financeiro de tenant existe, mas precisa modelo Asaas/checkout proprio/ledger minimo. |
| Ledger | parcial | `cp.ledger_accounts`, `cp.ledger_entries`; `fin_transacoes` | Ledger existe em forma minima, mas nao cobre todos os eventos fundacionais aprovados. |
| Sites | parcial/legado | `public.sites`, `public.noro_domains`, `cp.domains` | Runtime existe, mas deve ser conectado ao funil canonico depois de CRM/propostas/checkout. |
| Logto | ausente no banco | Nenhum schema/tabela Logto identificado; `packages/auth` e direcao no codigo/docs | Auth vigente deve integrar Logto sem reaproveitar Supabase Auth como base nova. |
| Supabase legado | existente | schemas `auth`, `storage`, `realtime`, `supabase_migrations`, `vault` | Deve ser tratado como transicional/legado, nao como arquitetura futura. |

## 7. Riscos

- Confundir o schema Supabase restaurado com arquitetura atual e perpetuar `auth.users`/RLS Supabase como base nova.
- Criar Drizzle por cima de banco heterogeneo, com modelos duplicados em `cp`, `public`, `billing` e schemas Supabase.
- Usar um banco que parece VPS/compartilhado como ambiente de teste de migrations.
- Rodar migration errada, principalmente Supabase migrations congeladas ou futuro `drizzle push`, e alterar dados legados uteis.
- Perder historico de negocio ainda util em CRM, financeiro, propostas, sites e vistos ao classificar tudo como lixo.
- Reaproveitar billing antigo com Stripe/Cielo em vez de modelar Asaas como provider vigente.
- Misturar `apps/control` e `apps/core` se o schema nao separar CRM/billing/financeiro NORO de CRM/billing/financeiro tenant.
- Comecar checkout/ledger antes de decidir o minimo de `tenant_id`, membership, roles e autoria dos eventos financeiros.

## 8. Recomendacoes

Pode avancar para Sprint 1B?

- Sim, apenas como desenho tecnico e mapeamento de schema canonico Logto/PostgreSQL/Drizzle.
- Nao e seguro avancar para migrations ou `drizzle push` contra este banco sem preparacao adicional.

Antes de qualquer migration:

- criar ou confirmar banco dev/staging isolado para testes;
- fazer backup/dump do banco atual se ele contiver dados uteis;
- mapear tabelas Supabase e tabelas de negocio reaproveitaveis;
- decidir modelo canonico para `tenants`, `users`, `memberships`, `roles`;
- decidir se o schema canonico ficara em `public`, `cp` ou outro schema controlado por Drizzle;
- criar schema Drizzle no repositorio antes de qualquer execucao;
- manter Supabase congelado e nao rodar `supabase/migrations`;
- confirmar se `.env.example` pode continuar expondo estrutura real de host/database/usuario mascaravel ou se deve virar placeholder.

Recomendacao pratica para Sprint 1B:

1. Produzir `schema-map` read-only comparando `cp.tenants`, `public.tenants`, `public.users`, `public.user_tenants`, `cp.user_tenant_roles` e `auth.users`.
2. Desenhar tabelas canonicas Drizzle para `tenants`, `users`/perfil interno, `tenant_memberships`, `roles` e ponte legado, sem rodar migration.
3. Validar com Paulo se o banco atual sera fonte de migracao, ambiente legado ou somente referencia historica.

## 9. Queries ou comandos executados

Comandos de leitura de arquivos/configuracao:

```txt
Get-Content -Raw docs/ai/AGENTS.README.md
Get-Content -Raw docs/SPRINT_STATUS.md
Get-Content -Raw docs/backlog/implementation/noro-foundation-sprint-plan.md
Get-Content -Raw docs/backlog/implementation/sprint-0-alinhamento-documental-decisoes.md
Get-Content -Raw docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md
Get-Content -Raw docs/architecture/current-state.md
Get-Content -Raw docs/architecture/data-auth-transition.md
Get-Content -Raw docs/architecture/multi-tenant-current-model.md
Get-Content -Raw docs/architecture/billing-asaas-migration-plan.md
Get-Content -Raw docs/analise-documentacao-md-projeto.md
Get-Content -Raw docs/codebase-unused-legacy-audit.md
Get-Content -Raw scripts/README.md
rg --files -g '.env*' -g '!node_modules' -g '!**/.next/**' -g '!dist' -g '!build'
rg -n "DATABASE_URL|drizzle|pgTable|migrate|migration|push" package.json packages apps scripts -g '!node_modules' -g '!**/.next/**' -g '!dist' -g '!build'
Get-ChildItem -Recurse -LiteralPath packages/db
Get-Content -Raw packages/db/package.json
Get-Content -Raw packages/db/index.ts
Get-Content -Raw package.json
Get-Content -Raw packages/config/index.ts
```

Consultas read-only executadas no PostgreSQL:

```sql
begin read only;

select current_database() as current_database,
       current_user as current_user,
       inet_server_addr()::text as server_addr,
       inet_server_port() as server_port;

select schema_name
from information_schema.schemata
order by schema_name;

select table_schema, table_name, table_type
from information_schema.tables
where table_schema not in ('pg_catalog', 'information_schema')
order by table_schema, table_name;

select table_schema, table_name
from information_schema.views
where table_schema not in ('pg_catalog', 'information_schema')
order by table_schema, table_name;

select table_schema, table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema not in ('pg_catalog', 'information_schema')
order by table_schema, table_name, ordinal_position;

select tc.table_schema, tc.table_name, tc.constraint_name, tc.constraint_type
from information_schema.table_constraints tc
where tc.table_schema not in ('pg_catalog', 'information_schema')
order by tc.table_schema, tc.table_name, tc.constraint_name;

select tc.table_schema, tc.table_name, tc.constraint_name, kcu.column_name,
       ccu.table_schema as foreign_table_schema,
       ccu.table_name as foreign_table_name,
       ccu.column_name as foreign_column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
 and ccu.table_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema not in ('pg_catalog', 'information_schema')
order by tc.table_schema, tc.table_name, tc.constraint_name, kcu.column_name;

select schemaname, tablename, indexname
from pg_indexes
where schemaname not in ('pg_catalog', 'information_schema')
order by schemaname, tablename, indexname;

select n.nspname as schema_name, t.typname as enum_name,
       array_agg(e.enumlabel order by e.enumsortorder) as labels
from pg_type t
join pg_enum e on t.oid = e.enumtypid
join pg_namespace n on n.oid = t.typnamespace
group by n.nspname, t.typname
order by n.nspname, t.typname;

select trigger_schema, event_object_schema, event_object_table,
       trigger_name, event_manipulation, action_timing
from information_schema.triggers
where event_object_schema not in ('pg_catalog', 'information_schema')
order by event_object_schema, event_object_table, trigger_name;

select table_schema, table_name
from information_schema.tables
where table_schema not in ('pg_catalog', 'information_schema')
  and (
    lower(table_name) like '%migration%'
    or lower(table_name) like '%drizzle%'
    or lower(table_schema) like '%drizzle%'
  )
order by table_schema, table_name;

rollback;
```

Nenhum comando de escrita, migration, `drizzle push`, migration Supabase, `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `DELETE` ou `UPDATE` foi executado.
