# Auditoria do Projeto NORO — 2026-05-30

Data: 2026-05-30  
Escopo: todos os `.md` de `docs/`, `scripts/`, `supabase/` + varredura de código em `apps/` e `packages/`  
Objetivo: diagnóstico consolidado — sem propor soluções.

---

## 1. Sumário executivo

O projeto está operando em **dois trilhos paralelos** que nunca foram reconciliados:

- **Trilho Codex/Foundation** (sprints 0–4 em `docs/SPRINT_STATUS.md`): auth canônico Logto, schema Drizzle `noro.*`, CRM, produtos, propostas — banco Neon, nunca aplicado em produção.
- **Trilho Claude/Portal** (sprints P, 5-portal, Fase 1, 1B): portal do viajante, magic link, Asaas, documentos, itinerário, chat, emergência — usa o mesmo `packages/db` e o mesmo banco Neon, desenvolvido de forma independente.

Os dois trilhos compartilham o mesmo `packages/db`, as mesmas migrations (0000–0008) e o mesmo banco Neon de desenvolvimento. Nenhum dos dois está conectado ao banco de produção (VPS, `noro_guru_db`). A documentação descreve cada trilho de forma isolada e há conflitos diretos entre os dois.

---

## 2. Estado real de cada app

### apps/core (`app.noro.guru`)

**Rotas ativas em `app/(protected)/`:**

| Rota | Estado |
|---|---|
| `/` (dashboard) | Funcional |
| `/clientes`, `/clientes/[id]`, `/clientes/novo` | Funcional (Drizzle) |
| `/leads`, `/leads/novo` | Funcional (Drizzle) |
| `/orcamentos`, `/orcamentos/novo`, `/orcamentos/[id]`, `/orcamentos/[id]/editar` | Funcional; `/[id]` reconstruído na Sprint 1B com 5 tabs |
| `/pedidos`, `/pedidos/[id]`, `/pedidos/[id]/editar` | Funcional (legado Supabase?) |
| `/financeiro` | UI redesenhada, fonte de dados a confirmar |
| `/configuracoes`, `/configuracoes/emergencia`, `/configuracoes/redes-sociais` | `emergencia` novo (Sprint 1B); redes-sociais stub |
| `/comunicacao` | Mockado / banner "Em Desenvolvimento" |
| `/conteudo`, `/conteudo/artigos/*`, `/conteudo/roteiros/*` | Mockado ou UI sem backend real |
| `/custos`, `/custos/artigos`, `/custos/roteiros`, `/custos/all` | Legado |
| `/marketing`, `/marketing/email`, `/marketing/social` | Mockados |
| `/social/posts` | Stub |
| `/relatorios` | Stub/mockado |
| `/site` | UI criada do zero (Sprint 2026-05-19), mockado |
| `/tarefas` | Stub |

**Rotas públicas/legado:**
- `app/login/page.tsx` — login Supabase (legado; ativo em produção)
- `app/site/[slug]/page.tsx` — preview de site gerado
- `app/sobre-noro/page.tsx` — informacional
- `app/proposta/[token]/actions.ts` — rota pública de aceite de proposta (portal separado tem equivalente em `apps/portal`)

**Arquivos órfãos/legado ativos:**
- `app/clientes/`, `app/leads/`, `app/orcamentos/`, `app/pedidos/` — sem `page.tsx`, contêm apenas `actions.ts` que re-exportam das versões `(protected)`. Podem ser removidos se nenhum componente importar diretamente.
- `app/admin/(protected)/clientes/actions.ts` — terceira cópia de actions de clientes. Papel não documentado.
- `app/api/webhooks/erede-3ds/route.ts`, `app/api/webhooks/erede-pix/route.ts` — webhooks eRede ativos. eRede é listado como legado na arquitetura.
- `app/api/admin/content/artigos/route.ts`, `app/api/admin/content/roteiros/route.ts`, `app/api/admin/content/publish/route.ts` — APIs antigas de conteúdo.
- `app/api/admin/costs/all/route.ts`, `app/api/admin/costs/wallet/route.ts` — APIs antigas de custos.

**Auth atual:** usa `getCurrentUser()` de `@noro/lib/services/authService` (wrapper Supabase) e `getCurrentTenantId()` de `@/lib/tenant-helper`. Não usa Logto como guard real.

---

### apps/portal (portal do viajante — subdomínio tenant)

**Rotas autenticadas em `app/(cliente)/`:**

