# Sprint 1D - Plano Drizzle Da Fundacao Canonica NORO

Data de referencia: 2026-05-27

Status: desenho tecnico/documental. Nenhum arquivo de codigo, schema real ou migration foi criado a partir deste plano.

Fontes obrigatorias:

- `docs/backlog/implementation/sprint-1a-database-readonly-audit.md`
- `docs/backlog/implementation/sprint-1b-local-schema-reference-audit.md`
- `docs/backlog/implementation/sprint-1c-canonical-auth-tenant-schema-map.md`
- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/backlog/implementation/sprint-0-alinhamento-documental-decisoes.md`
- `docs/SPRINT_STATUS.md`

## 1. Resumo executivo

Este documento transforma o mapa canonico da Sprint 1C em um plano tecnico para arquivos Drizzle, tabelas, campos, constraints, indices, relacoes, valores controlados, repositories e helpers da fundacao NORO.

Nenhuma migration deve ser rodada agora. Este plano nao autoriza `drizzle push`, migrations Drizzle, migrations Supabase ou qualquer alteracao no banco atual.

Decisoes aprovadas por Paulo para este plano:

- Schema PostgreSQL canonico novo recomendado: `noro`.
- `noro.tenants` sera o destino canonico futuro, nao `cp.tenants` nem `public.tenants`.
- `cp.tenants` e `public.tenants` sao fontes de migracao/referencia, nao fonte final.
- `identity_links` sera a ponte entre `users` e provedores de autenticacao.
- Roles globais da plataforma ficam em tabela de atribuicao, como `platform_role_assignments`.
- Roles de tenant ficam inicialmente em `tenant_memberships.role`.
- Usuarios internos da NORO podem ter role global de plataforma sem membership em tenant.
- Status iniciais recomendados: `active`, `invited`, `blocked`, `archived`.
- Banco dev/staging isolado e obrigatorio antes da primeira migration.
- O isolamento novo sera inicialmente por autorizacao na aplicacao/repository layer, com tenant context explicito, e nao por RLS Supabase/auth.uid().
- Todo servico sera administrado pelo tenant dentro de `app.noro.guru` (`/core`), desde que habilitado.
- O `/control` habilita/desabilita modulos, planos, limites e servicos para cada tenant.
- O `/sites` e camada publica; a administracao dos sites acontece dentro do `/core`.

O plano inclui a fundacao de auth/tenant e a base modular por habilitacao, para sustentar `/control`, `/core`, `/sites`, billing SaaS da NORO, checkout proprio com Asaas por tras e arquitetura split-ready.

## 2. Escopo da fundacao Drizzle

### Entra neste plano

- `users`;
- `identity_links`;
- `tenants`;
- `tenant_memberships`;
- `platform_role_assignments`;
- `modules`;
- `plans`;
- `plan_modules`;
- `tenant_modules`;
- audit/event metadata minima;
- helpers planejados;
- repositories planejados.

### Nao entra ainda

- CRM completo;
- propostas;
- produtos;
- fornecedores;
- checkout Asaas;
- ledger completo;
- sites runtime completo;
- grupos;
- marketplace;
- APIs de fornecedores;
- migrations aplicadas;
- `drizzle.config` final aplicado;
- remocao de Supabase runtime transicional.

## 3. Organizacao proposta em `packages/db`

Estrutura recomendada:

```txt
packages/db/
  schema/
    users.ts
    identity-links.ts
    tenants.ts
    memberships.ts
    roles.ts
    modules.ts
    plans.ts
    tenant-modules.ts
    audit.ts
    index.ts
  repositories/
    usersRepository.ts
    authIdentityRepository.ts
    tenantsRepository.ts
    membershipsRepository.ts
    platformRolesRepository.ts
    modulesRepository.ts
    plansRepository.ts
    tenantModulesRepository.ts
  index.ts
