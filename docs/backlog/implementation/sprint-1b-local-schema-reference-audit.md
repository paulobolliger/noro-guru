# Sprint 1B — Auditoria Local De Referencias De Schema E Legado

Data de referencia: 2026-05-27

Status: auditoria local concluida.

Escopo: `apps/`, `packages/`, `scripts/`, `supabase/`, `docs/architecture/`, `docs/apps/`, `docs/backlog/`, arquivos `.sql`, `.ts`, `.tsx`, `.js`, `.md`, `.json` e `.env.example`.

Fora do escopo: banco da VPS, `node_modules/`, `.git/`, `.next/`, `dist/`, `build/` e `docs/archive/` como fonte ativa.

Observacao operacional: esta auditoria nao executou banco, migrations, Drizzle push, Supabase migrations, instalacao de dependencias, exclusao ou movimentacao de arquivos. `docs/conceito/` nao foi usado como implementacao existente.

## 1. Resumo executivo

Foram auditadas 7 areas locais principais e 972 arquivos elegiveis. A busca encontrou referencias amplas a Supabase, SQLs antigos e tabelas legadas:

- 168 arquivos com referencia a Supabase;
- 113 arquivos com chamadas `.from(...)`;
- 46 arquivos com indicios de Supabase Auth/session;
- 15 arquivos com indicios de Supabase Storage/buckets;
- 36 migrations SQL em `supabase/migrations/`;
- 33 arquivos com DDL antigo (`CREATE TABLE`, `ALTER TABLE`, `CREATE POLICY` ou RLS);
- 60 arquivos com referencias a billing legado Stripe/Cielo/BTG/eRede;
- 30 arquivos com referencias a Drizzle/`DATABASE_URL`, mas sem schema Drizzle canonico ou `pgTable`.

As principais referencias Supabase em runtime estao em `apps/control`, `apps/sites`, `apps/web`, `packages/lib/supabase` e `supabase/functions`. A pasta `supabase/migrations/` contem modelos uteis para entender historico, mas deve ser tratada como `historico_congelado` e `bloqueado_para_codigo_novo`.

Principal risco: a Sprint 1 usar `auth.users`, `public.users`, `public.tenants`, `public.user_tenants`, `cp.user_tenant_roles` ou migrations Supabase/RLS como base direta do novo schema Drizzle. Antes de criar schema Drizzle, e necessario desenhar um mapa canonico de auth/tenant/membership/roles e decidir explicitamente o que sera migrado, reaproveitado ou descartado.

## 2. Referencias Supabase em runtime

Classificacoes usadas:

- `runtime_transicional`: ainda usado por app atual, mas deve migrar;
- `historico_congelado`: arquivo historico/migration antiga que nao deve rodar;
- `referencia_documental`: aparece em documentacao;
- `referencia_aproveitavel`: util como referencia para modelagem, mas nao canonica;
- `bloqueado_para_codigo_novo`: nao pode ser usado em implementacao nova;
- `candidato_migracao_drizzle`: deve ser redesenhado em schema Drizzle;
- `baixo_risco`: referencia sem impacto operacional.