| Rota | Estado |
|---|---|
| `/` (dashboard) | Funcional — countdown, última proposta, cobrança pendente, 6 atalhos |
| `/propostas` | Funcional |
| `/pagamentos` | Funcional — QR Pix, boleto, cartão, parcelas |
| `/documentos` | Funcional — signed URL Supabase Storage |
| `/itinerario` | Funcional (Sprint 1B, pendente de commit) |
| `/mensagens` | Funcional com optimistic update (Sprint 1B, pendente de commit) |
| `/emergencia` | Funcional com links clicáveis (Sprint 1B, pendente de commit) |

**Rotas públicas:**
- `/login` — magic link via Resend
- `/auth/verify`, `/auth/signout` — fluxo de auth
- `/proposta/[token]` — visualização pública + aceite inline
- `/api/webhooks/asaas` — webhook idempotente

**Auth:** magic link próprio (`portal_session_id` cookie HTTP-only), completamente separado de Logto e Supabase Auth.

**Observação:** `app/page.tsx` existe mas provavelmente redireciona para `/login` ou dashboard. Não verificado em detalhe.

**Estado de commit:** Sprint 1B (itinerario, mensagens, emergencia) está implementado mas **pendente de commit**.

---

### apps/control (`admin.noro.guru`)

**Rotas ativas em `app/(protected)/`:**

| Área | Rotas encontradas |
|---|---|
| Dashboard | `/` |
| Tenants | `/tenants`, `/tenants/[id]` (assinatura, configuracoes, dominios, empresa, usuarios) |
| Control Plane | `/control/page`, `/control/leads`, `/control/orgs`, `/control/tasks`, `/control/tenants` |
| CRM | `/clientes`, `/clientes/[id]`, `/clientes/novo`, `/leads` |
| Orçamentos | `/orcamentos`, `/orcamentos/[id]`, `/orcamentos/novo`, `/orcamentos/[id]/editar` |
| Pedidos | `/pedidos`, `/pedidos/[id]`, `/pedidos/[id]/editar` |
| Comunicação | `/comunicacao`, `/comunicacao/chat/[id]`, `/comunicacao/chatbot` |
| Financeiro | `/financeiro`, `/pagamentos`, `/billing` |
| Marketing | `/marketing` |
| Config | `/configuracoes`, `/configuracoes/planos`, `/configuracoes/planos/[id]` |
| Infra | `/api-keys`, `/webhooks`, `/webhooks/endpoints`, `/domains`, `/custom-domains` |
| Suporte | `/support`, `/support/[id]` |
| Admin | `/admin/notificacoes`, `/notificacoes`, `/auditoria`, `/tarefas`, `/relatorios`, `/users`, `/email` |

**Rotas Logto (Sprint 1L):**
- `app/auth/sign-in/route.ts`
- `app/auth/callback/route.ts`
- `app/auth/sign-out/route.ts`

**Problema de coexistência:** O layout `(protected)` ainda usa guard Supabase. Logto funciona apenas como "segundo caminho" paralelo. Após callback Logto, o guard Supabase redireciona para `/login`. Isso é o estado esperado (Sprint 1N registra isso), mas significa que Logto **não está guardando rotas protegidas** em produção no apps/control.

**Arquivo de risco:**
- `app/debug/page.tsx` — rota de debug ainda presente. A auditoria de segurança de 2026-05-19 deletou `debug-actions.ts` mas esta página não foi mencionada como removida.
- `app/settings/stripe/` — Stripe legado ativo como página.

**Auth atual:** Supabase Auth para login principal. Logto presente mas não guardando rotas.

---

### apps/web (`noro.guru`)

Build funcional (corrigido em 2026-05-19). Rotas: `/`, `/pricing`, `/blog`, `/lead`, `/demo`, `/wizard`, `/dashboard/sites/[id]/preview`, APIs: `/api/sites/generate`, `/api/lead`, `/api/newsletter`, `/api/ingest-lead`, `/api/create-checkout-session`.

Supabase ainda presente em `package.json` e em `/api/sites/generate` e `/dashboard/sites/[id]/preview`. Não foi migrado. Checkout route legado Stripe ativo.

---

### apps/financeiro, apps/billing, apps/sites, apps/visa-api

Conforme docs — legados em reavaliação. Não foram objeto de sprints recentes. Nenhum mudou desde 2026-05-27.

---

## 3. Estado real dos packages

