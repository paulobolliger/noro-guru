# Data And Auth Transition

Data de referencia: 2026-08-14 (revisado — substitui a versão de 2026-05-27, que tinha Logto como alvo de auth)

> **Nota**: este documento usava Logto como provedor oficial de auth. Decisão do operador em 2026-08-14: **Keycloak é o único provedor**, Logto está deprecado. A estrutura do plano abaixo (bootstrap → ponte de identidade → migrar rotas protegidas → migrar dados → storage/limpeza) continua válida — só o provedor de auth mudou. Onde este documento cita SDK/detalhes específicos do Logto, tratar como desatualizado; usar como referência técnica `C:\Users\paulo\0-dev\02-aplicacoes\000 norotec admin\noro\keycloak.md` (infra já provisionada: `keycloak-main` no Coolify, realm `noro` criado) e o precedente já implementado em Meus Políticos (Authorization Code Flow com PKCE S256, cookies HTTP-only criptografados AES-256-GCM).

## 1. Objetivo

Este documento define a transicao de dados e autenticacao da NORO.

Estado alvo:

- PostgreSQL na VPS/Coolify (`noro_guru_db`) como banco oficial — não Neon, não Supabase;
- Drizzle como camada padrao de acesso a dados;
- **Keycloak** como provedor oficial de autenticacao (realm `noro`) — não Logto;
- Supabase e Neon apenas como legado transicional ate a remocao completa.

Decisao fechada: Supabase sera completamente substituido pelo conjunto PostgreSQL/Drizzle/Keycloak. A coexistencia com Supabase existe apenas enquanto a migracao esta em andamento.

Decisao fechada (revisada 2026-08-14): Keycloak e a camada oficial de autenticacao da NORO. O servico ja esta rodando no Coolify (`keycloak-main`), com realm `noro` criado e vazio, pronto para receber clients/configuração.

Resposta direta: durante a migracao o projeto pode ficar um tempo com Supabase Auth e Keycloak coexistindo (o mesmo já aconteceu antes com Supabase+Logto, agora substituído). Essa coexistencia deve ser curta, rastreada e com fronteiras claras. Ela nao deve ser tratada como arquitetura final nem como opcao permanente.

## 2. Decisao Arquitetural

| Tema | Decisao |
| --- | --- |
| Banco oficial | PostgreSQL central da VPS/Coolify via `DATABASE_URL` (`noro_guru_db`) |
| ORM/acesso novo | `packages/db` com Drizzle/Postgres |
| Auth oficial | **Keycloak** (realm `noro`) via `packages/auth`; servico ja rodando no Coolify |
| Logto | Deprecado (decisão 2026-08-14) — remover `@logto/next`, adapter e rotas `/auth/sign-in` etc. quando Keycloak estiver pronto |
| Supabase Auth | Legado a substituir |
| Supabase Client | Legado a substituir por repositorios/servicos Drizzle |
| Supabase Storage | Legado a substituir por provider de arquivos |
| Supabase migrations/functions | Historico congelado, nao executar contra o banco restaurado |
| Neon | Depreciado — banco de dev/staging da trilha Codex/Foundation; dados/migrations precisam ser reconciliados contra `noro_guru_db` |
| Appwrite | Eliminado como alvo arquitetural |

## 3. Estado Atual Resumido

Ja existem bases novas:

- `packages/db/index.ts` cria conexao PostgreSQL/Drizzle;
- `packages/auth/index.ts` define `AuthProvider = 'logto'` — **precisa mudar pra `'keycloak'`** quando a Fase 3 do roadmap de transição for implementada;
- Logto foi parcialmente integrado em `apps/control` (rotas `/auth/sign-in`, `/auth/callback`, `/auth/sign-out` da Sprint 1L) mas **nunca chegou a guardar rotas protegidas de verdade** — o layout `(protected)` continuou usando o guard Supabase. Esse trabalho fica como histórico; não é a base pra continuar, é código a remover na migração pra Keycloak;
- Keycloak ja esta rodando no Coolify, realm `noro` criado, pronto pra receber configuração de client;
- `supabase/FROZEN.md` e `supabase/README.md` travam o uso operacional de migrations/functions Supabase;
- `docs/architecture/supabase-residue-report.md` mapeia residuos Supabase no runtime.

