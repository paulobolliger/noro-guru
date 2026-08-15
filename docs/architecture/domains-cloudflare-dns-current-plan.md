# Domains And Cloudflare DNS Current Plan

Data de referencia: 2026-08-14 (revisado a partir do export real da zona Cloudflare + decisões do operador; substitui a versão de 2026-05-27)

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

Export real da zona, 2026-08-14:

| Nome | Tipo | Conteudo | Proxy | Status real |
| --- | --- | --- | --- | --- |
| `api.noro.guru` | A | `45.32.169.173` | ON | Aponta pra VPS; ainda não confirmado se servido via Coolify. Uso especulativo/futuro, não priorizar. |
| `visa-api.noro.guru` | A | `45.32.169.173` | ON | Idem. Uso futuro: expor dados do produto irmão `vistos.guru` de forma raw. Especulativo. |
| `noro.guru`, `www.noro.guru` | A | `76.76.21.21` (Vercel) | OFF | **Live.** `apps/soon-landing`, projeto Vercel `noro-guru-soon-landing`. |
| `soon.noro.guru` | CNAME | Vercel (hash próprio) | OFF | **Live.** Mesmo projeto do acima. |
| `admin.noro.guru` | CNAME | Vercel + TXT `_vercel` de verificação | ON | **Orfão.** Nenhum projeto Vercel ativo tem esse domínio anexado hoje. Nome depreciado (é `control.noro.guru`) — remover na Fase 6 do roadmap, não antes. |
| `app.noro.guru` | CNAME | Vercel + TXT `_vercel` de verificação | ON | **Orfão hoje** (sem projeto Vercel ativo), mas nome correto e definitivo pra `apps/core` — repontar pro Coolify quando a Fase 6 chegar lá, não remover. |
| `sites.noro.guru`, `*.sites.noro.guru` | CNAME | Vercel + TXT `_vercel` de verificação | ON | **Orfão hoje**, mas nome correto — landing de conversão + sites grátis (`apps/sites`), repontar na Fase 6. |
| `cdn.noro.guru` | CNAME | `public.r2.dev` (Cloudflare R2) | ON | Achado não documentado antes. Não referenciado por esse hostname em nenhum arquivo de código — provavelmente consumido via `S3_ENDPOINT`/`S3_BUCKET` (R2 é S3-compatible). Confirmar. |
| MX | MX | `mx1/mx2.titan.email` | — | Caixa postal `@noro.guru` (Titan). Só recebimento, não envia nada do app. |
| DKIM/DMARC | TXT/CNAME | Titan + Brevo | — | Brevo é o provedor de envio oficial (transacional/marketing). |

Leitura prática:

- `noro.guru`, `www.noro.guru`, `soon.noro.guru` são os únicos domínios com projeto Vercel realmente ativo hoje.
- `admin.`, `app.`, `sites.`/`*.sites.` têm DNS configurado (CNAME + verificação Vercel) mas **sem projeto Vercel dono** — ficaram órfãos de uma implantação anterior. `admin.` deve ser removido (nome depreciado); os outros devem ser repontados pro Coolify quando os apps correspondentes estiverem prontos (Fase 6 do roadmap de transição).
- `vistos.noro.guru` nao existe no DNS atual e nao deve ser assumido — o produto de vistos tem domínio próprio, `vistos.guru`.
- Ver `coolify/noro-guru-transition-roadmap.md` (fora deste repo, em `000 norotec admin/coolify/`) pro roadmap completo de migração desses domínios.

## 2. Decisoes Atuais

| Tema | Decisao |
| --- | --- |
| Zona principal | `noro.guru` |
| Marketing | `noro.guru` (`apps/web`) |
| Produto logado (gestão do tenant) | `app.noro.guru` (`apps/core`) |
| Operacao interna | `control.noro.guru` (`apps/control`) |
| Sites gerados — nível gratuito | `sites.noro.guru`, `*.sites.noro.guru` (`apps/sites`) — só o front do site gerado, sem CRM/portal atrás |
| Vitrine + portal do cliente final — nível pago | `xyz.agencia.noro.guru` ou domínio próprio (`xyz.com.br`), com `/portal` pro cliente final (`apps/portal`) |
| API tecnica | `api.noro.guru` — especulativo/futuro, sem compromisso |
| Dados do produto irmão de vistos | `visa-api.noro.guru` — especulativo/futuro, sem compromisso |
| Auth | Keycloak (realm `noro`), não Logto |
| Banco | Postgres central da VPS/Coolify (`noro_guru_db`), não Supabase nem Neon |
| Email | Brevo (envio), Titan (só recebimento/MX) |

