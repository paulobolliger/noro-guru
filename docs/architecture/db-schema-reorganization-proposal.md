# Proposta de Reorganização de Schemas — noro_guru_db

Data: 2026-06-01  
Baseado em: `inventory-banco-real-2026-05-30.md`, `inventory-codigo-referencias-db-2026-05-30.md`, `crossref-banco-codigo-2026-05-30.md`  
Status: **proposta aprovada — nenhuma migration executada ainda**

---

## Princípios

1. `public` é eliminado — cada área funcional tem schema próprio.
2. `cp` é renomeado para `platform` — conteúdo preservado, nome expressivo.
3. `billing` é renomeado para `platform_billing` — separa explicitamente a cobrança SaaS da Noro.
4. Prefixos redundantes são removidos quando o schema já comunica o contexto (`crm.clients` em vez de `crm.noro_clientes`, `fin.receitas` em vez de `fin.fin_receitas`).
5. Nenhuma tabela é eliminada nesta fase — candidatas a arquivamento são marcadas.
6. As 26 tabelas Drizzle (`noro.*`, só no Neon) são distribuídas nos schemas funcionais corretos — não concentradas num schema `noro` avulso.
7. Schemas de sistema gerenciados pelo Supabase (`storage`, `graphile_worker`, `staging_vistos`) não são alterados.

---

## Separação Plataforma × Tenant

```
PLATAFORMA (Noro)                      TENANT (cada agência)
Gerenciado por apps/control            Gerenciado por apps/core + apps/portal
────────────────────────────────       ────────────────────────────────────────
platform          cp.* renomeado       crm          clientes, leads, docs
platform_billing  billing.* renomeado  sales        propostas, pedidos, itinerários
platform_crm      leads/contatos Noro  fin          financeiro completo
auth              ponte Logto↔sistema  catalog      produtos, fornecedores, preços
audit             logs centralizados   portal       portal do viajante
                                       comunicacao  chatbot, mensagens, templates
                                       mkt          marketing, email, social
                                       ai           artigos e roteiros por IA
                                       sites        sites das agências
                                       visa         requisitos de visto
```

---

## Schemas de Plataforma

### `platform` — SaaS Platform Management

**Origem:** Renomeação direta do schema `cp`.  
**Contexto:** Tenants como clientes SaaS da Noro — planos, assinaturas, suporte, API, webhooks.  
**App responsável:** `apps/control`

> ⚠️ Nota: `cp.leads`, `cp.contacts`, `cp.lead_activity`, `cp.lead_stages`, `cp.notes` saem do `cp` e vão para `platform_crm` (ver abaixo). `cp.security_audit_log` vai para `audit`.

| Origem (`cp.*`) | → `platform.*` | Linhas | Obs |
|---|---|---|---|
| `cp.tenants` | `platform.tenants` | 5 | Tenants SaaS — dado real |
| `cp.domains` | `platform.domains` | 4 | Domínios dos tenants — dado real |
| `cp.api_keys` | `platform.api_keys` | 0 | — |
| `cp.api_key_logs` | `platform.api_key_logs` | 0 | — |
| `cp.webhooks` | `platform.webhooks` | 0 | — |
| `cp.webhook_logs` | `platform.webhook_logs` | 0 | — |
| `cp.stripe_webhook_logs` | `platform.stripe_webhook_logs` | 0 | — |
| `cp.plans` | `platform.plans` | 3 | 3 planos — dado real |
| `cp.plan_features` | `platform.plan_features` | 8 | Dado real |
| `cp.subscription_plans` | `platform.subscription_plans` | 0 | — |
| `cp.subscriptions` | `platform.subscriptions` | 0 | — |
| `cp.subscription_addons` | `platform.subscription_addons` | 0 | — |
| `cp.subscription_addon_items` | `platform.subscription_addon_items` | 0 | — |
| `cp.billing_events` | `platform.billing_events` | 0 | — |
| `cp.invoices` | `platform.invoices` | 0 | — |
| `cp.payments` | `platform.payments` | 0 | — |
| `cp.ledger_accounts` | `platform.ledger_accounts` | 4 | Dado real |
| `cp.ledger_entries` | `platform.ledger_entries` | 0 | — |
| `cp.modules_registry` | `platform.modules_registry` | 10 | 10 módulos — dado real |
| `cp.tenant_modules` | `platform.tenant_modules` | 0 | — |
| `cp.tenant_plan` | `platform.tenant_plan` | 0 | — |
| `cp.tenant_settings` | `platform.tenant_settings` | 1 | — |
| `cp.control_plane_users` | `platform.users` | 0 | — |
| `cp.control_plane_user_activities` | `platform.user_activities` | 0 | — |
| `cp.control_plane_config` | `platform.config` | 0 | — |
| `cp.settings` | `platform.settings` | 0 | — |
| `cp.support_tickets` | `platform.support_tickets` | 0 | — |
| `cp.support_messages` | `platform.support_messages` | 0 | — |
| `cp.support_sla` | `platform.support_sla` | 0 | — |
| `cp.support_events` | `platform.support_events` | 0 | — |
| `cp.system_events` | `platform.system_events` | 1 | — |
| `cp.usage_counters` | `platform.usage_counters` | 0 | — |
| `cp.user_tenant_roles` | `platform.user_tenant_roles` | 2 | Dado real |
| `cp.tasks` | `platform.tasks` | 0 | — |