| Arquivo/grupo | Tipo de uso | Tabelas/recursos referenciados | Classificacao | Recomendacao |
| --- | --- | --- | --- | --- |
| `packages/lib/supabase/client.ts` | Cliente browser Supabase compartilhado | `NEXT_PUBLIC_SUPABASE_URL`, anon key | `runtime_transicional`, `bloqueado_para_codigo_novo` | Migrar consumidores para `packages/auth` e repositorios Drizzle; nao importar em codigo novo. |
| `packages/lib/supabase/server.ts` | Cliente server/SSR Supabase compartilhado | cookies/session Supabase | `runtime_transicional`, `bloqueado_para_codigo_novo` | Substituir por helpers Logto e `packages/db`. |
| `packages/lib/supabase/admin.ts` | Cliente admin/service role | tabelas varias via `.from(...)` | `runtime_transicional`, `bloqueado_para_codigo_novo` | Remover apenas depois de migrar rotas que precisam service role. |
| `packages/lib/supabase/storage.ts` | Storage Supabase | buckets, upload, public URL | `runtime_transicional`, `candidato_migracao_drizzle` | Definir provider de arquivos antes de remover; nao criar uploads novos em Supabase. |
| `packages/lib/supabase/{blog,dashboard,logs,mensagens,orcamentos,pedidos,tarefas,test,usuarios}.ts` | Repositorios legados Supabase | `noro_*`, pedidos, orcamentos, usuarios, logs | `runtime_transicional`, `referencia_aproveitavel`, `candidato_migracao_drizzle` | Usar como inventario funcional, nao como API nova. |
| `apps/control/lib/supabase/{client,server,admin}.ts` | Clientes locais do Control | Supabase SSR/browser/admin | `runtime_transicional`, `bloqueado_para_codigo_novo` | Substituir primeiro no login/layout/actions da Sprint 1. |
| `apps/control/lib/supabaseServer.ts` | Helper server local | Supabase SSR | `runtime_transicional`, `bloqueado_para_codigo_novo` | Migrar chamadas para helper canonico Logto/Drizzle. |
| `apps/control/app/login/page.tsx` | Login Supabase | `supabase.auth.signUp`, `signInWithPassword`, OAuth | `runtime_transicional`, `bloqueado_para_codigo_novo` | Primeiro alvo de migração para Logto. |
| `apps/control/app/(protected)/layout.tsx` | Layout protegido | `supabase.auth.getUser()`, `signOut()` | `runtime_transicional`, `bloqueado_para_codigo_novo` | Substituir por `requireUser()` e sign-out Logto. |
| `apps/control/app/(protected)/page.tsx` | Dashboard protegido | `supabase.auth.getSession()`, `signOut()` | `runtime_transicional`, `bloqueado_para_codigo_novo` | Migrar para sessão Logto. |
| `apps/control/components/TopBar.tsx` | Logout e dados de usuario | Supabase client, `.auth.signOut()`, `.from(...)` | `runtime_transicional`, `bloqueado_para_codigo_novo` | Separar auth Logto de dados via Drizzle. |
| `apps/control/hooks/useTenant.ts` | Tenant atual legado | `supabase.auth.getUser()`, `.from(...)` | `runtime_transicional`, `candidato_migracao_drizzle` | Trocar por `resolveTenantContext()`. |
| `apps/control/hooks/useLeads.ts` | CRM legado | `noro_leads` via Supabase | `runtime_transicional`, `candidato_migracao_drizzle` | Mapear para CRM canonico tenant/control. |
| `apps/control/hooks/useClients.ts` | Clientes legado | `noro_clientes` via Supabase | `runtime_transicional`, `candidato_migracao_drizzle` | Mapear para `customers/clientes` canonico. |
| `apps/control/hooks/useOrcamentos.ts` | Propostas/orcamentos legado | `noro_orcamentos` | `runtime_transicional`, `referencia_aproveitavel` | Reaproveitar semântica, redesenhar quote builder. |
| `apps/control/hooks/usePedidos.ts` | Pedidos legado | `noro_pedidos` | `runtime_transicional`, `referencia_aproveitavel` | Nao entra na Sprint 1; mapear depois de propostas. |
| `apps/control/app/(protected)/control/leads/**` | Leads Control Plane | `cp.leads`, `lead_stages`, `tenants`, `.schema("cp")` | `runtime_transicional`, `candidato_migracao_drizzle` | Boa referencia para CRM NORO, mas precisa repository Drizzle. |
| `apps/control/app/(protected)/tenants/**` | Tenants/onboarding | `tenants`, `user_tenants`, storage `tenant-logos`, Supabase Auth admin em comentario | `runtime_transicional`, `candidato_migracao_drizzle` | Mapear tenants e memberships antes de reutilizar. |
| `apps/control/app/(protected)/configuracoes/**` | Configuracoes e planos | `supabase.auth`, `auth.users`, planos, metrics | `runtime_transicional`, `referencia_aproveitavel` | Cuidado com `auth.users`; usar ponte Logto. |
| `apps/control/app/(protected)/api-keys/actions.ts` | API keys | Supabase Auth + `cp` | `runtime_transicional`, `candidato_migracao_drizzle` | Migrar depois da base auth/tenant. |
| `apps/control/app/api/search/route.ts` | Busca global | `noro_leads`, `noro_clientes`, `noro_orcamentos`, pedidos | `runtime_transicional`, `candidato_migracao_drizzle` | Nao copiar consulta para novo schema sem contrato de tenant. |
| `apps/control/app/api/support/**` | Suporte | Supabase Auth + `cp.support_*` | `runtime_transicional`, `referencia_aproveitavel` | Reaproveitar depois de tenant/membership. |
| `apps/control/app/api/notifications/route.ts` | Notificacoes | `user_tenants`, `notifications` | `runtime_transicional`, `candidato_migracao_drizzle` | Normalizar memberships antes. |
| `apps/control/app/(protected)/comunicacao/actions.ts` | Comunicacao | `conversations`, `messages`, `supabase.auth.getUser()` | `runtime_transicional`, `referencia_aproveitavel` | Backlog, nao fundacao da Sprint 1. |
| `apps/control/app/(protected)/orcamentos/**` | Orcamentos/propostas | `noro_orcamentos` | `runtime_transicional`, `referencia_aproveitavel` | Servir de referencia funcional para Sprint 4, nao Sprint 1. |
| `apps/control/app/(protected)/pagamentos/page.tsx` | Pagamentos legado | `pedidos` via Supabase | `runtime_transicional`, `bloqueado_para_codigo_novo` | Nao usar no desenho Asaas. |
| `apps/control/scripts/apply-migration.ts` | Script local que aplica SQL via Supabase | DDL textual e Supabase service role | `bloqueado_para_codigo_novo` | Nao executar; precisa congelamento/remoção futura por política de scripts. |
| `apps/control/scripts/fix-user-tenant.ts` | Script de correção Supabase | `users`, `tenants`, `user_tenants` | `bloqueado_para_codigo_novo`, `referencia_aproveitavel` | Nao executar; pode orientar mapeamento legado. |
| `apps/sites/lib/get-site.ts` | Runtime de sites | `@supabase/supabase-js`, `sites` | `runtime_transicional`, `candidato_migracao_drizzle` | Migrar após lead/proposta/checkout canonicos. |
| `apps/web/app/api/sites/generate/route.ts` | Gerador de sites | Supabase service role, `sites` | `runtime_transicional`, `candidato_migracao_drizzle` | Nao expandir antes de migrar sites. |
| `apps/web/app/dashboard/sites/[id]/preview/page.tsx` | Preview de site | Supabase service role, `sites` | `runtime_transicional`, `candidato_migracao_drizzle` | Migrar junto de `apps/sites`. |
| `apps/web/app/api/ingest-lead/route.ts` | Ingestao via função externa | `SUPABASE_INGEST_URL` | `runtime_transicional`, `bloqueado_para_codigo_novo` | Substituir por API propria em `api.noro.guru`. |
| `supabase/functions/ingest-lead/index.ts` | Edge Function Supabase | leads/ingest | `historico_congelado`, `referencia_aproveitavel` | Nao implantar; reescrever como rota/API propria se necessario. |
| `supabase/functions/support-email/index.ts` | Edge Function Supabase | suporte/email | `historico_congelado`, `referencia_aproveitavel` | Nao implantar; migrar para worker/API propria. |
| `supabase/functions/visa-requirements/index.ts` | Edge Function Supabase | `visa_*`, `cp.*` | `historico_congelado`, `referencia_aproveitavel` | Nao implantar; avaliar depois da vertical de vistos. |
| `apps/control/package.json`, `apps/sites/package.json`, `apps/web/package.json`, `packages/lib/package.json` | Dependencias Supabase | `@supabase/*` | `runtime_transicional`, `bloqueado_para_codigo_novo` | Remover somente quando ultimo runtime migrar. |

