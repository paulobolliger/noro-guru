# Sprint 1J - Relatorio De SDK Logto/Next.js E Adapter Real

Data de referencia: 2026-05-27

Status: implementacao local concluida. SDK instalado. Adapter real implementado. Nenhum app foi migrado. Nenhum banco foi acessado ou alterado.

---

## 1. Resumo executivo

A Sprint 1J confirmou `@logto/next` como SDK correto para o projeto, instalou o pacote em `packages/auth` e implementou o adapter real em `packages/auth/adapters/logto-session-adapter.ts`.

O adapter substitui o stub da Sprint 1I pela leitura real de sessao via `getLogtoContext()` do `@logto/next/server-actions`, compativel com Next.js App Router (versao 14.2.3 usada no projeto).

Confirmacoes:

- `@logto/next@4.2.10` instalado via npm em `packages/auth`;
- TypeScript passou sem erros em todos os arquivos de `packages/auth`;
- nenhum app foi migrado;
- login atual de `apps/control` e `apps/core` (Supabase Auth) permanece intacto;
- nenhum banco foi acessado;
- nenhuma migration foi aplicada.

---

## 2. Verificacao do projeto

| Item | Valor |
| --- | --- |
| Package manager | npm@10.9.3 |
| Lockfile | `package-lock.json` (raiz) |
| Workspaces | `apps/*`, `packages/*` |
| Next.js versao | 14.2.3 (App Router) |
| `@logto/next` existia antes | Nao |
| Envs `LOGTO_*` | `apps/control/.env.local`, `apps/core/.env.local`, `apps/core/.env.example`, `turbo.json` |
| Endpoint Logto | `https://auth.norotec.cloud` (servidor na VPS, ja em operacao) |

Next.js 14.2.3 usa App Router por padrao. O SDK `@logto/next` declara `peerDependencies: { next: '>=12' }`, compativel com a versao instalada. A API de `server-actions` foi criada exatamente para App Router (Server Components e Server Actions), confirmando que e o SDK correto.

---

## 3. Instalacao

Comando executado:

```bash
npm install @logto/next --workspace packages/auth --save
```

Pacotes instalados pelo npm:

- `@logto/next@4.2.10` (direto)
- `@logto/node@3.x` (transitivo)
- `@logto/client@3.x` (transitivo)
- `@logto/js@6.x` (transitivo)
- `@edge-runtime/cookies@5.x` (transitivo)
- `cookie@1.x` (transitivo)
- e dependencias auxiliares

Arquivos alterados pela instalacao:

- `packages/auth/package.json` — campo `"@logto/next": "^4.2.10"` adicionado em `dependencies`
- `package-lock.json` (raiz) — lockfile atualizado com novos pacotes

Local da dependencia: `packages/auth` (workspace). O SDK e dependencia de dominio do pacote de autenticacao, nao de apps especificos. Cada app Next.js que precisar de rotas de sign-in/callback importara o SDK indiretamente via `@noro/auth`.

Nota de auditoria: a vulnerabilidade `drizzle-orm < 0.45.2` reportada pelo npm audit e pre-existente e nao foi introduzida por esta sprint. Sua correcao exige breaking change e sera tratada em sprint propria.

---

## 4. Adapter Logto

### Contrato implementado

```typescript
export type LogtoSessionClaims = {
  provider: 'logto';
  providerSubject: string;   // ctx.claims.sub do Logto
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  rawClaims?: unknown;
};

export function logtoSessionAdapter(config: LogtoNextConfig) {
  return (): Promise<LogtoSessionClaims | null> => readLogtoSession(config);
}
```

### Como `providerSubject` e extraido

O SDK retorna `LogtoContext` com `claims?: IdTokenClaims`. O campo `sub` do JWT (definido em `@logto/js`) e o identificador unico do usuario no Logto. O adapter le `ctx.claims.sub` e o mapeia para `providerSubject`, que e armazenado em `identity_links.provider_subject` no banco.

```typescript
const ctx = await getLogtoContext(config);
if (!ctx.isAuthenticated || !ctx.claims?.sub) return null;
return {
  provider: 'logto',
  providerSubject: ctx.claims.sub,  // <- JWT sub
  email: ctx.claims.email ?? null,
  name: ctx.claims.name ?? null,
  picture: ctx.claims.picture ?? null,
  rawClaims: ctx.claims,
};
```

### Claims usadas

| Claim Logto | Campo destino | Obrigatoria |
| --- | --- | --- |
| `sub` | `providerSubject` / `identity_links.provider_subject` | sim |
| `email` | `LogtoSessionClaims.email` | recomendada |
| `name` | `LogtoSessionClaims.name` | opcional |
| `picture` | `LogtoSessionClaims.picture` | opcional |

### Uso com SDK real

```typescript
// Em apps/control/lib/logto.ts (sprint de migracao do /control)
import type { LogtoNextConfig } from '@logto/next';
export const logtoConfig: LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
  cookieSecure: process.env.NODE_ENV === 'production',
};

// Em um Server Action do /control:
import { requireUser } from '@noro/auth';
import { logtoSessionAdapter } from '@noro/auth/adapters';
import { logtoConfig } from '@/lib/logto';
import { db } from '@noro/db';

const userCtx = await requireUser({ db, sessionAdapter: logtoSessionAdapter(logtoConfig) });
```

### Diferenca do adapter para testes

Para testes unitarios (sem banco real, sem SDK ativo), `claims` continuam funcionando:

```typescript
const userCtx = await requireUser({
  db: mockDb,
  claims: { provider: 'logto', subject: 'test-sub-001', email: 'test@noro.com' },
});
```

### Estado: SDK real

