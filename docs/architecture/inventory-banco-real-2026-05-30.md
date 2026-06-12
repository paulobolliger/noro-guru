# Inventário Real do Banco de Produção

Data da análise: 2026-06-01  
Banco: `noro_guru_db` em `45.32.169.173:5432`  
Credencial: `noro_master`  
Método: queries diretas via `node-pg` — sem ORM, sem cache  
Fonte: este documento. Documentos .md anteriores são rascunho.

---

## Achados Críticos (leia antes da tabela)

| # | Achado | Impacto |
|---|---|---|
| 1 | **Schema `noro` NÃO existe em produção** | As 26 tabelas Drizzle (migrations 0000–0008) existem apenas no Neon (dev). Produção não tem `noro.*`. |
| 2 | **`storage.objects` tem 0 registros** | Supabase Storage está configurado mas vazio em produção. Uploads de documentos não chegaram a produção ou foram para outro provider. |
| 3 | **`auth.users` tem apenas 6 usuários** | Produção com pouquíssimos usuários reais — confirma que o sistema ainda está em pré-lançamento. |
| 4 | **Tabelas `fin_*` têm dados mas provavelmente sem acesso ativo** | 37 tabelas financeiras existem com dados (fin_receitas=58, fin_despesas=39, fin_projecoes=12). Nenhuma referência encontrada no código atual. |
| 5 | **`public.noro_payment_configs` tem 35 linhas** | Configurações de gateway de pagamento em produção. Nenhuma referência no código atual scaneado. |
| 6 | **`cp.tenants` tem 5 tenants** | Dados reais de tenants no Control Plane. Schema cp é mais populado que o esperado. |
| 7 | **Schema `billing` existe com 5 tabelas** | Totalmente ignorado pelos docs anteriores. Não foi consultado para row counts. |
| 8 | **`tenant_abc` schema existe mas está vazio** | Schema de teste/sandbox, possivelmente criado por script de onboarding. |

---

## Schemas Encontrados no Banco

| Schema | Tipo | Relevante para o projeto |
|---|---|---|
| `auth` | Supabase Auth | Sim — identidade atual |
| `billing` | Interno NORO | Sim — não documentado antes |
| `cp` | Control Plane legado | Sim — 41 tabelas ativas |
| `extensions` | PostgreSQL extensions | Não |
| `graphile_worker` | Job queue (graphile) | Parcialmente — job system legado |
| `graphql` | pg_graphql | Não |
| `graphql_public` | pg_graphql | Não |
| `information_schema` | PostgreSQL sistema | Não |
| `noro` | **NÃO EXISTE** | — |
| `pg_catalog` | PostgreSQL sistema | Não |
| `pg_toast` | PostgreSQL interno | Não |
| `pgbouncer` | Connection pooling | Não |
| `pgsodium` | Encryption | Não |
| `public` | App principal legado | Sim — 109 tabelas |
| `realtime` | Supabase Realtime | Parcialmente |
| `staging_vistos` | Staging de vistos | Sim — app visa-api |
| `storage` | Supabase Storage | Sim |
| `supabase_migrations` | Histórico migrations | Referência |
| `tenant_abc` | Sandbox/teste | Não (vazio) |
| `vault` | Supabase Vault (secrets) | Não |

---

## Schema `auth` — 22 tabelas

| Tabela | Linhas (aprox) | Tamanho | Observação |
|---|---|---|---|
| `audit_log_entries` | 1.046 | 368 kB | Log de eventos de auth — tem dados |
| `custom_oauth_providers` | 0 | 56 kB | — |
| `flow_state` | 7 | 80 kB | Sessions OAuth em progresso |
| `identities` | 3 | 80 kB | Vinculações de identidade externas (3 usuários com provider) |
| `instances` | 0 | 16 kB | — |
| `mfa_amr_claims` | 8 | 48 kB | Claims MFA |
| `mfa_challenges` | 0 | 24 kB | — |
| `mfa_factors` | 0 | 56 kB | — |
| `oauth_authorizations` | 0 | 40 kB | — |
| `oauth_client_states` | 0 | 24 kB | — |
| `oauth_clients` | 0 | 24 kB | — |
| `oauth_consents` | 0 | 48 kB | — |
| `one_time_tokens` | 0 | 88 kB | — |
| `refresh_tokens` | 99 | 160 kB | Tokens ativos — usuários com sessões |
| `saml_providers` | 0 | 32 kB | — |
| `saml_relay_states` | 0 | 40 kB | — |
| `schema_migrations` | 76 | 24 kB | Histórico de migrations do Supabase Auth |
| `sessions` | 8 | 96 kB | 8 sessões ativas |
| `sso_domains` | 0 | 32 kB | — |
| `sso_providers` | 0 | 32 kB | — |
| `users` | **6** | 160 kB | **6 usuários cadastrados no Supabase Auth** |
| `webauthn_challenges` | 0 | 32 kB | — |
| `webauthn_credentials` | 0 | 32 kB | — |