## 3. Mapa Oficial De Dominios

### Principais

| Dominio | Papel | Status |
| --- | --- | --- |
| `noro.guru` | Site principal de marketing (`apps/web`) | Principal — hoje ocupado por `apps/soon-landing` |
| `app.noro.guru` | Produto de gestão para clientes/agencias (`apps/core`) | Principal |
| `control.noro.guru` | Operacao interna/Control Plane (`apps/control`) | Principal |
| `sites.noro.guru`, `*.sites.noro.guru` | Sites gerados grátis — nível free, só front (`apps/sites`) | Principal |
| `xyz.agencia.noro.guru` / domínio próprio pago | Vitrine + portal do cliente final — nível pago (`apps/portal`) | Principal |

### Especulativo/Futuro (sem compromisso de evoluir)

| Dominio | Papel | Status |
| --- | --- | --- |
| `api.noro.guru` | APIs tecnicas gerais da plataforma | Registrado na Cloudflare; aponta para VPS; especulativo |
| `visa-api.noro.guru` | Expor dados do produto irmão `vistos.guru` de forma raw | Registrado na Cloudflare; aponta para VPS; especulativo |
| `n8n.noro.guru` | Automacoes n8n | Futuro |
| `webhook.noro.guru` | Gateway dedicado de webhooks | Futuro/opcional |
| `docs.noro.guru` | Documentacao publica | Futuro/opcional |
| `status.noro.guru` | Status page publica | Futuro/opcional |
| `auth.noro.guru` | Não se aplica — Keycloak já tem hostname próprio (`keycloak.norotec.cloud`), não precisa de subdomínio dedicado em `noro.guru` |
| `cdn.noro.guru` | **Já existe e está em uso** (achado no export real de 2026-08-14): CNAME pra Cloudflare R2 (`public.r2.dev`). Não é mais "futuro/opcional". |

### Banco e Auth — nao sao mais dominios em avaliacao, sao decisoes fechadas

`supabase.noro.guru`, Neon e Logto nao devem mais ser tratados como destino/provedor valido pra nada novo. O banco e Postgres central da VPS/Coolify (`noro_guru_db`); o auth e Keycloak (realm `noro`). Qualquer codigo ou doc que ainda referencie Supabase, Neon ou Logto como direcao ativa esta desatualizado — ver `coolify/noro-guru-transition-roadmap.md` (fora deste repo) pras fases de migracao dessas pontas soltas.

## 4. Legado E Compatibilidade

Hosts depreciados encontrados no projeto (não usar, mesmo que apareçam em docs antigos ou em DNS órfão):

| Host depreciado | Destino correto |
| --- | --- |
| `admin.noro.guru` | `control.noro.guru` |
| `core.noro.guru` | `app.noro.guru` |
| `portal.noro.guru` | Não existe — portal do cliente final é `xyz.agencia.noro.guru/portal` ou `xyz.com.br/portal` |

`visa-api.noro.guru` não é legado — é nome válido, só que de escopo especulativo/futuro (ver seção 3).

Diretriz pro corte de DNS (Fase 6 do roadmap de transição):

1. `admin.noro.guru` pode ser removido do Cloudflare direto — nunca teve conteúdo real, é DNS órfão de uma implantação Vercel antiga.
2. `app.`, `sites.`/`*.sites.` — hoje também órfãos (sem projeto Vercel ativo), mas repontar pro Coolify quando os apps correspondentes estiverem prontos, não remover.
3. Monitorar acessos/erros depois de qualquer corte.
4. Aplicar redirecionamentos 301 quando fizer sentido.

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

### Sites Multi-Tenant

Se tenants tiverem subdominio em `sites.noro.guru`:

| Tipo | Nome | Target | Proxy Cloudflare |
| --- | --- | --- | --- |
| CNAME | `*.sites` | `0550dbbc18a4d073.vercel-dns-017.com` | ON |

## 6. Modelo De URL Por Tenant (revisado 2026-08-14)

Dois níveis de oferta, dois apps diferentes:

