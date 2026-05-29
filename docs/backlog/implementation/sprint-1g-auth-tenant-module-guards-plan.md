# Sprint 1G - Plano De Helpers De Auth, Tenant Context, Platform Roles E Module Guards

Data de referencia: 2026-05-27

Status: plano tecnico/documental. Nenhum codigo, schema real, migration, SQL ou acesso a banco foi executado nesta etapa.

Fontes obrigatorias:

- `docs/ai/AGENTS.README.md`
- `docs/SPRINT_STATUS.md`
- `docs/backlog/implementation/noro-foundation-sprint-plan.md`
- `docs/backlog/implementation/sprint-0-alinhamento-documental-decisoes.md`
- `docs/backlog/implementation/sprint-1a-database-readonly-audit.md`
- `docs/backlog/implementation/sprint-1b-local-schema-reference-audit.md`
- `docs/backlog/implementation/sprint-1c-canonical-auth-tenant-schema-map.md`
- `docs/backlog/implementation/sprint-1d-drizzle-schema-plan.md`
- `docs/backlog/implementation/sprint-1e-drizzle-implementation-plan.md`
- `docs/backlog/implementation/sprint-1f-drizzle-files-implementation-report.md`
- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/codebase-unused-legacy-audit.md`
- `scripts/README.md`

## 1. Resumo executivo

Esta Sprint 1G planeja a camada de helpers que deve substituir gradualmente o modelo legado:

```txt
Supabase Auth + auth.uid() + RLS
```

por:

```txt
Logto + identity_links + users + tenant_memberships + platform_role_assignments + tenant_modules + repositories Drizzle
```

Essa camada e necessaria antes de migrar telas, rotas e actions porque ela define uma fronteira unica para autenticacao, usuario interno, tenant ativo, role global, membership de tenant, modulo habilitado e autorizacao de acao.

O plano nao implementa codigo. Ele define contratos, responsabilidades, erros, arquivos sugeridos e criterio para liberar a Sprint 1H. Helpers novos nao devem depender de Supabase, `auth.users`, RLS Supabase, `auth.uid()` ou `.from(...)`.

## 2. Premissas aprovadas

- Logto e o provider de autenticacao vigente.
- `identity_links` resolve provider externo para usuario interno NORO.
- `users` representa perfil interno da aplicacao, nao substituto direto de `auth.users`.
- `tenant_memberships` resolve acesso do usuario ao tenant.
- `platform_role_assignments` resolve acesso ao `/control`.
- `tenant_modules` resolve acesso operacional a modulos.
- `tenant_modules` prevalece sobre `plan_modules`.
- `modules.key` e a chave funcional estavel para validacao.
- Nome visual do modulo nao deve ser usado como permissao.
- `/core` exige tenant ativo e membership ativa.
- `/control` exige role global de plataforma.
- `/sites` futuramente resolve tenant por dominio, subdominio ou slug.
- `tenant_id` vindo do browser nunca e confiavel sozinho.
- Supabase permanece legado/transicional.
- Appwrite permanece eliminado.
- PostgreSQL/Drizzle/Logto sao a direcao vigente.
- Asaas e o gateway financeiro vigente, mas billing/checkout nao entram nesta sprint.

## 3. Contextos de execucao

### `/control`

`/control` e o Control Plane da NORO em `admin.noro.guru`.

Regras:

- usuario precisa estar autenticado via Logto;
- usuario precisa resolver para `noro.users` por `identity_links`;
- usuario precisa ter role global ativa em `platform_role_assignments`;
- pode listar, criar, gerir e suspender tenants conforme role;
- quando operar um tenant especifico, precisa selecionar tenant explicitamente;
- selecao de tenant por admin NORO nao equivale a membership de tenant;
- acoes sensiveis devem gerar `audit_events`;
- platform role nao deve virar acesso automatico invisivel ao `/core`.

Fluxo conceitual:

```txt
requireUser()
  -> requirePlatformRole()
  -> resolvePlatformContext()
  -> selecionar tenant quando necessario
  -> authorize()
  -> repository
