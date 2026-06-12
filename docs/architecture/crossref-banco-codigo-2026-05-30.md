# Cruzamento Banco × Código — Gaps e Sobreposições

Data da análise: 2026-06-01  
Fontes: `inventory-banco-real-2026-05-30.md` + `inventory-codigo-referencias-db-2026-05-30.md`  
Método: cruzamento direto banco vs grep de código  
Este documento é a fonte de verdade para decisões de migração.

---

## Achado Estrutural Mais Crítico

```
O schema `noro` (26 tabelas Drizzle, migrations 0000–0008) existe apenas no Neon (dev).
O banco de produção VPS não tem o schema `noro`.

Apps/core e apps/portal — que usam exclusivamente Drizzle/noro — apontam para o Neon
em dev, mas em produção apontariam para um schema que NÃO EXISTE.

Há dois sistemas rodando em paralelo, sem ponte entre eles:
  Sistema A: apps/control → Supabase → public.* e cp.* (produção real)
  Sistema B: apps/core + apps/portal → Drizzle → noro.* (só no Neon)
```

---

## Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Tabela existe no banco E tem referência no código |
| 🔶 | Tabela existe no banco mas SEM referência no código |
| ❌ | Tabela referenciada no código mas NÃO existe no banco de produção |
| 🟡 | Tabela existe no banco mas com dados inconsistentes ou problema |
| 🔵 | Tabela só no Neon (dev) — `noro.*` — nunca em produção |

---

## Seção 1 — Tabelas no banco SEM referência no código

Estas tabelas existem no banco de produção, têm dados ou estrutura, mas o código atual não as referencia. Risco: dados órfãos ou módulos desativados sem deprecation explícita.

### Schema `public` — tabelas órfãs com dados

| Tabela | Linhas | Observação |
|---|---|---|
| 🔶 `fin_receitas` | 58 | Módulo financeiro com dados reais — sem código referenciando |
| 🔶 `fin_despesas` | 39 | Idem |
| 🔶 `noro_payment_configs` | 35 | 35 configs de gateway — código atual não lê isso |
| 🔶 `chatbot_auto_responses` | 24 | Chatbot configurado — sem código ativo |
| 🔶 `fin_projecoes` | 12 | Projeções financeiras — sem código ativo |
| 🔶 `conversations` | 12 | 12 conversas — apps/control tem `.from('conversations')` mas fluxo ativo? |
| 🔶 `messages` | 64 | apps/control tem `.from('messages')` — mas é chat de suporte? |
| 🔶 `chatbot_configs` | 4 | — |
| 🔶 `fin_comissoes` | 4 | — |
| 🔶 `noro_exchange_rates` | 4 | Câmbio — sem referência no código |
| 🔶 `noro_clientes_documentos` | 4 | apps/control tem referência mas via Drizzle para noro schema |
| 🔶 `noro_markup_rules` | 7 | Regras de markup — sem referência direta no código atual |
| 🔶 `noro_interacoes` | 6 | 6 interações — sem referência no código |
| 🔶 `noro_configuracoes` | 6 | apps/control tem `.from('noro_configuracoes')` ✅ (falso positivo acima) |
| 🔶 `fin_categorias` | 10 | — |

### Schema `public` — tabelas órfãs sem dados (estrutura apenas)

| Grupo | Tabelas | Observação |
|---|---|---|
| AI | `noro_ai_artigos`, `noro_ai_roteiros`, `noro_campanhas` | Módulo AI desativado |
| Marketing | `noro_marketing_email_*` (4), `noro_marketing_social_*` (2), `noro_newsletter` | Módulo marketing inativo |
| Financeiro | `fin_transacoes`, `fin_duplicatas_*` (3), `fin_contas_bancarias`, e mais ~20 | Módulo financeiro parcialmente ativo |
| Legado | `clientes`, `leads`, `users` (sem prefixo noro_) | Duplicatas vazias |
| Comissões | `noro_comissoes`, `fin_comissoes_*` (3) | — |
| Comunicação | `noro_comunicacao_templates` | — |
| Outros | `markups`, `regras_preco`, `noro_pricing_logs`, `noro_pricing_snapshots` | — |

### Schema `cp` — tabelas órfãs

