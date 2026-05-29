# Backlog De Comunicacao Omnichannel

Status: backlog tecnico para execucao futura.

Data de referencia: 2026-05-27

Documento de origem: `docs/arquitetura-comunicacao-omnichannel.md`

## Objetivo

Registrar a direcao futura para a camada de comunicacao omnichannel da NORO sem tratar o fluxo como arquitetura ja implantada.

Este documento substitui a versao antiga que assumia Supabase, Supabase Realtime e endpoints genericos. A implementacao futura deve ser desenhada sobre a arquitetura atual do projeto:

- PostgreSQL central;
- Drizzle em `packages/db`;
- Logto em `packages/auth`;
- multi-tenant com isolamento por `tenant_id`;
- dominios oficiais definidos em `docs/architecture/domains-cloudflare-dns-current-plan.md`;
- politica de scripts e migrations em `scripts/README.md`.

## Escopo Futuro

A camada omnichannel deve centralizar conversas e eventos de atendimento vindos de canais externos.

### Canais iniciais

| Canal | Prioridade | Observacao |
| --- | --- | --- |
| WhatsApp Business Cloud API | Alta | Principal canal esperado para agencias brasileiras. |
| Telegram Bot API | Media | Mais simples tecnicamente; bom para validar arquitetura de canal. |
| Instagram/Facebook | Futura | Deve ser tratado junto ao plano de redes sociais. |
| Email transacional/marketing | Separado | Ver backlog especifico de email marketing antes de misturar dominios. |

## Fronteira De Produto

Omnichannel nao deve ser confundido com:

- billing ou cobranca;
- CRM completo;
- automacao n8n;
- disparo de marketing em massa;
- suporte interno da NORO;
- inbox operacional do tenant sem provider externo.

A fronteira recomendada e:

```txt
Canal externo
  -> webhook de entrada
  -> normalizacao
  -> contato/conversa/mensagem
  -> inbox do tenant
  -> envio de resposta pelo provider
```

## Local Provavel Da Implementacao

Decisao ainda pendente.

Opcoes a validar antes de executar:

| Opcao | Uso |
| --- | --- |
| `apps/api` futuro | Melhor se a NORO criar uma API central para webhooks externos. |
| `apps/control` | Adequado apenas para operacao/admin; nao recomendado como entrada publica principal de webhooks. |
| `apps/core` / `app.noro.guru` | Adequado para inbox do tenant, mas nao necessariamente para receber webhooks. |
| `packages/control-worker` | Adequado para processamento assíncrono apos receber eventos. |

Direcao prudente:

1. Receber webhooks em endpoint tecnico sob `api.noro.guru` ou `webhook.noro.guru`.
2. Persistir evento bruto de forma idempotente.
3. Processar normalizacao em worker.
4. Expor inbox no app do tenant.

## Dominios E URLs

Fonte oficial de dominios:

`docs/architecture/domains-cloudflare-dns-current-plan.md`

Endpoints antigos como:

```txt
https://noro.guru/api/webhooks/telegram/{tenant_id}
/api/webhooks/whatsapp
```

nao devem ser assumidos como finais.

Modelo recomendado para desenho futuro:

```txt
https://api.noro.guru/webhooks/communication/whatsapp
https://api.noro.guru/webhooks/communication/telegram
```

ou, se o subdominio dedicado for aprovado:

```txt
https://webhook.noro.guru/communication/whatsapp
https://webhook.noro.guru/communication/telegram
```

O `tenant_id` nao deve ser usado como unico segredo na URL. A identificacao do tenant deve vir de configuracao do canal, assinatura do provider, token de verificacao e dados do payload.

## Modelo De Dados Futuro

Nomes abaixo sao proposta de dominio, nao schema final.

### `communication_channels`

Configura canais conectados por tenant.

Campos esperados:

- `id`
- `tenant_id`
- `provider`
- `external_account_id`
- `display_name`
- `status`
- `config_encrypted`
- `created_at`
- `updated_at`

### `communication_contacts`

Representa o contato externo dentro do tenant.

Campos esperados:

- `id`
- `tenant_id`
- `provider`
- `external_contact_id`
- `name`
- `phone`
- `email`
- `metadata`
- `created_at`
- `updated_at`

### `communication_conversations`

Agrupa mensagens por contato/canal.

Campos esperados:

- `id`
- `tenant_id`
- `channel_id`
- `contact_id`
- `status`
- `last_message_at`
- `last_inbound_at`
- `assigned_user_id`
- `created_at`
- `updated_at`

### `communication_messages`

Armazena mensagens normalizadas.

Campos esperados:

- `id`
- `tenant_id`
- `conversation_id`
- `channel_id`
- `provider`
- `provider_message_id`
- `direction`
- `message_type`
- `body`
- `media`
- `status`
- `sent_at`
- `received_at`
- `created_at`

### `communication_webhook_events`

Armazena payload bruto de webhooks para idempotencia e auditoria.

Campos esperados:

- `id`
- `provider`
- `event_id`
- `tenant_id`
- `channel_id`
- `payload`
- `signature_valid`
- `processed`
- `processed_at`
- `created_at`

## WhatsApp Business Cloud API

### Decisoes Antes Da Implementacao