## 3. SQLs e migrations antigas

Todos os arquivos abaixo ficam em `supabase/migrations/` e devem ser tratados como `historico_congelado` e `bloqueado_para_codigo_novo`. Eles podem ser `referencia_aproveitavel` para entender tabelas antigas, mas nao devem ser executados nem copiados diretamente para Drizzle.

| Arquivo | Tipo de objeto criado/alterado | Tabelas citadas | RLS/policies/auth/storage | Classificacao | Recomendacao |
| --- | --- | --- | --- | --- | --- |
| `20251027094215_multi-tenant-stage1.sql` | Cria `cp.domains`; altera `noro_clientes`, `noro_leads` | `cp.domains`, `cp.tenants`, `public.noro_clientes`, `public.noro_leads`, `cp.user_tenant_roles` | RLS/policies com `auth.uid()` | `historico_congelado`, `referencia_aproveitavel` | Usar apenas para mapear dominio/tenant legado. |
| `20251027094552_multi-tenant-stage2.sql` | Altera orcamentos/pedidos | `public.noro_orcamentos`, `public.noro_orcamentos_itens`, `public.noro_pedidos*` | RLS/policies com `auth.uid()` | `historico_congelado` | Reavaliar na sprint de propostas, nao na Sprint 1. |
| `20251027094944_multi-tenant-stage3.sql` | Altera anexos/perfil/interacoes/tarefas | `public.noro_clientes_*`, `public.noro_tarefas`, `public.noro_interacoes` | RLS/policies com `auth.uid()` | `historico_congelado` | Referencia para CRM futuro. |
| `20251027095204_multi-tenant-stage4.sql` | Altera notificacoes/newsletter/fornecedores/config/empresa | `public.noro_fornecedores`, `public.noro_configuracoes`, `public.noro_empresa` | RLS/policies com `auth.uid()` | `historico_congelado` | Mapear fornecedores/configuracoes depois da base tenant. |
| `20251027104127_visa-api-stage1.sql` | Cria tabelas da vertical vistos | `public.visa_countries`, `visa_sources`, `visa_requirements`, `visa_updates`, `visa_overrides` | RLS/policies com `auth.uid()` | `historico_congelado`, `referencia_aproveitavel` | Fora da Sprint 1; vertical futura. |
| `20251027105925_visa-api-stage2.sql` | Altera `visa_requirements` | `public.visa_requirements`, `public.visa_countries` | sem RLS/policy | `historico_congelado` | Referencia baixa prioridade. |
| `20251027111415_api-keys-stage.sql` | Cria logs de API keys | `cp.api_key_logs`, `cp.api_keys`, `cp.tenants` | RLS/policy com `auth.uid()` | `historico_congelado`, `referencia_aproveitavel` | Reavaliar apos auth/tenant. |
| `20251027114731_cp-policies-stage.sql` | Policies de `cp` | `cp.user_tenant_roles`, `cp.tenants`, `cp.api_keys` | RLS/policies com `auth.uid()` | `historico_congelado`, `bloqueado_para_codigo_novo` | Nao usar RLS Supabase como arquitetura nova. |
| `20251027122118_cp-domains-policies.sql` | Policies de domains/webhooks | `cp.domains`, `cp.webhooks` | RLS/policies com `auth.uid()` | `historico_congelado` | Reescrever com autorizacao app/repository. |
| `20251027124500_cp-schema-grants.sql` | Grants | schema `cp` | grants Supabase/service role | `historico_congelado` | Nao executar. |
| `20251027125541_cp-domains-policies-v2.sql` | Policies de domains/API keys | `cp.domains`, `cp.api_keys`, `cp.user_tenant_roles` | RLS/policies com `auth.uid()` | `historico_congelado` | Nao usar como base nova. |
| `20251027133714_cp-crm-stage.sql` | Cria CRM Control Plane | `cp.leads`, `cp.contacts`, `cp.tasks`, `cp.notes`, `auth.users` | RLS/policies e FK para `auth.users` | `historico_congelado`, `referencia_aproveitavel` | Modelo util, mas precisa remover dependência `auth.users`. |
| `20251027134126_cp-crm-rls-v2.sql` | Ajusta RLS do CRM | `cp.leads`, `cp.tasks`, `cp.notes`, `cp.user_tenant_roles` | RLS/policies com `auth.uid()` | `historico_congelado`, `bloqueado_para_codigo_novo` | Nao copiar policies. |
| `20251027143109_cp-billing-finance-stage.sql` | Cria billing/ledger inicial em `cp` | `cp.plans`, `cp.subscriptions`, `cp.invoices`, `cp.ledger_accounts`, `cp.ledger_entries` | RLS/policies | `historico_congelado`, `referencia_aproveitavel` | Referencia para ledger, mas nao substitui modelo Asaas. |
| `20251028104814_cp_leads_rls_seeds.sql` | RLS/seeds leads/modulos | `cp.leads`, `cp.lead_stages`, `cp.lead_activity`, `cp.modules_registry` | RLS/policies com `auth.uid()` | `historico_congelado` | Nao rodar; reaproveitar nomes com cuidado. |
| `20251028150758_cp-service-role-grants.sql` | Grants service role | `cp` | grants | `historico_congelado` | Nao executar. |
| `20251028152144_cp-leads-position.sql` | Ajuste de ordenacao de leads | `cp.leads` | sem RLS | `historico_congelado`, `referencia_aproveitavel` | Pode orientar campo de ordenacao. |
| `20251029120000_support_module.sql` | Cria suporte | `cp.support_tickets`, `cp.support_messages`, `cp.support_events`, `cp.support_sla`, `auth.users` | RLS/policies e FK para `auth.users` | `historico_congelado` | Migrar depois de auth canonico. |
| `20251030000000_add_source_to_support_tickets.sql` | Altera suporte | `cp.support_tickets` | sem RLS | `historico_congelado` | Baixo risco como referencia. |
| `20251030000000_create_base_tenants.sql` | Cria base multi-tenant em `public` | `public.tenants`, `public.users`, `public.user_tenants`, `public.clientes`, `public.fin_fornecedores`, `auth.users` | RLS/policies com `auth.uid()` | `historico_congelado`, `referencia_aproveitavel`, `candidato_migracao_drizzle` | Principal insumo para mapa canonico, mas nao copiar direto. |
| `20251030000000_leads_notifications.sql` | Cria leads/notificacoes `public` | `public.leads`, `public.notifications`, `public.users`, `public.user_tenants`, `auth.users` | RLS/policies com `auth.uid()` | `historico_congelado` | Consolidar com `cp.leads` e `noro_leads`. |
| `20251030000001_plan_approvals.sql` | Cria aprovacao/metricas de planos | `cp.plan_approvals`, `cp.plan_usage_metrics`, `cp.plan_change_history`, `auth.users` | RLS/policies | `historico_congelado` | Reavaliar em billing SaaS. |
| `20251030123000_public_views.sql` | Views publicas | `public.subscription_plans`, `cp.subscription_plans`, `public.tenants`, `cp.tenants` | sem RLS | `historico_congelado` | Evidencia duplicidade `public`/`cp`. |
| `20251030_create_noro_tenant.sql` | Seed/tenant NORO | `cp.tenants` | sem RLS | `historico_congelado` | Nao executar sem plano. |
| `20251031000001_add_admin_user_ids_to_tenants.sql` | Altera `public.tenants`; policies billing | `public.tenants`, `billing.subscriptions`, `billing.payment_methods`, `billing.invoices`, `billing.transactions` | policies com `auth.uid()` | `historico_congelado` | Mostra billing legado separado; nao canonico. |
| `20251031000004_add_settings_table.sql` | Cria settings | `cp.settings` | RLS/policy | `historico_congelado` | Reaproveitar depois de tenant/auth. |
| `20251031000005_add_webhook_logs_table.sql` | Cria logs Stripe | `cp.stripe_webhook_logs` | RLS/policy | `historico_congelado`, `bloqueado_para_codigo_novo` | Nao usar como modelo Asaas; criar webhook ledger canonico depois. |
| `20251214180000_ai_content_module.sql` | Cria IA content | `public.noro_ai_roteiros`, `public.noro_ai_artigos` | RLS/policies com `auth.uid()` | `historico_congelado` | Fora do MVP fundacional. |
| `20251214190000_ai_credits_module.sql` | Cria wallet/transacoes IA | `public.noro_ai_wallets`, `public.noro_ai_transactions` | RLS/policies com `auth.uid()` | `historico_congelado` | Nao implementar credits antes de billing/ledger. |
| `20251214200000_marketing_module.sql` | Cria marketing social/email | `public.noro_marketing_*`, `public.users`, `public.tenants` | RLS/policies com `auth.uid()` | `historico_congelado` | Backlog futuro. |
| `20251214210000_communication_module.sql` | Cria comunicacao | `public.noro_comm_*`, `public.users`, `cp.tenants` | RLS/policies com `auth.uid()` | `historico_congelado` | Backlog futuro. |
| `20251214220000_fix_config_constraints.sql` | Ajusta constraints config | `public.noro_configuracoes` | sem RLS | `historico_congelado` | Nao executar sem mapeamento. |
| `20251214223000_fix_public_tenant_fk.sql` | Troca FK de `cp.tenants` para `public.tenants` | `public.tenants`, `cp.tenants`, `public.noro_configuracoes`, `public.noro_empresa`, `public.noro_notificacoes` | sem RLS | `historico_congelado`, `referencia_aproveitavel` | Evidencia conflito canonico `cp.tenants` vs `public.tenants`. |
| `20251215220000_custom_domains.sql` | Cria dominios publicos | `public.noro_domains`, `public.tenants`, `public.user_tenants` | RLS/policies com `auth.uid()` | `historico_congelado` | Reescrever para dominio/sites canonicos. |
| `20260114_create_sites_table.sql` | Cria `public.sites` | `public.sites`, `user_tenants` | RLS/policy com `auth.uid()` | `historico_congelado`, `referencia_aproveitavel` | Migrar sites depois de CRM/propostas/checkout. |
| `20260519000000_create_noro_cobrancas.sql` | Cria cobrancas legadas | `public.noro_cobrancas`, `cp.tenants`, `public.noro_pedidos`, `public.noro_clientes`, `cp.user_tenant_roles` | RLS/policies com `auth.uid()`; provider enum legado | `historico_congelado`, `bloqueado_para_codigo_novo` | Nao usar como base Asaas; so como referencia de status/cobranca. |

