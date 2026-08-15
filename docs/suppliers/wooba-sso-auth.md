# 🔐 Wooba Travellink API — SSO (Estudo de Referência de Autenticação)

> 🚨 **DOCUMENTO DE REFERÊNCIA TÉCNICA INTERNA (NORO GURU MASTER)**
> **PREMISSA DE PRODUTO INVIOLÁVEL**: Nenhum tenant (agência ou cliente final) tem ou terá acesso/conhecimento deste fornecedor. Este documento é mantido **estritamente como referência de arquitetura OAuth2/OIDC para estudo interno da nossa equipe de engenharia do Noro Guru**.

---

## 📌 1. Visão Geral
*   **Nome da API**: Travellink API – SSO
*   **Protocolo**: OpenID Connect (OIDC) / OAuth 2.0 (`authorization_code` flow)
*   **URL da Documentação Postman Oficial**: [Postman Collection - Travellink SSO API](https://documenter.getpostman.com/view/24548172/2s9XxvTEhD)

---

## 💡 2. Benefícios Estratégicos para o Noro Guru

1. **Login com 1-Clique ("Entrar com Wooba")**:
   Agentes e agências de viagens que possuem conta na Wooba podem se autenticar no Noro Guru usando o mesmo usuário e senha do portal Wooba.
2. **Onboarding Instantâneo de Tenants**:
   Ao realizar o login via SSO, a Wooba devolve um token JWT (`id_token`) contendo todos os dados cadastrais da agência (CNPJ, Razão Social, Nome Fantasia, Logotipo, Endereço e Código do ERP/Backoffice). O Noro Guru usa essas informações para **cadastrar e configurar o Tenant da agência em segundos**.

---

## 🔄 3. Fluxo de Autenticação OAuth2 / OIDC

```mermaid
sequenceDiagram
    autonumber
    actor Agente as Agente de Viagem
    participant Noro as Frontend / Logto Noro Guru
    participant WoobaAuth as Wooba SSO Authorize (/auth/authorize)
    participant NoroBackend as Noro Guru Backend (/api/auth/callback/wooba)
    participant WoobaToken as Wooba Token Endpoint (/auth/authorize/token)

    Agente->>Noro: 1. Clica em "Entrar com Wooba"
    Noro->>WoobaAuth: 2. Redireciona para URL de Autorização (client_id, scope=openid, redirect_uri)
    WoobaAuth->>Agente: 3. Exibe tela de Login da Wooba
    Agente->>WoobaAuth: 4. Autentica com sucesso
    WoobaAuth->>NoroBackend: 5. Redireciona para REDIRECT_URI com o parâmetro ?code={CODE}
    NoroBackend->>WoobaToken: 6. Requisição POST para obter o id_token (grant_type=authorization_code)
    WoobaToken-->>NoroBackend: 7. Retorna id_token (JWT com dados do usuário e agência)
    NoroBackend->>NoroBackend: 8. Cadastra/Autentica o Tenant & Agente no Noro Guru
    NoroBackend-->>Agente: Login Concluído! Acesso Liberado no Noro Guru 🎉
```

---

## 🛠️ 4. Endpoints e Requisições

### A. URL de Redirecionamento (Passo 1):
`GET https://wooba-sandbox.travellink.com.br/Agencias30/auth/authorize?client_id={CLIENT_ID}&response_type=code&scope=openid&redirect_uri={REDIRECT_URI}`

### B. Obtenção do `id_token` (Passo 3):
`POST https://wooba-sandbox.travellink.com.br/Agencias30/auth/authorize/token`

**Headers:**
*   `Authorization`: `Basic Base64({CLIENT_ID}:{CLIENT_SECRET})`
*   `Content-Type`: `application/json` ou `application/x-www-form-urlencoded`

**Payload JSON:**
```json
{
  "grant_type": "authorization_code",
  "client_id": "{{client_id}}",
  "client_secret": "{{client_secret}}",
  "code": "{{code}}",
  "redirect_uri": "{{redirect_uri}}"
}
```

---

## 🔑 5. Estrutura do JWT (`id_token` Claims)

A Wooba devolve os seguintes dados protegidos dentro do token JWT:

### User Claims:
*   `sub`: ID único do usuário na Wooba.
*   `email`: E-mail do usuário.
*   `name`: Nome completo.
*   `role`: Perfil de acesso (Interno/Externo).
*   `phone_number`: Telefone de contato.

### Agency Claims (Dados da Agência / Tenant):
*   `agencyid`: ID da Agência na Wooba.
*   `agencydocument`: CNPJ da Agência.
*   `agencybackofficecode`: Código no ERP/Backoffice (`IdERP`).
*   `ragencyname`: Razão Social.
*   `agencybusinessname`: Nome Fantasia.
*   `agencylogoUrl`: URL da Logomarca da Agência (para aplicar White-Label no Noro Guru).
*   `agencyaddress1`, `agencyneighborhood`, `agencycity`, `agencystate`, `agencyzipCode`, `agencycountry`.