---

## Schema `cp` — 41 tabelas

| Tabela | Linhas (aprox) | Tamanho | Observação |
|---|---|---|---|
| `api_key_logs` | 0 | 32 kB | — |
| `api_keys` | 0 | 32 kB | — |
| `billing_events` | 0 | 16 kB | — |
| `contacts` | 0 | 24 kB | — |
| `control_plane_config` | 0 | 16 kB | — |
| `control_plane_user_activities` | 0 | 16 kB | — |
| `control_plane_users` | 0 | 32 kB | — |
| `domains` | **4** | 80 kB | 4 domínios registrados |
| `invoices` | 0 | 24 kB | — |
| `lead_activity` | **8** | 32 kB | Atividade de leads registrada |
| `lead_stages` | **6** | 48 kB | Etapas do funil configuradas |
| `leads` | **2** | 160 kB | 2 leads no Control Plane |
| `ledger_accounts` | **4** | 48 kB | Contas contábeis |
| `ledger_entries` | 0 | 24 kB | — |
| `modules_registry` | **10** | 48 kB | 10 módulos registrados |
| `notes` | 0 | 24 kB | — |
| `payments` | 0 | 16 kB | — |
| `plan_features` | **8** | 48 kB | Features dos planos |
| `plans` | **3** | 48 kB | 3 planos cadastrados |
| `produtos` | 0 | 48 kB | — |
| `produtos_precos` | 0 | 16 kB | — |
| `security_audit_log` | 0 | 56 kB | — |
| `settings` | 0 | 24 kB | — |
| `stripe_webhook_logs` | 0 | 40 kB | — |
| `subscription_addon_items` | 0 | 16 kB | — |
| `subscription_addons` | 0 | 16 kB | — |
| `subscription_plans` | 0 | 24 kB | — |
| `subscriptions` | 0 | 24 kB | — |
| `support_events` | 0 | 24 kB | — |
| `support_messages` | 0 | 24 kB | — |
| `support_sla` | 0 | 24 kB | — |
| `support_tickets` | 0 | 32 kB | — |
| `system_events` | **1** | 32 kB | 1 evento de sistema |
| `tasks` | 0 | 24 kB | — |
| `tenant_modules` | 0 | 16 kB | — |
| `tenant_plan` | 0 | 16 kB | — |
| `tenant_settings` | **1** | 32 kB | 1 configuração |
| `tenants` | **5** | 80 kB | **5 tenants cadastrados** |
| `usage_counters` | 0 | 24 kB | — |
| `user_tenant_roles` | **2** | 32 kB | 2 vínculos user-tenant |
| `webhook_logs` | 0 | 40 kB | — |
| `webhooks` | 0 | 24 kB | — |

---

## Schema `public` — 109 tabelas

### Grupo: Chatbot / Comunicação

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `chatbot_auto_responses` | **24** | 112 kB | Respostas automáticas configuradas |
| `chatbot_configs` | **4** | 64 kB | 4 configurações de chatbot |
| `conversations` | **12** | 128 kB | Conversas ativas |
| `messages` | **64** | 128 kB | 64 mensagens de chat |
| `knowledge_base_articles` | **1** | 144 kB | 1 artigo de base de conhecimento |
| `notifications` | 0 | 40 kB | — |

