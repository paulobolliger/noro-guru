# Sprint 1K — Plano De Migracao Do /control Para Logto

Data de referencia: 2026-05-27

Status: plano criado. Nenhum arquivo do apps/control foi alterado. Nenhum banco foi acessado.

---

## 1. Resumo executivo

O `apps/control` usa Supabase Auth como runtime de autenticacao em producao. A Sprint 1J instalou `@logto/next@4.2.10` em `packages/auth` e implementou o adapter real `logtoSessionAdapter(config)` usando `getLogtoContext()` do `@logto/next/server-actions`.

Esta sprint (1K) e exclusivamente de planejamento. Nenhuma alteracao de codigo foi executada.

A Sprint 1L implementara o plano aqui descrito: criar as rotas Logto, `apps/control/lib/logto.ts` e ajustar o middleware, mantendo Supabase Auth em paralelo ate validacao completa.

Premissas confirmadas:

- `@logto/next` instalado e funcional em `packages/auth`;
- adapter `logtoSessionAdapter(config)` pronto para uso;
- `apps/control` nao tem rotas `/auth/*` Logto;
- `apps/control` nao tem `lib/logto.ts`;
- `apps/control/middleware.ts` atualmente apenas redireciona `/admin/*` para `/` — nao protege rotas por sessao;
- protecao de rotas esta no layout `app/(protected)/layout.tsx` via `supabase.auth.getUser()`;
- Supabase nao sera removido nesta fase.

---

## 2. Estado atual do apps/control

### Login atual

Arquivo: `apps/control/app/login/page.tsx`

- Client Component (`'use client'`);
- usa `createClient()` de `@noro/lib/supabase/client`;
- fluxo: `supabase.auth.signInWithPassword(...)` ou `supabase.auth.signInWithOAuth({ provider: 'google' })`;
- pos-login: `router.push(redirectTo)` onde `redirectTo` vem de `?redirect=` ou fallback para `/admin`;
- link de callback Supabase OAuth: `/auth/callback?redirect=...`;
- este arquivo NAO sera tocado nesta sprint nem na 1L ate validacao Logto.

### Middleware atual

Arquivo: `apps/control/middleware.ts`

Funcao atual: apenas reescreve `/admin/*` para `/*` (alias legacy).

```typescript
matcher: ['/admin/:path*']
```

Nao protege rotas por sessao. A protecao hoje esta no layout do grupo `(protected)`.

Observacao importante: o middleware atual NAO usa Supabase Auth para autenticar. A autenticacao e feita no layout servidor. Isso significa que a migracao para Logto no middleware sera aditiva, nao substitutiva imediata.

### Layout protegido

Arquivo: `apps/control/app/(protected)/layout.tsx`

Guard atual:

```
supabase.auth.getUser() → user
if (!user) → redirect('/login?redirect=/')
supabase.from('noro_users').select('*').eq('id', user.id)
if (!profile || !['admin', 'super_admin'].includes(profile.role)) → redirect('/login?error=unauthorized')
```

Este e o principal ponto de autenticacao atual. Sera mantido intacto ate o Logto ser validado.

### Rotas publicas identificadas

| Rota | Tipo |
| --- | --- |
| `/login` | publica — login Supabase |
| `/public/leads/submit` | publica — formulario de lead externo |
| `/api/contato` | publica — API de contato |
| `/api/leads` | publica — captura de leads |
| `/debug` | publica — debug (dev only) |
| `/_next/*` | assets Next.js |
| `/favicon.ico` | asset |

### Rotas privadas

Todo o grupo `(protected)` com aproximadamente 27 sub-rotas de paginas e multiplas API routes internas.

### Uso de Supabase Auth (mapeamento resumido)

598 referencias a Supabase no app, distribuidas em:

- `app/(protected)/layout.tsx` — guard principal de sessao;
- `app/(protected)/page.tsx` — verificacao adicional de sessao;
- `app/(protected)/configuracoes/page.tsx` — `supabase.auth.getUser()`;
- `app/(protected)/configuracoes/user-actions.ts` — `supabase.auth.getSession()`;
- `app/(protected)/control/leads/kanban/assign/route.ts` — `supabase.auth.getUser()`;
- demais actions e routes — uso de `createAdminSupabaseClient()` para dados (nao necessariamente auth).

### Envs existentes no apps/control