**Tabelas novas (Drizzle `noro.*`, criar em produção):**

| Tabela Drizzle | → `platform.*` | Migration | Obs |
|---|---|---|---|
| `noro.modules` | `platform.modules` | 0000 | Catálogo de módulos do produto |
| `noro.plans` | `platform.plans_v2` | 0000 | Planos com feature flags (substituirá `platform.plans` após migração) |
| `noro.plan_modules` | `platform.plan_modules` | 0000 | Relação plano ↔ módulo |

**Candidatas a arquivamento (dentro do cp):**

| Tabela | Motivo |
|---|---|
| `cp.produtos` | 0 linhas — duplicata de `catalog.products` |
| `cp.produtos_precos` | 0 linhas — duplicata de `catalog.product_price_history` |

---

### `platform_billing` — SaaS Billing

**Origem:** Renomeação direta do schema `billing`.  
**Contexto:** O que a Noro cobra das agências — faturas Stripe/Asaas, planos de cobrança, métodos de pagamento.  
**App responsável:** `apps/control`

| Origem (`billing.*`) | → `platform_billing.*` | Obs |
|---|---|---|
| `billing.invoices` | `platform_billing.invoices` | — |
| `billing.payment_methods` | `platform_billing.payment_methods` | — |
| `billing.plans` | `platform_billing.plans` | — |
| `billing.subscriptions` | `platform_billing.subscriptions` | — |
| `billing.transactions` | `platform_billing.transactions` | — |

*(Row counts não obtidos na análise — schema não foi consultado para dados.)*

---

### `platform_crm` — Noro Sales CRM

**Origem:** Subset do schema `cp` — leads e contatos da Noro como empresa (prospects B2B).  
**Contexto:** Funil de vendas da própria Noro: leads de agências interessadas, contatos, estágios, atividade.  
**App responsável:** `apps/control`

| Origem (`cp.*`) | → `platform_crm.*` | Linhas | Obs |
|---|---|---|---|
| `cp.leads` | `platform_crm.leads` | 2 | Leads B2B — dado real |
| `cp.contacts` | `platform_crm.contacts` | 0 | — |
| `cp.lead_activity` | `platform_crm.lead_activity` | 8 | Dado real |
| `cp.lead_stages` | `platform_crm.lead_stages` | 6 | Dado real |
| `cp.notes` | `platform_crm.notes` | 0 | — |

---

### `auth` — Authorization Bridge

**Contexto:** Ponte entre o Logto (autenticação) e o sistema interno (autorização). O Logto cuida de quem é o usuário. Este schema cuida do que o usuário pode fazer: qual tenant pertence, que role tem, qual provider externo vinculou.  
**App responsável:** `packages/auth`, consumido por todos os apps.

> ⚠️ **Conflito de nome:** O schema `auth` já existe e é gerenciado pelo Supabase internamente. Este schema novo só pode usar o nome `auth` após a remoção completa do Supabase Auth. **Durante a transição: usar `noro_auth` como nome temporário.** O documento trata como `auth` para clareza do destino final.

**Tabelas legadas migradas:**

| Origem | → `auth.*` | Linhas | Obs |
|---|---|---|---|
| `public.noro_users` | `auth.users_legado` | 6 | Mapeamento Supabase UID → usuário interno |
| `public.noro_update_tokens` | `auth.update_tokens` | 3 | Tokens de atualização de sessão |

**Tabelas novas (Drizzle `noro.*`, criar em produção):**

| Tabela Drizzle | → `auth.*` | Migration | Obs |
|---|---|---|---|
| `noro.users` | `auth.users` | 0000 | Modelo canônico Logto — substitui `auth.users_legado` |
| `noro.identity_links` | `auth.identity_links` | 0000 | Provider subject (Logto sub) ↔ user interno |
| `noro.tenants` | `auth.tenants` | 0000 | Tenant canônico: portal_slug, portal_domain, portal_theme |
| `noro.tenant_memberships` | `auth.tenant_memberships` | 0000 | Qual user pertence a qual tenant, com role |
| `noro.platform_role_assignments` | `auth.platform_role_assignments` | 0000 | Roles de plataforma (superadmin, support) |

---

### `audit` — Centralized Audit Log

**Contexto:** Log centralizado de eventos — auditoria de aplicação e de plataforma.  
**App responsável:** Escrito por todos os apps, lido em `apps/control`.

| Origem | → `audit.*` | Linhas | Obs |
|---|---|---|---|
| `public.noro_audit_log` | `audit.app_events` | 0 | — |
| `cp.security_audit_log` | `audit.platform_events` | 0 | — |

**Tabelas novas (Drizzle):**

| Tabela Drizzle | → `audit.*` | Migration | Obs |
|---|---|---|---|
| `noro.audit_events` | `audit.events` | 0000 | Modelo canônico unificado — substituirá ambas as acima |

---

## Schemas de Tenant

### `crm` — Customer Relationship Management

**Contexto:** Viajantes e clientes das agências — cadastro, preferências, histórico, leads de captação da agência. Cada row pertence a um tenant.  
**App responsável:** `apps/core`

