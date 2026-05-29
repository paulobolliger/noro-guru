# Sprint 1E - Plano De Implementacao Dos Arquivos Drizzle Da Fundacao NORO

Data de referencia: 2026-05-27

Status: plano tecnico/documental. Nenhum arquivo `.ts`, schema real, migration ou alteracao de banco foi criado nesta etapa.

Fontes:

- `docs/backlog/implementation/sprint-1a-database-readonly-audit.md`
- `docs/backlog/implementation/sprint-1b-local-schema-reference-audit.md`
- `docs/backlog/implementation/sprint-1c-canonical-auth-tenant-schema-map.md`
- `docs/backlog/implementation/sprint-1d-drizzle-schema-plan.md`
- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `scripts/README.md`

## 1. Resumo executivo

Este documento prepara a implementacao dos arquivos Drizzle da fundacao canonica NORO. Ele detalha quais arquivos deverao ser criados em `packages/db/schema`, quais repositories devem existir, como `drizzle.config` deve ser planejado, qual deve ser a ordem de implementacao e como gerar uma migration futura sem aplicar no banco real.

Esta etapa ainda nao cria codigo, nao cria arquivos `.ts`, nao altera schema real, nao roda migrations e nao altera banco.

O objetivo e deixar a Sprint 1F pronta para criar arquivos Drizzle de forma controlada, usando o schema PostgreSQL canonico `noro`, sem reaproveitar `auth.users`, `public.tenants`, `cp.tenants`, RLS Supabase ou SQLs antigos como fonte executavel.

## 2. Decisoes aprovadas

Decisoes de fundacao:

- Schema final: `noro`.
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
- JSONB esta aprovado para `limits` e `settings`.
- `tenant_modules` prevalece sobre `plan_modules`.
- `price_cents` e `currency` entram em `plans`, mas podem ser opcionais para planos custom/enterprise.
- `modules.key` e a chave funcional estavel e deve ser usada nas validacoes.
- Nome visual do modulo nao deve ser usado como regra de permissao.
- `tenant_modules` deve ser a fonte operacional para `requireModuleEnabled()`.
- Checkout proprio white-label/embedded e a experiencia alvo.
- Asaas e o gateway financeiro vigente por tras do checkout.
- Migrations continuam bloqueadas ate aprovacao explicita, backup/dump e banco dev/staging isolado.

Modulos iniciais aprovados:

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

Modulos futuros previstos:

- `catalog`;
- `reservations`;
- `booking_engine`;
- `customer_portal`;
- `reports`;
- `marketing`;
- `email_marketing`;
- `social`;
- `campaigns`;
- `content`;
- `communications`;
- `whatsapp`;
- `automation`.

Regras para modulos futuros:

- modulo existir no catalogo nao significa que esta disponivel para uso;
- modulo com status `future` serve apenas para planejamento e arquitetura;
- o acesso real do tenant depende de `tenant_modules`;
- o `/core` so deve exibir modulos habilitados e disponiveis;
- o `/control` deve ser capaz de habilitar/desabilitar modulos por tenant quando o modulo estiver disponivel;
- novos modulos devem ser adicionados sem refatorar `tenants`, `memberships`, `plans` e `tenant_modules`.

Reservas online e booking futuro:

- A NORO deve prever uma futura area de reservas online para tenants.
- A agencia/tenant podera montar produtos e ofertas dentro do `/core`.
- A agencia/tenant podera comprar/reservar produtos dentro do proprio painel do tenant.
- Produtos/ofertas poderao ser publicados no site/vitrine do tenant.
- Clientes finais poderao solicitar orcamento ou comprar pelo site.
- A arquitetura deve conectar catalogo, proposta, checkout, fornecedores e reserva operacional.

Separacao conceitual futura:

- `catalog`: produtos/ofertas disponiveis para venda;
- `proposals`: montagem e envio de propostas/orcamentos;
- `checkout`: pagamento;
- `reservations`: controle da reserva/booking operacional;
- `suppliers`: fornecedores e futuras integracoes/API;
- `sites`: publicacao/vitrine publica do tenant;
- `customer_portal`: area futura do cliente final para acompanhar documentos, pagamentos, vouchers e status.

