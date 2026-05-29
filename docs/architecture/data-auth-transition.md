# Data And Auth Transition

Data de referencia: 2026-05-27

## 1. Objetivo

Este documento define a transicao de dados e autenticacao da NORO.

Estado alvo:

- PostgreSQL na VPS como banco oficial;
- Drizzle como camada padrao de acesso a dados;
- Logto como provedor oficial de autenticacao;
- Supabase apenas como legado transicional ate a remocao completa.

Decisao fechada: Supabase sera completamente substituido pelo conjunto PostgreSQL/Drizzle/Logto. A coexistencia com Supabase existe apenas enquanto a migracao esta em andamento.

Decisao fechada: Logto e a camada oficial de autenticacao da NORO. O servico ja esta configurado na VPS e pronto para uso durante a migracao.

Resposta direta: sim, durante a migracao o projeto pode ficar um tempo com Supabase e Logto coexistindo. Essa coexistencia deve ser curta, rastreada e com fronteiras claras. Ela nao deve ser tratada como arquitetura final nem como opcao permanente.

## 2. Decisao Arquitetural

| Tema | Decisao |
| --- | --- |
| Banco oficial | PostgreSQL via `DATABASE_URL` |
| ORM/acesso novo | `packages/db` com Drizzle/Postgres |
| Auth oficial | Logto via `packages/auth`; servico ja configurado na VPS |
| Supabase Auth | Legado a substituir |
| Supabase Client | Legado a substituir por repositorios/servicos Drizzle |
| Supabase Storage | Legado a substituir por provider de arquivos |
| Supabase migrations/functions | Historico congelado, nao executar contra o banco restaurado |
| Appwrite | Eliminado como alvo arquitetural |

## 3. Estado Atual Resumido

Ja existem bases novas:

- `packages/db/index.ts` cria conexao PostgreSQL/Drizzle;
- `packages/auth/index.ts` define `AuthProvider = 'logto'` e le envs `LOGTO_*`;
- Logto ja esta configurado na VPS e pronto para integracao no runtime dos apps;
- `supabase/FROZEN.md` e `supabase/README.md` travam o uso operacional de migrations/functions Supabase;
- `docs/architecture/supabase-residue-report.md` mapeia residuos Supabase no runtime.

Mas o runtime ainda usa Supabase:

- login em `apps/control/app/login/page.tsx`;
- sessoes em layouts, actions e APIs de `apps/control`;
- queries `.from(...)` em CRM, tenants, pedidos, financeiro, suporte e sites;
- storage de arquivos, como `tenant-logos`.

## 4. Coexistencia Temporaria

Durante a transicao, a coexistencia aceitavel e:

```txt
Logto
  -> novo login e nova sessao oficial
  -> identidade canonica do usuario
  -> protecao de rotas novas

Supabase Auth
  -> apenas rotas/telas antigas ainda nao migradas
  -> sem novos fluxos
  -> sem novas dependencias
  -> removido ao final da sprint de auth
```

Regra central:

```txt
Codigo novo nao deve chamar supabase.auth.
Codigo novo nao deve criar novo cliente Supabase.
Codigo novo deve usar packages/auth e packages/db.
```

## 5. Modelo De Identidade

O ponto critico da migracao e preservar relacao usuario/tenant.

Modelo recomendado:

| Campo | Origem | Uso |
| --- | --- | --- |
| `auth_provider` | Sistema | `logto` durante e apos migracao |
| `auth_subject` | Logto | ID canonico do usuario no provedor |
| `legacy_supabase_user_id` | Supabase | Ponte temporaria para dados antigos |
| `email` | Logto/Supabase | Reconciliacao inicial |
| `tenant_id` | PostgreSQL | Escopo de acesso |
| `role` | PostgreSQL | Autorizacao interna |
| `status` | PostgreSQL | Ativo, pendente, bloqueado |

Tabela/estrutura sugerida:

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

Logto deve responder:

- quem e o usuario;
- se a sessao e valida;
- claims basicas do usuario.

PostgreSQL deve responder:

- a qual tenant o usuario pertence;
- qual papel/permissao ele possui;
- quais recursos ele pode acessar;
- status operacional do usuario dentro da NORO.

Evitar:

- usar Logto como banco de permissoes operacionais complexas;
- duplicar regras de tenant em Supabase RLS e em Drizzle ao mesmo tempo;
- manter Supabase Auth e Logto como caminhos permanentes de login.

## 7. Plano De Migracao

### Sprint 0: Travas

Objetivo: parar de aumentar o acoplamento.

1. Manter `supabase/README.md` como frozen legacy.
2. Proibir novos imports de `@supabase/*` em codigo novo.
3. Documentar todos os pontos que usam `supabase.auth`.
4. Definir envs Logto obrigatorias por ambiente.

