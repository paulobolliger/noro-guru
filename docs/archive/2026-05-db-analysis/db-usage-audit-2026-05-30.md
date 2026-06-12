> **[RASCUNHO — verificar contra análise nova]**
> Este documento foi produzido antes da análise completa de 2026-06-01.
> As fontes primárias atualizadas são:
> - `inventory-banco-real-2026-05-30.md` — inventário real do banco com row counts
> - `inventory-codigo-referencias-db-2026-05-30.md` — referências no código
> - `crossref-banco-codigo-2026-05-30.md` — cruzamento com gaps
> Não use este documento para decisões de migração sem verificar os acima.

# Auditoria de Uso de Banco de Dados — 2026-05-30

Data: 2026-05-30  
Escopo: apps/ e packages/ — identificar quem usa Supabase legado e quem já usa Drizzle (`packages/db`)  
Método: grep em `*.ts` e `*.tsx` por padrões `.from(`, `supabase.*`, `createClient`, `createDatabaseClient`, `@noro/db`  
Sem alterações. Somente leitura e documentação.

---

## Achado crítico: apps/core (protected) está inacessível

Antes do mapeamento detalhado, um achado que muda a leitura de tudo:

`packages/lib/services/authService.ts` — `getCurrentUser()` **retorna `null` permanentemente**:

```ts
export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;  // Auth legado desativado. Logto será integrado na próxima fase.
}
```

`apps/core/app/(protected)/layout.tsx` faz:
```tsx
const user = await getCurrentUser();
if (!user) {
  return redirect('/login?redirect=/dashboard');
}
```

**Consequência:** TODAS as rotas em `apps/core/app/(protected)/` redirecionam para `/login` permanentemente. As actions Drizzle existem e compilam, mas não são alcançáveis pelo usuário.

Adicionalmente, `apps/core/app/(protected)/leads/page.tsx` chama `getLeads()` sem argumento, mas a assinatura é `getLeads(tenantId: string, ...)` — TypeScript error latente.

---

## Tabela consolidada de uso de banco