| Env | Valor (dev) | Uso atual |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gjffoongddkorxnnzmzc.supabase.co` | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | jwt... | Supabase client |
| `LOGTO_APP_ID` | `78qmlgdcrl5hwr9ls0uwl` | Nao usado ainda |
| `LOGTO_APP_SECRET` | `4Ft4...` | Nao usado ainda |
| `LOGTO_ENDPOINT` | `https://auth.norotec.cloud` | Nao usado ainda |
| `LOGTO_COOKIE_SECRET` | `kRLUY...` | Nao usado ainda |
| `NEXT_PUBLIC_APP_URL` | `https://admin.noro.guru` | Disponivel para `baseUrl` |

Observacao: `NEXT_PUBLIC_APP_URL` = `https://admin.noro.guru` sera usado como `baseUrl` do `LogtoNextConfig`.

### Dependencias relevantes

- `@supabase/ssr@^0.5.2` — SSR cookies do Supabase;
- `@supabase/supabase-js@^2.75.0` — client Supabase;
- `next@14.2.3` — App Router;
- `@noro/lib` — wrapper Supabase local;
- `@noro/auth` — helpers de auth (inclui `@logto/next` instalado na Sprint 1J).

Nota: `apps/control/package.json` nao precisa declarar `@logto/next` diretamente — o SDK esta em `packages/auth` e sera acessado via `@noro/auth`.

---

## 3. Arquivos planejados para a Sprint 1L

### Criar

```txt
apps/control/lib/logto.ts
apps/control/app/auth/sign-in/route.ts
apps/control/app/auth/sign-out/route.ts
apps/control/app/auth/callback/route.ts
```

### Ajustar (minimamente)

```txt
apps/control/middleware.ts
```

### Ajustar (apenas se indispensavel)

```txt
apps/control/app/(protected)/layout.tsx   <- apenas adicionar novo caminho, NAO remover Supabase
```

### NAO alterar

```txt
apps/control/app/login/page.tsx          <- login Supabase permanece intacto
apps/control/app/layout.tsx              <- root layout sem guard de auth
apps/control/app/(protected)/page.tsx    <- pode ser ajustado mais tarde
```

---

## 4. Plano conceitual: apps/control/lib/logto.ts

```typescript
// apps/control/lib/logto.ts
// Configuracao do SDK Logto para apps/control.
// Nao hardcodar secrets — ler de process.env em runtime.

import type { LogtoNextConfig } from '@logto/next';

export const logtoConfig: LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,           // https://auth.norotec.cloud
  appId: process.env.LOGTO_APP_ID!,                // 78qmlgdcrl5hwr9ls0uwl
  appSecret: process.env.LOGTO_APP_SECRET!,        // secret do app Logto
  baseUrl: process.env.NEXT_PUBLIC_APP_URL         // https://admin.noro.guru (dev: http://localhost:3001)
    ?? 'http://localhost:3001',
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,  // segredo de encriptacao do cookie
  cookieSecure: process.env.NODE_ENV === 'production',
};
```

Observacoes:

- `baseUrl` deve ser a URL raiz do `apps/control`, nao do Logto;
- em dev local, `baseUrl` pode ser sobreposto por `CONTROL_DEV_URL` (a decidir com Paulo);
- `cookieSecure: false` em dev local e necessario para HTTP;
- `appSecret` nao deve aparecer em variaveis `NEXT_PUBLIC_*`;
- `LOGTO_COOKIE_SECRET` ja esta configurado com valor adequado no `.env.local`.

---

## 5. Plano conceitual: rotas /auth/*

### /auth/sign-in — route.ts

Responsabilidade: iniciar o fluxo de login Logto.

```typescript
// apps/control/app/auth/sign-in/route.ts
// Route Handler (GET)
import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

export async function GET() {
  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/auth/callback`,
    postRedirectUri: `${logtoConfig.baseUrl}/`,
  });
}
```

Comportamento:
- redireciona para o servidor Logto (`https://auth.norotec.cloud`);
- Logto autentica o usuario;
- Logto redireciona de volta para `/auth/callback`.

Nota: `postRedirectUri` e a URL para onde o usuario vai APOS o callback ser processado. Por padrao: `/` do `/control`.

### /auth/callback — route.ts

Responsabilidade: receber o codigo de autorizacao Logto e criar sessao.

