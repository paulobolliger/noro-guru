# Sprint 1M - Plano de Bootstrap do Platform Owner e Seed Script

Data de referencia: 2026-05-27

Status: implementacao local concluida. Seed script criado e validado. Nenhum banco acessado. Nenhuma alteracao executada no banco.

---

## 1. Resumo executivo

A Sprint 1M preparou o bootstrap do primeiro `platform_owner` (`paulobolliger@gmail.com`) sem executar nada contra o banco real.

O que foi feito:

- Leitura e analise dos schemas `noro.users`, `noro.identity_links` e `noro.platform_role_assignments`;
- Leitura dos repositorios: `usersRepository`, `authIdentityRepository`, `platformRolesRepository`;
- Criacao do script `scripts/seed-platform-owner.ts` com guards de segurança, modo dry-run e comportamento idempotente;
- Validacao TypeScript do script: passou sem erros;
- Scan de seguranca: sem ocorrencias proibidas.

O que NAO foi feito:

- Nenhuma execucao do script contra qualquer banco;
- Nenhuma migration aplicada;
- Nenhum SQL executado;
- Nenhum banco dev/staging acessado;
- Nenhum app alterado (`apps/control`, `apps/core`, `apps/sites`, `apps/web`).

---

## 2. Analise do estado atual

### 2.1 Dependencias necessarias para fluxo completo

Para que o fluxo Logto funcione de ponta a ponta no `/control` (login → callback → acesso ao painel), os seguintes registros precisam existir no banco:

| Tabela | Registro necessario |
| --- | --- |
| `noro.users` | Linha com `email=paulobolliger@gmail.com` |
| `noro.identity_links` | Linha com `provider=logto`, `provider_subject=<sub_do_logto>`, `user_id=<id_do_usuario>` |
| `noro.platform_role_assignments` | Linha com `user_id=<id_do_usuario>`, `role=platform_owner`, `status=active` |

### 2.2 Bloqueio atual

- O banco dev/staging isolado ainda nao foi confirmado por Paulo.
- O `sub` do Logto para `paulobolliger@gmail.com` ainda nao foi capturado.
- O TODO de protecao Logto no `middleware.ts` continua comentado.
- O layout protegido `apps/control/app/(protected)/layout.tsx` ainda usa guard Supabase.

---

## 3. Modelo de bootstrap

A sequencia de insercao e obrigatoriamente nessa ordem:

```
1. noro.users             → gera user.id
2. noro.identity_links    → usa user.id + sub do Logto
3. noro.platform_role_assignments → usa user.id
```

Qualquer alteracao nessa ordem resultara em erro de FK.

### 3.1 Schema noro.users

```sql
-- referencia: packages/db/schema/users.ts
id           uuid DEFAULT gen_random_uuid() PRIMARY KEY
display_name text NOT NULL
email        text NOT NULL UNIQUE
status       text NOT NULL DEFAULT 'active'  -- 'active' | 'invited' | 'blocked' | 'archived'
created_at   timestamp DEFAULT now()
updated_at   timestamp DEFAULT now()
```

### 3.2 Schema noro.identity_links

```sql
-- referencia: packages/db/schema/identity-links.ts
id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id               uuid NOT NULL REFERENCES noro.users(id)
provider              text NOT NULL  -- 'logto' | 'supabase'
provider_subject      text NOT NULL  -- ctx.claims.sub (campo sub do JWT Logto)
provider_email        text
UNIQUE (provider, provider_subject)
```

### 3.3 Schema noro.platform_role_assignments

```sql
-- referencia: packages/db/schema/roles.ts
id               uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id          uuid NOT NULL REFERENCES noro.users(id)
role             text NOT NULL  -- 'platform_owner' | 'platform_admin' | ...
status           text NOT NULL DEFAULT 'active'
granted_by_user_id uuid NULL REFERENCES noro.users(id)
UNIQUE (user_id, role)
```

---

## 4. Como obter o sub do Logto

O campo `sub` e o identificador unico do usuario no Logto (campo `sub` do JWT de identidade, conforme OIDC).

**Passo a passo:**

1. Certifique-se de que o servidor Logto esta acessivel em `https://auth.norotec.cloud`.
2. Acesse o painel Admin do Logto em `https://auth.norotec.cloud/console` (ou o endpoint administrativo configurado).
3. Navegue em **Users** e procure por `paulobolliger@gmail.com`.
4. O campo **User ID** exibido e o `sub` que deve ser passado como `--logto-sub` no script.

**Alternativa via JWT (se o painel nao estiver disponivel):**

1. Inicie `apps/control` localmente (`npm run dev -w apps/control`).
2. Acesse `http://localhost:3001/auth/sign-in` no browser.
3. Complete o login com `paulobolliger@gmail.com` no Logto.
4. No callback `/auth/callback`, o `sub` estara no JWT retornado.
5. Capture via log temporario no `apps/control/app/auth/callback/route.ts`:
   ```typescript
   import { getLogtoContext } from '@logto/next/server-actions';
   const ctx = await getLogtoContext(logtoConfig);
   console.log('[DEBUG] sub:', ctx.claims?.sub);
   ```
   **Remover o log apos capturar o sub.**

---

## 5. Script de seed: scripts/seed-platform-owner.ts