| App/Package | Módulo/Rota | Usa legado (Supabase) | Usa Drizzle | Observação |
|---|---|---|---|---|
| **apps/core** | `(protected)/layout.tsx` | `@noro/lib/services/authService` | — | `getCurrentUser()` retorna null sempre — bloqueia TODAS as rotas protegidas |
| **apps/core** | `(protected)/leads/actions.ts` | Não | ✅ `leadsRepository` | Funciona em isolamento; inacessível via UI |
| **apps/core** | `(protected)/clientes/actions.ts` | Não | ✅ `clientsRepository` | Funciona em isolamento; inacessível via UI |
| **apps/core** | `(protected)/clientes/[id]/actions.ts` | Não | Stub | Retorna erro "legado desativado" para todas as funções |
| **apps/core** | `(protected)/orcamentos/orcamentos-actions.ts` | Não | ✅ `proposalsRepository` | Funciona em isolamento; inacessível via UI |
| **apps/core** | `(protected)/orcamentos/[id]/page.tsx` | Não | ✅ 5 repositories | Chama `getCurrentUser()` → sempre redireciona para `/login` |
| **apps/core** | `(protected)/orcamentos/[id]/actions.ts` | ⚠️ Supabase Storage | ✅ `proposalDocumentsRepository` etc. | Drizzle para dados; `getSupabaseAdmin()` para upload de arquivo |
| **apps/core** | `(protected)/configuracoes/emergencia/page.tsx` | Não | ✅ `emergencyContactsRepository` | Chama `getCurrentUser()` → sempre redireciona |
| **apps/core** | `(protected)/pedidos/page.tsx` | — | — | Stub "Recurso migrado" — sem queries |
| **apps/core** | `(protected)/financeiro/page.tsx` | — | — | Stub "Recurso migrado" — sem queries |
| **apps/core** | `(protected)/configuracoes/page.tsx` | — | — | Stub "Recurso migrado" — sem queries |
| **apps/core** | `(protected)/pedidos/providers/erede-provider.ts` | Não | Não | API HTTP externa eRede — sem DB |
| **apps/core** | `app/proposta/[token]/actions.ts` | Não | ✅ `proposalsRepository` | Rota pública — não passa pelo guard de auth |
| **apps/core** | `app/clientes/actions.ts` | Não | Re-export | Re-exporta `(protected)/clientes/actions.ts` |
| **apps/core** | `app/clientes/[id]/actions.ts` | Não | Re-export | Re-exporta `(protected)/clientes/[id]/actions.ts` |
| **apps/core** | `app/leads/actions.ts` | Não | Re-export | Re-exporta apenas `createLeadAction` de `(protected)/leads/actions.ts` |
| **apps/core** | `app/orcamentos/orcamentos-actions.ts` | Não | Re-export | Re-exporta `(protected)/orcamentos/orcamentos-actions.ts` |
| **apps/core** | `app/api/webhooks/erede-3ds/route.ts` | Não confirmado | Não confirmado | Legado eRede — não inspecionado em detalhe |
| **apps/core** | `app/api/webhooks/erede-pix/route.ts` | Não confirmado | Não confirmado | Legado eRede — não inspecionado em detalhe |
| **apps/core** | `app/admin/(protected)/clientes/actions.ts` | Não confirmado | Não confirmado | Arquivo não inspecionado — papel desconhecido |
| **apps/core** | `app/api/admin/content/*/route.ts` | Não confirmado | Não confirmado | APIs legadas de conteúdo |
| **apps/core** | `components/admin/ClienteModal.tsx` | Não | Via re-export | Chama `@/app/clientes/actions` que re-exporta Drizzle |
| **apps/core** | `components/admin/clientes/NovoClienteForm.tsx` | Não | Via re-export | Idem |
| **apps/core** | `components/admin/clientes/ClienteDetalhes360.tsx` | Não | Via re-export | Idem |
| | | | | |
| **apps/portal** | `(cliente)/page.tsx` (dashboard) | Não | ✅ `proposalsRepository`, `paymentChargesRepository` | 100% Drizzle |
| **apps/portal** | `(cliente)/propostas/page.tsx` | Não | ✅ `proposalsRepository` | 100% Drizzle |
| **apps/portal** | `(cliente)/pagamentos/page.tsx` | Não | ✅ `paymentChargesRepository` | 100% Drizzle |
| **apps/portal** | `(cliente)/documentos/page.tsx` | ⚠️ Supabase Storage | ✅ `proposalDocumentsRepository` | Drizzle para metadados; Supabase Storage para signed URL |
| **apps/portal** | `(cliente)/itinerario/page.tsx` | Não | ✅ `proposalItineraryRepository` | 100% Drizzle |
| **apps/portal** | `(cliente)/mensagens/page.tsx` + `actions.ts` | Não | ✅ `proposalMessagesRepository` | 100% Drizzle |
| **apps/portal** | `(cliente)/emergencia/page.tsx` | Não | ✅ `emergencyContactsRepository` | 100% Drizzle |
| **apps/portal** | `proposta/[token]/page.tsx` + `actions.ts` | Não | ✅ `proposalsRepository` | 100% Drizzle — rota pública |
| **apps/portal** | `api/webhooks/asaas/route.ts` | Não | ✅ `paymentWebhookEventsRepository`, `paymentChargesRepository` | 100% Drizzle — idempotente |
| **apps/portal** | `lib/storage.ts` | ✅ Supabase Storage | Não | Único ponto Supabase no portal — gera signed URLs |
| **apps/portal** | `lib/tenant-context.ts` | Não | ✅ `tenantsRepository` | Resolve tenant por subdomínio/domínio via Drizzle |
| **apps/portal** | `lib/magic-link.ts` | Não | ✅ `clientPortalSessionsRepository` | Sessões magic link via Drizzle |
| | | | | |
| **apps/control** | `lib/supabase/client.ts`, `server.ts`, `admin.ts` | ✅ Supabase client | Não | 3 clientes Supabase locais do app |
| **apps/control** | `lib/supabaseServer.ts` | ✅ Supabase helper | Não | Helper server-side do Control |
| **apps/control** | `lib/db.ts` | Não | ✅ `@noro/db` | Único arquivo de conexão Drizzle do control |
| **apps/control** | `hooks/useLeads.ts` | ✅ `.from('noro_leads')` | Não | Queries Supabase via hook cliente |
| **apps/control** | `hooks/useClients.ts` | ✅ `.from('noro_clientes')` | Não | Queries Supabase via hook cliente |
| **apps/control** | `hooks/usePedidos.ts` | ✅ `.from('noro_pedidos')` | Não | Queries Supabase via hook cliente |
| **apps/control** | `hooks/useOrcamentos.ts` | ✅ `.from('noro_orcamentos')` | Não | Queries Supabase via hook cliente |
| **apps/control** | `hooks/useTenant.ts` | ✅ Supabase Auth + `.from(...)` | Não | Auth + queries multi-tabela |
| **apps/control** | `app/login/page.tsx` | ✅ Supabase Auth | Não | Login principal ainda via Supabase |
| **apps/control** | `app/(protected)/layout.tsx` | ✅ Supabase Auth `.from(...)` | Não | Guard e dados de layout via Supabase |
| **apps/control** | `app/(protected)/clientes/actions.ts` | ✅ `.from('noro_clientes')` | Não | CRUD clientes via Supabase |
| **apps/control** | `app/(protected)/clientes/[id]/actions.ts` | ✅ `.from('noro_clientes')` | Não | 26 ocorrências de `.from(` |
| **apps/control** | `app/(protected)/tenants/tenant-actions.ts` | ✅ `.from('tenants')` | Não | 22 ocorrências — CRUD tenants Supabase |
| **apps/control** | `app/(protected)/pedidos/pedidos-actions.ts` | ✅ `.from('noro_pedidos')` | Não | 8 ocorrências |
| **apps/control** | `app/(protected)/orcamentos/orcamentos-actions.ts` | ✅ `.from('noro_orcamentos')` | Não | 7 ocorrências |
| **apps/control** | `app/(protected)/domains/actions.ts` | ✅ `.from(...)` | Não | 8 ocorrências |
| **apps/control** | `app/(protected)/api-keys/actions.ts` | ✅ `.from(...)` | Não | 6 ocorrências |
| **apps/control** | `app/(protected)/control/actions.ts` | ✅ `.from(...)` | Não | 6 ocorrências |
| **apps/control** | `app/(protected)/control/orgs/[id]/actions.ts` | ✅ `.from(...)` | Não | 6 ocorrências |
| **apps/control** | `app/(protected)/configuracoes/config-actions.ts` | ✅ `.from(...)` | Não | 4 ocorrências |
| **apps/control** | `app/(protected)/support/actions.ts` | ✅ `.from(...)` | Não | Suporte via Supabase |
| **apps/control** | `app/(protected)/notificacoes/actions.ts` | ✅ `.from(...)` | Não | Notificações via Supabase |
| **apps/control** | `app/(protected)/comunicacao/actions.ts` | ✅ `.from(...)` | Não | Comunicação via Supabase |
| **apps/control** | `app/(protected)/billing/actions.ts` | Não | ✅ `@noro/db` | Exceção — usa Drizzle |
| **apps/control** | `app/(protected)/catalogo/produtos/actions.ts` | Não | ✅ `@noro/db` | Exceção — usa Drizzle (catálogo global) |
| **apps/control** | `app/(protected)/catalogo/fornecedores/actions.ts` | Não | ✅ `@noro/db` | Exceção — usa Drizzle (catálogo global) |
| **apps/control** | `app/settings/stripe/actions.ts` | Não | ✅ `@noro/db` | Exceção — usa Drizzle |
| **apps/control** | `app/api/webhooks/stripe/route.ts` | ✅ `.from(...)` | Não | Webhook Stripe legado |
| **apps/control** | `app/api/webhooks/btg/route.ts` | ✅ `.from(...)` | Não | Webhook BTG legado |
| **apps/control** | `app/api/support/tickets/*/route.ts` | ✅ `.from(...)` | Não | Suporte via Supabase |
| **apps/control** | `app/api/search/route.ts` | ✅ `.from('noro_leads')`, `.from('noro_clientes')` | Não | Busca global via Supabase |
| **apps/control** | `app/(protected)/financeiro/page.tsx` | ✅ `.from(...)` | Não | 2 ocorrências |
| **apps/control** | `app/(protected)/billing/page.tsx` | ✅ `.from(...)` | Não | 4 ocorrências |
| **apps/control** | `components/TopBar.tsx` | ✅ Supabase Auth + `.from(...)` | Não | 4 ocorrências — signOut, user info |
| **apps/control** | `components/command/CommandPalette.tsx` | ✅ `.from(...)` | Não | 2 ocorrências |
| **apps/control** | `app/auth/sign-in/route.ts` | Logto SDK | Não | Rota Logto nova (Sprint 1L) |
| **apps/control** | `app/auth/callback/route.ts` | Logto SDK | Não | Rota Logto nova — não guarda rotas protegidas |
| **apps/control** | `app/auth/sign-out/route.ts` | Logto SDK | Não | Rota Logto nova |
| **apps/control** | `app/debug/page.tsx` | Não verificado | Não verificado | Risco de segurança — página de debug não removida |
| | | | | |
| **apps/web** | `app/api/sites/generate/route.ts` | ✅ Supabase | Não | Geração de sites via Supabase |
| **apps/web** | `app/dashboard/sites/[id]/preview/page.tsx` | ✅ Supabase | Não | Preview de site via Supabase |
| **apps/web** | `app/status/page.tsx` | ✅ Supabase | Não | Status check via Supabase |
| **apps/web** | Restante das rotas de marketing | Não | Não | Sem queries — conteúdo estático/componentes |
| | | | | |
| **apps/financeiro** | `(protected)/centros-custo/[id]/centro-custo-detalhes-client.tsx` | ✅ Supabase | Não | Único arquivo encontrado com query |
| **apps/financeiro** | Restante | Não confirmado | Não | Legado em reavaliação — não auditado em detalhe |
| | | | | |
| **packages/lib** | `supabase/client.ts`, `server.ts`, `admin.ts` | ✅ Exporta clientes | Não | Clientes Supabase compartilhados |
| **packages/lib** | `supabase/storage.ts` | ✅ Supabase Storage | Não | Upload/signed URL |
| **packages/lib** | `supabase/pedidos.ts` | ✅ `.from('noro_pedidos')` | Não | Queries Supabase de pedidos |
| **packages/lib** | `supabase/orcamentos.ts` | ✅ `.from('noro_orcamentos')` | Não | Queries Supabase de orçamentos |
| **packages/lib** | `supabase/usuarios.ts` | ✅ Supabase Auth | Não | Queries de usuários via Supabase |
| **packages/lib** | `supabase/mensagens.ts` | ✅ `.from(...)` | Não | Mensagens via Supabase |
| **packages/lib** | `supabase/tarefas.ts` | ✅ `.from(...)` | Não | Tarefas via Supabase |
| **packages/lib** | `supabase/dashboard.ts` | ✅ `.from(...)` | Não | Dashboard via Supabase |
| **packages/lib** | `supabase/logs.ts` | ✅ `.from(...)` | Não | Logs via Supabase |
| **packages/lib** | `supabase/blog.ts` | ✅ `.from(...)` | Não | Blog via Supabase |
| **packages/lib** | `services/authService.ts` | Não | Não | Stub — `getCurrentUser()` retorna `null` permanentemente |
| **packages/lib** | `services/tenantService.ts` | Não | Não | Stub — `getTenantIdForUser()` lança erro sempre |
| **packages/lib** | `services/billingService.ts` | Não confirmado | Não confirmado | Não inspecionado em detalhe |
| **packages/lib** | `providers/asaas-provider.ts` | Não | Não | HTTP client Asaas — sem DB direto |
| **packages/db** | `repositories/*` | Não | ✅ Drizzle ORM | Todos os 24 repositories usam Drizzle |

