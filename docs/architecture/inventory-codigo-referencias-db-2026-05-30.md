# Inventário de Referências a Banco de Dados no Código

Data da análise: 2026-06-01  
Escopo: todos os arquivos `.ts` e `.tsx` em `apps/` e `packages/`  
Método: grep direto nos arquivos — padrões `.from('`, `.schema('`, `@noro/db`, `createDatabaseClient`, `noro.table(`  
Fonte primária: código. Documentos .md anteriores são rascunho.

---

## Resumo Executivo

| App / Package | Método de acesso | Schemas acessados | Status |
|---|---|---|---|
| `apps/control` | Supabase client | `public.*` + `cp.*` (via `.schema('cp')`) | Ativo — 98+ arquivos |
| `apps/core` | Drizzle (`@noro/db`) + Supabase Storage (1 arquivo) | `noro.*` (dev only) | Ativo — guard auth quebrado |
| `apps/portal` | Drizzle (`@noro/db`) exclusivamente | `noro.*` (dev only) | Ativo — única app funcional ponta a ponta |
| `apps/web` | Supabase client | `public.sites` | Ativo — 1 tabela |
| `apps/financeiro` | Nenhum detectado | — | Stub / sem queries |
| `apps/billing` | Nenhum detectado | — | Stub / sem queries |
| `apps/sites` | Supabase client | `public.sites` (4 refs) | Ativo |
| `packages/db` | Drizzle — definição de schema | `noro.*` | Schema canônico |
| `packages/lib/supabase` | Supabase client | `public.noro_*` | Legado — 14 arquivos |
| `packages/auth` | Drizzle (`@noro/db`) | `noro.*` (auth context) | Canônico |

---

## 1. `packages/db` — Definições Drizzle (schema noro)

Fonte de verdade para o schema `noro`. Todas as definições via `noro.table(`.

| Arquivo | Tabela(s) definida(s) |
|---|---|
| `schema/users.ts` | `noro.users` |
| `schema/identity-links.ts` | `noro.identity_links` |
| `schema/tenants.ts` | `noro.tenants` |
| `schema/memberships.ts` | `noro.tenant_memberships` |
| `schema/roles.ts` | `noro.platform_role_assignments` |
| `schema/modules.ts` | `noro.modules` |
| `schema/plans.ts` | `noro.plans`, `noro.plan_modules` |
| `schema/tenant-modules.ts` | `noro.tenant_modules` |
| `schema/audit.ts` | `noro.audit_events` |
| `schema/leads.ts` | `noro.leads` |
| `schema/clients.ts` | `noro.clients` |
| `schema/suppliers.ts` | `noro.suppliers` |
| `schema/products.ts` | `noro.products` |
| `schema/pricing-rules.ts` | `noro.pricing_rules` |
| `schema/proposals.ts` | `noro.proposals`, `noro.proposal_items` |
| `schema/client-portal-sessions.ts` | `noro.client_portal_sessions` |
| `schema/payment-provider-accounts.ts` | `noro.payment_provider_accounts` |
| `schema/payment-customers.ts` | `noro.payment_customers` |
| `schema/payment-charges.ts` | `noro.payment_charges` |
| `schema/payment-webhook-events.ts` | `noro.payment_webhook_events` |
| `schema/proposal-documents.ts` | `noro.proposal_documents` |
| `schema/proposal-itinerary.ts` | `noro.proposal_itinerary_items` |
| `schema/proposal-messages.ts` | `noro.proposal_messages` |
| `schema/emergency-contacts.ts` | `noro.emergency_contacts` |
| `schema/_schema.ts` | Define `pgSchema('noro')` |
| `schema/index.ts` | Re-exporta tudo + define relações Drizzle |

**Total: 26 tabelas definidas no schema canônico `noro`.**

---

## 2. `packages/lib/supabase` — Módulos Legados

14 arquivos. Todos usam Supabase client via `.from('noro_*')` no schema `public`.