## 4. Tabelas legadas referenciadas no codigo

| Tabela/padrao | Arquivos que referenciam | Contexto | Provavel origem | Recomendacao para Drizzle |
| --- | --- | --- | --- | --- |
| `users` / `public.users` | 59 arquivos; exemplos: `apps/control/app/(protected)/users/page.tsx`, `apps/control/app/(protected)/configuracoes/user-actions.ts`, `supabase/migrations/20251030000000_create_base_tenants.sql` | Usuarios internos legados e telas de gestao | Supabase/public schema historico | Criar perfil interno canonico separado de Logto; nao usar `public.users` sem ponte. |
| `auth.users` | 8 arquivos; exemplos: `apps/control/app/(protected)/tenants/tenant-actions.ts`, `apps/control/app/(protected)/configuracoes/planos/actions.ts`, migrations `cp-crm`, `support`, `base_tenants` | FK/lookup Supabase Auth | Supabase Auth | `bloqueado_para_codigo_novo`; mapear via `auth_subject` e `legacy_supabase_user_id`. |
| `tenants` / `public.tenants` / `cp.tenants` | 96 arquivos; exemplos: `apps/control/app/(protected)/tenants/**`, `apps/control/app/(protected)/control/orgs/**`, `supabase/migrations/*` | Tenants/onboarding/plano/contexto | Modelos duplicados `public` e `cp` | Decidir canonico em Sprint 1C antes de migrations. |
| `user_tenants` | 9 arquivos; exemplos: `apps/control/app/(protected)/tenants/tenant-actions.ts`, `apps/control/app/api/notifications/route.ts`, `packages/lib/services/tenantService.ts` | Membership antiga | Public schema Supabase | Redesenhar como `tenant_memberships`; preservar ponte se necessario. |
| `cp.user_tenant_roles` | migrations e runtime `cp` | Roles/membership Control Plane | Schema `cp` | Avaliar como referencia de role, mas normalizar nomes/status. |
| `leads` / `cp.leads` / `public.leads` | 101 arquivos; exemplos: `apps/control/app/(protected)/control/leads/**`, `apps/control/app/api/leads/route.ts` | CRM NORO e lead tenant misturados | Supabase/CP/public | Separar CRM NORO (`control`) de CRM tenant (`core`) no schema canonico. |
| `clientes` / `public.clientes` | 122 arquivos; exemplos: `apps/control/app/(protected)/clientes/**`, `apps/control/app/(protected)/pedidos/**` | Clientes/contatos | Public schema antigo | Mapear para clientes finais do tenant com `tenant_id` obrigatorio. |
| `noro_leads` | 20 arquivos; exemplos: `apps/control/hooks/useLeads.ts`, `apps/core/components/admin/LeadsClientPage.tsx`, `packages/lib/services/crmService.ts` | CRM legado de viagem | Supabase antigo | Candidato a migracao para CRM tenant; nao usar nome como canonico sem avaliacao. |
| `noro_clientes` | 16 arquivos; exemplos: `apps/control/hooks/useClients.ts`, `apps/control/app/api/search/route.ts`, `packages/lib/services/crmService.ts` | Clientes/passageiros | Supabase antigo | Reaproveitar campos uteis em schema novo de clientes. |
| `noro_orcamentos` | 17 arquivos; exemplos: `apps/control/app/(protected)/orcamentos/orcamentos-actions.ts`, `apps/control/hooks/useOrcamentos.ts`, `packages/lib/supabase/orcamentos.ts` | Propostas/orcamentos | Supabase antigo | Mapear na Sprint 4; nao antecipar na Sprint 1. |
| `noro_orcamentos_itens` | 6 arquivos; exemplos: `apps/control/app/(protected)/pedidos/pedidos-actions.ts`, componentes de detalhes de orcamento, migration stage2 | Itens de proposta | Supabase antigo | Referencia para quote builder; precisa snapshot financeiro canonico. |
| `noro_fornecedores` | 2 arquivos; migration stage4 e auditoria 1A | Fornecedores antigos | Supabase antigo | Baixa presenca runtime; avaliar junto de produtos/fornecedores. |
| `fin_*` | 5 arquivos locais diretos; exemplos: `packages/lib/services/financeiroService.ts`, `apps/control/app/(protected)/tenants/tenant-actions.ts`, migrations base tenants | Financeiro legado | App financeiro/Supabase antigo | Reaproveitar apenas apos modelo financeiro canonico. |
| `cp.*` | 34 arquivos; exemplos: migrations `cp-*`, `packages/control-worker/src/tasks/*`, `apps/control/scripts/apply-migration.ts`, `apps/control/hooks/useTenant.ts` | Control Plane, suporte, billing, leads | Schema `cp` Supabase restaurado | Bom candidato de referencia, mas precisa contrato Drizzle e separacao `control`/`core`. |
| `billing.*` | 7 arquivos; exemplos: `apps/billing/app/plans/page.tsx`, `apps/control/app/settings/stripe/metrics/actions.ts`, migration `add_admin_user_ids_to_tenants.sql` | Billing legado | Schema `billing` antigo | Nao usar como Asaas canonico; extrair conceitos de plano/assinatura depois. |