---

## Resumo quantitativo

| Categoria | Qtd de arquivos |
|---|---|
| **apps/control** com Supabase `.from(` | 98 arquivos, 234+ ocorrências |
| **apps/control** com Drizzle | 5 arquivos (billing, catalogo/produtos, catalogo/fornecedores, stripe/actions, lib/db.ts) |
| **apps/core (protected)** com Drizzle | 6 actions/pages — inacessíveis pelo guard quebrado |
| **apps/core** com Supabase Storage | 1 (orcamentos/[id]/actions.ts — só para upload) |
| **apps/portal** com Drizzle | 13 arquivos — 100% das queries de dados |
| **apps/portal** com Supabase Storage | 1 (lib/storage.ts — signed URL) |
| **apps/web** com Supabase | 3 arquivos |
| **packages/lib/supabase/** | 12 arquivos com queries Supabase |
| **packages/db/repositories/** | 24 arquivos — 100% Drizzle |

---

## Mapa de quem "vê" qual banco

```
Banco Supabase VPS (ou cloud Supabase)
  └─ apps/control (98% das rotas) ← login, clientes, leads, pedidos, orcamentos,
                                     tenants, suporte, comunicação, financeiro,
                                     domínios, api-keys, notificações, billing page
  └─ apps/web (3 rotas: sites generate, preview, status)
  └─ apps/financeiro (ao menos 1 rota auditada)
  └─ packages/lib/supabase/* (10 módulos de queries compartilhados)

Banco Neon (schema noro.* — Drizzle migrations 0000–0008)
  └─ apps/portal (100% das rotas de dados)
  └─ apps/core (orcamentos/[id], proposta/[token]) ← inacessíveis por auth quebrado,
                                                       exceto proposta/[token] (pública)
  └─ apps/control (catalogo/produtos, catalogo/fornecedores, billing/actions, lib/db.ts)
  └─ packages/db/repositories/* (implementações)

Supabase Storage
  └─ apps/portal/lib/storage.ts (signed URLs de documentos)
  └─ apps/core/(protected)/orcamentos/[id]/actions.ts (upload de arquivos)
  └─ packages/lib/supabase/storage.ts (upload de logos, assets)
```

---

## Observações finais

1. **apps/portal é o único app 100% migrado para Drizzle** nas queries de dados. Usa Supabase Storage como único resíduo.

2. **apps/core/(protected) usa Drizzle nas actions, mas está completamente bloqueado** — o guard `getCurrentUser()` retorna `null` e redireciona para `/login`. Nenhuma rota protegida de apps/core é alcançável em runtime.

3. **apps/control usa Supabase em 98% dos arquivos**. Os 5 arquivos com Drizzle são ilhas isoladas (catálogo global e billing) adicionadas pelos trilhos Codex.

4. **O Supabase Storage é compartilhado** entre portal e core para arquivos de proposta, mesmo que a lógica de dados já esteja em Drizzle.

5. **Nenhum app usa Logto como guard ativo de rotas** em produção. apps/control tem as rotas `/auth/sign-in` e `/auth/callback` mas o layout `(protected)` ainda usa Supabase Auth.