Nao implementar agora:

- disponibilidade em tempo real;
- reservas automaticas por API;
- emissao automatica;
- GDS/aereo;
- hotel API;
- seguro API;
- tours API;
- voucher automatico;
- cancelamento automatico.

## 3. Arquivos Drizzle planejados

### `packages/db/schema/users.ts`

Tabelas exportadas:

- `users`.

Enums/valores:

- `userStatusValues`: `active`, `invited`, `blocked`, `archived`.

Relacoes:

- `users` -> `identityLinks`;
- `users` -> `tenantMemberships`;
- `users` -> `platformRoleAssignments`;
- `users` -> `auditEvents` como ator.

Dependencias:

- Drizzle core para `pgSchema`, `uuid`, `text`, `timestamp`, `jsonb`, indices e constraints.
- Valores controlados compartilhados, se forem extraidos para `roles.ts` ou arquivo comum.

Observacoes:

- Nao deve importar Supabase.
- Nao deve criar FK para `auth.users`.
- Deve usar schema `noro`.

### `packages/db/schema/identity-links.ts`

Tabelas exportadas:

- `identityLinks`.

Enums/valores:

- `identityProviderValues`: `logto`, `supabase`.

Relacoes:

- `identityLinks.userId` -> `users.id`.

Dependencias:

- `users`.

Observacoes:

- `logto` e o provider novo oficial.
- `supabase` existe apenas como provider legado de reconciliacao.
- Unique obrigatorio em `(provider, provider_subject)`.

### `packages/db/schema/tenants.ts`

Tabelas exportadas:

- `tenants`.

Enums/valores:

- `tenantStatusValues`: `active`, `invited`, `blocked`, `archived`;
- `tenantBillingStatusValues`: `trialing`, `current`, `past_due`, `suspended`, `cancelled`, `exempt`.

Relacoes:

- `tenants.planId` -> `plans.id`;
- `tenants` -> `tenantMemberships`;
- `tenants` -> `tenantModules`;
- `tenants` -> `auditEvents`.

Dependencias:

- `plans`.

Observacoes:

- `noro.tenants` e o destino canonico.
- `cp.tenants` e `public.tenants` nao devem ser importados nem referenciados por codigo novo.

### `packages/db/schema/memberships.ts`

Tabelas exportadas:

- `tenantMemberships`.

Enums/valores:

- `membershipStatusValues`: `active`, `invited`, `blocked`, `archived`;
- tenant roles importadas de `roles.ts`.

Relacoes:

- `tenantMemberships.tenantId` -> `tenants.id`;
- `tenantMemberships.userId` -> `users.id`;
- `tenantMemberships.invitedByUserId` -> `users.id`.

Dependencias:

- `users`;
- `tenants`;
- `roles.ts`.

Observacoes:

- Unique para vinculo ativo por `(tenant_id, user_id)` deve ser planejado.
- Se unique parcial ficar fora da primeira implementacao, o repository deve impedir duplicidade ativa.

### `packages/db/schema/roles.ts`

Tabelas exportadas:

- `platformRoleAssignments`.

Enums/valores:

- `tenantRoleValues`: `tenant_owner`, `tenant_admin`, `tenant_manager`, `tenant_agent`, `tenant_finance`, `tenant_viewer`;
- `platformRoleValues`: `platform_owner`, `platform_admin`, `platform_ops`, `platform_finance`, `platform_support`;
- status de role usando os status base: `active`, `invited`, `blocked`, `archived`.

Relacoes:

- `platformRoleAssignments.userId` -> `users.id`;
- `platformRoleAssignments.grantedByUserId` -> `users.id`.

Dependencias:

- `users`.

Observacoes:

- Roles globais sustentam `/control`.
- Usuarios internos da NORO podem ter role global sem membership em tenant.

### `packages/db/schema/modules.ts`

Tabelas exportadas:

- `modules`.

Enums/valores:

- `moduleStatusValues`: `active`, `inactive`, `deprecated`, `future`;
- `initialModuleKeys`;
- `futureModuleKeys`.

Relacoes:

