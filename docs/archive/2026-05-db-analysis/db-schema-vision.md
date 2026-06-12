# Visão Completa do Schema de Banco de Dados — NORO

Data: 2026-05-30  
Fonte: leitura direta de `packages/db/schema/*.ts` + `docs/architecture/db-migration-mapping.md`  
Método: somente leitura — nenhum arquivo foi alterado.

---

## 1. Mapa Hierárquico de Schemas

```
DATABASE: noro_guru_db (VPS) / neondb (Neon dev)
│
├── schema: noro            ← canônico, Drizzle, 26 tabelas
│   ├── [Identidade]
│   │   ├── users
│   │   ├── identity_links
│   │   ├── platform_role_assignments
│   ├── [Multi-tenant]
│   │   ├── tenants
│   │   ├── tenant_memberships
│   │   ├── tenant_modules
│   ├── [Produto SaaS]
│   │   ├── modules
│   │   ├── plans
│   │   ├── plan_modules
│   ├── [Auditoria]
│   │   └── audit_events
│   ├── [CRM]
│   │   ├── leads
│   │   └── clients
│   ├── [Catálogo]
│   │   ├── suppliers
│   │   ├── products
│   │   └── pricing_rules
│   ├── [Propostas]
│   │   ├── proposals
│   │   ├── proposal_items
│   │   ├── proposal_documents
│   │   ├── proposal_itinerary_items
│   │   ├── proposal_messages
│   │   └── emergency_contacts
│   ├── [Portal do Viajante]
│   │   └── client_portal_sessions
│   └── [Financeiro/Pagamentos]
│       ├── payment_provider_accounts
│       ├── payment_customers
│       ├── payment_charges
│       └── payment_webhook_events
│
├── schema: public          ← legado Supabase, transitório
│   ├── users               → substituído por noro.users
│   ├── tenants             → substituído por noro.tenants
│   ├── leads               → substituído por noro.leads
│   ├── clientes            → substituído por noro.clients
│   ├── produtos            → substituído por noro.products
│   └── sites               → fora do escopo Drizzle atual
│
└── schema: cp              ← legado billing, transitório
    ├── plans               → substituído por noro.plans
    ├── subscriptions       → sem equivalente direto
    ├── tenants             → substituído por noro.tenants
    ├── leads               → duplicata; substituído por noro.leads
    └── contacts            → sem equivalente direto
```

> **Nota:** O schema `public` também contém tabelas prefixadas `noro_*`
> (`noro_users`, `noro_clientes`, `noro_orcamentos`, `noro_fornecedores`, etc.)
> que são a estrutura de produção legada. Ver seção 6 para mapeamento completo.

---

## 2. Schema noro — Tabelas Detalhadas

### Grupo: Identidade

---

#### `noro.users`

Arquivo: `packages/db/schema/users.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `display_name` | `text` | `text` | NULL | — | Nome de exibição |
| `email` | `text` | `text` | NOT NULL | — | Único por convenção, índice simples |
| `phone` | `text` | `text` | NULL | — | |
| `avatar_url` | `text` | `text` | NULL | — | |
| `status` | `text` | `text<UserStatus>` | NOT NULL | `'active'` | Enum: `active`, `invited`, `blocked`, `archived` |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | Dados extras livres |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `users_email_idx` — `(email)`
- `users_status_idx` — `(status)`

**FKs recebidas de outras tabelas:** `identity_links`, `tenant_memberships`, `platform_role_assignments`, `audit_events`, `leads`, `clients`, `proposals`

---

#### `noro.identity_links`

Arquivo: `packages/db/schema/identity-links.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `user_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.users.id` |
| `provider` | `text` | `text<IdentityProvider>` | NOT NULL | — | Enum: `logto`, `supabase` |
| `provider_subject` | `text` | `text` | NOT NULL | — | Sub/ID do provider externo |
| `provider_email` | `text` | `text` | NULL | — | Email reportado pelo provider |
| `legacy_supabase_user_id` | `uuid` | `uuid` | NULL | — | Ponte de migração Supabase→Logto |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `identity_links_provider_subject_uidx` — **UNIQUE** `(provider, provider_subject)`
- `identity_links_user_id_idx` — `(user_id)`
- `identity_links_legacy_supabase_user_id_idx` — `(legacy_supabase_user_id)`

---

#### `noro.platform_role_assignments`

Arquivo: `packages/db/schema/roles.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `user_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.users.id` |
| `role` | `text` | `text<PlatformRole>` | NOT NULL | — | Enum: `platform_owner`, `platform_admin`, `platform_ops`, `platform_finance`, `platform_support` |
| `status` | `text` | `text<PlatformRoleStatus>` | NOT NULL | `'active'` | Enum: `active`, `invited`, `blocked`, `archived` |
| `granted_by_user_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.users.id` (auto-referência) |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `platform_role_assignments_user_role_uidx` — **UNIQUE** `(user_id, role)`
- `platform_role_assignments_user_id_idx` — `(user_id)`
- `platform_role_assignments_role_idx` — `(role)`

> **Nota:** Unique parcial (somente `status = active`) está documentado como desejável mas não implementado em nível de banco — o repository aplica a regra via código.

---

### Grupo: Multi-tenant

---

#### `noro.tenants`

Arquivo: `packages/db/schema/tenants.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `name` | `text` | `text` | NOT NULL | — | Nome comercial da agência |
| `slug` | `text` | `text` | NOT NULL | — | Slug URL único |
| `legal_name` | `text` | `text` | NULL | — | Razão social |
| `document` | `text` | `text` | NULL | — | CPF ou CNPJ |
| `email` | `text` | `text` | NULL | — | Email principal |
| `phone` | `text` | `text` | NULL | — | |
| `status` | `text` | `text<TenantStatus>` | NOT NULL | `'active'` | Enum: `active`, `invited`, `blocked`, `archived` |
| `plan_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.plans.id` |
| `billing_status` | `text` | `text<TenantBillingStatus>` | NOT NULL | `'trialing'` | Enum: `trialing`, `current`, `past_due`, `suspended`, `cancelled`, `exempt` |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `portal_slug` | `text` | `text` | NULL | — | Subdomínio: `{slug}.agencia.noro.guru` |
| `portal_domain` | `text` | `text` | NULL | — | Domínio customizado: `xyz.com.br` |
| `portal_theme` | `jsonb` | `jsonb<PortalTheme>` | NULL | — | `{logoUrl, faviconUrl, primaryColor, secondaryColor, fontFamily, agencyDisplayName}` |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `tenants_slug_uidx` — **UNIQUE** `(slug)`
- `tenants_portal_slug_uidx` — **UNIQUE** `(portal_slug)`
- `tenants_portal_domain_uidx` — **UNIQUE** `(portal_domain)`
- `tenants_status_idx` — `(status)`
- `tenants_plan_id_idx` — `(plan_id)`
- `tenants_billing_status_idx` — `(billing_status)`

---

#### `noro.tenant_memberships`