| Origem | → `crm.*` | Linhas | Obs |
|---|---|---|---|
| `public.noro_clientes` | `crm.clients` | 9 | Dado real |
| `public.noro_clientes_enderecos` | `crm.client_addresses` | 3 | Dado real |
| `public.noro_clientes_documentos` | `crm.client_documents` | 4 | Dado real |
| `public.noro_clientes_milhas` | `crm.client_miles` | 4 | Dado real |
| `public.noro_clientes_preferencias` | `crm.client_preferences` | 2 | Dado real |
| `public.noro_leads` | `crm.leads` | 3 | Dado real |
| `public.noro_interacoes` | `crm.interactions` | 6 | Dado real |
| `public.noro_tarefas` | `crm.tasks` | 2 | Dado real |

**Tabelas novas (Drizzle):**

| Tabela Drizzle | → `crm.*` | Migration | Obs |
|---|---|---|---|
| `noro.clients` | `crm.clients_v2` | 0001 | Modelo canônico — substituirá `crm.clients` após migração |
| `noro.leads` | `crm.leads_v2` | 0001 | Modelo canônico — substituirá `crm.leads` após migração |

**Candidatas a arquivamento:**

| Tabela | Motivo |
|---|---|
| `public.clientes` | 0 linhas — duplicata sem prefixo de `crm.clients` |
| `public.leads` | 0 linhas — duplicata sem prefixo de `crm.leads` |

---

### `sales` — Sales Operations

**Contexto:** Propostas/orçamentos, pedidos/reservas, itinerários, mensagens de proposta, documentos vinculados a propostas, comissões operacionais, contatos de emergência de viagem.  
**App responsável:** `apps/core` (gestão) + `apps/portal` (acesso do viajante)

| Origem | → `sales.*` | Linhas | Obs |
|---|---|---|---|
| `public.noro_orcamentos` | `sales.proposals` | 0 | — |
| `public.noro_orcamentos_itens` | `sales.proposal_items` | 0 | — |
| `public.noro_pedidos` | `sales.orders` | 0 | — |
| `public.noro_pedidos_itens` | `sales.order_items` | 0 | — |
| `public.noro_pedidos_timeline` | `sales.order_timeline` | 0 | — |
| `public.noro_comissoes` | `sales.commissions` | 0 | — |
| `public.noro_clientes_contatos_emergencia` | `sales.emergency_contacts` | 3 | Dado real — contatos por cliente |

**Tabelas novas (Drizzle):**

| Tabela Drizzle | → `sales.*` | Migration | Obs |
|---|---|---|---|
| `noro.proposals` | `sales.proposals_v2` | 0003 | Com aceiteToken, dataViagem*, tipo proposta |
| `noro.proposal_items` | `sales.proposal_items_v2` | 0003 | Com snapshot financeiro imutável |
| `noro.proposal_documents` | `sales.proposal_documents` | 0007 | tipo enum + visibleToClient |
| `noro.proposal_itinerary_items` | `sales.proposal_itinerary_items` | 0008 | Itinerário por dia |
| `noro.proposal_messages` | `sales.proposal_messages` | 0008 | Chat agência ↔ viajante |
| `noro.emergency_contacts` | `sales.emergency_contacts_v2` | 0008 | Modelo canônico — sem equivalente exato no legado |

---

### `fin` — Financial

**Contexto:** Financeiro operacional da agência: receitas, despesas, contas bancárias, comissões, gateway de pagamento, notas fiscais, conciliação. As tabelas `public.fin_*` já usam o prefixo `fin_` — ao mover para o schema `fin`, o prefixo é removido do nome.  
**App responsável:** `apps/core` (interface) + `apps/financeiro` (módulo dedicado, atualmente inativo)

**Regra de nomeação:** `public.fin_receitas` → `fin.receitas` (remove o prefixo `fin_`).

| Origem | → `fin.*` | Linhas | Obs |
|---|---|---|---|
| `public.fin_receitas` | `fin.receitas` | 58 | **Dado real — módulo ativo** |
| `public.fin_despesas` | `fin.despesas` | 39 | **Dado real — módulo ativo** |
| `public.fin_projecoes` | `fin.projecoes` | 12 | Dado real |
| `public.fin_categorias` | `fin.categorias` | 10 | Dado real |
| `public.fin_comissoes` | `fin.comissoes` | 4 | Dado real |
| `public.fin_contas_bancarias` | `fin.contas_bancarias` | 3 | Dado real |
| `public.fin_adiantamentos` | `fin.adiantamentos` | 0 | — |
| `public.fin_alocacoes` | `fin.alocacoes` | 0 | — |
| `public.fin_centros_custo` | `fin.centros_custo` | 0 | — |
| `public.fin_comissoes_lotes` | `fin.comissoes_lotes` | 0 | — |
| `public.fin_comissoes_recebidas` | `fin.comissoes_recebidas` | 0 | — |
| `public.fin_comissoes_split` | `fin.comissoes_split` | 0 | — |
| `public.fin_condicoes_pagamento` | `fin.condicoes_pagamento` | 0 | — |
| `public.fin_creditos` | `fin.creditos` | 0 | — |
| `public.fin_duplicatas_pagar` | `fin.duplicatas_pagar` | 0 | — |
| `public.fin_duplicatas_receber` | `fin.duplicatas_receber` | 0 | — |
| `public.fin_duplicatas_recorrentes` | `fin.duplicatas_recorrentes` | 0 | — |
| `public.fin_extrato_movimentacoes` | `fin.extrato_movimentacoes` | 0 | — |
| `public.fin_extratos_bancarios` | `fin.extratos_bancarios` | 0 | — |
| `public.fin_fornecedores` | `fin.fornecedores` | 0 | Vínculo financeiro — diferente de `catalog.suppliers` |
| `public.fin_gateway_transacoes` | `fin.gateway_transacoes` | 0 | — |
| `public.fin_gateway_webhooks` | `fin.gateway_webhooks` | 0 | — |
| `public.fin_gateways_config` | `fin.gateways_config` | 0 | — |
| `public.fin_lembretes` | `fin.lembretes` | 0 | — |
| `public.fin_nf_config` | `fin.nf_config` | 0 | — |
| `public.fin_notas_fiscais` | `fin.notas_fiscais` | 0 | — |
| `public.fin_parcelas` | `fin.parcelas` | 0 | — |
| `public.fin_plano_contas` | `fin.plano_contas` | 0 | — |
| `public.fin_regras_comissao` | `fin.regras_comissao` | 0 | — |
| `public.fin_regras_conciliacao` | `fin.regras_conciliacao` | 0 | — |
| `public.fin_relatorios_config` | `fin.relatorios_config` | 0 | — |
| `public.fin_repasses_automacao` | `fin.repasses_automacao` | 0 | — |
| `public.fin_transacoes` | `fin.transacoes` | 0 | — |
| `public.fin_utilizacoes` | `fin.utilizacoes` | 0 | — |
| `public.noro_transacoes` | `fin.transacoes_legado` | 0 | Revisar antes de arquivar |
| `public.noro_payment_configs` | `fin.payment_configs_legado` | 35 | **35 linhas — dado real sem referência no código atual** |

