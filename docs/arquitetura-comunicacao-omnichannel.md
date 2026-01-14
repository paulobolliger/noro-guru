# Arquitetura de Integração Omnichannel (WhatsApp & Telegram)

Este documento detalha como o sistema NORO se conecta às APIs externas para centralizar mensagens na caixa de entrada unificada.

## 1. Visão Geral do Fluxo

O sistema funciona como um "hub" de mensageria.
1.  **Recebimento (Webhooks):** As plataformas (Meta/Telegram) enviam requisições HTTP POST para o nosso servidor sempre que uma mensagem nova chega.
2.  **Normalização:** Nossas rotas de API (`/api/webhooks/...`) traduzem o formato específico de cada plataforma para o nosso formato padrão (`noro_comm_messages`).
3.  **Armazenamento:** A mensagem é salva no Supabase.
4.  **Tempo Real:** O frontend (via Supabase Realtime) recebe a nova mensagem instantaneamente.
5.  **Envio:** Quando o agente responde, chamamos a API externa para entregar a resposta ao cliente.

---

## 2. WhatsApp Business (Cloud API)

Utilizaremos a **API Cloud do WhatsApp** hospedada pela Meta (mais barata e fácil de manter que a on-premise).

### Configuração por Tenant
Cada tenant (cliente NORO) precisará conectar seu número comercial.
*   **Modelo de App:** O ideal é um "Tech Provider" app, mas para o MVP, cada tenant pode criar seu App no Meta Developers ou usamos um número centralizado se o modelo de negócio permitir (mais complexo).
*   **Dados Necessários (`noro_comm_channels.config`):**
    *   `access_token`: Token de longa duração.
    *   `phone_number_id`: ID do número de telefone no WhatsApp.
    *   `verify_token`: Token para validar o webhook.
    *   `app_secret`: Para validar a assinatura das requisições (segurança).

### Webhook (Recebimento)
Endpoint: `POST /api/webhooks/whatsapp`
1.  O Payload JSON chega com a mensagem.
2.  Extraímos: `from` (telefone do cliente), `body` (texto), `type` (image/text).
3.  Buscamos ou criamos o contato na `noro_comm_contacts` com base no telefone.
4.  Inserimos na `noro_comm_messages`.

### Envio de Mensagens
Endpoint da Meta: `https://graph.facebook.com/v17.0/{phone_number_id}/messages`
*   Header: `Authorization: Bearer {access_token}`
*   Body:
    ```json
    {
      "messaging_product": "whatsapp",
      "to": "5511999999999",
      "text": { "body": "Olá, tudo bem?" }
    }
    ```

---

## 3. Telegram Bot API

O Telegram é muito mais simples. Cada tenant cria seu bot com o **@BotFather**.

### Configuração por Tenant
*   **Dados Necessários (`noro_comm_channels.config`):**
    *   `bot_token`: Token fornecido pelo BotFather (ex: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`).

### Webhook (Recebimento)
Endpoint: `POST /api/webhooks/telegram/{tenant_id}`
*   Para configurar, fazemos uma chamada única: `https://api.telegram.org/bot{token}/setWebhook?url=https://noro.guru/api/webhooks/telegram/{tenant_id}`.
*   O Telegram envia cada update para essa URL.

### Envio de Mensagens
Endpoint do Telegram: `https://api.telegram.org/bot{token}/sendMessage`
*   Body:
    ```json
    {
      "chat_id": "123456789",
      "text": "Olá, esta é uma resposta."
    }
    ```

---

## 4. O Desafio dos 24h (WhatsApp)

O WhatsApp tem uma regra estrita: **Janela de Atendimento de 24h**.
*   Se o cliente mandou mensagem há menos de 24h, podemos responder livremente (texto livre).
*   Se passou de 24h, só podemos enviar **Templates Pré-aprovados** (mensagens ativas).
*   **Solução no Sistema:** O chat deve bloquear o input de texto livre se a última mensagem do cliente foi há > 24h e forçar o agente a selecionar um Template.

## 5. Próximos Passos de Implementação (Roadmap)

1.  [Backend] Criar rotas `/api/webhooks/whatsapp` e `/api/webhooks/telegram`.
2.  [UI] Criar modal de "Conectar Canal" nas configurações, pedindo Tokens.
3.  [Backend] Criar funções de envio ("Sender Services") para cada provedor.