Arquivo: `packages/db/schema/memberships.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.tenants.id` |
| `user_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.users.id` |
| `role` | `text` | `text<TenantRole>` | NOT NULL | — | Enum: `tenant_owner`, `tenant_admin`, `tenant_manager`, `tenant_agent`, `tenant_finance`, `tenant_viewer` |
| `status` | `text` | `text<MembershipStatus>` | NOT NULL | `'invited'` | Enum: `active`, `invited`, `blocked`, `archived` |
| `invited_by_user_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.users.id` |
| `joined_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `tenant_memberships_tenant_user_uidx` — **UNIQUE** `(tenant_id, user_id)`
- `tenant_memberships_tenant_id_idx` — `(tenant_id)`
- `tenant_memberships_user_id_idx` — `(user_id)`
- `tenant_memberships_role_idx` — `(role)`

---

#### `noro.tenant_modules`

Arquivo: `packages/db/schema/tenant-modules.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.tenants.id` |
| `module_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.modules.id` |
| `status` | `text` | `text<TenantModuleStatus>` | NOT NULL | `'disabled'` | Enum: `enabled`, `disabled`, `trial`, `suspended` |
| `source` | `text` | `text<TenantModuleSource>` | NOT NULL | `'manual'` | Enum: `plan`, `addon`, `manual`, `trial`, `system` |
| `starts_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `ends_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `limits` | `jsonb` | `jsonb<Record>` | NULL | — | Override de limites do plano |
| `settings` | `jsonb` | `jsonb<Record>` | NULL | — | Override de configurações |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `tenant_modules_tenant_module_uidx` — **UNIQUE** `(tenant_id, module_id)`
- `tenant_modules_tenant_id_idx` — `(tenant_id)`
- `tenant_modules_module_id_idx` — `(module_id)`
- `tenant_modules_status_idx` — `(status)`

---

### Grupo: Produto SaaS

---

#### `noro.modules`

Arquivo: `packages/db/schema/modules.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `key` | `text` | `text<ModuleKey>` | NOT NULL | — | Enum inicial: `crm`, `sites`, `finance`, `proposals`, `checkout`, `billing`, `suppliers`, `groups`, `ai`, `academy` |
| `name` | `text` | `text` | NOT NULL | — | Nome de exibição |
| `description` | `text` | `text` | NULL | — | |
| `status` | `text` | `text<ModuleStatus>` | NOT NULL | `'future'` | Enum: `active`, `inactive`, `deprecated`, `future` |
| `default_limits` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `default_settings` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `modules_key_uidx` — **UNIQUE** `(key)`
- `modules_status_idx` — `(status)`

---

#### `noro.plans`

Arquivo: `packages/db/schema/plans.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `key` | `text` | `text<PlanKey>` | NOT NULL | — | Enum: `free_site`, `starter`, `professional`, `agency`, `enterprise` |
| `name` | `text` | `text` | NOT NULL | — | |
| `description` | `text` | `text` | NULL | — | |
| `status` | `text` | `text<PlanStatus>` | NOT NULL | `'draft'` | Enum: `active`, `draft`, `archived`, `deprecated` |
| `billing_interval` | `text` | `text` | NULL | — | Ex: `monthly`, `annual` |
| `price_cents` | `integer` | `integer` | NULL | — | Preço em centavos |
| `currency` | `text` | `text` | NULL | — | |
| `limits` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `settings` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `plans_key_uidx` — **UNIQUE** `(key)`
- `plans_status_idx` — `(status)`

---

#### `noro.plan_modules`

Arquivo: `packages/db/schema/plans.ts` (mesma tabela)

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `plan_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.plans.id` |
| `module_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.modules.id` |
| `status` | `text` | `text<PlanModuleStatus>` | NOT NULL | `'enabled'` | Enum: `enabled`, `disabled` |
| `limits` | `jsonb` | `jsonb<Record>` | NULL | — | Limites específicos do plano |
| `settings` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `plan_modules_plan_module_uidx` — **UNIQUE** `(plan_id, module_id)`
- `plan_modules_plan_id_idx` — `(plan_id)`
- `plan_modules_module_id_idx` — `(module_id)`

---

### Grupo: Auditoria

---

#### `noro.audit_events`

Arquivo: `packages/db/schema/audit.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `actor_user_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.users.id` (nullable — sistema pode gerar eventos) |
| `tenant_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.tenants.id` (nullable — eventos de plataforma sem tenant) |
| `event_type` | `text` | `text` | NOT NULL | — | Ex: `user.login`, `proposal.sent` |
| `target_type` | `text` | `text` | NULL | — | Ex: `proposal`, `client` |
| `target_id` | `uuid` | `uuid` | NULL | — | ID do recurso afetado |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | Detalhes do evento |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | Sem `updated_at` — imutável |

**Índices:**
- `audit_events_actor_user_id_idx` — `(actor_user_id)`
- `audit_events_tenant_id_idx` — `(tenant_id)`
- `audit_events_event_type_idx` — `(event_type)`
- `audit_events_created_at_idx` — `(created_at)`

---

### Grupo: CRM

---

#### `noro.leads`