```typescript
// apps/control/app/auth/callback/route.ts
// Route Handler (GET)
import { handleSignIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);
  redirect('/');
}
```

Comportamento:
- recebe o `?code=...&state=...` do Logto;
- `handleSignIn` troca o codigo por tokens e salva na sessao (cookie);
- redireciona para `/` (area protegida);
- NUNCA deve ser bloqueado pelo middleware.

### /auth/sign-out — route.ts

Responsabilidade: encerrar sessao Logto.

```typescript
// apps/control/app/auth/sign-out/route.ts
// Route Handler (GET)
import { signOut } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

export async function GET() {
  await signOut(logtoConfig, `${logtoConfig.baseUrl}/login`);
}
```

Comportamento:
- limpa o cookie de sessao Logto;
- redireciona para `/login` (tela de login existente);
- mantem Supabase Auth intacto — signOut Logto nao afeta sessao Supabase.

---

## 6. Plano do middleware

Arquivo: `apps/control/middleware.ts`

### Estado atual

O middleware atual apenas redireciona `/admin/*` para `/*`. Nao protege sessoes.

### Estrategia para Sprint 1L

O middleware sera AMPLIADO (nao substituido) para:

1. manter o redirect legacy `/admin/*`;
2. adicionar protecao de sessao Logto nas rotas privadas;
3. liberar explicitamente rotas publicas.

### Logica planejada

```typescript
// Pseudocodigo — nao implementar ainda

import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

const PUBLIC_PATHS = [
  '/login',           // login Supabase (mantido)
  '/auth/sign-in',    // inicio do fluxo Logto
  '/auth/sign-out',   // logout Logto
  '/auth/callback',   // callback Logto — NUNCA bloquear
  '/public/',         // rotas publicas de formularios
  '/api/contato',
  '/api/leads',
  '/debug',
  '/_next',
  '/favicon.ico',
];

// Para cada request:
// 1. Se pathname bate com PUBLIC_PATHS → NextResponse.next()
// 2. Se pathname comeca com /admin/ → redirect (comportamento atual)
// 3. Para rotas privadas: verificar sessao Logto
//    - ctx.isAuthenticated = false → redirect('/auth/sign-in')
//    - ctx.isAuthenticated = true → NextResponse.next()
```

### Observacoes criticas do middleware

- `/auth/callback` DEVE estar na lista de rotas publicas — se for bloqueado, o loop de redirect nao fecha;
- durante a fase de coexistencia, `/login` tambem deve permanecer acessivel;
- o middleware NAO fara lookup no banco — apenas verifica o cookie de sessao Logto;
- `getLogtoContext` no middleware usa edge runtime — confirmar compatibilidade com App Router de Next.js 14;
- alternativa mais segura para inicio: usar apenas verificacao de cookie sem `getLogtoContext` (mais leve no edge);
- a protecao mais robusta sera no layout `(protected)` usando `requireUser()` com `logtoSessionAdapter`.

### Decisao de implementacao para Sprint 1L

Opcao A (recomendada para inicio): middleware apenas redireciona para `/auth/sign-in` se nao houver cookie Logto presente. Sem lookup de banco. Seguro para edge runtime.

Opcao B: middleware usa `getLogtoContext()` completo. Mais preciso, mas requer confirmar que o runtime edge do Next.js 14 suporta bem `@logto/next/server-actions`.

A Sprint 1L deve comecar com Opcao A e escalar para B depois de validar.

---

## 7. Coexistencia Supabase Auth + Logto

### Principio

Durante a transicao, os dois sistemas coexistem:

- `/login` → login Supabase (existente, intacto);
- `/auth/sign-in` → inicio do login Logto (novo);
- o usuario pode estar autenticado em um sistema e nao no outro.

### Estrategia de dual-auth na Sprint 1L

Fase 1 (Sprint 1L):

- criar rotas `/auth/*` Logto sem alterar login Supabase;
- ajustar middleware para redirecionar para `/auth/sign-in` (Logto) em vez de `/login` (Supabase), SOMENTE para rotas novas ou apos featureflag;
- manter layout `(protected)` com guard Supabase intacto;
- testar login Logto manualmente sem afetar login Supabase existente.

Fase 2 (Sprint futura, apos validacao Logto):

