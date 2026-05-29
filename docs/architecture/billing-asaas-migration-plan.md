# Plano de Migracao Billing Asaas

Documento de referencia para orientar a migracao financeira da NORO Platform para Asaas, evitando mudancas estruturais fora de ordem.

## 1. Decisao Arquitetural

O Asaas sera o gateway financeiro principal para novos fluxos da NORO.

Gateways atuais como Stripe, Cielo e BTG devem ser tratados como legado durante a transicao, nao removidos imediatamente.

## 2. Objetivo Da Migracao

Criar uma arquitetura financeira propria da NORO, desacoplada de gateways especificos, capaz de suportar:

- billing SaaS da propria NORO;
- cobrancas das agencias para clientes finais;
- Pix;
- boleto;
- cartao;
- parcelamento;
- assinatura recorrente;
- checkout/link de pagamento;
- subcontas;
- split financeiro;
- comissao da NORO;
- webhooks;
- conciliacao futura.

## 3. Diagnostico Atual Do Projeto

### Apps Envolvidos

| App | Papel atual | Observacao |
| --- | --- | --- |
| `apps/billing` | Billing SaaS, portal e checkout | Fortemente acoplado a Stripe |
| `apps/control` | Control Plane, tenants, pedidos, pagamentos | Possui providers Stripe, Cielo e BTG para cobrancas de pedidos |
| `apps/financeiro` | Gestao financeira operacional | Deve consumir dados financeiros, nao necessariamente emitir gateway direto |
| `apps/core` | Operacao do tenant/agencia | Deve visualizar cobrancas, status e assinaturas |

### Pontos De Acoplamento Atuais

- `apps/billing/lib/stripe.ts`: cria customer, checkout e portal Stripe.
- `apps/billing/app/actions.ts`: cria sessao do portal Stripe.
- `packages/lib/services/billingService.ts`: persiste `stripeCustomerId` no tenant.
- `apps/billing/lib/types.ts`: tipos possuem `stripe_*` e `cielo_*`.
- `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts`: cria checkout Stripe para pedido.
- `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts`: cria transacao Cielo.
- `apps/control/app/(protected)/pedidos/providers/btg-provider.ts`: cria Bolepix BTG.
- `apps/control/app/(protected)/pedidos/pedidos-actions.ts`: escolhe provider diretamente.
- `supabase/migrations/20260519000000_create_noro_cobrancas.sql`: tabela de cobrancas aceita `STRIPE`, `CIELO`, `BTG`, `BOLETO`, `MANUAL`, mas ainda nao aceita `ASAAS`.

## 4. Separacao Obrigatoria De Dominios

A migracao deve separar tres dominios financeiros:

| Dominio | Descricao | Exemplo |
| --- | --- | --- |
| `platform_billing` | Cobranca da NORO contra a agencia | mensalidade SaaS, setup, add-ons |
| `agency_collections` | Cobranca da agencia contra o cliente final | pacote de viagem, servico, boleto, Pix |
| `commission_split` | Receita da NORO sobre transacao da agencia | 8% de comissao em uma venda |

Essa separacao deve acontecer antes de remover Stripe/Cielo/BTG.

## 5. Principios Da Nova Arquitetura

- A aplicacao nao deve chamar Asaas diretamente de telas ou actions espalhadas.
- Toda integracao deve passar por uma interface de provider.
- O banco nao deve ficar preso a colunas como `stripe_invoice_id` ou `asaas_payment_id` como modelo principal.
- IDs especificos do gateway devem ficar em campos genericos `provider_*` ou em `provider_payload`.
- Webhooks devem ser idempotentes.
- Nao salvar PAN, CVV ou dados completos de cartao.
- Preferir checkout hospedado, link de pagamento ou tokenizacao.
- Stripe/Cielo/BTG devem ficar em modo legado ate o cutover estar validado.

## 6. Modelo Canonico Recomendado

### PaymentProviderInterface