Arquivo: `packages/db/schema/leads.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.tenants.id` |
| `nome` | `text` | `text` | NOT NULL | — | |
| `email` | `text` | `text` | NULL | — | |
| `phone` | `text` | `text` | NULL | — | |
| `whatsapp` | `text` | `text` | NULL | — | |
| `organization_name` | `text` | `text` | NULL | — | Para leads PJ |
| `source` | `text` | `text<LeadSource>` | NOT NULL | — | Enum: `instagram_dm`, `whatsapp_organico`, `indicacao`, `formulario_web`, `campanha_paga`, `telefone`, `outro` |
| `source_detail` | `text` | `text` | NULL | — | Detalhe livre da origem |
| `assigned_to` | `uuid` | `uuid` | NULL | — | **FK** → `noro.users.id` |
| `budget_min_cents` | `integer` | `integer` | NULL | — | |
| `budget_max_cents` | `integer` | `integer` | NULL | — | |
| `destinos_interesse` | `text[]` | `text.array()` | NULL | — | Array de destinos |
| `data_viagem_inicio` | `date` | `date` | NULL | — | |
| `data_viagem_fim` | `date` | `date` | NULL | — | |
| `num_pax` | `integer` | `integer` | NULL | — | Número de passageiros |
| `tipo_viagem` | `text` | `text<LeadTipoViagem>` | NULL | — | Enum: `lazer`, `corporativo`, `lua_de_mel`, `grupo`, `incentivo`, `aventura`, `cruzeiro` |
| `status` | `text` | `text<LeadStatus>` | NOT NULL | `'novo'` | Enum: `novo`, `em_contato`, `briefing_coletado`, `proposta_enviada`, `proposta_visualizada`, `negociacao`, `ganho`, `perdido`, `inativo` |
| `lost_reason` | `text` | `text<LeadLostReason>` | NULL | — | Enum: `preco`, `concorrente`, `desistiu`, `sem_resposta`, `fora_do_perfil`, `outro` |
| `lead_score` | `integer` | `integer` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `last_contact_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `converted_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `converted_to` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.clients.id` (sem `.references()` — evita circular) |

**Índices:**
- `leads_tenant_id_idx` — `(tenant_id)`
- `leads_status_idx` — `(status)`
- `leads_assigned_to_idx` — `(assigned_to)`
- `leads_source_idx` — `(source)`
- `leads_created_at_idx` — `(created_at)`

---

#### `noro.clients`

Arquivo: `packages/db/schema/clients.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.tenants.id` |
| `lead_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.leads.id` (sem `.references()` — evita circular) |
| `tipo` | `text` | `text<ClientTipo>` | NOT NULL | — | Enum: `pessoa_fisica`, `pessoa_juridica` |
| `nome` | `text` | `text` | NOT NULL | — | |
| `nome_preferido` | `text` | `text` | NULL | — | |
| `cpf` | `text` | `text` | NULL | — | |
| `cnpj` | `text` | `text` | NULL | — | |
| `data_nascimento` | `date` | `date` | NULL | — | |
| `genero` | `text` | `text` | NULL | — | Enum TS: `masculino`, `feminino`, `outro`, `nao_informado` |
| `nacionalidade` | `text` | `text` | NOT NULL | `'brasileira'` | |
| `email` | `text` | `text` | NULL | — | |
| `phone` | `text` | `text` | NULL | — | |
| `whatsapp` | `text` | `text` | NULL | — | |
| `endereco_cidade` | `text` | `text` | NULL | — | |
| `endereco_estado` | `text` | `text` | NULL | — | |
| `endereco_pais` | `text` | `text` | NULL | `'Brasil'` | |
| `passaporte_numero` | `text` | `text` | NULL | — | |
| `passaporte_pais` | `text` | `text` | NULL | — | |
| `passaporte_validade` | `date` | `date` | NULL | — | |
| `passaporte_doc_url` | `text` | `text` | NULL | — | |
| `rg` | `text` | `text` | NULL | — | |
| `cnh_numero` | `text` | `text` | NULL | — | |
| `cnh_validade` | `date` | `date` | NULL | — | |
| `cnh_categorias` | `text[]` | `text.array()` | NULL | — | |
| `restricoes_alimentares` | `text[]` | `text.array()` | NULL | — | |
| `restricoes_medicas` | `text` | `text` | NULL | — | |
| `nivel_mobilidade` | `text` | `text` | NULL | — | Enum TS: `sem_restricao`, `mobilidade_reduzida`, `cadeirante` |
| `apto_atividade_fisica` | `boolean` | `boolean` | NULL | — | |
| `status` | `text` | `text<ClientStatus>` | NOT NULL | `'ativo'` | Enum: `ativo`, `inativo`, `vip`, `bloqueado`, `prospecto` |
| `nivel` | `text` | `text<ClientNivel>` | NULL | — | Enum: `standard`, `silver`, `gold`, `platinum` |
| `segmento` | `text` | `text<ClientSegmento>` | NULL | — | Enum: `lazer`, `corporativo`, `grupos`, `incentivo` |
| `assigned_to` | `uuid` | `uuid` | NULL | — | **FK** → `noro.users.id` |
| `total_viagens` | `integer` | `integer` | NULL | `0` | Calculado por automação |
| `total_gasto_cents` | `bigint` | `bigint(number)` | NULL | `0` | Calculado por automação |
| `ultima_viagem_at` | `date` | `date` | NULL | — | |
| `proxima_viagem_at` | `date` | `date` | NULL | — | |
| `destinos_visitados` | `text[]` | `text.array()` | NULL | — | |
| `destinos_desejados` | `text[]` | `text.array()` | NULL | — | |
| `tipo_acomodacao_pref` | `text` | `text` | NULL | — | Enum TS: `hotel`, `pousada`, `resort`, `all_inclusive`, `hostel` |
| `classe_voo_pref` | `text` | `text` | NULL | — | Enum TS: `economica`, `executiva`, `primeira` |
| `viaja_com` | `text[]` | `text.array()` | NULL | — | |
| `contato_emergencia_nome` | `text` | `text` | NULL | — | |
| `contato_emergencia_phone` | `text` | `text` | NULL | — | |
| `contato_emergencia_parentesco` | `text` | `text` | NULL | — | |
| `lgpd_aceito` | `boolean` | `boolean` | NOT NULL | `false` | |
| `lgpd_aceito_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `lgpd_versao` | `text` | `text` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `observacoes` | `text` | `text` | NULL | — | |

**Índices:**
- `clients_tenant_id_idx` — `(tenant_id)`
- `clients_status_idx` — `(status)`
- `clients_assigned_to_idx` — `(assigned_to)`
- `clients_email_idx` — `(email)`
- `clients_created_at_idx` — `(created_at)`

---

### Grupo: Catálogo

---

#### `noro.suppliers`

Arquivo: `packages/db/schema/suppliers.ts`

Tabela de catálogo **global** (sem `tenant_id` — decisão arquitetural Sprint 3).

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `nome` | `text` | `text` | NOT NULL | — | |
| `tipo` | `text` | `text<SupplierTipo>` | NULL | — | Enum: `agencia_receptiva`, `hotel`, `operadora`, `transporte`, `seguradora`, `outro` |
| `cnpj` | `text` | `text` | NULL | — | |
| `website` | `text` | `text` | NULL | — | |
| `pais` | `text` | `text` | NULL | — | |
| `cidade` | `text` | `text` | NULL | — | |
| `contato_nome` | `text` | `text` | NULL | — | |
| `contato_email` | `text` | `text` | NULL | — | |
| `contato_phone` | `text` | `text` | NULL | — | |
| `contato_whatsapp` | `text` | `text` | NULL | — | |
| `observacoes` | `text` | `text` | NULL | — | |
| `api_tipo` | `text` | `text<SupplierApiTipo>` | NULL | `'manual'` | Enum: `manual`, `hotelbeds`, `amadeus`, `outro` |
| `api_ativo` | `boolean` | `boolean` | NULL | `false` | |
| `status` | `text` | `text<SupplierStatus>` | NOT NULL | `'ativo'` | Enum: `ativo`, `inativo`, `suspenso` |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `suppliers_status_idx` — `(status)`
- `suppliers_tipo_idx` — `(tipo)`
- `suppliers_api_tipo_idx` — `(api_tipo)`

---

#### `noro.products`

Arquivo: `packages/db/schema/products.ts`

