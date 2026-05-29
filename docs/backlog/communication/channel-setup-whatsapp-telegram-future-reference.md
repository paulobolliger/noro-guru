# Referencia Futura De Configuracao De Canais

Status: backlog operacional para execucao futura.

Data de referencia: 2026-05-27

Documento de origem: `docs/guia-configuracao-canais.md`

## Decisao Atual

Este guia nao deve ser usado ainda como instrucao ativa de producao.

Ele foi movido para backlog porque a plataforma ainda precisa fechar:

- endpoint tecnico oficial para webhooks;
- modelo canonico de comunicacao;
- armazenamento de tokens;
- fluxo de onboarding por tenant;
- permissao de usuarios para configurar canais;
- relacao com `docs/backlog/communication/omnichannel.md`.

## Dominio Oficial De Referencia

Fonte oficial de dominios:

`docs/architecture/domains-cloudflare-dns-current-plan.md`

Para desenho futuro, usar preferencialmente:

```txt
https://api.noro.guru/webhooks/communication/whatsapp
https://api.noro.guru/webhooks/communication/telegram
```

Opcao futura se o dominio dedicado for aprovado:

```txt
https://webhook.noro.guru/communication/whatsapp
https://webhook.noro.guru/communication/telegram
```

Nao usar mais exemplos genericos como:

```txt
https://seu-dominio.com/api/webhooks/whatsapp
```

## Telegram Bot API

### Objetivo

Permitir que um tenant conecte um bot Telegram proprio ao modulo de comunicacao da NORO.

### Passos Manuais Externos

1. Abrir o Telegram.
2. Buscar o bot oficial `@BotFather`.
3. Enviar `/newbot`.
4. Escolher nome amigavel, por exemplo `Atendimento Noro`.
5. Escolher username terminando em `bot`, por exemplo `noro_atendimento_bot`.
6. Guardar o `Bot Token`.

### Dados Necessarios

| Campo | Descricao |
| --- | --- |
| `bot_token` | Token fornecido pelo BotFather. Deve ser tratado como segredo. |
| `tenant_id` | Identificacao interna do tenant, nunca como unico segredo de roteamento. |
| `channel_id` | Identificacao interna do canal conectado. |

### Pendencias De Implementacao

- [ ] Definir tela de conexao do canal.
- [ ] Criptografar `bot_token`.
- [ ] Criar endpoint oficial de webhook.
- [ ] Configurar webhook do Telegram apos salvar canal.
- [ ] Salvar payload bruto para auditoria e reprocessamento.

## WhatsApp Business Cloud API

### Objetivo

Permitir que tenant conecte numero WhatsApp Business oficial via Meta Cloud API.

### Pre-requisitos Externos

- Conta pessoal Facebook.
- Business Manager da Meta.
- App no Meta Developers.
- Produto WhatsApp configurado.
- Numero de telefone nao vinculado a WhatsApp ativo.

### Dados Necessarios

| Campo | Descricao |
| --- | --- |
| `access_token` | Token permanente ou token gerenciado pelo fluxo aprovado. Deve ser segredo. |
| `phone_number_id` | ID do numero no WhatsApp Cloud API. |
| `business_account_id` | ID da conta business, se usado. |
| `verify_token` | Token usado para validacao do webhook. |
| `app_secret` | Usado para validar assinatura quando aplicavel. |

### URL De Webhook Futura

Usar apenas depois que o endpoint existir:

```txt
https://api.noro.guru/webhooks/communication/whatsapp
```

Campos a configurar na Meta:

- URL de retorno: endpoint oficial acima.
- Token de verificacao: valor gerado e salvo pela NORO.
- Campos de webhook: `messages`.

## Seguranca

Requisitos minimos antes de ativar:

- criptografia de tokens;
- validacao de assinatura do provider quando disponivel;
- rate limit nos endpoints publicos;
- idempotencia de eventos;
- logs de falha;
- permissao separada para configurar canal;
- nunca expor `tenant_id` como segredo.

## Proximo Passo

Este guia deve ser revisado novamente quando a Sprint 0 do backlog omnichannel for concluida.

Referencia principal:

`docs/backlog/communication/omnichannel.md`
