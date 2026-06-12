> **[RASCUNHO — verificar contra análise nova]**
> Este documento foi produzido antes da análise completa de 2026-06-01.
> Ele mapeou apenas 5 tabelas do schema `cp` e 7 "sem equivalente".
> O banco real tem 41 tabelas em `cp.*` e 109 em `public.*` (150 total).
> As fontes primárias atualizadas são:
> - `inventory-banco-real-2026-05-30.md` — inventário real do banco com row counts
> - `crossref-banco-codigo-2026-05-30.md` — cruzamento completo com gaps
> Não use este documento para decisões de migração sem verificar os acima.

# Mapeamento de Schema — Drizzle (noro.*) vs Banco de Produção

Data: 2026-05-30
Status: diagnóstico — nenhuma ação tomada ainda

## Contexto

O banco de produção `noro_guru_db` no VPS (45.32.169.173) contém a estrutura
legada migrada do Supabase (schema `public` com prefixo `noro_` e schema `cp`).
As migrations Drizzle (0000 a 0008) foram desenvolvidas no Neon e nunca foram
aplicadas no banco de produção.

## Decisão pendente

Antes de aplicar qualquer migration no banco de produção, é necessário decidir
a estratégia de reconciliação:
- Opção A: Criar schema `noro` no VPS e aplicar migrations do zero (tabelas novas coexistem com legado)
- Opção B: Migrar dados do legado para o schema `noro` e deprecar tabelas antigas
- Opção C: Híbrido — aplicar migrations para tabelas sem equivalente, reconciliar as parcialmente equivalentes

Nenhuma opção deve ser executada sem aprovação explícita.

---

## noro (Drizzle) → produção

| Tabela `noro.*` | Equivalente no banco real | Status | Diferenças principais |
|---|---|---|---|
| `tenants` | `public.tenants` + `noro_empresa` | **parcialmente equiv.** | Drizzle unifica config de tenant e empresa numa tabela; produção separa em duas. Drizzle tem `portal_slug`, `portal_domain`, `portal_theme` que provavelmente não existem em nenhuma das duas |
| `users` | `noro_users` + `public.users` | **parcialmente equiv.** | Duplicidade no banco real; Drizzle tem uma tabela única integrada com Logto |
| `identity_links` | — | **sem equivalente** | Tabela nova — vincula usuário Drizzle ao provider externo (Logto) |
| `tenant_memberships` | — | **sem equivalente** | Tabela nova — relacionamento user↔tenant com role |
| `platform_role_assignments` | — | **sem equivalente** | Tabela nova — roles de plataforma (superadmin etc.) |
| `audit_events` | — | **sem equivalente** | Tabela nova — log de auditoria |
| `plans` | `cp.plans` | **parcialmente equiv.** | `cp.plans` provavelmente tem estrutura de billing; Drizzle foca em feature flags |
| `plan_modules` | — | **sem equivalente** | Tabela nova — relação plano↔módulo |
| `modules` | — | **sem equivalente** | Tabela nova — catálogo de módulos do produto |
| `tenant_modules` | — | **sem equivalente** | Tabela nova — módulos habilitados por tenant |
| `leads` | `noro_leads` + `public.leads` | **parcialmente equiv.** | Duplicidade no banco real; Drizzle tem campos tipados (`tipoViagem`, `nivel`, `segmento`) que podem não existir nas versões do public |
| `clients` | `noro_clientes` + `public.clientes` | **parcialmente equiv.** | Duplicidade; Drizzle consolida campos espalhados |
| `suppliers` | `noro_fornecedores` | **equivalente** | Nomes mapeiam diretamente |
| `products` | `public.produtos` | **equivalente** | Nomes mapeiam diretamente |
| `pricing_rules` | `noro_markup_rules` | **parcialmente equiv.** | `markup_rules` cobre só markup; Drizzle tem `canal`, `planId`, regras compostas |
| `proposals` | `noro_orcamentos` | **equivalente** | Nomes mapeiam; Drizzle tem `aceiteToken`, `aceitaTipo`, `dataViagem*` que podem ser novos |
| `proposal_items` | `noro_orcamentos_itens` | **equivalente** | Nomes mapeiam; Drizzle tem snapshot financeiro imutável (`snapshotPricingRules`) que provavelmente não existe |
| `client_portal_sessions` | — | **sem equivalente** | Tabela nova — sessões magic link do portal do viajante |
| `payment_provider_accounts` | `noro_payment_configs` | **parcialmente equiv.** | `payment_configs` provavelmente mistura config de provider e customer; Drizzle separa em 3 tabelas |
| `payment_customers` | `noro_payment_configs` | **parcialmente equiv.** | Idem acima |
| `payment_charges` | `noro_transacoes` | **parcialmente equiv.** | `transacoes` pode ser mais genérico; Drizzle tem campos específicos Asaas (`pixQrCode`, `pixCopyPaste`, `bankSlipUrl`, `checkoutUrl`) |
| `payment_webhook_events` | — | **sem equivalente** | Tabela nova — log idempotente de webhooks |
| `proposal_documents` | `noro_clientes_documentos` | **parcialmente equiv.** | `clientes_documentos` é por cliente; Drizzle é por proposta com `tipo` enum e `visibleToClient` |
| `proposal_itinerary_items` | — | **sem equivalente** | Tabela nova — itinerário por dia |
| `proposal_messages` | — | **sem equivalente** | Tabela nova — chat agência/cliente |
| `emergency_contacts` | — | **sem equivalente** | Tabela nova — central de emergência |

