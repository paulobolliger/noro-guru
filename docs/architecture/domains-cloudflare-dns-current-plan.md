# Domains And Cloudflare DNS Current Plan

Data de referencia: 2026-05-27

Projeto: NORO

Zona DNS principal: `noro.guru`

Documento anterior: `docs/plano-dominios-cloudflare.md`

## 1. Objetivo

Documentar a estrategia vigente de dominios e DNS da NORO.

Este documento concentra:

- naming padrao por contexto;
- dominios oficiais;
- hosts legados e aliases temporarios;
- modelo de URL por tenant;
- registros DNS esperados no Cloudflare;
- impacto em callbacks OAuth e webhooks;
- variaveis de ambiente relacionadas.

## 1.1 Estado Real Na Cloudflare

Snapshot informado em 2026-05-27:

| Nome | Tipo | Conteudo | Proxy | TTL |
| --- | --- | --- | --- | --- |
| `api.noro.guru` | A | `45.32.169.173` | ON | Auto |
| `visa-api.noro.guru` | A | `45.32.169.173` | ON | Auto |
| `admin.noro.guru` | CNAME | `dd3a3dd843160a6f.vercel-dns-017.com` | ON | Auto |
| `app.noro.guru` | CNAME | `2324271dbae975ae.vercel-dns-017.com` | ON | Auto |
| `noro.guru` | CNAME | `fbd334549e0d9ad0.vercel-dns-017.com` | ON | Auto |
| `www.noro.guru` | CNAME | `fbd334549e0d9ad0.vercel-dns-017.com` | ON | Auto |
| `sites.noro.guru` | CNAME | `0550dbbc18a4d073.vercel-dns-017.com` | ON | Auto |
| `*.sites.noro.guru` | CNAME | `0550dbbc18a4d073.vercel-dns-017.com` | ON | Auto |

Leitura pratica:

- `api.noro.guru` e `visa-api.noro.guru` ja existem e apontam para a VPS `45.32.169.173`.
- `admin.noro.guru`, `app.noro.guru`, `noro.guru`, `www.noro.guru`, `sites.noro.guru` e `*.sites.noro.guru` apontam para Vercel.
- `vistos.noro.guru` nao existe no DNS atual.

## 2. Decisoes Atuais

| Tema | Decisao |
| --- | --- |
| Zona principal | `noro.guru` |
| Marketing | `noro.guru` |
| Produto logado | `app.noro.guru` |
| Operacao interna | `admin.noro.guru` |
| Sites gerados | `sites.noro.guru` |
| API tecnica | `api.noro.guru` |
| Landing/documentacao da API de vistos | `visa-api.noro.guru` registrado; uso final ainda em avaliacao |
| Webhooks dedicados | `webhook.noro.guru` como opcao futura |
| Supabase | Legado/transicional, nao destino arquitetural principal |

## 3. Mapa Oficial De Dominios

### Principais

| Dominio | Papel | Status |
| --- | --- | --- |
| `noro.guru` | Site principal de marketing | Principal |
| `app.noro.guru` | Produto para clientes/agencias | Principal |
| `admin.noro.guru` | Operacao interna/Control Plane | Principal |
| `sites.noro.guru` | Sites gerados e oferta de sites IA | Principal |

### Plataforma E Expansao

| Dominio | Papel | Status |
| --- | --- | --- |
| `api.noro.guru` | APIs tecnicas, API de vistos, callbacks OAuth e webhooks enquanto nao houver gateway dedicado | Registrado na Cloudflare; aponta para VPS |
| `visa-api.noro.guru` | Possivel landing/documentacao publica da API de vistos | Registrado na Cloudflare; aponta para VPS; uso final em avaliacao |
| `n8n.noro.guru` | Automacoes n8n | Futuro |
| `webhook.noro.guru` | Gateway dedicado de webhooks | Futuro/opcional |
| `docs.noro.guru` | Documentacao publica | Futuro/opcional |
| `status.noro.guru` | Status page publica | Futuro/opcional |
| `auth.noro.guru` | Host dedicado de auth/SSO, se aprovado | Futuro/opcional |
| `cdn.noro.guru` | Assets estaticos e midia | Futuro/opcional |

