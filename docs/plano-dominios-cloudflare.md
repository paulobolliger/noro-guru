# Plano Consolidado de Dominios e DNS (Cloudflare)

Data de referencia: 24/05/2026
Projeto: Noro Guru
Zona DNS principal: noro.guru

## 1. Objetivo

Documentar a estrategia oficial de dominios e subdominios do ecossistema Noro Guru, com foco em:
- naming padrao por contexto (marketing, produto, operacao, APIs)
- configuracao de DNS no Cloudflare
- compatibilidade com hosts legados
- guia de rollout sem quebra

## 2. Mapa Oficial de Dominios

### 2.1 Dominios principais (ativos/alvo)

| Dominio | Papel | Observacao |
|---|---|---|
| noro.guru | Site principal de marketing | Pagina institucional |
| app.noro.guru | Produto para clientes/agencias | Portal principal de uso |
| admin.noro.guru | Operacao interna | Painel administrativo interno |
| sites.noro.guru | Landing para oferta de sites gratuitos com IA | Entrada comercial dedicada |

### 2.2 Dominios de plataforma e expansao

| Dominio | Papel | Status |
|---|---|---|
| supabase.noro.guru | Backend/Banco (migracao para self-host) | Planejado |
| n8n.noro.guru | Automacoes n8n | Futuro |
| api.noro.guru | Endpoint tecnico de APIs externas | Planejado |
| vistos.noro.guru | Pagina comercial/documentacao da API de vistos | Planejado |

### 2.3 Complementares recomendados

| Dominio | Papel | Prioridade |
|---|---|---|
| docs.noro.guru | Documentacao publica de produto e APIs | Media |
| status.noro.guru | Status page publica | Media |
| auth.noro.guru | Servico de autenticacao centralizado/SSO | Baixa |
| webhook.noro.guru | Gateway de webhooks/integracoes | Baixa |
| cdn.noro.guru | Assets estaticos e midia | Baixa |

## 3. Legado e Compatibilidade

Hosts antigos encontrados no projeto:
- control.noro.guru
- core.noro.guru
- visa-api.noro.guru

Diretriz:
- manter alias temporario para hosts legados durante a transicao
- redirecionar gradualmente para os novos hosts oficiais
- remover legado apenas apos validacao completa de logs, SEO e links externos

Mapeamento sugerido de legado:
- control.noro.guru -> admin.noro.guru
- core.noro.guru -> app.noro.guru
- visa-api.noro.guru -> api.noro.guru (tecnico) ou vistos.noro.guru (comercial)

## 4. Matriz de DNS para Cloudflare

Observacao: preencher o TARGET conforme o provedor de hospedagem de cada app (Vercel/Fly/VM/Nginx/etc).

### 4.1 Registros essenciais

| Tipo | Nome | Target | Proxy Cloudflare |
|---|---|---|---|
| A ou CNAME | @ | TARGET_MARKETING | ON |
| CNAME | app | TARGET_APP | ON |
| CNAME | admin | TARGET_ADMIN | ON |
| CNAME | sites | TARGET_SITES | ON |

### 4.2 Registros de expansao

| Tipo | Nome | Target | Proxy Cloudflare |
|---|---|---|---|
| CNAME | api | TARGET_API | ON |
| CNAME | vistos | TARGET_VISTOS | ON |
| CNAME | n8n | TARGET_N8N | ON (ou OFF se necessario por integracao) |
| CNAME | supabase | TARGET_SUPABASE | ON (avaliar arquitetura self-host) |

### 4.3 Registros legados (temporarios)

| Tipo | Nome | Target | Proxy Cloudflare |
|---|---|---|---|
| CNAME | control | TARGET_ADMIN | ON |
| CNAME | core | TARGET_APP | ON |
| CNAME | visa-api | TARGET_API | ON |

### 4.4 Multi-tenant para sites de clientes

Se cada cliente tiver subdominio dentro de sites.noro.guru:

| Tipo | Nome | Target | Proxy Cloudflare |
|---|---|---|---|
| CNAME | *.sites | TARGET_SITES | ON |