```

Observacoes:

- `schema/index.ts` deve reexportar todas as tabelas e relations.
- Repositories devem ser a fronteira padrao para apps, evitando SQL espalhado.
- Helpers de auth/tenant podem ficar em `packages/auth` ou pacote equivalente, mas devem depender de repositories e nao de Supabase.
- O schema Drizzle deve apontar para schema PostgreSQL `noro`.

## 4. Tabelas canonicas propostas

### `noro.users`

Finalidade: perfil interno do usuario NORO, independente do provider de autenticacao.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK; gerar pela aplicacao ou banco, conforme padrao aprovado. |
| `display_name` | `text` | nao | Nome exibido. |
| `email` | `text` | sim | Email operacional; normalizar lowercase para busca. |
| `phone` | `text` | nao | Telefone opcional. |
| `avatar_url` | `text` | nao | URL de avatar, sem acoplar storage provider. |
| `status` | `text` ou enum Drizzle | sim | Valores iniciais: `active`, `invited`, `blocked`, `archived`. |
| `metadata` | `jsonb` | nao | Metadados nao criticos. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- `email` preferencialmente unico depois de validar duplicidades legadas;
- `status` limitado aos valores aprovados.

Indices:

- `users_email_idx`;
- `users_status_idx`.

Relacoes:

- 1:N com `identity_links`;
- 1:N com `tenant_memberships`;
- 1:N com `platform_role_assignments`.

Observacoes:

- Nao substituir `auth.users` diretamente.
- Nao criar FK para `auth.users`.
- `email` ajuda reconciliacao, mas auth externa deve vir por `identity_links`.

Riscos:

- Duplicidade de email no legado pode impedir unique imediato.
- Misturar perfil interno com claims Logto pode gerar acoplamento indevido.

### `noro.identity_links`

Finalidade: ponte entre usuario interno e provedores de autenticacao.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `user_id` | `uuid` | sim | FK para `noro.users.id`. |
| `provider` | `text` | sim | Inicial: `logto`; legado possivel: `supabase`. |
| `provider_subject` | `text` | sim | Subject/ID do provider. |
| `provider_email` | `text` | nao | Email recebido do provider. |
| `legacy_supabase_user_id` | `uuid` | nao | Ponte temporaria com Supabase Auth. |
| `metadata` | `jsonb` | nao | Claims/metadados nao sensiveis. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- FK `user_id` -> `noro.users.id`;
- unique em `(provider, provider_subject)`;
- provider limitado a valores controlados.

Indices:

- `identity_links_user_id_idx`;
- `identity_links_provider_subject_uidx`;
- `identity_links_legacy_supabase_user_id_idx`.

Relacoes:

- N:1 com `noro.users`.

Observacoes:

- Logto deve ser o provider novo oficial.
- Supabase so pode aparecer como legado/transicional.
- Dados sensiveis de token/sessao nao devem ser persistidos aqui.

Riscos:

- Usar `legacy_supabase_user_id` como identidade principal perpetua Supabase.
- Copiar claims demais para `metadata` pode criar dado sensivel desnecessario.

### `noro.tenants`

Finalidade: agencias, empresas ou organizacoes clientes da NORO.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK canonica futura. |
| `name` | `text` | sim | Nome de exibicao. |
| `slug` | `text` | sim | Identificador publico/controlado. |
| `legal_name` | `text` | nao | Razao social. |
| `document` | `text` | nao | Documento fiscal, sem formatacao obrigatoria inicial. |
| `email` | `text` | nao | Email principal. |
| `phone` | `text` | nao | Telefone principal. |
| `status` | `text` ou enum Drizzle | sim | `active`, `invited`, `blocked`, `archived`. |
| `plan_id` | `uuid` | nao | FK opcional para `noro.plans.id`. |
| `billing_status` | `text` | sim | Status financeiro SaaS da NORO. |
| `metadata` | `jsonb` | nao | Metadados de onboarding/config. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- unique em `slug`;
- FK opcional `plan_id` -> `noro.plans.id`;
- `status` e `billing_status` limitados a valores controlados.

Indices:

- `tenants_slug_uidx`;
- `tenants_status_idx`;
- `tenants_plan_id_idx`;
- `tenants_billing_status_idx`.

Relacoes:

- 1:N com `tenant_memberships`;
- 1:N com `tenant_modules`;
- N:1 opcional com `plans`.

Observacoes:

- `noro.tenants` e o destino canonico futuro.
- `cp.tenants` e `public.tenants` sao fontes de migracao/referencia.

Riscos:

- Colisao de slugs vindos de `cp` e `public`.
- Planos e billing status podem ficar inconsistentes se billing SaaS for adiado demais.

### `noro.tenant_memberships`

Finalidade: vinculo entre usuario e tenant, com role e status.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `tenant_id` | `uuid` | sim | FK para `noro.tenants.id`. |
| `user_id` | `uuid` | sim | FK para `noro.users.id`. |
| `role` | `text` | sim | Role de tenant. |
| `status` | `text` | sim | `active`, `invited`, `blocked`, `archived`. |
| `invited_by_user_id` | `uuid` | nao | FK para `noro.users.id`. |
| `joined_at` | `timestamp with time zone` | nao | Quando aceitou/entrou. |
| `metadata` | `jsonb` | nao | Metadados de convite/permissao. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- FK `tenant_id` -> `noro.tenants.id`;
- FK `user_id` -> `noro.users.id`;
- FK opcional `invited_by_user_id` -> `noro.users.id`;
- unique parcial recomendado para membership ativa por `(tenant_id, user_id)`;
- `role` limitado a roles de tenant.

Indices:

- `tenant_memberships_tenant_id_idx`;
- `tenant_memberships_user_id_idx`;
- `tenant_memberships_tenant_user_active_uidx`;
- `tenant_memberships_role_idx`.

Relacoes:

- N:1 com `tenants`;
- N:1 com `users`.

Observacoes:

- Role de tenant fica aqui inicialmente.
- Usuario interno NORO pode ter role global sem membership em tenant.

Riscos:

- Se unique parcial nao for suportado de forma simples no Drizzle inicial, documentar politica equivalente.
- Reativar memberships arquivadas precisa regra clara.

### `noro.platform_role_assignments`

Finalidade: roles globais da equipe NORO para `/control`.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `user_id` | `uuid` | sim | FK para `noro.users.id`. |
| `role` | `text` | sim | Role global da plataforma. |
| `status` | `text` | sim | `active`, `invited`, `blocked`, `archived`. |
| `granted_by_user_id` | `uuid` | nao | Quem concedeu a role. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- FK `user_id` -> `noro.users.id`;
- FK opcional `granted_by_user_id` -> `noro.users.id`;
- unique parcial recomendado em `(user_id, role)` para role ativa;
- `role` limitado a roles globais.

Indices:

- `platform_role_assignments_user_id_idx`;
- `platform_role_assignments_role_idx`;
- `platform_role_assignments_user_role_active_uidx`.

Relacoes:

- N:1 com `users`.

Observacoes:

- Sustenta `/control` sem exigir membership de tenant.
- Operacao em tenant pelo `/control` deve ser auditavel.

Riscos:

- Conceder `platform_owner` sem processo humano forte.
- Misturar role global com role de tenant em telas do `/core`.

### `noro.modules`

Finalidade: catalogo de modulos possiveis da plataforma.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `key` | `text` | sim | Chave estavel do modulo. |
| `name` | `text` | sim | Nome legivel. |
| `description` | `text` | nao | Descricao interna/comercial. |
| `status` | `text` | sim | Status operacional do modulo. |
| `default_limits` | `jsonb` | nao | Limites padrao. |
| `default_settings` | `jsonb` | nao | Configuracoes padrao. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Exemplos de modulos iniciais:

- `crm`;
- `sites`;
- `finance`;
- `proposals`;
- `checkout`;
- `billing`;
- `suppliers`;
- `groups`;
- `ai`;
- `academy`.

Constraints:

- PK em `id`;
- unique em `key`;
- `status` limitado a valores controlados.

Indices:

- `modules_key_uidx`;
- `modules_status_idx`.

Relacoes:

- 1:N com `plan_modules`;
- 1:N com `tenant_modules`.

Observacoes:

- Esta tabela habilita a arquitetura modular desde a fundacao.
- Modulo existir no catalogo nao significa estar implementado.

Riscos:

- Confundir modulo habilitado com feature pronta no codigo.
- Usar `settings` para logica critica sem tipagem futura.

### `noro.plans`

Finalidade: planos comerciais da NORO.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `key` | `text` | sim | Chave comercial estavel. |
| `name` | `text` | sim | Nome do plano. |
| `description` | `text` | nao | Descricao. |
| `status` | `text` | sim | Status do plano. |
| `billing_interval` | `text` | nao | Mensal/anual/outro, se aplicavel. |
| `price_cents` | `integer` | nao | Valor base em centavos, se aplicavel. |
| `currency` | `text` | nao | Ex.: `BRL`. |
| `limits` | `jsonb` | nao | Limites comerciais do plano. |
| `settings` | `jsonb` | nao | Configuracoes comerciais/operacionais. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Exemplos iniciais:

- `free_site`;
- `starter`;
- `professional`;
- `agency`;
- `enterprise`.

Constraints:

- PK em `id`;
- unique em `key`;
- `status` limitado a valores controlados.

Indices:

- `plans_key_uidx`;
- `plans_status_idx`.

Relacoes:

- 1:N com `plan_modules`;
- 1:N com `tenants`.

Observacoes:

- Billing SaaS da NORO entra no escopo fundacional.
- Planos complexos e upgrade/downgrade automatico podem vir depois.

Riscos:

- Modelar preco antes de decidir billing SaaS completo pode gerar retrabalho.
- `price_cents` simples pode nao cobrir enterprise/custom; manter opcional.

### `noro.plan_modules`

Finalidade: define quais modulos entram por padrao em cada plano.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `plan_id` | `uuid` | sim | FK para `noro.plans.id`. |
| `module_id` | `uuid` | sim | FK para `noro.modules.id`. |
| `status` | `text` | sim | Ex.: `enabled`, `disabled`. |
| `limits` | `jsonb` | nao | Overrides de limites do plano para o modulo. |
| `settings` | `jsonb` | nao | Configuracoes do plano para o modulo. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- FK `plan_id` -> `noro.plans.id`;
- FK `module_id` -> `noro.modules.id`;
- unique em `(plan_id, module_id)`.

Indices:

- `plan_modules_plan_id_idx`;
- `plan_modules_module_id_idx`;
- `plan_modules_plan_module_uidx`.

Relacoes:

- N:1 com `plans`;
- N:1 com `modules`.

Observacoes:

- Representa padrao do plano, nao override real do tenant.
- Tenant pode divergir por addon, trial ou ajuste manual em `tenant_modules`.

Riscos:

- Se o app ler apenas `plan_modules`, pode ignorar habilitacoes reais por tenant.

### `noro.tenant_modules`

Finalidade: habilitacoes reais de modulos para cada tenant.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `tenant_id` | `uuid` | sim | FK para `noro.tenants.id`. |
| `module_id` | `uuid` | sim | FK para `noro.modules.id`. |
| `status` | `text` | sim | `enabled`, `disabled`, `trial`, `suspended`. |
| `source` | `text` | sim | `plan`, `addon`, `manual`, `trial`, `system`. |
| `starts_at` | `timestamp with time zone` | nao | Inicio da habilitacao. |
| `ends_at` | `timestamp with time zone` | nao | Fim/trial/suspensao programada. |
| `limits` | `jsonb` | nao | Limites especificos do tenant. |
| `settings` | `jsonb` | nao | Configuracoes especificas do tenant. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |
| `updated_at` | `timestamp with time zone` | sim | Atualizado pela aplicacao. |

Constraints:

- PK em `id`;
- FK `tenant_id` -> `noro.tenants.id`;
- FK `module_id` -> `noro.modules.id`;
- unique em `(tenant_id, module_id)` ou politica equivalente;
- `status` e `source` limitados a valores controlados.

Indices:

- `tenant_modules_tenant_id_idx`;
- `tenant_modules_module_id_idx`;
- `tenant_modules_tenant_module_uidx`;
- `tenant_modules_status_idx`;

Relacoes:

- N:1 com `tenants`;
- N:1 com `modules`.

Observacoes:

- Esta tabela e a fonte operacional para `requireModuleEnabled()`.
- `tenant_modules` deve prevalecer sobre `plan_modules` quando houver override aprovado.
- `limits` e `settings` permitem arquitetura split-ready e modular sem criar tabela por modulo agora.

Riscos:

- JSONB sem validacao pode acumular configuracoes divergentes.
- Habilitar modulo ainda nao implementado deve ser bloqueado no app ou marcado como futuro.

### `noro.audit_events` ou metadata minima de auditoria

Finalidade: registrar eventos administrativos minimos da fundacao.

Campos sugeridos:

| Campo | Tipo sugerido | Obrigatorio | Observacoes |
| --- | --- | --- | --- |
| `id` | `uuid` | sim | PK. |
| `actor_user_id` | `uuid` | nao | Usuario que executou. |
| `tenant_id` | `uuid` | nao | Tenant afetado, quando houver. |
| `event_type` | `text` | sim | Tipo do evento. |
| `target_type` | `text` | nao | Ex.: `tenant`, `module`, `plan`, `membership`. |
| `target_id` | `uuid` | nao | ID alvo, quando aplicavel. |
| `metadata` | `jsonb` | nao | Payload auditavel. |
| `created_at` | `timestamp with time zone` | sim | Default `now()`. |

Constraints:

- PK em `id`;
- FK opcional `actor_user_id` -> `noro.users.id`;
- FK opcional `tenant_id` -> `noro.tenants.id`.

Indices:

- `audit_events_actor_user_id_idx`;
- `audit_events_tenant_id_idx`;
- `audit_events_event_type_idx`;
- `audit_events_created_at_idx`.

Observacoes:

- Nao e ledger financeiro.
- Serve para eventos de fundacao: concessao de role, habilitacao de modulo, troca de plano, suporte/admin.

Riscos:

- Sem auditoria minima, `/control` pode operar tenants sem rastreabilidade.

## 5. Enums/valores controlados

Recomendacao inicial: representar como valores controlados no schema Drizzle. A decisao final entre enum PostgreSQL, `text` com checks, ou tabela de referencia deve ser tomada antes da migration.

| Categoria | Valores sugeridos |
| --- | --- |
| User status | `active`, `invited`, `blocked`, `archived` |
| Tenant status | `active`, `invited`, `blocked`, `archived` |
| Tenant billing status | `trialing`, `current`, `past_due`, `suspended`, `cancelled`, `exempt` |
| Membership status | `active`, `invited`, `blocked`, `archived` |
| Tenant roles | `tenant_owner`, `tenant_admin`, `tenant_manager`, `tenant_agent`, `tenant_finance`, `tenant_viewer` |
| Platform roles | `platform_owner`, `platform_admin`, `platform_ops`, `platform_finance`, `platform_support` |
| Module status | `active`, `inactive`, `deprecated`, `future` |
| Tenant module status | `enabled`, `disabled`, `trial`, `suspended` |
| Tenant module source | `plan`, `addon`, `manual`, `trial`, `system` |
| Plan status | `active`, `draft`, `archived`, `deprecated` |

## 6. Regras de autorizacao e tenant context

Helpers futuros:

- `requireUser()`;
- `resolveTenantContext()`;
- `requireTenantMembership()`;
- `authorize()`;
- `requireModuleEnabled()`.

Regras por app:

- `/core` exige tenant ativo por sessao + membership.
- `/control` exige role global de plataforma.
- `/control` pode selecionar tenant explicitamente para suporte/administracao, com auditoria.
- `/sites` resolve tenant por dominio/subdominio/slug futuramente, sem depender de sessao.
- Todo acesso a modulo no `/core` deve validar se o modulo esta habilitado para aquele tenant.

Fluxo recomendado para `/core`:

```txt
requireUser()
  -> resolveTenantContext()
  -> requireTenantMembership()
  -> requireModuleEnabled()
  -> authorize()
  -> repository escopado por tenant_id