| Tema | Decisao pendente |
| --- | --- |
| Modelo Meta | Tech Provider app da NORO ou app individual por tenant. |
| Onboarding | Conexao self-service no app ou configuracao assistida. |
| Numero | Numero do tenant, numero centralizado ou ambos. |
| Templates | Quem cria/aprova templates e como expor no app. |
| Custo | Se sera repassado por tenant, incluso no plano ou cobrado como add-on. |

### Dados Sensíveis

Nao salvar tokens em texto puro.

Configuracoes sensiveis devem usar criptografia em repouso ou storage secreto aprovado para:

- access token;
- app secret;
- verify token;
- phone number id;
- business account id.

### Janela De 24 Horas

O WhatsApp limita resposta livre fora da janela de atendimento.

Regra de produto:

- se a ultima mensagem inbound do cliente tiver menos de 24 horas, permitir resposta livre;
- se passou de 24 horas, exigir template aprovado;
- registrar no banco o `last_inbound_at` da conversa;
- UI deve bloquear envio livre quando a conversa estiver fora da janela.

## Telegram Bot API

Telegram pode ser usado como canal de validacao por ser mais simples.

Pontos principais:

- cada tenant pode conectar um bot criado no BotFather;
- token deve ser protegido;
- webhook deve apontar para dominio tecnico oficial;
- `tenant_id` nao deve ser exposto como mecanismo unico de roteamento ou seguranca.

## Processamento E Tempo Real

A versao antiga assumia Supabase Realtime. Isso nao deve ser assumido daqui para frente.

Alternativas a decidir:

| Necessidade | Possivel solucao |
| --- | --- |
| Persistencia | PostgreSQL/Drizzle. |
| Eventos assíncronos | Graphile Worker em `packages/control-worker` ou fila dedicada. |
| Inbox em tempo real | WebSocket/SSE/Polling controlado, a definir. |
| Reprocessamento | Tabela de eventos brutos + job idempotente. |

## Seguranca

Requisitos minimos:

- validar assinatura do provider quando disponivel;
- armazenar payload bruto para auditoria;
- garantir idempotencia por `provider + event_id`;
- nunca confiar apenas em `tenant_id` vindo da URL;
- criptografar tokens;
- registrar falhas de processamento;
- separar permissao de configurar canal da permissao de operar inbox;
- aplicar rate limit em endpoints publicos.

## Sprint Recomendada Para Execucao

### Sprint 0: Decisoes

- [ ] Escolher local dos endpoints publicos: `api.noro.guru` ou `webhook.noro.guru`.
- [ ] Definir se WhatsApp usara Tech Provider app ou app por tenant.
- [ ] Definir se inbox fica em `apps/core` ou app operacional equivalente.
- [ ] Definir mecanismo de tempo real.
- [ ] Definir politica de cobranca/custo por canal.

### Sprint 1: Modelo Canonico

- [ ] Criar schema Drizzle para canais, contatos, conversas, mensagens e eventos.
- [ ] Criar migrations conforme `scripts/README.md`.
- [ ] Criar camada de dominio sem acoplar direto a Meta/Telegram.
- [ ] Criar tabela de eventos idempotentes.

### Sprint 2: Webhook Gateway

- [ ] Criar endpoint de verificacao WhatsApp.
- [ ] Criar endpoint de recebimento WhatsApp.
- [ ] Criar endpoint de recebimento Telegram.
- [ ] Salvar payload bruto antes de processar.
- [ ] Criar worker de normalizacao.

### Sprint 3: Inbox MVP

- [ ] Listar conversas por tenant.
- [ ] Exibir mensagens normalizadas.
- [ ] Enviar resposta pelo canal configurado.
- [ ] Registrar status de envio.
- [ ] Aplicar regra de janela de 24h do WhatsApp.

### Sprint 4: Onboarding De Canal

- [ ] Tela de conectar WhatsApp.
- [ ] Tela de conectar Telegram.
- [ ] Teste de webhook por canal.
- [ ] Rotacao/revogacao de tokens.
- [ ] Logs de falha por canal.

### Sprint 5: Operacao E Compliance

- [ ] Auditoria de mensagens/eventos.
- [ ] Exportacao ou retencao configuravel.
- [ ] Permissoes por papel.
- [ ] Alertas de canal desconectado.
- [ ] Dashboards de volume e falhas.

## Relacao Com Outros Documentos

| Documento | Relacao |
| --- | --- |
| `docs/architecture/current-state.md` | Fonte do estado arquitetural atual. |
| `docs/architecture/data-auth-transition.md` | Define transicao para Logto/PostgreSQL/Drizzle. |
| `docs/architecture/domains-cloudflare-dns-current-plan.md` | Define dominios oficiais e candidatos para webhooks. |
| `scripts/README.md` | Define politica de migrations/scripts. |
| `docs/backlog/communication/channel-setup-whatsapp-telegram-future-reference.md` | Guia operacional futuro para configurar WhatsApp e Telegram. |
| `docs/backlog/social-integrations/oauth-social-networks-future-reference.md` | Relacionado a Meta/Instagram/Facebook e outros providers sociais. |

## Decisao Atual

Manter omnichannel como backlog tecnico/produto.

Nao implementar nova funcionalidade sobre Supabase Realtime, Appwrite ou endpoints antigos sem antes fechar as decisoes da Sprint 0.
