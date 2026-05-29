# Sprint 1I - Relatorio De Adapter Logto/Next.js E Validacao Dos Helpers

Data de referencia: 2026-05-27

Status: implementacao local concluida. Nenhum app foi migrado. Nenhum banco foi acessado ou alterado. Nenhuma dependencia foi instalada.

---

## 1. Resumo executivo

A Sprint 1I investigou o estado atual de Logto no projeto, definiu o contrato oficial do adapter de sessao e implementou um adapter/stub seguro em `packages/auth/adapters/`.

O que foi investigado:

- presenca de SDK Logto nos `package.json` de todos os apps e pacotes;
- envs `LOGTO_*` em `apps/control/.env.local`, `apps/core/.env.local`, `apps/core/.env.example` e `turbo.json`;
- helper `getAuthRuntimeConfig()` em `packages/auth/index.ts`;
- middleware dos apps (`apps/control/middleware.ts`);
- login atual de `apps/control` e `apps/core` (baseado em Supabase Auth);
- estado dos helpers criados na Sprint 1H.

O que foi implementado:

- `packages/auth/adapters/logto-session-adapter.ts` — adapter/stub com contrato oficial e comentarios de integracao futura;
- `packages/auth/adapters/index.ts` — barrel export;
- ajuste de `packages/auth/types.ts` — campo `picture` adicionado ao `AuthClaims` para alinhar ao contrato do adapter;
- ajuste de `packages/auth/index.ts` — exportacao do novo modulo `adapters`.

Confirmacoes:

- nenhum SDK Logto foi instalado;
- nenhum app foi migrado;
- login atual de `apps/control` e `apps/core` permanece intacto (Supabase Auth).

---

## 2. Estado atual de Logto no projeto

### Envs LOGTO_* encontradas

| Arquivo | Variaveis |
| --- | --- |
| `apps/control/.env.local` | `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_ENDPOINT`, `LOGTO_COOKIE_SECRET` |
| `apps/core/.env.local` | `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_ENDPOINT`, `LOGTO_COOKIE_SECRET` |
| `apps/core/.env.example` | `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_ENDPOINT`, `LOGTO_COOKIE_SECRET` |
| `turbo.json` | `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_COOKIE_SECRET`, `NEXT_PUBLIC_LOGTO_ENDPOINT` |

Endpoint configurado: `https://auth.norotec.cloud` — servidor Logto da VPS ja em operacao.

### Arquivos relacionados a Logto

| Arquivo | Descricao |
| --- | --- |
| `packages/auth/index.ts` | `getAuthRuntimeConfig()` le as envs `LOGTO_*` e retorna config tipada |
| `packages/auth/types.ts` | `AuthProvider = 'logto'`; `AuthClaims` com `subject` e campos de identidade |
| `packages/auth/context/user-context.ts` | `requireUser()` usa `provider ?? 'logto'`; adapter real ficou como TODO |
| `turbo.json` | variaveis `LOGTO_*` declaradas para propagacao nos builds |

### SDK instalado?

Nao. Nenhum pacote `@logto/*` esta presente em:

- `package.json` (raiz)
- `apps/control/package.json`
- `apps/core/package.json`
- `packages/auth/package.json`

### Helper/config existente

Existe `getAuthRuntimeConfig()` em `packages/auth/index.ts` que le as envs e retorna um objeto tipado (`AuthRuntimeConfig`). Nao e um SDK — e apenas uma leitura de configuracao.

### Login atual

Os apps `apps/control` e `apps/core` usam Supabase Auth como runtime real de sessao (ver `apps/control/app/login/page.tsx`). Nenhuma rota ou middleware chama SDK Logto hoje.

### Lacunas

- SDK Logto nao esta instalado — integracao real de sessao exige aprovacao e instalacao de `@logto/next` ou equivalente;
- `apps/control/middleware.ts` nao protege rotas por sessao Logto (apenas redireciona `/admin`);
- `requireUser()` nao tem adapter real: sem `claims` explicitas ou SDK, retorna `UnauthenticatedError`.