Tabela de catálogo **global** (sem `tenant_id`).

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `supplier_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.suppliers.id` (nullable — produto sem fornecedor formal) |
| `categoria` | `text` | `text<ProductCategoria>` | NOT NULL | — | Enum: `hospedagem`, `aereo`, `transfer`, `passeio`, `ingresso`, `cruzeiro`, `seguro`, `servico`, `outro` |
| `nome` | `text` | `text` | NOT NULL | — | |
| `descricao` | `text` | `text` | NULL | — | |
| `destino_pais` | `text` | `text` | NULL | — | |
| `destino_cidade` | `text` | `text` | NULL | — | |
| `destino_regiao` | `text` | `text` | NULL | — | |
| `duracao_minutos` | `integer` | `integer` | NULL | — | |
| `capacidade_min` | `integer` | `integer` | NULL | — | |
| `capacidade_max` | `integer` | `integer` | NULL | — | |
| `inclui_ingresso` | `boolean` | `boolean` | NULL | — | |
| `inclui_transfer` | `boolean` | `boolean` | NULL | — | |
| `moeda` | `text` | `text<ProductMoeda>` | NOT NULL | `'BRL'` | Enum: `BRL`, `USD`, `EUR`, `ARS` |
| `preco_tipo` | `text` | `text<ProductPrecoTipo>` | NOT NULL | — | Enum: `manual`, `api_tempo_real`, `api_cache` |
| `status` | `text` | `text<ProductStatus>` | NOT NULL | `'ativo'` | Enum: `ativo`, `inativo`, `arquivado` |
| `tags` | `text[]` | `text.array()` | NULL | — | |
| `observacoes_internas` | `text` | `text` | NULL | — | |
| `preco_atualizado_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `products_categoria_idx` — `(categoria)`
- `products_status_idx` — `(status)`
- `products_supplier_id_idx` — `(supplier_id)`
- `products_preco_tipo_idx` — `(preco_tipo)`
- `products_moeda_idx` — `(moeda)`

> **Nota arquitetural:** `custo_base_cents` foi removido intencionalmente. O custo fica no snapshot do `proposal_items` no momento da booking, não no catálogo.

---

#### `noro.pricing_rules`

Arquivo: `packages/db/schema/pricing-rules.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `nome` | `text` | `text` | NOT NULL | — | |
| `escopo` | `text` | `text<PricingRuleEscopo>` | NOT NULL | — | Enum: `plataforma`, `tenant` |
| `tenant_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.tenants.id` (null = regra de plataforma) |
| `categoria` | `text` | `text` | NULL | — | null = aplica a todas as categorias |
| `plan_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.plans.id` (null = aplica a todos os planos) |
| `canal` | `text` | `text<PricingRuleCanal>` | NULL | — | Enum: `direto`, `agente`, `api` (null = todos os canais) |
| `tipo_regra` | `text` | `text<PricingRuleTipo>` | NOT NULL | — | Enum: `markup_percentual`, `markup_minimo_percentual`, `taxa_cartao_percentual`, `taxa_remessa_percentual`, `taxa_fixa_cents` |
| `valor` | `numeric(10,4)` | `numeric` | NOT NULL | — | % ou cents conforme `tipo_regra` |
| `moeda` | `text` | `text` | NULL | `'BRL'` | Para `taxa_fixa_cents` |
| `prioridade` | `integer` | `integer` | NULL | `0` | Menor = aplicado primeiro |
| `ativo` | `boolean` | `boolean` | NOT NULL | `true` | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pricing_rules_escopo_idx` — `(escopo)`
- `pricing_rules_tenant_id_idx` — `(tenant_id)`
- `pricing_rules_tipo_regra_idx` — `(tipo_regra)`
- `pricing_rules_ativo_idx` — `(ativo)`
- `pricing_rules_prioridade_idx` — `(prioridade)`

---

### Grupo: Propostas

---

#### `noro.proposals`

Arquivo: `packages/db/schema/proposals.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.tenants.id` |
| `lead_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.leads.id` |
| `client_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.clients.id` |
| `numero` | `text` | `text` | NOT NULL | — | Formato `{ANO}-{NNNN}`, sequencial por tenant |
| `titulo` | `text` | `text` | NOT NULL | — | |
| `versao` | `integer` | `integer` | NOT NULL | `1` | Incrementado a cada envio |
| `data_viagem_inicio` | `date` | `date` | NULL | — | |
| `data_viagem_fim` | `date` | `date` | NULL | — | |
| `num_pax` | `integer` | `integer` | NULL | — | |
| `destino_principal` | `text` | `text` | NULL | — | |
| `moeda_base` | `text` | `text` | NOT NULL | `'BRL'` | |
| `subtotal_cents` | `bigint` | `bigint(number)` | NULL | `0` | |
| `desconto_cents` | `bigint` | `bigint(number)` | NULL | `0` | |
| `total_cents` | `bigint` | `bigint(number)` | NULL | `0` | |
| `valor_sinal_cents` | `bigint` | `bigint(number)` | NULL | — | |
| `condicoes_pagamento` | `text` | `text` | NULL | — | |
| `taxa_cambio_snapshot` | `numeric(10,6)` | `numeric` | NULL | — | Referência histórica — sem uso contratual |
| `taxa_cambio_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `status` | `text` | `text<ProposalStatus>` | NOT NULL | `'rascunho'` | Enum: `rascunho`, `enviada`, `visualizada`, `aceita`, `recusada`, `expirada`, `cancelada` |
| `aceite_tipo` | `text` | `text<ProposalAceiteTipo>` | NULL | — | Enum: `manual`, `link_publico` |
| `aceite_token` | `text` | `text` | NULL | — | Token UUID para link público — acesso aciona `visualizada` automaticamente |
| `aceita_at` | `timestamptz` | `timestamp+tz` | NULL | — | Preenchido → snapshot de itens torna-se imutável |
| `aceita_por_nome` | `text` | `text` | NULL | — | |
| `validade_ate` | `date` | `date` | NULL | — | |
| `descricao` | `text` | `text` | NULL | — | |
| `observacoes` | `text` | `text` | NULL | — | |
| `termos_condicoes` | `text` | `text` | NULL | — | |
| `created_by` | `uuid` | `uuid` | NULL | — | **FK** → `noro.users.id` |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `sent_at` | `timestamptz` | `timestamp+tz` | NULL | — | |

**Índices:**
- `proposals_tenant_id_idx` — `(tenant_id)`
- `proposals_status_idx` — `(status)`
- `proposals_lead_id_idx` — `(lead_id)`
- `proposals_client_id_idx` — `(client_id)`
- `proposals_aceite_token_idx` — `(aceite_token)`
- `proposals_created_at_idx` — `(created_at)`

---

#### `noro.proposal_items`

Arquivo: `packages/db/schema/proposals.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `proposal_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.proposals.id` |
| `product_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.products.id` (null para itens manuais) |
| `tipo` | `text` | `text<ProposalItemTipo>` | NOT NULL | — | Enum: `produto_catalogo`, `manual` |
| `nome` | `text` | `text` | NOT NULL | — | |
| `descricao` | `text` | `text` | NULL | — | |
| `categoria` | `text` | `text` | NULL | — | |
| `data_inicio` | `date` | `date` | NULL | — | |
| `data_fim` | `date` | `date` | NULL | — | |
| `num_pax` | `integer` | `integer` | NULL | — | |
| `moeda_original` | `text` | `text` | NOT NULL | `'BRL'` | |
| `taxa_cambio` | `numeric(10,6)` | `numeric` | NULL | — | Snapshot de câmbio no momento da criação do item |
| `custo_base_cents` | `bigint` | `bigint(number)` | NULL | — | |
| `preco_venda_cents` | `bigint` | `bigint(number)` | NOT NULL | — | |
| `markup_percentual` | `numeric(5,2)` | `numeric` | NULL | — | |
| `snapshot_pricing_rules` | `jsonb` | `jsonb<Record>` | NULL | — | **Imutável após `proposals.aceita_at`** — bloqueio no repository |
| `ordem` | `integer` | `integer` | NOT NULL | `0` | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `proposal_items_proposal_id_idx` — `(proposal_id)`
- `proposal_items_product_id_idx` — `(product_id)`
- `proposal_items_ordem_idx` — `(proposal_id, ordem)`

---

#### `noro.proposal_documents`

Arquivo: `packages/db/schema/proposal-documents.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** |
| `proposal_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.proposals.id` |
| `name` | `text` | `text` | NOT NULL | — | |
| `tipo` | `text` | `text<ProposalDocumentTipo>` | NOT NULL | `'outro'` | Enum: `voucher`, `bilhete`, `visto`, `seguro`, `contrato`, `recibo`, `outro` |
| `file_url` | `text` | `text` | NOT NULL | — | URL no Supabase Storage (transitório) |
| `mime_type` | `text` | `text` | NULL | — | |
| `size_bytes` | `bigint` | `bigint(number)` | NULL | — | |
| `uploaded_by` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.users.id` |
| `visible_to_client` | `boolean` | `boolean` | NOT NULL | `true` | Controla visibilidade no portal |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pd_tenant_id_idx` — `(tenant_id)`
- `pd_proposal_id_idx` — `(proposal_id)`
- `pd_visible_to_client_idx` — `(visible_to_client)`

