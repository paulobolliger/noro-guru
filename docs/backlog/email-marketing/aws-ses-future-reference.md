# Referencia Futura De Email Marketing Com AWS SES

Status: backlog futuro. Nao executar no primeiro momento.

Data de referencia: 2026-05-27

Documento de origem: `docs/arquitetura-email-marketing.md`

## Decisao Atual

A NORO nao vai usar AWS SES no primeiro momento.

Motivo registrado: a AWS nao aprovou/aceitou o uso de SES para a conta neste momento. A possibilidade deve ser reavaliada nos proximos meses.

Este documento fica preservado apenas como referencia tecnica futura para quando:

- a conta AWS tiver acesso de producao ao SES;
- dominios e identidades estiverem verificados;
- a politica de envio estiver aprovada;
- o modelo financeiro novo da NORO estiver consolidado.

## O Que Nao Fazer Agora

- Nao implementar envio de email marketing com AWS SES agora.
- Nao configurar credenciais SES em producao.
- Nao criar fluxo de creditos usando `noro_ai_wallets`.
- Nao tratar `noro_ai_wallets` como carteira financeira central.
- Nao criar checkout ou recarga fora do modelo financeiro oficial.

## Problema Do Documento Antigo

A versao antiga propunha:

```txt
Tenant compra creditos
  -> saldo em noro_ai_wallets
  -> envio debita noro_ai_transactions
  -> type = email_usage
```

Esse desenho nao deve guiar implementacao nova porque conflita com a direcao atual:

- PostgreSQL/Drizzle como base de dados;
- Logto como direcao de auth;
- Asaas como gateway financeiro principal;
- billing dividido entre `platform_billing`, `agency_collections` e `commission_split`;
- add-ons e consumo de plataforma controlados por modelo financeiro canonico.

## Direcao Financeira Correta Para O Futuro

Email marketing deve ser tratado como produto/add-on da plataforma, nao como carteira improvisada de IA.

Modelos possiveis:

| Modelo | Descricao | Observacao |
| --- | --- | --- |
| Incluso no plano | Franquia mensal de envios por plano. | Mais simples para MVP comercial. |
| Add-on recorrente | Pacote mensal de envios adicionais. | Deve entrar em `platform_billing`. |
| Pre-pago | Tenant compra pacote de creditos/envios. | Deve passar por Asaas e ledger interno. |
| Pay-per-use | Uso mensal apurado e cobrado depois. | Exige medicao, fatura e controle de limite. |

Direcao prudente para reavaliacao futura:

1. Definir pacote comercial.
2. Cobrar via Asaas dentro de `platform_billing`.
3. Registrar saldo/franquia em tabela propria de entitlement/usage.
4. Registrar consumo de envio em ledger de uso.
5. Bloquear envio quando limite/franquia acabar.

## Modelo De Dados Futuro

Nomes abaixo sao sugestao de dominio, nao schema final.

### `email_marketing_accounts`

Configura o remetente/tenant.

Campos esperados:

- `id`
- `tenant_id`
- `provider`
- `status`
- `default_sender_email`
- `default_reply_to`
- `domain_verified`
- `created_at`
- `updated_at`

### `email_marketing_campaigns`

Campanhas criadas pelo tenant.

Campos esperados:

- `id`
- `tenant_id`
- `name`
- `subject`
- `status`
- `scheduled_at`
- `sent_at`
- `created_by`
- `created_at`
- `updated_at`

### `email_marketing_usage_events`

Registro de uso para cobranca/limite.

Campos esperados:

- `id`
- `tenant_id`
- `campaign_id`
- `provider`
- `event_type`
- `quantity`
- `unit_cost_cents`
- `total_cost_cents`
- `billing_reference_id`
- `created_at`

## AWS SES Como Provider Futuro

Quando a AWS SES estiver aprovada, validar:

- acesso de producao fora do sandbox;
- dominio `noro.guru` verificado;
- DKIM configurado;
- SPF/DMARC configurados;
- limites de envio;
- reputacao de conta;
- politica de bounce/complaint;
- webhooks/eventos via SNS ou EventBridge;
- se tenants poderao usar dominios proprios ou apenas `Reply-To`.

### Configuracao Tecnica Futura

Variaveis esperadas, apenas quando a decisao for reativada:

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
EMAIL_SENDER_DEFAULT="noreply@noro.guru"
```

Dependencia tecnica futura:

```bash
npm install @aws-sdk/client-ses
```

Nao adicionar essa dependencia agora se o provider nao sera usado.

## Alternativas Para O Primeiro Momento

Como SES nao entra agora, opcoes possiveis para curto prazo:

| Opcao | Uso |
| --- | --- |
| Sem email marketing no MVP | Mais prudente se o foco for billing, core e financeiro. |
| Email transacional simples | Usar provider ja aprovado apenas para notificacoes essenciais. |
| Integracao externa manual | Encaminhar tenant para ferramenta propria, sem envio pela NORO. |

Decisao recomendada no momento:

nao implementar email marketing ate o modelo financeiro e o provider de envio estarem aprovados.

## Sprint Futura Recomendada

### Sprint 0: Reavaliacao

- [ ] Confirmar aprovacao AWS SES.
- [ ] Confirmar provider alternativo se SES continuar bloqueado.
- [ ] Definir pacote comercial: incluso, add-on, pre-pago ou pay-per-use.
- [ ] Confirmar se entra no MVP ou fase posterior.

### Sprint 1: Modelo Financeiro

- [ ] Definir entitlement/franquia por plano.
- [ ] Definir ledger de uso.
- [ ] Integrar compra/recarga ao Asaas.
- [ ] Definir bloqueio por saldo/limite.

### Sprint 2: Modelo De Email

- [ ] Criar tabelas de campanhas, destinatarios e eventos.
- [ ] Criar provider interface para envio.
- [ ] Implementar provider SES ou provider alternativo.
- [ ] Registrar eventos de envio, bounce e complaint.

## Relacao Com Outros Documentos

| Documento | Relacao |
| --- | --- |
| `docs/architecture/billing-asaas-migration-plan.md` | Fonte para cobranca, add-ons e modelo financeiro. |
| `docs/architecture/current-state.md` | Estado atual da arquitetura. |
| `docs/backlog/communication/omnichannel.md` | Relacionado a comunicacao, mas separado de email marketing. |
| `scripts/README.md` | Politica para migrations e scripts. |

## Decisao Atual

Preservar AWS SES como referencia futura.

Nao usar este documento para iniciar implementacao agora.