O adapter agora usa o SDK real (`@logto/next/server-actions`). Nao e mais um stub. Porem, para funcionar em producao, cada app precisa:

1. criar um arquivo `logto.ts` local com `LogtoNextConfig`;
2. criar rotas `/auth/sign-in`, `/auth/sign-out`, `/auth/callback` usando `signIn`, `signOut`, `handleSignIn` do SDK;
3. proteger rotas via middleware usando `getLogtoContext`.

Estas etapas sao responsabilidade da sprint de migracao dos apps (Sprint 1K+).

---

## 5. Arquivos criados

| Arquivo | Descricao |
| --- | --- |
| `docs/backlog/implementation/sprint-1j-logto-sdk-adapter-report.md` | Este relatorio |

---

## 6. Arquivos ajustados

| Arquivo | Alteracao |
| --- | --- |
| `packages/auth/adapters/logto-session-adapter.ts` | Substituido o stub pela implementacao real usando `getLogtoContext` do `@logto/next/server-actions`; funcao alterada de constante para funcao factory que recebe `LogtoNextConfig` |
| `packages/auth/package.json` | `"@logto/next": "^4.2.10"` adicionado em `dependencies` |
| `package-lock.json` | Lockfile atualizado com `@logto/next` e dependencias transitivas |
| `docs/SPRINT_STATUS.md` | Atualizado com resultado da Sprint 1J |

---

## 7. Validacao

Comandos executados:

```txt
npm install @logto/next --workspace packages/auth --save
npm audit --workspace packages/auth
node -e "const d=require('./packages/auth/package.json'); console.log(JSON.stringify(d,null,2))"
node_modules/.bin/tsc.cmd --noEmit --skipLibCheck --moduleResolution bundler --module esnext --target es2020 --esModuleInterop \
  packages/auth/adapters/logto-session-adapter.ts packages/auth/adapters/index.ts
node_modules/.bin/tsc.cmd --noEmit --skipLibCheck --moduleResolution node --module esnext --target es2020 --esModuleInterop \
  packages/auth/index.ts packages/auth/types.ts packages/auth/errors.ts \
  packages/auth/context/user-context.ts packages/auth/context/tenant-context.ts \
  packages/auth/context/platform-context.ts packages/auth/context/module-context.ts \
  packages/auth/context/site-tenant-context.ts packages/auth/context/authorization.ts \
  packages/auth/adapters/logto-session-adapter.ts packages/auth/adapters/index.ts
grep -rn "@supabase|supabase.auth|auth.users|auth.uid|.from(|Appwrite|CREATE TABLE|ALTER TABLE" packages/auth/
```

Resultados:

- TypeScript direcionado (adapter + contexto bundler): **passou** (sem output).
- TypeScript direcionado (todos os arquivos packages/auth): **passou** (sem output).
- Varredura de seguranca em `packages/auth`: **sem ocorrencias proibidas**.
- `@logto/next` instalado: **confirmado** — `node_modules/@logto/next` existe.

---

## 8. Seguranca

| Verificacao | Resultado |
| --- | --- |
| Nenhum app migrado | confirmado |
| Login real de `apps/control` e `apps/core` intacto | confirmado — `apps/control/app/login/page.tsx` usa Supabase Auth sem alteracoes |
| Supabase runtime transicional intacto | confirmado |
| Nenhuma migration | confirmado |
| Nenhum SQL executado | confirmado |
| Nenhum banco acessado | confirmado |
| Banco da VPS nao alterado | confirmado |
| Nenhum segredo exposto | confirmado — envs lidas de `LogtoNextConfig` passado como parametro; nada hardcoded |
| Nenhum import Supabase em helpers novos | confirmado — varredura limpa |
| Nenhum `.from(...)` | confirmado |
| Nenhum `auth.users` | confirmado |
| Nenhum `auth.uid()` | confirmado |
| Appwrite nao reintroduzido | confirmado |

---

## 9. Pendencias

| Pendencia | Descricao |
| --- | --- |
| Rotas de auth no `/control` | `signIn`, `signOut`, `handleSignIn` precisam de rotas dedicadas (sprint propria) |
| Middleware de protecao no `/control` | `apps/control/middleware.ts` precisa chamar `getLogtoContext` para proteger `(protected)` |
| `logtoConfig` local no `/control` | Arquivo `apps/control/lib/logto.ts` com `LogtoNextConfig` nao criado (sprint propria) |
| Estrategia de coexistencia | Supabase Auth + Logto em paralelo durante a transicao; timing nao definido |
| Mapping de usuarios Supabase -> Logto | `identity_links` precisara ser populado para usuarios que ja existem via Supabase |
| Banco dev/staging isolado | Ainda nao confirmado; necessario antes de qualquer migration |
| `legacy_supabase_user_id` | Bridge precisa ser populado quando usuarios migrarem de Supabase para Logto |
| Vulnerabilidade `drizzle-orm` | Pre-existente; requer upgrade com breaking change — fora do escopo desta sprint |

---

## 10. Proxima sprint recomendada

```txt
Sprint 1K — Plano de migracao do /control para Logto, sem remover Supabase ainda
```

Escopo recomendado:

- criar `apps/control/lib/logto.ts` com `LogtoNextConfig`;
- criar rotas `/auth/sign-in`, `/auth/sign-out`, `/auth/callback` em `apps/control`;
- atualizar `apps/control/middleware.ts` para proteger `(protected)` via `getLogtoContext`;
- manter `apps/control/app/login/page.tsx` (Supabase) em paralelo ate validacao completa;
- documentar estrategia de coexistencia e rollback;
- nao migrar `apps/core` ou outros apps nesta sprint;
- nao acessar banco real;
- nao rodar migrations.