---

#### `noro.proposal_itinerary_items`

Arquivo: `packages/db/schema/proposal-itinerary.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** |
| `proposal_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.proposals.id` |
| `data` | `text` | `text` | NULL | — | `YYYY-MM-DD` como string — evita ambiguidade de timezone |
| `hora_inicio` | `text` | `text` | NULL | — | `HH:MM` |
| `hora_fim` | `text` | `text` | NULL | — | `HH:MM` |
| `tipo` | `text` | `text<ItineraryTipo>` | NOT NULL | `'outro'` | Enum: `transporte`, `hospedagem`, `passeio`, `refeicao`, `livre`, `outro` |
| `local` | `text` | `text` | NULL | — | |
| `titulo` | `text` | `text` | NOT NULL | — | |
| `descricao` | `text` | `text` | NULL | — | |
| `endereco` | `text` | `text` | NULL | — | Endereço completo para integração futura com Maps |
| `document_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.proposal_documents.id` |
| `ordem` | `integer` | `integer` | NOT NULL | `0` | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pii_tenant_id_idx` — `(tenant_id)`
- `pii_proposal_id_idx` — `(proposal_id)`
- `pii_data_ordem_idx` — `(proposal_id, data, ordem)`

---

#### `noro.proposal_messages`

Arquivo: `packages/db/schema/proposal-messages.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** |
| `proposal_id` | `uuid` | `uuid` | NOT NULL | — | **FK** → `noro.proposals.id` |
| `sender_type` | `text` | `text<MessageSenderType>` | NOT NULL | — | Enum: `agent`, `client` |
| `sender_user_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.users.id` (preenchido quando `sender_type = 'agent'`) |
| `sender_client_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.clients.id` (preenchido quando `sender_type = 'client'`) |
| `content` | `text` | `text` | NOT NULL | — | |
| `read_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pm_tenant_id_idx` — `(tenant_id)`
- `pm_proposal_id_idx` — `(proposal_id)`
- `pm_created_at_idx` — `(proposal_id, created_at)`

---

#### `noro.emergency_contacts`

Arquivo: `packages/db/schema/emergency-contacts.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** |
| `proposal_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.proposals.id` (null = contato global do tenant) |
| `tipo` | `text` | `text<EmergencyContactTipo>` | NOT NULL | `'outro'` | Enum: `agencia`, `seguradora`, `consulado`, `hospital`, `outro` |
| `nome` | `text` | `text` | NOT NULL | — | |
| `telefone` | `text` | `text` | NULL | — | |
| `whatsapp` | `text` | `text` | NULL | — | Canal preferencial no Brasil |
| `email` | `text` | `text` | NULL | — | |
| `observacoes` | `text` | `text` | NULL | — | |
| `ordem` | `integer` | `integer` | NOT NULL | `0` | |
| `ativo` | `boolean` | `boolean` | NOT NULL | `true` | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `ec_tenant_id_idx` — `(tenant_id)`
- `ec_proposal_id_idx` — `(proposal_id)`
- `ec_ativo_idx` — `(tenant_id, ativo)`

---

### Grupo: Portal do Viajante

---

#### `noro.client_portal_sessions`

Arquivo: `packages/db/schema/client-portal-sessions.ts`

Auth separada do Logto — magic link por email para o portal do viajante (`apps/portal`).

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** → `noro.tenants.id` |
| `client_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.clients.id` (null se email não corresponde a cliente) |
| `client_email` | `text` | `text` | NOT NULL | — | |
| `token` | `text` | `text` | NOT NULL | — | Token único do magic link |
| `expires_at` | `timestamptz` | `timestamp+tz` | NOT NULL | — | |
| `verified_at` | `timestamptz` | `timestamp+tz` | NULL | — | Preenchido quando o cliente clica no link |
| `revoked_at` | `timestamptz` | `timestamp+tz` | NULL | — | Preenchido ao fazer logout |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `client_portal_sessions_token_uidx` — **UNIQUE** `(token)`
- `client_portal_sessions_tenant_id_idx` — `(tenant_id)`
- `client_portal_sessions_client_id_idx` — `(client_id)`
- `client_portal_sessions_client_email_idx` — `(client_email)`
- `client_portal_sessions_expires_at_idx` — `(expires_at)`

---

### Grupo: Financeiro/Pagamentos

---

#### `noro.payment_provider_accounts`

Arquivo: `packages/db/schema/payment-provider-accounts.ts`

