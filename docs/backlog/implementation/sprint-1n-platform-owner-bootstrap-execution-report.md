# Sprint 1N - Relatorio de Execucao do Bootstrap do Platform Owner

Data de referencia: 2026-05-27

Status: **BLOQUEADA** — variaveis criticas nao fornecidas. Nenhum banco acessado. Nenhuma alteracao executada.

---

## 1. Resumo executivo

| Item | Status |
| --- | --- |
| Banco dev/staging confirmado | **NÃO** — `DEV_STAGING_DATABASE_URL` nao foi fornecido |
| Sub do Logto informado | **NÃO** — `PLATFORM_OWNER_LOGTO_SUB` nao foi fornecido |
| Dry-run executado | **NÃO** — bloqueado pela ausencia das variaveis acima |
| Seed real executado | **NÃO** — bloqueado pelo criterio: dry-run deve preceder seed real |
| Registros criados/reutilizados | **NENHUM** — nenhuma escrita no banco |
| Teste de fluxo Logto | **NÃO** — nao executado |

A sprint foi bloqueada por criterio obrigatorio:

> Se `PLATFORM_OWNER_LOGTO_SUB` ou `DEV_STAGING_DATABASE_URL` nao estiverem preenchidos, pare a sprint, nao execute nada e registre bloqueio.

Ambas as variaveis foram recebidas com os placeholders originais sem substituicao:

```txt
PLATFORM_OWNER_LOGTO_SUB=<PREENCHER_COM_SUB_REAL_DO_LOGTO>
DEV_STAGING_DATABASE_URL=<PREENCHER_COM_DATABASE_URL_DEV_STAGING>
```

---

## 2. Banco alvo

Nenhum banco foi acessado. Nenhum `DATABASE_URL` foi utilizado.

A producao nao foi acessada. O host `45.32.169.173` nao foi acessado.

---

## 3. Comandos executados

Apenas comandos de validacao local sem conexao ao banco:

```bash
# 1. Verificacao de trabalho parcial
git status --short

# 2. Validacao TypeScript do script
node_modules/.bin/tsc.cmd --noEmit --skipLibCheck \
  --module esnext --moduleResolution bundler \
  --target esnext --esModuleInterop true --strict true \
  scripts/seed-platform-owner.ts

# 3. Varredura de seguranca no script
grep -n "@supabase|supabase.auth|auth.users|auth.uid|\.from(|Appwrite|CREATE TABLE|ALTER TABLE|NEXT_PUBLIC_.*SECRET" \
  scripts/seed-platform-owner.ts

# 4. Confirmacao de guards obrigatorios
grep -n "NODE_ENV|ALLOW_NORO_SEED|45\.32\.169\.173|dry.run|dryRun" \
  scripts/seed-platform-owner.ts
```

Nenhum comando que conecte ao banco foi executado.

---

## 4. Resultado do dry-run

**Nao executado.** Bloqueado pela ausencia de `DEV_STAGING_DATABASE_URL` e `PLATFORM_OWNER_LOGTO_SUB`.

---

## 5. Resultado do seed real

**Nao executado.** Bloqueado pelo criterio: dry-run deve preceder o seed real, e o dry-run nao pode ser executado sem as variaveis criticas.

---

## 6. Validacao pos-seed

**Nao aplicavel.** Nenhuma escrita foi feita.

---

## 7. Validacoes concluidas nesta sprint

Embora o seed nao tenha podido ser executado, as seguintes validacoes locais foram concluidas com sucesso:

| Verificacao | Resultado |
| --- | --- |
| `scripts/seed-platform-owner.ts` existe | confirmado |
| TypeScript sem erros | confirmado — tsc passou sem output |
| Varredura de seguranca | confirmado — sem ocorrencias proibidas |
| Guard `NODE_ENV=production` presente | confirmado — linha 73 |
| Guard `ALLOW_NORO_SEED !== 'true'` presente | confirmado — linha 77 |
| Guard host de producao `45.32.169.173` presente | confirmado — linha 85 |
| Modo `--dry-run` implementado | confirmado — linha 61 |
| Comportamento idempotente implementado | confirmado — check-before-insert nos 3 passos |
| Nenhum trabalho parcial de Sprint 1N encontrado | confirmado — via `git status` |

---

## 8. Teste Logto

**Nao executado.** Dependia do bootstrap do platform_owner, que nao pode ocorrer sem as variaveis criticas.