---

## 3. Adapter definido

### Contrato oficial

```typescript
// packages/auth/adapters/logto-session-adapter.ts

export type LogtoSessionClaims = {
  provider: 'logto';
  providerSubject: string;    // Logto `sub` => identity_links.provider_subject
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  rawClaims?: unknown;
};

export const logtoSessionAdapter: AuthSessionAdapter =
  (): Promise<LogtoSessionClaims | null> => readLogtoSession();
```

### Como `providerSubject` sera lido

Quando o SDK `@logto/next` for instalado, `readLogtoSession()` usara:

```typescript
import { getLogtoContext } from '@logto/next/server-actions';
const ctx = await getLogtoContext(logtoConfig);
if (!ctx.isAuthenticated) return null;
return {
  provider: 'logto',
  providerSubject: ctx.claims.sub,   // <-- claim padrao OpenID Connect
  email: ctx.claims.email,
  name: ctx.claims.name,
  picture: ctx.claims.picture,
  rawClaims: ctx.claims,
};
```

O `sub` do Logto e um UUID gerado pelo servidor Logto. Ele nao muda para um mesmo usuario. Deve ser indexado em `identity_links.provider_subject` com `(provider, provider_subject)` como chave unica.

### Claims minimas necessarias

| Claim | Obrigatoria | Campo destino |
| --- | --- | --- |
| `sub` | sim | `identity_links.provider_subject` |
| `email` | recomendada | `identity_links.provider_email` / `users.email` |
| `name` | opcional | `users.display_name` |
| `picture` | opcional | uso futuro |

### Conexao com `requireUser()`

```typescript
// Uso apos SDK instalado:
const userCtx = await requireUser({ db, sessionAdapter: logtoSessionAdapter });

// Para testes sem SDK (claims explicitas):
const userCtx = await requireUser({
  db,
  claims: {
    provider: 'logto',
    subject: 'usr_abc123',
    email: 'test@example.com',
  },
});
```

`requireUser()` ja suporta ambos os caminhos — nenhuma alteracao necessaria nos helpers de dominio.

### Como evitar acoplamento com Supabase

- `packages/auth/adapters/logto-session-adapter.ts` nao importa `@supabase/*`;
- helpers de dominio (`requireUser`, `resolveTenantContext`, etc.) recebem `db: NoroDatabase` (Drizzle) e `claims`/`sessionAdapter` — sem dependencia direta de Supabase;
- o adapter retorna `LogtoSessionClaims`, que e compativel com `AuthClaims` — o contrato de fronteira e simples e sem vazamento de SDK.

### Como testar os helpers sem banco real

Os helpers aceitam `claims` explicitas. Para testes unitarios:

```typescript
const claims: AuthClaims = {
  provider: 'logto',
  subject: 'test-subject-001',
  email: 'test@noro.com',
};

// Mock do db com repositorios simulados (sem banco real)
const result = await requireUser({ db: mockDb, claims });
```

Nenhuma conexao com banco real e necessaria para validar a logica dos helpers.

---

## 4. Arquivos criados

| Arquivo | Descricao |
| --- | --- |
| `packages/auth/adapters/logto-session-adapter.ts` | Adapter/stub com contrato `LogtoSessionClaims`, `LogtoAdapterNotConfiguredError` e `logtoSessionAdapter` |
| `packages/auth/adapters/index.ts` | Barrel export do modulo `adapters` |
| `docs/backlog/implementation/sprint-1i-logto-next-adapter-validation-report.md` | Este relatorio |

---

## 5. Arquivos ajustados

| Arquivo | Alteracao |
| --- | --- |
| `packages/auth/types.ts` | Campo `picture?: string \| null` adicionado ao `AuthClaims`; comentarios de contrato adicionados |
| `packages/auth/index.ts` | Linha `export * from './adapters'` adicionada |
| `docs/SPRINT_STATUS.md` | Atualizado com resultado da Sprint 1I |