Subcontas Asaas por tenant — uma por provider.

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** → `noro.tenants.id` |
| `provider` | `text` | `text` | NOT NULL | `'asaas'` | |
| `provider_account_id` | `text` | `text` | NULL | — | ID da subconta no gateway |
| `provider_wallet_id` | `text` | `text` | NULL | — | walletId para split de recebíveis |
| `onboarding_status` | `text` | `text<ProviderAccountOnboardingStatus>` | NOT NULL | `'pending'` | Enum: `pending`, `in_review`, `approved`, `rejected` |
| `consent_registered_at` | `timestamptz` | `timestamp+tz` | NULL | — | Consentimento explícito do tenant |
| `consent_registered_by` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.users.id` |
| `status` | `text` | `text<ProviderAccountStatus>` | NOT NULL | `'inactive'` | Enum: `inactive`, `active`, `suspended` |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | Resposta bruta da API de onboarding |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `ppa_tenant_provider_uidx` — **UNIQUE** `(tenant_id, provider)`
- `ppa_status_idx` — `(status)`
- `ppa_onboarding_status_idx` — `(onboarding_status)`

---

#### `noro.payment_customers`

Arquivo: `packages/db/schema/payment-customers.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** → `noro.tenants.id` |
| `client_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.clients.id` |
| `provider` | `text` | `text` | NOT NULL | `'asaas'` | |
| `provider_customer_id` | `text` | `text` | NOT NULL | — | ID do cliente no Asaas |
| `name` | `text` | `text` | NULL | — | |
| `email` | `text` | `text` | NULL | — | |
| `cpf_cnpj` | `text` | `text` | NULL | — | CPF (PF) ou CNPJ (PJ) |
| `metadata` | `jsonb` | `jsonb<Record>` | NULL | — | |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pc_tenant_provider_customer_uidx` — **UNIQUE** `(tenant_id, provider, provider_customer_id)`
- `pc_tenant_id_idx` — `(tenant_id)`
- `pc_client_id_idx` — `(client_id)`

---

#### `noro.payment_charges`

Arquivo: `packages/db/schema/payment-charges.ts`

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `tenant_id` | `uuid` | `uuid` | NOT NULL | — | **FK lógica** → `noro.tenants.id` |
| `proposal_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.proposals.id` |
| `payment_customer_id` | `uuid` | `uuid` | NULL | — | **FK** → `noro.payment_customers.id` |
| `provider` | `text` | `text` | NOT NULL | `'asaas'` | |
| `provider_payment_id` | `text` | `text` | NULL | — | ID da cobrança no Asaas |
| `repasse_modelo` | `text` | `text<ChargeRepasseModelo>` | NOT NULL | — | Enum: `plataforma` (NORO recebe → repassa), `agencia` (cai direto na subconta) |
| `amount_cents` | `bigint` | `bigint(number)` | NOT NULL | — | Valor bruto em centavos |
| `net_amount_cents` | `bigint` | `bigint(number)` | NULL | — | Valor líquido após taxas |
| `currency` | `text` | `text` | NOT NULL | `'BRL'` | |
| `taxa_cambio_snapshot` | `numeric(10,6)` | `numeric` | NULL | — | |
| `billing_type` | `text` | `text<ChargeBillingType>` | NOT NULL | — | Enum: `PIX`, `BOLETO`, `CREDIT_CARD` |
| `installments` | `integer` | `integer` | NULL | `1` | |
| `status` | `text` | `text<ChargeStatus>` | NOT NULL | `'draft'` | Enum: `draft`, `pending`, `processing`, `confirmed`, `received`, `overdue`, `refunded`, `canceled`, `failed` |
| `due_date` | `date` | `date` | NULL | — | |
| `paid_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `confirmed_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `received_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `escrow_status` | `text` | `text<ChargeEscrowStatus>` | NULL | — | Enum: `held`, `released`, `refunded` (só para `repasse_modelo = 'plataforma'`) |
| `escrow_release_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `escrow_released_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `split_noro_pct` | `numeric(5,2)` | `numeric` | NULL | — | % NORO no split — imutável |
| `split_noro_cents` | `bigint` | `bigint(number)` | NULL | — | |
| `split_tenant_cents` | `bigint` | `bigint(number)` | NULL | — | |
| `checkout_url` | `text` | `text` | NULL | — | |
| `invoice_url` | `text` | `text` | NULL | — | |
| `bank_slip_url` | `text` | `text` | NULL | — | |
| `pix_qr_code` | `text` | `text` | NULL | — | |
| `pix_copy_paste` | `text` | `text` | NULL | — | Código Pix copia-e-cola |
| `sinal_valor_cents` | `bigint` | `bigint(number)` | NULL | — | Sinal (funcionalidade futura) |
| `sinal_pago_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `sinal_meio` | `text` | `text` | NULL | — | Enum TS: `pix`, `dinheiro`, `ted`, `outro` |
| `provider_payload` | `jsonb` | `jsonb<Record>` | NULL | — | Payload bruto do gateway — imutável |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |
| `updated_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pch_tenant_id_idx` — `(tenant_id)`
- `pch_proposal_id_idx` — `(proposal_id)`
- `pch_status_idx` — `(status)`
- `pch_repasse_modelo_idx` — `(repasse_modelo)`
- `pch_provider_payment_id_idx` — `(provider_payment_id)`
- `pch_escrow_status_idx` — `(escrow_status)`

---

#### `noro.payment_webhook_events`

Arquivo: `packages/db/schema/payment-webhook-events.ts`

Log idempotente de webhooks do gateway.

| Coluna | Tipo SQL | Drizzle | Nulo | Default | Observação |
|---|---|---|---|---|---|
| `id` | `uuid` | `uuid` | NOT NULL | `gen_random_uuid()` | **PK** |
| `provider` | `text` | `text` | NOT NULL | `'asaas'` | |
| `provider_event_id` | `text` | `text` | NOT NULL | — | ID único do evento no gateway |
| `event_type` | `text` | `text` | NOT NULL | — | Ex: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED` |
| `charge_id` | `uuid` | `uuid` | NULL | — | **FK lógica** → `noro.payment_charges.id` |
| `payload` | `jsonb` | `jsonb<Record>` | NOT NULL | — | Payload bruto recebido — nunca alterado |
| `processed` | `boolean` | `boolean` | NOT NULL | `false` | |
| `processed_at` | `timestamptz` | `timestamp+tz` | NULL | — | |
| `error` | `text` | `text` | NULL | — | Mensagem de erro se processamento falhou |
| `created_at` | `timestamptz` | `timestamp+tz` | NOT NULL | `now()` | |

**Índices:**
- `pwe_provider_event_uidx` — **UNIQUE** `(provider, provider_event_id)` ← chave de idempotência
- `pwe_charge_id_idx` — `(charge_id)`
- `pwe_processed_idx` — `(processed)`
- `pwe_event_type_idx` — `(event_type)`

---

## 3. Diagrama de Dependências

```
                          ┌─────────┐       ┌─────────┐
                          │ modules │       │  plans  │
                          └────┬────┘       └────┬────┘
                               │                  │
               ┌───────────────┼──────────────────┤
               ▼               │                  ▼
         ┌─────────────┐       │         ┌──────────────┐
         │ plan_modules│◄──────┘         │    tenants   │◄─────────────────────────────┐
         └─────────────┘                 └──────┬───────┘                              │
                                                │                                      │
                     ┌──────────────────────────┼──────────────────────────┐           │
                     ▼              ▼           ▼              ▼           ▼           │
              ┌────────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐ ┌──────────────┐  │
              │tenant_mmbr.│ │t_modules │ │  leads  │ │  clients  │ │pricing_rules │  │
              └────────────┘ └──────────┘ └────┬────┘ └─────┬─────┘ └──────────────┘  │
                                          lógica│      lógica│                         │
                                               ▼(lógica)    ▼(lógica)                 │
┌───────┐    ┌──────────────┐                 ┌────────────────────┐                  │
│ users │───►│identity_links│                 │     proposals      │──────────────────►┘
└───┬───┘    └──────────────┘                 └──────────┬─────────┘
    │        ┌──────────────┐                            │
    │        │platform_role │                            ├──────────────────────────────┐
    │        │_assignments  │                            │                              │
    │        └──────────────┘                            ▼                              ▼
    │        ┌──────────────┐                 ┌──────────────────┐         ┌───────────────────┐
    └───────►│ audit_events │                 │  proposal_items  │         │ proposal_documents │
             └──────────────┘                 │  (→products)     │         └────────┬──────────┘
                                              └──────────────────┘                  │
┌──────────┐  ┌──────────┐                                                          │
│suppliers │─►│ products │                   ┌──────────────────────────────────────▼───────┐
└──────────┘  └──────────┘                   │         proposal_itinerary_items              │
                                             │         (→proposal_documents)                │
                                             └──────────────────────────────────────────────┘
                                             ┌───────────────────┐
                                             │ proposal_messages │
                                             └───────────────────┘
                                             ┌───────────────────┐
                                             │ emergency_contacts│
                                             └───────────────────┘

PORTAL:
                                             ┌────────────────────────┐
                                             │ client_portal_sessions │ (todas FKs lógicas)
                                             └────────────────────────┘

FINANCEIRO:
┌──────────────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│payment_provider_accts│    │payment_customers │───►│    payment_charges      │
│ (todas FKs lógicas)  │    │ (FKs lógicas)    │    │ (→payment_customers FK) │
└──────────────────────┘    └──────────────────┘    └────────────┬────────────┘
                                                                  │(lógica)
                                                                  ▼
                                                   ┌──────────────────────────┐
                                                   │ payment_webhook_events   │
                                                   └──────────────────────────┘
```

### Legenda de FK

| Símbolo | Significado |
|---|---|
| `─►` | FK hard via `.references()` — banco garante integridade |
| `lógica` | FK lógica sem `.references()` — integridade garantida pelo repository |

### Grupos de FK circular resolvidos por FK lógica