```

Fluxo recomendado para `/control`:

```txt
requireUser()
  -> requirePlatformRole()
  -> selecionar tenant quando necessario
  -> registrar audit_event em operacoes sensiveis
  -> repository de plataforma ou repository escopado
```

## 7. Modelo de habilitacao modular

Regra de produto/arquitetura:

- O `/control` administra tenants, planos, modulos, limites, billing e permissoes globais.
- O `/core` e o painel unico onde cada tenant administra todos os servicos habilitados para ele.
- O `/sites` e apenas a camada publica de publicacao/visualizacao dos sites e vitrines.
- A administracao de sites, CRM, financeiro, propostas, checkout e futuros modulos pertence ao `/core`.
- Os servicos de cada tenant serao habilitados dentro do `/control`.
- A arquitetura deve prever modulos habilitaveis desde a fundacao, mesmo que nem todos sejam implementados no MVP.

Como funciona:

- `plans` define planos comerciais.
- `modules` define o catalogo de modulos possiveis.
- `plan_modules` define modulos padrao de cada plano.
- `tenant_modules` define habilitacoes reais e overrides por tenant.
- Add-ons podem habilitar modulos extras por `tenant_modules.source = 'addon'`.
- Trials podem ser representados por `status = 'trial'`, `source = 'trial'`, `starts_at` e `ends_at`.
- Suspensoes por inadimplencia ou suporte podem usar `status = 'suspended'`.
- Limites e configuracoes especificas podem ficar em `jsonb limits` e `jsonb settings`.

Exemplo A - tenant so com site gratis:

```txt
plano: free_site
sites: enabled
crm: disabled
finance: disabled
checkout: disabled
```

Exemplo B - tenant com CRM sem financeiro:

```txt
plano: starter
crm: enabled
finance: disabled
checkout: disabled ou trial
```

Exemplo C - tenant agency completo:

```txt
plano: agency
crm: enabled
sites: enabled
finance: enabled
proposals: enabled
checkout: enabled
suppliers: enabled
```

## 8. Estrategia de convivencia com legado

- `cp.tenants`, `public.tenants`, `public.user_tenants` e `cp.user_tenant_roles` ficam como fontes de migracao/referencia.
- Esses objetos nao serao usados diretamente por codigo novo.
- Migracao futura deve preencher `noro.tenants`, `noro.users`, `noro.identity_links` e `noro.tenant_memberships`.
- Supabase Auth nao deve receber FKs novas.
- RLS/policies Supabase nao devem ser copiadas.
- SQLs em `supabase/migrations/` permanecem historico congelado.
- `auth.users` pode ser lido apenas como origem de reconciliacao legado, nunca como tabela canonica nova.
- `packages/lib/supabase/*` e `apps/control/lib/supabase*` devem ser migrados gradualmente, nao expandidos.

## 9. Indices e constraints criticos

Minimos obrigatorios:

- `identity_links(provider, provider_subject)` unique.
- `tenants(slug)` unique.
- `tenant_memberships(tenant_id, user_id)` unique para vinculo ativo ou politica equivalente.
- `platform_role_assignments(user_id, role)` unique para role ativa ou politica equivalente.
- `modules(key)` unique.
- `plans(key)` unique.
- `plan_modules(plan_id, module_id)` unique.
- `tenant_modules(tenant_id, module_id)` unique ou politica equivalente.

Indices recomendados adicionais:

- `users(email)`;
- `users(status)`;
- `tenants(status)`;
- `tenants(billing_status)`;
- `tenant_memberships(user_id)`;
- `tenant_memberships(tenant_id)`;
- `platform_role_assignments(role)`;
- `tenant_modules(status)`;
- `audit_events(actor_user_id)`;
- `audit_events(tenant_id)`;
- `audit_events(created_at)`.

Observacao: unique parcial para registros ativos deve ser planejado com cuidado no Drizzle. Se a primeira versao nao usar unique parcial, documentar uma politica equivalente e validar no repository.

## 10. Repositories planejados

### `usersRepository`

Responsabilidades:

- criar perfil interno;
- buscar usuario por `id`;
- buscar usuario por email;
- atualizar status/metadados;
- listar usuarios por filtros administrativos.

### `authIdentityRepository`

Responsabilidades:

- resolver usuario interno por `provider` + `provider_subject`;
- criar `identity_link` para Logto;
- manter ponte `legacy_supabase_user_id`;
- reconciliar por email durante migracao controlada;
- impedir uso de Supabase como provider novo padrao.

### `tenantsRepository`

Responsabilidades:

- criar tenant canonico em `noro.tenants`;
- buscar tenant por `id` ou `slug`;
- atualizar status e billing status;
- associar plano;
- listar tenants para `/control`.

### `membershipsRepository`

Responsabilidades:

- criar membership;
- listar memberships por usuario;
- listar usuarios por tenant;
- validar membership ativa;
- atualizar role/status;
- impedir acesso sem tenant context.

### `platformRolesRepository`

Responsabilidades:

- atribuir role global;
- revogar/arquivar role global;
- validar role para `/control`;
- listar usuarios de plataforma;
- suportar auditoria de concessao.

### `modulesRepository`

Responsabilidades:

- listar modulos disponiveis;
- buscar modulo por `key`;
- validar se modulo existe e esta ativo;
- manter catalogo de modulos.

### `plansRepository`

Responsabilidades:

- listar planos;
- buscar plano por `key`;
- listar modulos padrao de plano;
- atualizar status/limites/configuracoes de plano.

### `tenantModulesRepository`

Responsabilidades:

- listar modulos habilitados do tenant;
- validar `requireModuleEnabled()`;
- criar override por addon/manual/trial/system;
- suspender/desabilitar modulo;
- resolver limites e settings efetivos combinando plano + override.

## 11. Helpers planejados em `packages/auth` ou pacote equivalente

### `requireUser()`

Valida sessao Logto, resolve `identity_links` e retorna usuario interno ativo.

### `getCurrentUser()`

Retorna usuario interno quando houver sessao valida; pode retornar `null` para rotas publicas.

### `resolveTenantContext()`

Resolve tenant ativo por:

- membership e sessao no `/core`;
- selecao explicita e role de plataforma no `/control`;
- dominio/subdominio/slug no `/sites` futuramente.

### `requirePlatformRole()`

Exige role global para acessar `/control` ou operacoes administrativas.

### `requireTenantMembership()`

Exige membership ativa em tenant, com role minima quando aplicavel.

### `requireModuleEnabled()`

Valida se o modulo esta habilitado para o tenant considerando `tenant_modules`, `plan_modules`, status, datas, limites e overrides.

### `authorize()`

Valida permissao operacional por contexto:

- usuario;
- role global;
- tenant;
- membership;
- modulo;
- acao.

## 12. Pre-requisitos antes de implementar arquivos Drizzle

- Aprovacao deste plano.
- Definicao final do schema `noro`.
- Confirmacao de banco dev/staging isolado.
- Backup/dump do banco atual.
- `drizzle.config` planejado.
- Decisao sobre migrations geradas vs aplicadas.
- Confirmacao de que Supabase migrations nao serao executadas.
- Plano de rollback.
- Validacao de duplicidades entre `cp.tenants` e `public.tenants`.
- Decisao final sobre JSONB em `limits` e `settings`.

## 13. Decisoes pendentes para Paulo

- [ ] Confirmar `noro` como schema final.
- [ ] Confirmar modulos iniciais: `crm`, `sites`, `finance`, `proposals`, `checkout`, `billing`, `suppliers`, `groups`, `ai`, `academy`.
- [ ] Confirmar planos iniciais: `free_site`, `starter`, `professional`, `agency`, `enterprise`.
- [ ] Confirmar uso de JSONB para `limits` e `settings`.
- [ ] Confirmar roles iniciais de tenant e plataforma.
- [ ] Confirmar banco dev/staging antes de migration.
- [ ] Confirmar se `tenant_modules` override sempre prevalece sobre `plan_modules`.
- [ ] Confirmar se `price_cents`/`currency` entram ja em `plans` ou ficam apenas em billing posterior.
- [ ] Confirmar estrategia para unique parcial de memberships/roles ativas.

## 14. Proximo passo recomendado

Proximo documento:

```txt
docs/backlog/implementation/sprint-1e-drizzle-implementation-plan.md
```

Objetivo do Sprint 1E:

- transformar este plano em tarefas de implementacao de arquivos Drizzle;
- definir ordem de criacao dos arquivos;
- detalhar `drizzle.config` planejado;
- definir como gerar migration sem aplicar em banco real;
- manter migrations bloqueadas ate aprovacao explicita, backup/dump e banco dev/staging isolado.

Estado final desta etapa: plano Drizzle documentado, sem alteracao de codigo, sem alteracao de schema real e sem migration.