| Arquivo | Tabelas referenciadas | Linhas no banco |
|---|---|---|
| `admin.ts` | `noro_leads`, `noro_notificacoes` | 3, 0 |
| `blog.ts` | `nomade_blog_posts`, `nomade_blog_categorias` | **NÃO EXISTEM** |
| `client.ts` | (factory — sem queries diretas) | — |
| `dashboard.ts` | `noro_leads`, `noro_orcamentos`, `noro_pedidos` | 3, 0, 0 |
| `index.ts` | (re-export) | — |
| `logs.ts` | `noro_logs` | **NÃO EXISTE** |
| `mensagens.ts` | `noro_mensagens` | **NÃO EXISTE** |
| `orcamentos.ts` | `noro_orcamentos` | 0 |
| `pedidos.ts` | `noro_pedidos` | 0 |
| `server.ts` | (factory server-side) | — |
| `storage.ts` | Supabase Storage (bucket ops) | 0 objetos em prod |
| `tarefas.ts` | `noro_tarefas` | 2 |
| `test.ts` | `noro_leads` | 3 |
| `usuarios.ts` | `noro_users` | 6 |

**Tabelas referenciadas que NÃO existem no banco:** `nomade_blog_posts`, `nomade_blog_categorias`, `noro_logs`, `noro_mensagens`

---

## 3. `packages/auth` — Drizzle (contexto de auth)

Usa `@noro/db` para lookup de identidade/tenant. Não faz queries de app-level.

| Arquivo | Repositório/Tabela acessada |
|---|---|
| `context/user-context.ts` | `authIdentityRepository` → `noro.identity_links`, `noro.users` |
| `context/tenant-context.ts` | `tenantsRepository`, `membershipsRepository` → `noro.tenants`, `noro.tenant_memberships` |
| `context/platform-context.ts` | `platformRolesRepository` → `noro.platform_role_assignments` |
| `context/module-context.ts` | `tenantModulesRepository` → `noro.tenant_modules` |
| `types.ts` | Tipos — sem queries diretas |

---

## 4. `apps/control` — Supabase client (schema `public` + `cp`)

**Total de ocorrências `.from()` por tabela:**

### Via `.schema('cp').from()` — Control Plane

| Tabela | Ocorrências | Existe no banco | Dados |
|---|---|---|---|
| `tenants` | 18 | ✅ `cp.tenants` | 5 |
| `leads` | 13 | ✅ `cp.leads` | 2 |
| `support_tickets` | 9 | ✅ `cp.support_tickets` | 0 |
| `domains` | 8 | ✅ `cp.domains` | 4 |
| `api_keys` | 8 | ✅ `cp.api_keys` | 0 |
| `user_tenant_roles` | 7 | ✅ `cp.user_tenant_roles` | 2 |
| `webhooks` | 5 | ✅ `cp.webhooks` | 0 |
| `tasks` | 5 | ✅ `cp.tasks` | 0 |
| `contacts` | 4 | ✅ `cp.contacts` | 0 |
| `support_messages` | 2 | ✅ `cp.support_messages` | 0 |
| `notes` | 2 | ✅ `cp.notes` | 0 |
| `ledger_accounts` | 2 | ✅ `cp.ledger_accounts` | 4 |
| `lead_activity` | 2 | ✅ `cp.lead_activity` | 8 |
| `subscriptions` | 1 | ✅ `cp.subscriptions` | 0 |
| `plans` | 1 | ✅ `cp.plans` | 3 |
| `ledger_entries` | 1 | ✅ `cp.ledger_entries` | 0 |
| `invoices` | 1 | ✅ `cp.invoices` | 0 |
| `api_key_logs` | 1 | ✅ `cp.api_key_logs` | 0 |
| `v_api_key_usage_daily` | 1 | VIEW (não é tabela) | — |

### Via `.from()` direto — schema `public` (default Supabase)

