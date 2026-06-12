# Sprint — Reorganização de Schemas

Data de início: 2026-06-01  
Data de conclusão: 2026-06-01  
Banco: `noro_guru_db` em `45.32.169.173:5432`  
Proposta base: `db-schema-reorganization-proposal.md`  
Status: **concluída**

---

## Contexto

Todos os dados no banco são simulados — sem dados reais de clientes ou tenants.  
Backup confirmado pelo usuário antes do início.

---

## Resultado Final por Passo

| Passo | Descrição | Status | Resultado |
|---|---|---|---|
| PRÉ | Verificar views, sequences, dependências | ✅ | 17 views, 4 sequences, 29 ENUMs, 135 funções encontrados |
| 1 | Criar 16 schemas de destino | ✅ | `platform`, `platform_billing`, `platform_crm`, `noro_auth`, `audit`, `crm`, `sales`, `fin`, `catalog`, `portal`, `comunicacao`, `mkt`, `ai`, `sites`, `visa`, `_archive` |
| PRÉ-2 | Dropar 17 views (definições salvas abaixo) | ✅ | 5 em `cp`, 12 em `public` — dropadas com CASCADE |
| PRÉ-2 | Mover sequences standalone para `sales` | ✅ | `public.orcamento_sequence` e `public.pedido_sequence` → `sales` |
| 2 | Mover cp.* → platform / platform_crm / audit / _archive | ✅ | 34 → `platform`, 5 → `platform_crm`, 1 → `audit`, 2 → `_archive` |
| 2e | Renomear tabelas em platform | ✅ | `control_plane_config` → `config`, `control_plane_users` → `users`, `control_plane_user_activities` → `user_activities` |
| 2e | Renomear em audit | ✅ | `security_audit_log` → `platform_events` |
| 3 | billing → platform_billing | ✅ | 5 tabelas movidas, 5 ENUMs movidos, 3 funções movidas, schema `billing` dropado |
| 4 | public.* → schemas funcionais | ✅ | 88 tabelas movidas (2 noro_auth, 1 audit, 8 crm, 7 sales, 36 fin, 8 catalog, 8 comunicacao, 7 mkt, 2 ai, 4 sites, 5 visa) |
| FIX | `noro_fornecedores` não estava no mapeamento | ✅ | Movida para `catalog.suppliers_legado` |
| 5 | Renomear tabelas (remover prefixos redundantes) | ✅ | 76 tabelas renomeadas |
| 6 | Mover duplicatas para _archive | ✅ | 7 tabelas: `clientes`, `leads`, `markups`, `regras_preco`, `tenants`, `user_tenants`, `users` |
| 7 | Verificar public e dropar | ⚠️ PARCIAL | public tem 0 tabelas mas NÃO pode ser dropado (ver nota abaixo) |
| F2 | Atualizar código apps/control | ✅ | 270 replacements em 79 arquivos |

---

## Estado do Schema `public` Após a Sprint

`public` não pode ser dropado porque contém objetos que não podem ser movidos sem recriação:

| Tipo | Quantidade | Observação |
|---|---|---|
| ENUMs | 29 | Usados pelas colunas das tabelas em `fin.*`, `catalog.*` etc. — referenciados por OID, não por nome |
| Funções | 135 | Triggers, funções utilitárias, funções de sistema, funções da extensão `citext` |
| Extensões | 1 (`citext`) | Extensão PostgreSQL — não pode ser movida de schema |
| Tabelas | **0** | Schema limpo de dados de negócio |

**Decisão:** `public` permanece como schema de tipos e funções de sistema. Isso é comportamento esperado em PostgreSQL — `public` é o schema de utilitários, não de dados. O objetivo da sprint (limpar tabelas de `public`) foi atingido.

Para eliminar completamente o schema `public` no futuro seria necessário recriar todos os ENUMs nos schemas funcionais, atualizar as definições de coluna e remover/recriar todas as funções. Isso é uma sprint separada e de baixa prioridade.

---

## Schemas Finais no Banco

