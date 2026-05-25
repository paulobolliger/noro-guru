# PROMPTS-WEB.md — Prompts Stitch para noro.guru

> App: `noro.guru` · Tema: **Dark** (neutral_dark) · Shell: Header público fixo + Footer
> Tokens de design, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> Especificação completa de cada página: ver [DESIGN-WEB.md](./DESIGN-WEB.md)

---

## SHELL GLOBAL (gerar primeiro)

### Header / Navbar

**Prompt Stitch:**
Crie o Header/Navbar do site noro.guru. Tema dark. Posição fixa com backdrop-blur e transição de transparente → sólido no scroll.

Estado inicial: background rgba(11,18,32,0.7) com backdrop-blur 20px.
Estado scroll (> 60px): background #0B1220 sólido, border-bottom 1px rgba(255,255,255,0.08), shadow sutil.

Elementos desktop (altura 64px, padding horizontal 80px):
- Esquerda: Logo Noro Guru (versão branca, 28px altura)
- Centro: nav links com gap 32px em Plus Jakarta Sans 15px texto #E0E3FF:
  - "Produto" (com ícone chevron-down, dropdown hover) — itens: Visão Geral, CRM & Pipeline, Financeiro, IA Operacional, Sites & Marketing, Atendimento
  - "Preços" (link direto → /pricing)
  - "Ecossistema" (dropdown) — itens: Web, Core, Control, Sites, Visa API, API Docs
  - "Sobre" (link direto → /sobre)
  - "Blog" (link direto → /blog)
- Direita: gap 16px:
  - Link "Entrar" → app.noro.guru/login — texto branco, sem borda
  - Botão "Começar grátis" — background #342CA4, hover #3B2CA4, texto branco, padding 10px 20px, border-radius 8px

Dropdown: bg #12152C, border rgba(255,255,255,0.08), border-radius 12px, shadow dark, itens com ícone + texto + descrição muted, hover bg rgba(255,255,255,0.05).

Mobile (< 768px): logo esquerda + botão hamburger direita. Drawer overlay bg #0B1220, nav em lista vertical, CTA buttons no final.

---

### Footer

**Prompt Stitch:**
Crie o Footer do site noro.guru. Background #12152C. Padding top 64px, bottom 32px.

Grid 4 colunas desktop (2 tablet, 1 mobile), gap 48px, padding horizontal 80px.

Coluna 1 — Marca:
Logo Noro Guru branco + tagline "O sistema operacional da agência moderna." em #B8C1E0, 14px. Ícones sociais: LinkedIn, Instagram, YouTube — círculos 32px bg rgba(255,255,255,0.08), hover bg #342CA4, ícones brancos.