| Tabela | Ocorrências | Existe no banco | Dados |
|---|---|---|---|
| `noro_empresa` | 16 | ✅ | 0 |
| `noro_clientes` | 15 | ✅ | 9 |
| `noro_orcamentos` | 14 | ✅ | 0 |
| `pedidos` | 13 | ❌ **NÃO EXISTE** | — |
| `subscription_plans` | 8 | ✅ `cp.subscription_plans` | 0 |
| `noro_configuracoes` | 8 | ✅ | 6 |
| `control_plane_users` | 7 | ✅ `cp.control_plane_users` | 0 |
| `pedido_itens` | 7 | ❌ **NÃO EXISTE** | — |
| `noro_update_tokens` | 7 | ✅ | 3 |
| `noro_notificacoes` | 7 | ✅ | 0 |
| `cobrancas` | 7 | ❌ **NÃO EXISTE** | — |
| `noro_users` | 6 | ✅ | 6 |
| `noro_leads` | 6 | ✅ | 3 |
| `noro_clientes_enderecos` | 6 | ✅ | 3 |
| `conversations` | 5 | ✅ | 12 |
| `control_plane_user_activities` | 5 | ✅ `cp.control_plane_user_activities` | 0 |
| `noro_pedidos` | 4 | ✅ | 0 |
| `noro_clientes_milhas` | 4 | ✅ | 4 |
| `noro_clientes_documentos` | 4 | ✅ | 4 |
| `user_tenants` | 3 | ✅ | 0 |
| `plan_approvals` | 3 | ❌ **NÃO EXISTE** | — |
| `noro_clientes_contatos_emergencia` | 3 | ✅ | 3 |
| `messages` | 3 | ✅ | 64 |
| `notifications` | 2 | ✅ | 0 |
| `noro_clientes_preferencias` | 2 | ✅ | 2 |
| `noro_ai_wallets` | 2 | ❌ **NÃO EXISTE** | — |
| `control_plane_config` | 2 | ✅ `cp.control_plane_config` | 0 |
| `users` | 1 | ✅ `public.users` | 0 |
| `tenant_plan_history` | 1 | ❌ **NÃO EXISTE** | — |
| `plans` | 1 | ✅ `cp.plans` | 3 |
| `plan_usage_metrics` | 1 | ❌ **NÃO EXISTE** | — |
| `plan_change_history` | 1 | ❌ **NÃO EXISTE** | — |
| `orcamentos` | 1 | ❌ **NÃO EXISTE** (existe `noro_orcamentos`) | — |
| `noro_ai_transactions` | 1 | ❌ **NÃO EXISTE** | — |

### Via Drizzle (`@noro/db`) em apps/control — 5 arquivos

| Arquivo | Tabelas Drizzle acessadas |
|---|---|
| `app/(protected)/billing/actions.ts` | `noro.payment_provider_accounts`, `noro.payment_charges` |
| `app/(protected)/catalogo/fornecedores/actions.ts` | `noro.suppliers` |
| `app/(protected)/catalogo/produtos/actions.ts` | `noro.products` |
| `app/settings/stripe/actions.ts` | (Stripe config — verificar) |
| `lib/db.ts` | Instância Drizzle — ponto de entrada |

---

## 5. `apps/core` — Drizzle + Supabase Storage

Todas as queries de dados usam Drizzle. Supabase usado apenas para upload de arquivos.

| Arquivo | Tipo | Tabelas/Repositório |
|---|---|---|
| `app/(protected)/leads/actions.ts` | Drizzle | `leadsRepository` → `noro.leads` |
| `app/(protected)/clientes/actions.ts` | Drizzle | `clientsRepository` → `noro.clients` |
| `app/(protected)/clientes/[id]/actions.ts` | Stub | retorna erro "legado desativado" |
| `app/(protected)/orcamentos/orcamentos-actions.ts` | Drizzle | `proposalsRepository` → `noro.proposals` |
| `app/(protected)/orcamentos/[id]/actions.ts` | Drizzle + **Supabase Storage** | `noro.proposal_documents*` + `getSupabaseAdmin()` |
| `app/(protected)/orcamentos/[id]/page.tsx` | Drizzle | 5 repositories |
| `app/(protected)/configuracoes/emergencia/page.tsx` | Drizzle | `emergencyContactsRepository` → `noro.emergency_contacts` |
| `app/proposta/[token]/actions.ts` | Drizzle | `proposalsRepository` → `noro.proposals` |

**⚠️ Bloqueador:** `app/(protected)/layout.tsx` chama `getCurrentUser()` de `@noro/lib/services/authService` que retorna `null` sempre → todas as rotas `(protected)/` redirecionam para `/login` permanentemente.

