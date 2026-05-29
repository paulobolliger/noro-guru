# App Billing

App: `apps/billing`

Status: legado/transicional. Nao tratar como produto separado no modelo final.

## Papel

`apps/billing` existe hoje como area tecnica de billing/cobranca, mas a fronteira final de produto nao deve ser um app isolado.

Billing e uma feature dentro dos sistemas principais:

| Contexto | Responsabilidade |
| --- | --- |
| `apps/control` | Cobranca dos tenants: mensalidades, setup, add-ons, servicos, inadimplencia, status financeiro do contrato e recebiveis da NORO. |
| `apps/core` | Ferramenta de cobranca dos tenants para clientes finais: Pix, boleto, cartao, parcelamento, links de pagamento, assinaturas, reembolsos e status de pagamento. |

## Direcao Oficial

- Gateway principal: Asaas.
- Stripe, Cielo, BTG e eRede: legado/transicional.
- Billing deve se integrar ao financeiro nos dois contextos.
- O tenant nao deve acessar ferramentas de cobranca da plataforma NORO.
- O Control Plane nao deve misturar recebiveis internos da NORO com recebiveis operacionais dos tenants sem separacao clara.

## Relacao Com Financeiro

| Contexto | Billing | Financeiro |
| --- | --- | --- |
| `apps/control` | Gera cobrancas de mensalidades e servicos dos tenants. | Controla recebimentos, inadimplencia, fluxo de caixa e relatorios da NORO. |
| `apps/core` | Gera cobrancas dos clientes finais do tenant. | Controla recebiveis, baixas, despesas, fluxo de caixa e conciliacao do tenant. |

## Referencias

- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/architecture/current-state.md`
- `docs/apps/control.README.md`
- `docs/apps/core.README.md`
- `docs/apps/financeiro.README.md`
