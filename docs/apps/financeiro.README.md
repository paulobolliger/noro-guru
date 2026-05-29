# App Financeiro

App: `apps/financeiro`

Status: legado funcional em reavaliacao. Nao tratar como produto financeiro independente nem como financeiro completo em producao.

## Papel

`apps/financeiro` concentra telas e APIs para operacao financeira: receitas, despesas, bancos, duplicatas, centros de custo, creditos, adiantamentos, pricing e dashboards.

Ele deve ser alinhado ao modelo financeiro canonico da NORO antes de virar fonte operacional principal. No modelo alvo, financeiro nao e um produto separado: e um modulo dentro dos contextos `apps/control` e `apps/core`.

## Modelo Alvo

| Contexto | Responsabilidade financeira |
| --- | --- |
| `apps/control` | Financeiro da NORO: ver se tenants pagaram mensalidades e servicos, acompanhar fluxo de caixa, contas a receber, inadimplencia, conciliacao e relatorios de plataforma. |
| `apps/core` | Financeiro do tenant: ver se clientes finais pagaram, gerir recebiveis, despesas, duplicatas, centros de custo, fluxo de caixa e indicadores da agencia. |

Billing e financeiro devem se conectar nos dois contextos:

- em `control`, billing gera cobrancas dos tenants e financeiro acompanha recebimento, inadimplencia e caixa da NORO;
- em `core`, billing gera cobrancas para clientes finais e financeiro acompanha recebiveis, baixas, fluxo de caixa e conciliacao do tenant.

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind
- Vitest
- Recharts
- ExcelJS
- jsPDF
- `@noro/ui`
- `@noro/lib`
- `@noro/types`

## Estado Atual

O README antigo prometia modulo completo com Supabase, Stripe, Cielo, PayPal, N8N e Metabase. Isso nao deve orientar novas decisoes.

O codigo possui muitas telas, mas tambem existem endpoints/clients desativados por dependencia de modelos legados ou funcoes SQL antigas.

Exemplos de areas:

- dashboard financeiro;
- receitas e despesas;
- bancos;
- duplicatas a pagar/receber;
- centros de custo;
- creditos e adiantamentos;
- pricing;
- importacao NFS-e.

## Residuos E Riscos

| Tema | Estado |
| --- | --- |
| Appwrite | Residuos ativos removidos; nao retomar como alvo. |
| Supabase | README antigo citava Supabase como backend; nao e mais a direcao oficial. |
| Billing | Deve alinhar com Asaas e com o modelo de cobranca por contexto: NORO cobra tenants em `control`; tenants cobram clientes finais em `core`. |
| Produto | Pode parecer completo pela UI, mas nao deve ser tratado como produto independente no modelo final. |

## Diretriz

Antes de expandir este app, fechar:

- modelo financeiro canonico por contexto;
- relacao com billing/cobranca em `apps/control` e `apps/core`;
- fronteira entre financeiro da NORO e financeiro do tenant;
- fonte de dados PostgreSQL/Drizzle;
- auth Logto;
- Asaas como gateway principal.

Referencias obrigatorias:

- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`

## Comandos

```bash
cd apps/financeiro
npm run dev
npm run build
npm run start
npm run test
```

Porta padrao:

```txt
3003
```

## Proximos Passos

1. Mapear endpoints ativos, mocks e endpoints 410.
2. Manter mensagens de legado sem citar provider abandonado.
3. Migrar a fronteira final para modulos financeiros em `apps/control` e `apps/core`.
4. Implementar dados via PostgreSQL/Drizzle.
5. Integrar com Asaas somente depois do modelo financeiro canonico.