Mas o runtime ainda usa Supabase:

- login em `apps/control/app/login/page.tsx`;
- sessoes em layouts, actions e APIs de `apps/control` e `apps/core`;
- queries `.from(...)` em CRM, tenants, pedidos, financeiro, suporte e sites;
- storage de arquivos, como `tenant-logos`.

## 4. Coexistencia Temporaria

Durante a transicao, a coexistencia aceitavel e:

```txt
Keycloak
  -> novo login e nova sessao oficial
  -> identidade canonica do usuario
  -> protecao de rotas novas

Supabase Auth
  -> apenas rotas/telas antigas ainda nao migradas
  -> sem novos fluxos
  -> sem novas dependencias
  -> removido ao final da sprint de auth

Logto
  -> nenhum uso novo, mesmo em paralelo
  -> código existente (Sprint 1L) é removido junto da migração pra Keycloak, não mantido como terceira via
```

Regra central:

```txt
Codigo novo nao deve chamar supabase.auth.
Codigo novo nao deve criar novo cliente Supabase.
Codigo novo nao deve usar Logto (@logto/next, logto-session-adapter).
Codigo novo deve usar packages/auth (Keycloak) e packages/db.
```

## 5. Modelo De Identidade — dois níveis

Além da ponte usuário legado ↔ usuário novo, o modelo de identidade da NORO tem **dois níveis** (decisão do operador, 2026-08-13/14), que Keycloak precisa representar:

- **Nível 1** — usuários da própria Noro e das agências/tenants (quem loga em `control.noro.guru` e `app.noro.guru`). Fica dentro do realm `noro`.
- **Nível 2** — clientes finais de cada tenant (viajantes, quem usa `xyz.agencia.noro.guru/portal`). Ainda em aberto se migra pro mesmo realm `noro` (via grupos/Organizations por tenant) ou se o `apps/portal` mantém seu magic link próprio — ver Fase 3 do roadmap de transição, decisão pendente do operador.

O ponto critico da migracao pro Nível 1 e preservar relacao usuario/tenant.

Modelo recomendado:

| Campo | Origem | Uso |
| --- | --- | --- |
| `auth_provider` | Sistema | `keycloak` durante e apos migracao |
| `auth_subject` | Keycloak | ID canonico do usuario no provedor (`sub` do realm `noro`) |
| `legacy_supabase_user_id` | Supabase | Ponte temporaria para dados antigos |
| `email` | Keycloak/Supabase | Reconciliacao inicial |
| `tenant_id` | PostgreSQL | Escopo de acesso |
| `role` | PostgreSQL | Autorizacao interna |
| `status` | PostgreSQL | Ativo, pendente, bloqueado |

Tabela/estrutura sugerida (já existe como schema `noro.users`/`noro.identity_links` em `packages/db`, criada durante o trabalho de Logto — reaproveitar, só trocar o `provider`):

```txt
users
- id
- email
- name
- auth_provider
- auth_subject
- legacy_supabase_user_id
- status
- created_at

tenant_memberships
- id
- tenant_id
- user_id
- role
- status
- created_at
```

Observacao: os nomes finais devem seguir o schema real do PostgreSQL restaurado. O importante e separar identidade externa de permissao interna.

## 6. Fronteira Entre Auth E Autorizacao

Keycloak deve responder:

- quem e o usuario;
- se a sessao e valida;
- claims basicas do usuario.

PostgreSQL deve responder:

- a qual tenant o usuario pertence;
- qual papel/permissao ele possui;
- quais recursos ele pode acessar;
- status operacional do usuario dentro da NORO.

Evitar:

- usar Keycloak como banco de permissoes operacionais complexas;
- duplicar regras de tenant em Supabase RLS e em Drizzle ao mesmo tempo;
- manter Supabase Auth e Keycloak como caminhos permanentes de login;
- reintroduzir Logto como caminho paralelo "só pra não perder o trabalho já feito" — o trabalho da Sprint 1L não guardava rotas de verdade, o custo de manter é maior que o de remover.

## 7. Plano De Migracao

### Sprint 0: Travas

Objetivo: parar de aumentar o acoplamento.

1. Manter `supabase/README.md` como frozen legacy.
2. Proibir novos imports de `@supabase/*` em codigo novo.
3. Documentar todos os pontos que usam `supabase.auth`.
4. Definir envs Keycloak obrigatorias por ambiente (client ID, client secret, realm URL, callback URLs) — ver `noro/keycloak.md` pro padrão já usado em outros produtos.

Criterio de aceite:

- docs principais indicam PostgreSQL/Drizzle/Keycloak como alvo;
- Supabase e Neon aparecem apenas como legado transicional;
- Logto não aparece mais como alvo em nenhum doc.

### Sprint 1: Bootstrap Keycloak

Objetivo: Keycloak funcionar de ponta a ponta em ambiente controlado.

1. Criar client(s) OIDC no realm `noro` pra `apps/control` e `apps/core` (confidential, Authorization Code Flow, PKCE S256 — mesmo padrão já validado em Meus Políticos).
2. Implementar login/logout/callback no `apps/control` (rotas isoladas, ex. `/api/auth/keycloak/*`, sem alterar guard/sessão existente ainda — mesmo padrão de integração paralela usado no piloto Meus Políticos).
3. Criar helper canonico em `packages/auth`:
   - `getCurrentUser()`;
   - `requireUser()`;
   - `getSessionClaims()`;
   - `signOut()`.
4. Definir cookies/session strategy (HTTP-only, criptografado AES-256-GCM, state/nonce validados).
5. Validar fluxo em dev/staging (hostname de homologação do Keycloak antes de usar `login.*` de produção).

Criterio de aceite:

- usuario consegue entrar e sair via Keycloak;
- rotas novas conseguem ler usuario atual sem Supabase Auth nem Logto.

### Sprint 2: Ponte De Identidade

Objetivo: permitir que usuarios Keycloak acessem dados ainda modelados com IDs antigos.

1. Criar coluna ou tabela de mapeamento para `legacy_supabase_user_id`.
2. Reconciliar usuarios por email.
3. Mapear memberships de tenant.
4. Criar helper de tenant atual baseado no usuario Keycloak.
5. Resolver o modelo de Nível 2 (clientes finais) — ver seção 5.

Criterio de aceite:

- usuario Keycloak resolve `user_id` interno;
- usuario Keycloak resolve tenants e roles;
- telas migradas nao dependem de `supabase.auth.getUser()`.

### Sprint 3: Migracao Das Rotas Protegidas

Objetivo: substituir Supabase Auth (e remover Logto) no Control e no Core.

Ordem sugerida:

1. `apps/control/app/(protected)/layout.tsx`
2. `apps/control/app/login/page.tsx` (e remoção das rotas `/auth/sign-in` etc. do Logto)
3. `apps/control/components/TopBar.tsx`
4. APIs de suporte/search/tasks/tenants
5. actions de configuracao, users, api-keys e webhooks
6. `apps/core`: `getCurrentUser()`/`authService` (Supabase) → Keycloak

Criterio de aceite:

- `rg "supabase.auth|@logto" apps/control apps/core` sem ocorrencias funcionais;
- login, logout e layout protegido usam Keycloak;
- permissoes continuam baseadas no PostgreSQL.

### Sprint 4: Migracao De Dados Para Drizzle (contra `noro_guru_db`, não Neon)

Objetivo: substituir Supabase Client como camada de dados, e garantir que tudo aponta pro banco central da VPS.

Ordem sugerida:

1. Confirmar `DATABASE_URL` de cada app aponta pra `noro_guru_db` (não Neon).
2. Tenants e memberships.
3. Usuarios e permissoes.
4. CRM: leads/clientes.
5. Orcamentos e pedidos.
6. Financeiro/cobrancas.
7. Suporte/comunicacao/notificacoes.
8. Sites gerados.