---

## Tabelas do banco real sem equivalente no Drizzle

| Tabela real | Observação |
|---|---|
| `noro_exchange_rates` | Histórico de câmbio — Drizzle tem só snapshot por proposta (`taxaCambioSnapshot`), sem tabela dedicada |
| `noro_configuracoes` | Configurações globais — Drizzle distribui em `tenants.portal_theme` e campos de tenant |
| `public.sites` | Sites das agências — fora do escopo do Drizzle atual (apps/sites tem schema próprio provavelmente) |
| `cp.tenants` | Entidade do schema cp — possivelmente billing separado |
| `cp.subscriptions` | Assinaturas — sem equivalente; Drizzle tem `tenant_memberships` para outra coisa |
| `cp.leads` | Leads duplicados no schema cp |
| `cp.contacts` | Contatos do schema cp — sem equivalente |

---

## Resumo quantitativo

| Categoria | Qtd |
|---|---|
| Tabelas Drizzle **sem equivalente** no banco real (novas) | 10 |
| Tabelas Drizzle **parcialmente equivalentes** | 9 |
| Tabelas Drizzle **equivalentes** | 5 |
| Tabelas do banco real **sem equivalente no Drizzle** | 7 |
| **Total de tabelas no schema noro (Drizzle)** | **26** |

---

## Incompatibilidades críticas identificadas (2026-05-30)

Análise completa em: `docs/architecture/db-column-comparison.md`

### Bloqueadores de migração direta

1. **Enum incompatível** — `noro_clientes.nivel` tem valor `bronze` que não existe no enum Drizzle
2. **Diferença arquitetural** — `noro_fornecedores` é por-tenant no legado, global no Drizzle
3. **ETL necessário** — `noro_orcamentos.roteiro` é JSONB com itinerário embutido; no Drizzle virou tabela separada `proposal_itinerary_items`
4. **Tipo financeiro incompatível** — legado usa `numeric/EUR`; Drizzle usa `bigint` em centavos/BRL
5. **Timestamps sem timezone** — legado usa `timestamp`; Drizzle usa `timestamptz`

### Colunas com dados sem destino no Drizzle

- `noro_leads`: 18 colunas (tags, metadata, observacoes, proxima_acao, telefone_whatsapp, etc.)
- `noro_clientes`: 14 colunas (profissao, nps_score, idioma_preferido, moeda_preferida, deleted_at, dados fiscais PJ, auth_user_id)
- `noro_orcamentos`: 17 colunas (roteiro, pdf_*, template, recusado_motivo, visualizado_contador, etc.)
- `noro_orcamentos_itens`: 13 colunas (localizador, quantidade, unidade, detalhes, incluido, opcional)
- `noro_fornecedores`: 14 colunas (dados bancários, comissão, rating, deleted_at)

### Decisão pendente

Nenhuma migration deve ser aplicada no banco de produção sem estratégia de reconciliação aprovada.
