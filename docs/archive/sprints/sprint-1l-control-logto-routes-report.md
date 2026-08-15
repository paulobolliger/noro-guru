# Sprint 1L - Relatorio De Implementacao Das Rotas Logto E Middleware Do /control

Data de referencia: 2026-05-27

Status: implementacao local concluida. Rotas Logto criadas. Middleware ajustado. Supabase Auth intacto. Nenhum banco acessado.

---

## 1. Resumo executivo

A Sprint 1L criou o fluxo Logto em `apps/control` em paralelo ao login Supabase existente.

O que foi criado:

- `apps/control/lib/logto.ts` — configuracao `LogtoNextConfig` lendo as envs `LOGTO_*`;
- `apps/control/app/auth/sign-in/route.ts` — inicia o fluxo de login Logto;
- `apps/control/app/auth/callback/route.ts` — recebe o callback Logto e persiste sessao;
- `apps/control/app/auth/sign-out/route.ts` — encerra sessao Logto.

O que foi ajustado:

- `apps/control/middleware.ts` — ampliado com lista explicita de rotas publicas e `matcher` mais preciso.

O que NAO foi alterado:

- `apps/control/app/login/page.tsx` — login Supabase intacto;
- `apps/control/app/(protected)/layout.tsx` — guard Supabase intacto;
- nenhum arquivo de `apps/core`, `apps/sites`, `apps/web`;
- nenhuma migration;
- nenhum banco acessado.

Estado atual: o fluxo Logto existe e e acessivel via `/auth/sign-in`. Porem, como ainda nao ha `identity_links` nem `platform_role_assignments` no banco, o fluxo completo (login → `requireUser()` → acesso ao painel) nao pode ser testado de ponta a ponta sem banco dev/staging confirmado.

---

## 2. Arquivos criados

| Arquivo | Descricao |
| --- | --- |
| `apps/control/lib/logto.ts` | `LogtoNextConfig` com leitura segura de envs; `requireEnv()` lanca erro claro se env ausente; `baseUrl` usa `NEXT_PUBLIC_APP_URL` com fallback `http://localhost:3001` |
| `apps/control/app/auth/sign-in/route.ts` | Route Handler GET que chama `signIn()` do `@logto/next/server-actions`; redireciona para servidor Logto; callback em `/auth/callback`; pos-login em `/` |
| `apps/control/app/auth/callback/route.ts` | Route Handler GET que chama `handleSignIn()` com os search params do callback; redireciona para `/` apos sucesso |
| `apps/control/app/auth/sign-out/route.ts` | Route Handler GET que chama `signOut()` do `@logto/next/server-actions`; redireciona para `/login` apos logout |
| `docs/backlog/implementation/sprint-1l-control-logto-routes-report.md` | Este relatorio |

---

## 3. Arquivos alterados

| Arquivo | Alteracao |
| --- | --- |
| `apps/control/middleware.ts` | Adicionada lista `PUBLIC_PREFIXES` com `/auth/`, `/login`, `/public/`, `/api/contato`, `/api/leads`, `/debug`, `/_next/`, `/favicon.ico`; `matcher` atualizado para excluir assets estaticos de forma precisa; redirect legacy `/admin/*` preservado; comentario TODO para ativacao futura de protecao Logto global |
| `docs/SPRINT_STATUS.md` | Atualizado com resultado da Sprint 1L |

---

## 4. Estrategia de middleware

### O que ficou publico

| Caminho | Motivo |
| --- | --- |
| `/auth/*` | Rotas Logto — devem ser sempre acessiveis; `/auth/callback` e CRITICO |
| `/login` | Login Supabase existente — nao pode ser bloqueado |
| `/public/*` | Formularios publicos (ex: `/public/leads/submit`) |
| `/api/contato` | API publica de contato |
| `/api/leads` | API publica de captura de leads |
| `/debug` | Pagina de debug (dev) |
| `/_next/*` | Assets Next.js (static, image) |
| `/favicon.ico` | Asset |
| Arquivos com extensao | `.png`, `.svg`, `.css`, `.js`, `.woff2`, etc. — via regex no `matcher` |

### Como /auth/callback foi protegido contra bloqueio

O prefix `/auth/` esta incluido em `PUBLIC_PREFIXES`. A funcao `isPublicPath()` verifica se o pathname comeca com qualquer um dos prefixos publicos. Como `/auth/callback` comeca com `/auth/`, ele sempre recebe `NextResponse.next()` sem interceptacao.

O `matcher` ampliado tambem exclui assets estaticos via regex, evitando que o middleware processe requests que nunca precisam de auth.

### Logto global foi ativado?

Nao. O bloco de protecao Logto global esta comentado como TODO no `middleware.ts`. Motivo: ainda nao ha `identity_links` nem `platform_role_assignments` no banco dev/staging. Ativar agora causaria que todos os usuarios do `/control` fossem redirecionados para `/auth/sign-in` e, apos login Logto bem-sucedido, receberiam `UserNotFoundError` ou `PlatformRoleRequiredError` do `requireUser()` — bloqueando acesso ao painel.

### Por que o layout Supabase permaneceu intacto