**Tabelas novas (Drizzle):**

| Tabela Drizzle | → `fin.*` | Migration | Obs |
|---|---|---|---|
| `noro.payment_provider_accounts` | `fin.payment_provider_accounts` | 0004 | Config gateway por tenant |
| `noro.payment_customers` | `fin.payment_customers` | 0004 | Customer no gateway por proposta |
| `noro.payment_charges` | `fin.charges` | 0004 | Cobranças: Pix, boleto, checkout |
| `noro.payment_webhook_events` | `fin.webhook_events` | 0004 | Log idempotente de webhooks Asaas |

---

### `catalog` — Products, Suppliers & Pricing

**Contexto:** Catálogo da agência: produtos e serviços de viagem, fornecedores, regras de markup e precificação, câmbio.  
**App responsável:** `apps/core`

| Origem | → `catalog.*` | Linhas | Obs |
|---|---|---|---|
| `public.produtos` | `catalog.products` | 0 | — |
| `public.produtos_categorias` | `catalog.product_categories` | 0 | — |
| `public.produtos_precos_historico` | `catalog.product_price_history` | 0 | — |
| `public.produtos_variacoes` | `catalog.product_variations` | 0 | — |
| `public.noro_markup_rules` | `catalog.markup_rules` | 7 | Dado real |
| `public.noro_pricing_logs` | `catalog.pricing_logs` | 0 | — |
| `public.noro_pricing_snapshots` | `catalog.pricing_snapshots` | 0 | — |
| `public.noro_exchange_rates` | `catalog.exchange_rates` | 4 | Dado real |

**Tabelas novas (Drizzle):**

| Tabela Drizzle | → `catalog.*` | Migration | Obs |
|---|---|---|---|
| `noro.suppliers` | `catalog.suppliers` | 0002 | — |
| `noro.products` | `catalog.products_v2` | 0002 | Modelo canônico — substituirá `catalog.products` |
| `noro.pricing_rules` | `catalog.pricing_rules` | 0002 | Regras compostas com canal e planId |

**Candidatas a arquivamento:**

| Tabela | Motivo |
|---|---|
| `public.markups` | 0 linhas — duplicata de `catalog.markup_rules` |
| `public.regras_preco` | 0 linhas — duplicata de `catalog.pricing_rules` |

---

### `portal` — Client Portal

**Contexto:** Portal do viajante (`apps/portal`). Sessões via magic link, resolução de tenant por domínio.  
**App responsável:** `apps/portal`

Não há tabelas legadas equivalentes. Todas as tabelas são novas.

| Tabela Drizzle | → `portal.*` | Migration | Obs |
|---|---|---|---|
| `noro.client_portal_sessions` | `portal.sessions` | 0005 | Magic link: token + expiração + proposal_id |

---

### `comunicacao` — Communications

**Contexto:** Chatbot de suporte, conversas, mensagens, templates de comunicação, notificações internas.  
**App responsável:** `apps/core`

| Origem | → `comunicacao.*` | Linhas | Obs |
|---|---|---|---|
| `public.conversations` | `comunicacao.conversations` | 12 | Dado real |
| `public.messages` | `comunicacao.messages` | 64 | Dado real — maior tabela de comunicação |
| `public.notifications` | `comunicacao.notifications` | 0 | — |
| `public.chatbot_configs` | `comunicacao.chatbot_configs` | 4 | Dado real |
| `public.chatbot_auto_responses` | `comunicacao.chatbot_responses` | 24 | Dado real |
| `public.knowledge_base_articles` | `comunicacao.knowledge_base` | 1 | Dado real |
| `public.noro_comunicacao_templates` | `comunicacao.templates` | 0 | — |
| `public.noro_notificacoes` | `comunicacao.notificacoes` | 0 | — |

---

### `mkt` — Marketing