### Grupo: Financeiro (`fin_*`) — 37 tabelas

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `fin_adiantamentos` | 0 | 40 kB | — |
| `fin_alocacoes` | 0 | 48 kB | — |
| `fin_categorias` | **10** | 64 kB | 10 categorias financeiras |
| `fin_centros_custo` | 0 | 72 kB | — |
| `fin_comissoes` | **4** | 64 kB | 4 comissões registradas |
| `fin_comissoes_lotes` | 0 | 16 kB | — |
| `fin_comissoes_recebidas` | 0 | 32 kB | — |
| `fin_comissoes_split` | 0 | 32 kB | — |
| `fin_condicoes_pagamento` | 0 | 32 kB | — |
| `fin_contas_bancarias` | **3** | 80 kB | 3 contas bancárias |
| `fin_creditos` | 0 | 40 kB | — |
| `fin_despesas` | **39** | 240 kB | **39 despesas reais** |
| `fin_duplicatas_pagar` | 0 | 64 kB | — |
| `fin_duplicatas_receber` | 0 | 64 kB | — |
| `fin_duplicatas_recorrentes` | 0 | 16 kB | — |
| `fin_extrato_movimentacoes` | 0 | 16 kB | — |
| `fin_extratos_bancarios` | 0 | 16 kB | — |
| `fin_fornecedores` | 0 | 40 kB | — |
| `fin_gateway_transacoes` | 0 | 16 kB | — |
| `fin_gateway_webhooks` | 0 | 16 kB | — |
| `fin_gateways_config` | 0 | 24 kB | — |
| `fin_lembretes` | 0 | 48 kB | — |
| `fin_nf_config` | 0 | 24 kB | — |
| `fin_notas_fiscais` | 0 | 16 kB | — |
| `fin_parcelas` | 0 | 48 kB | — |
| `fin_plano_contas` | 0 | 40 kB | — |
| `fin_projecoes` | **12** | 80 kB | 12 projeções financeiras |
| `fin_receitas` | **58** | 224 kB | **58 receitas registradas** |
| `fin_regras_comissao` | 0 | 16 kB | — |
| `fin_regras_conciliacao` | 0 | 16 kB | — |
| `fin_relatorios_config` | 0 | 16 kB | — |
| `fin_repasses_automacao` | 0 | 24 kB | — |
| `fin_transacoes` | 0 | 64 kB | — |
| `fin_utilizacoes` | 0 | 40 kB | — |

### Grupo: CRM (`noro_clientes*`, `noro_leads`)

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `clientes` | 0 | 48 kB | Tabela duplicada, sem noro_ prefix, vazia |
| `leads` | 0 | 32 kB | Tabela duplicada, sem noro_ prefix, vazia |
| `noro_clientes` | **9** | 200 kB | **9 clientes reais** |
| `noro_clientes_contatos_emergencia` | **3** | 64 kB | — |
| `noro_clientes_documentos` | **4** | 96 kB | 4 documentos de clientes |
| `noro_clientes_enderecos` | **3** | 80 kB | — |
| `noro_clientes_milhas` | **4** | 96 kB | — |
| `noro_clientes_preferencias` | **2** | 80 kB | — |
| `noro_leads` | **3** | 120 kB | 3 leads reais |
| `noro_interacoes` | **6** | 224 kB | 6 interações registradas |
| `noro_tarefas` | **2** | 144 kB | — |

### Grupo: Operacional Agência

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `noro_orcamentos` | 0 | 88 kB | Orçamentos vazios em produção |
| `noro_orcamentos_itens` | 0 | 56 kB | — |
| `noro_pedidos` | 0 | 96 kB | — |
| `noro_pedidos_itens` | 0 | 72 kB | — |
| `noro_pedidos_timeline` | 0 | 48 kB | — |
| `noro_comissoes` | 0 | 48 kB | — |
| `noro_notificacoes` | 0 | 40 kB | — |

### Grupo: Config / Sistema

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `noro_configuracoes` | **6** | 80 kB | 6 configurações do sistema |
| `noro_empresa` | 0 | 32 kB | Vazia — dados de empresa não cadastrados |
| `noro_update_tokens` | **3** | 24 kB | — |
| `noro_domains` | 0 | 24 kB | — |
| `noro_audit_log` | 0 | 32 kB | — |
| `markups` | 0 | 16 kB | — |
| `regras_preco` | 0 | 16 kB | — |
| `user_tenants` | 0 | 56 kB | — |
| `users` | 0 | 56 kB | Tabela users sem noro_ prefix — vazia |
| `noro_users` | **6** | 48 kB | 6 usuários no sistema legado |

### Grupo: Produtos / Catálogo

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `produtos` | 0 | 72 kB | — |
| `produtos_categorias` | 0 | 16 kB | — |
| `produtos_precos_historico` | 0 | 16 kB | — |
| `produtos_variacoes` | 0 | 16 kB | — |

### Grupo: Financeiro Legado

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `noro_transacoes` | 0 | 112 kB | — |
| `noro_payment_configs` | **35** | 48 kB | **35 configurações de pagamento — dados reais** |
| `noro_markup_rules` | **7** | 48 kB | 7 regras de markup |
| `noro_pricing_logs` | 0 | 24 kB | — |
| `noro_pricing_snapshots` | 0 | 16 kB | — |
| `noro_exchange_rates` | **4** | 48 kB | 4 taxas de câmbio |