`apps/control/app/(protected)/layout.tsx` e o guard real de todas as rotas privadas. Ele usa `supabase.auth.getUser()` e verifica role `admin`/`super_admin` na tabela `noro_users`. Nao ha como substituir esse guard sem que o primeiro `platform_owner` tenha `identity_links` e `platform_role_assignments` no banco — o que depende de banco dev/staging confirmado. Trocar antes desse bootstrap bloquearia acesso ao painel para todos os usuarios atuais.

---

## 5. Validacao

Comandos executados:

```txt
git status --short
ls apps/control/lib/logto.ts
ls apps/control/app/auth/
node_modules/.bin/tsc.cmd -p apps/control/tsconfig.json --noEmit --skipLibCheck
grep -rn "@supabase|supabase.auth|auth.users|auth.uid|.from(|Appwrite|CREATE TABLE|ALTER TABLE" \
  apps/control/lib/logto.ts apps/control/app/auth/ apps/control/middleware.ts
git diff --name-only apps/control/
```

Resultados:

- TypeScript com tsconfig do app: **passou** (sem output de erros);
- Varredura de seguranca nos arquivos novos/alterados: **sem ocorrencias proibidas**;
- Git diff confirma que apenas `middleware.ts` foi alterado nos arquivos existentes;
- `apps/control/app/login/page.tsx` e `apps/control/app/(protected)/layout.tsx`: **nao alterados**.

Testes manuais no browser: nao executados nesta sprint. O ambiente local nao foi iniciado. O criterio de prontidao desta sprint nao exigia teste no browser — exigia apenas que o codigo compila e nao quebra o build.

---

## 6. Seguranca

| Verificacao | Resultado |
| --- | --- |
| Nenhum app alem de `apps/control` alterado | confirmado |
| `apps/control/app/login/page.tsx` nao alterado | confirmado |
| Layout protegido Supabase nao migrado | confirmado |
| Nenhum banco acessado | confirmado |
| Nenhuma migration aplicada | confirmado |
| Nenhum SQL executado | confirmado |
| Nenhum Supabase removido | confirmado |
| Nenhum segredo hardcoded | confirmado — todos os valores vem de `process.env`; `LOGTO_APP_SECRET` nunca em `NEXT_PUBLIC_*` |
| Nenhum import Supabase nos arquivos novos | confirmado |
| Nenhum `.from(...)` nos arquivos novos | confirmado |
| Nenhum `auth.users` nos arquivos novos | confirmado |
| Nenhum `auth.uid()` nos arquivos novos | confirmado |
| Appwrite nao reintroduzido | confirmado |
| `@logto/next` ja instalado — nenhuma nova dependencia | confirmado |

---

## 7. Pendencias

| Pendencia | Descricao |
| --- | --- |
| Banco dev/staging isolado | Nao confirmado; necessario para testar fluxo completo sem risco ao banco de producao |
| Bootstrap do primeiro platform_owner | `paulobolliger@gmail.com` definido como candidato; falta criar `users`, `identity_links` (provider=logto, provider_subject=sub_do_logto) e `platform_role_assignments` (role=platform_owner) no banco dev/staging |
| `identity_links` do platform_owner | Necessario para `requireUser()` nao lancar `UserNotFoundError` apos login Logto |
| `platform_role_assignments` do platform_owner | Necessario para `requirePlatformRole()` nao lancar `PlatformRoleRequiredError` |
| Troca do guard do layout protegido | `apps/control/app/(protected)/layout.tsx` precisa aceitar sessao Logto; bloqueado ate bootstrap do platform_owner |
| Ativacao do middleware Logto global | TODO comentado em `middleware.ts`; bloqueado ate bootstrap e validacao em banco dev/staging |
| Teste manual do fluxo completo no browser | Nao executado; depende de banco dev/staging e bootstrap do platform_owner |
| Estrategia de remocao posterior do Supabase Auth | Fase futura — nao antes de Logto estar validado em todos os apps |
| Mapeamento de usuarios Supabase → Logto | Necessario para usuarios existentes que migrarem de Supabase para Logto |

---

## 8. Proxima sprint recomendada

### Se banco dev/staging for confirmado:

```txt
Sprint 1M — Bootstrap do platform_owner e validacao do guard Logto do /control em dev/staging
```

Escopo:

- confirmar banco dev/staging isolado;
- criar seed script ou bootstrap manual para `paulobolliger@gmail.com`:
  - inserir em `noro.users`;
  - inserir em `noro.identity_links` (provider=logto, provider_subject=sub do Logto);
  - inserir em `noro.platform_role_assignments` (role=platform_owner, status=active);
- testar fluxo completo: `/auth/sign-in` → Logto → `/auth/callback` → `/` → guard layout Logto;
- ajustar `apps/control/app/(protected)/layout.tsx` para aceitar sessao Logto (sem remover guard Supabase);
- ativar protecao Logto no `middleware.ts` (descommentar TODO).

### Se banco dev/staging ainda nao for confirmado:

```txt
Sprint 1M — Confirmar banco dev/staging e planejar bootstrap do platform_owner
```

Escopo:

- Paulo confirma banco dev/staging (existente ou a criar);
- planejar seed script seguro;
- documentar opcoes de bootstrap;
- nao alterar banco de producao.