| Tabela | Linhas | Observação |
|---|---|---|
| 🔶 `cp.modules_registry` | 10 | 10 módulos registrados — sem referência direta no código |
| 🔶 `cp.billing_events` | 0 | — |
| 🔶 `cp.control_plane_config` | 0 | apps/control tem `.from('control_plane_config')` — mas sem schema('cp') |
| 🔶 `cp.plan_features` | 8 | — |
| 🔶 `cp.payments` | 0 | — |
| 🔶 `cp.subscription_addon_items`, `subscription_addons` | 0 | — |
| 🔶 `cp.tenant_modules` | 0 | Diferente de `noro.tenant_modules` |
| 🔶 `cp.tenant_plan` | 0 | — |
| 🔶 `cp.tenant_settings` | 1 | — |
| 🔶 `cp.security_audit_log` | 0 | — |
| 🔶 `cp.system_events` | 1 | — |
| 🔶 `cp.settings` | 0 | — |
| 🔶 `cp.usage_counters` | 0 | — |
| 🔶 `cp.produtos`, `cp.produtos_precos` | 0 | Catálogo duplicado no cp schema |

### Schema `auth` — sem referência direta no código

| Tabela | Observação |
|---|---|
| 🔶 `auth.users` | O código não faz queries diretas em `auth.users` — acessa via Supabase client `supabase.auth.getUser()` |
| 🔶 `auth.sessions` | Idem |
| 🔶 `auth.refresh_tokens` | Idem |
| Demais 19 tabelas | Gerenciadas pelo Supabase internamente |

### Schema `public` — tabelas de visa (visa-api)

| Tabela | Linhas | Observação |
|---|---|---|
| 🔶 `visa_requirements` | 190 | Provavelmente referenciada em `apps/visa-api` (não scaneado) |
| 🔶 `visa_countries` | 190 | Idem |
| `visa_overrides`, `visa_sources`, `visa_updates` | 0 | Idem |

---

## Seção 2 — Código referenciando tabelas que NÃO existem no banco

Estas chamadas falharão em runtime em produção. Erro silencioso ou exceção PostgreSQL.

| Tabela no código | App | Ocorrências | Diagnóstico |
|---|---|---|---|
| ❌ `pedidos` | apps/control | 13 | `public.pedidos` não existe. Provavelmente era `noro_pedidos` com prefixo esquecido, ou tabela removida. **13 chamadas que retornam erro em produção.** |
| ❌ `cobrancas` | apps/control | 7 | Não existe em nenhum schema. Possivelmente substituída por `noro_transacoes` ou `cp.payments`. **7 chamadas que falham em produção.** |
| ❌ `pedido_itens` | apps/control | 7 | Não existe. Seria `noro_pedidos_itens`. **7 chamadas que falham.** |
| ❌ `plan_approvals` | apps/control | 3 | Feature planejada mas não criada no banco. |
| ❌ `noro_ai_wallets` | apps/control | 2 | Tabela de AI wallet nunca criada. |
| ❌ `nomade_blog_posts` | packages/lib | 1 | Branding antigo (nomade → noro). Tabela nunca existiu com este nome. |
| ❌ `nomade_blog_categorias` | packages/lib | 1 | Idem. |
| ❌ `noro_logs` | packages/lib | 2 | Tabela de logs não existe. |
| ❌ `noro_mensagens` | packages/lib | 1 | `public.messages` existe, `public.noro_mensagens` não. |
| ❌ `tenant_plan_history` | apps/control | 1 | Não existe. |
| ❌ `plan_usage_metrics` | apps/control | 1 | Não existe. |
| ❌ `plan_change_history` | apps/control | 1 | Não existe. |
| ❌ `noro_ai_transactions` | apps/control | 1 | Não existe. |
| ❌ `orcamentos` | apps/control | 1 | `noro_orcamentos` existe, `orcamentos` sem prefixo não. |

**Total estimado de chamadas para tabelas inexistentes em apps/control: ~40+**

---

## Seção 3 — Tabelas presentes em AMBOS (banco e código)

Funcionando ou potencialmente funcionando em produção.

### Via apps/control → Supabase → cp schema