### Supabase

`supabase.noro.guru` nao deve mais ser tratado como destino obrigatorio de backend/banco.

Uso permitido:

- legado/transicao, se algum fluxo antigo ainda depender;
- diagnostico controlado;
- alias temporario enquanto a migracao para PostgreSQL/Drizzle/Logto nao terminar.

Nao usar como base para novas decisoes arquiteturais.

## 4. Legado E Compatibilidade

Hosts antigos encontrados no projeto:

- `control.noro.guru`;
- `core.noro.guru`;
- `visa-api.noro.guru`.

Mapeamento de transicao:

| Host legado | Destino alvo |
| --- | --- |
| `control.noro.guru` | `admin.noro.guru` |
| `core.noro.guru` | `app.noro.guru` |
| `visa-api.noro.guru` | Manter em avaliacao como landing/documentacao comercial; endpoints tecnicos devem ficar em `api.noro.guru` |

Diretriz:

1. Manter alias temporario durante a transicao.
2. Monitorar acessos e erros.
3. Aplicar redirecionamentos 301 quando seguro.
4. Remover legado somente apos janela de observacao.

## 5. Matriz DNS Cloudflare

Registros atuais na Cloudflare conforme snapshot de 2026-05-27.

### Essenciais

| Tipo | Nome | Target | Proxy Cloudflare |
| --- | --- | --- | --- |
| CNAME | `@` | `fbd334549e0d9ad0.vercel-dns-017.com` | ON |
| CNAME | `www` | `fbd334549e0d9ad0.vercel-dns-017.com` | ON |
| CNAME | `app` | `2324271dbae975ae.vercel-dns-017.com` | ON |
| CNAME | `admin` | `dd3a3dd843160a6f.vercel-dns-017.com` | ON |
| CNAME | `sites` | `0550dbbc18a4d073.vercel-dns-017.com` | ON |

### Expansao

| Tipo | Nome | Target | Proxy Cloudflare |
| --- | --- | --- | --- |
| A | `api` | `45.32.169.173` | ON |
| A | `visa-api` | `45.32.169.173` | ON |
| CNAME | `n8n` | `TARGET_N8N` | ON ou OFF conforme integracao |
| CNAME | `webhook` | `TARGET_WEBHOOK` | ON |
| CNAME | `docs` | `TARGET_DOCS` | ON |
| CNAME | `status` | `TARGET_STATUS` | ON |

### Legados Temporarios

| Tipo | Nome | Target | Proxy Cloudflare |
| --- | --- | --- | --- |
| CNAME | `control` | `TARGET_ADMIN` | ON |
| CNAME | `core` | `TARGET_APP` | ON |
| A | `visa-api` | `45.32.169.173` | ON |

### Sites Multi-Tenant

Se tenants tiverem subdominio em `sites.noro.guru`:

| Tipo | Nome | Target | Proxy Cloudflare |
| --- | --- | --- | --- |
| CNAME | `*.sites` | `0550dbbc18a4d073.vercel-dns-017.com` | ON |

## 6. Modelo De URL Por Tenant

### Site Publico Da Agencia

| Tipo | URL |
| --- | --- |
| Plano gratis | `{tenant}.sites.noro.guru` |
| Dominio proprio | dominio do cliente, por exemplo `www.agencia.com.br` |

Dominios proprios devem apontar para a infraestrutura de sites, normalmente por CNAME conforme provedor.

### Area Logada Da Agencia

| Tipo | URL |
| --- | --- |
| Host principal | `app.noro.guru` |
| Rota contextual opcional | `app.noro.guru/t/{tenant}` |

Regra:

- tenant do app logado deve ser resolvido por sessao/membership;
- `tenant` na URL e conveniencia de navegacao, nao autoridade de seguranca.

### Separacao Recomendada

| Contexto | Local |
| --- | --- |
| Site publico | `{tenant}.sites.noro.guru` ou dominio proprio |
| Backoffice | `app.noro.guru/t/{tenant}` |
| Preview/editor de site | App logado |
| Pagina publica gerada | Dominio publico do site |