| Package | Estado real |
|---|---|
| `packages/db` | Ativo. 25 schemas, 24 repositories, 9 migrations (0000–0008). Banco dev = Neon. Banco prod = nunca aplicado. |
| `packages/auth` | Esqueleto funcional com Logto SDK instalado (`@logto/next@4.2.10`), adapter real em `adapters/logto-session-adapter.ts`. Não está guardando nenhuma rota em produção ainda. |
| `packages/lib` | Ativo e com resíduos Supabase. Ainda exporta `supabase/client`, `supabase/server`, `supabase/admin`, `supabase/storage`. Também exporta `services/authService.ts` (Supabase) e `lib/tenant-helper.ts` que apps/core usa. |
| `packages/types` | Parcialmente legado — tipos ainda baseados em Supabase. |
| `packages/ui` | Ativo. Componentes compartilhados. |
| `packages/renderer` | Ativo. Usado por `apps/web` e `apps/sites`. |
| `packages/control-worker` | Worker Graphile com tasks placeholder. Nunca realmente ativado. |
| `packages/config` | Configurações de ambiente. |

---

## 4. Estado das migrations Drizzle

| Migration | Tag | O que cria |
|---|---|---|
| 0000 | panoramic_alice | Schema `noro`: users, identity_links, tenants, tenant_memberships, platform_role_assignments, audit_events, plans, plan_modules, modules, tenant_modules |
| 0001 | confused_rachel_grey | leads, clients |
| 0002 | cheerful_loki | suppliers, products, pricing_rules (+ 12 tabelas = 15 total) |
| 0003 | fearless_talon | proposals, proposal_items |
| 0004 | lucky_tarot | payment_provider_accounts, payment_customers, payment_charges, payment_webhook_events |
| 0005 | dazzling_white_queen | client_portal_sessions |
| 0006 | milky_timeslip | (a verificar — não auditado nesta sessão) |
| 0007 | proposal_documents | proposal_documents |
| 0008 | itinerary_messages_emergency | proposal_itinerary_items, proposal_messages, emergency_contacts |

**Banco Neon:** migrations 0000–0008 aplicadas.  
**Banco produção (VPS `noro_guru_db`):** nenhuma migration aplicada. Schema `public` com tabelas legadas `noro_*` e schema `cp`. Incompatibilidades detalhadas em `docs/architecture/db-column-comparison.md`.

---

## 5. Gargalos identificados

### 5.1 Banco de dados — bloqueador crítico
As migrations Drizzle (0000–0008) existem apenas no Neon. O banco de produção tem schema completamente diferente. Não existe estratégia aprovada para reconciliação. Qualquer deploy que use `packages/db` em produção vai falhar. Ver `docs/architecture/db-migration-mapping.md` e `db-column-comparison.md`.

### 5.2 Auth — dois mundos sem ponte
- **apps/portal**: magic link próprio, independente, funciona.
- **apps/core**: Supabase Auth via `getCurrentUser()` — funciona mas é legado.
- **apps/control**: Logto instalado mas não guardando rotas. Guard Supabase ainda ativo no layout.
- **Sem bridge**: usuario Logto não consegue acessar recursos do Drizzle/Neon em apps/core porque não há ponte entre sessão Logto e `tenant_id` no schema canônico.

### 5.3 Dois bancos de desenvolvimento paralelos
- Neon tem o schema canônico Drizzle (0000–0008).
- VPS produção tem schema legado Supabase.
- apps/core e apps/control no dia-a-dia provavelmente ainda usam Supabase para dados reais (leads, clientes, orcamentos) — o Drizzle só é usado nas rotas novas.

### 5.4 Sprint Portal 1B não commitada
Todos os arquivos da Sprint 1B existem no sistema de arquivos mas não estão em nenhum commit. Se o repositório for clonado ou resetado, o trabalho se perde.

### 5.5 debug page em apps/control
`apps/control/app/debug/page.tsx` ainda presente. A auditoria de segurança removeu `debug-actions.ts` mas não esta página. Pode expor informações internas.

### 5.6 Webhooks eRede ativos em apps/core
`app/api/webhooks/erede-3ds/route.ts` e `app/api/webhooks/erede-pix/route.ts` ainda existem. eRede é listado como gateway legado a ser abandonado.

### 5.7 Rotas duplicadas de actions em apps/core
Três camadas de actions para o mesmo domínio (clientes, leads, orcamentos):
1. `app/clientes/actions.ts` — re-exporta `(protected)/clientes/actions.ts`
2. `app/(protected)/clientes/actions.ts` — implementação real (Drizzle)
3. `app/admin/(protected)/clientes/actions.ts` — terceira cópia, papel não documentado

---

## 6. O que foi feito mas não documentado