- `modules` -> `planModules`;
- `modules` -> `tenantModules`.

Dependencias:

- nenhuma tabela obrigatoria.

Observacoes:

- `modules.key` e a chave funcional estavel.
- Nome visual do modulo nao deve ser usado como permissao.
- Modulos futuros podem existir com status `future`.

### `packages/db/schema/plans.ts`

Tabelas exportadas:

- `plans`;
- `planModules`.

Enums/valores:

- `planStatusValues`: `active`, `draft`, `archived`, `deprecated`;
- `planModuleStatusValues`: `enabled`, `disabled`.

Relacoes:

- `plans` -> `planModules`;
- `planModules.planId` -> `plans.id`;
- `planModules.moduleId` -> `modules.id`;
- `tenants.planId` -> `plans.id`.

Dependencias:

- `modules`.

Observacoes:

- `price_cents` e `currency` entram em `plans`, opcionais para custom/enterprise.
- `limits` e `settings` usam JSONB.

### `packages/db/schema/tenant-modules.ts`

Tabelas exportadas:

- `tenantModules`.

Enums/valores:

- `tenantModuleStatusValues`: `enabled`, `disabled`, `trial`, `suspended`;
- `tenantModuleSourceValues`: `plan`, `addon`, `manual`, `trial`, `system`.

Relacoes:

- `tenantModules.tenantId` -> `tenants.id`;
- `tenantModules.moduleId` -> `modules.id`.

Dependencias:

- `tenants`;
- `modules`.

Observacoes:

- `tenant_modules` prevalece sobre `plan_modules`.
- `tenant_modules` e a fonte operacional de `requireModuleEnabled()`.
- `limits` e `settings` usam JSONB.

### `packages/db/schema/audit.ts`

Tabelas exportadas:

- `auditEvents`.

Enums/valores:

- `auditEventTypeValues` pode comecar como `text` controlado em aplicacao.

Relacoes:

- `auditEvents.actorUserId` -> `users.id`;
- `auditEvents.tenantId` -> `tenants.id`.

Dependencias:

- `users`;
- `tenants`.

Observacoes:

- Auditoria minima para operacoes de `/control`, roles, modulos, plano e suporte.
- Nao e ledger financeiro.

### `packages/db/schema/index.ts`

Tabelas exportadas:

- todas as tabelas de `schema/`.

Enums/valores:

- reexportar valores controlados usados por repositories e apps.

Relacoes:

- centralizar exports de relations se a implementacao usar `relations()` do Drizzle.

Dependencias:

- todos os arquivos de schema.

Observacoes:

- Deve ser o ponto unico de importacao para `drizzle.config` e consumers internos.

## 4. Repositories planejados

### `packages/db/repositories/usersRepository.ts`

Funcoes planejadas:

- `createUserProfile(input)`;
- `getUserById(id)`;
- `getUserByEmail(email)`;
- `updateUserStatus(id, status)`;
- `listUsers(filters)`.

Regras de seguranca:

- nao resolver auth externa diretamente;
- nao consultar `auth.users`;
- validar status antes de retornar usuario para auth helpers.

### `packages/db/repositories/authIdentityRepository.ts`

Funcoes planejadas:

- `findUserByProviderSubject(provider, providerSubject)`;
- `createIdentityLink(input)`;
- `findByLegacySupabaseUserId(legacySupabaseUserId)`;
- `linkLogtoIdentity(userId, claims)`;
- `reconcileLegacyIdentity(input)`.

Regras de seguranca:

- `logto` e o provider principal;
- `supabase` so pode ser usado como legado;
- nao persistir tokens ou dados sensiveis de sessao.

### `packages/db/repositories/tenantsRepository.ts`

Funcoes planejadas:

- `createTenant(input)`;
- `getTenantById(id)`;
- `getTenantBySlug(slug)`;
- `listTenants(filters)`;
- `updateTenantStatus(id, status)`;
- `updateTenantPlan(id, planId)`;
- `updateTenantBillingStatus(id, billingStatus)`.

Regras de seguranca:

- `/control` deve exigir role global;
- `/core` nao deve listar tenants fora das memberships do usuario.