Coluna 2 — "Produto" (heading #E0E3FF, 13px caps, margin-bottom 16px):
Links em #B8C1E0, 14px, hover branco: CRM & Pipeline, Financeiro & Billing, IA Operacional, Sites & Marketing, Atendimento Omnichannel.

Coluna 3 — "Empresa": Sobre Nós, Manifesto, Blog, Cases de Sucesso, Carreiras, Imprensa.

Coluna 4 — "Suporte & Legal": Central de Ajuda, Status da Plataforma, Política de Privacidade, Termos de Serviço, LGPD, Segurança.

Divider 1px rgba(255,255,255,0.08) acima do rodapé inferior.
Rodapé inferior: copyright esquerda + badges direita (chips dark: "LGPD Compliant", "Dados no Brasil 🇧🇷").

---

## LANDING & CONVERSÃO

### Home — `/`

**Prompt Stitch:**
Crie a página Home do site noro.guru. Tema dark completo. Header fixo + Footer. Background geral #0B1220.

**Seção 1 — Hero:**
Background: gradiente radial de #12152C → #0B1220 com grade sutil (linhas finas rgba(255,255,255,0.03)) e orbs de glow coloridos (roxo #342CA4 e teal #1DD3C0) nos cantos.

Conteúdo centralizado, padding top 160px (por causa do header), max-width 800px:
- Badge pill: "✦ Novo: IA Operacional v2 —" + link "Ver novidades →" em #1DD3C0, bg rgba(29,211,192,0.1), border rgba(29,211,192,0.3)
- H1 (Manrope 800, 64px, branco, line-height 1.1): "O sistema operacional" (branco) + " da agência moderna." (gradiente de #342CA4 para #1DD3C0)
- Subtítulo (Plus Jakarta Sans 18px, #B8C1E0, max-width 600px): "CRM, financeiro, atendimento, sites e IA em uma plataforma. Do lead ao cliente fidelizado."
- CTAs (gap 16px): botão primário "Começar gratuitamente" (#342CA4) + botão ghost "Ver demonstração" (border white 30%, texto branco)
- Social proof: "Mais de 800 agências já operam com o Noro" em muted, + logos de agências (grayscale)
- Hero visual: mockup dark do dashboard do Core em frame de browser, inclinado levemente (perspective), com glow roxo abaixo

**Seção 2 — Problema/Solução:**
Background #12152C. Título "Chega de ferramentas separadas." centrado, Manrope 700 40px.
3 colunas com cards antes/depois: ícone de X vermelho + situação atual (planilhas, WhatsApp no celular, etc.) → ícone check verde + solução Noro.

**Seção 3 — Os 5 Pilares:**
Background #0B1220. Título "Tudo que sua agência precisa." centralizado.
Tabs interativas: CRM & Pipeline | Financeiro | Atendimento | Sites & Marketing | IA Operacional.
Por tab: área esquerda com ícone + título + descrição + 3 bullets de features + CTA "Ver mais →"; área direita com screenshot do módulo em frame dark.

**Seção 4 — Social Proof:**
Background #12152C. 3 números grandes centralizados: "1.200+ agências" | "R$ 480M gerenciados" | "4.8★ satisfação".
Grid 3x2 de depoimentos: card dark, texto em itálico, foto + nome + cargo + agência.

**Seção CTA Final:**
Background gradiente #342CA4 → #232452. Título "Pronto para modernizar sua agência?" Manrope 700 40px branco.
Subtítulo branco muted. Botão "Começar gratuitamente" branco com texto #342CA4. Botão ghost "Falar com especialista" branco/transparente.

---

### Demo — `/demo`

**Prompt Stitch:**
Crie a página /demo do site noro.guru. Header dark + Footer. Background #0B1220.

Hero section: centralizado, padding 120px 80px.
Título "Agende sua demonstração" (Manrope 700, 48px, branco). Subtítulo "30 minutos para ver o Noro Guru em ação" (#B8C1E0).

Layout abaixo: 2 colunas iguais, max-width 1100px centralizado.

Coluna esquerda — Formulário (card dark bg #12152C, border rgba(255,255,255,0.08), border-radius 16px, padding 40px):
Campos dark (bg #1a1d35, border rgba(255,255,255,0.1), texto branco, placeholder muted):
- Nome completo
- E-mail corporativo
- WhatsApp (com flag BR)
- Nome da agência
- "Quantos consultores?" (select: 1-5 / 6-20 / 20+)
- "Principal desafio" (select: Organização / Financeiro / Geração de conteúdo / Atendimento / Crescimento)
Botão "Agendar demonstração" full-width #342CA4.

Coluna direita — Informativo:
"O que você vai ver" — lista com ícones check teal: Pipeline e CRM ao vivo, Geração de conteúdo com IA, Atendimento omnichannel, Dashboard financeiro, Publicação de site.
Depoimento de cliente (card dark menor): foto + nome + cargo + texto.
Nota muted: "Respondemos em até 24h · Sem compromisso".

---

### Pricing — `/pricing`

**Prompt Stitch:**
Crie a página de Preços do noro.guru. Header dark + Footer. Background #0B1220.

Hero: título "Planos Noro Guru" centralizado (Manrope 700, 48px). Toggle "Mensal / Anual" com pill indicator — badge "Economize 20%" ao lado do "Anual".

Grid de planos (4 cards, max-width 1200px):

Card padrão (bg #12152C, border rgba(255,255,255,0.08), border-radius 16px, padding 32px):
Por card: nome do plano (bold 20px), preço mensal (Manrope 700, 36px, branco) + "/mês", descrição muted, lista de features com ✓ verde, CTA "Começar grátis" (#342CA4 full-width).

Card "Profissional" (destaque com borda #342CA4 2px + badge "Mais popular" pill roxo no topo):
Visual diferenciado — fundo com glow roxo sutil atrás do card.

Card "Enterprise" (CTA diferente: "Falar com especialista" ghost).

Planos: Starter R$197/mês | Profissional R$397/mês | Agência R$697/mês | Enterprise Sob consulta.

Seção "Comparativo completo" abaixo: tabela dark com heading muted + checkmarks/X por feature/plano.

Seção FAQ: accordion dark, 6 perguntas sobre trial, cancelamento, cartão, migração.

CTA final: "Ainda em dúvida? Fale com um especialista" + botão → /demo.

---

### Blog — `/blog`

**Prompt Stitch:**
Crie a página do Blog noro.guru. Header dark + Footer. Background #0B1220.

Hero: "Blog Noro Guru" (Manrope 700, 48px, branco). Subtítulo "Conteúdo para agências modernas" (#B8C1E0). Input de busca dark centralizado abaixo.

Post em destaque (card grande dark, border-radius 16px, bg #12152C):
Layout 2 colunas: imagem grande esquerda (60%) + conteúdo direito (40%) com padding 32px.
Badge categoria (pill), Título H2 (Manrope 700, 28px), resumo 3 linhas, avatar autor + nome + data + "8 min leitura", botão "Ler artigo →" (#1DD3C0, ghost).

Grid de posts (3 colunas, gap 24px):
Card dark por post: imagem thumbnail (border-radius 12px topo), badge categoria, título bold 18px, resumo 2 linhas, rodapé com avatar + nome + data + tempo de leitura.

Sidebar direita (desktop, 280px): filtro por categoria (chips), "Posts mais lidos" (lista), CTA newsletter (bg #12152C, campo email + botão "Assinar").

---

## INSTITUCIONAL

### Sobre — `/sobre`

**Prompt Stitch:**
Crie a página /sobre do noro.guru. Header dark + Footer. Background #0B1220.

Hero: background #12152C, padding 120px 80px centralizado.
Título "Nossa missão" (Manrope 700, 56px, branco). Subtítulo muted "Construímos o sistema operacional das agências de turismo modernas."
Foto editorial da equipe ou ilustração (placeholder 800x400px com overlay gradiente dark).

Seção "Por que criamos o Noro Guru":
Layout texto esquerda (55%) + imagem direita (45%).
Texto narrativo em Plus Jakarta Sans 18px #D1D5F0 sobre o problema que viram no mercado.

Seção "Missão / Visão / Valores" — 3 cards dark (bg #12152C, border, icon colorido):
- Missão: ícone Target (#342CA4)
- Visão: ícone Eye (#1DD3C0)
- Valores: ícone Heart (#D4AF37)

Seção "Time":
Grid 4 colunas de cards: foto circular + nome (bold) + cargo (muted) + LinkedIn ícone.

Seção "Números" (centralizado, bg #12152C):
3 números grandes (Manrope 800, 56px) lado a lado: "1.200+" agências / "5 apps" no ecossistema / "Desde 2023".

CTA final: "Conheça nossa plataforma →" botão ghost dark.

---

### Changelog — `/changelog`

**Prompt Stitch:**
Crie a página /changelog do noro.guru. Header dark + Footer. Background #0B1220.

PageHeader centralizado: "O que há de novo no Noro Guru" (Manrope 700, 48px). Subtítulo. RSS link e "Assinar por email" (ghost button).

Filtros: chips de tipo (todos / Nova funcionalidade / Melhoria / Correção / Breaking) + chips de app (Core / Control / Sites / Visa / API).

Timeline vertical (max-width 760px centralizado):
Por entrada:
- Data à esquerda (muted, 13px mono)
- Linha vertical conectora (#342CA4 muted)
- Card dark (bg #12152C, border-radius 12px, padding 24px) contendo:
  - Topo: badge versão (ex: v2.4.0, pill dark com borda) + badge tipo (cor por tipo: azul/verde/amarelo/vermelho)
  - Título bold branco
  - Descrição em markdown renderizado (#D1D5F0)
  - Apps afetados: chips de app (Core/Control/Sites/API) no rodapé do card

---

## CONFIANÇA & LEGAL

### Status — `/status`

**Prompt Stitch:**
Crie a página /status do noro.guru. Header dark + Footer. Background #0B1220.

Banner de status global no topo (full-width): "● Todos os sistemas operacionais" — background verde escuro, texto branco, padding 16px, ícone check-circle.

Grid de serviços (2 colunas, max-width 900px centralizado):
Por card dark: ícone do serviço + nome + badge ● status (Operacional/Degradado/Outage) + "Uptime 30 dias: 99.98%".
Serviços: Core App, API, Autenticação, Sites CDN, Email, Pagamentos.

Seção "Uptime histórico (90 dias)":
Por serviço: barra de minicalendário (90 células coloridas: verde = ok, amarelo = degradado, vermelho = outage). Tooltip ao hover com data e status.

Seção "Incidentes recentes":
Lista de cards dark: data, título, badge impacto, status badge (Resolvido = verde / Monitorando = amarelo / Investigando = vermelho), link "Ver detalhes".

CTA: "Assinar atualizações" — campo email + botão "Assinar", ou link RSS.

---

### Privacy Policy, Terms, LGPD, Segurança, SLA

**Prompt Stitch (template reutilizável para todas as páginas legais):**
Crie a página [NOME] do noro.guru (ex: Política de Privacidade). Header dark mínimo (logo + link "Voltar") + Footer mínimo. Background #0B1220.

Layout: max-width 760px centralizado, padding 80px 24px.

Header da página: título (Manrope 700, 40px, branco) + "Última atualização: [data]" (muted 14px).

TOC (tabela de conteúdo) no topo: lista numerada de seções clicáveis, fundo #12152C, border-radius 12px, padding 24px.

Conteúdo: markdown renderizado em Plus Jakarta Sans 16px, #D1D5F0, line-height 1.8.
- H2 de seção: Manrope 600, 22px, branco, border-bottom 1px rgba(255,255,255,0.08), margin bottom 16px
- H3: 18px, branco
- Listas, tabelas com estilo dark
- Links em #1DD3C0

---

## ECOSSISTEMA

### Ecossistema — `/ecossistema`

**Prompt Stitch:**
Crie a página /ecossistema do noro.guru. Header dark + Footer. Background #0B1220.

Hero centralizado: "O ecossistema Noro Guru" (Manrope 700, 56px). Subtítulo muted "Seis apps. Um sistema operacional completo."

Diagrama visual de ecossistema:
Representação visual dos 6 apps em hexágonos ou círculos conectados por linhas — Noro logo no centro, apps ao redor: Web / Core / Control / Sites / Visa / API. Linhas de conexão com labels muted. Tema dark com glow roxo.

Grid de apps abaixo (2 linhas x 3 colunas, cards dark):
Por card (bg #12152C, border, border-radius 16px, padding 28px, hover: borda #342CA4 + leve lift):
- Ícone grande do app (56px)
- Nome do app bold (Manrope 700, 20px)
- URL em mono muted (ex: app.noro.guru)
- Descrição curta (2 linhas)
- Chips de público (Agência / Admin Noro / Developer / Visitante)
- Link "Saiba mais →" em #1DD3C0

---

*Documento gerado em: 2026-05-24 · Versão: 1.0*
*Para especificação completa de cada tela, consulte [DESIGN-WEB.md](./DESIGN-WEB.md)*