**Contexto:** Campanhas de marketing da agência: email, redes sociais, newsletter. Módulo atualmente inativo (0 linhas).  
**App responsável:** `apps/core`

| Origem | → `mkt.*` | Linhas | Obs |
|---|---|---|---|
| `public.noro_campanhas` | `mkt.campanhas` | 0 | — |
| `public.noro_marketing_email_campaigns` | `mkt.email_campaigns` | 0 | — |
| `public.noro_marketing_email_contacts` | `mkt.email_contacts` | 0 | — |
| `public.noro_marketing_email_lists` | `mkt.email_lists` | 0 | — |
| `public.noro_marketing_social_accounts` | `mkt.social_accounts` | 0 | — |
| `public.noro_marketing_social_posts` | `mkt.social_posts` | 0 | — |
| `public.noro_newsletter` | `mkt.newsletter` | 0 | — |

---

### `ai` — AI Features

**Contexto:** Artigos e roteiros gerados por IA para o tenant. Módulo atualmente inativo (0 linhas).  
**App responsável:** `apps/core`

| Origem | → `ai.*` | Linhas | Obs |
|---|---|---|---|
| `public.noro_ai_artigos` | `ai.artigos` | 0 | — |
| `public.noro_ai_roteiros` | `ai.roteiros` | 0 | — |

---

### `sites` — Agency Websites

**Contexto:** Sites das agências: configuração, branding, domínios customizados, empresa, configurações do sistema.  
**App responsável:** `apps/sites`, `apps/web`

| Origem | → `sites.*` | Linhas | Obs |
|---|---|---|---|
| `public.sites` | `sites.agency_sites` | 15 | Dado simulado |
| `public.noro_empresa` | `sites.empresa` | 0 | Perfil de empresa da agência |
| `public.noro_configuracoes` | `sites.configuracoes` | 6 | Dado real |
| `public.noro_domains` | `sites.domains` | 0 | Domínios customizados do tenant |

---

### `visa` — Visa Requirements

**Contexto:** Requisitos de visto por país. Dados de referência — maior conjunto de dados do banco (190 linhas por tabela). Gerenciado por `apps/visa-api`.  
**App responsável:** `apps/visa-api`

| Origem | → `visa.*` | Linhas | Obs |
|---|---|---|---|
| `public.visa_countries` | `visa.countries` | 190 | Dado real |
| `public.visa_requirements` | `visa.requirements` | 190 | Maior tabela do banco |
| `public.visa_overrides` | `visa.overrides` | 0 | — |
| `public.visa_sources` | `visa.sources` | 0 | — |
| `public.visa_updates` | `visa.updates` | 0 | — |

---

## Schemas de Sistema — Não Alterados

| Schema | Motivo |
|---|---|
| `auth` (Supabase) | Gerenciado pelo Supabase. Substituído pelo `noro_auth`/`auth` novo quando Logto migração completar. |
| `storage` | Gerenciado pelo Supabase. |
| `graphile_worker` | Job queue legado — manter até decisão sobre migração de workers. |
| `staging_vistos` | Staging da visa-api — fora do escopo. |
| `tenant_abc` | Schema de sandbox vazio — candidato a remoção, sem urgência. |

---

## Candidatas a Arquivamento Futuro

Não eliminar nesta fase. Marcar e revisar após migração estável.

### Grupo A — Duplicatas vazias (0 linhas, sem código referenciando)

| Tabela | Schema atual | Duplicata de |
|---|---|---|
| `public.clientes` | public | `crm.clients` |
| `public.leads` | public | `crm.leads` |
| `public.users` | public | `auth.users_legado` |
| `public.user_tenants` | public | `platform.user_tenant_roles` |
| `public.markups` | public | `catalog.markup_rules` |
| `public.regras_preco` | public | `catalog.pricing_rules` |
| `cp.produtos` | cp | `catalog.products` |
| `cp.produtos_precos` | cp | `catalog.product_price_history` |

### Grupo B — Referências de branding antigo no código (tabelas nunca existiram no banco)

| Referência no código | Arquivo | Ação necessária |
|---|---|---|
| `nomade_blog_posts` | `packages/lib/supabase/blog.ts` | Remover código |
| `nomade_blog_categorias` | `packages/lib/supabase/blog.ts` | Remover código |
| `noro_logs` | `packages/lib/supabase/logs.ts` | Remover código |
| `noro_mensagens` | `packages/lib/supabase/mensagens.ts` | Corrigir para `comunicacao.messages` |

### Grupo C — Módulos inativos com dados (decisão de negócio)

| Tabelas | Dado | Situação |
|---|---|---|
| `fin.*` (receitas, despesas, projecoes) | 58+39+12 linhas | Dados reais — **não arquivar**, reativar código |
| `fin.payment_configs_legado` | 35 linhas | Configs de gateway sem código — investigar se são dados ativos |
| `comunicacao.chatbot_*` | 24+4 linhas | Chatbot configurado, fluxo sem código ativo |

---

## Mapeamento Completo — Índice Rápido

Para cada tabela do banco atual, o destino final:

| Schema atual | Tabela | → Schema.Tabela destino |
|---|---|---|
| `cp` | `api_key_logs` | `platform.api_key_logs` |
| `cp` | `api_keys` | `platform.api_keys` |
| `cp` | `billing_events` | `platform.billing_events` |
| `cp` | `contacts` | `platform_crm.contacts` |
| `cp` | `control_plane_config` | `platform.config` |
| `cp` | `control_plane_user_activities` | `platform.user_activities` |
| `cp` | `control_plane_users` | `platform.users` |
| `cp` | `domains` | `platform.domains` |
| `cp` | `invoices` | `platform.invoices` |
| `cp` | `lead_activity` | `platform_crm.lead_activity` |
| `cp` | `lead_stages` | `platform_crm.lead_stages` |
| `cp` | `leads` | `platform_crm.leads` |
| `cp` | `ledger_accounts` | `platform.ledger_accounts` |
| `cp` | `ledger_entries` | `platform.ledger_entries` |
| `cp` | `modules_registry` | `platform.modules_registry` |
| `cp` | `notes` | `platform_crm.notes` |
| `cp` | `payments` | `platform.payments` |
| `cp` | `plan_features` | `platform.plan_features` |
| `cp` | `plans` | `platform.plans` |
| `cp` | `produtos` | **ARCHIVE** |
| `cp` | `produtos_precos` | **ARCHIVE** |
| `cp` | `security_audit_log` | `audit.platform_events` |
| `cp` | `settings` | `platform.settings` |
| `cp` | `stripe_webhook_logs` | `platform.stripe_webhook_logs` |
| `cp` | `subscription_addon_items` | `platform.subscription_addon_items` |
| `cp` | `subscription_addons` | `platform.subscription_addons` |
| `cp` | `subscription_plans` | `platform.subscription_plans` |
| `cp` | `subscriptions` | `platform.subscriptions` |
| `cp` | `support_events` | `platform.support_events` |
| `cp` | `support_messages` | `platform.support_messages` |
| `cp` | `support_sla` | `platform.support_sla` |
| `cp` | `support_tickets` | `platform.support_tickets` |
| `cp` | `system_events` | `platform.system_events` |
| `cp` | `tasks` | `platform.tasks` |
| `cp` | `tenant_modules` | `platform.tenant_modules` |
| `cp` | `tenant_plan` | `platform.tenant_plan` |
| `cp` | `tenant_settings` | `platform.tenant_settings` |
| `cp` | `tenants` | `platform.tenants` |
| `cp` | `usage_counters` | `platform.usage_counters` |
| `cp` | `user_tenant_roles` | `platform.user_tenant_roles` |
| `cp` | `webhook_logs` | `platform.webhook_logs` |
| `cp` | `webhooks` | `platform.webhooks` |
| `billing` | `invoices` | `platform_billing.invoices` |
| `billing` | `payment_methods` | `platform_billing.payment_methods` |
| `billing` | `plans` | `platform_billing.plans` |
| `billing` | `subscriptions` | `platform_billing.subscriptions` |
| `billing` | `transactions` | `platform_billing.transactions` |
| `public` | `chatbot_auto_responses` | `comunicacao.chatbot_responses` |
| `public` | `chatbot_configs` | `comunicacao.chatbot_configs` |
| `public` | `clientes` | **ARCHIVE** |
| `public` | `conversations` | `comunicacao.conversations` |
| `public` | `fin_adiantamentos` | `fin.adiantamentos` |
| `public` | `fin_alocacoes` | `fin.alocacoes` |
| `public` | `fin_categorias` | `fin.categorias` |
| `public` | `fin_centros_custo` | `fin.centros_custo` |
| `public` | `fin_comissoes` | `fin.comissoes` |
| `public` | `fin_comissoes_lotes` | `fin.comissoes_lotes` |
| `public` | `fin_comissoes_recebidas` | `fin.comissoes_recebidas` |
| `public` | `fin_comissoes_split` | `fin.comissoes_split` |
| `public` | `fin_condicoes_pagamento` | `fin.condicoes_pagamento` |
| `public` | `fin_contas_bancarias` | `fin.contas_bancarias` |
| `public` | `fin_creditos` | `fin.creditos` |
| `public` | `fin_despesas` | `fin.despesas` |
| `public` | `fin_duplicatas_pagar` | `fin.duplicatas_pagar` |
| `public` | `fin_duplicatas_receber` | `fin.duplicatas_receber` |
| `public` | `fin_duplicatas_recorrentes` | `fin.duplicatas_recorrentes` |
| `public` | `fin_extrato_movimentacoes` | `fin.extrato_movimentacoes` |
| `public` | `fin_extratos_bancarios` | `fin.extratos_bancarios` |
| `public` | `fin_fornecedores` | `fin.fornecedores` |
| `public` | `fin_gateway_transacoes` | `fin.gateway_transacoes` |
| `public` | `fin_gateway_webhooks` | `fin.gateway_webhooks` |
| `public` | `fin_gateways_config` | `fin.gateways_config` |
| `public` | `fin_lembretes` | `fin.lembretes` |
| `public` | `fin_nf_config` | `fin.nf_config` |
| `public` | `fin_notas_fiscais` | `fin.notas_fiscais` |
| `public` | `fin_parcelas` | `fin.parcelas` |
| `public` | `fin_plano_contas` | `fin.plano_contas` |
| `public` | `fin_projecoes` | `fin.projecoes` |
| `public` | `fin_receitas` | `fin.receitas` |
| `public` | `fin_regras_comissao` | `fin.regras_comissao` |
| `public` | `fin_regras_conciliacao` | `fin.regras_conciliacao` |
| `public` | `fin_relatorios_config` | `fin.relatorios_config` |
| `public` | `fin_repasses_automacao` | `fin.repasses_automacao` |
| `public` | `fin_transacoes` | `fin.transacoes` |
| `public` | `fin_utilizacoes` | `fin.utilizacoes` |
| `public` | `knowledge_base_articles` | `comunicacao.knowledge_base` |
| `public` | `leads` | **ARCHIVE** |
| `public` | `markups` | **ARCHIVE** |
| `public` | `messages` | `comunicacao.messages` |
| `public` | `notifications` | `comunicacao.notifications` |
| `public` | `noro_ai_artigos` | `ai.artigos` |
| `public` | `noro_ai_roteiros` | `ai.roteiros` |
| `public` | `noro_audit_log` | `audit.app_events` |
| `public` | `noro_campanhas` | `mkt.campanhas` |
| `public` | `noro_clientes` | `crm.clients` |
| `public` | `noro_clientes_contatos_emergencia` | `sales.emergency_contacts` |
| `public` | `noro_clientes_documentos` | `crm.client_documents` |
| `public` | `noro_clientes_enderecos` | `crm.client_addresses` |
| `public` | `noro_clientes_milhas` | `crm.client_miles` |
| `public` | `noro_clientes_preferencias` | `crm.client_preferences` |
| `public` | `noro_comissoes` | `sales.commissions` |
| `public` | `noro_comunicacao_templates` | `comunicacao.templates` |
| `public` | `noro_configuracoes` | `sites.configuracoes` |
| `public` | `noro_domains` | `sites.domains` |
| `public` | `noro_empresa` | `sites.empresa` |
| `public` | `noro_exchange_rates` | `catalog.exchange_rates` |
| `public` | `noro_interacoes` | `crm.interactions` |
| `public` | `noro_leads` | `crm.leads` |
| `public` | `noro_marketing_email_campaigns` | `mkt.email_campaigns` |
| `public` | `noro_marketing_email_contacts` | `mkt.email_contacts` |
| `public` | `noro_marketing_email_lists` | `mkt.email_lists` |
| `public` | `noro_marketing_social_accounts` | `mkt.social_accounts` |
| `public` | `noro_marketing_social_posts` | `mkt.social_posts` |
| `public` | `noro_markup_rules` | `catalog.markup_rules` |
| `public` | `noro_newsletter` | `mkt.newsletter` |
| `public` | `noro_notificacoes` | `comunicacao.notificacoes` |
| `public` | `noro_orcamentos` | `sales.proposals` |
| `public` | `noro_orcamentos_itens` | `sales.proposal_items` |
| `public` | `noro_payment_configs` | `fin.payment_configs_legado` |
| `public` | `noro_pedidos` | `sales.orders` |
| `public` | `noro_pedidos_itens` | `sales.order_items` |
| `public` | `noro_pedidos_timeline` | `sales.order_timeline` |
| `public` | `noro_pricing_logs` | `catalog.pricing_logs` |
| `public` | `noro_pricing_snapshots` | `catalog.pricing_snapshots` |
| `public` | `noro_tarefas` | `crm.tasks` |
| `public` | `noro_transacoes` | `fin.transacoes_legado` |
| `public` | `noro_update_tokens` | `auth.update_tokens` |
| `public` | `noro_users` | `auth.users_legado` |
| `public` | `produtos` | `catalog.products` |
| `public` | `produtos_categorias` | `catalog.product_categories` |
| `public` | `produtos_precos_historico` | `catalog.product_price_history` |
| `public` | `produtos_variacoes` | `catalog.product_variations` |
| `public` | `regras_preco` | **ARCHIVE** |
| `public` | `sites` | `sites.agency_sites` |
| `public` | `tenants` | **ARCHIVE** (D1: duplicata de `platform.tenants`) |
| `public` | `user_tenants` | **ARCHIVE** |
| `public` | `users` | **ARCHIVE** |
| `public` | `visa_countries` | `visa.countries` |
| `public` | `visa_overrides` | `visa.overrides` |
| `public` | `visa_requirements` | `visa.requirements` |
| `public` | `visa_sources` | `visa.sources` |
| `public` | `visa_updates` | `visa.updates` |