### `packages/db/repositories/membershipsRepository.ts`

Funcoes planejadas:

- `createMembership(input)`;
- `getMembership(tenantId, userId)`;
- `listMembershipsByUser(userId)`;
- `listMembersByTenant(tenantId)`;
- `updateMembershipRole(id, role)`;
- `updateMembershipStatus(id, status)`;
- `assertActiveMembership(tenantId, userId)`.

Regras de seguranca:

- membership ativa e obrigatoria para `/core`;
- evitar duplicidade ativa por repository se unique parcial ainda nao existir.

### `packages/db/repositories/platformRolesRepository.ts`

Funcoes planejadas:

- `grantPlatformRole(input)`;
- `revokePlatformRole(userId, role)`;
- `listPlatformRoles(userId)`;
- `hasPlatformRole(userId, roles)`;
- `assertPlatformRole(userId, roles)`.

Regras de seguranca:

- roles globais nao substituem membership no `/core`;
- operacoes sensiveis devem gerar audit event.

### `packages/db/repositories/modulesRepository.ts`

Funcoes planejadas:

- `getModuleByKey(key)`;
- `listModules(filters)`;
- `listAvailableModules()`;
- `isModuleAvailable(key)`.

Regras de seguranca:

- validacoes devem usar `modules.key`;
- nome visual nao deve participar de autorizacao.

### `packages/db/repositories/plansRepository.ts`

Funcoes planejadas:

- `getPlanByKey(key)`;
- `getPlanById(id)`;
- `listPlans(filters)`;
- `listPlanModules(planId)`;
- `getPlanDefaults(planId)`.

Regras de seguranca:

- planos podem ser lidos pelo `/control`;
- exposicao ao `/core` deve respeitar necessidade do produto.

### `packages/db/repositories/tenantModulesRepository.ts`

Funcoes planejadas:

- `getTenantModule(tenantId, moduleKey)`;
- `listTenantModules(tenantId)`;
- `enableTenantModule(input)`;
- `disableTenantModule(tenantId, moduleKey)`;
- `suspendTenantModule(tenantId, moduleKey)`;
- `resolveEffectiveModuleAccess(tenantId, moduleKey)`;
- `assertModuleEnabled(tenantId, moduleKey)`.

Regras de seguranca:

- `tenant_modules` prevalece sobre `plan_modules`;
- `tenant_modules` e a fonte operacional de `requireModuleEnabled()`;
- modulo com status `future` nao deve ser exibido como utilizavel no `/core`.

## 5. `drizzle.config` planejado

Localizacao recomendada:

```txt
drizzle.config.ts
```

Schema path:

```txt
packages/db/schema/index.ts
```

Output de migrations:

```txt
packages/db/migrations/
```

Dialect:

```txt
postgresql
```

Uso de `DATABASE_URL`:

- ler `DATABASE_URL` via env;
- nunca registrar valor sensivel em logs ou docs;
- antes de gerar/aplicar migration, confirmar que `DATABASE_URL` aponta para banco dev/staging isolado.

Regra para nao executar automaticamente:

- `drizzle.config` pode existir para gerar migration;
- nenhum script deve aplicar migration automaticamente em producao;
- `drizzle push` fica proibido no banco atual/VPS;
- qualquer comando de migration deve ser separado entre gerar e aplicar.

Observacao:

- O config deve usar o schema `noro`.
- A primeira migration deve criar o schema `noro` antes das tabelas.

## 6. Estrategia de migration

- Migration pode ser gerada futuramente, mas nao aplicada agora.
- `drizzle push` e proibido no banco atual.
- A primeira migration deve criar `schema noro`.
- A migration deve criar tabelas, constraints e indices da fundacao.
- A migration gerada deve ser revisada manualmente antes de qualquer aplicacao.
- A primeira aplicacao deve ocorrer somente em banco dev/staging isolado.
- Backup/dump e obrigatorio antes de qualquer aplicacao em producao.
- Rollback deve ser planejado antes de aplicar.
- Supabase migrations em `supabase/migrations/` continuam congeladas e nao devem ser rodadas.
- SQLs antigos podem ser lidos para entender legado, nunca executados como fonte canonica.

