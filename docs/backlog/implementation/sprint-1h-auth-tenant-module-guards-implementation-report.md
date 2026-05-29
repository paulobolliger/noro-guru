# Sprint 1H - Relatorio De Implementacao Dos Helpers De Auth, Tenant E Modulos

Data de referencia: 2026-05-27

Status: implementacao local concluida. Nenhum app foi migrado. Nenhum banco foi acessado ou alterado.

## 1. Resumo executivo

A Sprint 1H criou a primeira versao dos helpers de autenticacao, tenant context, platform roles, module guards e autorizacao em `packages/auth`, conforme o plano `docs/backlog/implementation/sprint-1g-auth-tenant-module-guards-plan.md`.

Escopo implementado:

- erros tipados seguros;
- tipos de contexto;
- `requireUser()` e `getCurrentUser()`;
- `resolveTenantContext()`, `requireTenantMembership()` e `assertTenantAccess()`;
- `resolvePlatformContext()`, `requirePlatformRole()` e `assertPlatformAccess()`;
- `requireModuleEnabled()`;
- `resolveSiteTenantContext()` como stub seguro;
- `authorize()` com matriz simples de acoes e roles.

Nao foi migrada nenhuma tela, rota, action, layout ou login real dos apps. Supabase runtime transicional nao foi removido. Nenhuma migration foi gerada ou aplicada. Banco nao foi acessado.

## 2. Arquivos criados

- `packages/auth/errors.ts`
- `packages/auth/types.ts`
- `packages/auth/context/user-context.ts`
- `packages/auth/context/tenant-context.ts`
- `packages/auth/context/platform-context.ts`
- `packages/auth/context/module-context.ts`
- `packages/auth/context/site-tenant-context.ts`
- `packages/auth/context/authorization.ts`

## 3. Arquivos ajustados

- `packages/auth/index.ts`
- `packages/auth/package.json`
- `docs/SPRINT_STATUS.md`

Observacao: `packages/auth/package.json` passou a declarar a dependencia interna `@noro/db`, pois os helpers usam os repositories criados na Sprint 1F. Nenhuma dependencia externa foi instalada.

## 4. Correcao sobre Logto

Verificacao realizada:

- nao ha SDK Logto instalado no monorepo;
- nao ha helper/runtime Logto pronto alem de `packages/auth/index.ts`;
- ja existe configuracao Logto por envs `LOGTO_*` em `packages/auth/index.ts`;
- `turbo.json` tambem lista variaveis `LOGTO_*`.

Decisao implementada:

- foi usado o padrao existente de configuracao `getAuthRuntimeConfig()`;
- foi criado um adapter/stub seguro em `user-context.ts`;
- `requireUser()` aceita `claims` ou `sessionAdapter` explicitamente;
- quando nao houver claims/sessao, retorna erro controlado `UnauthenticatedError`;
- a leitura real de sessao Logto via SDK/runtime Next.js ficou como TODO documentado;
- nenhuma dependencia foi instalada;
- login real dos apps nao foi alterado.

## 5. Helpers implementados

| Helper | Status | Observacao |
| --- | --- | --- |
| `requireUser()` | parcial | Resolve claims/adapters explicitos, busca `identity_links` e valida `users`; falta adapter real Logto/Next.js. |
| `getCurrentUser()` | parcial | Versao permissiva de `requireUser()`. |
| `resolveTenantContext()` | parcial | Suporta contexto `/core` e `/control`; `/sites` fica para helper dedicado futuro. |
| `requireTenantMembership()` | implementado | Valida membership ativa e roles opcionais via repository. |
| `assertTenantAccess()` | implementado | Alias seguro de `requireTenantMembership()`. |
| `resolvePlatformContext()` | implementado | Usa `requirePlatformRole()`. |
| `requirePlatformRole()` | implementado | Valida role global ativa via repository. |
| `assertPlatformAccess()` | implementado | Alias seguro de `requirePlatformRole()`. |
| `requireModuleEnabled()` | parcial | Usa `tenantModulesRepository`, valida modulo ativo, status e janela de datas; merge de limites/settings segue simples. |
| `resolveSiteTenantContext()` | stub seguro | Lanca erro controlado ate existir runtime de dominios/sites. |
| `authorize()` | implementado | Matriz MVP simples de acoes por role, sem motor RBAC/ABAC complexo. |

## 6. Validacao

Comandos executados:

```txt
rg -n "logto|LOGTO|@logto|AuthProvider|getAuthRuntimeConfig" -g '!node_modules' -g '!**/.next/**' -g '!dist' -g '!build' .
Get-Content -Path packages/auth/index.ts
Get-Content -Path packages/auth/package.json
Get-Content -Path package.json
Get-Content -Path packages/db/repositories/index.ts
Get-Content -Path packages/db/index.ts
.\node_modules\.bin\tsc.cmd --noEmit --skipLibCheck --moduleResolution node --module esnext --target es2020 --esModuleInterop packages/auth/index.ts packages/auth/types.ts packages/auth/errors.ts packages/auth/context/user-context.ts packages/auth/context/tenant-context.ts packages/auth/context/platform-context.ts packages/auth/context/module-context.ts packages/auth/context/site-tenant-context.ts packages/auth/context/authorization.ts
rg -n "@supabase|supabase\.auth|auth\.users|auth\.uid|\.from\(|Appwrite|node-appwrite|CREATE TABLE|ALTER TABLE|DROP TABLE|CREATE POLICY|ENABLE ROW LEVEL SECURITY" packages/auth
```

Resultado:

- TypeScript direcionado: passou.
- Varredura local de `packages/auth`: sem ocorrencias proibidas.

`lint` global nao foi executado porque o projeto expoe apenas `turbo lint`, que varre multiplos apps e nao era necessario para validar estes arquivos isolados.

## 7. Seguranca

Confirmacoes:

- nenhum import Supabase;
- nenhum uso de `.from(...)`;
- nenhum uso de `auth.users`;
- nenhum uso de `auth.uid()`;
- nenhum uso de RLS Supabase;
- nenhum Appwrite reintroduzido;
- nenhuma migration gerada;
- nenhuma migration aplicada;
- nenhum SQL executado;
- nenhum acesso ao banco;
- nenhum app migrado;
- nenhuma dependencia instalada.

## 8. Proximos passos

Proxima sprint recomendada:

```txt
Sprint 1I - Adapter Logto/Next.js e validacao dos helpers sem migrar telas
```

Escopo recomendado:

- escolher SDK/runtime Logto apropriado para Next.js;
- instalar dependencia somente se Paulo aprovar;
- implementar adapter real de sessao para `requireUser()`;
- manter login atual dos apps intocado ate sprint propria;
- validar helpers com testes ou fixtures, sem acessar banco da VPS;
- preparar plano separado para migrar `/control` login/layout depois.