---

## Tabelas Novas a Criar em Produção (Drizzle `noro.*`)

Todas as 26 tabelas do schema Drizzle precisam ser criadas no banco de produção. Mapeamento final:

| Tabela Drizzle (`noro.*`) | → Destino final | Migration |
|---|---|---|
| `noro.users` | `auth.users` | 0000 |
| `noro.identity_links` | `auth.identity_links` | 0000 |
| `noro.tenants` | `auth.tenants` | 0000 |
| `noro.tenant_memberships` | `auth.tenant_memberships` | 0000 |
| `noro.platform_role_assignments` | `auth.platform_role_assignments` | 0000 |
| `noro.modules` | `platform.modules` | 0000 |
| `noro.plans` | `platform.plans_v2` | 0000 |
| `noro.plan_modules` | `platform.plan_modules` | 0000 |
| `noro.audit_events` | `audit.events` | 0000 |
| `noro.leads` | `crm.leads_v2` | 0001 |
| `noro.clients` | `crm.clients_v2` | 0001 |
| `noro.suppliers` | `catalog.suppliers` | 0002 |
| `noro.products` | `catalog.products_v2` | 0002 |
| `noro.pricing_rules` | `catalog.pricing_rules` | 0002 |
| `noro.proposals` | `sales.proposals_v2` | 0003 |
| `noro.proposal_items` | `sales.proposal_items_v2` | 0003 |
| `noro.payment_provider_accounts` | `fin.payment_provider_accounts` | 0004 |
| `noro.payment_customers` | `fin.payment_customers` | 0004 |
| `noro.payment_charges` | `fin.charges` | 0004 |
| `noro.payment_webhook_events` | `fin.webhook_events` | 0004 |
| `noro.client_portal_sessions` | `portal.sessions` | 0005 |
| `noro.proposal_documents` | `sales.proposal_documents` | 0007 |
| `noro.proposal_itinerary_items` | `sales.proposal_itinerary_items` | 0008 |
| `noro.proposal_messages` | `sales.proposal_messages` | 0008 |
| `noro.emergency_contacts` | `sales.emergency_contacts_v2` | 0008 |

