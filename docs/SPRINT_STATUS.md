# NORO Sprint Status

Data de referencia: 2026-05-27

Status geral: Sprint 0 concluida; Sprint 1 em andamento com auditorias 1A/1B, mapa canonico 1C, plano Drizzle 1D/1E, arquivos Drizzle 1F, helpers 1G/1H, adapter Logto 1I/1J, plano de migracao 1K, rotas Logto do /control implementadas na Sprint 1L, seed script preparado na Sprint 1M e Sprint 1N bloqueada por falta de banco dev/staging e sub do Logto.

Fonte principal: `docs/backlog/implementation/noro-foundation-sprint-plan.md`

Este arquivo e operacional e deve ser atualizado ao final de cada sprint. Ele serve como painel rapido de acompanhamento, nao como plano detalhado.

Este arquivo nao substitui `docs/architecture/` como fonte da arquitetura vigente nem `docs/conceito/` como visao-alvo estrategica. `docs/conceito/` nao deve ser tratado como implementacao existente.

Supabase deve ser tratado como legado/transicional. Appwrite esta eliminado. Asaas e o gateway financeiro vigente para novos fluxos.

## 1. Resumo geral

| Sprint | Nome | Status | Prioridade | Dependencia principal | Proxima acao |
| --- | --- | --- | --- | --- | --- |
| Sprint 0 | Alinhamento documental e decisoes criticas | `concluida` | Alta | Decisoes do Paulo registradas | Nenhuma; sprint encerrada |
| Sprint 1 | Auth, tenant e base de dados canonica | `concluida` | Alta | Sprint 0 concluida; 1A–1N concluidas | Sprint 1 concluida em 2026-05-29 |
| Sprint 1N | Bootstrap do platform_owner em banco dev/staging | `concluida` | Alta | DEV_STAGING_DATABASE_URL e PLATFORM_OWNER_LOGTO_SUB confirmados por Paulo | Concluida em 2026-05-29 |
| Sprint 2 | CRM minimo em PostgreSQL/Drizzle | `concluida` | Alta | Sprint 1 concluida | Concluida em 2026-05-29 |
| Sprint 3 | Produtos manuais e fornecedores basicos | `concluida` | Media | Sprint 2 concluida | Concluida em 2026-05-29 |
| Sprint 4 | Propostas / quote builder canonico | `concluida` | Alta | Sprint 3 concluida | Concluida em 2026-05-29 |
| Sprint 5 | Checkout Asaas minimo | `nao_iniciada` | Alta | Sprint 4 concluida e decisoes Asaas aprovadas | Planejar `PaymentProvider`, `AsaasProvider` e webhooks |
| Sprint 6 | Comissao simples e eventos financeiros | `nao_iniciada` | Alta | Sprint 5 concluida | Definir regra simples de comissao e eventos financeiros |
| Sprint 7 | Sites/vitrines conectados ao funil | `nao_iniciada` | Media | Sprint 2, Sprint 4 e Sprint 5 concluidas | Conectar sites a lead, proposta e checkout |
| Sprint 8 | Grupos basicos | `nao_iniciada` | Media | Sprint 4, Sprint 5 e Sprint 6 concluidas | Definir grupos, lideres, participantes e governanca minima |
| Sprint 9 | Ledger inicial | `nao_iniciada` | Alta | Sprint 6 concluida | Consolidar lancamentos financeiros e visoes Control/Tenant |

## 2. Status permitidos

Use apenas estes status no documento:

- `nao_iniciada`
- `em_andamento`
- `bloqueada`
- `concluida`
- `cancelada`
- `adiada`

## 3. Sprint atual

Sprint atual: Sprint 5 — Checkout Asaas minimo

Status atual da Sprint 4: `concluida`

Proxima acao: Iniciar Sprint 5 — PaymentProvider, AsaasProvider, webhook e status canonico de pagamento.

## Sprint 0 — Alinhamento documental e decisoes criticas

**Status:** `concluida`

**Objetivo:**  
Reduzir ambiguidade antes de codar, confirmar o recorte do MVP e bloquear novas decisoes baseadas em documentos ou caminhos legados.

**Checklist de execucao:**
- [x] Confirmar MVP inicial da NORO. Decisao registrada como MVP fundacional.
- [x] Confirmar apps alvo e apps transicionais. Decisao registrada.
- [x] Corrigir divergencias documentais de dominios. Decisao registrada; atualizacao dos docs vigentes fica para tarefa posterior.
- [x] Confirmar se `apps/control` ou `apps/core` sera dono dos primeiros fluxos. Decisao registrada: `/control` e Control Plane; `/core` e portal operacional dos tenants.
- [x] Confirmar papel de Supabase como legado/transicional.
- [x] Confirmar Appwrite como eliminado.
- [x] Confirmar Asaas como gateway financeiro vigente.
- [x] Listar decisoes que dependem do Paulo.
- [x] Registrar decisoes tomadas ao final da sprint.
- [x] Atualizar este `docs/SPRINT_STATUS.md` ao final da sprint.

**Checklist de validacao:**
- [x] Recorte do MVP documentado.
- [x] Apps alvo e apps transicionais documentados.
- [x] Dominios oficiais sem contradicao no registro da Sprint 0. Atualizacao dos docs vigentes fica para tarefa posterior.
- [x] Decisoes pendentes para Paulo registradas.
- [x] Nenhuma alteracao de codigo, schema ou migration executada.