---

## 9. Seguranca

| Verificacao | Resultado |
| --- | --- |
| Producao nao acessada | confirmado |
| Banco da VPS (`45.32.169.173`) nao acessado | confirmado |
| Nenhuma migration aplicada | confirmado |
| Nenhum Drizzle push | confirmado |
| Nenhum Supabase migration | confirmado |
| Supabase runtime intacto | confirmado — nao alterado |
| Nenhum app alterado (`apps/control`, `apps/core`, etc.) | confirmado |
| Nenhum segredo exposto ou hardcoded | confirmado |
| `apps/control/app/(protected)/layout.tsx` nao alterado | confirmado |
| Middleware Logto global nao ativado | confirmado — TODO permanece comentado |

---

## 10. O que Paulo precisa fornecer para desbloquear

### 10.1 Banco dev/staging isolado

Paulo precisa confirmar e fornecer:

- `DATABASE_URL` no formato: `postgresql://usuario:senha@host-dev:5432/nome_banco`
- Confirmacao de que o host **nao e** `45.32.169.173` (banco de producao)
- Confirmacao de que e um banco isolado para dev/staging

### 10.2 Sub do Logto para paulobolliger@gmail.com

Paulo precisa capturar o `sub` do JWT de identidade Logto. Opcoes:

**Opcao A — Painel Admin Logto:**

1. Acessar o painel Admin do Logto (endpoint administrativo configurado em `https://auth.norotec.cloud`).
2. Navegar em **Users**.
3. Buscar por `paulobolliger@gmail.com`.
4. O campo **User ID** e o `sub`.

**Opcao B — Log temporario no callback (se painel indisponivel):**

1. Adicionar temporariamente ao `apps/control/app/auth/callback/route.ts`:
   ```typescript
   import { getLogtoContext } from '@logto/next/server-actions';
   const ctx = await getLogtoContext(logtoConfig);
   console.log('[DEBUG TEMPORARIO] logto sub:', ctx.claims?.sub);
   ```
2. Iniciar `apps/control` localmente (`npm run dev -w apps/control`).
3. Acessar `http://localhost:3001/auth/sign-in` e fazer login com `paulobolliger@gmail.com`.
4. Capturar o `sub` nos logs do terminal.
5. **Remover o log imediatamente apos capturar.**

---

## 11. Proxima sprint recomendada

```txt
Sprint 1N (re-execucao) — Executar bootstrap do platform_owner apos confirmacao das variaveis bloqueantes
```

**Pre-requisitos para desbloquear a Sprint 1N:**

1. Paulo fornece `DEV_STAGING_DATABASE_URL` (banco isolado, sem `45.32.169.173`).
2. Paulo fornece `PLATFORM_OWNER_LOGTO_SUB` (sub real de `paulobolliger@gmail.com` no Logto).
3. Paulo autoriza explicitamente a execucao do seed.

**Sequencia de execucao apos desbloqueio:**

```bash
# Etapa 2 — dry-run obrigatorio primeiro
ALLOW_NORO_SEED=true \
DATABASE_URL="<DEV_STAGING_DATABASE_URL>" \
npx tsx scripts/seed-platform-owner.ts \
  --email paulobolliger@gmail.com \
  --logto-sub <PLATFORM_OWNER_LOGTO_SUB> \
  --display-name "Paulo Bolliger" \
  --dry-run

# Etapa 3 — seed real (somente se dry-run passar)
ALLOW_NORO_SEED=true \
DATABASE_URL="<DEV_STAGING_DATABASE_URL>" \
npx tsx scripts/seed-platform-owner.ts \
  --email paulobolliger@gmail.com \
  --logto-sub <PLATFORM_OWNER_LOGTO_SUB> \
  --display-name "Paulo Bolliger"
```

**Resultado esperado apos desbloqueio:**

- `noro.users`: linha com `email=paulobolliger@gmail.com`, `status=active`
- `noro.identity_links`: linha com `provider=logto`, `provider_subject=<sub>`, `user_id=<id>`
- `noro.platform_role_assignments`: linha com `role=platform_owner`, `status=active`, `user_id=<id>`

**Apos seed confirmado:** testar `/auth/sign-in` → Logto → `/auth/callback` → `/`. Comportamento esperado nesta fase: cair no guard Supabase antigo e **nao tentar corrigir ainda** — isso e escopo da Sprint 1O.
