# Sprint 1C - Mapa Canonico De Auth, Tenants, Memberships E Roles

Data de referencia: 2026-05-27

Status: desenho tecnico/documental. Nenhuma migration deve ser rodada a partir deste documento sem aprovacao explicita.

Fontes principais:

- `docs/backlog/implementation/sprint-1a-database-readonly-audit.md`
- `docs/backlog/implementation/sprint-1b-local-schema-reference-audit.md`
- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/backlog/implementation/sprint-0-alinhamento-documental-decisoes.md`

## 1. Resumo executivo

O modelo canonico recomendado para a fundacao NORO separa identidade externa, perfil interno, tenants, memberships e roles.

Recomendacao central:

- Logto deve ser o provedor de autenticacao vigente.
- PostgreSQL/Drizzle deve ser a fonte de dados operacional da aplicacao.
- `users` deve representar o perfil interno NORO, independente do provider de auth.
- `identity_links` deve vincular `users` a providers como `logto` e, temporariamente, `supabase`.
- `tenants` deve representar agencias/empresas que usam a NORO.
- `tenant_memberships` deve representar acesso de usuarios aos tenants.
- roles de plataforma devem ser separadas das roles de tenant.

Os modelos legados encontrados na Sprint 1A e Sprint 1B nao devem ser usados diretamente como canonicos novos:

- `auth.users`;
- `public.users`;
- `public.tenants`;
- `public.user_tenants`;
- `cp.tenants`;
- `cp.user_tenant_roles`;
- migrations Supabase com RLS/policies.

Havera ponte com legado por mapeamento explicito, principalmente via `identity_links.legacy_supabase_user_id` e mapeamentos controlados de tenants/memberships. Dados legados podem ser fonte de migracao, mas nao devem mandar no novo modelo.

Migrations continuam proibidas ate que este mapa seja aprovado, exista decisao sobre schema PostgreSQL canonico, haja backup/dump do banco atual e exista ambiente dev/staging isolado.

## 2. Principios do modelo canonico

- Logto e o provedor de autenticacao vigente.
- PostgreSQL/Drizzle e a fonte de dados da aplicacao.
- Supabase Auth e legado/transicional.
- `auth.users` nao e tabela canonica nova.
- Todo dado operacional deve ter escopo claro de tenant ou plataforma.
- `/control` e `/core` compartilham a mesma base canonica, mas operam contextos diferentes.
- `/control` opera a plataforma NORO, tenants, billing SaaS, financeiro da NORO, suporte e governanca.
- `/core` opera o dia a dia dos tenants: clientes finais, leads, produtos, fornecedores, propostas, checkout e financeiro operacional.
- Autorizacao deve ocorrer na aplicacao/repository layer, nao por copia de RLS/policies Supabase.
- `tenant_id` vindo do cliente nunca deve ser suficiente sozinho.
- Codigo novo deve resolver usuario, tenant e permissao antes de acessar dados sensiveis.

Fluxo conceitual recomendado:

```txt
Route/Action
  -> requireUser()
  -> resolveTenantContext()
  -> authorize()
  -> repository com escopo explicito
