# DESIGN-API.md — Especificação Completa do Visa & API

> Apps: `visa.noro.guru` + `api.noro.guru` · Owner: Plataforma (Developer Portal + Visa API)
> Tema: Dark (neutral_dark + text_dark_theme) — estilo "developer-first"
> Referência de tokens, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> **Público:** Desenvolvedores, agências técnicas, parceiros de integração, clientes da Visa API.

---

## ÍNDICE

1. [Arquitetura dos Apps](#1-arquitetura-dos-apps)
2. [Componentes Globais do Shell](#2-componentes-globais-do-shell)
3. [visa.noro.guru — Landing & Produto](#3-visanoroguru--landing--produto)
4. [api.noro.guru — Developer Portal](#4-apinoroguru--developer-portal)
5. [Documentação Técnica](#5-documentação-técnica)
6. [Referência de API](#6-referência-de-api)
7. [Autenticação & API Keys](#7-autenticação--api-keys)
8. [Changelogs & Status Técnico](#8-changelogs--status-técnico)

---

## 1. Arquitetura dos Apps

### 1.1 Dois Domínios, Um Produto

**`visa.noro.guru`** — Site de produto e marketing da Visa API
- Landing page, funcionalidades, preços, casos de uso, documentação introdutória
- Público: decisores, agências de turismo, agências de vistos
- Estilo: marketing com apelo técnico

**`api.noro.guru`** — Developer Portal completo
- Documentação técnica, referência de endpoints, autenticação, SDKs, playground
- Público: desenvolvedores que integram a API
- Estilo: devtools — monaco editor, syntax highlight, copy buttons

### 1.2 Relação entre os Apps

```
visa.noro.guru → apresenta o produto → CTA "Ver documentação" → api.noro.guru
visa.noro.guru → "Começar grátis" → api.noro.guru/cadastro
api.noro.guru → portal completo → acesso a playground, keys, logs
```

### 1.3 Autenticação do Developer Portal

- Usuários criam conta em `api.noro.guru/cadastro` (formulário próprio)
- Conta separada do Core (tenant pode ter acesso via integração)
- JWT + API Keys para autenticar requisições
- Dashboard de API Keys, logs e quotas disponível após login

---

## 2. Componentes Globais do Shell

### 2.1 Header — visa.noro.guru

**Tema:** Dark. Background `noro_dark`.

**Elementos:**
- Logo Noro Guru + badge "Visa API" (cor `noro_accent`)
- Navegação:
  - Funcionalidades → `/funcionalidades`
  - Preços → `/pricing`
  - Documentação → `api.noro.guru/docs`
  - FAQ → `/faq`
  - Changelog → `/changelog`
- CTA área:
  - "Ver Docs" → `api.noro.guru` (link secundário)
  - Botão "Começar grátis" → `api.noro.guru/cadastro`

**Mobile:** hamburger + drawer

---

### 2.2 Header — api.noro.guru (Developer Portal)

**Tema:** Dark. Background `noro_dark_purple`, borda sutil.

**Elementos:**
- Logo Noro Guru + badge "Developers"
- Navegação:
  - Docs → `/docs`
  - Referência → `/reference`
  - Playground → `/playground`
  - SDKs → `/sdks`
  - Changelog → `/changelog`
  - Status → `/status`
- CTA área (não autenticado): "Entrar" + "Criar Conta"
- CTA área (autenticado): badge de plano + "Meu Painel" → `/dashboard`

**Funcionalidades especiais:**
- Barra de busca inline nos docs (`Ctrl+K`) — busca semântica na documentação
- Seletor de versão da API (dropdown: v1 / v2-beta)

---

### 2.3 Sidebar de Documentação (api.noro.guru)

**Posição:** Lateral esquerda fixa (280px) nas páginas de docs e referência.

**Estrutura:**
```
Primeiros Passos
  - Introdução
  - Quickstart
  - Autenticação
  - Erros & Códigos
  - Versionamento

Guias
  - Consulta de Vistos
  - Webhooks
  - Pagination
  - Rate Limits
  - Ambientes (sandbox/prod)

Referência
  - Vistos
  - Países
  - Requisitos
  - Webhooks
  - Quotas

SDKs & Ferramentas
  - SDK Node.js
  - SDK Python
  - Postman Collection
  - OpenAPI Spec

Suporte
  - FAQ
  - Status
  - Contato
```

**Comportamento:**
- Item ativo com highlight (borda esquerda `noro_accent`)
- Seções colapsáveis
- Scroll independente da área de conteúdo
- Mobile: drawer hamburguer

---

### 2.4 Footer — visa.noro.guru

**Colunas:**
- Produto: Funcionalidades, Preços, FAQ, Changelog
- Developers: Docs, Referência, Playground, SDKs, Status
- Empresa: Sobre, Blog Noro, Contato
- Legal: Termos, Privacidade, SLA

**Rodapé:** "© 2026 Noro Guru. Visa API é um produto da plataforma Noro."

---

### 2.5 Footer — api.noro.guru

**Minimalista** — foco em developer experience:
- Links essenciais: Termos de API, Privacidade, Status, GitHub (se OSS), Contato
- "Powered by Noro Guru"

---

## 3. visa.noro.guru — Landing & Produto

### 3.1 `/` — Home (visa.noro.guru)

**Objetivo:** Converter agências e desenvolvedores a experimentar a Visa API.

**Seções:**

**Hero:**
- Background: dark com gradiente + efeito de grid técnico
- Badge: "API de Vistos — Dados em tempo real"
- Título H1: "Consulte requisitos de visto em segundos."
- Subtítulo: "API REST para agências, plataformas de turismo e integradores. 150+ países. Atualização contínua."
- CTA primário: "Começar grátis" → `api.noro.guru/cadastro`
- CTA secundário: "Ver documentação" → `api.noro.guru/docs`
- Exemplo de código inline (snippet de request/response em JSON com syntax highlight)

**Seção: Números**
- 150+ países cobertos
- 99.9% de uptime
- < 200ms de resposta média
- X mil consultas/mês processadas

**Seção: Funcionalidades Principais**
- Cards 3 colunas:
  - Checklist de Requisitos: passaporte, visto, documentos por país de origem/destino
  - Dados em Tempo Real: atualizações de políticas e requisitos
  - Webhooks: notificações quando requisitos mudam
  - Multi-idioma: resposta em PT-BR, EN, ES
  - Sandbox: ambiente de teste sem custo
  - SLA Garantido: resposta de suporte em X horas

**Seção: Como funciona**
- 3 passos: 1. Crie sua conta → 2. Obtenha sua API Key → 3. Faça sua primeira consulta
- Snippet de código por passo (tabs: cURL / Node.js / Python)

**Seção: Casos de Uso**
- Grid de cards: Agências de Turismo, Plataformas de OTA, Apps de Viagem, ERPs do setor
- Por card: ícone, título, descrição de como a API resolve o problema

**Seção: Preços**
- Preview dos planos com CTA "Ver todos os planos" → `/pricing`

**Seção: Depoimentos / Clientes**
- Logos de empresas que usam a API + depoimentos

**CTA Final:**
- "Comece com 1.000 consultas grátis" → `api.noro.guru/cadastro`

---

### 3.2 `/funcionalidades`

**Objetivo:** Detalhar todas as capacidades técnicas da Visa API.

**Elementos:**

**Hero:**
- Título: "Tudo que você precisa para visto, em uma API"

**Seções por funcionalidade:**

**Consulta de Requisitos:**
- Endpoint: `GET /v1/visa/requirements`
- Parâmetros: `origin_country`, `destination_country`, `passport_type`, `travel_purpose`
- Retorna: lista de documentos, validade do visto, taxas, tempo de processamento, link oficial
- Exemplo de response em JSON (syntax highlight)

**Cobertura de Países:**
- Mapa interativo ou lista de 150+ países com status de cobertura
- Indicador de qualidade de dados por país (Alta / Média / Em manutenção)

**Webhooks de Atualização:**
- Subscrição para eventos `visa_requirements_updated` por rota (origem → destino)
- Payload de exemplo

**Histórico de Requisitos:**
- Endpoint para consultar requisitos em uma data passada
- Útil para validação de dados históricos

**Sandbox:**
- Ambiente separado com dados de teste
- API Key de sandbox (sem custo, sem rate limit real)
- Países de teste predefinidos com cenários de erro simulados

**Rate Limits & Quotas:**
- Tabela por plano: requests/minuto, requests/dia, requests/mês
- Headers de resposta com quota atual

---

### 3.3 `/pricing` (visa.noro.guru)

**Objetivo:** Preços e planos da Visa API.

**Elementos:**

**Toggle:** Mensal / Anual (com desconto)

**Grid de planos:**
- **Free:** 1.000 consultas/mês, sandbox, docs, suporte por email
- **Starter:** 10.000 consultas/mês, webhooks, histórico 30 dias, suporte prioritário
- **Professional:** 100.000 consultas/mês, histórico 1 ano, SLA 99.9%, suporte Slack
- **Enterprise:** consultas customizadas, SLA 99.99%, suporte dedicado, contrato

**Tabela comparativa detalhada:**
- Consultas, Webhooks, Histórico, Rate limit, Ambientes, Suporte, SLA

**FAQ de Preços:**
- O que conta como uma "consulta"?
- As consultas do sandbox são cobradas?
- Como funciona o billing por uso?

**CTA:** "Começar no plano Free" → `api.noro.guru/cadastro`

---

### 3.4 `/faq`

**Objetivo:** Perguntas frequentes sobre a Visa API para prospects e clientes.

**Elementos:**
- Accordion com 15-25 perguntas organizadas por categoria:
  - **Sobre a API:** O que é, como funciona, de onde vêm os dados, com que frequência são atualizados
  - **Técnico:** Autenticação, rate limits, erros, latência, disponibilidade
  - **Cobertura:** Quais países, o que não está coberto, como solicitar novos países
  - **Billing:** Como é calculado, como cancelar, upgrade/downgrade
  - **Suporte:** Canais disponíveis, SLA de resposta

---

### 3.5 `/changelog` (visa.noro.guru)

**Objetivo:** Registro de mudanças na Visa API e cobertura de países.

**Elementos:**
- Timeline de entradas:
  - Data + versão da API
  - Tipo: Nova Cobertura / Breaking Change / Melhoria / Correção de Dados / Deprecation
  - Descrição: o que mudou, países afetados, ação necessária pelos integradores
- Filtros: por tipo, por versão, por país afetado
- RSS feed + link para assinar por email

---

## 4. api.noro.guru — Developer Portal

### 4.1 `/` — Home (api.noro.guru)

**Objetivo:** Receber desenvolvedores e direcioná-los para os recursos certos.

**Elementos:**
- Hero mínimo: "Bem-vindo ao Noro Developer Portal"
- 4 cards de acesso rápido:
  - "Quickstart em 5 minutos" → `/quickstart`
  - "Referência completa de endpoints" → `/reference`
  - "Playground interativo" → `/playground`
  - "Meu dashboard e API keys" → `/dashboard`
- Seção: novidades (últimas 3 entradas do changelog)
- Seção: recursos populares (links para guias mais acessados)

---

### 4.2 `/cadastro` (api.noro.guru)

**Objetivo:** Criar conta no developer portal para obter API Key.

**Elementos:**
- Shell mínimo: logo + sem navbar completa
- Formulário:
  - Nome completo
  - Email
  - Senha (força visual)
  - Nome da empresa / projeto
  - Tipo de uso (select: Agência de Turismo, Plataforma de OTA, App Mobile, Integração Interna, Outro)
  - Termos de uso checkbox
  - Botão "Criar conta"
- Link: "Já tem conta? Entrar" → `/login`
- OAuth: "Entrar com Google" (opcional)

**Após cadastro:**
- Email de confirmação
- Redirect para `/dashboard` com mensagem de boas-vindas
- API Key de sandbox gerada automaticamente

---

### 4.3 `/login` (api.noro.guru)

**Elementos:**
- Formulário: email + senha
- Link "Esqueci minha senha" → `/redefinir-senha`
- OAuth Google (opcional)
- Link "Criar conta" → `/cadastro`

---

### 4.4 `/dashboard`

**Objetivo:** Painel do desenvolvedor — visão geral do uso, API Keys e configurações.

**Elementos:**

**KPIs do mês:**
- Consultas realizadas / Quota do plano (barra de progresso)
- Consultas restantes no mês
- Custo estimado (se plano pay-per-use)
- Status da conta (ativa / trial / suspensa)

**Gráfico de uso:**
- Consultas por dia (últimos 30 dias)
- Breakdown por endpoint (se mais de um)

**API Keys:**
- Tabela: nome, prefixo (ex: `noro_***abc`), ambiente (prod/sandbox), criada em, último uso
- Botão "Criar nova API Key"
- Ações por key: copiar, revogar, renomear

**Webhooks configurados:**
- Lista: URL, eventos, status (ativo/inativo)
- Botão "Novo webhook"

**Plano atual:**
- Nome do plano, quota, data de renovação
- Botão "Fazer upgrade" → `/pricing`

**Conexões:**
- API Keys → `/dashboard/keys/[id]`
- Webhooks → `/dashboard/webhooks/[id]`
- Upgrade → `visa.noro.guru/pricing`

---

### 4.5 `/dashboard/keys/[id]`

**Objetivo:** Detalhe e gestão de uma API Key específica.

**Elementos:**
- Header: nome da key + ambiente badge + status
- Card: prefixo da key (chave completa apenas no momento de criação, nunca exibida depois)
- Card: permissões (escopos habilitados para esta key)
- Card: restrições (IPs permitidos, domínios de referrer)
- Histórico de uso: gráfico de chamadas por dia + últimas 20 requisições (timestamp, endpoint, status HTTP, latência)
- Botões: Revogar, Regenerar, Renomear

---

### 4.6 `/dashboard/webhooks`

**Objetivo:** Gestão de webhooks do developer.

**Elementos:**
- Lista de webhooks configurados
- Por webhook: URL, eventos inscritos, status, último disparo
- Botão "Novo Webhook" → modal com URL + seleção de eventos
- Ação por linha: ver logs, editar, testar, deletar

---

### 4.7 `/dashboard/webhooks/[id]`

**Objetivo:** Detalhe e logs de um webhook.

**Elementos:**
- Header: URL + status
- Card: configuração (URL, secret mascarado, eventos)
- Tabela de entregas: data, evento, status HTTP, latência, corpo da resposta (truncado)
- Botão "Reenviar falhas"
- Botão "Testar" (envia payload de teste)

---

## 5. Documentação Técnica

### 5.1 `/docs` — Hub de Documentação

**Objetivo:** Página inicial da documentação com overview e links para guias.

**Elementos:**
- Layout: sidebar de navegação (§2.3) + área de conteúdo (largura máx. 760px) + TOC direita
- Hero: "Documentação da Noro Visa API"
- Cards de início rápido: Quickstart, Autenticação, Seu primeiro request
- Grid de guias populares
- "Última atualização:" + data

---

### 5.2 `/quickstart`

**Objetivo:** Guia de 5 minutos para fazer a primeira consulta de visto.

**Elementos:**
- Layout docs padrão
- Steps numerados com código:
  1. Criar conta e obter API Key
  2. Fazer primeira requisição (cURL + Node.js + Python)
  3. Interpretar a resposta (anotações no JSON)
  4. Tratar erros comuns
  5. Próximos passos

**Componente de código:**
- Tabs por linguagem: cURL / JavaScript / Python / PHP
- Botão "Copiar" em todos os blocos de código
- Syntax highlighting (tema dark Monokai ou similar)
- Linha de execução: "Execute e veja a resposta →" com resultado inline se playground disponível

---

### 5.3 `/docs/autenticacao`

**Elementos:**
- Como obter uma API Key (link para dashboard)
- Header de autenticação: `Authorization: Bearer {api_key}`
- Escopos disponíveis
- Boas práticas de segurança (não commitar keys, usar variáveis de ambiente)
- Rotação de keys

---

### 5.4 `/docs/erros`

**Elementos:**
- Tabela de códigos de erro HTTP + código Noro + descrição + ação recomendada
- Exemplo de response de erro (JSON)
- Tratamento de rate limit (429 + `Retry-After` header)

---

### 5.5 `/docs/webhooks`

**Elementos:**
- O que são webhooks
- Como configurar (link para `/dashboard/webhooks`)
- Eventos disponíveis (tabela: nome, descrição, payload de exemplo)
- Verificação de assinatura (HMAC SHA-256)
- Retry policy (quantas tentativas, backoff)
- Exemplo de handler em Node.js e Python

---

### 5.6 `/docs/rate-limits`

**Elementos:**
- Limites por plano (tabela)
- Headers de resposta com quota (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- Como lidar com 429
- Estratégias de cache no client

---

### 5.7 `/docs/ambientes`

**Elementos:**
- Sandbox: URL base `https://sandbox.api.noro.guru/v1`, dados fictícios, sem custo
- Produção: URL base `https://api.noro.guru/v1`
- API Keys são separadas por ambiente
- Países de teste no sandbox (lista de slugs pré-configurados)

---

## 6. Referência de API

### 6.1 `/reference`

**Objetivo:** Referência completa e interativa de todos os endpoints.

**Elementos:**
- Layout especial: 3 colunas
  - **Esquerda (240px):** sidebar de navegação por recurso
  - **Centro (560px):** descrição do endpoint, parâmetros, responses
  - **Direita (380px):** playground / request builder + response ao vivo

**Por endpoint:**
- Método HTTP + path (badge colorido: GET verde, POST azul, DELETE vermelho)
- Descrição
- **Path Parameters** (tabela: nome, tipo, obrigatório, descrição)
- **Query Parameters** (tabela)
- **Request Body** (JSON Schema + exemplo editável)
- **Responses** (tabs por status: 200, 400, 401, 404, 429, 500 — cada com schema + exemplo)
- Botão "Testar no playground" — preenche o painel direito

---

### 6.2 `/reference/visa`

**Endpoints do recurso Visa:**

**`GET /v1/visa/requirements`**
- Consulta requisitos de visto por origem e destino
- Parâmetros: `origin_country` (ISO 3166-1 alpha-2), `destination_country`, `passport_type` (ordinary/official/diplomatic), `travel_purpose` (tourism/business/transit/study/work)
- Response: objeto com campos: `visa_required` (bool), `visa_type` (free/on_arrival/evisa/embassy), `validity_days`, `stay_limit_days`, `documents_required` (array), `processing_time`, `fee` (BRL), `fee_usd`, `official_url`, `updated_at`

**`GET /v1/visa/requirements/history`**
- Consulta histórica de requisitos em uma data
- Parâmetros adicionais: `date` (ISO 8601)

**`GET /v1/visa/countries`**
- Lista todos os países disponíveis com status de cobertura

---

### 6.3 `/reference/countries`

**Endpoints do recurso Countries:**

**`GET /v1/countries`**
- Lista todos os países com código ISO, nome PT-BR, nome EN, continente, flag emoji
- Parâmetros: `continent` (filter), `coverage` (full/partial/none)

**`GET /v1/countries/{code}`**
- Detalhes de um país específico
- Response: dados completos + status de cobertura de dados de visto

---

### 6.4 `/reference/webhooks`

**Endpoints de gestão de webhooks via API:**

**`POST /v1/webhooks`** — criar webhook
**`GET /v1/webhooks`** — listar webhooks
**`GET /v1/webhooks/{id}`** — detalhe
**`PATCH /v1/webhooks/{id}`** — atualizar
**`DELETE /v1/webhooks/{id}`** — deletar
**`POST /v1/webhooks/{id}/test`** — enviar payload de teste

---

### 6.5 `/reference/quotas`

**Endpoints de quota e uso:**

**`GET /v1/quota`** — quota atual da API Key
- Response: `plan`, `requests_limit`, `requests_used`, `requests_remaining`, `resets_at`

---

## 7. Autenticação & API Keys

### 7.1 `/playground`

**Objetivo:** Ambiente interativo para testar endpoints sem código.

**Elementos:**
- Layout 2 colunas:
  - **Esquerda:** request builder
    - Select de endpoint (dropdown navegável)
    - Select de ambiente (sandbox / produção)
    - API Key: usa key salva no dashboard ou campo manual
    - Parâmetros: formulário gerado dinamicamente pelo schema do endpoint
    - Botão "Enviar requisição"
  - **Direita:** response viewer
    - Status badge (200 / 400 / etc.)
    - Tempo de resposta em ms
    - Response JSON com syntax highlight e collapsible nodes
    - Headers de resposta (aba)
    - Botão "Copiar como cURL"
    - Botão "Abrir no Postman"

**Estados:**
- Não autenticado: aviso "Faça login para usar o playground com sua API Key"
- Loading: spinner no botão + placeholder no response
- Erro de rede: mensagem de erro clara

---

### 7.2 `/sdks`

**Objetivo:** SDKs oficiais e ferramentas de integração.

**Elementos:**

**SDKs por linguagem (cards):**
- **JavaScript / TypeScript:** `npm install @noro/visa-api` · [GitHub] · [npm]
- **Python:** `pip install noro-visa-api` · [GitHub] · [PyPI]
- Cada card: logo da linguagem, nome, versão atual, instalação, link para docs do SDK, stars GitHub

**Ferramentas:**
- Postman Collection: botão "Baixar" + "Importar para Postman"
- OpenAPI Spec (JSON/YAML): botão de download

**Exemplo de uso (SDK):**
- Tabs: JS / Python
- Snippet de código com o mesmo exemplo do quickstart usando o SDK

---

## 8. Changelogs & Status Técnico

### 8.1 `/changelog` (api.noro.guru)

**Objetivo:** Changelog técnico da API — versões, mudanças de contrato, depreciações.

**Elementos:**
- Timeline de versões:
  - Por entrada: versão badge (ex: `v1.4.2`), data, tipo (Feature / Breaking / Fix / Deprecation / Security)
  - Descrição técnica: o que mudou, endpoint afetado, migration guide se breaking
  - Código de antes/depois em breaking changes
- Filtros: por tipo, por versão major
- Banner de aviso em versões depreciadas: "Esta versão será descontinuada em [data]. Migre para v2."

---

### 8.2 `/versioning`

**Objetivo:** Política de versionamento da API.

**Elementos:**
- Estratégia de versionamento: URL versioning (`/v1/`, `/v2/`)
- Ciclo de vida de versões: active → deprecated → sunset
- Política de breaking changes: aviso mínimo de 6 meses
- Tabela de versões ativas com datas de suporte e sunset
- Como fazer o header de versão `Api-Version` para versões experimentais

---

### 8.3 `/status` (api.noro.guru)

**Objetivo:** Status em tempo real da Visa API especificamente.

**Elementos:**
- Status atual: "API Operacional" / "Degradação Parcial" / "Outage"
- Serviços monitorados: API Gateway, Database de Vistos, Webhooks, Sandbox
- Por serviço: uptime 90 dias (barra calendário), latência atual
- Incidentes recentes: data, título, status (investigando / monitorando / resolvido)
- Assinar atualizações: email ou RSS

---

*Documento gerado em: 2026-05-24 · Versão: 1.0 · Apps: visa.noro.guru + api.noro.guru*