| Tabela | Código (apps/control) | Banco (cp.*) | Dados |
|---|---|---|---|
| ✅ `cp.tenants` | 18 refs | ✅ | 5 |
| ✅ `cp.leads` | 13 refs | ✅ | 2 |
| ✅ `cp.support_tickets` | 9 refs | ✅ | 0 |
| ✅ `cp.domains` | 8 refs | ✅ | 4 |
| ✅ `cp.api_keys` | 8 refs | ✅ | 0 |
| ✅ `cp.user_tenant_roles` | 7 refs | ✅ | 2 |
| ✅ `cp.webhooks` | 5 refs | ✅ | 0 |
| ✅ `cp.tasks` | 5 refs | ✅ | 0 |
| ✅ `cp.contacts` | 4 refs | ✅ | 0 |
| ✅ `cp.lead_activity` | 2 refs | ✅ | 8 |
| ✅ `cp.ledger_accounts` | 2 refs | ✅ | 4 |
| ✅ `cp.plans` | 1 ref | ✅ | 3 |
| ✅ `cp.subscriptions` | 1 ref | ✅ | 0 |

### Via apps/control → Supabase → public schema

| Tabela | Código | Banco | Dados |
|---|---|---|---|
| ✅ `public.noro_empresa` | 16 refs | ✅ | 0 |
| ✅ `public.noro_clientes` | 15 refs | ✅ | 9 |
| ✅ `public.noro_orcamentos` | 14 refs | ✅ | 0 |
| ✅ `public.noro_configuracoes` | 8 refs | ✅ | 6 |
| ✅ `public.noro_update_tokens` | 7 refs | ✅ | 3 |
| ✅ `public.noro_notificacoes` | 7 refs | ✅ | 0 |
| ✅ `public.noro_users` | 6 refs | ✅ | 6 |
| ✅ `public.noro_leads` | 6 refs | ✅ | 3 |
| ✅ `public.noro_clientes_enderecos` | 6 refs | ✅ | 3 |
| ✅ `public.noro_pedidos` | 4 refs | ✅ | 0 |
| ✅ `public.noro_clientes_milhas` | 4 refs | ✅ | 4 |
| ✅ `public.noro_clientes_documentos` | 4 refs | ✅ | 4 |
| ✅ `public.noro_clientes_contatos_emergencia` | 3 refs | ✅ | 3 |
| ✅ `public.noro_clientes_preferencias` | 2 refs | ✅ | 2 |
| ✅ `public.sites` | 4 refs (web+sites) | ✅ | 15 |
| ✅ `public.messages` | 3 refs | ✅ | 64 |
| ✅ `public.conversations` | 5 refs | ✅ | 12 |

---

## Seção 4 — Schema `noro` — só no código, nunca em produção

Todas as 26 tabelas abaixo são referenciadas por 31 arquivos no código, mas **não existem no banco de produção**.

| Tabela `noro.*` | Arquivos que referenciam | Migrations que criam |
|---|---|---|
| 🔵 `noro.users` | packages/db, packages/auth, apps/core, apps/portal | 0000 |
| 🔵 `noro.identity_links` | packages/db, packages/auth | 0000 |
| 🔵 `noro.platform_role_assignments` | packages/db, packages/auth | 0000 |
| 🔵 `noro.tenants` | packages/db, packages/auth, apps/portal | 0000 |
| 🔵 `noro.tenant_memberships` | packages/db, packages/auth | 0000 |
| 🔵 `noro.tenant_modules` | packages/db, packages/auth | 0000 |
| 🔵 `noro.modules` | packages/db, packages/auth | 0000 |
| 🔵 `noro.plans` | packages/db | 0000 |
| 🔵 `noro.plan_modules` | packages/db | 0000 |
| 🔵 `noro.audit_events` | packages/db | 0000 |
| 🔵 `noro.leads` | packages/db, apps/core | 0001 |
| 🔵 `noro.clients` | packages/db, apps/core | 0001 |
| 🔵 `noro.suppliers` | packages/db, apps/control | 0002 |
| 🔵 `noro.products` | packages/db, apps/control | 0002 |
| 🔵 `noro.pricing_rules` | packages/db | 0002 |
| 🔵 `noro.proposals` | packages/db, apps/core, apps/portal | 0003 |
| 🔵 `noro.proposal_items` | packages/db, apps/core | 0003 |
| 🔵 `noro.payment_provider_accounts` | packages/db, apps/control | 0004 |
| 🔵 `noro.payment_customers` | packages/db | 0004 |
| 🔵 `noro.payment_charges` | packages/db, apps/control, apps/portal | 0004 |
| 🔵 `noro.payment_webhook_events` | packages/db, apps/portal | 0004 |
| 🔵 `noro.client_portal_sessions` | packages/db, apps/portal | 0005 |
| 🔵 `noro.proposal_documents` | packages/db, apps/core, apps/portal | 0007 |
| 🔵 `noro.proposal_itinerary_items` | packages/db, apps/portal | 0008 |
| 🔵 `noro.proposal_messages` | packages/db, apps/portal | 0008 |
| 🔵 `noro.emergency_contacts` | packages/db, apps/core, apps/portal | 0008 |