```

## 3. Modelos legados avaliados

| Objeto legado | Origem | Uso atual | Risco | Decisao recomendada |
| --- | --- | --- | --- | --- |
| `auth.users` | Supabase Auth | Presente no banco real e referenciado por migrations antigas | Prender o novo modelo ao Supabase Auth | Nao usar como canonico; preservar apenas como origem de migracao/ponte |
| `public.users` | Modelo historico em `public` | Aparece no banco e em SQLs legados | Duplicar identidade interna e provider auth | Avaliar para migracao; novo canonico deve ser redesenhado |
| `public.tenants` | Modelo historico em `public` | Aparece no banco e em referencias locais | Conflitar com `cp.tenants` e com novo modelo | Usar apenas como fonte candidata de migracao, apos comparacao |
| `public.user_tenants` | Membership legado | Aparece no banco e em SQLs/migrations | Roles e status podem estar normalizados de forma insuficiente | Migrar conceitualmente para `tenant_memberships`, nao reaproveitar sem revisao |
| `cp.tenants` | Modelo Control Plane | Aparece no banco real | Pode representar conceito mais atual, mas ainda nao e canonico aprovado | Forte candidato a fonte inicial de migracao; requer aprovacao |
| `cp.user_tenant_roles` | Roles/memberships Control Plane | Aparece no banco real | Misturar role global, role de tenant e permissao operacional | Usar como referencia de migracao, normalizando para memberships/roles |
| Migrations Supabase com RLS | `supabase/migrations/` | Historico congelado | Rodar SQL antigo ou copiar RLS/policies para o novo modelo | Nao executar; nao copiar RLS; usar apenas como evidencia historica |
| `packages/lib/supabase/*` | Runtime transicional | Cliente/helper Supabase ainda usado por apps | Novos fluxos herdarem Supabase Client | Migrar consumidores para `packages/db` e `packages/auth` |
| `apps/control/lib/supabase*` | Runtime transicional do Control | Login/layout/actions ainda dependem de Supabase | Bloquear Logto como runtime oficial | Substituir em sprint de auth; nao usar em codigo novo |
| `apps/control/hooks/useTenant.ts` | Resolver tenant legado | Resolucao de tenant baseada no modelo atual/transicional | Confiar em fonte antiga ou parametros insuficientes | Substituir por `resolveTenantContext()` com membership canonica |

## 4. Modelo canonico recomendado

### `users`

Representa o perfil interno da NORO, independente do provider de auth.

Campos sugeridos:

- `id`;
- `display_name`;
- `email`;
- `phone`;
- `avatar_url`;
- `status`;
- `created_at`;
- `updated_at`.

Observacoes:

- Nao usar como substituto direto de `auth.users`.
- `email` deve ajudar reconciliacao, mas o vinculo forte com auth externa deve ficar em `identity_links`.
- `status` deve permitir pelo menos `active`, `invited`, `blocked` e `archived`, com nomes finais a aprovar.

### `identity_links`

Representa vinculos entre usuarios internos e provedores de autenticacao.

Campos sugeridos:

- `id`;
- `user_id`;
- `provider`;
- `provider_subject`;
- `provider_email`;
- `legacy_supabase_user_id`;
- `metadata`;
- `created_at`;
- `updated_at`.

Provider inicial:

- `logto`.

Provider legado possivel:

- `supabase`.

Regras recomendadas:

- `provider` + `provider_subject` deve ser unico.
- `legacy_supabase_user_id` deve existir apenas como ponte de migracao.
- O codigo novo deve resolver o usuario pelo subject Logto.
- Dados sensiveis de auth nao devem ser duplicados aqui.

### `tenants`

Representa empresas, agencias ou organizacoes que usam a NORO.

Campos sugeridos:

- `id`;
- `name`;
- `slug`;
- `legal_name`;
- `document`;
- `email`;
- `phone`;
- `status`;
- `plan_id`;
- `billing_status`;
- `created_at`;
- `updated_at`.

Observacoes:

- `tenants` sustenta `/core` e tambem e gerenciado por `/control`.
- `slug` deve ser unico no escopo definido.
- `status` e `billing_status` devem separar operacao e cobranca.

### `tenant_memberships`

Representa vinculo entre usuario e tenant.

Campos sugeridos:

- `id`;
- `tenant_id`;
- `user_id`;
- `role`;
- `status`;
- `invited_by_user_id`;
- `joined_at`;
- `created_at`;
- `updated_at`.

Regras recomendadas:

- `tenant_id` + `user_id` deve ser unico para membership ativa.
- Membership deve ser validada antes de acessar recursos de tenant.
- Usuarios de plataforma podem operar tenants pelo `/control`, mas isso deve passar por role global e auditoria.

### Roles de plataforma

Recomendacao: criar uma tabela de atribuicao de roles de plataforma, por exemplo `platform_role_assignments`, em vez de colocar uma role global unica dentro de `users`.

Motivos:

- permite multiplos papeis globais;
- permite status e auditoria;
- evita misturar usuario NORO com membership de tenant;
- facilita suporte, financeiro e operacao interna.

Campos sugeridos:

- `id`;
- `user_id`;
- `role`;
- `status`;
- `created_at`;
- `updated_at`.

Roles minimas sugeridas:

- `platform_owner`;
- `platform_admin`;
- `platform_ops`;
- `platform_finance`;
- `platform_support`.

### Tenant roles

Recomendacao inicial: usar `tenant_memberships.role` com valores controlados. Uma tabela de permissoes detalhada pode vir depois, se a matriz crescer.

Roles minimas sugeridas:

- `tenant_owner`;
- `tenant_admin`;
- `tenant_manager`;
- `tenant_agent`;
- `tenant_finance`;
- `tenant_viewer`.

## 5. Separacao `/control` vs `/core`

O mesmo modelo canonico sustenta dois contextos diferentes.

### `/control`

`/control` e o Control Plane da NORO em `admin.noro.guru`.

Deve permitir:

- usuarios da equipe NORO;
- CRM da NORO;
- gestao de tenants;
- onboarding de tenants;
- gestao de planos;
- billing SaaS da NORO;
- financeiro da plataforma;
- taxas NORO;
- suporte aos tenants;
- governanca;
- configuracoes globais.

Autorizacao principal:

- sessao Logto;
- `users`;
- `identity_links`;
- `platform_role_assignments`;
- selecao explicita de tenant quando um admin NORO operar dados de tenant;
- auditoria para operacoes sensiveis.

### `/core`

`/core` e o portal operacional dos tenants em `app.noro.guru`.

Deve permitir:

- usuarios vinculados a tenants;
- CRM dos clientes finais;
- leads;
- clientes/passageiros;
- produtos;
- fornecedores;
- propostas;
- quote builder;
- financeiro do tenant;
- checkout dos clientes finais;
- comissoes internas;
- recebiveis.

Autorizacao principal:

- sessao Logto;
- `users`;
- `identity_links`;
- `tenant_memberships`;
- role de tenant;
- `tenant_id` obrigatorio nos recursos operacionais.

## 6. Resolucao de tenant

Regra recomendada:

- No `/core`, resolver tenant por sessao + membership.
- No `/control`, resolver tenant por selecao explicita quando admin NORO estiver operando um tenant.
- Em sites publicos, futuramente resolver por dominio/subdominio.
- Nunca resolver acesso apenas por parametro solto sem autorizacao.

Helpers futuros:

```txt
resolveTenantContext()
requireTenantMembership()
authorize()
```

Responsabilidades:

- `resolveTenantContext()` resolve o tenant ativo a partir de sessao, rota, dominio ou contexto administrativo.
- `requireTenantMembership()` garante que o usuario possui membership ativa no tenant.
- `authorize()` valida role/permissao antes da chamada ao repository.

Regras:

- `tenant_id` recebido do browser nao e confiavel sozinho.
- Admin NORO pode selecionar tenant, mas a operacao deve ser auditavel.
- Webhooks devem resolver tenant por configuracao interna do provider e payload validado, nao por parametro aberto.

## 7. Estrategia de ponte com legado

O legado deve ser preservado como fonte de migracao, nao como fonte canonica.

Ponte recomendada:

- `identity_links.legacy_supabase_user_id` preserva o vinculo com Supabase Auth.
- `identity_links.provider = 'supabase'` pode ser usado temporariamente para reconciliacao.
- `public.users` pode ajudar a preencher `users`, se os dados forem consistentes.
- `public.tenants` e `cp.tenants` devem ser comparados antes de escolher fonte inicial de migracao.
- `public.user_tenants` e `cp.user_tenant_roles` devem ser normalizados para `tenant_memberships` e roles.
- Scripts/migrations antigas devem ser lidos como evidencia, nao executados.

Regras:

- O ID do Supabase nao deve virar ID canonico novo.
- `auth.users` nao deve receber novas FKs.
- RLS/policies Supabase nao devem ser copiadas para o modelo novo.
- Dados legados devem passar por plano de migracao revisado, com backup e ambiente isolado.

## 8. Estrategia de schemas PostgreSQL

Opcoes avaliadas:

| Opcao | Pros | Contras | Recomendacao |
| --- | --- | --- | --- |
| `public` | Simples; padrao de muitas ferramentas | Ja contem modelos historicos e risco de confusao com legado Supabase | Evitar para o canonico inicial, salvo decisao explicita |
| `cp` | Ja aparece no banco e parece ligado ao Control Plane | Pode misturar Control Plane antigo com modelo compartilhado `/control` + `/core` | Usar como fonte de migracao candidata, nao como destino canonico automatico |
| Novo schema `noro` | Isola o modelo novo; reduz colisao com legado; deixa claro o que e Drizzle canonico | Exige decisao, grants e convencao nova | Recomendado |
| Novo schema `app` ou `core` | Tambem isola modelo novo | `core` pode confundir com app `/core`; `app` e generico demais | Possivel, mas menos claro que `noro` |

Recomendacao tecnica: criar o modelo canonico em um novo schema PostgreSQL chamado `noro`, controlado por Drizzle, apos aprovacao.

Racional:

- evita tratar `public` como limpo;
- evita transformar `cp` em fonte canonica sem decisao;
- separa objetos novos dos residuos Supabase;
- facilita auditoria de quais tabelas pertencem ao modelo fundacional.

Esta recomendacao ainda nao autoriza migration.

## 9. Estrategia Drizzle

Organizacao sugerida em `packages/db`:

```txt
packages/db/schema/users.ts
packages/db/schema/identity-links.ts
packages/db/schema/tenants.ts
packages/db/schema/memberships.ts
packages/db/schema/roles.ts
packages/db/schema/index.ts
```

Repositories futuros sugeridos:

```txt
packages/db/repositories/usersRepository.ts
packages/db/repositories/authIdentityRepository.ts
packages/db/repositories/tenantsRepository.ts
packages/db/repositories/membershipsRepository.ts
packages/db/repositories/platformRolesRepository.ts
```

Padrao de uso desejado:

```txt
packages/auth
  -> resolve sessao Logto

packages/db repositories
  -> resolvem usuario interno, identity link, tenant, membership e permissao

apps/control e apps/core
  -> chamam helpers e repositories, sem Supabase Client em codigo novo
```

O proximo documento deve detalhar arquivos, tabelas Drizzle, constraints, enums/valores e ordem de criacao, ainda sem aplicar migration.

## 10. Regras anti-Supabase para codigo novo

- Nao importar `@supabase/*` em codigo novo.
- Nao usar `supabase.auth` em codigo novo.
- Nao criar FK para `auth.users`.
- Nao copiar `CREATE POLICY`/RLS de migrations Supabase.
- Nao usar `auth.uid()`.
- Nao executar scripts em `supabase/migrations`.
- Nao usar `.from(...)` Supabase em novos repositories.
- Nao tratar `public.users`, `public.tenants` ou `public.user_tenants` como canonicos sem plano de migracao.
- Nao usar `apps/control/lib/supabase*` como base para novos modulos.
- Nao usar `apps/control/hooks/useTenant.ts` como modelo final de tenant context.

## 11. Criterio para permitir migrations futuras

Antes de criar ou aplicar migration real, precisa existir:

- aprovacao deste mapa pelo Paulo;
- decisao do schema PostgreSQL canonico;
- backup/dump do banco atual;
- banco dev/staging isolado;
- `drizzle.config` revisado;
- schema Drizzle planejado em documento proprio;
- migration gerada, mas nao aplicada automaticamente;
- plano de rollback;
- validacao contra modelos legados duplicados;
- decisao sobre fonte inicial de migracao de tenants;
- revisao explicita para garantir que nenhuma migration Supabase sera executada.

Sem esses itens, migrations continuam bloqueadas.

## 12. Decisoes pendentes para Paulo

- [ ] Aprovar o schema PostgreSQL canonico recomendado: `noro`, `public`, `cp` ou outro.
- [ ] Aprovar `identity_links` como ponte entre `users` e providers de auth, em vez de campos diretos em `users`.
- [ ] Aprovar roles de plataforma em tabela de atribuicao, por exemplo `platform_role_assignments`.
- [ ] Aprovar roles de tenant como valores controlados em `tenant_memberships.role` no MVP.
- [ ] Confirmar banco dev/staging isolado como obrigatorio antes da primeira migration.
- [ ] Definir se `cp.tenants`, `public.tenants` ou outra fonte sera base inicial de migracao de tenants.
- [ ] Definir se usuarios internos NORO podem ter apenas role global de plataforma, sem membership de tenant.
- [ ] Confirmar nomes finais de status para usuarios, tenants e memberships.

## 13. Proximo passo recomendado

Proximo documento/tarefa:

```txt
docs/backlog/implementation/sprint-1d-drizzle-schema-plan.md
```

Objetivo do Sprint 1D:

- transformar este mapa canonico aprovado em plano de arquivos Drizzle;
- detalhar tabelas, campos, constraints, indexes e relations;
- propor repositories e helpers;
- manter migrations bloqueadas ate aprovacao final, backup/dump e ambiente dev/staging.

Estado final desta etapa: desenho canonico proposto, sem alteracao de codigo, sem alteracao de schema e sem migration.