```ts
interface PaymentProvider {
  createCustomer(input: CreateCustomerInput): Promise<ProviderCustomer>;
  createCharge(input: CreateChargeInput): Promise<ProviderCharge>;
  createSubscription(input: CreateSubscriptionInput): Promise<ProviderSubscription>;
  refundCharge(input: RefundChargeInput): Promise<ProviderRefund>;
  getCharge(input: GetChargeInput): Promise<ProviderCharge>;
  parseWebhook(input: WebhookInput): Promise<ProviderWebhookEvent>;
}
```

### Providers

```txt
PaymentProvider
├── AsaasProvider
├── StripeLegacyProvider
├── CieloLegacyProvider
└── BtgLegacyProvider
```

### Status Internos

Usar status internos independentes do gateway:

| Status interno | Uso |
| --- | --- |
| `draft` | criado internamente, ainda nao enviado ao gateway |
| `pending` | aguardando pagamento |
| `processing` | em processamento |
| `confirmed` | confirmado pelo gateway |
| `received` | recebido/liquidado |
| `overdue` | vencido |
| `refunded` | reembolsado |
| `canceled` | cancelado |
| `failed` | falha |

## 7. Campos De Banco Recomendados

### `payment_provider_accounts`

Conta financeira por tenant/agencia.

```sql
id
tenant_id
provider
provider_account_id
provider_wallet_id
provider_api_key_encrypted
onboarding_status
status
metadata
created_at
updated_at
```

Para Asaas:

- `provider = 'ASAAS'`
- `provider_account_id = id da subconta Asaas`
- `provider_wallet_id = walletId da subconta`
- `provider_api_key_encrypted = apiKey da subconta, se a NORO precisar operar em nome dela`

### `payment_customers`

Cliente financeiro no gateway.

```sql
id
tenant_id
customer_id
provider
provider_customer_id
name
email
phone
cpf_cnpj
metadata
created_at
updated_at
```

### `payment_charges`

Cobranca avulsa.

```sql
id
tenant_id
customer_id
source_type
source_id
provider
provider_payment_id
amount
net_amount
currency
billing_type
installments
status
due_date
paid_at
confirmed_at
received_at
checkout_url
invoice_url
bank_slip_url
pix_qr_code
pix_copy_paste
provider_payload
created_at
updated_at
```

`source_type` deve indicar origem da cobranca:

- `pedido`
- `subscription`
- `addon`
- `manual`
- `setup`

### `payment_subscriptions`

Assinaturas recorrentes.

```sql
id
tenant_id
customer_id
plan_id
provider
provider_subscription_id
amount
currency
cycle
status
next_due_date
started_at
canceled_at
provider_payload
created_at
updated_at
```

### `payment_splits`

Split e comissao.

```sql
id
tenant_id
charge_id
provider
provider_split_id
recipient_type
recipient_wallet_id
amount
percentage
status
rule_snapshot
provider_payload
created_at
updated_at
```

`recipient_type`:

- `tenant`
- `noro`
- `partner`

### `payment_webhook_events`

Eventos brutos e idempotentes.

```sql
id
provider
provider_event_id
event_type
payment_id
subscription_id
payload
processed
processed_at
error
created_at
```

Regra obrigatoria:

```sql
unique(provider, provider_event_id)
```

## 8. Ajuste Na Tabela Atual `noro_cobrancas`

Antes de implementar Asaas em producao, ajustar a tabela atual para:

- aceitar `ASAAS` no campo `provider`;
- padronizar `transaction_id` como `provider_payment_id`, ou criar coluna nova;
- guardar URLs e payloads necessarios para Pix, boleto e checkout;
- incluir status internos canonicos;
- garantir `tenant_id` obrigatorio em novas cobrancas;
- manter dados antigos de Stripe/Cielo/BTG para historico.

## 9. Estrategia De Webhooks

Criar endpoint novo:

```txt
/api/webhooks/asaas
```

Eventos prioritarios:

| Evento Asaas | Acao interna |
| --- | --- |
| `PAYMENT_CREATED` | registrar ou atualizar cobranca |
| `PAYMENT_CONFIRMED` | marcar como confirmado |
| `PAYMENT_RECEIVED` | marcar como recebido/pago |
| `PAYMENT_OVERDUE` | marcar como vencido |
| `PAYMENT_REFUNDED` | marcar como reembolsado |
| `PAYMENT_DELETED` | marcar como cancelado/removido |
| `SUBSCRIPTION_CREATED` | registrar assinatura |
| `SUBSCRIPTION_UPDATED` | atualizar assinatura |
| `SUBSCRIPTION_DELETED` | cancelar assinatura |

Ordem de processamento:

1. Validar autenticidade conforme configuracao Asaas.
2. Salvar payload bruto em `payment_webhook_events`.
3. Ignorar evento duplicado.
4. Mapear status externo para status interno.
5. Atualizar charge/subscription.
6. Atualizar pedido/tenant quando aplicavel.
7. Registrar erro sem perder payload.

## 10. Estrategia De Cutover

### Durante A Transicao

- Novas cobrancas piloto usam Asaas.
- Cobrancas existentes continuam no gateway original.
- Webhooks antigos continuam ativos ate liquidacao/cancelamento das cobrancas antigas.
- UI deve esconder gateways legados para tenants migrados.

### Apos Validacao

- Novos tenants usam Asaas por padrao.
- Stripe/Cielo/BTG ficam somente leitura.
- Remover criacao de novas cobrancas legadas.
- Planejar remocao de codigo legado em sprint separada.

## 11. Sprints De Implantacao

### Sprint 0: Inventario E Travamento De Escopo

Objetivo: entender impacto e evitar mudanca estrutural fora de ordem.

Entregas:

- Mapear fluxos atuais de billing, pedidos, pagamentos e financeiro.
- Confirmar quais tabelas estao em uso real: `cp.*`, `billing.*`, `public.noro_cobrancas`.
- Confirmar quais apps devem emitir cobranca e quais apenas consultar.
- Definir ambientes Asaas: sandbox e producao.
- Definir conta master NORO no Asaas.
- Definir modelo de subconta por tenant/agencia.

Checklist:

- [ ] Identificar todas as env vars atuais de Stripe, Cielo e BTG.
- [ ] Identificar rotas de webhook existentes.
- [ ] Identificar telas que exibem ou emitem cobrancas.
- [ ] Definir owner tecnico da migracao.
- [ ] Definir plano de rollback.

Nao fazer nesta sprint:

- remover Stripe;
- remover Cielo;
- remover BTG;
- mudar UI de pagamento;
- alterar cobrancas em producao.

### Sprint 1: Modelo Canonico E Schema

Objetivo: preparar o banco e os contratos internos.

Entregas:

- Criar migration para tabelas `payment_*`.
- Ajustar `noro_cobrancas` para suportar `ASAAS`.
- Criar enums/status internos.
- Criar tabela de webhooks idempotentes.
- Criar interface `PaymentProvider`.
- Criar adaptadores legacy vazios ou wrappers para Stripe/Cielo/BTG.

Checklist:

- [ ] Migration revisada.
- [ ] RLS revisada para multi-tenant.
- [ ] Campos sensiveis definidos com criptografia quando necessario.
- [ ] Status internos documentados.
- [ ] Testes basicos de mapeamento de status.

Dependencia:

- Esta sprint deve acontecer antes de qualquer tela nova de Asaas.

### Sprint 2: AsaasProvider MVP

Objetivo: implementar Asaas isolado, sem cutover.

Entregas:

- Cliente HTTP Asaas.
- `createCustomer`.
- `createCharge`.
- `createPixPayment`.
- `createBoletoPayment`.
- `createCheckoutPayment` ou link de pagamento.
- Mapeamento de resposta Asaas para modelo interno.
- Tratamento de erros.
- Idempotencia por chave interna quando aplicavel.

Checklist:

- [ ] Criar customer sandbox.
- [ ] Criar cobranca Pix sandbox.
- [ ] Criar cobranca boleto sandbox.
- [ ] Criar cobranca cartao/checkout sandbox.
- [ ] Persistir `provider_payment_id`.
- [ ] Persistir URLs/QR code quando retornados.

Nao fazer nesta sprint:

- split automatico;
- migrar billing SaaS;
- remover provider antigo.