## 5. Referencias de auth/storage Supabase

### Supabase Auth

Foram encontrados 46 arquivos com indicios de Supabase Auth/session. Principais pontos:

- `apps/control/app/login/page.tsx`: `signUp`, `signInWithPassword`, OAuth;
- `apps/control/app/(protected)/layout.tsx`: `getUser()` e logout;
- `apps/control/app/(protected)/page.tsx`: `getSession()` e logout;
- `apps/control/components/TopBar.tsx`: `signOut()`;
- `apps/control/hooks/useTenant.ts`: `getUser()`;
- `apps/control/app/api/search/route.ts`: `getUser()`;
- `apps/control/app/api/support/**`: `getUser()`;
- `apps/control/app/(protected)/configuracoes/**`, `api-keys`, `users`, `tarefas`, `tenants`: `getUser()` ou `getSession()`;
- migrations Supabase usando `auth.uid()`, `auth.jwt()`, `auth.role()` e `auth.users`.

Classificacao: `runtime_transicional` para os arquivos executaveis; `historico_congelado` para migrations; `bloqueado_para_codigo_novo` para qualquer uso novo.

Recomendacao: Sprint 1C deve desenhar `users` canonico com `auth_provider`, `auth_subject` e `legacy_supabase_user_id`; Sprint 1 de implementacao deve substituir login/layout/actions por Logto antes de migrar dados de produto.