- ajustar layout `(protected)` para aceitar sessao Logto;
- adicionar `requireUser({ db, sessionAdapter: logtoSessionAdapter(logtoConfig) })` no layout;
- manter fallback Supabase por mais uma sprint;
- remover guard Supabase do layout apenas quando Logto estiver estavel.

Fase 3 (Sprint futura, apos estabilidade):

- remover dependencias Supabase Auth do `/control`;
- nao remove Supabase dos dados (tabelas legadas permanecem).

### Rollback

Para rollback em qualquer fase:

- reverter `middleware.ts` para versao anterior (apenas redirect `/admin`);
- usuários continuam usando `/login` (Supabase) sem interrupcao;
- nenhum dado e perdido — rotas Logto sao novas, nao substitutivas;
- manter commits pequenos por arquivo para facilitar revert.

---

## 8. Bridge de usuario

Para que `requireUser()` funcione com Logto, o banco precisa ter:

```sql
-- Nao executar agora — apenas documentar o que sera necessario
INSERT INTO noro.identity_links (user_id, provider, provider_subject, provider_email, status)
VALUES (uuid_do_usuario, 'logto', 'sub_do_logto', 'email@example.com', 'active');
```

O `provider_subject` = `ctx.claims.sub` retornado pelo Logto apos login.

### Opcoes planejadas para Sprint futura

Opcao A — Bootstrap manual em dev/staging:
- fazer login no Logto via `/auth/sign-in`;
- capturar o `sub` do JWT;
- inserir manualmente em `identity_links` no banco dev;
- util para o primeiro `platform_owner`.

Opcao B — Seed script seguro:
- criar `scripts/seed-platform-owner.ts`;
- script lê envs, aceita `--logto-sub`, `--email` como parametros;
- insere `users` + `identity_links` + `platform_role_assignments`;
- nunca roda em banco de producao sem aprovacao explicita.

Opcao C — Fluxo de bootstrap automatico (Sprint futura):
- primeiro login Logto sem `identity_link` dispara fluxo de "criar conta";
- apenas para `platform_owner` inicial — nao para usuarios normais;
- requer decisao de Paulo sobre criacao automatica vs bloqueio.

Recomendacao: Opcao A para dev inicial (Sprint 1L), Opcao B para staging (Sprint 1M+).

### Banco dev/staging

Nenhum banco dev/staging separado foi confirmado ainda. Esta e uma pendencia critica antes de executar qualquer seed ou bridge de usuario.

---

## 9. Controle de acesso ao /control

Login Logto valido nao e suficiente para acessar o `/control`.

O usuario tambem precisa ter, no banco:

```
platform_role_assignments.user_id = <id do usuario>
platform_role_assignments.role IN ('platform_owner', 'platform_admin', 'platform_ops', 'platform_finance', 'platform_support')
platform_role_assignments.status = 'active'
```

Fluxo canonico pos-login Logto:

```
1. Logto autentica → retorna ctx.claims.sub
2. requireUser({ db, sessionAdapter: logtoSessionAdapter(config) })
   → busca identity_links por (provider='logto', provider_subject=sub)
   → retorna AuthUserContext com user.id interno
3. requirePlatformRole({ db, userContext, roles: ['platform_owner', ...] })
   → verifica platform_role_assignments
   → lanca PlatformRoleRequiredError se sem role
4. Se passou: acesso autorizado
```

Erros possiveis e resposta esperada:

| Situacao | Erro | Comportamento esperado |
| --- | --- | --- |
| Sem sessao Logto | `UnauthenticatedError` | Redirect para `/auth/sign-in` |
| Sessao Logto sem `identity_link` | `UserNotFoundError` | Pagina de erro controlado |
| Sessao Logto com `identity_link` mas sem platform role | `PlatformRoleRequiredError` | Pagina de erro "sem permissao" |
| Supabase bloqueado | usuario nao acessivel | Fallback para Logto |

---