## 5. Modelo de URL por Tenant (Consolidado)

Modelo aprovado para agencias (exemplo: tenant xyz):

### 5.1 Site publico da agencia

- Plano gratis: xyz.sites.noro.guru
- Dominio proprio (pago): xyz.com.br (ou www.xyz.com.br)

Observacao:
- dominio proprio deve apontar para a infraestrutura do modulo de sites (normalmente por CNAME, conforme provedor).

### 5.2 Area logada da agencia (SaaS)

- Host unico: app.noro.guru
- Tenant resolvido por sessao/login + tenant_id
- Opcional para URL contextual: app.noro.guru/t/xyz/...

Observacao:
- preferir o prefixo /t/xyz no app para reduzir risco de conflito com rotas globais.

### 5.3 Separacao recomendada

- Site publico: xyz.sites.noro.guru ou xyz.com.br
- Backoffice da agencia: app.noro.guru/t/xyz/...
- Preview/editor de site pode existir no app, mas a pagina publica deve permanecer no dominio publico.

## 6. Convencao de Naming

Padrao definido:
- marketing: noro.guru
- produto: app.noro.guru
- operacao interna: admin.noro.guru
- API tecnica: api.noro.guru
- pagina comercial da API de vistos: vistos.noro.guru
- oferta de sites IA: sites.noro.guru

Regra geral:
- usar nomes curtos e sem ambiguidade
- separar host tecnico (api) de host comercial (vistos)
- evitar nomes genericos como core/control no longo prazo

## 7. Checklist de Rollout

1. Criar registros DNS principais no Cloudflare.
2. Apontar hosts legados para aliases temporarios.
3. Validar SSL/TLS em todos os hosts.
4. Atualizar variaveis de ambiente do monorepo.
5. Atualizar callbacks OAuth e webhooks que dependam de dominio.
6. Atualizar links publicos (site, footer, emails, docs).
7. Monitorar erros 404/5xx e falhas de login apos virada.
8. Aplicar redirecionamentos 301 de legado para oficial.
9. Remover legado somente apos janela de observacao.

## 8. Variaveis de Ambiente (referencia)

Raiz/geral:
- DOMAIN_ROOT=noro.guru
- CONTROL_URL (substituir para admin quando migrar)
- N8N_URL (quando ativar)

Sugestao de padronizacao futura:
- APP_URL=https://app.noro.guru
- ADMIN_URL=https://admin.noro.guru
- SITES_URL=https://sites.noro.guru
- API_URL=https://api.noro.guru
- VISTOS_URL=https://vistos.noro.guru
- SUPABASE_BASE_URL=https://supabase.noro.guru

## 9. Decisoes Registradas (24/05/2026)

Decisao 1:
- Estrutura oficial aprovada: noro + app + admin + sites.

Decisao 2:
- supabase.noro.guru reservado para migracao de banco/backend.

Decisao 3:
- n8n.noro.guru mantido como futuro.

Decisao 4:
- API separada em dois contextos:
  - api.noro.guru (tecnico)
  - vistos.noro.guru (comercial)

Decisao 5:
- hosts legados continuam temporariamente para evitar quebra.

Decisao 6:
- tenant site publico em subdominio/dominio proprio e app logado em host unico com contexto por tenant.

Decisao 7:
- projetos opcionais 5 e 6 (api.noro.guru e vistos.noro.guru) foram criados na Vercel, mas com muitos erros no setup/deploy.
- status atual: implantacao pausada ate concluir diagnostico e estabilizacao.

### 9.1 Status de Implantacao (24/05/2026)

- Projetos base (1-4): seguem como referencia principal da fase atual.
- Projetos opcionais (5-6): criados e interrompidos por falhas; nao avancar DNS definitivo antes de corrigir build, envs e rotas.

## 10. Proxima Revisao

Quando revisar este documento:
- apos publicar os primeiros DNS no Cloudflare
- apos atualizar variaveis de ambiente de control/core/web
- apos definir arquitetura final de supabase self-host
