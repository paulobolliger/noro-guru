# Referencia Futura De Integracoes Sociais OAuth

Status: backlog operacional para execucao futura.

Data de referencia: 2026-05-27

Documento de origem: `docs/guia-integracao-redes-sociais.md`

## Decisao Atual

Este guia nao deve ser usado ainda como instrucao ativa de producao.

Ele fica preservado como referencia futura para conectar contas sociais de tenants via OAuth.

Antes de executar, a NORO precisa fechar:

- app/API responsavel pelos callbacks OAuth;
- dominio oficial dos callbacks;
- storage seguro de tokens;
- modelo de permissao por tenant;
- separacao entre comunicacao, publicacao social e marketing;
- revisao de escopos exigidos por cada plataforma.

## Dominio Oficial De Referencia

Fonte oficial de dominios:

`docs/architecture/domains-cloudflare-dns-current-plan.md`

Para desenho futuro, usar preferencialmente callbacks sob:

```txt
https://api.noro.guru/oauth/callback/{provider}
```

Exemplos:

```txt
https://api.noro.guru/oauth/callback/meta
https://api.noro.guru/oauth/callback/linkedin
https://api.noro.guru/oauth/callback/tiktok
https://api.noro.guru/oauth/callback/pinterest
https://api.noro.guru/oauth/callback/google
```

Nao usar mais exemplo generico:

```txt
https://seu-dominio.com/api/auth/callback/facebook
```

## Modelo De Arquitetura Futuro

Fluxo esperado:

```txt
Tenant solicita conexao
  -> NORO redireciona para provider OAuth
  -> Provider retorna para api.noro.guru/oauth/callback/{provider}
  -> NORO troca code por token
  -> token e metadata sao salvos de forma segura por tenant
  -> app exibe status conectado
```

## Providers E Escopos

### Meta: Facebook E Instagram

Uso futuro:

- conectar paginas;
- ler dados basicos;
- publicar conteudo, se aprovado;
- gerenciar Instagram associado.

Escopos citados no documento antigo:

- `instagram_basic`
- `instagram_content_publish`
- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_posts`

Pendencias:

- [ ] Confirmar se todos os escopos ainda sao necessarios.
- [ ] Validar processo de app review da Meta.
- [ ] Preparar video demonstrando uso das permissoes.
- [ ] Definir se sera publicacao social, inbox ou ambos.

### LinkedIn

Uso futuro:

- login/conexao;
- publicacao em perfil ou pagina, se aprovado.

Produtos citados:

- Sign In with LinkedIn using OpenID Connect;
- Share on LinkedIn.

Pendencias:

- [ ] Confirmar escopos atuais.
- [ ] Definir se publicacao sera suportada no MVP futuro.

### TikTok

Uso futuro:

- upload/publicacao de videos.

Escopos citados:

- `video.upload`
- `user.info.basic`

Pendencias:

- [ ] Confirmar categoria do app.
- [ ] Validar aprovacao para marketing/publicacao.

### Pinterest

Uso futuro:

- leitura/criacao de boards;
- criacao de pins.

Escopos citados:

- `boards:read`
- `boards:write`
- `pins:write`

### YouTube / Google Cloud

Uso futuro:

- upload de videos;
- leitura basica de canal.

Escopos citados:

- `.../auth/youtube.upload`
- `.../auth/youtube.readonly`

Pendencias:

- [ ] Validar exigencia de verificacao Google.
- [ ] Confirmar se CASA sera necessario.
- [ ] Definir limites para modo teste.

## Modelo De Dados Futuro

Nomes abaixo sao proposta de dominio, nao schema final.

### `social_integrations`

- `id`
- `tenant_id`
- `provider`
- `external_account_id`
- `display_name`
- `status`
- `scopes`
- `token_encrypted`
- `refresh_token_encrypted`
- `expires_at`
- `created_at`
- `updated_at`

### `social_oauth_events`

- `id`
- `tenant_id`
- `provider`
- `event_type`
- `payload`
- `processed`
- `created_at`

## Seguranca

Requisitos minimos:

- usar `state` assinado no OAuth;
- validar redirect URI exata;
- criptografar tokens;
- permitir revogacao por tenant;
- auditar conexoes e desconexoes;
- separar permissao de conectar conta da permissao de publicar;
- nao salvar segredo de client no frontend.

## Proximo Passo

Manter como backlog ate a camada de API/callbacks estar definida e implantada.

Relacionados:

- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/backlog/communication/omnichannel.md`
- `docs/architecture/current-state.md`