Criterio de aceite:

- modulos migrados usam `packages/db` apontando pro Postgres central;
- queries criticas saem de `.from(...)` para Drizzle/SQL tipado;
- nao ha novas chamadas Supabase em modulos migrados;
- nao ha mais dependência de Neon em nenhum ambiente que não seja dev local pontual.

### Sprint 5: Storage E Limpeza

Objetivo: remover dependencias restantes.

1. Definir provider de arquivos (avaliar Cloudflare R2, já em uso via `cdn.noro.guru`/`S3_ENDPOINT`).
2. Migrar `tenant-logos` e demais assets.
3. Remover exports Supabase de `packages/lib`.
4. Remover `apps/control/lib/supabase*`.
5. Remover dependencias `@supabase/*` e `@logto/next`.
6. Arquivar ou remover pasta `supabase/` quando nao houver runtime dependente.

Criterio de aceite:

- `rg "@supabase|supabase.auth|@logto|@noro/lib/supabase|@/lib/supabase" apps packages` sem ocorrencias funcionais;
- build/typecheck dos apps principais passa;
- docs citam Supabase, Neon e Logto apenas como historico.

## 8. O Que Nao Fazer

- Nao criar novas migrations Supabase.
- Nao rodar `supabase db push` ou `supabase db pull` contra o banco restaurado.
- Nao implementar novos fluxos usando Supabase Auth.
- Nao implementar novos fluxos usando Logto — está deprecado, não é "mais uma opção".
- Nao migrar billing Asaas sobre um modelo de auth indefinido.
- Nao apagar Supabase fisicamente antes de substituir runtime dependente.
- Nao manter Supabase Auth e Keycloak como dois logins permanentes.
- Nao criar novo banco de dev/staging em Neon — usar o Postgres central da VPS mesmo em dev, quando possível.

## 9. Dependencia Com Billing Asaas

Billing depende diretamente de identidade e tenant.

Antes da implantacao Asaas ficar definitiva, a NORO precisa ter clareza sobre:

- usuario autenticado;
- tenant ativo;
- cliente final;
- pedido/cobranca;
- permissao para criar cobranca;
- webhook associando evento financeiro ao tenant correto.

Por isso, a ordem recomendada e:

1. Keycloak como auth oficial.
2. Tenant/membership em PostgreSQL.
3. Dados centrais em Drizzle (banco central da VPS).
4. PaymentProviderInterface, com capacidade de habilitar/desabilitar provider pelo control plane.
5. Asaas (já funcional em `apps/portal` e em parte de `apps/control`; falta migrar `apps/core` de e.Rede).

## 10. Indicadores De Progresso

| Indicador | Meta |
| --- | --- |
| `supabase.auth` em `apps/control`/`apps/core` | zero ocorrencias funcionais |
| `@logto/*` em qualquer app | zero ocorrencias |
| Imports `@supabase/*` em codigo novo | zero |
| Rotas protegidas usando Keycloak | 100% |
| Tenants resolvidos via PostgreSQL (banco central da VPS) | 100% |
| Supabase Storage em uploads novos | zero |
| Dependência de Neon fora de dev pontual | zero |
| Pasta `supabase/` | historico ou removida apos runtime independente |

## 11. Fontes Relacionadas

- `docs/architecture/current-state.md`
- `docs/architecture/supabase-residue-report.md`
- `C:\Users\paulo\0-dev\02-aplicacoes\000 norotec admin\noro\keycloak.md` (fora deste repo — estado real da infra Keycloak)
- `C:\Users\paulo\0-dev\02-aplicacoes\000 norotec admin\coolify\noro-guru-transition-roadmap.md` (fora deste repo — Fase 3 detalha a migração de auth)
- `supabase/FROZEN.md`
- `supabase/README.md`
- `scripts/README.md`: politica oficial para scripts, migrations, seeds, bootstrap e automacoes que possam alterar dados, schema, auth ou providers legados.