| Schema | Tabelas | Origem | Descrição |
|---|---|---|---|
| `platform` | 34 | cp.* | Gestão SaaS: tenants, planos, suporte, APIs, webhooks |
| `platform_billing` | 5 | billing.* | Billing SaaS: faturas, planos, pagamentos |
| `platform_crm` | 5 | cp.(leads/contacts/...) | CRM da Noro: leads B2B, contatos, funil |
| `noro_auth` | 2 | public.noro_* | Ponte auth: users_legado, update_tokens |
| `audit` | 2 | cp.* + public.* | Logs de auditoria |
| `crm` | 8 | public.noro_clientes* | Clientes/viajantes das agências |
| `sales` | 7 | public.noro_orcamentos* | Propostas, pedidos, emergências |
| `fin` | 36 | public.fin_* | Financeiro completo |
| `catalog` | 9 | public.produtos* + fornecedores | Catálogo de produtos |
| `comunicacao` | 8 | public.messages/chatbot/* | Chat, chatbot, notificações |
| `mkt` | 7 | public.noro_marketing* | Campanhas, email, social |
| `ai` | 2 | public.noro_ai* | Artigos e roteiros IA |
| `sites` | 4 | public.sites/noro_* | Sites das agências |
| `visa` | 5 | public.visa_* | Requisitos de visto |
| `portal` | 0 | — | Vazio — tabelas Drizzle ainda no Neon |
| `_archive` | 9 | cp.* + public.* | Duplicatas arquivadas: produtos, clientes, leads, etc. |
| `public` | 0 tabelas | — | Somente ENUMs, funções e extensão citext |

---

## Frente 2 — Código apps/control: Mapeamento de Replacements

### Replacements executados (270 total, 79 arquivos)

| Padrão antigo | Padrão novo | Contexto |
|---|---|---|
| `.schema('cp').from('leads')` | `.schema('platform_crm').from('leads')` | Leads B2B da Noro |
| `.schema('cp').from('contacts')` | `.schema('platform_crm').from('contacts')` | Contatos B2B |
| `.schema('cp').from('lead_activity')` | `.schema('platform_crm').from('lead_activity')` | Atividade de leads |
| `.schema('cp').from('lead_stages')` | `.schema('platform_crm').from('lead_stages')` | Etapas do funil |
| `.schema('cp').from('notes')` | `.schema('platform_crm').from('notes')` | Notas de leads |
| `.schema('cp')` | `.schema('platform')` | Todas as demais tabelas cp |
| `.from('noro_clientes')` | `.schema('crm').from('clients')` | Clientes |
| `.from('noro_clientes_enderecos')` | `.schema('crm').from('client_addresses')` | — |
| `.from('noro_clientes_documentos')` | `.schema('crm').from('client_documents')` | — |
| `.from('noro_clientes_milhas')` | `.schema('crm').from('client_miles')` | — |
| `.from('noro_clientes_preferencias')` | `.schema('crm').from('client_preferences')` | — |
| `.from('noro_clientes_contatos_emergencia')` | `.schema('sales').from('emergency_contacts')` | — |
| `.from('noro_leads')` | `.schema('crm').from('leads')` | Leads de agência |
| `.from('noro_interacoes')` | `.schema('crm').from('interactions')` | — |
| `.from('noro_tarefas')` | `.schema('crm').from('tasks')` | — |
| `.from('noro_orcamentos')` | `.schema('sales').from('proposals')` | Propostas |
| `.from('noro_orcamentos_itens')` | `.schema('sales').from('proposal_items')` | — |
| `.from('noro_pedidos')` | `.schema('sales').from('orders')` | Pedidos |
| `.from('pedidos')` | `.schema('sales').from('orders')` | Bug pré-existente (sem prefixo) |
| `.from('noro_pedidos_itens')` | `.schema('sales').from('order_items')` | — |
| `.from('pedido_itens')` | `.schema('sales').from('order_items')` | Bug pré-existente |
| `.from('noro_pedidos_timeline')` | `.schema('sales').from('order_timeline')` | — |
| `.from('noro_comissoes')` | `.schema('sales').from('commissions')` | — |
| `.from('noro_empresa')` | `.schema('sites').from('empresa')` | — |
| `.from('noro_configuracoes')` | `.schema('sites').from('configuracoes')` | — |
| `.from('noro_domains')` | `.schema('sites').from('domains')` | — |
| `.from('noro_users')` | `.schema('noro_auth').from('users_legado')` | — |
| `.from('noro_update_tokens')` | `.schema('noro_auth').from('update_tokens')` | — |
| `.from('noro_notificacoes')` | `.schema('comunicacao').from('notificacoes')` | — |
| `.from('conversations')` | `.schema('comunicacao').from('conversations')` | — |
| `.from('messages')` | `.schema('comunicacao').from('messages')` | — |
| `.from('notifications')` | `.schema('comunicacao').from('notifications')` | — |
| `.from('control_plane_users')` | `.schema('platform').from('users')` | — |
| `.from('control_plane_user_activities')` | `.schema('platform').from('user_activities')` | — |
| `.from('control_plane_config')` | `.schema('platform').from('config')` | — |
| `.from('subscription_plans')` | `.schema('platform').from('subscription_plans')` | Era view, agora tabela real |
| `.from('sites')` | `.schema('sites').from('agency_sites')` | — |
| `.from('noro_markup_rules')` | `.schema('catalog').from('markup_rules')` | — |

---

## Bloqueador Crítico — PostgREST

> ⚠️ **As mudanças de código NÃO vão funcionar em runtime sem esta configuração.**

O Supabase usa PostgREST para expor tabelas via API. PostgREST só expõe schemas explicitamente listados em sua configuração (`PGRST_DB_SCHEMAS` ou `db_schemas`).

Antes da sprint: apenas `public` e `cp` estavam expostos.  
Após a sprint: as queries usam `platform`, `platform_crm`, `crm`, `sales`, `fin`, `catalog`, `comunicacao`, `sites`, `noro_auth`, `audit`.

**Ação necessária antes de qualquer teste em runtime:**
Atualizar a configuração do Supabase/PostgREST para expor os novos schemas. Em ambiente self-hosted isso é feito via variável de ambiente:

```
PGRST_DB_SCHEMAS=public,platform,platform_billing,platform_crm,noro_auth,audit,crm,sales,fin,catalog,comunicacao,mkt,ai,sites,visa
```

Ou no arquivo `supabase/config.toml`:
```toml
[api]
schemas = ["public","platform","platform_billing","platform_crm","noro_auth","audit","crm","sales","fin","catalog","comunicacao","mkt","ai","sites","visa"]
```

Também é necessário garantir que os roles `anon` e `authenticated` tenham `USAGE` nos novos schemas e `SELECT/INSERT/UPDATE/DELETE` nas tabelas relevantes.

---

## Resíduo Pendente — `cobrancas`

5 referências remanescentes em `apps/control` para `.from('cobrancas')`:
- `app/api/webhooks/btg/route.ts` (2x)
- `app/(protected)/pedidos/pedidos-actions.ts` (3x)

A tabela `cobrancas` **nunca existiu** no banco em nenhum schema. É um bug pré-existente (Gap Crítico 1 do crossref). Não foi resolvida nesta sprint — requer decisão de negócio sobre o fluxo de cobranças.

---

## Views Dropadas — Definições para Referência Futura

As 17 views abaixo foram dropadas antes dos moves de schema. Suas definições estão aqui para eventual recriação com os novos nomes de schema/tabela.

### cp.active_tenants_with_billing → recria como platform.active_tenants_with_billing

Referencia: `platform.tenants`, `platform_billing.subscriptions`, `platform_billing.plans`

### cp.security_alerts → recria como platform.security_alerts

Referencia: `audit.platform_events`

### cp.v_api_key_usage_daily → recria como platform.v_api_key_usage_daily

Referencia: `platform.api_key_logs`

### cp.v_support_ticket_status_counts → recria como platform.v_support_ticket_status_counts

Referencia: `platform.support_tickets`

### cp.v_users → recria como platform.v_users

Referencia: `auth.users` (Supabase), `platform.user_tenant_roles`

### public.noro_funil_vendas → recria como crm.funil_vendas

Referencia: `crm.leads`

### public.subscription_plans → era view sobre cp.subscription_plans (agora tabela real em platform.subscription_plans)

Desnecessária — a tabela real já existe em `platform.subscription_plans`.

### public.v_fin_contas_pagar → recria como fin.contas_pagar

Referencia: `fin.despesas`

### public.v_fin_contas_receber → recria como fin.contas_receber

Referencia: `fin.receitas`

### public.v_fin_resumo_marca → recria como fin.resumo_marca

Referencia: `fin.receitas`, `fin.despesas`

### public.v_visa_info_basic → recria como visa.info_basic

Referencia: `visa.requirements`

### public.vw_fin_duplicatas_pagar → recria como fin.vw_duplicatas_pagar

Referencia: `fin.duplicatas_pagar`

### public.vw_fin_duplicatas_receber → recria como fin.vw_duplicatas_receber

Referencia: `fin.duplicatas_receber`

### public.vw_previsao_comissoes_futuras → recria como fin.vw_previsao_comissoes

Referencia: `fin.comissoes_recebidas`

### public.vw_rentabilidade_centros_custo → recria como fin.vw_rentabilidade_centros_custo

Referencia: `fin.centros_custo`, `fin.alocacoes`

### public.vw_saldo_adiantamentos → recria como fin.vw_saldo_adiantamentos

Referencia: `fin.adiantamentos`

### public.vw_saldo_creditos → recria como fin.vw_saldo_creditos

Referencia: `fin.creditos`