## 10. Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
| --- | --- | --- | --- |
| `/auth/callback` bloqueado pelo middleware | Alta (se mal configurado) | Critico — loop de redirect | Adicionar `/auth/callback` explicitamente nas rotas publicas do middleware |
| `baseUrl` incorreto em dev vs prod | Alta | Login nunca completa | Usar `NEXT_PUBLIC_APP_URL` com fallback; documentar para Paulo |
| `LOGTO_COOKIE_SECRET` ausente ou errado | Media | Cookie invalido, sessao nao persiste | Validar env antes de iniciar fluxo; erro claro se ausente |
| Loop de redirect | Media | App inacessivel | Garantir que `/auth/sign-in` e publica; testar manualmente |
| Usuario Logto sem `identity_link` | Alta (todos os usuarios iniciais) | `UserNotFoundError` | Preparar seed/bootstrap antes de migrar login real |
| Usuario sem `platform_role` | Alta (todos os usuarios iniciais) | `PlatformRoleRequiredError` | Mesmo bootstrap acima |
| Quebrar login Supabase antes da hora | Baixa (se nao alterar `/login`) | Perda de acesso total | NAO alterar `/login` nem layout guard Supabase na Sprint 1L |
| Mistura de cookies Supabase e Logto | Media | Comportamento imprevisivel | Usar nomes de cookie distintos; garantir que `cookieSecret` Logto nao conflita |
| `getLogtoContext` incompativel com edge runtime do Next.js 14 | Media | Middleware quebra | Comecar com Opcao A (verificacao simples de cookie) no middleware |
| URLs de ambiente diferentes (dev/staging/prod) | Alta | Callback falha | Configurar `LOGTO_REDIRECT_URI` por ambiente; documentar para Paulo |

---

## 11. Estrategia de rollback

Em qualquer momento da Sprint 1L e fases seguintes:

1. reverter `apps/control/middleware.ts` para versao da Sprint 1K (apenas `/admin` redirect);
2. usuarios continuam acessando `/login` (Supabase) sem qualquer interrupcao;
3. rotas `/auth/*` Logto sao aditivas — sua remocao nao afeta fluxo existente;
4. `lib/logto.ts` pode ser deletado sem impacto;
5. `packages/auth` continua funcionando — nenhuma dependencia de apps muda;
6. commits devem ser atomicos por arquivo para facilitar `git revert`.

---

## 12. Validacao planejada para Sprint 1L

Testes manuais necessarios (sem banco real, sem migrations):

| Teste | Metodo | Criterio de sucesso |
| --- | --- | --- |
| TypeScript compila | `tsc --noEmit` nos novos arquivos | Sem erros |
| `/auth/sign-in` redireciona para Logto | Acesso manual no browser | Pagina de login Logto aparece |
| `/auth/callback` nao e bloqueado pelo middleware | Verificar matcher do middleware | Nenhum redirect indesejado |
| `/auth/sign-out` limpa sessao | Acesso manual e verificar cookies | Cookie Logto removido |
| Middleware nao bloqueia assets `/_next/*` | Verificar matcher | Assets carregam |
| Usuario nao autenticado e redirecionado | Acesso a rota protegida sem sessao | Redirect para `/auth/sign-in` |
| Login Supabase antigo ainda funciona | Acessar `/login` | Funciona normalmente |
| Nenhuma rota de `apps/core` afetada | Verificar que nenhum arquivo de `apps/core` foi alterado | Nenhuma alteracao |
| Sem acessos ao banco real | Varredura de codigo novo | Nenhum SQL, nenhum `from(...)` |

Testes que precisam de banco (adiados para sprint com banco dev/staging confirmado):

- `requireUser()` com Logto session real;
- `requirePlatformRole()` validando role no banco;
- fluxo completo de login com usuario real.

---

## 13. O que nao fazer na Sprint 1L

| Proibicao | Motivo |
| --- | --- |
| Migrar `apps/core` | Fora de escopo; so `/control` nesta fase |
| Remover Supabase Auth | Coexistencia e necessaria para rollback |
| Tocar banco real | Banco dev/staging ainda nao confirmado |
| Rodar migrations | Bloqueado ate aprovacao, backup e banco dev/staging |
| Implementar CRM | Sprint 2 |
| Implementar billing | Sprint 5 |
| Implementar checkout | Sprint 5 |
| Alterar `apps/sites` ou `apps/web` | Fora de escopo |
| Remover `/login` antigo | Manter como fallback |
| Instalar novas dependencias | SDK ja instalado em `packages/auth`; nenhuma adicional necessaria |

---

## 14. Arquivos que a Sprint 1L podera alterar

### Criar (novos, sem substituir nada)

| Arquivo | Descricao |
| --- | --- |
| `apps/control/lib/logto.ts` | Configuracao `LogtoNextConfig` |
| `apps/control/app/auth/sign-in/route.ts` | Iniciar login Logto |
| `apps/control/app/auth/sign-out/route.ts` | Encerrar sessao Logto |
| `apps/control/app/auth/callback/route.ts` | Receber callback Logto |