### Grupo: AI / Marketing / Newsletter

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `noro_ai_artigos` | 0 | 24 kB | — |
| `noro_ai_roteiros` | 0 | 24 kB | — |
| `noro_campanhas` | 0 | 16 kB | — |
| `noro_marketing_email_campaigns` | 0 | 16 kB | — |
| `noro_marketing_email_contacts` | 0 | 24 kB | — |
| `noro_marketing_email_lists` | 0 | 16 kB | — |
| `noro_marketing_social_accounts` | 0 | 16 kB | — |
| `noro_marketing_social_posts` | 0 | 16 kB | — |
| `noro_newsletter` | 0 | 48 kB | — |
| `noro_comunicacao_templates` | 0 | 64 kB | — |

### Grupo: Sites / Tenants

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `sites` | **15** | 192 kB | **15 sites criados** |
| `tenants` | **4** | 112 kB | 4 tenants no schema public |

### Grupo: Vistos (apps/visa-api)

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `visa_countries` | **190** | 88 kB | 190 países |
| `visa_requirements` | **190** | 656 kB | **190 requisitos de visto — maior tabela do public** |
| `visa_overrides` | 0 | 32 kB | — |
| `visa_sources` | 0 | 16 kB | — |
| `visa_updates` | 0 | 16 kB | — |

---

## Schema `storage` — 8 tabelas

| Tabela | Linhas | Tamanho | Observação |
|---|---|---|---|
| `buckets` | **0** | 24 kB | **Nenhum bucket criado em produção** |
| `buckets_analytics` | 0 | 24 kB | — |
| `buckets_vectors` | 0 | 16 kB | — |
| `migrations` | **61** | 40 kB | Histórico de migrations do storage |
| `objects` | **0** | 48 kB | **Nenhum arquivo em produção** |
| `s3_multipart_uploads` | 0 | 24 kB | — |
| `s3_multipart_uploads_parts` | 0 | 16 kB | — |
| `vector_indexes` | 0 | 24 kB | — |

---

## Schema `billing` — 5 tabelas (sem row counts)

Descoberto nesta análise. Não foi incluído na query de row counts.

| Tabela | Observação |
|---|---|
| `billing.invoices` | Notas fiscais/faturas de billing |
| `billing.payment_methods` | Métodos de pagamento |
| `billing.plans` | Planos de billing (separado de cp.plans) |
| `billing.subscriptions` | Assinaturas (separado de cp.subscriptions) |
| `billing.transactions` | Transações de billing |

---

## Resumo por Schema

| Schema | Tabelas | Tabelas com dados (>0) | Total linhas relevantes |
|---|---|---|---|
| `auth` | 22 | 7 | 6 usuários, 99 refresh tokens, 1.046 audit logs |
| `billing` | 5 | desconhecido | não consultado |
| `cp` | 41 | 9 | 5 tenants, 10 módulos, 3 planos, 4 domínios |
| `public` | 109 | ~25 | 190 requisitos visa, 58 receitas, 35 payment configs, 9 clientes, 15 sites |
| `storage` | 8 | 1 (migrations) | 0 arquivos, 0 buckets |
| **noro** | **0** | **—** | **Schema não existe em produção** |

---

## Tabelas com mais dados (top 15)

| Tabela | Linhas | Observação |
|---|---|---|
| `public.visa_requirements` | 190 | Maior tabela — app visa-api |
| `public.visa_countries` | 190 | App visa-api |
| `auth.audit_log_entries` | 1.046 | Log de auth events |
| `public.fin_receitas` | 58 | Módulo financeiro ativo |
| `public.fin_despesas` | 39 | Módulo financeiro ativo |
| `public.noro_payment_configs` | 35 | Configs de gateway — **sem referência no código atual** |
| `public.messages` | 64 | Chat/suporte |
| `public.sites` | 15 | Sites de tenants |
| `public.conversations` | 12 | Conversas |
| `public.fin_projecoes` | 12 | Projeções financeiras |
| `public.noro_clientes` | 9 | Clientes reais |
| `auth.lead_activity` | 8 | — |
| `public.chatbot_auto_responses` | 24 | Chatbot configurado |
| `public.noro_markup_rules` | 7 | Markup rules |
| `public.noro_configuracoes` | 6 | Config do sistema |