### Nível gratuito — `apps/sites`

| Tipo | URL |
| --- | --- |
| Site gerado, só o front | `{tenant}.sites.noro.guru` |

Sem CRM, sem portal, sem backend por trás — é o gancho de aquisição/conversão. Landing de `sites.noro.guru` oferece isso pras agências.

### Nível pago — `apps/portal`

| Tipo | URL |
| --- | --- |
| Vitrine pública da agência | `{tenant}.agencia.noro.guru` ou domínio próprio (`www.agencia.com.br`) |
| Portal B2C do cliente final | mesmo domínio da vitrine, path `/portal` (hoje ainda `/cliente` no código — troca de nome pendente) |

Mesmo app (`apps/portal`) resolve tenant por subdomínio/domínio customizado no middleware, e serve tanto a vitrine pública quanto o portal autenticado no mesmo host — sem cross-domain, sem custo extra de certificado.

### Area Logada Da Agencia (backoffice)

| Tipo | URL |
| --- | --- |
| Host único | `app.noro.guru` |

Regra:

- tenant do app logado deve ser resolvido por sessao/membership, nunca por parâmetro de URL isolado;
- não usar path `/t/{tenant}` nem qualquer outro identificador de tenant na URL como autoridade de segurança.

## 7. API, Webhooks E OAuth

`api.noro.guru` é reservado pra endpoints técnicos futuros, mas é **especulativo** — não tratar como gateway obrigatório enquanto não houver decisão explícita de construir isso.

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

### Depreciadas

```env
ADMIN_URL=https://admin.noro.guru
CORE_URL=https://core.noro.guru
SUPABASE_BASE_URL=https://supabase.noro.guru
NEON_DATABASE_URL / DEV_STAGING_DATABASE_URL
LOGTO_*
```

`CONTROL_URL=https://control.noro.guru` é a variável correta (control plane). Essas outras nao devem orientar implementacoes novas.

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

Status real atual (export Cloudflare de 2026-08-14):

- `noro.guru`, `www.noro.guru`, `soon.noro.guru` — publicados via Vercel, projeto `noro-guru-soon-landing`, live.
- `app.noro.guru`, `admin.noro.guru`, `sites.noro.guru`, `*.sites.noro.guru` — DNS ainda aponta pra Vercel (CNAME + verificação), mas sem projeto ativo dono. `admin.` é nome depreciado; os outros são nomes corretos aguardando repontar pro Coolify (ver roadmap de transição).
- `api.noro.guru`, `visa-api.noro.guru` — A record pra VPS `45.32.169.173`; uso especulativo/futuro, não confirmado se servido via Coolify.
- `cdn.noro.guru` — CNAME pra Cloudflare R2, em uso (achado novo, não documentado antes de 2026-08-14).
- `vistos.noro.guru` nao existe e nao deve ser assumido.

## 11. Relacao Com Outros Documentos

| Documento | Uso |
| --- | --- |
| `docs/architecture/current-state.md` | Estado atual consolidado. |
| `docs/architecture/multi-tenant-current-model.md` | Modelo multi-tenant e resolucao de tenant. |
| `docs/architecture/data-auth-transition.md` | Transicao de auth/dados para Keycloak/PostgreSQL/Drizzle (a atualizar — ainda cita Logto). |
| `docs/architecture/billing-asaas-migration-plan.md` | Webhooks e billing Asaas. |
| `docs/backlog/communication/omnichannel.md` | Webhooks de comunicacao futura. |
| `docs/backlog/social-integrations/oauth-social-networks-future-reference.md` | Callbacks OAuth de redes sociais. |
| `coolify/noro-guru-transition-roadmap.md` (fora deste repo, em `000 norotec admin/coolify/`) | Roadmap completo de migração de domínios, banco, auth e billing pro Coolify. |

## 12. Proxima Revisao

Revisar este documento quando:

- `app.`, `control.`, `sites.` forem repontados pro Coolify (Fase 6 do roadmap de transição);
- `admin.noro.guru` for removido do Cloudflare;
- `api.noro.guru`/`visa-api.noro.guru` tiverem decisão explícita de evoluir (ou serem descartados de vez);
- Keycloak estiver guardando rotas protegidas de verdade nos apps;
- Supabase e Neon deixarem de existir como dependência no código.