| Item | Estado |
|---|---|
| Sprint Portal 1B completa (itinerario, mensagens, emergencia) | Implementado, não commitado, não registrado em `SPRINT_STATUS.md` |
| `apps/control/app/debug/page.tsx` | Existe; não mencionado em nenhum doc |
| `apps/core/app/admin/(protected)/clientes/actions.ts` | Existe; não mencionado em nenhum doc |
| `docs/architecture/db-migration-mapping.md` | Criado nesta sessão (2026-05-30) ✅ |
| `docs/architecture/db-column-comparison.md` | Criado nesta sessão (2026-05-30) ✅ |
| Migration 0006 (`milky_timeslip`) | Presente em migrations/ mas não auditada em nenhum doc encontrado |
| `apps/portal/app/page.tsx` | Arquivo existe na raiz do portal — papel não documentado |

---

## 7. O que foi documentado mas não implementado

| Item | Onde está documentado | Estado real |
|---|---|---|
| Sprint 5 — Checkout Asaas mínimo | `docs/SPRINT_STATUS.md` como `nao_iniciada` | Portal já tem Asaas implementado; apps/core e apps/control ainda não |
| Sprint 6 — Comissão simples | `SPRINT_STATUS.md` | Não iniciado |
| Sprint 7 — Sites conectados ao funil | `SPRINT_STATUS.md` | Não iniciado |
| Sprint 8 — Grupos básicos | `SPRINT_STATUS.md` | Não iniciado |
| Sprint 9 — Ledger inicial | `SPRINT_STATUS.md` | Não iniciado |
| Logto guardando rotas protegidas em apps/control | `SPRINT_STATUS.md` Sprint 1 checklist | Não implementado — guard Supabase ainda ativo |
| Tenant resolvido por sessão/membership | `SPRINT_STATUS.md` Sprint 1 checklist | Não implementado — apps/core usa helper próprio |
| Rota `/auth/whoami` para remover (marcada como temporária) | Sprint 1N | Não verificado se foi removida |
| `packages/control-worker` com tasks reais | `docs/architecture/current-state.md` | Apenas placeholders |
| Migração billing/Asaas completa | `docs/architecture/billing-asaas-migration-plan.md` | Sprint 0 do plano Asaas (inventário) não executada formalmente |

---

## 8. Conflitos entre documentação e código

| Conflito | Doc diz | Código mostra |
|---|---|---|
| **SPRINT_STATUS.md — Sprint 1 status** | Header diz `em_andamento`; tabela de resumo diz `concluida` em 2026-05-29 | Contradição interna no mesmo arquivo |
| **SPRINT_STATUS.md — Sprint 5** | `nao_iniciada` | apps/portal tem Asaas completo (Sprint 5 do portal) — são sprints diferentes, mas o nome é confuso |
| **SPRINT_STATUS.md — Sprint P e Portal** | Não mencionadas em nenhum lugar | Sprints P, 5-portal, Fase 1, 1B existem apenas em `docs/apps/portal-vision.md` |
| **docs/architecture/current-state.md** | Logto "ainda não integrado no runtime dos apps" | apps/control tem rotas `/auth/sign-in`, `/auth/callback`, `/auth/sign-out` funcionando desde Sprint 1L |
| **docs/apps/control.README.md — Próximos Passos** | Item 1: "Migrar auth do Control para Logto" | Sprint 1L já implementou rotas Logto; coexistência ativa mas guard não migrado |
| **docs/architecture/billing-asaas-migration-plan.md** | Sprints 0–9 de billing; Sprint 0 (inventário) não executado | Portal já usa Asaas (`payment_charges`, `payment_customers`, etc.) sem ter passado pelo plano formal |
| **docs/architecture/supabase-residue-report.md** | Storage Supabase ainda em uso como legado | portal-vision.md diz "signed URL Supabase Storage" ainda em uso para documentos |

---

## 9. Estado de cada documento .md