| Par | Motivo da FK lógica |
|---|---|
| `leads.converted_to` ↔ `clients.lead_id` | Dependência circular leads→clients e clients→leads |
| `proposals.lead_id`, `proposals.client_id` | Proposta pode existir sem lead/cliente confirmado |
| `client_portal_sessions.tenant_id` / `client_id` | Desacoplamento portal ↔ CRM |
| `payment_*.tenant_id` | Desacoplamento módulo financeiro do tenant |

---

## 4. Ordem de Criação Obrigatória

Baseado apenas nas FKs hard (`.references()`). Tabelas com somente FKs lógicas podem ser criadas em qualquer posição após as dependências lógicas.

```
Nível 0 — sem dependências
═══════════════════════════
  1. noro.modules
  2. noro.users
  3. noro.suppliers

Nível 1 — dependem somente de nível 0
══════════════════════════════════════
  4. noro.plans               (deps: modules para plan_modules, mas plans em si não tem deps)
  5. noro.identity_links      (deps: users)
  6. noro.platform_role_assignments (deps: users)

Nível 2 — dependem de nível 0-1
═════════════════════════════════
  7. noro.plan_modules        (deps: plans, modules)
  8. noro.tenants             (deps: plans [FK nullable])
  9. noro.products            (deps: suppliers [FK nullable])

Nível 3 — dependem de nível 0-2
═════════════════════════════════
 10. noro.tenant_memberships  (deps: tenants, users)
 11. noro.tenant_modules      (deps: tenants, modules)
 12. noro.audit_events        (deps: users [nullable], tenants [nullable])
 13. noro.leads               (deps: tenants, users [nullable])
 14. noro.clients             (deps: tenants, users [nullable])
 15. noro.pricing_rules       (deps: tenants [nullable], plans [nullable])

Nível 4 — dependem de nível 0-3
═════════════════════════════════
 16. noro.proposals           (deps: tenants, users [nullable]; leads/clients: lógica)

Nível 5 — dependem de nível 0-4
═════════════════════════════════
 17. noro.proposal_documents  (deps: proposals [nullable])
 18. noro.proposal_items      (deps: proposals, products [nullable])
 19. noro.proposal_messages   (deps: proposals)
 20. noro.emergency_contacts  (deps: proposals [nullable])

 21. noro.payment_customers   (deps: todas FKs lógicas — pode ser criada após nível 0)
 22. noro.payment_provider_accounts (deps: todas FKs lógicas)
 23. noro.client_portal_sessions    (deps: todas FKs lógicas)

Nível 6 — dependem de nível 0-5
═════════════════════════════════
 24. noro.proposal_itinerary_items (deps: proposals, proposal_documents [nullable])
 25. noro.payment_charges     (deps: payment_customers [nullable])

Nível 7 — dependem de nível 0-6
═════════════════════════════════
 26. noro.payment_webhook_events (deps: todas FKs lógicas — pode ser criada após nível 0)
```

> Esta ordem é respeitada pelas migrations Drizzle. A migration `0000_panoramic_alice.sql` cria
> os níveis 0-3 (10 tabelas). As migrations subsequentes seguem a hierarquia.

---

## 5. Enums Consolidados

| Enum | Valores | Tabelas que usam |
|---|---|---|
| `UserStatus` | `active`, `invited`, `blocked`, `archived` | `users.status`, `tenant_memberships.status`, `platform_role_assignments.status`, `tenants.status` |
| `IdentityProvider` | `logto`, `supabase` | `identity_links.provider` |
| `TenantBillingStatus` | `trialing`, `current`, `past_due`, `suspended`, `cancelled`, `exempt` | `tenants.billing_status` |
| `TenantRole` | `tenant_owner`, `tenant_admin`, `tenant_manager`, `tenant_agent`, `tenant_finance`, `tenant_viewer` | `tenant_memberships.role` |
| `PlatformRole` | `platform_owner`, `platform_admin`, `platform_ops`, `platform_finance`, `platform_support` | `platform_role_assignments.role` |
| `ModuleStatus` | `active`, `inactive`, `deprecated`, `future` | `modules.status` |
| `PlanStatus` | `active`, `draft`, `archived`, `deprecated` | `plans.status` |
| `TenantModuleStatus` | `enabled`, `disabled`, `trial`, `suspended` | `tenant_modules.status` |
| `TenantModuleSource` | `plan`, `addon`, `manual`, `trial`, `system` | `tenant_modules.source` |
| `LeadSource` | `instagram_dm`, `whatsapp_organico`, `indicacao`, `formulario_web`, `campanha_paga`, `telefone`, `outro` | `leads.source` |
| `LeadStatus` | `novo`, `em_contato`, `briefing_coletado`, `proposta_enviada`, `proposta_visualizada`, `negociacao`, `ganho`, `perdido`, `inativo` | `leads.status` |
| `LeadTipoViagem` | `lazer`, `corporativo`, `lua_de_mel`, `grupo`, `incentivo`, `aventura`, `cruzeiro` | `leads.tipo_viagem` |
| `LeadLostReason` | `preco`, `concorrente`, `desistiu`, `sem_resposta`, `fora_do_perfil`, `outro` | `leads.lost_reason` |
| `ClientTipo` | `pessoa_fisica`, `pessoa_juridica` | `clients.tipo` |
| `ClientStatus` | `ativo`, `inativo`, `vip`, `bloqueado`, `prospecto` | `clients.status` |
| `ClientNivel` | `standard`, `silver`, `gold`, `platinum` | `clients.nivel` |
| `ClientSegmento` | `lazer`, `corporativo`, `grupos`, `incentivo` | `clients.segmento` |
| `SupplierTipo` | `agencia_receptiva`, `hotel`, `operadora`, `transporte`, `seguradora`, `outro` | `suppliers.tipo` |
| `SupplierApiTipo` | `manual`, `hotelbeds`, `amadeus`, `outro` | `suppliers.api_tipo` |
| `SupplierStatus` | `ativo`, `inativo`, `suspenso` | `suppliers.status` |
| `ProductCategoria` | `hospedagem`, `aereo`, `transfer`, `passeio`, `ingresso`, `cruzeiro`, `seguro`, `servico`, `outro` | `products.categoria` |
| `ProductPrecoTipo` | `manual`, `api_tempo_real`, `api_cache` | `products.preco_tipo` |
| `ProductStatus` | `ativo`, `inativo`, `arquivado` | `products.status` |
| `PricingRuleEscopo` | `plataforma`, `tenant` | `pricing_rules.escopo` |
| `PricingRuleTipo` | `markup_percentual`, `markup_minimo_percentual`, `taxa_cartao_percentual`, `taxa_remessa_percentual`, `taxa_fixa_cents` | `pricing_rules.tipo_regra` |
| `PricingRuleCanal` | `direto`, `agente`, `api` | `pricing_rules.canal` |
| `ProposalStatus` | `rascunho`, `enviada`, `visualizada`, `aceita`, `recusada`, `expirada`, `cancelada` | `proposals.status` |
| `ProposalAceiteTipo` | `manual`, `link_publico` | `proposals.aceite_tipo` |
| `ProposalItemTipo` | `produto_catalogo`, `manual` | `proposal_items.tipo` |
| `ProposalDocumentTipo` | `voucher`, `bilhete`, `visto`, `seguro`, `contrato`, `recibo`, `outro` | `proposal_documents.tipo` |
| `ItineraryTipo` | `transporte`, `hospedagem`, `passeio`, `refeicao`, `livre`, `outro` | `proposal_itinerary_items.tipo` |
| `MessageSenderType` | `agent`, `client` | `proposal_messages.sender_type` |
| `EmergencyContactTipo` | `agencia`, `seguradora`, `consulado`, `hospital`, `outro` | `emergency_contacts.tipo` |
| `ProviderAccountOnboardingStatus` | `pending`, `in_review`, `approved`, `rejected` | `payment_provider_accounts.onboarding_status` |
| `ProviderAccountStatus` | `inactive`, `active`, `suspended` | `payment_provider_accounts.status` |
| `ChargeStatus` | `draft`, `pending`, `processing`, `confirmed`, `received`, `overdue`, `refunded`, `canceled`, `failed` | `payment_charges.status` |
| `ChargeBillingType` | `PIX`, `BOLETO`, `CREDIT_CARD` | `payment_charges.billing_type` |
| `ChargeRepasseModelo` | `plataforma`, `agencia` | `payment_charges.repasse_modelo` |
| `ChargeEscrowStatus` | `held`, `released`, `refunded` | `payment_charges.escrow_status` |