---

## Seção 5 — Mapa de gaps por prioridade

### Gap Crítico 1: apps/control faz 40+ chamadas a tabelas inexistentes

```
Tabelas que não existem e são chamadas com frequência alta:
  - pedidos (13x) — erro em runtime
  - cobrancas (7x) — erro em runtime
  - pedido_itens (7x) — erro em runtime

Impacto: seções de pedidos, cobranças e itens de pedido de apps/control
retornam erro para o usuário em produção silenciosamente.
```

### Gap Crítico 2: schema `noro` ausente de produção

```
31 arquivos de código referenciam tabelas noro.*
O schema não existe no banco de produção.
Qualquer deploy de apps/core ou apps/portal para produção
falhará na primeira query de banco.

Para usar apps/core e apps/portal em produção:
  - Opção A: criar schema noro no VPS e aplicar migrations 0000–0008
  - Opção B: apontar DATABASE_URL de produção para Neon (solução temporária)
  - Sem nenhuma opção: essas apps não funcionam em produção.
```

### Gap Crítico 3: dados do módulo financeiro sem acesso

```
O módulo financeiro (fin_receitas=58, fin_despesas=39, etc.) tem dados reais
mas nenhum código ativo referencia essas tabelas.
O módulo provavelmente foi desativado ou o código foi apagado.
Os dados existem e estão protegidos pelo banco, mas inacessíveis via app.
```

### Gap Crítico 4: noro_payment_configs (35 linhas) sem referência no código

```
A tabela noro_payment_configs tem 35 linhas — provavelmente configurações
de gateway de pagamento de tenants reais.
Nenhum arquivo de código atual a referencia.
Isso pode ser um resquício de configuração Asaas/Stripe feita manualmente.
```

### Gap Moderado 5: storage vazio em produção

```
storage.objects = 0 linhas. Nenhum arquivo em produção.
O código referencia Supabase Storage para documentos de clientes.
Ou os uploads nunca chegaram a produção, ou foram para outro provider.
```

### Gap Moderado 6: duplicação de tabelas entre schemas

```
Várias tabelas existem em formas duplicadas:
  - tenants: public.tenants (4), cp.tenants (5), billing (implícito)
  - leads: public.leads (0), public.noro_leads (3), cp.leads (2)
  - clientes: public.clientes (0), public.noro_clientes (9)
  - users: public.users (0), public.noro_users (6), auth.users (6)
  - plans: cp.plans (3), billing.plans (?)

Diferentes partes do código acessam versões diferentes das mesmas entidades.
```

---

## Resumo Quantitativo

| Categoria | Contagem |
|---|---|
| Schemas no banco | 19 |
| Schemas relevantes para o projeto | 6 (auth, billing, cp, noro*, public, storage) |
| Total de tabelas no banco (public+cp+auth+storage) | 180 |
| Tabelas com dados (>0 linhas) | ~40 |
| Tabelas referenciadas no código | ~80 |
| Tabelas no banco SEM referência no código | ~105 |
| Tabelas no código SEM existência no banco de produção | ~41 (14 legado + 26 noro + 1 view) |
| Tabelas no banco E no código (funcionando) | ~35 |
| Schema `noro` em produção | **NÃO EXISTE** |
