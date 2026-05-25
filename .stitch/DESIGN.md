---
product:
  name: "Noro Guru"
  tagline: "O sistema operacional da agência moderna."
  domain: "Ecossistema operacional completo para agências de turismo, vistos e operação omnichannel."

tokens:
  colors:
    brand:
      noro_primary: "#342CA4"
      noro_primary_deep: "#3B2CA4"
      noro_primary_dark: "#232452"
    accent:
      noro_accent: "#1DD3C0"
      noro_gold: "#D4AF37"
      noro_gold_hover: "#E5C04B"
    neutral_light:
      surface: "#FFFFFF"
      surface_2: "#F6F7FB"
      fg: "#1F2433"
      border: "#ECEEF3"
      border_strong: "#DFE2EA"
      muted: "rgba(31, 36, 51, 0.55)"
    neutral_dark:
      noro_dark: "#0B1220"
      noro_dark_purple: "#12152C"
      noro_surface_dark: "#2B2E48"
      noro_gray_future: "#2E2E3A"
      noro_light: "#F8F9FB"
      noro_gray_accent: "#E2E8F0"
    text_dark_theme:
      primary: "#FFFFFF"
      secondary: "#E0E3FF"
      muted: "#B8C1E0"
      body: "#D1D5F0"
    semantic:
      success: "#16A34A"
      warning: "#CA8A04"
      destructive: "#E11D48"
      info: "#2563EB"

  radius:
    sm: "0.375rem"
    md: "0.5rem"
    lg: "0.75rem"
    xl: "1rem"
    full: "9999px"
    base: "0.75rem"

  typography:
    sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"]
    display: ["var(--font-display)", "Manrope", "Plus Jakarta Sans", "sans-serif"]
    mono: ["var(--font-mono)", "JetBrains Mono", "monospace"]
---

# Noro Guru — Blueprint Executivo de Produto

---

## ÍNDICE