### Supabase Storage

Foram encontrados 15 arquivos com indicios de storage/buckets, mas nem todos sao uso real de Supabase Storage. Pontos relevantes:

- `packages/lib/supabase/storage.ts`: upload e URL publica via Supabase Storage;
- `apps/control/app/(protected)/tenants/tenant-actions.ts`: upload de logo em bucket `tenant-logos`;
- `supabase/config.toml`: configuracao de storage Supabase;
- `supabase/migrations/20251030000001_plan_approvals.sql`: metrica `storage_used`;
- docs vigentes registram Supabase Storage como legado.

Classificacao: `runtime_transicional`, `bloqueado_para_codigo_novo`, `candidato_migracao_drizzle` para metadados; provider de arquivo ainda precisa decisao.

Recomendacao: nao remover bucket/cliente antes de definir provider de arquivos e migrar `tenant-logos`; nao criar uploads novos em Supabase.

## 6. Referencias de billing legado

Foram encontrados 60 arquivos com referencias Stripe/Cielo/BTG/eRede.

| Area | Arquivos principais | Leitura | Recomendacao |
| --- | --- | --- | --- |
| Stripe em `apps/billing` | `apps/billing/lib/stripe.ts`, `apps/billing/app/actions.ts`, `apps/billing/app/api/webhooks/stripe/route.ts`, `apps/billing/lib/types.ts` | Billing SaaS legado e portal Stripe | `referencia_aproveitavel`, mas `bloqueado_para_codigo_novo`; substituir por Asaas depois da base auth/tenant. |
| Cielo em `apps/billing` | `apps/billing/lib/cielo.ts`, `apps/billing/app/api/webhooks/cielo/route.ts` | Gateway legado | Nao usar no MVP Asaas. |
| Providers em `apps/control` | `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts`, `cielo-provider.ts`, `btg-provider.ts` | Cobrança de pedidos por providers antigos | Pode orientar interface, mas nao provider final. |
| Webhooks em `apps/control` | `apps/control/app/api/webhooks/stripe/route.ts`, `apps/control/app/api/webhooks/btg/route.ts` | Webhooks legados | Reescrever idempotencia/payload para Asaas, sem copiar status diretamente. |
| UI de cobrança em `apps/control` | `apps/control/components/pagamentos/EmitirCobrancaForm.tsx`, `apps/control/components/pedidos/PedidoCobrancasList.tsx` | UI expõe Stripe/Cielo/BTG | Trocar provider para Asaas em sprint financeira, nao agora. |
| eRede em `apps/core` | `apps/core/app/(protected)/pedidos/providers/erede-provider.ts`, webhooks e componentes de pagamento | Gateway operacional tenant legado | Legado/transicional; nao usar como provider do MVP Asaas. |
| Web checkout em `apps/web` | `apps/web/app/api/create-checkout-session/route.ts`, `PricingCards.tsx` | Checkout legado/marketing | Alinhar com Asaas depois de billing canonico. |
| Services compartilhados | `packages/lib/services/billingService.ts`, `packages/types/financeiro.ts` | Stripe/customer IDs e tipos financeiros | Referencia historica; nao canonico. |
| SQL antigo | `supabase/migrations/20251027143109_cp-billing-finance-stage.sql`, `20251031000005_add_webhook_logs_table.sql`, `20260519000000_create_noro_cobrancas.sql` | Billing/ledger/cobranças legadas | Nao usar como schema Asaas sem redesenho. |