Criterio de aceite:

- docs principais indicam PostgreSQL/Drizzle/Logto como alvo;
- Supabase aparece apenas como legado transicional.

### Sprint 1: Bootstrap Logto

Objetivo: Logto funcionar de ponta a ponta em ambiente controlado.

1. Instalar/configurar SDK Logto adequado ao Next.js.
2. Implementar login/logout/callback no `apps/control`.
3. Criar helper canonico em `packages/auth`:
   - `getCurrentUser()`;
   - `requireUser()`;
   - `getSessionClaims()`;
   - `signOut()`.
4. Definir cookies/session strategy.
5. Validar fluxo em dev/staging.

Criterio de aceite:

- usuario consegue entrar e sair via Logto;
- rotas novas conseguem ler usuario atual sem Supabase Auth.

### Sprint 2: Ponte De Identidade

Objetivo: permitir que usuarios Logto acessem dados ainda modelados com IDs antigos.

1. Criar coluna ou tabela de mapeamento para `legacy_supabase_user_id`.
2. Reconciliar usuarios por email.
3. Mapear memberships de tenant.
4. Criar helper de tenant atual baseado no usuario Logto.

Criterio de aceite:

- usuario Logto resolve `user_id` interno;
- usuario Logto resolve tenants e roles;
- telas migradas nao dependem de `supabase.auth.getUser()`.

### Sprint 3: Migracao Das Rotas Protegidas

Objetivo: substituir Supabase Auth no Control.

Ordem sugerida:

1. `apps/control/app/(protected)/layout.tsx`
2. `apps/control/app/login/page.tsx`
3. `apps/control/components/TopBar.tsx`
4. APIs de suporte/search/tasks/tenants
5. actions de configuracao, users, api-keys e webhooks

Criterio de aceite:

- `rg "supabase.auth" apps/control` sem ocorrencias funcionais;
- login, logout e layout protegido usam Logto;
- permissoes continuam baseadas no PostgreSQL.

### Sprint 4: Migracao De Dados Para Drizzle

Objetivo: substituir Supabase Client como camada de dados.

Ordem sugerida:

1. Tenants e memberships.
2. Usuarios e permissoes.
3. CRM: leads/clientes.
4. Orcamentos e pedidos.
5. Financeiro/cobrancas.
6. Suporte/comunicacao/notificacoes.
7. Sites gerados.

Criterio de aceite:

- modulos migrados usam `packages/db`;
- queries criticas saem de `.from(...)` para Drizzle/SQL tipado;
- nao ha novas chamadas Supabase em modulos migrados.

### Sprint 5: Storage E Limpeza

Objetivo: remover dependencias restantes.

1. Definir provider de arquivos.
2. Migrar `tenant-logos` e demais assets.
3. Remover exports Supabase de `packages/lib`.
4. Remover `apps/control/lib/supabase*`.
5. Remover dependencias `@supabase/*`.
6. Arquivar ou remover pasta `supabase/` quando nao houver runtime dependente.

Criterio de aceite:

- `rg "@supabase|supabase.auth|@noro/lib/supabase|@/lib/supabase" apps packages` sem ocorrencias funcionais;
- build/typecheck dos apps principais passa;
- docs citam Supabase apenas como historico.

## 8. O Que Nao Fazer

- Nao criar novas migrations Supabase.
- Nao rodar `supabase db push` ou `supabase db pull` contra o banco restaurado.
- Nao implementar novos fluxos usando Supabase Auth.
- Nao migrar billing Asaas sobre um modelo de auth indefinido.
- Nao apagar Supabase fisicamente antes de substituir runtime dependente.
- Nao manter Supabase e Logto como dois logins permanentes.

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

1. Logto como auth oficial.
2. Tenant/membership em PostgreSQL.
3. Dados centrais em Drizzle.
4. PaymentProviderInterface.
5. Asaas.

## 10. Indicadores De Progresso

| Indicador | Meta |
| --- | --- |
| `supabase.auth` em `apps/control` | zero ocorrencias funcionais |
| Imports `@supabase/*` em codigo novo | zero |
| Rotas protegidas usando Logto | 100% |
| Tenants resolvidos via PostgreSQL | 100% |
| Supabase Storage em uploads novos | zero |
| Pasta `supabase/` | historico ou removida apos runtime independente |

## 11. Fontes Relacionadas

- `docs/architecture/current-state.md`
- `docs/architecture/supabase-residue-report.md`
- `supabase/FROZEN.md`
- `supabase/README.md`
- `scripts/README.md`: politica oficial para scripts, migrations, seeds, bootstrap e automacoes que possam alterar dados, schema, auth ou providers legados.