> **Sufixo `_v2`:** Tabelas canônicas Drizzle que coexistirão temporariamente com a legada equivalente. Após migração e validação dos dados, a legada é arquivada e a `_v2` é renomeada para o nome final.

---

## Resumo Quantitativo

| Schema | Origem | Tabelas migradas | Tabelas novas | Total |
|---|---|---|---|---|
| `platform` | cp.* (renomeado) | 34 | 3 | 37 |
| `platform_billing` | billing.* (renomeado) | 5 | 0 | 5 |
| `platform_crm` | subset cp.* | 5 | 0 | 5 |
| `auth` | public.* + noro.* | 2 | 5 | 7 |
| `audit` | public.* + cp.* | 2 | 1 | 3 |
| `crm` | public.* | 8 | 2 | 10 |
| `sales` | public.* | 7 | 6 | 13 |
| `fin` | public.fin_* | 36 | 4 | 40 |
| `catalog` | public.* | 8 | 3 | 11 |
| `portal` | — | 0 | 1 | 1 |
| `comunicacao` | public.* | 8 | 0 | 8 |
| `mkt` | public.* | 7 | 0 | 7 |
| `ai` | public.* | 2 | 0 | 2 |
| `sites` | public.* | 5 | 0 | 5 |
| `visa` | public.* | 5 | 0 | 5 |
| **Total** | | **144** | **25** | **169** |

| Categoria | Quantidade |
|---|---|
| Schemas de plataforma | 5 |
| Schemas de tenant | 10 |
| Schemas de sistema (sem alteração) | 5 |
| Schema `public` ao final | **Eliminado** |
| Schema `cp` ao final | **Renomeado para `platform`** |
| Schema `billing` ao final | **Renomeado para `platform_billing`** |
| Tabelas candidatas a arquivamento | ~12 |

---

## Decisões — Aprovadas em 2026-06-01

> **Contexto:** Todos os dados no banco são simulados. Não há dados reais de clientes ou tenants em produção. Isso elimina restrições de ETL cuidadoso — schemas podem ser recriados do zero sem risco de perda de dados de negócio.

| # | Decisão | Resolução aprovada |
|---|---|---|
| D1 | `public.tenants` vs `platform.tenants` — duplicatas ou entidades diferentes? | **Duplicatas.** `public.tenants` é o registro legado do mesmo conceito. Eliminar junto com o schema `public`. `platform.tenants` é o canônico. O índice rápido já reflete isso (`public.tenants` → `sites.tenants` era provisório — destino final é arquivo). |
| D2 | Nome temporário para o schema de autorização durante transição do Supabase | **`noro_auth` durante a transição.** Renomear para `auth` quando o Supabase Auth for removido (`ALTER SCHEMA noro_auth RENAME TO auth`). |
| D3 | Módulo financeiro (`fin.*`) reativar em `apps/core` ou `apps/financeiro`? | **`apps/core`.** Financeiro do tenant é operação de tenant — pertence ao mesmo contexto de `crm`, `sales` e `catalog`. `apps/financeiro` permanece como stub técnico durante a transição e não orienta a fronteira final de produto. |
| D4 | `fin.payment_configs_legado` (35 linhas) — configurações ativas ou resíduos? | **Resíduo de gateway legado (e-Rede).** Query confirmou: são tabelas de MDR por parcelamento da e-Rede com `tenant_id: null` — seed de configuração global. Como a e-Rede será descontinuada em favor do Asaas, migrar junto com a depreciação formal da e-Rede, não antes. Sem urgência. |
| D5 | `ai` e `mkt` — módulos pausados ou descontinuados? | **Pausados.** Manter os schemas `ai` e `mkt` na reorganização. Isolar os arquivos de código morto em `_disabled/` dentro de cada app para não poluir greps, sem perder a estrutura. |
| D6 | Ordem de execução: migrations Drizzle primeiro ou reorganização legada primeiro? | **Reorganização legada primeiro.** `apps/control` está em produção apontando para `public.*` e `cp.*`. Reorganizar schemas legados (`cp` → `platform`, `public.fin_*` → `fin.*`, etc.) e atualizar o código do `apps/control` em paralelo deixa a base consistente antes de introduzir o modelo Drizzle. Migrations Drizzle entram depois, schema por schema — começando por `noro_auth` (desbloqueia Logto guard). Como todos os dados são simulados, não há risco de perda durante a reorganização. |