### Sprint 3: Webhooks Asaas

Objetivo: sincronizar status financeiro com seguranca.

Entregas:

- Endpoint `/api/webhooks/asaas`.
- Persistencia de payload bruto.
- Deduplicacao.
- Processor de eventos.
- Atualizacao de `payment_charges`.
- Atualizacao de `noro_cobrancas`/pedido quando aplicavel.

Checklist:

- [ ] Evento recebido salva payload.
- [ ] Evento duplicado nao altera duas vezes.
- [ ] `PAYMENT_CONFIRMED` altera status corretamente.
- [ ] `PAYMENT_RECEIVED` marca como pago.
- [ ] `PAYMENT_OVERDUE` marca como vencido.
- [ ] Erro de processamento fica registrado.

Dependencia:

- Deve vir antes de liberar Asaas para usuario final.

### Sprint 4: Cobranca De Pedido Via Asaas

Objetivo: substituir o fluxo operacional de pedido para novos pagamentos.

Entregas:

- Alterar action de emitir cobranca para usar `PaymentProvider`.
- Trocar escolha de gateway por escolha de metodo: Pix, boleto, cartao/link.
- Criar cobranca Asaas associada ao pedido.
- Exibir link/QR code/linha digitavel na tela do pedido.
- Atualizar status do pedido via webhook.

Checklist:

- [ ] Emitir Pix de um pedido.
- [ ] Emitir boleto de um pedido.
- [ ] Emitir cartao/checkout de um pedido.
- [ ] Reprocessar webhook sem duplicidade.
- [ ] Pedido muda para `AGUARDANDO_PAGAMENTO`.
- [ ] Pedido muda para pago/concluido quando recebido.

Dependencia:

- Sprint 1, 2 e 3 completas.

### Sprint 5: Subcontas Por Tenant

Objetivo: preparar arquitetura multi-tenant financeira.

Entregas:

- Criar fluxo de cadastro/subconta Asaas para agencia.
- Salvar `provider_account_id`.
- Salvar `provider_wallet_id`.
- Salvar status de onboarding.
- Definir quando usar conta master versus subconta.

Checklist:

- [ ] Criar subconta sandbox.
- [ ] Vincular subconta ao tenant.
- [ ] Validar walletId.
- [ ] Definir rotina de revalidacao cadastral.
- [ ] Bloquear split/cobranca quando tenant nao estiver apto.

Observacao:

- Se o MVP ainda nao exigir subcontas reais, esta sprint pode criar a estrutura e deixar o onboarding manual.

### Sprint 6: Split E Comissao NORO

Objetivo: automatizar receita da NORO em cobrancas das agencias.

Entregas:

- Criar regra de comissao por tenant/plano.
- Criar snapshot da regra aplicada na cobranca.
- Enviar split na criacao da cobranca.
- Persistir resultado do split.
- Criar relatorio simples de comissoes.

Checklist:

- [ ] Split percentual.
- [ ] Split valor fixo.
- [ ] Comissao NORO registrada.
- [ ] Valor liquido da agencia registrado.
- [ ] Falha de split bloqueia cobranca ou gera erro controlado.

Dependencia:

- Subcontas e walletId validados.

### Sprint 7: Billing SaaS Da NORO

Objetivo: migrar mensalidade, setup e add-ons da NORO para Asaas.

Entregas:

- Substituir Stripe checkout/portal por fluxo Asaas.
- Criar assinatura Asaas para tenant.
- Migrar planos internos.
- Criar tela propria de faturas/assinatura.
- Manter IDs Stripe legados apenas para historico.

Checklist:

- [ ] Criar assinatura mensal.
- [ ] Criar assinatura anual, se aplicavel.
- [ ] Cancelar assinatura.
- [ ] Reativar assinatura.
- [ ] Atualizar status do tenant por webhook.
- [ ] Registrar inadimplencia.

Dependencia:

- Webhook Asaas estavel.
- Modelo canonico implantado.

### Sprint 8: Conciliacao E Financeiro

Objetivo: conectar pagamentos reais ao modulo financeiro.

Entregas:

- Criar lancamentos financeiros a partir de recebimentos.
- Conectar `payment_charges` ao `apps/financeiro`.
- Criar dashboard de recebidos, pendentes, vencidos e reembolsados.
- Registrar comissoes NORO.
- Preparar DRE/fluxo de caixa futuro.

Checklist:

- [ ] Recebimento gera lancamento.
- [ ] Reembolso gera reversao.
- [ ] Comissao aparece separada.
- [ ] Tenant so ve seus dados.
- [ ] Control Plane ve consolidado.

### Sprint 9: Desativacao Do Legado

Objetivo: remover risco e reduzir complexidade.

Entregas:

- Bloquear novas cobrancas Stripe/Cielo/BTG.
- Manter leitura historica.
- Remover env vars nao usadas de novos ambientes.
- Remover telas de selecao de gateway legado.
- Criar issue separada para apagar codigo legado com seguranca.

Checklist:

- [ ] Nenhuma nova cobranca usa Stripe.
- [ ] Nenhuma nova cobranca usa Cielo.
- [ ] Nenhuma nova cobranca usa BTG.
- [ ] Webhooks antigos mantidos apenas enquanto houver transacoes pendentes.
- [ ] Documentacao atualizada.

## 12. Ordem Mais Prudente

A ordem recomendada e:

```txt
1. Inventario
2. Modelo canonico
3. Schema novo
4. AsaasProvider isolado
5. Webhooks
6. Cobranca de pedido
7. Subcontas
8. Split
9. Billing SaaS NORO
10. Conciliacao
11. Remocao do legado
```

O ponto mais importante: nao migrar tela antes de webhook e modelo canonico. Sem isso, a plataforma ate consegue emitir cobranca, mas nao consegue confiar no status financeiro.

## 13. Riscos E Mitigacoes

| Risco | Impacto | Mitigacao |
| --- | --- | --- |
| Webhook duplicado | Pedido pago duas vezes ou status incorreto | `unique(provider, provider_event_id)` |
| Mudanca direta de Stripe para Asaas | Quebra de billing SaaS | rodar Asaas em paralelo |
| Cartao sem checkout hospedado | Risco PCI | usar checkout/link/tokenizacao |
| Misturar billing NORO e cobranca da agencia | Relatorios incorretos | separar dominios |
| Split antes de subconta validada | Erro operacional | validar walletId antes |
| Remover legado cedo demais | Perda de historico ou cobrancas pendentes | modo somente leitura |

## 14. Criterios De Pronto Para Producao

Antes de ativar Asaas para todos:

- [ ] Criacao de customer testada.
- [ ] Pix testado.
- [ ] Boleto testado.
- [ ] Cartao/checkout testado.
- [ ] Webhook de pagamento confirmado testado.
- [ ] Webhook de pagamento recebido testado.
- [ ] Webhook de vencido testado.
- [ ] Reembolso testado.
- [ ] Idempotencia validada.
- [ ] Logs visiveis no Control Plane.
- [ ] Rollback definido.
- [ ] Tenant piloto validado.

## 15. Decisoes Pendentes

- A NORO vai operar sempre pela conta master ou cada tenant tera subconta desde o MVP?
- O billing SaaS da NORO migra junto ou fica temporariamente em Stripe?
- A comissao NORO sera percentual, fixa ou hibrida?
- O checkout sera sempre hospedado pelo Asaas ou havera tela propria com tokenizacao?
- Quais dados cadastrais serao obrigatorios para criar subconta?
- Qual app sera o dono da API financeira: `apps/billing`, `apps/control` ou um futuro `apps/api`?

## 16. Recomendacao Final

A migracao deve ser feita de forma incremental.

Primeiro criar o dominio financeiro canonico e o provider Asaas em paralelo. Depois liberar cobrancas reais para poucos tenants. Somente apos webhooks, status e conciliacao minima estarem estaveis, migrar o billing SaaS da NORO e desativar Stripe/Cielo/BTG.

Essa e a ordem mais prudente porque reduz risco financeiro, preserva historico e evita reescrever a arquitetura enquanto ha cobrancas em aberto.