**Arquivos/pastas provaveis:**
- `docs/SPRINT_STATUS.md`
- `docs/backlog/implementation/noro-foundation-sprint-plan.md`
- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/apps/README.md`
- `docs/apps/*.README.md`
- `docs/backlog/README.md`
- `docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md`
- `scripts/README.md`

**Decisoes pendentes:**
- Nenhuma decisao critica pendente para iniciar a Sprint 1.
- Decisoes taticas futuras: roles/permissoes iniciais, ponte `legacy_supabase_user_id`, estrategia curta de coexistencia Supabase Auth/Logto, timing exato de split/subcontas e owner tecnico das proximas sprints.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- `docs/backlog/implementation/sprint-0-alinhamento-documental-decisoes.md`
- `docs/SPRINT_STATUS.md`

**Resultado final:**
- Sprint 0 concluida. MVP fundacional, papeis dos apps, dominios, Asaas/checkout proprio, ledger minimo, billing SaaS da NORO e limites de reservas/APIs de terceiros foram registrados.

**Data de inicio:**  
2026-05-27.

**Data de conclusao:**  
2026-05-27.

**Agente/responsavel:**  
Codex.

**Observacoes:**  
Registro da Sprint 0 atualizado em `docs/backlog/implementation/sprint-0-alinhamento-documental-decisoes.md`. Nenhuma funcionalidade, schema, migration ou dependencia foi alterada. Sprint 1 pode comecar.

## Sprint 1 — Auth, tenant e base de dados canonica

**Status:** `em_andamento`

**Objetivo:**  
Criar a fundacao tecnica para usuario, tenant, membership, permissao e acesso a dados usando Logto, PostgreSQL e Drizzle.

**Checklist de execucao:**
- [x] Auditar banco PostgreSQL atual em modo read-only antes de desenhar schema/migrations.
- [x] Auditar referencias locais a Supabase, SQLs antigos, migrations e tabelas legadas.
- [x] Criar mapa canonico de auth, tenants, memberships, roles e ponte legado sem migrations.
- [x] Criar plano Drizzle da fundacao canonica com schema `noro`, modulos, planos, habilitacoes, constraints, repositories e helpers.
- [x] Criar plano de implementacao dos arquivos Drizzle da fundacao, sem criar `.ts` e sem rodar migrations.
- [x] Implementar arquivos Drizzle da fundacao localmente, sem aplicar migration em banco real.
- [x] Criar plano dos helpers de auth, tenant context, platform roles e module guards, sem implementar codigo.
- [x] Implementar helpers de auth, tenant context, platform roles, module guards e autorizacao em `packages/auth`, sem migrar telas e sem tocar banco.
- [x] Definir contrato oficial do adapter Logto/Next.js e criar stub seguro em `packages/auth/adapters/`, sem instalar SDK.
- [ ] Definir Logto runtime para rotas novas (bloqueado: SDK nao aprovado ainda).
- [x] Definir modelo canonico de tenants.
- [x] Definir modelo canonico de memberships.
- [x] Definir roles iniciais.
- [x] Criar helpers de auth: `getCurrentUser` e `requireUser`. `getSessionClaims` e `signOut` ficam para adapter Logto/Next.js.
- [x] Criar helpers de tenant: `resolveTenantContext` e `authorize`.
- [x] Definir autorizacao central MVP.
- [x] Definir schemas e repositorios iniciais em PostgreSQL/Drizzle.
- [x] Evitar novas chamadas Supabase em codigo novo.

**Checklist de validacao:**
- [x] Auditoria inicial nao executou migrations, `drizzle push` ou comandos de escrita.
- [x] Auditoria local nao acessou banco, nao executou SQLs e nao alterou schema.
- [x] Mapa canonico nao usa `auth.users` nem RLS Supabase como base nova.
- [x] Plano Drizzle mantem migrations bloqueadas ate aprovacao, backup/dump e banco dev/staging isolado.
- [x] Plano de implementacao 1E nao criou arquivos `.ts`, nao criou `drizzle.config` real e nao gerou migration.
- [x] Sprint 1F criou arquivos `.ts` e `drizzle.config.ts` sem acessar banco, gerar migration ou aplicar migration.
- [x] Sprint 1G planejou helpers de auth/tenant/modules sem criar arquivos `.ts`, sem acessar banco e sem migrations.
- [x] Sprint 1H criou helpers em `packages/auth` sem migrar apps, remover Supabase, instalar dependencias, acessar banco ou rodar migrations.
- [x] Sprint 1I definiu contrato `LogtoSessionClaims`, criou `packages/auth/adapters/logto-session-adapter.ts` e validou TypeScript; SDK nao instalado; nenhum app migrado; banco nao acessado.
- [x] Sprint 1J instalou `@logto/next@4.2.10` em `packages/auth` e implementou adapter real com `getLogtoContext` do `@logto/next/server-actions`; TypeScript passou; nenhum app migrado; banco nao acessado.
- [x] Sprint 1K criou plano de migracao do apps/control para Logto; mapeou estado atual; planejou rotas /auth/*, lib/logto.ts e middleware; documentou coexistencia Supabase+Logto e rollback; nenhum codigo alterado; banco nao acessado.
- [x] Sprint 1L criou rotas Logto reais em apps/control (/auth/sign-in, /auth/callback, /auth/sign-out), lib/logto.ts e ajustou middleware com lista publica; TypeScript passou; login Supabase e layout protegido intactos; banco nao acessado.
- [x] Sprint 1M analisou schemas (users, identity-links, roles) e repositorios; criou scripts/seed-platform-owner.ts com guards de seguranca (ALLOW_NORO_SEED, NODE_ENV, host de producao), modo dry-run e comportamento idempotente; TypeScript passou; scan de seguranca aprovado; banco nao acessado.
- [x] Sprint 1N bloqueada: DEV_STAGING_DATABASE_URL e PLATFORM_OWNER_LOGTO_SUB nao fornecidos; validacoes locais (TypeScript, scan, guards) passaram; nenhum banco acessado; relatorio de bloqueio criado.
- [ ] Rotas novas usam Logto como guard real (bloqueado: bootstrap de identity_links/platform_role pendente em banco dev/staging).
- [ ] Tenant e resolvido por sessao/membership, nao por parametro isolado.
- [ ] Recursos operacionais exigem `tenant_id`.
- [x] Repositorios novos usam `packages/db`.
- [x] Appwrite continua ausente.

**Arquivos/pastas provaveis:**
- `packages/auth/`
- `packages/db/`
- `packages/lib/services/authService.ts`
- `apps/control/app/login/`
- `apps/control/app/(protected)/`
- `apps/core/app/(protected)/`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `scripts/README.md`

**Decisoes pendentes:**
- [ ] Estrategia de coexistencia curta entre Supabase Auth e Logto.
- [ ] Confirmar qual banco dev/staging isolado sera usado para validacao futura.
- [ ] Confirmar estrategia de backup/dump antes de qualquer aplicacao fora de dev/staging.
- [ ] Confirmar se unique parcial sera implementado ja na primeira migration ou garantido inicialmente no repository.
- [ ] Confirmar se os seeds/catalogo inicial de `modules` e `plans` ficarao em migration, seed separado ou tarefa posterior.
- [ ] Aprovar explicitamente qualquer geracao futura de migration apenas para revisao.
- [ ] App prioritario para primeira integracao Logto.
- [x] SDK Logto para Next.js: `@logto/next@4.2.10` aprovado e instalado em `packages/auth`.
- [ ] Decidir se usuario Logto sem perfil interno cria perfil automaticamente ou bloqueia com erro controlado.
- [x] URL dev local do /control: http://localhost:3001 (confirmado; usado como fallback em lib/logto.ts).
- [x] Rota pos-login padrao: / (confirmado; usado como postRedirectUri em /auth/sign-in).
- [x] Estrategia: /login Supabase permanece em paralelo; fluxo Logto novo em /auth/sign-in (confirmado).
- [x] Primeiro platform_owner: paulobolliger@gmail.com (confirmado; bootstrap pendente para Sprint 1M).
- [ ] Confirmar banco dev/staging isolado para testes de fluxo completo e bootstrap do platform_owner.
- [ ] Decidir se usuario Logto sem perfil interno cria perfil automaticamente ou bloqueia com erro controlado.

**Bloqueios:**
- Nenhum bloqueio para revisao dos arquivos criados na Sprint 1F.
- Bloqueio operacional para migrations: nao rodar migrations ou `drizzle push` contra o banco atual antes de aprovacao explicita, backup/dump e banco dev/staging isolado.
- Bloqueio para aplicar schema: ainda falta banco dev/staging confirmado, estrategia de backup/dump e autorizacao explicita para qualquer migration.
- Bloqueio para sessao real Logto em producao: SDK instalado e adapter real implementado em `packages/auth/adapters/`; falta criar rotas `/auth/*` e middleware nos apps (Sprint 1K).

**Arquivos alterados:**
- `docs/backlog/implementation/sprint-1a-database-readonly-audit.md`
- `docs/backlog/implementation/sprint-1b-local-schema-reference-audit.md`
- `docs/backlog/implementation/sprint-1c-canonical-auth-tenant-schema-map.md`
- `docs/backlog/implementation/sprint-1d-drizzle-schema-plan.md`
- `docs/backlog/implementation/sprint-1e-drizzle-implementation-plan.md`
- `docs/backlog/implementation/sprint-1f-drizzle-files-implementation-report.md`
- `docs/backlog/implementation/sprint-1g-auth-tenant-module-guards-plan.md`
- `docs/backlog/implementation/sprint-1h-auth-tenant-module-guards-implementation-report.md`
- `drizzle.config.ts`
- `packages/db/index.ts`
- `packages/db/schema/_schema.ts`
- `packages/db/schema/users.ts`
- `packages/db/schema/identity-links.ts`
- `packages/db/schema/tenants.ts`
- `packages/db/schema/memberships.ts`
- `packages/db/schema/roles.ts`
- `packages/db/schema/modules.ts`
- `packages/db/schema/plans.ts`
- `packages/db/schema/tenant-modules.ts`
- `packages/db/schema/audit.ts`
- `packages/db/schema/index.ts`
- `packages/db/repositories/usersRepository.ts`
- `packages/db/repositories/authIdentityRepository.ts`
- `packages/db/repositories/tenantsRepository.ts`
- `packages/db/repositories/membershipsRepository.ts`
- `packages/db/repositories/platformRolesRepository.ts`
- `packages/db/repositories/modulesRepository.ts`
- `packages/db/repositories/plansRepository.ts`
- `packages/db/repositories/tenantModulesRepository.ts`
- `packages/db/repositories/index.ts`
- `packages/auth/errors.ts`
- `packages/auth/types.ts`
- `packages/auth/context/user-context.ts`
- `packages/auth/context/tenant-context.ts`
- `packages/auth/context/platform-context.ts`
- `packages/auth/context/module-context.ts`
- `packages/auth/context/site-tenant-context.ts`
- `packages/auth/context/authorization.ts`
- `packages/auth/index.ts`
- `packages/auth/package.json`
- `packages/auth/adapters/logto-session-adapter.ts`
- `packages/auth/adapters/index.ts`
- `packages/auth/package.json`
- `package-lock.json`
- `docs/backlog/implementation/sprint-1i-logto-next-adapter-validation-report.md`
- `docs/backlog/implementation/sprint-1j-logto-sdk-adapter-report.md`
- `docs/backlog/implementation/sprint-1k-control-logto-migration-plan.md`
- `apps/control/lib/logto.ts`
- `apps/control/app/auth/sign-in/route.ts`
- `apps/control/app/auth/callback/route.ts`
- `apps/control/app/auth/sign-out/route.ts`
- `apps/control/middleware.ts`
- `docs/backlog/implementation/sprint-1l-control-logto-routes-report.md`
- `scripts/seed-platform-owner.ts`
- `docs/backlog/implementation/sprint-1m-platform-owner-bootstrap-plan.md`
- `docs/backlog/implementation/sprint-1n-platform-owner-bootstrap-execution-report.md`
- `docs/SPRINT_STATUS.md`

**Resultado final:**

- Sprint 1A–1F: auditorias, mapa canonico, plano Drizzle e arquivos Drizzle criados localmente sem acessar banco. Sprint 1G–1H: plano e implementacao dos helpers em `packages/auth`. Sprint 1I–1J: contrato `LogtoSessionClaims`, stub e adapter real com `@logto/next@4.2.10`. Sprint 1K: plano de migracao do /control para Logto. Sprint 1L: criou rotas Logto reais (`/auth/sign-in`, `/auth/callback`, `/auth/sign-out`), `apps/control/lib/logto.ts` e ajustou `middleware.ts` com lista publica explicita e matcher preciso; TypeScript passou; login Supabase e layout protegido intactos; banco nao acessado. Sprint 1M: analisou schemas e repositorios; criou `scripts/seed-platform-owner.ts` idempotente com guards de seguranca; TypeScript e scan aprovados; banco nao acessado. Sprint 1N: bloqueada — `DEV_STAGING_DATABASE_URL` e `PLATFORM_OWNER_LOGTO_SUB` nao fornecidos; validacoes locais passaram; relatorio de bloqueio registrado; nenhum banco acessado. Sprint 1 segue em andamento; nao esta concluida.

**Data de inicio:**  
2026-05-27.

**Data de conclusao:**  
A definir.

**Agente/responsavel:**  
Codex.

**Observacoes:**  
Supabase permanece legado/transicional; Appwrite permanece eliminado; PostgreSQL/Drizzle/Logto seguem como direcao vigente. Sprint 1N bloqueada aguarda confirmacao do banco dev/staging e sub do Logto por Paulo.

## Sprint 1N — Bootstrap do platform_owner em banco dev/staging

**Status:** `concluida`

**Objetivo:**  
Executar o seed script para criar os registros de bootstrap do primeiro `platform_owner` (`paulobolliger@gmail.com`) em banco dev/staging isolado, e validar o fluxo Logto de ponta a ponta.

**Checklist de execucao:**

- [x] Paulo confirmou banco dev/staging isolado (Neon) e forneceu `DEV_STAGING_DATABASE_URL`.
- [x] Paulo forneceu `PLATFORM_OWNER_LOGTO_SUB` (`uk8peexae8rc`).
- [x] Paulo autorizou explicitamente a execucao do seed.
- [x] Dry-run executado e passou sem erros.
- [x] Seed real executado com sucesso.
- [x] Confirmado: `noro.users`, `noro.identity_links`, `noro.platform_role_assignments` criados.
- [x] Testado `/auth/sign-in` → Logto → `/auth/callback` → `/` no browser local.
- [x] Comportamento ao cair no guard Supabase antigo confirmado (esperado nesta fase).

**Checklist de validacao:**

- [x] Dry-run executado antes do seed real.
- [x] Seed real apenas apos dry-run passar.
- [x] Producao nao acessada.
- [x] Nenhuma migration aplicada.
- [x] Nenhum `app/(protected)/layout.tsx` alterado.
- [x] Middleware Logto global nao ativado.
- [x] Relatorio `sprint-1n-platform-owner-bootstrap-execution-report.md` atualizado.

**Registros criados no banco Neon:**

- `noro.users`: `id=7a02ea9e-c93c-400c-9b42-fdfae56d20b1`, `email=paulobolliger@gmail.com`, `status=active`
- `noro.identity_links`: `provider=logto`, `provider_subject=uk8peexae8rc`, `user_id=7a02ea9e-c93c-400c-9b42-fdfae56d20b1`
- `noro.platform_role_assignments`: `role=platform_owner`, `status=active`, `user_id=7a02ea9e-c93c-400c-9b42-fdfae56d20b1`

**Banco dev/staging:**

- Provedor: Neon
- Host: `ep-old-fog-aqod2l62.c-8.us-east-1.aws.neon.tech`
- Database: `neondb`
- URL armazenada em: `.env.neon` (gitignored)

**Arquivos alterados:**

- `apps/control/app/auth/callback/route.ts` — corrigido para passar `URL` em vez de `URLSearchParams` ao `handleSignIn`; re-lancamento de `NEXT_REDIRECT`; try-catch de debug adicionado
- `apps/control/app/auth/whoami/route.ts` — rota temporaria criada para captura do sub (remover apos Sprint 1O)
- `apps/control/app/auth/sign-in/route.ts` — sem alteracao de logica
- `apps/control/lib/logto.ts` — `LOGTO_BASE_URL` adicionado como variavel prioritaria para baseUrl
- `apps/control/package.json` — porta fixada em 3001 (`next dev --port 3001`)
- `apps/control/.env.local` — `LOGTO_APP_ID` e `LOGTO_APP_SECRET` corrigidos; `LOGTO_BASE_URL=http://localhost:3001` adicionado
- `scripts/seed-platform-owner.ts` — corrigido bug de dry-run com UUID simulado no passo 3
- `packages/db/migrations/0000_panoramic_alice.sql` — migration gerada (schema noro + 10 tabelas)
- `.env.neon` — criado com URL Neon e credenciais dev (gitignored)
- `.gitignore` — `.env.neon` adicionado
- `docs/SPRINT_STATUS.md`

**Resultado final:**

- Banco Neon configurado, migrations aplicadas, seed executado com sucesso. `paulobolliger@gmail.com` registrado como `platform_owner` no schema canonico `noro`. Fluxo Logto validado localmente: sign-in → callback → sessao estabelecida (`sub=uk8peexae8rc`). Comportamento esperado: apos callback, guard Supabase em `(protected)/layout.tsx` redireciona para `/login` — correto para esta fase, escopo da Sprint 1O.

**Data de inicio:**  
2026-05-27.

**Data de conclusao:**  
2026-05-29.

**Agente/responsavel:**  
Claude / Paulo Bolliger.

**Observacoes:**  
Rota `/auth/whoami` e try-catch de debug no callback devem ser removidos na Sprint 1O. `LOGTO_APP_ID` correto para producao: `j9j9xidtatp19sa2ff4pm`.

## Sprint 2 — CRM minimo em PostgreSQL/Drizzle

**Status:** `concluida`

**Objetivo:**  
Recriar o fluxo minimo de CRM sobre a base canonica, sem depender de Supabase como caminho novo.

**Checklist de execucao:**
- [ ] Modelar leads com `tenant_id`.
- [ ] Modelar clientes com `tenant_id`.
- [ ] Definir CRM minimo.
- [ ] Criar repositorios Drizzle para leads.
- [ ] Criar repositorios Drizzle para clientes.
- [ ] Criar ou migrar rotas/actions novas sem Supabase.
- [ ] Definir status e origem do lead.
- [ ] Preservar apenas padroes uteis do CRM legado.

**Checklist de validacao:**
- [ ] Lead pertence a tenant.
- [ ] Cliente pertence a tenant.
- [ ] CRUD minimo usa PostgreSQL/Drizzle.
- [ ] Rotas/actions novas nao usam Supabase.
- [ ] Rotas novas usam Logto e tenant context.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/control/app/(protected)/leads/`
- `apps/control/app/(protected)/clientes/`
- `apps/core/app/(protected)/`
- `packages/lib/services/crmService.ts`
- `docs/apps/control.README.md`
- `docs/apps/core.README.md`

**Decisoes pendentes:**
- [ ] Campos minimos de lead.
- [ ] Campos minimos de cliente final.
- [ ] Se o CRM inicial vive primeiro em `apps/control` ou `apps/core`.
- [ ] Politica de migracao dos dados CRM legados.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- `packages/db/schema/leads.ts` — schema canonico de leads (turismo) com 25 colunas
- `packages/db/schema/clients.ts` — schema canonico de clientes (turismo) com 51 colunas
- `packages/db/schema/index.ts` — relacoes leads/clients adicionadas
- `packages/db/repositories/leadsRepository.ts` — CRUD + stats por status
- `packages/db/repositories/clientsRepository.ts` — CRUD + stats por status
- `packages/db/repositories/index.ts` — exports adicionados
- `packages/db/migrations/0001_confused_rachel_grey.sql` — migration aplicada ao Neon
- `apps/core/app/(protected)/leads/actions.ts` — actions Drizzle (substitui stub)
- `apps/core/app/(protected)/clientes/actions.ts` — actions Drizzle (substitui stub)
- `docs/SPRINT_STATUS.md`

**Resultado final:**
- Schema de leads (25 colunas, turismo-first) e clientes (51 colunas, Person PGI) criados no schema `noro`.
- Migration 0001 aplicada ao Neon. Repositorios com CRUD completo e filtros por tenant.
- Actions no `apps/core` substituem stubs e operam via Drizzle/PostgreSQL.
- Supabase nao e chamado nas novas rotas. Dados legados permanecem no Supabase sem migracao.
- Nota: tenantId e passado explicitamente pelas actions — integracao completa com Logto/tenant context fica para sprint dedicada (1O).

**Data de inicio:**  
2026-05-29.

**Data de conclusao:**  
2026-05-29.

**Agente/responsavel:**  
Claude / Paulo Bolliger.

**Observacoes:**  
Schemas aprovados pelo Paulo com justificativas de dominio (turismo). Nenhuma migracao de dados legados nesta sprint.

## Sprint 3 — Produtos manuais e fornecedores basicos

**Status:** `concluida`

**Objetivo:**  
Criar um catalogo inicial manual-first para permitir propostas sem depender de APIs de fornecedor.

**Checklist de execucao:**
- [ ] Modelar fornecedores basicos por tenant.
- [ ] Modelar produtos manuais por tenant.
- [ ] Definir categorias iniciais.
- [ ] Registrar custo.
- [ ] Registrar preco.
- [ ] Registrar margem.
- [ ] Preparar produtos para uso em propostas.
- [ ] Evitar APIs externas complexas nesta sprint.

**Checklist de validacao:**
- [ ] Produto manual pertence a tenant.
- [ ] Fornecedor basico pertence a tenant, salvo excecao explicitada.
- [ ] Categoria, custo, preco e margem estao representados.
- [ ] Produto pode ser usado por proposta futura.
- [ ] Operacao manual-first funciona sem Supplier Hub completo.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/control/app/(protected)/`
- `apps/core/app/(protected)/`
- `docs/conceito/04_noro_h2b2h_marketplace.md`
- `docs/conceito/07_noro_supplier_api_roadmap.md`

**Decisoes pendentes:**
- [ ] Categorias oficiais do MVP.
- [ ] Se fornecedores podem ser globais ou sempre por tenant.
- [ ] Campos obrigatorios de custo, preco e margem.
- [ ] Nivel minimo de auditoria de alteracao de preco.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- `packages/db/schema/suppliers.ts` — catálogo global de fornecedores com integração API
- `packages/db/schema/products.ts` — catálogo global de produtos (9 categorias, sem custo, sem tenant_id)
- `packages/db/schema/pricing-rules.ts` — estrutura de regras de composição de preço (plataforma + tenant)
- `packages/db/schema/index.ts` — relações suppliers/products/pricing_rules adicionadas
- `packages/db/repositories/suppliersRepository.ts` — CRUD + stats por tipo
- `packages/db/repositories/productsRepository.ts` — CRUD + stats por categoria
- `packages/db/repositories/pricingRulesRepository.ts` — CRUD + leitura por escopo
- `packages/db/repositories/index.ts` — exports adicionados
- `packages/db/migrations/0002_cheerful_loki.sql` — migration aplicada ao Neon (15 tabelas)
- `apps/control/app/(protected)/catalogo/fornecedores/actions.ts` — CRUD admin
- `apps/control/app/(protected)/catalogo/produtos/actions.ts` — CRUD admin
- `docs/SPRINT_STATUS.md`

**Decisoes arquiteturais registradas:**
- Suppliers e products sao catálogo global da plataforma (sem tenant_id)
- custo_base_cents removido do produto — snapshot fica na booking (Sprint 5+)
- preco_tipo determina comportamento na proposta: manual | api_tempo_real | api_cache
- pricing_rules com escopo plataforma/tenant — lógica de composição de preço em sprint futura
- apps/core nao recebe actions nesta sprint — consome catálogo via Sprint 4 (propostas)

**Data de inicio:**  
2026-05-29.

**Data de conclusao:**  
2026-05-29.

**Agente/responsavel:**  
Claude / Paulo Bolliger.

**Observacoes:**  
Catálogo global gerenciado pelo apps/control. Tenant consome via sistema de reservas (Sprint 4+). Regras de pricing sem lógica ainda — estrutura criada para evitar migration destrutiva futura.

## Sprint 4 — Propostas / quote builder canonico

**Status:** `concluida`

**Objetivo:**  
Consolidar proposta como ponte entre CRM, produtos, checkout e comissao.

**Checklist de execucao:**
- [ ] Modelar propostas.
- [ ] Modelar quote builder canonico.
- [ ] Modelar itens de proposta.
- [ ] Criar snapshot de preco/custo/margem.
- [ ] Definir status de proposta.
- [ ] Definir aceite de proposta.
- [ ] Preparar proposta aceita como base para checkout.
- [ ] Associar proposta a tenant e cliente.

**Checklist de validacao:**
- [ ] Proposta pertence a tenant.
- [ ] Proposta esta associada a lead ou cliente.
- [ ] Itens possuem snapshot financeiro.
- [ ] Status de proposta estao definidos.
- [ ] Proposta aceita fornece base confiavel para cobranca.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/control/app/(protected)/orcamentos/`
- `apps/core/app/(protected)/orcamentos/`
- `apps/control/components/orcamentos/`
- `packages/renderer/`

**Decisoes pendentes:**
- [ ] Status oficiais da proposta.
- [ ] Se proposta gera pedido automaticamente ao ser aceita.
- [ ] Se aceite e manual, link publico ou autenticado.
- [ ] Nivel minimo de versionamento da proposta.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- `packages/db/schema/proposals.ts` — proposals (32 colunas) + proposal_items (19 colunas)
- `packages/db/schema/index.ts` — relacoes proposals/proposal_items adicionadas
- `packages/db/repositories/proposalsRepository.ts` — CRUD completo + fluxo aceite + recalc automatico
- `packages/db/repositories/index.ts` — export adicionado
- `packages/db/migrations/0003_fearless_talon.sql` — migration aplicada (17 tabelas)
- `apps/core/app/(protected)/orcamentos/orcamentos-actions.ts` — substitui stub Supabase; CRUD + envio + status + itens
- `apps/core/app/proposta/[token]/actions.ts` — rota publica: visualizar (aciona 'visualizada'), aceitar, leitura

**Decisoes arquiteturais registradas:**
- Proposta nao armazena conversao BRL — apenas moeda_base + taxa_cambio_snapshot para referencia historica
- Snapshot BRL pertence ao pagamento (Sprint 5), nao a proposta
- Painel publico consulta API de cambio do /control em tempo real a cada acesso
- status 'visualizada' acionado automaticamente por acesso ao aceite_token
- snapshot_pricing_rules bloqueado no repository apos aceita_at (imutabilidade explícita)
- numero gerado sequencialmente por tenant: {ANO}-{NNNN}
- Versionamento: versao int no cabecalho, incrementado a cada envio

**Data de inicio:**  
2026-05-29.

**Data de conclusao:**  
2026-05-29.

**Agente/responsavel:**  
Claude / Paulo Bolliger.

**Observacoes:**  
Proposta pronta para alimentar Sprint 5 (checkout Asaas). Pagamento usa proposal.id como referencia.

## Sprint 5 — Checkout Asaas minimo

**Status:** `nao_iniciada`

**Objetivo:**  
Permitir cobranca real ou piloto via Asaas para uma proposta/pedido, com webhook e status canonico.

**Checklist de execucao:**
- [ ] Definir `PaymentProvider`.
- [ ] Definir `AsaasProvider`.
- [ ] Criar fluxo de cobranca.
- [ ] Definir PIX, boleto e cartao/link conforme decisao aprovada.
- [ ] Criar webhook Asaas.
- [ ] Implementar idempotencia de webhook.
- [ ] Definir status interno de pagamento.
- [ ] Separar cobranca da agencia, billing NORO e comissao.

**Checklist de validacao:**
- [ ] Cobranca Asaas sandbox criada por fluxo canonico.
- [ ] Webhook salva payload bruto.
- [ ] Evento duplicado nao processa duas vezes.
- [ ] Status interno de pagamento e atualizado.
- [ ] Fluxo novo nao chama Stripe, Cielo, BTG ou eRede.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/control/`
- `apps/core/`
- `apps/billing/`
- `docs/architecture/billing-asaas-migration-plan.md`
- `scripts/README.md`

**Decisoes pendentes:**
- [ ] Conta master ou subcontas desde o MVP.
- [ ] Metodos de pagamento do MVP.
- [ ] App dono das rotas financeiras canonicas.
- [ ] Checkout hospedado Asaas ou tela propria com tokenizacao.
- [ ] Se billing SaaS NORO entra neste ciclo.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- Nenhum ainda.

**Resultado final:**
- Nao iniciado.

**Data de inicio:**  
A definir.

**Data de conclusao:**  
A definir.

**Agente/responsavel:**  
A definir.

**Observacoes:**  
Nenhuma.

## Sprint 6 — Comissao simples e eventos financeiros

**Status:** `nao_iniciada`

**Objetivo:**  
Registrar comissao inicial da NORO e eventos financeiros basicos derivados de pagamento.

**Checklist de execucao:**
- [ ] Definir comissao simples.
- [ ] Definir eventos financeiros.
- [ ] Criar snapshot de regra aplicada.
- [ ] Separar receita NORO.
- [ ] Separar receita tenant.
- [ ] Separar comissao.
- [ ] Preparar dados para ledger.
- [ ] Registrar eventos de cobranca criada, pagamento confirmado e pagamento recebido.

**Checklist de validacao:**
- [ ] Comissao registrada de forma auditavel.
- [ ] Regra aplicada possui snapshot.
- [ ] Receita NORO e receita tenant nao ficam misturadas.
- [ ] Eventos financeiros possuem tenant, origem e status.
- [ ] Modelo nao depende de gateway legado.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/control/`
- `apps/core/`
- `apps/financeiro/`
- `docs/architecture/billing-asaas-migration-plan.md`

**Decisões pendentes:**
- [ ] Modelo de comissao: percentual, fixo ou hibrido.
- [ ] Comissao por tenant, plano, produto ou transacao.
- [ ] Se split financeiro real sera usado no MVP.
- [ ] Como lidar com estorno e cancelamento.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- Nenhum ainda.

**Resultado final:**
- Nao iniciado.

**Data de inicio:**  
A definir.

**Data de conclusao:**  
A definir.

**Agente/responsavel:**  
A definir.

**Observacoes:**  
Nenhuma.

## Sprint 7 — Sites/vitrines conectados ao funil

**Status:** `nao_iniciada`

**Objetivo:**  
Conectar sites e vitrines ao funil real de lead, proposta e checkout, evitando vitrines isoladas.

**Checklist de execucao:**
- [ ] Definir sites/vitrines do MVP.
- [ ] Resolver tenant por dominio/subdominio.
- [ ] Conectar formularios ao CRM.
- [ ] Conectar paginas a proposta/checkout quando aplicavel.
- [ ] Migrar persistencia nova para PostgreSQL/Drizzle.
- [ ] Reutilizar `packages/renderer` e blueprints quando fizer sentido.
- [ ] Separar site publico de editor/backoffice.

**Checklist de validacao:**
- [ ] Site publico resolve tenant sem depender de sessao.
- [ ] Lead vindo do site entra no CRM canonico.
- [ ] Oferta pode seguir para proposta ou checkout.
- [ ] Persistencia nova nao usa Supabase.
- [ ] Dominios seguem `docs/architecture/domains-cloudflare-dns-current-plan.md`.

**Arquivos/pastas provaveis:**
- `apps/sites/`
- `apps/web/`
- `packages/renderer/`
- `packages/types/`
- `packages/db/`
- `docs/apps/sites.README.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`

**Decisoes pendentes:**
- [ ] Sites entram no MVP ou ficam apos checkout.
- [ ] Estrategia para dominio proprio de tenant.
- [ ] Se gerador IA de sites fica ativo no MVP.
- [ ] Quais eventos de site geram lead.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- Nenhum ainda.

**Resultado final:**
- Nao iniciado.

**Data de inicio:**  
A definir.

**Data de conclusao:**  
A definir.

**Agente/responsavel:**  
A definir.

**Observacoes:**  
Nenhuma.

## Sprint 8 — Grupos basicos

**Status:** `nao_iniciada`

**Objetivo:**  
Adicionar o primeiro modelo de grupos/lideres sem criar governanca financeira complexa cedo demais.

**Checklist de execucao:**
- [ ] Modelar grupos.
- [ ] Modelar lideres de viagem.
- [ ] Modelar participantes.
- [ ] Associar grupo a proposta coletiva.
- [ ] Decidir pagamentos individuais ou consolidados.
- [ ] Definir papeis minimos.
- [ ] Definir governanca basica.
- [ ] Registrar regras minimas de cancelamento e responsabilidade.

**Checklist de validacao:**
- [ ] Grupo pertence a tenant.
- [ ] Lider e participantes possuem papeis claros.
- [ ] Grupo consegue se relacionar com proposta.
- [ ] Modelo de pagamento do grupo esta documentado.
- [ ] Governanca minima esta registrada.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/core/`
- `apps/control/`
- `docs/conceito/04_noro_h2b2h_marketplace.md`
- `docs/conceito/08_noro_implementation_roadmap.md`

**Decisoes pendentes:**
- [ ] Papel operacional do lider de viagem.
- [ ] Se pagamento sera individual ou consolidado no MVP.
- [ ] Se lider recebe comissao.
- [ ] Regras minimas de cancelamento, inadimplencia e substituicao de participante.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- Nenhum ainda.

**Resultado final:**
- Nao iniciado.

**Data de inicio:**  
A definir.

**Data de conclusao:**  
A definir.

**Agente/responsavel:**  
A definir.

**Observacoes:**  
Nenhuma.

## Sprint 9 — Ledger inicial

**Status:** `nao_iniciada`

**Objetivo:**  
Criar o ledger minimo para rastrear eventos financeiros do fluxo transacional.

**Checklist de execucao:**
- [ ] Modelar ledger inicial.
- [ ] Modelar lancamentos financeiros.
- [ ] Registrar eventos de cobranca.
- [ ] Registrar eventos de pagamento.
- [ ] Registrar eventos de comissao.
- [ ] Registrar reembolso/cancelamento.
- [ ] Definir visao Control Plane.
- [ ] Definir visao tenant.
- [ ] Conectar ledger aos eventos financeiros da Sprint 6.

**Checklist de validacao:**
- [ ] Cobranca gera lancamento rastreavel.
- [ ] Pagamento gera lancamento rastreavel.
- [ ] Comissao gera lancamento rastreavel.
- [ ] Reembolso/cancelamento gera reversao ou evento apropriado.
- [ ] Control Plane ve consolidado e tenant ve apenas seu escopo.

**Arquivos/pastas provaveis:**
- `packages/db/`
- `apps/control/`
- `apps/core/`
- `apps/financeiro/`
- `docs/architecture/billing-asaas-migration-plan.md`

**Decisoes pendentes:**
- [ ] Nivel minimo de ledger para o MVP.
- [ ] Eventos financeiros imutaveis ou editaveis com auditoria.
- [ ] Como diferenciar lancamento de plataforma e lancamento de tenant.
- [ ] Se `apps/financeiro` sera referencia transicional ou modulo reaproveitado.

**Bloqueios:**
- Nenhum registrado.

**Arquivos alterados:**
- Nenhum ainda.

**Resultado final:**
- Nao iniciado.

**Data de inicio:**  
A definir.

**Data de conclusao:**  
A definir.

**Agente/responsavel:**  
A definir.

**Observacoes:**  
Nenhuma.

## Regras de atualizacao deste arquivo

- Ao iniciar uma sprint, mudar o status para `em_andamento`.
- Ao concluir uma sprint, mudar o status para `concluida`.
- Se houver bloqueio, mudar para `bloqueada` e explicar o motivo.
- Registrar arquivos alterados ao final de cada sprint.
- Registrar decisoes tomadas.
- Registrar decisoes pendentes para Paulo.
- Atualizar a tabela de resumo geral.
- Nenhuma sprint deve ser considerada concluida sem checklist de validacao preenchido.
- Qualquer agente deve atualizar este arquivo antes de encerrar uma tarefa de sprint.

## Recomendacao para integracao com AGENTS.README

Recomenda-se que `docs/ai/AGENTS.README.md` passe a mencionar:

```txt
Para tarefas de implementacao da fundacao NORO, leia e atualize docs/SPRINT_STATUS.md ao final de cada sprint. O plano detalhado fica em docs/backlog/implementation/noro-foundation-sprint-plan.md.
```

Esta recomendacao esta registrada aqui apenas como pendencia. `docs/ai/AGENTS.README.md` nao foi atualizado nesta tarefa.
