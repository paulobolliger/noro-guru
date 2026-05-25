# DESIGN-WEB.md — Especificação Completa do Web (Site Público)

> App: `noro.guru` · Owner: Plataforma (Marketing/Vendas) · Tema: Dark (neutral_dark + text_dark_theme)
> Referência de tokens, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> **Público:** Visitantes, prospects, agências de turismo interessadas no Noro Guru.

---

## ÍNDICE

1. [Componentes Globais do Shell](#1-componentes-globais-do-shell)
2. [Fluxos de Navegação Principais](#2-fluxos-de-navegação-principais)
3. [Landing & Conversão — Páginas Principais](#3-landing--conversão--páginas-principais)
4. [Landing & Conversão — Produto](#4-landing--conversão--produto)
5. [Landing & Conversão — Preços & Onboarding](#5-landing--conversão--preços--onboarding)
6. [Institucional](#6-institucional)
7. [Confiança & Legal](#7-confiança--legal)
8. [Ecossistema](#8-ecossistema)

---

## 1. Componentes Globais do Shell

Estes componentes existem em todas as páginas públicas do site noro.guru.

### 1.1 Header / Navbar

**Posição:** Topo fixo com `backdrop-blur` e leve transparência que se opacifica no scroll.

**Tema:** Dark — background `noro_dark` com border-bottom sutil em scroll.

**Elementos (desktop):**
- Logo Noro Guru (esquerda) — clicável → `/`
- Navegação central (links):
  - Produto (dropdown: Visão Geral, CRM & Pipeline, Financeiro, IA Operacional, Sites & Marketing, Atendimento)
  - Preços → `/pricing`
  - Ecossistema (dropdown: Web, Core, Control, Sites, Visa API, API Docs)
  - Sobre → `/sobre`
  - Blog → `/blog`
- CTA área (direita):
  - Link "Entrar" → `app.noro.guru/login`
  - Botão primário "Começar grátis" → `/cadastro` (ou `app.noro.guru/cadastro`)

**Mobile (< 768px):**
- Logo esquerda + botão hamburger direita
- Menu drawer overlay com todos os links em lista vertical
- CTA buttons no final do drawer

**Comportamento:**
- Em scroll > 60px: background opaco, shadow sutil
- Item ativo: sublinhado ou indicador visual
- Dropdown: abre em hover (desktop) / tap (mobile)

---

### 1.2 Footer

**Posição:** Rodapé de todas as páginas. Background `noro_dark_purple`, texto `text_dark_theme.muted`.

**Estrutura em grid (4 colunas desktop, 2 tablet, 1 mobile):**

**Coluna 1 — Marca:**
- Logo Noro Guru
- Tagline: "O sistema operacional da agência moderna."
- Links sociais (LinkedIn, Instagram, YouTube) com ícones

**Coluna 2 — Produto:**
- CRM & Pipeline
- Financeiro & Billing
- IA Operacional
- Sites & Marketing
- Atendimento Omnichannel

**Coluna 3 — Empresa:**
- Sobre Nós → `/sobre`
- Manifesto → `/manifesto`
- Blog → `/blog`
- Cases de Sucesso → `/case-studies`
- Carreiras → `/careers`
- Imprensa → `/press`

**Coluna 4 — Suporte & Legal:**
- Central de Ajuda (link externo)
- Status da Plataforma → `/status`
- Política de Privacidade → `/privacy-policy`
- Termos de Serviço → `/terms-of-service`
- LGPD → `/lgpd`
- Segurança → `/security`

**Linha inferior:**
- Copyright: "© 2024–2026 Noro Guru. Todos os direitos reservados."
- Badges: "LGPD Compliant" | "SOC2 em progresso" | "Dados no Brasil 🇧🇷"

---

### 1.3 Seção CTA Global (reutilizável)

Componente de seção final em todas as páginas de conversão:
- Background gradiente `noro_primary` → `noro_dark_purple`
- Título grande: "Pronto para modernizar sua agência?"
- Subtítulo
- Botão primário: "Começar gratuitamente" → `/cadastro`
- Botão secundário ghost: "Falar com especialista" → `/demo`
- Social proof: "Mais de X agências já operam com o Noro Guru"

---

### 1.4 Cookie Banner

- Aparece na primeira visita (bottom da tela)
- Texto: "Usamos cookies para melhorar sua experiência."
- Botões: "Aceitar todos" | "Personalizar" | "Recusar não essenciais"
- Link → `/cookies`
- Persiste preferência em localStorage

---

### 1.5 SEO & Meta Global

- `<title>` dinâmico por página
- `og:title`, `og:description`, `og:image` configurados por página
- Structured data (JSON-LD): `Organization`, `Product`, `FAQPage` onde aplicável
- Canonical URLs configuradas
- hreflang: pt-BR (idioma único por enquanto)

---

## 2. Fluxos de Navegação Principais

### 2.1 Fluxo de Conversão Principal

```
/ (home) → /features (ou seção) → /pricing → /cadastro → app.noro.guru/onboarding
```

### 2.2 Fluxo Demo / Sales

```
/ ou /pricing → /demo → formulário → confirmação de agendamento → email com link
```

### 2.3 Fluxo de Conteúdo / SEO

```
/blog → /blog/[slug] → sidebar CTA → /cadastro
/case-studies → /case-studies/[slug] → CTA → /demo ou /cadastro
```

### 2.4 Fluxo Ecossistema (Developers/Partners)

```
/ecossistema → /ecossistema/api → api.noro.guru/docs
/ecossistema → /ecossistema/parceiros → /partners
/ecossistema → /ecossistema/afiliados → /affiliate
```

---

## 3. Landing & Conversão — Páginas Principais

### 3.1 `/` — Home

**Objetivo:** Primeira impressão — comunicar o que é o Noro Guru, para quem é, por que é diferente e converter visitantes.

**Estrutura de seções (scroll vertical):**

**Hero Section:**
- Background: gradiente escuro com partículas/grade sutil (animação leve)
- Badge: "Novo: IA Operacional v2 →"
- Título H1 (Manrope 700, grande): "O sistema operacional da agência moderna."
- Subtítulo: "CRM, financeiro, atendimento, sites e IA em uma plataforma. Do lead ao cliente fidelizado."
- CTA primário: "Começar gratuitamente" → `/cadastro`
- CTA secundário ghost: "Ver demonstração" → `/demo`
- Social proof inline: logos de agências clientes + "X agências ativas"
- Imagem/mockup: screenshot do dashboard do Core (tema light, cuidado editorial)

**Seção Problema/Solução:**
- 3 colunas: Antes (dor) vs Depois (com Noro)
- Ícones + texto curto

**Seção Os 5 Pilares:**
- Tabs ou cards animados: CRM & Pipeline / Financeiro / Atendimento / Sites & Marketing / IA Operacional
- Por pilar: ícone, título, descrição curta, screenshot ilustrativo

**Seção Social Proof:**
- Números: "X agências" / "Y orçamentos gerados" / "Z em receita gerenciada"
- Depoimentos (carousel ou grid): foto, nome, cargo, agência, texto
- Logos de agências parceiras

**Seção "Como funciona":**
- Passo a passo 3-4 steps com ícone + número + descrição
- Animação de progressão ao scroll

**Seção Integração/Ecossistema:**
- Logos de integrações disponíveis (WhatsApp, Gmail, Google Calendar, Stripe, Asaas, etc.)

**Seção CTA Final:**
- Componente global `<CTASection />`

**Conexões:**
- Cada pilar → `/features#[pilar]` ou página específica
- "Começar grátis" → `/cadastro` → `app.noro.guru/onboarding`
- "Ver demo" → `/demo`

**Estados:** SSG (static generation), hidratação leve para animações.

---

### 3.2 `/demo`

**Objetivo:** Capturar leads qualificados para demo com o time de vendas.

**Elementos:**
- Header: "Agende sua demonstração"
- Subtítulo: "30 minutos para ver o Noro Guru em ação"
- Formulário (lado esquerdo):
  - Nome completo
  - Email corporativo
  - WhatsApp
  - Nome da agência
  - Quantidade de consultores (select: 1-5 / 6-20 / 20+)
  - Principal desafio (select: organização, financeiro, geração de conteúdo, atendimento, crescimento)
  - Botão "Agendar demonstração"
- Lado direito (informativo):
  - "O que você vai ver": lista com 4-5 bullets
  - Depoimento de cliente
  - "Respondemos em até 24h"

**Conexões:**
- Submit → confirmação inline + email automático
- Após conversão: exibe calendário de agendamento (Calendly embed ou nativo)

**Estados:** formulário / enviado (success) / erro de envio

---

### 3.3 `/blog`

**Objetivo:** Hub de conteúdo editorial para SEO, educação de mercado e nutrição de leads.

**Elementos:**

**Hero do blog:**
- Título "Blog Noro Guru"
- Subtítulo: "Conteúdo para agências modernas"
- Input de busca por artigo

**Post em destaque:**
- Card grande: imagem, categoria badge, título, resumo, autor, data, CTA "Ler mais"

**Grid de posts recentes:**
- Cards: imagem thumbnail, categoria, título, resumo (2 linhas), autor avatar + nome, data, tempo de leitura
- Paginação ou "Carregar mais"

**Sidebar (desktop):**
- Filtro por categoria (chips)
- Posts mais lidos
- CTA newsletter: "Receba dicas semanais" → campo email + botão

**Conexões:**
- Card → `/blog/[slug]`

---

### 3.4 `/blog/[slug]`

**Objetivo:** Artigo individual otimizado para leitura e conversão.

**Elementos:**
- Breadcrumb: Blog → [Categoria] → [Título]
- Header do artigo: categoria badge, título H1, resumo, autor (foto + nome + data + tempo de leitura)
- Imagem de destaque (hero image)
- Conteúdo: markdown renderizado com tipografia editorial
- Sidebar direita (sticky em desktop): tabela de conteúdo (TOC), CTA conversão
- Seção autor: foto, bio, links
- Posts relacionados (grid 3 cards)
- CTA final: newsletter ou "Começar grátis"

**SEO:**
- JSON-LD `Article`
- og:image dinâmico
- Canonical

---

## 4. Landing & Conversão — Produto

### 4.1 `/features`

**Objetivo:** Overview completo de todas as funcionalidades do Noro Guru, organizado pelos 5 pilares.

**Elementos:**

**Hero:**
- Título: "Tudo que sua agência precisa. Em um só lugar."
- Subtítulo breve
- Tabs dos 5 pilares como âncoras

**Seção por pilar (repetida 5x):**
- ID de âncora para deep link (`#crm`, `#financeiro`, etc.)
- Ícone + nome do pilar
- Título e descrição do pilar
- Grid de funcionalidades (cards 3 colunas): ícone, nome, descrição curta
- Screenshot ou mockup do módulo (alternância esquerda/direita por pilar)

**CTA final:**
- `<CTASection />`

---

### 4.2 `/features/crm`

**Objetivo:** Landing page dedicada ao pilar CRM & Pipeline.

**Elementos:**
- Hero com mockup do Pipeline/Kanban
- Benefícios específicos: "Do lead ao cliente em um funil visual"
- Features: lead capture, pipeline kanban, hub 360° do cliente, orçamentos com IA, follow-up automático
- Casos de uso: "Veja como a [Agência X] aumentou a conversão em Y%"
- FAQ específico do CRM
- CTA → `/cadastro` ou `/demo`

---

### 4.3 `/features/financeiro`

**Objetivo:** Landing page do pilar Financeiro & Billing.

**Elementos:**
- Hero com mockup de fluxo de caixa
- Features: contas a receber/pagar, fluxo de caixa, conciliação, relatórios, billing de clientes, gateways
- Diferencial: "Financeiro integrado ao CRM — sem planilhas"
- FAQ
- CTA

---

### 4.4 `/features/ia`

**Objetivo:** Landing page do pilar IA Operacional.

**Elementos:**
- Hero com animação de geração de conteúdo
- Features: geração de roteiros de viagem, conteúdo para redes, chatbot de atendimento, sugestões de orçamento
- "Economize X horas por semana com IA"
- Demo interativo (opcional): geração ao vivo de um roteiro de viagem
- Benchmarks de custo de IA vs produtividade
- CTA

---

### 4.5 `/features/sites`

**Objetivo:** Landing page do pilar Sites & Marketing.

**Elementos:**
- Hero com showcase de sites gerados
- Features: builder de site de agência, blog integrado, SEO automático, domínio customizado, publicação em 1 clique
- "Seu site de agência, pronto em minutos"
- Galeria de templates
- CTA

---

### 4.6 `/features/atendimento`

**Objetivo:** Landing page do pilar Atendimento Omnichannel.

**Elementos:**
- Hero com mockup do workspace de comunicação
- Features: inbox unificado (WhatsApp, email, chat), chatbot IA, SLA, tickets de suporte, histórico completo
- "Nunca perca uma mensagem de cliente"
- CTA

---

### 4.7 `/partners`

**Objetivo:** Programa de parceiros e integradores do Noro Guru.

**Elementos:**
- Hero: "Seja um parceiro Noro"
- Tipos de parceria: Revendedor, Integrador, Afiliado, Influenciador
- Por tipo: benefícios, comissão, suporte dedicado
- Formulário de candidatura: nome, empresa, tipo de parceria, site, mensagem
- Logos de parceiros existentes
- FAQ sobre o programa
- CTA "Candidatar-se"

**Conexões:**
- Afiliados → `/affiliate`

---

### 4.8 `/affiliate`

**Objetivo:** Programa de afiliados com tracking de indicações e comissões.

**Elementos:**
- Hero: "Indique o Noro Guru. Ganhe comissão recorrente."
- Como funciona: 3 passos (cadastro, link, ganhe)
- Tabela de comissões por plano indicado
- Benefícios: comissão recorrente mensal, painel de acompanhamento, suporte
- Formulário de inscrição: nome, email, canal (site/redes/WhatsApp/email)
- FAQ: pagamento, rastreamento, elegibilidade
- CTA "Tornar-se Afiliado"

---

## 5. Landing & Conversão — Preços & Onboarding

### 5.1 `/pricing`

**Objetivo:** Apresentar planos e preços de forma clara para converter visitantes em trial.

**Elementos:**

**Header:**
- Título "Planos Noro Guru"
- Toggle: Mensal / Anual (com desconto %, ex: "Economize 20% no anual")

**Grid de planos (cards, 3-4 colunas):**
Por card:
- Nome do plano (ex: Starter, Profissional, Agência, Enterprise)
- Badge "Mais popular" (no plano recomendado)
- Preço mensal (muda com toggle)
- Preço anual equivalente por mês
- Descrição: "Para agências de até X consultores"
- Lista de features incluídas (checkmarks)
- CTA: "Começar grátis" ou "Falar com especialista" (Enterprise)

**Seção: Comparativo completo de features**
- Tabela com todas as features por linha, planos por coluna
- Checkmarks, X, ou valor específico (ex: "Até 10 usuários")

**Seção: FAQ de Preços**
- 5-8 perguntas comuns: trial, cartão, cancelamento, migração de dados, suporte incluído

**Seção: "Ainda em dúvida?"**
- CTA para demo → `/demo`

**Conexões:**
- "Começar grátis" → `app.noro.guru/cadastro?plano=[slug]`
- "Falar com especialista" → `/demo`

---

### 5.2 `/cadastro`

**Objetivo:** Formulário de criação de conta (pode redirecionar para `app.noro.guru/cadastro`).

**Nota:** Esta rota no Web serve como entry point de marketing; o processamento real ocorre no Core.

**Elementos:**
- Se rota própria no Web: formulário de pré-cadastro com campos básicos (nome, email, agência, plano) → redirect para Core
- Se redirect direto: 301 para `app.noro.guru/cadastro`

---

## 6. Institucional

### 6.1 `/sobre`

**Objetivo:** História, missão, visão e time da Noro — construir confiança e conexão emocional.

**Elementos:**
- Hero: título "Nossa missão" + foto editorial da equipe ou ilustração
- Seção: "Por que criamos o Noro Guru" — texto narrativo, fundadores, problema que resolvemos
- Seção: Missão / Visão / Valores (3 cards)
- Seção: Timeline da empresa (marcos importantes)
- Seção: Time (fotos, nomes, cargos — grid)
- Seção: Números (agências, países, anos de operação)
- CTA final: "Conheça nossa plataforma" → `/features`

---

### 6.2 `/manifesto`

**Objetivo:** Declaração de princípios do produto e da empresa — tom editorial forte.

**Elementos:**
- Sem header/footer normal — shell minimalista ou formato especial
- Título: "Manifesto Noro Guru" (ou título editorial livre)
- Texto longo em formato ensaio (Manrope, tamanho generoso, fundo escuro)
- Sem CTAs agressivos — talvez apenas link sutil no final
- Compartilhável (og:image especial)

---

### 6.3 `/case-studies`

**Objetivo:** Hub de casos de sucesso de agências usando o Noro Guru.

**Elementos:**
- Hero: "Cases de Sucesso"
- Filtros: por pilar utilizado, tamanho da agência, segmento
- Grid de cards: foto da agência/cliente, nome, badge de segmento, título do resultado, KPI destaque (ex: "+40% conversão")
- CTA: "Ler case" → `/case-studies/[slug]`

---

### 6.4 `/case-studies/[slug]`

**Objetivo:** Case de sucesso detalhado de uma agência.

**Elementos:**
- Hero: logo da agência + foto + título ("Como a [Agência] cresceu 40% com o Noro")
- Sidebar esquerda (sticky): navegação por seções do case
- Seções: Contexto → Desafio → Solução (quais pilares usou) → Resultados → Depoimento
- KPIs em destaque: cards com números grandes
- "Módulos utilizados": badges dos pilares
- Depoimento em destaque do decisor
- CTA: "Quero resultado similar" → `/demo`

---

### 6.5 `/changelog`

**Objetivo:** Registro público de updates e novidades da plataforma, alimentado pelo Control.

**Elementos:**
- Header: "O que há de novo no Noro Guru"
- Timeline vertical de entradas:
  - Data + versão badge
  - Tipo badge (Nova funcionalidade / Melhoria / Correção / Breaking change)
  - Título + descrição (markdown)
  - App(s) afetado(s) em chips
- Filtros: por tipo, por app, por período
- RSS feed link

**Conexões:**
- Alimentado pelas entradas criadas em `/control/changelog`

---

### 6.6 `/careers`

**Objetivo:** Atrair talentos para o time Noro.

**Elementos:**
- Hero: "Construa o futuro das agências conosco"
- Seção: cultura, valores, benefícios (ícones + texto)
- Lista de vagas abertas (por área: Engenharia, Produto, Comercial, Customer Success)
  - Por vaga: título, área, tipo (remoto/híbrido), nível, botão "Ver vaga"
- Vaga detalhada (modal ou página): descrição, responsabilidades, requisitos, como se candidatar
- Se sem vagas: "Não temos vagas abertas agora, mas envie seu currículo"

---

### 6.7 `/press`

**Objetivo:** Recursos para imprensa — kit de mídia, releases, contato.

**Elementos:**
- Header: "Imprensa & Mídia"
- Seção: "Sobre o Noro Guru" — parágrafo boilerplate para press
- Download: Kit de Mídia (logo em alta, brand guidelines, fotos da equipe) — botão de download
- Cobertura de imprensa: lista de matérias publicadas (data, veículo, título, link)
- Contato de assessoria: email e/ou formulário específico

---

## 7. Confiança & Legal

### 7.1 `/privacy-policy`

**Objetivo:** Política de privacidade completa — LGPD e GDPR.

**Elementos:**
- Shell mínimo (header + footer simplificados)
- Breadcrumb
- Data de última atualização
- Índice de seções (TOC navegável)
- Conteúdo legal em markdown renderizado
- Linguagem: PT-BR, com termos técnicos explicados

---

### 7.2 `/terms-of-service`

**Objetivo:** Termos de uso do serviço.

**Elementos:**
- Mesma estrutura da `/privacy-policy`
- Seção especial: tabela de SLAs (se aplicável) com link para `/sla`

---

### 7.3 `/cookies`

**Objetivo:** Política de cookies com controle granular.

**Elementos:**
- Explicação de tipos de cookies (essenciais, funcionais, analytics, marketing)
- Tabela de cookies por tipo (nome, finalidade, duração, provider)
- Botão "Gerenciar preferências" → abre o mesmo modal do Cookie Banner

---

### 7.4 `/lgpd`

**Objetivo:** Página dedicada à conformidade com a LGPD brasileira.

**Elementos:**
- Explicação dos direitos do titular (acesso, correção, exclusão, portabilidade)
- Como exercer seus direitos: email de contato do DPO
- Formulário de solicitação: tipo de solicitação (select), email, descrição, CPF (opcional)
- Base legal das operações de dados
- Contato do encarregado de dados (DPO)

---

### 7.5 `/security`

**Objetivo:** Comunicar as práticas de segurança da plataforma.

**Elementos:**
- Seções: Infraestrutura, Criptografia, Controle de Acesso, Testes de Segurança, Compliance
- Badges: "SOC2 Type II" (quando aplicável), "LGPD", "Dados no Brasil"
- Programa de Bug Bounty (se existir): link para plataforma ou contato
- Contato: `security@noro.guru`

---

### 7.6 `/status`

**Objetivo:** Status em tempo real dos serviços públicos do Noro Guru.

**Elementos:**
- Status atual: "Todos os sistemas operacionais" (verde) ou estado de incidente
- Grid de serviços: Core App, API, Sites CDN, Autenticação, Email, Pagamentos
  - Por serviço: badge (operacional / degradado / outage)
- Uptime histórico (últimos 90 dias) — barra de calendário colorida
- Incidentes recentes: lista com data, título, impacto, resolução
- Assinar atualizações: campo de email ou RSS

**Nota técnica:** Pode ser alimentado pelo `/control/observabilidade/status` via API ou ser um serviço separado (ex: Statuspage).

---

### 7.7 `/sla`

**Objetivo:** Acordo de Nível de Serviço — uptime garantido, tempos de resposta, créditos.

**Elementos:**
- Tabela: plano × SLA de uptime × tempo de resposta de suporte × crédito por downtime
- Definições (o que conta como downtime, janelas de manutenção)
- Como solicitar crédito de SLA

---

## 8. Ecossistema

### 8.1 `/ecossistema`

**Objetivo:** Overview de todos os apps do ecossistema Noro — para parceiros técnicos, developers e prospects sofisticados.

**Elementos:**
- Hero: "O ecossistema Noro Guru" + diagrama visual dos 6 apps e suas conexões
- Grid de apps (cards 3×2):
  - Ícone + nome do app + URL
  - Descrição de 1 linha
  - Públicos-alvo (badge: Agência / Admin Noro / Visitante / Developer)
  - Link "Saiba mais" → subpágina

---

### 8.2 `/ecossistema/core`

**Objetivo:** Apresentar o Core app (app.noro.guru) para prospects e decisores.

**Elementos:**
- Hero: "app.noro.guru — O painel operacional da sua agência"
- Overview de funcionalidades principais
- Screenshots principais
- "Quem usa: Equipe da agência (comercial, financeiro, atendimento)"
- CTA: "Começar no Core" → `/cadastro`

---

### 8.3 `/ecossistema/control`

**Objetivo:** Apresentar o Control para parceiros, agências enterprise e stakeholders técnicos.

**Elementos:**
- "admin.noro.guru — Painel de administração da plataforma"
- Explicação do modelo multi-tenant
- Casos de uso: agências holding, franquias, grupos
- "Acesso restrito — contate a equipe Noro"

---

### 8.4 `/ecossistema/sites`

**Objetivo:** Apresentar o módulo Sites para prospects focados em marketing digital.

**Elementos:**
- "sites.noro.guru — Sites profissionais para agências"
- Showcase de templates e sites publicados
- Features: blog, SEO, domínio próprio, galeria de destinos
- CTA: "Publicar meu site" → Core `/meu-site`

---

### 8.5 `/ecossistema/visa-api`

**Objetivo:** Apresentar a Visa API para parceiros técnicos e agências de vistos.

**Elementos:**
- "visa.noro.guru — API de consultas de vistos"
- Overview das capacidades: checklist de requisitos, países suportados, webhooks
- Pricing de API
- "Para developers" — link para docs
- CTA: "Ver documentação" → `api.noro.guru`

---

### 8.6 `/ecossistema/parceiros`

**Objetivo:** Redirecionamento/complemento para a página de parceiros.

**Elementos:**
- Overview do programa de parceiros
- CTA → `/partners` (ou conteúdo redundante integrado)

---

*Documento gerado em: 2026-05-24 · Versão: 1.0 · App: noro.guru*