```

### `/core`

`/core` e o portal operacional dos tenants em `app.noro.guru`.

Regras:

- usuario precisa estar autenticado via Logto;
- usuario precisa resolver para `noro.users`;
- usuario precisa ter membership ativa no tenant;
- tenant ativo deve vir de sessao/contexto autorizado, nao de parametro solto;
- cada modulo acessado deve validar `requireModuleEnabled()`;
- o usuario so deve ver servicos habilitados para aquele tenant;
- dados operacionais devem ser acessados por repositories escopados por tenant.

Fluxo conceitual:

```txt
requireUser()
  -> resolveTenantContext()
  -> requireTenantMembership()
  -> requireModuleEnabled()
  -> authorize()
  -> repository escopado por tenant_id
```

### `/sites`

`/sites` e a camada publica de sites/vitrines.

Regras:

- visitante pode nao estar autenticado;
- tenant deve ser resolvido por dominio, subdominio ou slug;
- administracao do site nao acontece em `/sites`, acontece em `/core`;
- leads, solicitacoes, compras e eventos vindos do site devem ser vinculados ao tenant resolvido pelo dominio;
- `tenant_id` em query string ou body publico nao deve ser fonte suficiente.

Fluxo conceitual futuro:

```txt
resolveSiteTenantContext()
  -> validar site/dominio publicado
  -> repository publico escopado pelo tenant resolvido