Relação com Asaas: Asaas e o gateway vigente. As referencias antigas podem ajudar a entender fluxo, campos e estados, mas a implementacao nova precisa `PaymentProvider`/`AsaasProvider`, webhook idempotente, status interno e ledger minimo separados de Stripe/Cielo/BTG/eRede.

## 7. Riscos para Sprint 1

- Usar `auth.users` como base nova de usuario e perpetuar Supabase Auth.
- Usar `public.users` sem ponte Logto e sem decidir `auth_subject`.
- Usar `public.tenants` ou `cp.tenants` sem escolher canonico.
- Reaproveitar `user_tenants` ou `cp.user_tenant_roles` sem normalizar roles, status e permissao.
- Criar Drizzle duplicando tabelas existentes em `public`, `cp` ou `billing`.
- Misturar `cp` e `public` sem fronteira clara entre Control Plane e portal tenant.
- Copiar SQLs Supabase com RLS/policies como modelo novo, apesar da direcao ser autorizacao em aplicacao + repositories com `tenant_id`.
- Usar billing antigo como base do Asaas e carregar Stripe/Cielo/BTG/eRede para o MVP.
- Rodar `apps/control/scripts/apply-migration.ts` ou qualquer migration Supabase antiga por engano.
- Migrar sites ou checkout antes de auth/tenant/membership estarem estabilizados.