---

## 6. Validacao

Comandos executados:

```txt
git status --short
rg -rn "LOGTO_|@logto|getAuthRuntimeConfig|logto" packages/auth/ apps/control/ apps/core/
node_modules/.bin/tsc.cmd --noEmit --skipLibCheck --moduleResolution node --module esnext --target es2020 --esModuleInterop \
  packages/auth/index.ts packages/auth/types.ts packages/auth/errors.ts \
  packages/auth/context/user-context.ts packages/auth/context/tenant-context.ts \
  packages/auth/context/platform-context.ts packages/auth/context/module-context.ts \
  packages/auth/context/site-tenant-context.ts packages/auth/context/authorization.ts \
  packages/auth/adapters/logto-session-adapter.ts packages/auth/adapters/index.ts
grep -rn "@supabase|supabase.auth|auth.users|auth.uid|.from(|Appwrite|CREATE TABLE|ALTER TABLE" packages/auth/
```

Resultados:

- TypeScript direcionado: **passou** (sem erros, sem output).
- Varredura de `packages/auth`: **sem ocorrencias proibidas**.
- Envs `LOGTO_*`: encontradas em `apps/control/.env.local`, `apps/core/.env.local`, `apps/core/.env.example`, `turbo.json`.
- SDK `@logto/*`: **ausente** em todos os `package.json`.

---

## 7. Seguranca

| Verificacao | Resultado |
| --- | --- |
| Nenhuma dependencia instalada | confirmado |
| Nenhum import `@supabase/*` em `packages/auth` | confirmado |
| Nenhum uso de `.from(...)` | confirmado |
| Nenhum uso de `auth.users` | confirmado |
| Nenhum uso de `auth.uid()` | confirmado |
| Nenhum uso de RLS Supabase | confirmado |
| Nenhuma migration gerada | confirmado |
| Nenhuma migration aplicada | confirmado |
| Nenhum SQL executado | confirmado |
| Nenhum acesso ao banco da VPS | confirmado |
| Nenhum app migrado | confirmado |
| Login atual de `apps/control` e `apps/core` intacto | confirmado |
| Appwrite nao reintroduzido | confirmado |

---

## 8. Pendencias

| Pendencia | Descricao |
| --- | --- |
| SDK Logto oficial | `@logto/next` ou `@logto/node` ainda precisa ser escolhido/aprovado por Paulo |
| Adapter Next.js real | `readLogtoSession()` em `logto-session-adapter.ts` e um stub; exige SDK instalado |
| Middleware de protecao de rotas | `apps/control/middleware.ts` nao protege rotas por sessao Logto ainda |
| Primeiro app a migrar | Indefinido; `/control` e candidato natural pois e o Control Plane |
| Riscos antes de trocar login real | 1) garantir banco dev/staging isolado; 2) mapear usuarios Supabase -> Logto; 3) bridge `legacy_supabase_user_id` confirmada no schema |
| Banco dev/staging isolado | Ainda nao confirmado; necessario antes de qualquer migration |
| Estrategia de coexistencia | Supabase Auth + Logto em paralelo enquanto apps migram; timing nao definido |

---

## 9. Proxima sprint recomendada

```txt
Sprint 1J — Decisao do SDK Logto e plano de migracao do /control
```

Escopo recomendado:

- Paulo aprova SDK: `@logto/next` (App Router nativo) ou alternativa;
- instalar dependencia nos apps-alvo apos aprovacao;
- implementar `readLogtoSession()` real no adapter;
- criar plano de migracao do login/middleware de `apps/control` para Logto, sem remover Supabase ainda;
- documentar estrategia de coexistencia: quais rotas migram primeiro, como o bridge `legacy_supabase_user_id` sera populado;
- manter `apps/core` e `apps/sites` intocados nesta sprint.

Se a aprovacao do SDK for imediata, a Sprint 1J pode ser combinada com a implementacao do adapter real e o plano de migracao do `/control` em uma unica sprint.