```

## 4. Contrato de `requireUser()`

Finalidade: exigir sessao autenticada e retornar usuario interno ativo da NORO.

Entrada planejada:

- contexto de request/session do framework;
- opcionalmente `db` ou client Drizzle;
- opcionalmente `provider`, default `logto`.

Saida planejada:

```txt
AuthUserContext
- user
- identityLink
- provider
- providerSubject
- claims
```

Responsabilidades:

- ler sessao Logto pelo runtime oficial de `packages/auth`;
- extrair subject estavel do Logto;
- buscar `identity_links` por `provider = logto` e `provider_subject`;
- carregar o `users` relacionado;
- rejeitar usuario sem perfil interno quando a rota exigir perfil canonico;
- rejeitar usuario com status `blocked` ou `archived`;
- retornar contexto suficiente para tenant/platform/module helpers;
- nunca consultar `auth.users`;
- nunca chamar `supabase.auth`.

Erros:

- `UnauthenticatedError` quando nao ha sessao valida;
- `UserNotFoundError` quando existe sessao Logto, mas nao existe `identity_link`/`user` interno;
- `UserBlockedError` quando `users.status` for `blocked` ou `archived`.

Decisao para Sprint 1H:

- definir se usuario Logto sem perfil interno deve criar perfil automaticamente ou bloquear com erro controlado.

## 5. Contrato de `getCurrentUser()`

Finalidade: versao permissiva de `requireUser()`.

Entrada planejada:

- mesmo contexto de request/session de `requireUser()`;
- opcionalmente `db`.

Saida planejada:

- `AuthUserContext` quando ha sessao valida e usuario interno ativo;
- `null` quando nao ha sessao;
- erro apenas para estados inconsistentes que nao devem ser ignorados, como usuario bloqueado em rota que tentou resolver perfil.

Uso recomendado:

- layouts publicos;
- rotas publicas com comportamento opcional para usuario logado;
- `/sites` quando houver area futura de cliente final autenticado;
- navegacao que pode mudar conforme login.

Nao usar:

- actions sensiveis;
- rotas protegidas;
- acesso a dados de tenant;
- operacoes de `/control`.

## 6. Contrato de `resolveTenantContext()`

Finalidade: resolver tenant ativo de forma autorizada.

Entrada planejada:

```txt
ResolveTenantContextInput
- userContext
- source: core | control | sites | webhook
- selectedTenantId?
- selectedTenantSlug?
- host?
- pathTenantSlug?
- requestMetadata?
```

Saida planejada:

```txt
TenantContext
- tenant
- source
- membership?
- selectedByPlatformUser?
- siteContext?
```

Regras por contexto:

- `/core`: tenant deve vir de sessao/contexto de tenant ativo, slug contextual ou selecao persistida, sempre validando membership ativa.
- `/control`: tenant pode ser selecionado explicitamente por admin NORO com platform role; essa selecao deve ser auditavel e nao cria membership.
- `/sites`: tenant deve ser resolvido por dominio, subdominio ou slug publico; nao exige usuario autenticado.
- webhooks futuros: tenant deve ser resolvido por configuracao interna do provider e payload validado, nao por parametro aberto.

Entradas confiaveis:

- claims/sessao validada por Logto;
- membership carregada de `tenant_memberships`;
- platform role carregada de `platform_role_assignments`;
- dominio/subdominio resolvido contra configuracao interna;
- provider/webhook validado por assinatura/token.

Entradas nao confiaveis sozinhas:

- `tenant_id` vindo do browser;
- query string;
- body enviado pelo cliente;
- slug de rota sem validar membership;
- header customizado sem assinatura.

## 7. Contrato de `requireTenantMembership()`

Finalidade: exigir vinculo ativo entre usuario interno e tenant.

Entrada planejada:

```txt
RequireTenantMembershipInput
- userContext
- tenantId
- roles?
- allowPlatformOverride?
- reason?
```

Saida planejada:

```txt
TenantContext
- tenant
- membership
- role
```

Regras:

- membership precisa existir em `tenant_memberships`;
- `membership.status` precisa ser `active`;
- roles aceitas devem ser explicitadas por chamada quando a acao exigir;
- roles de tenant sao diferentes de roles globais de plataforma;
- admin NORO operando tenant pelo `/control` deve usar platform context, nao fingir membership;
- override de plataforma, se existir, deve ser explicito, auditavel e restrito a `/control`.

Roles iniciais de tenant:

- `tenant_owner`;
- `tenant_admin`;
- `tenant_manager`;
- `tenant_agent`;
- `tenant_finance`;
- `tenant_viewer`.

Erros:

- `TenantRequiredError`;
- `TenantAccessDeniedError`;
- `AuthorizationDeniedError` quando role nao for suficiente.

## 8. Contrato de `requirePlatformRole()`

Finalidade: exigir role global ativa para acessar `/control` ou operacoes de plataforma.

Entrada planejada:

```txt
RequirePlatformRoleInput
- userContext
- roles
- reason?
```

Saida planejada:

```txt
PlatformContext
- user
- roles
- matchedRole
```

Roles iniciais de plataforma:

- `platform_owner`;
- `platform_admin`;
- `platform_ops`;
- `platform_finance`;
- `platform_support`.

Regras:

- role precisa existir em `platform_role_assignments`;
- role precisa estar com status `active`;
- `/control` deve exigir platform role;
- platform role nao equivale a tenant role;
- platform role nao deve liberar automaticamente acesso invisivel no `/core`;
- operacoes sensiveis devem gerar `audit_events`.

Erros:

- `PlatformRoleRequiredError`;
- `AuthorizationDeniedError`.

## 9. Contrato de `requireModuleEnabled()`

Finalidade: garantir que um tenant pode acessar um modulo.

Entrada planejada:

```txt
RequireModuleEnabledInput
- tenantContext
- moduleKey
- now?
```

Saida planejada:

```txt
ModuleAccessContext
- module
- tenantModule?
- planModule?
- enabled
- source
- limits
- settings
```

Regras:

- usar `modules.key`, nunca nome visual;
- modulo precisa existir em `modules`;
- modulo com status `future`, `inactive` ou `deprecated` nao deve ser acessivel no `/core`;
- `tenant_modules` e a fonte operacional;
- `tenant_modules` prevalece sobre `plan_modules`;
- `tenant_modules.status` precisa ser `enabled` ou `trial`;
- `tenant_modules.status = suspended` deve negar acesso;
- `starts_at` e `ends_at` devem ser considerados quando presentes;
- se nao houver override em `tenant_modules`, o helper pode consultar `plan_modules` como default, mas deve retornar claramente a fonte efetiva;
- limits/settings efetivos devem combinar plano + override do tenant com regra documentada.

Erros:

- `ModuleNotEnabledError` quando modulo nao esta habilitado;
- `AuthorizationDeniedError` quando modulo existe mas a role do usuario nao permite a acao.

Observacao:

- A Sprint 1F criou `tenantModulesRepository.resolveEffectiveModuleAccess()`. A Sprint 1H deve revisar se essa funcao ja cobre datas, status `future` e merge de `limits/settings`; se nao cobrir, ajustar sem tocar banco.

## 10. Contrato de `authorize()`

Finalidade: helper generico e simples para validar acoes.

Entrada planejada:

```txt
AuthorizeInput
- userContext
- platformContext?
- tenantContext?
- moduleContext?
- action
- resource?
- resourceTenantId?
```

Saida planejada:

```txt
AuthorizationResult
- allowed
- reason?
- matchedRule?
```

Regras:

- combinar autenticacao, tenant, role, modulo e ownership do recurso;
- evitar overengineering no MVP;
- usar mapa simples de acoes por role;
- manter permissoes complexas fora do escopo inicial;
- chamar antes de repositories sensiveis;
- repositories ainda devem receber escopo explicito, mesmo quando `authorize()` passar.

Acoes minimas sugeridas no inicio:

- `platform:tenants:read`;
- `platform:tenants:write`;
- `platform:modules:manage`;
- `platform:billing:read`;
- `platform:billing:write`;
- `tenant:crm:read`;
- `tenant:crm:write`;
- `tenant:settings:read`;
- `tenant:settings:write`;
- `tenant:finance:read`;
- `tenant:finance:write`;
- `tenant:proposals:read`;
- `tenant:proposals:write`;
- `tenant:sites:read`;
- `tenant:sites:write`.

Limite do MVP:

- nao criar motor RBAC/ABAC completo agora;
- nao criar tabela de permissoes detalhadas nesta sprint;
- nao misturar authorization helper com UI visibility helper.

## 11. Arquitetura de arquivos sugerida

Estado atual:

```txt
packages/auth/
  index.ts
  package.json
