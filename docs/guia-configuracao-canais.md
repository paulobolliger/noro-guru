# Guia de Configuração de Canais (WhatsApp & Telegram)

Este guia prático ensina como criar os aplicativos e obter as credenciais necessárias nas plataformas externas para conectar ao Módulo de Comunicação do NORO.

---

## 1. Telegram (Nível: Fácil)

A integração com Telegram é feita através de bots. É o processo mais simples.

### Passo 1: Criar o Bot
1.  Abra o seu aplicativo do Telegram.
2.  Busque pelo usuário **@BotFather** (é um bot oficial verificado).
3.  Inicie uma conversa e envie o comando: `/newbot`.
4.  **Nome do Bot:** Escolha um nome amigável (ex: "Atendimento Noro").
5.  **Username do Bot:** Escolha um identificador único que **obrigatoriamente** termine em `bot` (ex: `noro_atendimento_bot`).

### Passo 2: Obter o Token
1.  Se o nome for válido, o BotFather responderá com uma mensagem de sucesso.
2.  Procure pela frase: *"Use this token to access the HTTP API:"*.
3.  Copie o código que se parece com isso: `123456789:ABCDefGHIjklMnoPQrsTuvWxyZ`.
4.  **Guarde este Token.** Ele será inserido nas configurações do canal no painel do NORO.

---

## 2. WhatsApp Business API (Nível: Médio/Difícil)

Para usar o WhatsApp oficialmente sem depender de celular ligado (QR Code), usamos a **Cloud API** da Meta.

### Pré-requisitos
*   Uma conta no Facebook pessoal.
*   Uma conta empresarial (Business Manager) da Meta - *será criada no processo se não tiver*.
*   Um número de telefone que **NÃO esteja vinculado** a nenhuma conta de WhatsApp ativa (é necessário excluir a conta antiga ou usar um número novo).

### Passo 1: Criar App no Meta Developers
1.  Acesse [developers.facebook.com](https://developers.facebook.com/).
2.  Vá em **Meus Apps** > **Criar App**.
3.  Tipo de App: Selecione **"Outro"** (ou "Empresarial" dependendo da atualização da tela).
4.  Selecione **"Empresa"** (Business).
5.  Preencha o nome (ex: "Noro Chat") e associe à sua conta empresarial.

### Passo 2: Adicionar Produto WhatsApp
1.  No painel do app, procure por **WhatsApp** na lista de produtos e clique em **Configurar**.
2.  Aceite os termos da Business Platform.

### Passo 3: Configurar Token e Número (Ambiente de Teste)
A Meta fornece um número de teste.
1.  No menu lateral: **WhatsApp** > **Começar (API Setup)**.
2.  Você verá um **Token de acesso temporário** (válido por 24h).
3.  Você verá o **Phone Number ID** (Identificação do número de telefone).
4.  **Teste de envio:** Cadastre seu celular pessoal na lista de "Para" e tente enviar uma mensagem modelo.

### Passo 4: Adicionar Número Real (Produção)
1.  Vá até o final da página e clique em **Adicionar telefone**.
2.  Siga o assistente para verificar seu número real via SMS/Ligação.
3.  **Atenção:** Se o número já tem WhatsApp, você precisará apagar a conta no app do celular antes de verificar aqui.

### Passo 5: Gerar Token Permanente
O token da tela inicial expira em 24h. Para produção:
1.  Vá em **Configurações do Negócio (Business Manager)** > **Usuários** > **Usuários do Sistema**.
2.  Crie um usuário do sistema (ex: "Noro API Bot") com função de **Admin**.
3.  Clique em **Gerar Novo Token**.
4.  Selecione o app criado.
5.  Marque as permissões: `whatsapp_business_messaging` e `whatsapp_business_management`.
6.  Copie o token gerado. **Este é o seu Access Token Permanente**.

### Passo 6: Configurar Webhook (Para receber mensagens)
1.  No Meta Developers, menu **WhatsApp** > **Configuração**.
2.  Clique em **Editar** no campo Webhook.
3.  **URL de retorno:** `https://seu-dominio.com/api/webhooks/whatsapp`
4.  **Token de verificação:** Crie uma senha (ex: `noro_secret_123`) e configure a mesma no painel do NORO.
5.  Após validar, clique em **Gerenciar campos de Webhook** e inscreva-se no evento: `messages`.

---

## Resumo dos Dados Necessários

### Para o Telegram:
*   `Bot Token`

### Para o WhatsApp:
*   `Access Token` (Permanente)
*   `Phone Number ID` (ID do número, não o número em si)
*   `Verify Token` (Senha do webhook)
