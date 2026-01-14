# Arquitetura de E-mail Marketing com Créditos e AWS SES

Este documento detalha a implementação técnica do módulo de E-mail Marketing integrado ao Amazon SES (Simple Email Service) e ao sistema de créditos pré-pagos.

## 1. Visão Geral

O sistema funcionará no modelo pré-pago:
1.  O Tenant compra créditos (R$).
2.  O saldo é armazenado na `noro_ai_wallets` (que passará a ser a carteira central do sistema).
3.  Cada e-mail enviado desconta um valor fixo (ex: R$ 0,005) desse saldo.

## 2. Infraestrutura (Amazon AWS SES)

Para enviar e-mails com alta entregabilidade e baixo custo, utilizaremos o Amazon SES.

### Requisitos:
*   **Domínio Verificado:** O seu domínio (ex: `noro.guru`) deve ser verificado no AWS SES.
*   **Identidades:** Para que os tenants possam enviar e-mails "em nome deles" (ex: `contato@tenant.com`), eles precisariam verificar o domínio deles.
    *   *Alternativa Simples (Recomendada Inicialmente):* Todos os e-mails saem de um remetente genérico verificado (ex: `noreply@noro.guru`) mas com o `Reply-To` configurado para o e-mail do tenant.
*   **Acesso de Produção:** A conta AWS deve sair do modo "Sandbox" para poder enviar e-mails para qualquer destinatário.

## 3. Banco de Dados e Créditos

Utilizaremos a estrutura existente de carteira (`noro_ai_wallets`) para gerenciar o saldo financeiro.

### Fluxo de Pagamento (Envio):
1.  **Cálculo de Custo:**
    ```typescript
    const COST_PER_EMAIL_CENTS = 1; // R$ 0,01 por e-mail (exemplo)
    const totalCost = listSize * COST_PER_EMAIL_CENTS;
    ```
2.  **Verificação de Saldo:**
    Antes do envio, verificamos se `balance_cents >= totalCost`.
3.  **Envio (AWS SDK):**
    Utilizamos a biblioteca `@aws-sdk/client-ses` para disparar os e-mails.
4.  **Dedução:**
    Inserimos uma transação negativa em `noro_ai_transactions` com `type: 'email_usage'`. O saldo atualiza automaticamente via Trigger.

## 4. Implementação Técnica

### A. Dependências
```bash
npm install @aws-sdk/client-ses
```

### B. Variáveis de Ambiente (.env.local)
```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="secret..."
EMAIL_SENDER_DEFAULT="noreply@noro.guru"
```

### C. Estrutura da API (`app/api/marketing/email/send/route.ts`)
Esta rota será responsável por:
1.  Autenticar o usuário.
2.  Validar inputs.
3.  Checar saldo.
4.  Enviar e-mails (em lotes, respeitando limites do SES).
5.  Registrar transação financeiro.
6.  Atualizar status da campanha.

## 5. Interface do Usuário (Frontend)

A página `/marketing/email` terá:
1.  **Card de Saldo:** Mostrando quanto dinheiro o cliente tem. Botão "Recarregar" (que leva ao checkout).
2.  **Listas de Contatos:** Upload de CSV e gestão de contatos.
3.  **Campanhas:** Criador de e-mail (Editor Rico ou HTML) e botão de disparo.

---

## Próximos Passos Imediatos:
1.  Configurar credenciais AWS no `.env`.
2.  Criar a UI de "Listas" e "Campanhas".
3.  Implementar a rota de API de envio.