---

## 6. `apps/portal` — Drizzle exclusivo

Portal do viajante. Zero chamadas Supabase para dados. Único uso Supabase é `lib/storage.ts` para signed URLs.

| Arquivo | Tabelas via Drizzle |
|---|---|
| `lib/tenant-context.ts` | `noro.tenants` |
| `lib/magic-link.ts` | `noro.client_portal_sessions` |
| `app/(cliente)/page.tsx` | `noro.proposals`, `noro.payment_charges` |
| `app/(cliente)/propostas/page.tsx` | `noro.proposals` |
| `app/(cliente)/pagamentos/page.tsx` | `noro.payment_charges` |
| `app/(cliente)/documentos/page.tsx` | `noro.proposal_documents` + Supabase Storage signed URL |
| `app/(cliente)/itinerario/page.tsx` | `noro.proposal_itinerary_items` |
| `app/(cliente)/mensagens/actions.ts` | `noro.proposal_messages` |
| `app/(cliente)/mensagens/page.tsx` | `noro.proposal_messages` |
| `app/(cliente)/emergencia/page.tsx` | `noro.emergency_contacts` |
| `app/proposta/[token]/actions.ts` | `noro.proposals` |
| `app/proposta/[token]/page.tsx` | `noro.proposals` |
| `app/api/webhooks/asaas/route.ts` | `noro.payment_webhook_events`, `noro.payment_charges` |

---

## 7. `apps/web` — Supabase (sites)

| Arquivo | Tabela | Existe no banco | Dados |
|---|---|---|---|
| (3 arquivos encontrados) | `public.sites` | ✅ | 15 |

---

## 8. `apps/financeiro`, `apps/billing`, `apps/sites`

| App | Referências encontradas |
|---|---|
| `apps/financeiro` | Nenhuma referência a banco nas pastas `app/` e `lib/` |
| `apps/billing` | Nenhuma referência a banco nas pastas `app/` e `lib/` |
| `apps/sites` | `public.sites` (4 referências) |

---

## Totais

| Categoria | Quantidade |
|---|---|
| Tabelas `noro.*` definidas em código | 26 |
| Arquivos que importam `@noro/db` | 31 |
| Tabelas `public.*` referenciadas em código | ~35 |
| Tabelas `cp.*` referenciadas em código | ~19 |
| **Tabelas referenciadas no código que NÃO existem no banco** | **~12** |
| Tabelas no banco com código referenciando-as | ~45 |
| Tabelas no banco sem nenhuma referência no código | ~105+ |

---

## Tabelas referenciadas no código mas que NÃO existem no banco de produção

| Tabela referenciada | App/Package | Ocorrências | Observação |
|---|---|---|---|
| `pedidos` | apps/control | 13 | Sem schema prefix — `public.pedidos` não existe |
| `cobrancas` | apps/control | 7 | Não existe em nenhum schema |
| `pedido_itens` | apps/control | 7 | Não existe em nenhum schema |
| `plan_approvals` | apps/control | 3 | Não existe em nenhum schema |
| `noro_ai_wallets` | apps/control | 2 | Não existe em nenhum schema |
| `nomade_blog_posts` | packages/lib | 1 | Branding antigo — não existe |
| `nomade_blog_categorias` | packages/lib | 1 | Branding antigo — não existe |
| `noro_logs` | packages/lib | 2 | Não existe em nenhum schema |
| `noro_mensagens` | packages/lib | 1 | `messages` existe, mas não `noro_mensagens` |
| `tenant_plan_history` | apps/control | 1 | Não existe |
| `plan_usage_metrics` | apps/control | 1 | Não existe |
| `plan_change_history` | apps/control | 1 | Não existe |
| `noro_ai_transactions` | apps/control | 1 | Não existe |
| `orcamentos` | apps/control | 1 | Sem prefix — `noro_orcamentos` existe, `orcamentos` não |
| **Todo `noro.*`** | apps/core, apps/portal, packages/auth | 31 arquivos | **Schema `noro` não existe em produção** |