Fluxo seguro futuro:

```txt
1. Criar arquivos Drizzle.
2. Criar `drizzle.config`.
3. Gerar migration em ambiente local apontando para dev/staging.
4. Revisar SQL gerado.
5. Validar que SQL nao toca `auth`, `storage`, `realtime`, `supabase_migrations`, `public`, `cp` ou `billing` legados, salvo leitura planejada futura.
6. Aplicar apenas em dev/staging se autorizado.
7. Validar schema `noro`.
8. Planejar backup/rollback antes de producao.
```

## 7. Ordem de implementacao recomendada

1. Criar estrutura `packages/db/schema/`.
2. Definir schema `noro` compartilhado.
3. Criar tabelas base:
   - `users`;
   - `identity_links`;
   - `tenants`;
   - `tenant_memberships`;
   - `platform_role_assignments`.
4. Criar catalogo de modulos:
   - `modules`;
   - valores iniciais;
   - valores futuros com status `future`.
5. Criar `plans`.
6. Criar `plan_modules`.
7. Criar `tenant_modules`.
8. Criar `audit_events`.
9. Criar relations.
10. Criar repositories.
11. Ajustar exports em `packages/db/schema/index.ts` e `packages/db/index.ts`.
12. Criar `drizzle.config`.
13. Gerar migration em modo seguro, sem aplicar.
14. Revisar SQL gerado.
15. Validar em banco dev/staging isolado quando autorizado.

## 8. Regras anti-legado

- Nao importar Supabase em novos repositories.
- Nao usar `.from(...)`.
- Nao usar `auth.users`.
- Nao criar FK para schemas Supabase.
- Nao usar RLS Supabase.
- Nao rodar `supabase/migrations`.
- Nao reaproveitar providers Stripe/Cielo/BTG/eRede.
- Nao usar `public.tenants` nem `cp.tenants` como fonte final.
- Nao usar nome visual de modulo como permissao.
- Nao exibir modulo no `/core` sem validacao de `tenant_modules`.
- Nao aplicar migration no banco da VPS.

## 9. Criterios para permitir implementacao na Sprint 1F

A Sprint 1F so pode comecar se:

- este plano for aprovado;
- banco dev/staging estiver confirmado;
- backup/dump estiver planejado;
- `docs/SPRINT_STATUS.md` estiver atualizado;
- migrations continuarem bloqueadas para producao;
- Paulo aprovar a criacao dos arquivos Drizzle;
- estiver claro que Sprint 1F pode criar arquivos, mas nao aplicar migration em banco real.

## 10. Decisoes pendentes

Decisoes ainda necessarias antes de implementar arquivos:

- [ ] Paulo aprovar explicitamente a Sprint 1F para criacao de arquivos Drizzle.
- [ ] Confirmar qual banco dev/staging isolado sera usado para validacao futura.
- [ ] Confirmar estrategia de backup/dump antes de qualquer aplicacao fora de dev/staging.
- [ ] Confirmar se unique parcial sera implementado ja na primeira migration ou garantido inicialmente no repository.
- [ ] Confirmar se os seeds/catalogo inicial de `modules` e `plans` ficarao em migration, seed separado ou tarefa posterior.
- [ ] Confirmar se `drizzle.config.ts` ficara na raiz do monorepo ou dentro de `packages/db`.

## 11. Proximo passo recomendado

Proxima sprint:

```txt
Sprint 1F - Implementar arquivos Drizzle da fundacao, sem aplicar migration em banco real
```

Regras para Sprint 1F:

- pode criar arquivos `.ts` de schema e repositories;
- pode criar `drizzle.config` se aprovado;
- pode ajustar exports de `packages/db`;
- pode gerar migration somente se explicitamente autorizado;
- nao pode aplicar migration em banco real;
- nao pode alterar banco da VPS;
- nao pode rodar `drizzle push`;
- nao pode rodar migrations Supabase;
- nao pode instalar dependencias sem aprovacao.

Estado final esperado da Sprint 1E: plano de implementacao documentado, Sprint 1 ainda em andamento, migrations bloqueadas.