```

Estrutura sugerida para Sprint 1H:

```txt
packages/auth/
  context/
    user-context.ts
    tenant-context.ts
    platform-context.ts
    module-context.ts
    site-tenant-context.ts
    authorization.ts
  errors.ts
  types.ts
  index.ts
```

Responsabilidades:

- `user-context.ts`: `requireUser()`, `getCurrentUser()`, leitura de sessao Logto e resolucao de `identity_links`.
- `tenant-context.ts`: `resolveTenantContext()`, `requireTenantMembership()`, `assertTenantAccess()`.
- `platform-context.ts`: `resolvePlatformContext()`, `requirePlatformRole()`, `assertPlatformAccess()`.
- `module-context.ts`: `requireModuleEnabled()` e composicao com `tenantModulesRepository`.
- `site-tenant-context.ts`: contrato futuro de `resolveSiteTenantContext()`, inicialmente pode ficar planejado ou stubado somente se aprovado.
- `authorization.ts`: `authorize()` e matriz inicial de acoes.
- `errors.ts`: erros tipados da camada de auth/context.
- `types.ts`: tipos compartilhados de contexto.
- `index.ts`: exports publicos do pacote.

Observacao:

- Se a Sprint 1H identificar necessidade de adapter por framework Next.js, criar uma camada pequena e explicita, sem acoplar helpers de dominio diretamente a componentes React.

## 12. Dependencias com repositories

Repositories criados na Sprint 1F e uso planejado:

| Repository | Uso nos helpers |
| --- | --- |
| `authIdentityRepository` | Resolver `provider + subject` para `identity_link` e `user`. |
| `usersRepository` | Buscar usuario interno e validar status quando necessario. |
| `tenantsRepository` | Buscar tenant por `id` ou `slug`, validar status. |
| `membershipsRepository` | Validar membership ativa, role e tenants do usuario. |
| `platformRolesRepository` | Validar roles globais para `/control`. |
| `tenantModulesRepository` | Resolver acesso efetivo a modulo por tenant. |
| `modulesRepository` | Validar existencia/status de modulo por `modules.key`, quando necessario. |

Dependencia permitida:

```txt
packages/auth -> packages/db repositories
```

Dependencias proibidas:

- `packages/auth -> @supabase/*`;
- `packages/auth -> apps/control/lib/supabase*`;
- `packages/auth -> auth.users`;
- `packages/auth -> supabase/migrations`.

## 13. Tipos e erros planejados

Tipos planejados:

```txt
AuthUserContext
- user
- identityLink
- provider
- providerSubject
- claims

TenantContext
- tenant
- membership?
- source
- selectedByPlatformUser?

PlatformContext
- user
- roles
- matchedRole?

ModuleAccessContext
- module
- tenantModule?
- planModule?
- enabled
- source
- limits
- settings

AuthorizationResult
- allowed
- reason?
- matchedRule?
```

Erros planejados:

- `UnauthenticatedError`;
- `UserNotFoundError`;
- `UserBlockedError`;
- `TenantRequiredError`;
- `TenantAccessDeniedError`;
- `PlatformRoleRequiredError`;
- `ModuleNotEnabledError`;
- `AuthorizationDeniedError`.

Regras de erro:

- erros devem ser seguros para log interno;
- mensagens exibidas ao usuario devem ser controladas no app;
- nao vazar IDs sensiveis, tokens, claims completas ou detalhes de provider em resposta publica.

## 14. Estrategia de integracao gradual

Sequencia recomendada depois da aprovacao deste plano:

1. Implementar helpers em `packages/auth`, sem migrar telas.
2. Validar helpers com repositories criados na Sprint 1F, sem tocar banco real.
3. Definir adapter de sessao Logto para Next.js.
4. Migrar login/layout de `/control` em sprint propria.
5. Migrar tenant context de `/core` em sprint propria.
6. Migrar modulos especificos para `requireModuleEnabled()` por dominio.
7. Manter Supabase runtime legado apenas onde ainda nao migrado.
8. Remover Supabase somente depois de cobertura suficiente e validacao dos apps.

Ritmo recomendado:

- primeiro `/control`, porque platform role e governanca desbloqueiam operacao;
- depois `/core`, porque tenant context e modulo habilitado protegem operacao do tenant;
- depois `/sites`, quando sites estiverem conectados ao funil canonico.

## 15. O que nao fazer agora

- Nao migrar telas ainda.
- Nao remover Supabase.
- Nao alterar login real ainda.
- Nao aplicar migrations.
- Nao gerar migrations.
- Nao acessar banco da VPS.
- Nao implementar checkout.
- Nao implementar billing.
- Nao implementar sites.
- Nao implementar CRM.
- Nao criar arquivos `.ts` nesta sprint documental.
- Nao instalar SDK Logto ou qualquer dependencia sem aprovacao.
- Nao criar permissoes complexas demais antes do MVP.

## 16. Criterios para liberar Sprint 1H

A Sprint 1H so pode comecar se:

- este plano for aprovado;
- os arquivos criados na Sprint 1F estiverem validos;
- nao houver pendencia critica de schema para os helpers;
- estiver claro que helpers podem ser implementados sem mexer no banco;
- estiver claro que integracao em apps vira depois;
- estiver claro que Supabase nao sera removido ainda;
- estiver claro que nenhuma migration sera rodada;
- Paulo aprovar a criacao de arquivos em `packages/auth`;
- for decidido como a sessao Logto sera lida no runtime Next.js sem instalar dependencia nao aprovada.

## 17. Proximo passo recomendado

Proxima sprint:

```txt
Sprint 1H - Implementar helpers de auth, tenant context, platform roles e module guards
```

Regras para Sprint 1H:

- pode criar arquivos em `packages/auth`;
- pode ajustar exports de `packages/auth/index.ts`;
- pode usar repositories de `packages/db` criados na Sprint 1F;
- nao pode migrar telas ainda sem sprint propria;
- nao pode remover Supabase ainda;
- nao pode tocar no banco;
- nao pode rodar migrations;
- nao pode instalar dependencias sem aprovacao explicita;
- nao pode usar `auth.users`, RLS Supabase ou `auth.uid()`;
- nao pode importar Supabase em helpers novos.

Estado final esperado da Sprint 1G: plano de helpers documentado, Sprint 1 ainda em andamento, migrations bloqueadas, banco nao acessado e nenhuma implementacao criada.