### Ajustar (alteracoes minimas)

| Arquivo | Alteracao |
| --- | --- |
| `apps/control/middleware.ts` | Adicionar protecao de rotas e lista de caminhos publicos |

### Alterar apenas se indispensavel

| Arquivo | Condicao |
| --- | --- |
| `apps/control/app/(protected)/layout.tsx` | Adicionar caminho alternativo Logto SEM remover guard Supabase |
| `apps/control/app/(protected)/page.tsx` | Apenas se o teste de sessao quebrar com novo middleware |

### NAO alterar

| Arquivo | Motivo |
| --- | --- |
| `apps/control/app/login/page.tsx` | Login Supabase permanece intacto |
| `apps/control/app/layout.tsx` | Sem guard de auth; nao precisa mudar |
| Qualquer arquivo de `apps/core` | Fora de escopo |
| `packages/auth/*` | Ja implementado e validado |
| Schema / migrations | Bloqueado |

---

## 15. Decisoes pendentes para Paulo

| Decisao | Contexto | Impacto na Sprint 1L |
| --- | --- | --- |
| URL oficial do `/control` em dev local | `baseUrl` do `LogtoNextConfig` precisa ser correto. Atualmente `NEXT_PUBLIC_APP_URL=https://admin.noro.guru`. Em dev local, qual a porta/URL? `http://localhost:3001`? | Sem URL correta, callback Logto retorna para endereco errado |
| Rota pos-login padrao | Apos login Logto bem-sucedido, para onde redirecionar? Sugestao: `/` (que ja redireciona para `/control`) | Configura `postRedirectUri` |
| Manter `/login` como tela antiga ou criar `/login-logto` temporario | Opcao A: manter `/login` Supabase e adicionar `/auth/sign-in` Logto em paralelo. Opcao B: criar redirect em `/login` para `/auth/sign-in`. Opcao A e mais segura para rollback. | Define estrategia de coexistencia do login |
| Primeiro platform_owner no Logto | Qual usuario (email) sera o primeiro `platform_owner` no Logto? Necessario para criar `identity_link` e `platform_role_assignments` manualmente em dev | Necessario para testar login completo |
| Banco dev/staging isolado | Ainda nao confirmado. Sem banco dev/staging, o teste do fluxo completo (requireUser → identity_link → platform_role) nao pode ser executado | Bloqueia teste de fluxo completo |
| Sprint 1L pode criar rotas reais de auth? | Paulo deve confirmar que pode criar `app/auth/*/route.ts` no `/control` | Bloqueia toda a Sprint 1L se nao confirmado |
| Sprint 1L pode alterar `middleware.ts`? | Alteracao mais sensivelprotege rotas privadas. Requer autorizacao explicita. | Critico para protecao de rotas |
| `CONTROL_DEV_URL` como env separada? | Criar `CONTROL_DEV_URL=http://localhost:3001` para nao depender de `NEXT_PUBLIC_APP_URL` em dev | Clareza de configuracao por ambiente |

---

## 16. Proxima sprint recomendada

```txt
Sprint 1L — Implementar rotas Logto e middleware inicial do /control, mantendo Supabase em paralelo
```

Premissa: Paulo confirma as decisoes da secao 15 antes de iniciar a Sprint 1L.

Escopo autorizado da Sprint 1L:

- criar `apps/control/lib/logto.ts`;
- criar `apps/control/app/auth/sign-in/route.ts`;
- criar `apps/control/app/auth/sign-out/route.ts`;
- criar `apps/control/app/auth/callback/route.ts`;
- ajustar `apps/control/middleware.ts` para proteger rotas e liberar publicas;
- validar TypeScript;
- testar login/logout Logto manualmente no browser;
- confirmar que login Supabase antigo continua funcionando;
- criar relatorio da Sprint 1L.

Escopo BLOQUEADO na Sprint 1L (so com confirmacao adicional):

- alterar `app/(protected)/layout.tsx` para usar Logto (depende de banco dev/staging);
- criar `identity_link` do primeiro platform_owner (depende de banco dev/staging e decisao de Paulo);
- remover qualquer codigo Supabase;
- migrar `apps/core`.