> **Todos os enums são TypeScript** (`.as const` + `.$type<>()`). O banco armazena `text` — não há tipo `ENUM` nativo no PostgreSQL para estas colunas. A validação é garantida pelo ORM e pelo repository, não pelo banco.

---

## 6. Legado — Tabelas a Descontinuar e Equivalentes Canônicos

### Schema `public` (prefixo `noro_*` e sem prefixo)

| Tabela legada | Status | Equivalente canônico | Diferenças críticas |
|---|---|---|---|
| `public.users` / `public.noro_users` | **Substituir** | `noro.users` | Duplicidade no legado; Drizzle unifica com integração Logto (`identity_links`) |
| `public.tenants` / `noro_empresa` | **Substituir** | `noro.tenants` | Drizzle unifica config de tenant e empresa; adiciona `portal_slug`, `portal_domain`, `portal_theme` |
| `public.leads` / `noro_leads` | **Substituir** | `noro.leads` | Legado tem 18 colunas sem equivalente (tags, metadata, proxima_acao, telefone_whatsapp, etc.) |
| `public.clientes` / `noro_clientes` | **Substituir** | `noro.clients` | Legado tem 14 colunas sem equivalente; enum `nivel` tem `bronze` inexistente no Drizzle (bloqueador de migração direta) |
| `public.produtos` | **Substituir** | `noro.products` | Drizzle remove `custo_base_cents` do catálogo (vai para snapshot do item) |
| `noro_fornecedores` | **Substituir** | `noro.suppliers` | Legado é por-tenant; Drizzle é catálogo global (divergência arquitetural) |
| `noro_orcamentos` | **Substituir** | `noro.proposals` | Legado tem `roteiro` JSONB com itinerário embutido; Drizzle extrai para `proposal_itinerary_items` (ETL obrigatório) |
| `noro_orcamentos_itens` | **Substituir** | `noro.proposal_items` | Legado tem 13 colunas sem equivalente (localizador, quantidade, unidade, detalhes, incluido, opcional) |
| `noro_payment_configs` | **Substituir** | `noro.payment_provider_accounts` + `noro.payment_customers` | Legado mistura config de provider e customer; Drizzle separa em 3 tabelas |
| `noro_transacoes` | **Substituir** | `noro.payment_charges` | Legado é genérico; Drizzle tem campos específicos Asaas (`pix_qr_code`, `pix_copy_paste`, `bank_slip_url`, `checkout_url`) |
| `noro_markup_rules` | **Substituir** | `noro.pricing_rules` | Legado cobre só markup; Drizzle tem `canal`, `plan_id`, regras compostas e escopo plataforma/tenant |
| `noro_clientes_documentos` | **Substituir** | `noro.proposal_documents` | Legado é por-cliente; Drizzle é por-proposta com enum `tipo` e `visible_to_client` |
| `noro_configuracoes` | **Avaliar** | Distribuído em `noro.tenants.portal_theme` + campos de tenant | Sem equivalente direto — verificar o que está em `noro_configuracoes` antes de descartar |
| `noro_exchange_rates` | **Avaliar** | Sem equivalente direto | Drizzle tem só snapshot por proposta/item; histórico de câmbio pode ser necessário para relatórios |
| `public.sites` | **Fora do escopo** | `apps/sites` (schema próprio) | Gerido por outra app — não entra no schema `noro` atual |

### Schema `cp`

| Tabela legada | Status | Equivalente canônico | Observação |
|---|---|---|---|
| `cp.plans` | **Substituir** | `noro.plans` | Legado foca em billing; Drizzle foca em feature flags + limits |
| `cp.tenants` | **Substituir** | `noro.tenants` | Duplicata do schema cp |
| `cp.subscriptions` | **Sem equivalente** | — | Assinaturas SaaS NORO — escopo da Sprint 6+ |
| `cp.leads` | **Substituir** | `noro.leads` | Duplicata do schema cp |
| `cp.contacts` | **Sem equivalente** | — | Sem mapeamento direto no Drizzle atual |

### Tabelas exclusivamente novas no Drizzle (sem equivalente no legado)

Estas tabelas não existem na produção e precisarão ser criadas do zero via migration:

| Tabela nova | Sprint de criação |
|---|---|
| `noro.identity_links` | Sprint 1 (0000) |
| `noro.tenant_memberships` | Sprint 1 (0000) |
| `noro.platform_role_assignments` | Sprint 1 (0000) |
| `noro.audit_events` | Sprint 1 (0000) |
| `noro.modules` | Sprint 1 (0000) |
| `noro.plan_modules` | Sprint 1 (0000) |
| `noro.tenant_modules` | Sprint 1 (0000) |
| `noro.client_portal_sessions` | Sprint portal (0005) |
| `noro.payment_webhook_events` | Sprint portal (0004) |
| `noro.proposal_itinerary_items` | Sprint 1B portal (0008) |
| `noro.proposal_messages` | Sprint 1B portal (0008) |
| `noro.emergency_contacts` | Sprint 1B portal (0008) |

---

## 7. Bloqueadores de Migração Direta (legado → noro)

Identificados em `docs/architecture/db-column-comparison.md`:

| Bloqueador | Tabelas envolvidas | Impacto |
|---|---|---|
| **Enum incompatível** | `noro_clientes.nivel = 'bronze'` não existe no Drizzle (`standard`, `silver`, `gold`, `platinum`) | ETL obrigatório antes de inserir dados |
| **Divergência arquitetural** | `noro_fornecedores` é por-tenant; `noro.suppliers` é global | Dados de tenant não mapeiam diretamente |
| **ETL de JSONB** | `noro_orcamentos.roteiro` (JSONB) → `noro.proposal_itinerary_items` (tabela) | ETL linha-a-linha obrigatório |
| **Tipo financeiro** | Legado usa `numeric/EUR`; Drizzle usa `bigint` em centavos/BRL | Conversão monetária obrigatória |
| **Timestamps** | Legado usa `timestamp` (sem timezone); Drizzle usa `timestamptz` | Risco de ambiguidade em dados históricos |

> Nenhuma migration deve ser aplicada no banco de produção sem estratégia de reconciliação
> aprovada explicitamente. Ver `docs/architecture/db-migration-mapping.md`.