| Documento | Atualizado? | Conflitos |
|---|---|---|
| `docs/SPRINT_STATUS.md` | Desatualizado (ref: 2026-05-27) | Contradição interna Sprint 1; ignora trilho portal completamente; Sprint 5 marcada "nao_iniciada" apesar de Asaas implementado no portal |
| `docs/architecture/current-state.md` | Parcialmente desatualizado | Diz Logto não guardando rotas — Sprint 1L mudou isso parcialmente |
| `docs/architecture/multi-tenant-current-model.md` | Ainda válido | Sem conflitos críticos |
| `docs/architecture/data-auth-transition.md` | Ainda válido como plano | Progresso real não refletido |
| `docs/architecture/billing-asaas-migration-plan.md` | Ainda válido como plano | Portal implementou Asaas sem seguir o plano formal |
| `docs/architecture/supabase-residue-report.md` | Parcialmente desatualizado | Apps/control tem Logto parcialmente; apps/portal nunca usou Supabase Auth |
| `docs/architecture/domains-cloudflare-dns-current-plan.md` | Atual | Nenhum conflito |
| `docs/architecture/db-migration-mapping.md` | Atual (2026-05-30) | ✅ |
| `docs/architecture/db-column-comparison.md` | Atual (2026-05-30) | ✅ |
| `docs/apps/portal-vision.md` | Atual (2026-05-30) | Sprint 1B pendente de commit marcado corretamente |
| `docs/apps/core.README.md` | Parcialmente desatualizado | Não menciona Sprint 1B, novas rotas de emergência, etc. |
| `docs/apps/control.README.md` | Parcialmente desatualizado | "Migrar auth para Logto" ainda como próximo passo apesar de parcialmente feito |
| `docs/apps/web.README.md` | Ainda válido | Nenhum conflito |
| `docs/apps/billing.README.md` | Ainda válido | Nenhum conflito |
| `docs/apps/financeiro.README.md` | Ainda válido | Nenhum conflito |
| `docs/apps/sites.README.md` | Ainda válido | Nenhum conflito |
| `docs/apps/visa-api.README.md` | Ainda válido | Nenhum conflito |
| `docs/ai/AGENTS.README.md` | Ainda válido | Não menciona `docs/apps/portal-vision.md` nas leituras obrigatórias |
| `docs/analise-documentacao-md-projeto.md` | Desatualizado (ref: 2026-05-27) | Não inclui arquivos novos criados após essa data |
| `docs/codebase-unused-legacy-audit.md` | Desatualizado (ref: 2026-05-27) | Não inclui eRede webhooks, debug page, admin actions duplicadas |
| `supabase/FROZEN.md` | Atual | Correto |
| `scripts/README.md` | Atual | Correto |

---

## 10. O que está ativo vs stub vs legado

### Ativo e funcional (usa banco real, seja Supabase ou Drizzle/Neon)
- `apps/core`: clientes (Drizzle), leads (Drizzle), orcamentos/[id] (Drizzle + Supabase Storage), configuracoes básicas
- `apps/portal`: todas as rotas (Drizzle/Neon + Supabase Storage para docs)
- `apps/control`: tenants, clientes, leads, orcamentos — via Supabase (legado); rotas Logto presentes mas auth não migrado
- `packages/db`: schemas e repositories — funcionam com Neon

### Stub / mockado (UI existe, backend não ou é placeholder)
- `apps/core`: comunicacao, marketing/email, marketing/social, conteudo/*, relatorios, tarefas, site
- `apps/control`: comunicacao chatbot, marketing, email, auditoria — provavelmente stubs
- `packages/control-worker`: tasks são placeholders

### Legado ativo (funciona mas é tecnologia marcada para substituição)
- `apps/core`: login (Supabase Auth), pedidos (Supabase + eRede), webhooks eRede, APIs admin antigas
- `apps/control`: login principal (Supabase Auth), todas as queries Supabase de tenants/leads/orcamentos
- `apps/web`: geração de sites (Supabase), checkout (Stripe)
- `packages/lib`: todos os clientes Supabase, authService, tenant-helper

### Nunca aplicado em produção
- Todas as 9 migrations Drizzle
- Schema canônico `noro.*` inteiro

---

## 11. Pontos sem decisão registrada

1. Qual banco o apps/core e apps/control usam em produção real hoje? Supabase VPS ou Supabase cloud?
2. O banco Neon é o mesmo para os dois trilhos (Codex e Claude/Portal)?
3. A rota `/auth/whoami` de apps/control (criada na Sprint 1N como temporária) foi removida?
4. O `app/page.tsx` de apps/portal faz o quê exatamente?
5. O que exatamente está na migration 0006 (`milky_timeslip`)?
6. O `app/admin/(protected)/clientes/actions.ts` em apps/core tem algum uso ativo?
7. apps/core usa qual `DATABASE_URL` em produção — Neon ou VPS?

---

## 12. Observações finais

**O projeto tem mais código funcionando do que a documentação sugere** — o portal está completo em 11 rotas, apps/core tem novas features de Sprint 1B, e a stack Drizzle/Neon/Asaas está operacional no contexto do portal.

**A documentação está calibrada para um plano que o código não seguiu** — os sprints do SPRINT_STATUS.md (Codex track, Foundation first) são uma sequência diferente da que realmente foi implementada (Claude/Paulo track, Portal first).

**O maior risco prático é o banco** — todo o trabalho feito no Neon precisa chegar ao VPS de produção antes de qualquer funcionalidade nova ser usada por usuários reais. Sem isso, as features existem no dev e não existem em produção.