## 8. Recomendações

Referencias que podem orientar modelagem, sem virarem canonicas automaticamente:

- `cp.tenants`, `public.tenants`;
- `public.users`, `public.user_tenants`, `cp.user_tenant_roles`;
- `cp.leads`, `public.leads`, `noro_leads`;
- `noro_clientes`, `public.clientes`;
- `noro_orcamentos`, `noro_orcamentos_itens`;
- `cp.plans`, `cp.subscriptions`, `cp.invoices`, `cp.ledger_entries`;
- `public.sites`, `public.noro_domains`;
- providers antigos apenas para extrair requisitos de interface e status.

Referencias que nao devem ser usadas em codigo novo:

- `supabase.auth`;
- `@supabase/*` em novos imports;
- `auth.users` como FK nova;
- Supabase RLS/policies como modelo de isolamento;
- `supabase/migrations/*` como fonte executavel;
- `apps/control/scripts/apply-migration.ts`;
- Stripe/Cielo/BTG/eRede como provider novo.

Referencias que precisam de migracao:

- login/layout/auth do `apps/control`;
- `useTenant` e resolucao de tenant;
- actions e APIs de tenants, users, leads, suporte, search e notificacoes;
- `packages/lib/supabase/*`;
- `apps/sites` e rotas `apps/web` que persistem sites;
- storage `tenant-logos`;
- billing/pagamentos legados.

Referencias que devem permanecer congeladas:

- toda pasta `supabase/migrations/`;
- toda pasta `supabase/functions/`;
- `supabase/config.toml`;
- scripts Supabase locais ate revisao individual.

Proximo passo da Sprint 1C:

- criar `docs/backlog/implementation/sprint-1c-canonical-auth-tenant-schema-map.md`;
- comparar modelos locais e auditados de `auth.users`, `public.users`, `public.tenants`, `public.user_tenants`, `cp.tenants`, `cp.user_tenant_roles`;
- desenhar schema canonico de `users`, `tenants`, `tenant_memberships`, roles e ponte legado;
- decidir nomes finais, ownership por app e estrategia de coexistencia;
- ainda nao rodar migrations.

## 9. Próximo passo recomendado

Criar:

```txt
docs/backlog/implementation/sprint-1c-canonical-auth-tenant-schema-map.md
```

Esse documento deve desenhar o schema canonico de auth/tenant sem executar migrations. Ele deve responder, antes de qualquer codigo:

- qual tabela representa usuario interno NORO;
- como Logto mapeia para usuario interno;
- se existe `legacy_supabase_user_id`;
- qual tabela representa tenant;
- se o canonico parte de `cp.tenants`, `public.tenants` ou nova tabela controlada por Drizzle;
- qual tabela representa membership;
- quais roles iniciais sao oficiais;
- como `apps/control` e `apps/core` resolvem tenant;
- qual estrategia de migracao segura sera usada.

Conclusao: e seguro avancar para desenho do schema canonico. Ainda nao e seguro rodar migrations, Drizzle push ou SQLs antigos.