1. [North Star do Produto](#1-north-star-do-produto)
2. [Posicionamento Estratégico](#2-posicionamento-estratégico)
3. [Os 5 Pilares do Produto](#3-os-5-pilares-do-produto)
4. [Arquitetura do Ecossistema](#4-arquitetura-do-ecossistema) — inclui §4.4 Mapa Completo de Páginas por App
5. [Sistema de Design & Tokens Visuais](#5-sistema-de-design--tokens-visuais)
6. [Arquitetura Visual e UX](#6-arquitetura-visual-e-ux)
7. [Estrutura de Navegação e Sidebar](#7-estrutura-de-navegação-e-sidebar)
8. [Estratégia Responsiva Oficial](#8-estratégia-responsiva-oficial)
9. [Arquitetura de Informação & Layouts de Tela](#9-arquitetura-de-informação--layouts-de-tela)
10. [Estados Canônicos de Tela](#10-estados-canônicos-de-tela)
11. [Módulo Control — Governança da Plataforma](#11-módulo-control--governança-da-plataforma)
12. [Módulo Core — Operação do Tenant](#12-módulo-core--operação-do-tenant)
13. [Módulo Sites — Runtime Público](#13-módulo-sites--runtime-público)
14. [Módulo Billing — Execução por App](#14-módulo-billing--execução-por-app)
15. [Módulo Financeiro — Execução por App](#15-módulo-financeiro--execução-por-app)
16. [Módulo Visa API](#16-módulo-visa-api)
17. [Cross-App Governance](#17-cross-app-governance)
18. [Plano Mestre de Execução Integrada](#18-plano-mestre-de-execução-integrada)

---

## ESPECIFICAÇÕES POR APP (arquivos separados)

> Cada app tem um arquivo dedicado com especificação completa de cada página: shell global, componentes, elementos de UI, formulários, conexões entre telas e estados canônicos.

| App | Arquivo | URL | Tema |
| --- | --- | --- | --- |
| Web (site público) | [DESIGN-WEB.md](./DESIGN-WEB.md) | noro.guru | Dark |
| Core (painel do tenant) | [DESIGN-CORE.md](./DESIGN-CORE.md) | app.noro.guru | Light |
| Control (admin plataforma) | [DESIGN-CONTROL.md](./DESIGN-CONTROL.md) | admin.noro.guru | Dark |
| Sites (runtime público) | [DESIGN-SITES.md](./DESIGN-SITES.md) | sites.noro.guru | Tenant-defined |
| Visa & API (developer portal) | [DESIGN-API.md](./DESIGN-API.md) | visa.noro.guru + api.noro.guru | Dark |

---

## 1. North Star do Produto

> **O Noro Guru deve parecer menos um painel administrativo e mais um sistema operacional completo para agências modernas.**

A experiência deve transmitir:

- **Controle** — o operador sente que tudo está sob sua gestão
- **Inteligência** — o sistema antecipa, sugere e automatiza
- **Automação** — tarefas repetitivas somem do fluxo
- **Clareza** — nunca há dúvida sobre o que fazer a seguir
- **Robustez** — o sistema não falha em momento crítico
- **Fluidez operacional** — cada transição entre tarefas é natural

### Anti-padrão a evitar

O Noro Guru **não deve parecer**:
- Um CRM genérico com módulos extras
- Um ERP burocrático repleto de formulários
- Uma ferramenta de IA com painel de controle
- Um agregador de funcionalidades sem coesão

O Noro Guru **deve parecer**:
- O sistema nervoso central da agência
- Uma plataforma onde comercial, financeiro, atendimento, marketing e IA operam em sincronia
- Um ecossistema operacional — não um conjunto de ferramentas

---

## 2. Posicionamento Estratégico

### 2.1 A Promessa do Produto

```
"O sistema operacional da agência moderna."
```

Tudo o que a agência precisa para operar com eficiência, crescer com inteligência e atender com excelência — em um único ecossistema conectado.

### 2.2 O que o Noro NÃO é

| ❌ Não comunicar como | ✅ Comunicar como |
|---|---|
| "uma plataforma de IA" | "inteligência integrada à operação" |
| "um CRM" | "pipeline comercial completo" |
| "um ERP" | "motor operacional da agência" |
| "uma automação" | "fluidez que elimina tarefas manuais" |
| "um painel administrativo" | "sistema operacional da agência" |

### 2.3 Diretrizes de Comunicação para Homepage

A homepage **deve**:
- Explicar o produto em segundos, sem jargão técnico
- Reduzir a sensação de complexidade mostrando o ecossistema por pilares
- Apresentar arquitetura modular — o usuário adota no ritmo dele
- Transmitir robustez operacional e inteligência integrada
- Mostrar que os módulos se conectam, não que são independentes

A homepage **não deve**:
- Listar todos os módulos simultaneamente sem agrupamento semântico
- Usar linguagem de "ferramenta de produtividade" — a promessa é maior
- Apresentar IA como produto separado — ela é a camada de inteligência de tudo

> **Guideline obrigatória:** Nunca apresentar todos os módulos simultaneamente sem agrupamento semântico por pilar.

### 2.4 Funil Principal do Web

```
Home → Pricing → Lead/Wizard → Preview → App
```

---

## 3. Os 5 Pilares do Produto

O Noro Guru é organizado em 5 pilares funcionais. Cada pilar representa um domínio operacional da agência. A sidebar, a homepage e toda a comunicação de produto devem respeitar essa estrutura.

---

### Pilar 1 — CRM & Pipeline

**Descrição:** Controle completo de leads, clientes, orçamentos e vendas, do primeiro contato ao fechamento.

**Módulos:**
- Leads
- Clientes (Visão 360°)
- Orçamentos
- Pedidos
- Pipeline comercial (Kanban)
- Timeline 360

**Objetivo de comunicação:** Transmitir organização comercial e conversão previsível.

**Fluxo central:** Lead → Cliente → Orçamento → Pedido → Faturamento

---

### Pilar 2 — Financeiro & Billing

**Descrição:** Gestão financeira completa, cobrança automatizada, controle de inadimplência e fluxo de caixa.

**Módulos:**
- Financeiro (contas a pagar/receber, fluxo de caixa, resultados)
- Billing (faturas, cobranças, conciliação)
- Duplicatas (A Pagar / A Receber)
- Fechamento mensal
- Pagamentos e gateways (Cielo, Stripe, BTG Pactual)

**Objetivo de comunicação:** Transmitir previsibilidade financeira e controle operacional.

**Ações centrais:** `Emitir Cobrança` · `Registrar Pagamento` · `Importar NFSe` · `Alocação de Rateio`

---

### Pilar 3 — Atendimento Omnichannel

**Descrição:** Centralização de todo atendimento — WhatsApp, redes sociais, chat, chatbot e tickets — em uma única central unificada.

**Módulos:**
- WhatsApp
- Instagram e redes sociais
- Chat (conversas em tempo real)
- Filas de atendimento (Meus Atendimentos, Aguardando, Finalizados)
- Chatbot
- Tickets e suporte
- SLA por fila e agente

**Objetivo de comunicação:** Transmitir velocidade operacional e atendimento unificado.

---

### Pilar 4 — Sites & Marketing

**Descrição:** Criação de sites gratuitos, produção de conteúdo com IA, presença digital e distribuição omnichannel.

**Módulos:**
- Sites grátis para agências (publicação em subdomínio)
- Blog e artigos
- SEO
- Social (posts agendados)
- Marketing (campanhas)
- E-mail marketing
- Templates e publicação

**Objetivo de comunicação:** Transmitir crescimento e aquisição digital integrados à operação.

**Fluxo central:** Blueprint → Publicação → `[agencia-xyz].sites.noro.guru`

---

### Pilar 5 — IA Operacional

**Descrição:** Automação inteligente aplicada diretamente à operação da agência — não como produto separado, mas como camada de inteligência que atravessa todos os pilares.

**Módulos:**
- Geração de roteiros com IA
- IA de conteúdo (artigos, posts, e-mails)
- Automações de fluxo
- Assistentes contextuais
- Análise operacional
- Custos de IA por módulo

**Objetivo de comunicação:** Transmitir ganho real de produtividade e automação prática — não IA teórica.

**Guideline:** A IA não é apresentada como um módulo isolado. Ela aparece dentro de cada pilar como potência que multiplica o que o operador já faz.

---

## 4. Arquitetura do Ecossistema

O ecossistema Noro Guru opera em 6 subdominios com ownership distinto:

| App | Domínio | Owner | Escopo |
|---|---|---|---|
| **Web** | `noro.guru` | Marketing/Produto | Aquisição, conversão, institucional |
| **Core** | `app.noro.guru` | Tenant | Operação completa do tenant (CRM, ERP, Conteúdo, Custos) |
| **Control** | `admin.noro.guru` | Plataforma | Governança central, multi-tenant, planos, auditoria |
| **Sites** | `sites.noro.guru` | Runtime/Entrega | Renderização pública de sites por slug |
| **Visa** | `visa.noro.guru` | Marketing/API | Landing comercial da API de vistos |
| **API** | `api.noro.guru` | Plataforma/API | Consumo técnico, autenticação, docs |

### 4.1 Regra de Ownership (Inviolável)

- **Control** é o owner do billing da plataforma Noro Guru.
- **Core** é o owner do billing do tenant para seus clientes finais.
- **Nenhum app executa cobrança fora do seu domínio owner.**

### 4.2 Regra de Visão Espelho

Quando um app precisa exibir dados cujo owner é outro app:
- Exibir via drawer lateral ou painel de detalhe — nunca reconstruir CRUD completo
- Exibir selo explícito **"Visão espelho"** no header da área
- CTA de redirecionamento: **"Abrir no [app owner]"**
- Manter apenas leitura, filtros e navegação contextual no app secundário

### 4.3 Termos Nativos de Produto

| Termo | Definição |
|---|---|
| **Tenant / Organização** | Limite fundamental de isolamento. Selecionado via `TenantSelector`. |
| **Clientes (Visão 360°)** | Perfil consolidado: Dados Pessoais, Contatos, Endereços, Documentos, Histórico, Milhas, Preferências, Timeline |
| **Orçamentos & Pedidos** | Propostas dinâmicas integradas ao gerador IA via `"Gerar Roteiro AI"` |
| **Duplicatas** | Controle transacional A Pagar / A Receber |
| **Canais & Chatbot** | Central omnichannel unificando WhatsApp e redes sociais com filas |

### 4.4 Mapa Completo de Páginas por App

Esta seção é a fonte da verdade para todas as rotas planejadas do ecossistema. Cada rota listada é parte do roadmap oficial do produto.

---

#### 4.4.1 WEB — noro.guru

Objetivo: converter leads, vender plataforma, vender sites grátis, explicar produto e conduzir onboarding.

**Landing & Conversão**

| Rota | Descrição |
|---|---|
| `/` | Homepage principal — posicionamento + pilares + CTA |
| `/pricing` | Planos e preços |
| `/contact` | Formulário de contato |
| `/wizard` | Wizard de onboarding guiado |
| `/lead` | Captura de lead direto |
| `/demo` | Solicitação de demonstração |
| `/agencias` | Landing segmentada para agências |
| `/sites-gratis` | Oferta de sites gratuitos para agências |
| `/crm-turismo` | Landing SEO — CRM para turismo |
| `/erp-turismo` | Landing SEO — ERP para turismo |
| `/automacao-turismo` | Landing SEO — automação para turismo |
| `/ia-para-agencias` | Landing SEO — IA para agências |
| `/vistos` | Landing de vistos |
| `/partners` | Programa de parceiros e revendedores |
| `/affiliate` | Programa de indicação e comissão |

**Institucional**

| Rota | Descrição |
|---|---|
| `/sobre` | Sobre a empresa e o produto (unificado — evita duplicidade de SEO) |
| `/manifesto` | Manifesto do produto |
| `/case-studies` | Casos de sucesso |
| `/case-studies/[slug]` | Case individual detalhado |
| `/blog` | Blog |
| `/blog/[slug]` | Post individual do blog |
| `/changelog` | Histórico público de atualizações do produto |
| `/careers` | Vagas e cultura |
| `/press` | Imprensa e mídia |

**Confiança & Legal**

| Rota | Descrição |
|---|---|
| `/privacy-policy` | Política de privacidade |
| `/terms-of-service` | Termos de serviço |
| `/cookies` | Política de cookies |
| `/lgpd` | Conformidade LGPD |
| `/security` | Política de segurança |
| `/status` | Status dos serviços |
| `/sla` | Acordo de nível de serviço público |

**Ecossistema**

| Rota | Descrição |
|---|---|
| `/ecosystem` | Visão geral do ecossistema |
| `/ecosystem/core` | Página do app Core |
| `/ecosystem/control` | Página do app Control |
| `/ecosystem/sites` | Página do app Sites |
| `/ecosystem/api` | Página da API |
| `/ecosystem/visa` | Página do Visa |

> **Nota de SEO:** `/about` e `/sobre-noro` foram consolidados em `/sobre` para evitar duplicidade de indexação. Redirecionar `/about` e `/sobre-noro` via 301 para `/sobre`.

---

#### 4.4.2 CORE — app.noro.guru

Ver mapa detalhado na **§12.2**.

---

#### 4.4.3 CONTROL — admin.noro.guru

Ver mapa detalhado na **§11.2**.

---

#### 4.4.4 SITES — sites.noro.guru

**Runtime (atual)**

| Rota | Descrição |
|---|---|
| `/[slug]` | Homepage do site publicado da agência |
| `/[slug]/[page]` | Subpágina interna do site (sobre, serviços, contato, etc.) |
| `/[slug]/blog` | Blog do site da agência |
| `/[slug]/blog/[post-slug]` | Post individual do blog da agência |

**Fallbacks**

| Rota | Descrição |
|---|---|
| `/404` ou `notFound()` | Slug inexistente — página pública de não encontrado |

**Roadmap**

| Funcionalidade | Descrição |
|---|---|
| Custom domains | Resolução por domínio personalizado do tenant |
| Preview privado | Preview autenticado do site antes da publicação |
| Render A/B | Testes A/B de blueprint por segmento |
| SEO dinâmico | `sitemap.xml` e metadados otimizados por slug |
| Analytics embed | Script de analytics injetado pelo blueprint |

---

#### 4.4.5 VISA — visa.noro.guru

**Visa Landing**

| Rota | Descrição |
|---|---|
| `/` | Landing da API de vistos — conversão |
| `/docs` | Entrada comercial da documentação |
| `/pricing` | Planos e limites gratuitos |
| `/sandbox` | Ambiente de testes guiado |
| `/countries` | Lista de países com vistos suportados |
| `/countries/[slug]` | Detalhes e requisitos por país |
| `/faq` | Perguntas frequentes — remove fricção comercial e técnica |
| `/status` | Status operacional da API de vistos |
| `/changelog` | Histórico público de atualizações da API |

---

#### 4.4.6 API — api.noro.guru

**Documentação Técnica**

| Rota | Descrição |
|---|---|
| `/` | Hub técnico — overview da API |
| `/quickstart` | Primeira chamada em menos de 5 minutos |
| `/reference` | Referência completa de endpoints |
| `/authentication` | Autenticação, chaves, tokens e escopos |
| `/rate-limits` | Limites por plano, janelas e tratamento de erro 429 |
| `/versioning` | Política de versionamento e compatibilidade |
| `/webhooks` | Documentação de webhooks e payloads |
| `/sdk` | SDKs oficiais disponíveis |
| `/examples` | Exemplos de integração por linguagem |
| `/changelog` | Histórico de mudanças com breaking changes destacados |
| `/status` | Disponibilidade e incidentes da API |

**Developer Portal**

| Rota | Descrição |
|---|---|
| `/developers` | Hub do desenvolvedor autenticado |
| `/developers/apps` | Apps registrados e credenciais |
| `/developers/api-keys` | Criação, rotação e revogação de chaves |
| `/developers/usage` | Consumo de tokens, rate limit e métricas |
| `/developers/billing` | Billing do plano de API e histórico de uso |
| `/developers/webhooks` | Endpoints de webhook registrados e logs de entrega |

---

## 5. Sistema de Design & Tokens Visuais

### 5.1 Paleta de Cores

#### Brand
| Token | Valor | Uso |
|---|---|---|
| `noro_primary` | `#342CA4` | Ações primárias, links, foco |
| `noro_primary_deep` | `#3B2CA4` | Hover de primário |
| `noro_primary_dark` | `#232452` | Gradientes, fundos escuros de marca |

#### Accent
| Token | Valor | Uso |
|---|---|---|
| `noro_accent` | `#1DD3C0` | Destaques, indicadores ativos, progress |
| `noro_gold` | `#D4AF37` | Premium, badges especiais |
| `noro_gold_hover` | `#E5C04B` | Hover de gold |

#### Semânticos
| Token | Valor | Estado |
|---|---|---|
| `success` | `#16A34A` | Pago, Concluído, Ativo, Verificado |
| `warning` | `#CA8A04` | Pendente, Em Aberto, Aguardando Aprovação |
| `destructive` | `#E11D48` | Cancelado, Atrasado, Negado |
| `info` | `#2563EB` | Informativo, Em Processamento |

### 5.2 Política de Tema por Contexto

| Contexto | Tema | Família de Neutros |
|---|---|---|
| Páginas públicas (Web, Visa Landing) | Dark por padrão | `neutral_dark` + `text_dark_theme` |
| Dashboards operacionais (Core, Control) | Light por padrão | `neutral_light` |
| Sites publicados | Segue blueprint do tenant | — |
| Modais e overlays | Herdam o tema da página de origem | Sem trocar família de neutros |

### 5.3 Tipografia

| Família | Fonte | Uso | Pesos |
|---|---|---|---|
| `display` | Manrope | H1/H2 públicos, títulos de módulo/seção em dashboards | 600, 700, 800 |
| `sans` | Plus Jakarta Sans | H3/H4, body, labels, tabelas, badges, formulários | 400, 500, 600 |
| `mono` | JetBrains Mono | Código, API keys, hashes, snippets técnicos | — |

**Pesos em dashboards:** 700 para título de página, 600 para título de card/KPI/seção.

> Fraunces removida do sistema para evitar ruptura de legibilidade entre páginas públicas e dashboards.

### 5.4 Radius por Contexto

| Token | Valor | Uso |
|---|---|---|
| `sm` | `0.375rem` | Controles compactos, chips, badges |
| `md` | `0.5rem` | Inputs, buttons, cards utilitários |
| `lg` | `0.75rem` | Modais, drawers, cards principais |
| `xl` | `1rem` | Hero cards, seções de destaque públicas |
| `full` | `9999px` | Pills, avatares, elementos circulares |
| `base` | `0.75rem` | Valor injetado em `--radius` no globals.css |

### 5.5 Componentes Canônicos

**Stack base:** Shadcn UI + Radix UI + Tailwind — pacote compartilhado `@noro/ui`

**Componentes obrigatórios:**
Button · Input · Textarea · Card · Badge · Avatar · Form (react-hook-form) · Table · Dialog · Popover · Select · Tabs · Toast

**Contratos mínimos:**
- Estados obrigatórios: `default`, `hover`, `focus-visible`, `disabled`, `loading`, `error`
- Props de `variant` e `size` padronizadas
- Sem hardcode de tokens em implementação nova

---

## 6. Arquitetura Visual e UX

### 6.1 Princípios de Redução de Complexidade

O sistema usa **progressive disclosure** para nunca sobrecarregar o operador:

1. **Agrupamento por domínio** — funcionalidades são apresentadas pelo pilar a que pertencem, nunca em lista plana
2. **Hierarquia forte** — o olho do usuário segue o fluxo de decisão natural
3. **Redução de carga cognitiva** — menos informação simultânea, mais contexto relevante
4. **Priorização contextual** — o que importa para *este* momento aparece em destaque

O usuário **nunca** deve sentir:
- Excesso de features visíveis ao mesmo tempo
- Menus com dezenas de itens sem agrupamento
- Informações concorrendo por atenção sem hierarquia clara

### 6.2 Princípios de UX Obrigatórios

- **Um único CTA primário por seção** — sem competição entre ações principais
- **Agrupamento semântico forte** — cada bloco tem um propósito claro
- **Páginas com foco claro** — o objetivo da página é óbvio em 3 segundos
- **Redução de ruído visual** — decoração serve ao conteúdo, nunca compete com ele
- **Menos simultaneidade** — dados críticos primeiro, contexto adicional sob demanda
- **Foco em workflow** — a UI guia o operador pelo fluxo natural da tarefa

### 6.3 Direção Visual por App

#### Web (noro.guru)
- Estilo: landing premium orientada a conversão
- Base: dark como identidade principal
- Prioridade: clareza de proposta de valor e conversão acima da dobra
- Anti-padrão: não listar módulos sem contexto de pilar

#### Core (app.noro.guru)
- Estilo: corporativo moderno com foco em clareza operacional
- Base: superfície limpa, contraste alto, ruído visual mínimo
- Prioridade: informação e ação acima de decoração
- Anti-padrão: não usar variações visuais por página sem token oficial

#### Control (admin.noro.guru)
- Estilo: painel executivo com legibilidade priorizada
- Base: superfície neutra, contraste consistente, baixa carga decorativa
- Prioridade: rastreabilidade e segurança de ação
- Anti-padrão: não usar linguagem de marketing em contexto de governança

### 6.4 Hierarquia Visual Padrão (Dashboards)

| Nível | Conteúdo |
|---|---|
| **Nível 1** | Contexto e escopo (título, breadcrumb, tenant, org) |
| **Nível 2** | Estado operacional (KPIs, alertas, pendências) |
| **Nível 3** | Área de trabalho (tabelas, formulários, kanban, timeline) |
| **Nível 4** | Suporte contextual (logs, ajuda, metadados) |

### 6.5 Regras Visuais de Segurança

- Ação destrutiva sempre com semântica de cor distinta (`destructive`)
- Botão primário único por área de decisão
- Elementos de alto risco com dupla confirmação visual e textual
- Indicadores de status com semântica consistente em todos os apps

### 6.6 Motion e Interação

- Transições curtas e funcionais: **150–250ms**
- Sem animação contínua em componentes de decisão
- Feedback imediato para loading, sucesso e falha
- Motion utilitário permitido: `fade-in` para entrada, `shimmer` para loading
- Animações contínuas apenas quando funcionalmente justificadas

### 6.7 Acessibilidade (Mínimo Obrigatório)

- WCAG AA mínimo em textos e controles
- `focus-visible` global obrigatório: outline 2px em accent, offset 2px
- Navegação completa por teclado em tabelas, modais e formulários
- Labels e `aria-invalid`/`aria-describedby` em formulários
- Contraste de texto em dark theme validado por tokens oficiais
- Fallback recomendado para `prefers-reduced-motion`

### 6.8 Elementos Globais de Base

- Reset global em `html/body` para previsibilidade de layout
- Scrollbar customizada por tema:
  - Dark: `track #12152C`, `thumb #2B2E48`
  - Light: `track #f1f5f9`, `thumb #dfe2ea`

### 6.9 Anti-Padrões Proibidos (Todos os Apps)

- Hardcode de cor em contexto operacional crítico
- Múltiplos CTAs primários em uma mesma seção
- Ação destrutiva sem confirmação explícita
- Tabela sem estado vazio e sem erro tratado
- Modais longos sem divisão por seções
- Variações visuais por página sem token oficial
- Listar todos os módulos sem agrupamento semântico

---

## 7. Estrutura de Navegação e Sidebar

### 7.1 Shell Protegido

O shell dos dashboards (Core e Control) tem 3 zonas:

1. **Sidebar lateral** — navegação persistente agrupada por domínio/pilar
2. **Topbar** — busca global (`GlobalSearch`), notificações, contexto de tenant/org, `ThemeToggle`
3. **Área principal** — `PageHeader` com breadcrumbs + ações primárias + conteúdo

**Comportamento responsivo:**
- Desktop: sidebar fixa
- Tablet/mobile: sidebar recolhível com foco no fluxo principal

### 7.2 Sidebar do Core (app.noro.guru)

Organizada pelos 5 pilares estratégicos:

```
━━ CRM & Pipeline ━━━━━━━━━━━━━━━━
  Leads
  Clientes
  Orçamentos
  Pedidos

━━ Financeiro & Billing ━━━━━━━━━━
  Financeiro
  Billing
  Cobranças
  Fluxo de Caixa

━━ Atendimento ━━━━━━━━━━━━━━━━━━━
  Comunicação
  Chat
  WhatsApp
  Tickets

━━ Sites & Marketing ━━━━━━━━━━━━━
  Sites
  Blog
  Social
  Marketing

━━ IA Operacional ━━━━━━━━━━━━━━━━
  Conteúdo IA
  Automação
  Assistentes
  Custos IA

━━ Governança ━━━━━━━━━━━━━━━━━━━━
  Configurações
  Usuários
  Permissões
  API
  Webhooks
```

### 7.3 Sidebar do Control (admin.noro.guru)

Organizada por domínio de governança:

```
━━ Visão Geral ━━━━━━━━━━━━━━━━━━━
  Dashboard
  Tarefas

━━ Organizações ━━━━━━━━━━━━━━━━━━
  Orgs
  Tenants
  Leads (Control)

━━ Plataforma & Billing ━━━━━━━━━━
  Billing
  Planos
  Assinaturas

━━ Financeiro ━━━━━━━━━━━━━━━━━━━━
  Financeiro Plataforma

━━ Comunicação ━━━━━━━━━━━━━━━━━━━
  Suporte
  Notificações

━━ Governança ━━━━━━━━━━━━━━━━━━━━
  Usuários
  API Keys
  Webhooks
  Auditoria
  Domínios
  Configurações
```

---

## 8. Estratégia Responsiva Oficial

### 8.1 Princípio Fundamental

> O Noro Guru é **responsive-first**. Não existe app mobile separado, não existe frontend mobile separado, não existem rotas duplicadas.

O sistema é:
- **Responsive-first** — um único codebase, múltiplos breakpoints
- **Adaptive-layout** — o layout se adapta ao contexto do dispositivo
- **Multi-breakpoint** — comportamentos distintos por viewport, sem simplificação excessiva

### 8.2 Comportamento por Viewport

#### Desktop (≥ 1024px)
- Sidebar fixa, sempre visível
- Múltiplas colunas (2–3 cols em dashboards)
- Tabelas com densidade alta e colunas completas
- Dashboards com todos os KPIs visíveis
- Foco em produtividade e multitarefa

#### Tablet (768px – 1023px)
- Sidebar recolhível (toggle por ação)
- Grids simplificados (1–2 cols)
- Tabelas com colunas prioritárias visíveis, colunas secundárias acessíveis
- Foco em leitura operacional e ações principais

#### Mobile (< 768px)
- Stack vertical
- Bottom sheets para ações rápidas
- Drawers para contexto adicional
- Cards empilhados em lista vertical
- Tabelas com scroll horizontal ou modo card
- Foco em ação e contexto — **nunca tentar reproduzir densidade desktop integralmente**

### 8.3 Guideline de Priorização Mobile

> Em mobile, priorizar **ação** e **contexto**. O operador em campo precisa agir, não analisar.

Hierarquia de visibilidade em mobile:
1. Status atual da entidade (o que está acontecendo agora)
2. Ação principal disponível (o que fazer agora)
3. Contexto essencial (quem, quando, quanto)
4. Detalhes secundários (disponíveis via expand/drawer)

---

## 9. Arquitetura de Informação & Layouts de Tela

As interfaces do Noro Guru seguem quatro layouts predominantes:

### Layout A — O Funil em Kanban
*`LeadsKanban` / `SupportKanbanBoard`*

Colunas verticais representando estágios de processo (ex: Novo, Em Atendimento, Proposta Enviada). Cards compactos exibem: nome do contato, responsável, data limite e tags de SLA.

### Layout B — A Ficha Consolidada 360°
*Perfil do Cliente / Detalhes do Pedido*

Duas colunas: barra lateral estreita com informações rápidas/status + área central com `Tabs` para históricos, faturamento e documentos.

### Layout C — A Matriz de Ledger Financeiro
*`FinanceiroTablesClient`*

Foco em listagem analítica. Filtros avançados no topo (por período, categoria, centro de custo), sumário de saldos em destaque, valores em `R$ 0,00`.

### Layout D — O Workspace de Comunicação
*`ChatDashboardClient`*

Três colunas:
- **Esquerda:** Lista de conversas ativas filtradas por fila
- **Centro:** Janela de chat com balões diferenciados (agente, cliente, notas internas)
- **Direita:** Painel de contexto rápido para vincular CRM ou disparar gatilhos/webhooks

### 9.1 Critérios de Aceite por Tipo de Página

#### Tipo A — Listagem Operacional
Obrigatório:
- Filtros combináveis por status, data e responsável
- Busca com debounce e preservação na URL
- Ordenação e paginação determinísticas
- Estados de vazio, loading e erro
- Ações em lote com confirmação quando houver risco

Aceite:
- Nenhuma ação principal inacessível no mobile
- Persistência de contexto ao voltar do detalhe

#### Tipo B — Ficha 360° e Detalhe
Obrigatório:
- Cabeçalho com ID, status e ações principais
- Seções por abas com navegação clara
- Timeline de atividades quando aplicável
- Ações críticas com dupla confirmação

Aceite:
- Alterações relevantes registradas em auditoria
- Sem perda de contexto da listagem de origem

#### Tipo C — Criação e Edição
Obrigatório:
- Validação de campo no client e no server
- Mensagens de erro por campo e erro global
- Proteção contra saída sem salvar
- Feedback de sucesso claro após submit

Aceite:
- Reprodutibilidade do formulário sem inconsistências
- Zero bloqueio em caminho feliz

#### Tipo D — Dashboard e KPI
Obrigatório:
- KPI com definição e período explícitos
- Filtro global de período refletido em todos os cards
- Drill-down para lista fonte da métrica
- Estado sem dados com ação recomendada

Aceite:
- Números reconciliáveis com fontes do sistema
- Sem divergência visual entre cards e tabelas do mesmo recorte

#### Tipo E — Configuração e Administração
Obrigatório:
- Controle de acesso por role e escopo
- Confirmação reforçada para ação destrutiva
- Registro de mudança em auditoria
- Sinalização de impacto antes de salvar

Aceite:
- Acesso indevido bloqueado por backend
- Mudanças sensíveis rastreáveis com autor e timestamp

---

## 10. Estados Canônicos de Tela

**Regra global:** Todo módulo deve definir e reutilizar três estados mínimos. Nenhuma tela nova pode inventar linguagem própria para vazio ou erro fora deste padrão.

**Padrão visual base:**
- `onboarding_state`: ícone/ilustração leve + título claro + texto curto + CTA primário orientando a primeira ação
- `empty_search`: mensagem objetiva de "nenhum resultado" + resumo dos filtros ativos + CTA secundário para limpar filtros
- `error_state`: mensagem de falha + causa resumida + CTA claro de tentar novamente

| Módulo | onboarding_state | empty_search | error_state |
|---|---|---|---|
| **Leads** | "Nenhum lead ainda" + `Criar primeiro lead` | "Nenhum lead encontrado para este filtro" + `Limpar filtros` | "Não foi possível carregar os leads" + `Tentar novamente` |
| **Clientes** | "Nenhum cliente cadastrado" + `Cadastrar cliente` | "Nenhum cliente corresponde a esta busca" + `Ver todos os clientes` | "Falha ao carregar clientes" + `Recarregar lista` |
| **Orçamentos** | "Nenhum orçamento ou pedido criado" + `Criar orçamento` | "Nenhum resultado para os filtros aplicados" + `Limpar filtros` | "Não foi possível carregar orçamentos/pedidos" + `Tentar novamente` |
| **Financeiro** | "Nenhum lançamento financeiro ainda" + `Criar lançamento` | "Nenhum lançamento encontrado neste período" + `Ajustar período` | "Falha ao carregar dados financeiros" + `Reprocessar consulta` |
| **Billing** | "Nenhuma cobrança emitida ainda" + `Emitir cobrança` | "Nenhuma cobrança encontrada com estes filtros" + `Limpar filtros` | "Não foi possível carregar cobranças" + `Tentar novamente` |
| **Conteúdo & Marketing** | "Nenhum conteúdo criado ainda" + `Criar conteúdo` | "Nenhum conteúdo encontrado para este estado" + `Ver todos` | "Falha ao carregar conteúdos/campanhas" + `Recarregar` |
| **Comunicação** | "Nenhuma conversa ativa" + `Ir para fila` | "Nenhuma conversa encontrada" + `Limpar filtros` | "Não foi possível carregar conversas" + `Reconectar` |
| **Sites** | "Nenhum site publicado ainda" + `Criar site` | "Nenhum site corresponde ao filtro atual" + `Ver todos os sites` | "Falha ao carregar sites/publicações" + `Tentar novamente` |
| **Visa/API** | "Comece pela API de vistos gratuita" + `Ver documentação` | "Nenhum endpoint ou seção encontrada" + `Voltar para docs` | "Não foi possível carregar a documentação/API" + `Tentar novamente` |

---

## 11. Módulo Control — Governança da Plataforma

### 11.1 Contexto e Objetivo

O Control (`admin.noro.guru`) é a camada de governança central da plataforma Noro Guru. Opera com foco em segurança de ação, rastreabilidade e administração multi-tenant de alto criticidade.

### 11.2 Mapa de Páginas

#### Dashboard Global
```
/control
/control/dashboard
/control/analytics
/control/saude
```

#### Organizações & Tenants
```
/control/orgs
/control/orgs/[id]
/control/orgs/[id]/billing
/control/orgs/[id]/tenants
/control/orgs/[id]/auditoria
/control/tenants
/control/tenants/[id]
/control/tenants/[id]/usuarios
/control/tenants/[id]/billing
/control/tenants/[id]/configuracoes
/control/tenants/[id]/auditoria
```

#### Usuários Globais
```
/control/users
/control/users/[id]
/control/users/[id]/sessoes
/control/users/[id]/auditoria
/control/roles
/control/permissoes
```

#### Planos & Produtos
```
/control/plans
/control/plans/novo
/control/plans/[id]
/control/plans/[id]/editar
```

#### Billing Plataforma
```
/control/billing
/control/billing/overview
/control/billing/subscriptions
/control/billing/invoices
/control/billing/payments
/control/billing/delinquency
/control/billing/reconciliation
/control/billing/providers
/control/billing/audit
```

#### Financeiro Plataforma
```
/control/financeiro
/control/financeiro/overview
/control/financeiro/receita
/control/financeiro/despesa
/control/financeiro/fluxo-caixa
/control/financeiro/resultado
/control/financeiro/repasse
/control/financeiro/conciliacao
/control/financeiro/fechamento
```

#### Auditoria & Governança
```
/control/auditoria
/control/auditoria/[id]
/control/logs
/control/eventos
/control/incidentes
/control/incidentes/[id]
/control/changelog
/control/releases
```

#### Governança Técnica
```
/control/api-keys
/control/api-keys/[id]
/control/webhooks
/control/webhooks/[id]
/control/webhooks/[id]/logs
/control/providers
/control/domains
/control/domains/[id]
```

#### Operação & Suporte
```
/control/tasks
/control/tasks/[id]
/control/support
/control/support/[id]
/control/notificacoes
/control/impersonation
/control/impersonation/[tenant-id]
```

#### Observabilidade
```
/control/monitoring
/control/monitoring/uptime
/control/errors
/control/errors/[id]
/control/performance
/control/jobs
/control/jobs/[id]
```

### 11.3 Prioridade por Onda

**Onda 1 — Core Operacional e Receita**
- Login e dashboard protegido
- Clientes, Leads, Orçamentos, Pedidos
- Financeiro, Pagamentos, Billing
- *Objetivo:* Operação diária sem gargalo e previsibilidade de caixa

**Onda 2 — Atendimento e Comunicação**
- Comunicação, Chatbot, Chat por conversa
- Support e detalhe de ticket
- Notificações e admin notificações
- *Objetivo:* SLA de atendimento monitorável por fila e agente

**Onda 3 — Multi-tenant e Governança de Conta**
- Tenants e subpáginas de tenant
- Users, Domains, Custom Domains
- API Keys, Webhooks, Configurações de Planos
- *Objetivo:* Gestão de tenant com trilha de auditoria e políticas consistentes

**Onda 4 — Superadmin e Orquestração Global**
- Control Hub, Leads Kanban
- Control Orgs e detalhe de org
- Control Tenants e tasks
- Auditoria global
- *Objetivo:* Painel de governança global com ações supervisionadas

**Onda 5 — Produto, Relatórios e Hardening**
- Relatórios, Marketing, Email, Sobre Noro
- Settings Stripe e métricas
- Debug e observabilidade avançada
- *Objetivo:* Base estável para melhoria contínua e escala

### 11.4 Mapa de Permissões (Control)

| Domínio | Super Admin | Admin Operacional | Financeiro | Comercial | Suporte | Marketing | Viewer |
|---|---|---|---|---|---|---|---|
| Clientes, Leads, Orçamentos, Pedidos | manage | manage | view | manage | view | view | view |
| Financeiro, Pagamentos, Billing | manage | update | manage | view | view | none | view |
| Comunicação, Chatbot, Support | manage | manage | view | update | manage | view | view |
| Tenants, Users, Domains, API Keys | manage | update | none | none | view | none | view |
| Control Global, Orgs, Auditoria | manage | view | none | none | none | none | view limitada |

**Regras transversais:**
- Deny by default para qualquer ação não declarada
- Escopo por tenant e org validado no backend
- Campos sensíveis com mascaramento por role

### 11.5 Checklist de Definição de Pronto — Control

- [ ] Objetivo de negócio da página está explícito
- [ ] Ações primárias e secundárias estão evidentes
- [ ] Componentes de estado vazio, loading e erro implementados
- [ ] Permissões corretas por role e escopo
- [ ] Eventos operacionais disparados com campos obrigatórios
- [ ] Copys de erro e sucesso estão claras e acionáveis
- [ ] Responsivo validado em mobile, tablet e desktop
- [ ] Acessibilidade AA mínima atendida
- [ ] Auditoria ativa para mudanças sensíveis

### 11.6 Eventos de Analytics (Control)

**Padrão:** `control_<modulo>_<acao>`

**Campos padrão:** `event_name` · `timestamp_utc` · `user_id` · `role` · `org_id` · `tenant_id` · `source_page` · `success` · `error_code` · `latency_ms`

**Eventos por domínio:**

*Sessão:* `control_auth_login_success` · `control_auth_login_failed` · `control_auth_logout` · `control_auth_session_expired`

*Comercial:* `control_leads_created` · `control_leads_status_changed` · `control_clientes_created` · `control_orcamentos_created` · `control_orcamentos_converted` · `control_pedidos_created` · `control_pedidos_status_changed`

*Financeiro:* `control_financeiro_lancamento_created` · `control_pagamentos_confirmed` · `control_billing_subscription_changed` · `control_billing_delinquency_detected` · `control_stripe_webhook_processed` · `control_stripe_webhook_failed`

*Atendimento:* `control_support_ticket_created` · `control_support_ticket_first_response` · `control_support_ticket_resolved` · `control_support_ticket_reopened` · `control_chat_conversation_started` · `control_chatbot_handoff_human`

*Governança:* `control_tenant_created` · `control_tenant_config_updated` · `control_user_role_changed` · `control_api_key_created` · `control_api_key_revoked` · `control_webhook_endpoint_created` · `control_webhook_delivery_failed` · `control_auditoria_export_requested`

*Confiabilidade:* `control_page_load_slow_detected` · `control_api_request_failed` · `control_retry_action_triggered` · `control_background_job_failed` · `control_background_job_reprocessed`

---

## 12. Módulo Core — Operação do Tenant

### 12.1 Contexto e Objetivo

O Core (`app.noro.guru`) é o sistema operacional do tenant — onde CRM, financeiro, conteúdo, atendimento e IA convergem na operação diária da agência.

### 12.2 Mapa de Páginas

#### Dashboard Principal

| Rota | Descrição |
|---|---|
| `/` | Dashboard geral (redirect para `/dashboard`) |
| `/dashboard` | Dashboard operacional principal |
| `/dashboard/executivo` | Visão executiva consolidada |
| `/dashboard/comercial` | Pipeline e métricas de vendas |
| `/dashboard/financeiro` | Saúde financeira do tenant |
| `/dashboard/marketing` | Métricas de conteúdo e campanhas |

#### CRM & Pipeline — Leads

| Rota | Descrição |
|---|---|
| `/leads` | Lista de leads com filtros e kanban |
| `/leads/novo` | Criação de lead |
| `/leads/importar` | Importação em lote |
| `/leads/kanban` | Visualização kanban por estágio |
| `/leads/[id]` | Detalhe do lead |
| `/leads/[id]/editar` | Edição do lead |
| `/leads/[id]/timeline` | Histórico de ações do lead |

#### CRM & Pipeline — Clientes (Hub 360°)

| Rota | Descrição |
|---|---|
| `/clientes` | Lista de clientes |
| `/clientes/novo` | Cadastro de cliente |
| `/clientes/[id]` | Perfil 360° do cliente |
| `/clientes/[id]/dados` | Dados pessoais e contatos |
| `/clientes/[id]/documentos` | Documentos e uploads |
| `/clientes/[id]/pedidos` | Pedidos vinculados ao cliente |
| `/clientes/[id]/financeiro` | Histórico financeiro do cliente |
| `/clientes/[id]/historico` | Histórico de atendimentos e compras |
| `/clientes/[id]/milhas` | Programas de fidelidade e milhas |
| `/clientes/[id]/preferencias` | Preferências e perfil de viagem |
| `/clientes/[id]/timeline` | Timeline completa de interações |

#### CRM & Pipeline — Orçamentos

| Rota | Descrição |
|---|---|
| `/orcamentos` | Lista de orçamentos |
| `/orcamentos/novo` | Novo orçamento |
| `/orcamentos/[id]` | Detalhe do orçamento |
| `/orcamentos/[id]/editar` | Edição do orçamento |
| `/orcamentos/[id]/roteiro` | Roteiro gerado por IA |
| `/orcamentos/[id]/proposta` | Visualização da proposta |
| `/orcamentos/[id]/pdf` | Exportação em PDF |
| `/orcamentos/[id]/aprovacao` | Fluxo de aprovação |

#### CRM & Pipeline — Pedidos / Vendas

| Rota | Descrição |
|---|---|
| `/pedidos` | Lista de pedidos |
| `/pedidos/[id]` | Detalhe do pedido |
| `/pedidos/[id]/editar` | Edição do pedido |
| `/pedidos/[id]/financeiro` | Financeiro vinculado ao pedido |
| `/pedidos/[id]/passageiros` | Dados de passageiros |
| `/pedidos/[id]/fornecedores` | Fornecedores e serviços contratados |
| `/pedidos/[id]/timeline` | Timeline do pedido |

#### Financeiro & Billing — Financeiro

| Rota | Descrição |
|---|---|
| `/financeiro` | Overview financeiro do tenant |
| `/financeiro/overview` | KPIs e saúde financeira |
| `/financeiro/contas-receber` | Carteira de recebíveis |
| `/financeiro/contas-pagar` | Obrigações e pagamentos |
| `/financeiro/fluxo-caixa` | Previsão x realizado |
| `/financeiro/conciliacao` | Conciliação de lançamentos |
| `/financeiro/fechamento` | Fechamento financeiro mensal |
| `/financeiro/resultado` | Resultado e margem por período |
| `/financeiro/centros-custo` | Classificação e centros de custo |

#### Financeiro & Billing — Billing do Tenant

| Rota | Descrição |
|---|---|
| `/financeiro/billing` | Área de billing do tenant |
| `/financeiro/billing/overview` | Saúde de receita e carteira |
| `/financeiro/billing/invoices` | Faturas para clientes finais |
| `/financeiro/billing/charges` | Cobranças avulsas e recorrentes |
| `/financeiro/billing/payments` | Baixas e confirmações |
| `/financeiro/billing/delinquency` | Inadimplência e follow-up |
| `/financeiro/billing/reconciliation` | Conciliação de cobranças |
| `/financeiro/billing/settings` | Regras fiscais e meios de pagamento |

#### Sites & Marketing — Conteúdo IA

| Rota | Descrição |
|---|---|
| `/conteudo` | Hub de conteúdo |
| `/conteudo/roteiros` | Lista de roteiros |
| `/conteudo/roteiros/a-publicar` | Roteiros pendentes de publicação |
| `/conteudo/roteiros/publicados` | Roteiros publicados |
| `/conteudo/artigos` | Lista de artigos |
| `/conteudo/artigos/a-publicar` | Artigos pendentes de publicação |
| `/conteudo/artigos/publicados` | Artigos publicados |
| `/conteudo/templates` | Templates de conteúdo |
| `/conteudo/seo` | Gestão de SEO e metadados |

#### Sites & Marketing — Marketing

| Rota | Descrição |
|---|---|
| `/marketing` | Hub de marketing |
| `/marketing/social` | Gestão de redes sociais |
| `/marketing/email` | E-mail marketing |
| `/marketing/campanhas` | Campanhas ativas e agendadas |
| `/marketing/automacoes` | Automações de marketing |
| `/marketing/analytics` | Métricas e performance |

#### Sites & Marketing — Social

| Rota | Descrição |
|---|---|
| `/social/posts` | Posts criados e agendados |
| `/social/calendario` | Calendário editorial |
| `/social/agendamentos` | Fila de publicação |
| `/social/insights` | Métricas por canal |

#### Atendimento — Comunicação

| Rota | Descrição |
|---|---|
| `/comunicacao` | Central omnichannel |
| `/comunicacao/chat` | Chat ativo |
| `/comunicacao/whatsapp` | Canal WhatsApp |
| `/comunicacao/instagram` | Canal Instagram |
| `/comunicacao/facebook` | Canal Facebook |
| `/comunicacao/filas` | Gerenciamento de filas |
| `/comunicacao/chatbot` | Configuração do chatbot |

#### Atendimento — Support / Tickets

| Rota | Descrição |
|---|---|
| `/support` | Hub de suporte |
| `/support/tickets` | Lista de tickets |
| `/support/[id]` | Detalhe do ticket |
| `/support/sla` | Monitoramento de SLA |
| `/support/kanban` | Kanban de suporte |

#### Atendimento — Tarefas

| Rota | Descrição |
|---|---|
| `/tarefas` | Hub de tarefas |
| `/tarefas/minhas` | Tarefas do operador logado |
| `/tarefas/equipe` | Tarefas da equipe |
| `/tarefas/calendario` | Calendário de tarefas |

#### IA Operacional — Custos IA

| Rota | Descrição |
|---|---|
| `/custos` | Hub de custos IA |
| `/custos/all` | Todos os custos |
| `/custos/roteiros` | Custo por geração de roteiro |
| `/custos/artigos` | Custo por geração de artigo |
| `/custos/imagens` | Custo por geração de imagem |
| `/custos/tokens` | Consumo de tokens por modelo |

#### Sites & Marketing — Meu Site

| Rota | Descrição |
|---|---|
| `/site` | Hub do site da agência |
| `/site/editor` | Editor visual do site |
| `/site/paginas` | Gerenciamento de páginas |
| `/site/blog` | Blog do site |
| `/site/seo` | SEO e metadados do site |
| `/site/dominio` | Configuração de domínio |
| `/site/publicacao` | Publicação e status |
| `/site/templates` | Templates disponíveis |
| `/site/analytics` | Analytics do site publicado |

#### Relatórios

| Rota | Descrição |
|---|---|
| `/relatorios` | Hub de relatórios |
| `/relatorios/comercial` | Relatório comercial |
| `/relatorios/financeiro` | Relatório financeiro |
| `/relatorios/marketing` | Relatório de marketing |
| `/relatorios/operacional` | Relatório operacional |

#### Notificações

| Rota | Descrição |
|---|---|
| `/notificacoes` | Central de notificações do operador |

#### Governança — Configurações

| Rota | Descrição |
|---|---|
| `/configuracoes` | Hub de configurações |
| `/configuracoes/perfil` | Perfil do usuário |
| `/configuracoes/equipe` | Gestão da equipe |
| `/configuracoes/convites` | Convites pendentes enviados à equipe |
| `/configuracoes/permissoes` | Controle de permissões |
| `/configuracoes/redes-sociais` | Conexão com redes sociais |
| `/configuracoes/pagamentos` | Gateways de pagamento |
| `/configuracoes/webhooks` | Webhooks e integrações |
| `/configuracoes/api` | API keys do tenant |
| `/configuracoes/notificacoes` | Preferências de notificação |
| `/configuracoes/plano` | Plano atual, limites e upgrade |
| `/configuracoes/faturamento` | Faturas do plano Noro Guru (visão espelho de Control Billing) |

#### Autenticação & Onboarding (rotas fora do shell autenticado)

| Rota | Descrição |
|---|---|
| `/login` | Login |
| `/cadastro` | Cadastro de novo tenant |
| `/onboarding` | Wizard de primeiro acesso — setup inicial do tenant |
| `/onboarding/agencia` | Passo: dados da agência |
| `/onboarding/equipe` | Passo: adicionar membros |
| `/onboarding/site` | Passo: criar primeiro site |
| `/onboarding/concluido` | Conclusão e redirect para dashboard |
| `/convites/[token]` | Aceite de convite de membro da equipe (rota pública) |
| `/redefinir-senha` | Redefinição de senha |
| `/redefinir-senha/[token]` | Formulário de nova senha via token |

### 12.3 Prioridade por Onda

**Onda 1 — Comercial e Pipeline de Conversão**
- Dashboard protegido, Leads, Clientes, Orçamentos, Pedidos
- *Objetivo:* Ciclo comercial fim a fim sem fricção

**Onda 2 — Financeiro e Operação de Receita**
- Financeiro, ajustes em pedidos/orçamentos
- *Objetivo:* Previsibilidade de receita e liquidação

**Onda 3 — Conteúdo, Marketing e Social**
- Conteúdo IA (roteiros e artigos), Marketing (social e e-mail), Social posts
- *Objetivo:* Pipeline editorial com governança de publicação

**Onda 4 — Custos IA, Relatórios e Configurações**
- Custos, Relatórios, Configurações e redes sociais
- *Objetivo:* Controle de custo por output e eficiência operacional

**Onda 5 — Site e Polimento de Experiência**
- Meu Site, site público por slug, Sobre Noro
- *Objetivo:* Fechar experiência entre backoffice e entrega externa

### 12.4 Mapa de Permissões (Core)

| Domínio | super_admin | admin | operator | financeiro | editor_conteudo | viewer |
|---|---|---|---|---|---|---|
| Leads, Clientes, Orçamentos, Pedidos | manage | manage | manage | view | view | view |
| Financeiro | manage | update | view | manage | none | view |
| Conteúdo, Marketing, Social | manage | manage | update | view | manage + publish | view |
| Custos e Relatórios | manage | manage | view | manage | view | view |
| Configurações e Site | manage | manage | update restrito | none | update em conteúdo | view |

**Regras transversais:**
- Deny by default para ação não declarada
- Validação de escopo por tenant no backend
- Bloqueio de publish e delete para perfis sem permissão explícita

### 12.5 Eventos de Analytics (Core)

**Padrão:** `core_<modulo>_<acao>`

**Campos padrão:** `event_name` · `timestamp_utc` · `user_id` · `role` · `tenant_id` · `source_page` · `entity_type` · `entity_id` · `success` · `error_code` · `latency_ms`

**Eventos por domínio:**

*Acesso:* `core_auth_login_success` · `core_auth_login_failed` · `core_auth_logout` · `core_auth_session_expired`

*Comercial:* `core_lead_created` · `core_lead_status_changed` · `core_cliente_created` · `core_cliente_updated` · `core_orcamento_created` · `core_orcamento_updated` · `core_orcamento_converted_to_pedido` · `core_pedido_created` · `core_pedido_status_changed`

*Financeiro:* `core_financeiro_entry_created` · `core_financeiro_entry_reconciled` · `core_financeiro_entry_overdue` · `core_billing_invoice_issued` · `core_billing_invoice_paid` · `core_billing_invoice_overdue` · `core_billing_charge_failed`

*Conteúdo e Marketing:* `core_conteudo_draft_created` · `core_conteudo_review_requested` · `core_conteudo_published` · `core_conteudo_unpublished` · `core_social_post_scheduled` · `core_social_post_published` · `core_email_campaign_sent`

*Custos IA:* `core_custos_usage_ingested` · `core_custos_threshold_alert` · `core_custos_report_exported`

*Site e Configuração:* `core_site_settings_updated` · `core_site_slug_published` · `core_configuracao_updated` · `core_redes_sociais_updated`

### 12.6 Checklist de Definição de Pronto — Core

- [ ] Objetivo de negócio da página está explícito
- [ ] Navegação para próxima etapa está clara
- [ ] Estados vazio/loading/erro implementados
- [ ] Permissão por perfil validada
- [ ] Eventos operacionais obrigatórios disparando
- [ ] Responsivo validado em mobile, tablet e desktop
- [ ] Acessibilidade mínima AA atendida
- [ ] Mensagens de erro e sucesso acionáveis

---

## 13. Módulo Sites — Runtime Público

### 13.1 Contexto e Objetivo

O app Sites (`sites.noro.guru`) é o runtime público de entrega dos sites gerados por blueprint. Não é um painel administrativo — é um motor de renderização e entrega.

**Objetivos principais:**
- Publicar e servir páginas por slug com baixa latência
- Renderizar `blueprint_data` publicado de forma fiel e segura
- Preparar base para custom domains (roadmap)

### 13.2 Mapa de Rotas

O mapa completo de rotas do Sites está centralizado na **§4.4.4**.

**Resumo atual:**

| Rota | Descrição |
|---|---|
| `/[slug]` | Página pública dinâmica — renderiza blueprint publicado |

Rotas adicionais (roadmap): custom domains, preview privado, render A/B, SEO dinâmico — ver §4.4.4.

### 13.3 Arquivos Estruturais

- `app/layout.tsx` — layout público raiz
- `app/[slug]/page.tsx` — resolve slug e renderiza blueprint
- `lib/get-site.ts` — consulta `published` em Supabase
- `middleware.ts` — gancho para custom domains futuros

**Comportamento:** Busca site por slug → restringe a `status = published` → se não encontrar, retorna `notFound()` → se encontrar, renderiza via `@noro/renderer` (`BlueprintRenderer`)

### 13.3 Regras de Design do Runtime

- Shell mínimo — sem chrome administrativo no runtime público
- Nenhuma barra operacional fixa no runtime público
- Compatibilidade total com conteúdo full-bleed
- Sem injetar estilos que alterem semântica do blueprint
- Manter tipografia oficial do sistema quando definida no blueprint
- Garantir contraste e legibilidade mínima nas páginas publicadas

### 13.4 Regras de Slug e Subdomínio

**Padrão:** `[agencia-xyz].sites.noro.guru`

**Regras de slug:**
- Minúsculo, letras, números e hífen
- Sem espaços e sem caracteres especiais
- Tamanho mínimo e máximo por política de plataforma
- Slug único global no escopo `sites.noro.guru`
- Bloquear palavras reservadas e slugs proibidos

**Fallbacks:**
- Slug inexistente → `notFound()` público
- Slug em conflito → mensagem clara no onboarding
- Publicação sem tenant válido → bloqueio com instrução de correção

### 13.5 Fluxo Canônico de Provisionamento de Site

```
1. Descoberta     noro.guru (homepage + /sites-gratis)
2. Conversão      Clica em "Criar site grátis"
3. Onboarding     app.noro.guru (registro/login)
4. Tenant         app.noro.guru (criação de tenant + dados mínimos)
5. Wizard de site Geração de blueprint inicial
6. Slug           Escolha e validação de disponibilidade
7. Publicação     Status → published → runtime ativo
8. Pós-publi.     Gestão e edição no Core
```

### 13.6 Prioridade por Onda (Sites)

| Onda | Escopo | Objetivo |
|---|---|---|
| 1 | Runtime básico por slug | Estabilizar entrega pública |
| 2 | SEO e metadados dinâmicos | Indexação e compartilhamento |
| 3 | Performance e cache | Reduzir TTFB |
| 4 | Custom domains | Entrega white-label |
| 5 | Hardening e observabilidade | Operação confiável em escala |

### 13.7 Eventos de Analytics (Sites)

**Padrão:** `sites_<modulo>_<acao>`

Eventos mínimos: `sites_slug_resolved` · `sites_slug_not_found` · `sites_blueprint_render_success` · `sites_blueprint_render_error` · `sites_domain_resolved` · `sites_domain_not_mapped` · `sites_page_load_slow_detected`

---

## 14. Módulo Billing — Execução por App

### 14.1 Premissa de Produto

Billing não é uma página única — é um módulo interno com páginas e subpáginas.

- **Control Billing** → billing da plataforma Noro Guru
- **Core Billing** → billing do tenant para seus clientes finais
- **Regra de ownership:** Nenhum app executa cobrança fora do seu domínio owner

### 14.2 Layout Base para Telas de Billing

- Shell protegido do app (sidebar + topbar + conteúdo)
- Header com contexto de escopo (Control: org/tenant/plano | Core: tenant/cliente/período)
- Bloco de KPIs: receita, aberto, inadimplência, recuperação
- Área principal em abas: faturas, cobranças, pagamentos, conciliação, configurações
- Tabela analítica (layout ledger) com filtros, ordenação, bulk actions e exportação
- Painel lateral de detalhe rápido sem sair da lista

### 14.3 Páginas do Control Billing

| Rota | Objetivo |
|---|---|
| `/control/billing/overview` | KPIs globais e saúde financeira da plataforma |
| `/control/billing/subscriptions` | Planos dos tenants e alterações de assinatura |
| `/control/billing/invoices` | Faturas da plataforma por tenant/produto |
| `/control/billing/payments` | Confirmação, estorno e falhas de pagamento |
| `/control/billing/delinquency` | Carteira inadimplente e ações de recuperação |
| `/control/billing/reconciliation` | Conciliação com gateway e extrato técnico |
| `/control/billing/providers` | Configuração Stripe/Cielo/BTG e webhooks |
| `/control/billing/audit` | Trilha de eventos e mudanças sensíveis de billing |

### 14.4 Páginas do Core Billing

| Rota | Objetivo |
|---|---|
| `/core/financeiro/billing/overview` | Saúde de receita do tenant e carteira do período |
| `/core/financeiro/billing/invoices` | Emissão e gestão de faturas para clientes finais |
| `/core/financeiro/billing/charges` | Cobranças avulsas/recorrentes e status |
| `/core/financeiro/billing/payments` | Baixa, confirmação manual e divergências |
| `/core/financeiro/billing/delinquency` | Cobranças vencidas e follow-up de recuperação |
| `/core/financeiro/billing/reconciliation` | Conciliação entre cobrança emitida e recebimento |
| `/core/financeiro/billing/settings` | Regras fiscais, meios de pagamento e políticas |

### 14.5 Priorização de Implementação

1. `overview` + `invoices` (Control e Core)
2. `payments` + `delinquency` (Control e Core)
3. `reconciliation` + `providers/settings`
4. `subscriptions` (Control) + `charges` (Core) + `audit`

**Crítico antes de qualquer geração:**
- Fechar contratos de dados por subpágina
- Fechar regras de permissão por ação crítica
- Fechar eventos obrigatórios por jornada

---

## 15. Módulo Financeiro — Execução por App

### 15.1 Premissa e Fronteira de Domínio

- **Control Financeiro** → finanças consolidadas da plataforma (serviços, tenants, API, sites, operação corporativa)
- **Core Financeiro** → finanças operacionais do tenant para clientes finais

Billing permanece como subdomínio de cobrança. Financeiro cobre também caixa, resultados e governança financeira.

> **Regra:** Não duplicar liquidação, conciliação ou fechamento contábil entre apps. Visão espelho read-only quando necessário.

### 15.2 Páginas do Control Financeiro

| Rota | Objetivo |
|---|---|
| `/control/financeiro/overview` | Saúde financeira consolidada da plataforma |
| `/control/financeiro/receita` | Receitas por produto/canal/tenant |
| `/control/financeiro/despesa` | Custos operacionais, infraestrutura e fornecedores |
| `/control/financeiro/fluxo-caixa` | Previsão e realizado com janelas por período |
| `/control/financeiro/resultado` | Demonstrativo consolidado (margem, lucro, variação) |
| `/control/financeiro/repasse` | Regras e execução de repasse/comissionamento |
| `/control/financeiro/conciliacao` | Consistência entre origem financeira e recebimento |
| `/control/financeiro/fechamento` | Governança de fechamento mensal com trilha de aprovação |

### 15.3 Páginas do Core Financeiro

| Rota | Objetivo |
|---|---|
| `/core/financeiro/overview` | Saúde financeira do tenant no período |
| `/core/financeiro/contas-receber` | Carteira de recebíveis de clientes finais |
| `/core/financeiro/contas-pagar` | Obrigações com fornecedores/parceiros |
| `/core/financeiro/fluxo-caixa` | Previsão x realizado por dia/semana/mês |
| `/core/financeiro/centros-custo` | Classificação e análise de gasto |
| `/core/financeiro/resultado` | Desempenho do tenant por produto/serviço |
| `/core/financeiro/conciliacao` | Consistência entre lançamentos e pagamentos |
| `/core/financeiro/fechamento` | Rotina de fechamento financeiro do tenant |

### 15.4 Priorização de Implementação

1. `overview` + `fluxo-caixa` (Control e Core)
2. `contas-receber/receita` + `contas-pagar/despesa`
3. `conciliacao` + `resultado`
4. `fechamento` + `repasse/centros-custo`

---

## 16. Módulo Visa API

### 16.1 Premissa de Produto

- `visa.noro.guru` → landing comercial da API de vistos (conversão)
- `api.noro.guru` → área técnica (consumo, autenticação, docs)
- **Não misturar** landing comercial com console técnico no mesmo contexto visual

### 16.2 Layout da Landing visa.noro.guru

**Direção visual:** Landing premium, curta e orientada a conversão. Hero forte, um CTA primário dominante, prova social técnica e comercial.

**Blocos obrigatórios:**
- Hero com headline, subheadline e CTA
- Bloco de benefícios
- Bloco de casos de uso
- Bloco de integrações/recursos técnicos
- Bloco de planos ou chamada para uso gratuito
- Bloco de FAQ
- Bloco de prova de confiança (SLA, disponibilidade, suporte)
- Rodapé com termos e documentação

**CTAs principais:** `"Testar API de vistos grátis"` · `"Ver documentação"`

### 16.3 Mapa de Rotas

O mapa completo de rotas está centralizado na **§4.4.5** (visa.noro.guru) e **§4.4.6** (api.noro.guru).

#### visa.noro.guru — resumo

| Rota | Objetivo |
|---|---|
| `/` | Converter visitante em lead ou acesso gratuito |
| `/docs` | Entrada comercial da documentação |
| `/pricing` | Planos e limites gratuitos |
| `/sandbox` | Ambiente de testes guiado |
| `/countries` | Lista de países suportados |
| `/countries/[slug]` | Detalhes e requisitos por país |
| `/faq` | Perguntas frequentes — remove fricção |
| `/status` | Confiança operacional |
| `/changelog` | Histórico público de atualizações |

#### api.noro.guru — resumo

| Rota | Objetivo |
|---|---|
| `/` | Hub técnico — overview da API |
| `/quickstart` | Primeira chamada em menos de 5 minutos |
| `/reference` | Referência completa de endpoints |
| `/authentication` | Autenticação, chaves, tokens e escopos |
| `/rate-limits` | Limites por plano, janelas e erro 429 |
| `/versioning` | Política de versionamento e compatibilidade |
| `/webhooks` | Documentação de webhooks e payloads |
| `/sdk` | SDKs oficiais disponíveis |
| `/examples` | Exemplos por linguagem |
| `/changelog` | Breaking changes e histórico de versões |
| `/status` | Disponibilidade e incidentes da API |
| `/developers` | Hub do desenvolvedor autenticado |
| `/developers/apps` | Apps registrados e credenciais |
| `/developers/api-keys` | Criação, rotação e revogação de chaves |
| `/developers/usage` | Consumo, rate limit e métricas |
| `/developers/billing` | Billing do plano de API |
| `/developers/webhooks` | Endpoints registrados e logs de entrega |

### 16.4 Primeira Jornada da API

```
1. visa.noro.guru — entende a oferta gratuita
2. Clica em "Ver documentação" ou "Testar API"
3. api.noro.guru/quickstart — primeira integração
4. api.noro.guru/auth — cria chave de acesso
5. Faz a primeira chamada
6. Monitora status, limites e changelog
```

### 16.5 Eventos de Analytics (Visa API)

**Landing:** `visa_landing_viewed` · `visa_landing_cta_clicked` · `visa_pricing_viewed` · `visa_docs_viewed` · `visa_hero_viewed` · `visa_benefits_section_viewed`

**API:** `visa_api_docs_viewed` · `visa_api_key_created` · `visa_api_quickstart_viewed` · `visa_api_request_succeeded` · `visa_api_request_failed` · `visa_api_rate_limit_hit` · `visa_api_status_viewed` · `visa_api_changelog_viewed`

---

## 17. Cross-App Governance

### 17.1 Matriz Domínio → App (Fonte da Verdade)

| Domínio | App Owner | Escopo |
|---|---|---|
| Marketing, aquisição e conversão pública | **Web** | Home, pricing, institucional, ecossistema, suporte público, legais |
| Operação de tenant (CRM/ERP/Conteúdo/Custos) | **Core** | Leads, clientes, orçamentos, pedidos, financeiro operacional, conteúdo IA, custos, configurações do tenant |
| Governança da plataforma | **Control** | Orgs, tenants globais, planos, billing central, api-keys, webhooks, auditoria global |
| Entrega pública de sites | **Sites** | Renderização pública por slug e custom domain |

**Regra de conflito:** Se uma capacidade existir em mais de um app, prevalece a fonte da verdade. Apps secundários exibem apenas visão espelho ou redirecionamento.

### 17.2 Contrato de Navegação entre Subdominios

**Parâmetros obrigatórios no handoff:**
- `return_to`
- `source_app`
- `source_page`
- `tenant_id` (quando aplicável)
- `org_id` (quando aplicável)

**Jornada canônica de sites grátis:**
```
noro.guru/sites-gratis
  → app.noro.guru (registro/login)
  → app.noro.guru (tenant wizard)
  → app.noro.guru → sites.noro.guru (publicação)
  → [agencia-xyz].sites.noro.guru
```

### 17.3 Catálogo Único de Eventos

**Padrão:** `{app}_{modulo}_{acao}` onde `app` ∈ {`web`, `control`, `core`, `sites`, `visa`, `api`}

**Campos padrão em todos os apps:**
`event_name` · `timestamp_utc` · `app` · `source_type` · `user_id` · `role` · `org_id` · `tenant_id` · `source_page` · `success` · `error_code` · `latency_ms`

**Diretrizes de governança:**
- Dicionário único versionado para todos os apps
- Nenhum evento novo entra em produção sem owner e descrição de payload
- Alterações de schema exigem versionamento
- Todo evento automático declara `source_type = system | user | webhook`
- Eventos com sufixo `_detected` ou `_alert_triggered` devem explicitar o gatilho

### 17.4 Roles Canônicas

| Role Canônica | Mapeamento Local |
|---|---|
| `super_admin` | super_admin |
| `admin_operacional` | admin |
| `comercial` | operator (escopo comercial) |
| `suporte` | operator (escopo atendimento) |
| `marketing` | editor_conteudo |
| `financeiro` | financeiro |
| `viewer` | viewer |

**Ações canônicas:** `view` · `create` · `update` · `delete` · `manage` · `publish` (onde houver conteúdo)

### 17.5 Metas de SLO/SLA (Baseline)

| App | Disponibilidade | Latência p95 |
|---|---|---|
| `sites.noro.guru` | ≥ 99.9% mensal | ≤ 800ms |
| `api.noro.guru` | ≥ 99.9% mensal | ≤ 500ms |
| Core/Control (telas críticas) | — | ≤ 1200ms carregamento inicial |

**Taxa de erro 5xx em produção:** < 1% por rota crítica

**SLA interno:**
- Incidente crítico (P1): acknowledgement em até 15 min
- Incidente alto (P2): acknowledgement em até 30 min

---

## 18. Plano Mestre de Execução Integrada

### 18.1 Sequência Macro de Entrega

| Onda | Escopo | Saída Esperada |
|---|---|---|
| **0 — Fundação Transversal** | Contratos de eventos, matriz de permissões, handoff entre domínios, feature flags | Base comum sem retrabalho estrutural |
| **1 — Aquisição e Entrada** | Web com oferta sites grátis, Visa Landing com API de vistos gratuita | Funis de entrada operacionais e rastreáveis |
| **2 — Operação Core do Tenant** | Comercial (lead→pedido), financeiro operacional, billing do tenant | Operação fim a fim com estabilidade |
| **3 — Governança Central** | Control global (orgs, tenants, planos, auditoria), financeiro e billing da plataforma | Visão executiva e controle central |
| **4 — Entrega Pública e API** | Sites runtime com slug/subdomínio, api.noro.guru com docs e observabilidade | Canais públicos escaláveis e confiáveis |
| **5 — Otimização e Escala** | Performance, custo, confiabilidade, SLOs, redução de fricção UX | Operação pronta para crescimento sustentável |

### 18.2 Go/No-Go por Onda

**Gate mínimo (todas as ondas):**
- Build/lint/smoke test sem blocker
- Permissões validadas com teste de perfis cruzados
- Eventos críticos da onda capturados
- Checklist A11y AA concluído nas telas impactadas
- Plano de rollback documentado

**Gate adicional por contexto:**
- **Web:** Funil principal sem queda de conversão
- **Core:** Fluxo operacional principal sem regressão
- **Control:** Trilha de auditoria ativa para ações sensíveis
- **Sites:** Rotas públicas sem regressão de render, SEO básico e disponibilidade

### 18.3 Plano de Rollout

- Feature flags por app e por onda
- Rollout progressivo: time core → piloto controlado → expansão por cohort → liberação geral
- Rollback imediato por onda sem acionar rollback global

**Playbook mínimo de rollback:**
1. Desativar flag da onda
2. Revalidar fluxos críticos
3. Registrar incidente e causa raiz
4. Replanejar entrada da onda com hotfix

### 18.4 Plano de Redesign Agressivo com Stitch

**Princípio:** Substituir a espinha dorsal visual onde ela contamina a experiência. A sequência obrigatória é: **shell global → componentes base → páginas de maior impacto → páginas secundárias.**

#### Web — Regeneração Global (Alta Agressividade)
Regenerar: header público, navigation, hero framework, seções de prova social, blocos de benefícios e CTA, footer, grid de landing pages, sistema de cards públicos e pricing.

Primeiras páginas: `/` · `/sites-gratis` · `/pricing` · `/ecosystem` · `/contact`

*Objetivo:* Sair de site genérico para presença pública premium, clara e imediatamente reconhecível.

#### Core — Regeneração da Fundação (Médio-Alta)
Regenerar: shell autenticado completo, sidebar por grupos funcionais, topbar, page header, grid operacional, cards KPI, tabela padrão, formulário padrão, modal/drawer/sheet, estados empty/loading/error, badge semântico e filtros.

Primeiras páginas: `/` · `/leads` · `/clientes/[id]` · `/orcamentos` · `/pedidos/[id]` · `/financeiro` · `/core/financeiro/billing/overview`

*Objetivo:* Painel operacional denso, claro e confiável com aparência de produto maduro.

#### Control — Regeneração da Fundação Executiva (Médio-Alta)
Regenerar: shell de governança, sidebar executiva, topbar com contexto org/tenant, page header executivo, cards KPI de governança, tabela analítica de alta densidade, formulário administrativo, drawer de visão espelho, modais de confirmação crítica, blocos de auditoria e timeline.

Primeiras páginas: `/` · `/control/tenants` · `/control/orgs` · `/control/billing/overview` · `/control/financeiro/overview` · `/control/audit`

*Objetivo:* Painel de comando central com leitura rápida, alto contraste decisório e segurança perceptível.

#### Sites e Visa/API — Regeneração Focada
- **Sites:** Apenas fallback states, empty/notFound e metadata layer
- **Visa Landing:** Regeneração agressiva da landing comercial
- **API técnica:** Shell de docs e blocos técnicos reutilizáveis

#### Sequência Operacional de Geração com Stitch

1. Web global
2. Core shell + primitives
3. Control shell + primitives
4. Páginas principais do Core
5. Páginas principais do Control
6. Visa Landing
7. API técnica
8. Refinamentos de Sites

> **Regra:** Não abrir geração de páginas secundárias antes de aprovar shell, tabela, formulário, KPI e estados do app correspondente.

#### Definição de Sucesso do Redesign

O redesign só é bem-sucedido quando:
- O salto visual é perceptível sem depender de explicação técnica
- As telas principais parecem parte de um mesmo sistema
- Web comunica valor premium e conversão
- Core comunica produtividade operacional
- Control comunica governança e segurança
- Nenhuma tela nova viola ownership, permissões, tracking ou estados canônicos

### 18.5 Backlog Executável por Épicos

| Épico | Escopo |
|---|---|
| **A — Fundação de Governança** | Contratos globais, matriz de roles, catálogo único de eventos |
| **B — Funis Públicos de Entrada** | Web oferta sites grátis, Visa landing + docs entry, handoff para Core/API |
| **C — Operação Core do Tenant** | Comercial, financeiro, billing |
| **D — Control e Plataforma** | Governança central, financeiro plataforma, billing plataforma |
| **E — Canais Públicos de Entrega** | Sites runtime, api.noro.guru área técnica |
| **F — Confiabilidade e Escala** | Hardening, observabilidade, performance e custo |

### 18.6 Quadro de Owners

**Contexto:** Execução individual com apoio de IAs para produto, engenharia, design e operação.

**Owner único em todos os épicos:** Paulo

**Checklist mínimo de apoio por IA (antes de promover onda):**
- IA de produto: validar escopo, prioridade e critério de aceite
- IA técnica: validar arquitetura, contratos e riscos de implementação
- IA de design: validar hierarquia visual, UX e acessibilidade
- IA de operação: validar observabilidade, rollout e rollback

---

*Blueprint executivo do Noro Guru — versão consolidada.*
*Proprietário: Paulo Bolliger. Última revisão: 2026-05-24.*