### 5.1 Localizacao

`scripts/seed-platform-owner.ts`

### 5.2 Como executar (apenas em banco dev/staging isolado)

```bash
# Obrigatorio:
export ALLOW_NORO_SEED=true
export DATABASE_URL="postgresql://usuario:senha@host-dev:5432/banco_dev"

# Dry-run (recomendado primeiro):
npx tsx scripts/seed-platform-owner.ts \
  --email paulobolliger@gmail.com \
  --logto-sub <sub_do_logto> \
  --display-name "Paulo Bolliger" \
  --dry-run

# Execucao real (apenas apos confirmar dry-run):
npx tsx scripts/seed-platform-owner.ts \
  --email paulobolliger@gmail.com \
  --logto-sub <sub_do_logto> \
  --display-name "Paulo Bolliger"
```

### 5.3 Guards de seguranca

O script recusa execucao nas seguintes condicoes (verificadas antes de qualquer conexao ao banco):

| Condicao | Mensagem de bloqueio |
| --- | --- |
| `NODE_ENV=production` | NODE_ENV=production detectado. Recusando execucao. |
| `ALLOW_NORO_SEED !== 'true'` | ALLOW_NORO_SEED nao esta definido como "true". |
| `DATABASE_URL` contem `45.32.169.173` | DATABASE_URL contem o host de producao. Use apenas banco dev/staging isolado. |

### 5.4 Comportamento idempotente

O script verifica antes de cada insercao:

| Passo | Verificacao | Acao |
| --- | --- | --- |
| 1. noro.users | `getUserByEmail(email)` | Se existir: reutiliza. Se nao: cria. |
| 2. noro.identity_links | `findUserByProviderSubject('logto', sub)` | Se existir: pula. Se nao: cria. |
| 3. noro.platform_role_assignments | `hasPlatformRole(userId, 'platform_owner')` | Se existir: pula. Se nao: cria. |

Nunca deleta registros. Pode ser re-executado com seguranca.

### 5.5 Modo dry-run

Com `--dry-run`, o script:
- Executa todas as verificacoes de seguranca;
- Consulta o banco para checar existencia dos registros;
- Exibe o que seria feito (INSERTs simulados);
- Nao escreve nada.

---

## 6. Seguranca

| Verificacao | Resultado |
| --- | --- |
| Nenhum app alterado | confirmado |
| Nenhum banco acessado | confirmado |
| Nenhuma migration gerada | confirmado |
| Nenhum SQL executado | confirmado |
| Nenhum import Supabase no script | confirmado |
| Nenhum `.from(...)` no script | confirmado |
| Nenhum `auth.users` no script | confirmado |
| Nenhum `auth.uid()` no script | confirmado |
| Appwrite nao reintroduzido | confirmado |
| Nenhum segredo hardcoded | confirmado |
| `45.32.169.173` apenas como constante de detecao | confirmado |
| `ALLOW_NORO_SEED` obrigatorio | confirmado |
| TypeScript validado sem erros | confirmado |
| Scan de seguranca aprovado | confirmado |

---

## 7. Pendencias

| Pendencia | Descricao |
| --- | --- |
| Banco dev/staging isolado | Paulo precisa confirmar o banco alvo antes de qualquer execucao |
| Sub do Logto de paulobolliger@gmail.com | Necessario para `--logto-sub` no script |
| Execucao do seed | Bloqueada ate banco dev/staging confirmado |
| Ativacao do middleware Logto global | TODO em `apps/control/middleware.ts` aguarda bootstrap validado |
| Migracao do layout protegido para Logto | `apps/control/app/(protected)/layout.tsx` aguarda bootstrap |
| Teste manual do fluxo completo | Nao executado; depende de banco dev/staging e bootstrap |

---

## 8. Proxima sprint recomendada

```txt
Sprint 1N — Executar bootstrap do platform_owner em banco dev/staging e validar fluxo completo
```

**Pre-requisitos para Sprint 1N:**

1. Paulo confirma banco dev/staging isolado (host, porta, database, usuario, senha).
2. Paulo captura o `sub` do Logto para `paulobolliger@gmail.com` (via painel Admin Logto ou log temporario).
3. Backup/dump do banco dev/staging e confirmado (precaucao mesmo em dev).

**Escopo da Sprint 1N:**

1. Executar `scripts/seed-platform-owner.ts --dry-run` para confirmar o que sera inserido.
2. Executar o script sem `--dry-run` para criar os registros.
3. Confirmar que os tres registros existem no banco (`noro.users`, `noro.identity_links`, `noro.platform_role_assignments`).
4. Testar fluxo no browser: `http://localhost:3001/auth/sign-in` → Logto → `/auth/callback` → `/`.
5. Ajustar `apps/control/app/(protected)/layout.tsx` para aceitar sessao Logto (sem remover guard Supabase ainda).
6. Descomentar e ativar protecao Logto no `middleware.ts`.
7. Confirmar que o acesso ao painel funciona end-to-end com login Logto.

**Criterios de conclusao da Sprint 1N:**

- Platform_owner existe nos tres registros do banco dev/staging.
- Login Logto completa sem erros.
- Painel `/control` carrega apos login Logto.
- Guard Supabase continua funcionando para usuarios existentes.
- Nenhum banco de producao acessado.