## 7. API, Webhooks E OAuth

Enquanto nao houver gateway dedicado, usar `api.noro.guru` para endpoints tecnicos.

Padroes futuros:

```txt
https://api.noro.guru/oauth/callback/{provider}
https://api.noro.guru/webhooks/{domain}/{provider}
```

Exemplos:

```txt
https://api.noro.guru/oauth/callback/meta
https://api.noro.guru/webhooks/communication/whatsapp
https://api.noro.guru/webhooks/billing/asaas
```

Se `webhook.noro.guru` for aprovado:

```txt
https://webhook.noro.guru/communication/whatsapp
https://webhook.noro.guru/billing/asaas
```

## 8. Variaveis De Ambiente

### Atuais/Alvo

```env
DOMAIN_ROOT=noro.guru
APP_URL=https://app.noro.guru
ADMIN_URL=https://admin.noro.guru
SITES_URL=https://sites.noro.guru
API_URL=https://api.noro.guru
VISA_API_LANDING_URL=https://visa-api.noro.guru
```

### Futuras/Opcionais

```env
WEBHOOK_URL=https://webhook.noro.guru
DOCS_URL=https://docs.noro.guru
STATUS_URL=https://status.noro.guru
AUTH_URL=https://auth.noro.guru
CDN_URL=https://cdn.noro.guru
N8N_URL=https://n8n.noro.guru
```

### Legadas/Transicionais

```env
CONTROL_URL=https://control.noro.guru
CORE_URL=https://core.noro.guru
VISA_API_URL=https://visa-api.noro.guru
SUPABASE_BASE_URL=https://supabase.noro.guru
```

Essas variaveis nao devem orientar implementacoes novas.

## 9. Checklist De Rollout

1. Criar registros DNS principais no Cloudflare.
2. Apontar hosts legados para aliases temporarios.
3. Validar SSL/TLS.
4. Atualizar variaveis de ambiente por app.
5. Atualizar callbacks OAuth.
6. Atualizar webhooks externos.
7. Atualizar links publicos em site, emails, docs e footers.
8. Monitorar 404/5xx, falhas de login e callbacks.
9. Aplicar redirecionamentos 301.
10. Remover legado somente apos janela de observacao.

## 10. Status De Implantacao

Status real atual:

- `noro.guru`, `www.noro.guru`, `app.noro.guru`, `admin.noro.guru`, `sites.noro.guru` e `*.sites.noro.guru` estao publicados via CNAME para Vercel;
- `api.noro.guru` esta publicado como A record para a VPS `45.32.169.173`;
- `visa-api.noro.guru` esta publicado como A record para a VPS `45.32.169.173`;
- `vistos.noro.guru` nao existe no DNS atual;
- o DNS existe, mas ainda e necessario validar build, envs, rotas e servicos antes de tratar `api`/`visa-api` como produtos estaveis.

## 11. Relacao Com Outros Documentos

| Documento | Uso |
| --- | --- |
| `docs/architecture/current-state.md` | Estado atual consolidado. |
| `docs/architecture/multi-tenant-current-model.md` | Modelo multi-tenant e resolucao de tenant. |
| `docs/architecture/data-auth-transition.md` | Transicao de auth/dados para Logto/PostgreSQL/Drizzle. |
| `docs/architecture/billing-asaas-migration-plan.md` | Webhooks e billing Asaas. |
| `docs/backlog/communication/omnichannel.md` | Webhooks de comunicacao futura. |
| `docs/backlog/social-integrations/oauth-social-networks-future-reference.md` | Callbacks OAuth de redes sociais. |

## 12. Proxima Revisao

Revisar este documento quando:

- DNS principal for publicado;
- variaveis de ambiente forem aplicadas por app;
- `api.noro.guru` for estabilizado;
- `visa-api.noro.guru` for aprovado como landing/documentacao ou descartado;
- hosts legados forem redirecionados;
- Supabase deixar de existir como dependencia transicional.
