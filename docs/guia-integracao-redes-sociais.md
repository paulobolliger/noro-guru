# Guia de Integração de Redes Sociais (OAuth) - Noro Guru

Este guia detalha o processo de configuração dos aplicativos nas plataformas de desenvolvedor para permitir que seus tenants (clientes) conectem suas contas de redes sociais ao Noro Guru.

## Visão Geral da Arquitetura

O sistema utiliza o protocolo **OAuth 2.0** para autenticação segura. A arquitetura funciona da seguinte forma:

1.  **Um Único App Central:** Você (Admin do Noro Guru) cria um único aplicativo em cada plataforma (Meta, LinkedIn, TikTok, Pinterest).
2.  **Múltiplos Tenants:** Todos os seus clientes se conectam através desse mesmo aplicativo.
3.  **Tokens Isolados:** Quando um cliente conecta, recebemos um `access_token` único para ele, que é salvo no banco de dados vinculado ao seu `tenant_id`.

---

## 1. Meta (Facebook & Instagram)

Para conectar Instagram e Facebook, você precisa de um App na Meta.

1.  Acesse [developers.facebook.com](https://developers.facebook.com/).
2.  Crie um novo aplicativo do tipo **"Empresa"** (Business).
3.  Em "Adicionar produtos ao seu app", selecione **"Login do Facebook"**.
4.  **Configurações do Login do Facebook:**
    *   Adicione a URL de redirecionamento (Callback URL) do seu sistema (ex: `https://seu-dominio.com/api/auth/callback/facebook`).
5.  **Permissões Necessárias:**
    *   Para Instagram: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
    *   Para Facebook: `pages_manage_posts`, `pages_read_engagement`.
6.  **Verificação do App:**
    *   Sera exigido um vídeo mostrando como o Noro Guru utiliza essas permissões.

## 2. LinkedIn

1.  Acesse [linkedin.com/developers](https://www.linkedin.com/developers/).
2.  Crie um novo app.
3.  Na aba **"Products"**, solicite acesso a:
    *   **Sign In with LinkedIn using OpenID Connect** (para login).
    *   **Share on LinkedIn** (para publicar posts).
4.  Na aba **"Auth"**:
    *   Pegue o `Client ID` e `Client Secret`.
    *   Configure a "Authorized redirect URLs for your app".

## 3. TikTok

1.  Acesse [developers.tiktok.com](https://developers.tiktok.com/).
2.  Crie um app e escolha a categoria "Marketing".
3.  **Permissões (Scopes):**
    *   `video.upload` (para postar vídeos).
    *   `user.info.basic`.
4.  Configure a **Redirect URI**.

## 4. Pinterest

1.  Acesse [developers.pinterest.com](https://developers.pinterest.com/).
2.  Crie um novo aplicativo.
3.  **Scopes:** `boards:read`, `boards:write`, `pins:write`.
4.  Configure a **Redirect URI**.

## 5. YouTube (Google Cloud)

Para conectar o YouTube, usamos o **Google Cloud Console**.

1.  Acesse [console.cloud.google.com](https://console.cloud.google.com/).
2.  Crie um novo projeto.
3.  Ative a **YouTube Data API v3**.
4.  Em **APIs e Serviços > Tela de permissão OAuth**:
    *   Configure como "Externo".
    *   Adicione os escopos: `.../auth/youtube.upload`, `.../auth/youtube.readonly`.
5.  Em **Credenciais**:
    *   Crie um ID do cliente OAuth 2.0.
    *   Adicione a URI de redirecionamento autorizada.
6.  **Verificação:** O Google exige uma **verificação de segurança CASA** (Tier 2 ou 3) para apps que fazem upload de vídeos publicamente. Inicialmente, seu app ficará em modo de teste (limitado a 100 usuários manuais).

---

## Experiência do Tenant

Para o seu cliente, o processo é extremamente simples:
1.  No painel do Noro Guru, ele clica em **"Conectar Conta"**.
2.  Uma janela popup oficial da rede social se abre.
3.  Ele clica em **"Permitir"**.
4.  Sistema mostra **"Sincronizado"**.
