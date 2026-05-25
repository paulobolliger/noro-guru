# PROMPTS-CONTROL.md — Prompts Stitch para admin.noro.guru

> App: `admin.noro.guru` · Tema: **Dark** (neutral_dark) · Shell: Sidebar dark + Topbar dark
> Tokens de design, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> Especificação completa de cada página: ver [DESIGN-CONTROL.md](./DESIGN-CONTROL.md)

---

## SHELL GLOBAL (gerar primeiro)

### Shell — Sidebar Dark (Control)

**Prompt Stitch:**
Crie o componente Sidebar do app admin.noro.guru (Control). Tema dark. Background #12152C (noro_dark_purple), texto branco/muted.

Largura 240px expandida, 56px collapsed.

Topo: Logo Noro Guru branco + badge "Control" em dourado (#D4AF37), padding 20px.
Sem TenantSelector (painel global de plataforma).

Grupos de navegação com label de seção em caps 11px muted #B8C1E0:
- VISÃO GERAL: ícone BarChart2 + "Dashboard"
- ORGS & TENANTS: ícone Building2 + "Organizações", ícone Layers + "Tenants"
- USUÁRIOS: ícone Users + "Usuários do Control"
- MONETIZAÇÃO: ícone CreditCard + "Planos", ícone RefreshCw + "Subscriptions", ícone FileText + "Invoices"
- OPERAÇÕES: ícone Eye + "Impersonation", ícone Flag + "Feature Flags", ícone Layout + "Templates"
- INTEGRAÇÕES: ícone Plug + "Integrações", ícone Webhook + "Webhooks", ícone Globe + "Domínios"
- OBSERVABILIDADE: ícone Activity + "Status", ícone TrendingUp + "Métricas", ícone Bell + "Alertas", ícone AlertTriangle + "Erros"
- PLATAFORMA: ícone Settings + "Configurações", ícone BookOpen + "Changelog", ícone Package + "Releases", ícone Shield + "Audit Log"

Item ativo: background rgba(212,175,55,0.15), borda esquerda 3px solid #D4AF37, texto #D4AF37.
Rodapé: avatar + nome do admin + badge "Super Admin" em dourado + ícone de sair.

---

### Shell — Topbar Dark (Control)

**Prompt Stitch:**
Crie o componente Topbar do app admin.noro.guru. Tema dark. Background #12152C, border-bottom 1px rgba(255,255,255,0.08), altura 56px.

Esquerda para direita:
- Botão hamburger (tablet/mobile)
- Breadcrumb dark: ícone home → setas → itens, textos em #B8C1E0, último item bold #FFFFFF
- ContextBadge (condicional, só aparece quando em contexto de org/tenant): chip background #2B2E48 com nome da entidade + "×" para sair do contexto
- Flex grow
- Busca global: input dark, bg #2B2E48, border rgba(255,255,255,0.1), placeholder "Buscar org, tenant, usuário..." em muted
- Badge de alertas críticos: ícone AlertTriangle vermelho com contagem
- Avatar do admin + dropdown dark

---

## AUTENTICAÇÃO

### Login do Control

**Rota:** `/control/login`
**Prompt Stitch:**
Crie a tela de login do admin.noro.guru. Tema dark completo. Background #0B1220 (noro_dark). Sem sidebar.

Layout: tela centralizada com card vertical ao centro, max-width 420px.

Card background #12152C, border 1px rgba(255,255,255,0.08), border-radius 16px, padding 48px.

Topo do card: logo Noro Guru branco + badge "Control" dourado (#D4AF37), centralizado.

Alerta de segurança: banner amarelo muted — "Área restrita — acesso monitorado e auditado" com ícone Shield.

Campos:
- "E-mail" — input dark bg #2B2E48, border rgba(255,255,255,0.1), texto branco, placeholder muted
- "Senha" — idem + ícone olho toggle
- Checkbox "Lembrar por 30 dias" (cor dourada quando ativo)

Botão "Entrar" full-width, background #342CA4, hover #3B2CA4, texto branco, altura 44px, radius 8px.
Link "Esqueci minha senha" centralizado abaixo, cor #1DD3C0 (accent).

Sem link de cadastro.

Estado de erro: borda vermelha + mensagem "E-mail ou senha incorretos".
Estado rate-limited: banner vermelho "Muitas tentativas. Tente novamente em 15 minutos."

---

## DASHBOARD

### Dashboard Executivo

**Rota:** `/control/dashboard`
**Prompt Stitch:**
Crie o Dashboard Executivo do Control. Shell dark completo, item "Dashboard" ativo.

PageHeader dark: "Dashboard da Plataforma" (Manrope 700, branco). Subtítulo muted "Visão executiva em tempo real". Sem botão.

KPIs (6 cards em row, bg #12152C, border rgba(255,255,255,0.08)):
- "Orgs ativas" — número branco grande, ícone Building2 dourado
- "Tenants ativos" — número, ícone Layers #1DD3C0
- "MRR" — valor em R$ bold, variação % verde/vermelho, ícone TrendingUp
- "Churn do mês" — % + contagem, ícone UserMinus laranja
- "Novas ativações" — número, ícone UserPlus verde
- "Tickets abertos" — número, badge vermelho se > 0, ícone AlertCircle

Seção "Saúde da Plataforma":
Grid de cards de serviços (3 colunas): API, Database, Auth, Storage, IA Provider, Email — cada com badge status (● Operacional verde / ● Degradado amarelo / ● Outage vermelho) + uptime "99.9%" + latência "42ms".

Seção "Crescimento" (2 colunas):
- Gráfico de linha dark: "Tenants ativos" por mês, linha #342CA4, área fill com opacidade 20%
- Gráfico de barras: "MRR por mês", barras #342CA4, valores no topo

Seção "Atividade Recente":
Feed de últimas 10 ações do Audit Log: ícone de ação colorido + "Admin X [ação] [entidade]" + timestamp relativo.
Link "Ver Audit Log completo →" em #1DD3C0.

---

## ORGANIZAÇÕES

### Orgs — Lista

**Rota:** `/control/orgs`
**Prompt Stitch:**
Crie a listagem de Organizações do Control. Shell dark completo, item "Organizações" ativo.

PageHeader: "Organizações" + contagem total badge. Botão "Nova Organização" (#342CA4). Botão "Export CSV" (ghost dark).

Toolbar: busca dark + filtros: Status (dropdown: Ativa/Suspensa/Trial/Cancelada), Plano, Período — todos com estilo dark.

DataTable dark (bg #12152C, header bg #1a1d35, linhas alternadas rgba(255,255,255,0.02)):
Colunas: Checkbox | Logo+Nome+Slug | Status badge | Plano | Tenants (contagem) | MRR (R$) | Criado em | Ações (Ver/Editar/Suspender/Deletar)

Status badges: Ativa (verde) / Suspensa (amarelo) / Trial (azul) / Cancelada (vermelho muted).

Ações bulk: barra aparece ao selecionar múltiplos — "Suspender", "Exportar", contagem.

Modal "Nova Organização" dark: campos Nome, Slug (auto-gerado), Email do responsável, Select Plano inicial, Toggle Trial.

Estado empty dark: ícone Building2 muted + "Nenhuma organização cadastrada" + botão "Criar primeira organização".

---

### Org — Detalhe

**Rota:** `/control/orgs/[id]`
**Prompt Stitch:**
Crie o perfil de uma Organização no Control. Shell dark completo, breadcrumb "Organizações > NomeDaOrg".

Header da página:
- Ícone da org (inicial em circle) + nome (Manrope 700, 24px, branco) + slug badge muted + status badge
- Botões: "Editar" (ghost dark) + "Suspender" (amarelo/ghost) + kebab (deletar)
- AuditBadge: "Editado por Admin X · 3 dias atrás" em muted

Tabs dark: "Visão Geral" (ativa) | "Tenants" | "Billing" | "Usuários" | "Logs"

Aba Visão Geral (2 colunas):
Card esquerdo "Dados da Org": nome, slug, email, CNPJ, telefone, plano atual, data de ativação, trial (se).
Card direito "Limites de uso": lista de limites com ícones e barras de progresso — Tenants X/Y, Usuários X/Y, Storage X/Y GB, Tokens IA X/Y.

Aba Tenants: tabela com nome do tenant, status badge, plano, admin, última atividade + botão "Criar Tenant".

Aba Billing: card subscription + tabela de invoices (data, valor, status badge, link PDF).

---

## TENANTS

### Tenants — Lista

**Rota:** `/control/tenants`
**Prompt Stitch:**
Crie a listagem de Tenants do Control. Shell dark completo, item "Tenants" ativo.

PageHeader: "Tenants" + contagem. Botão "Novo Tenant" + "Export CSV".

Toolbar: busca + filtros: Status, Plano, Organização mãe, Data de ativação.

DataTable dark:
Colunas: Checkbox | Nome+Slug | Organização (badge linkável) | Status badge | Plano | Admin (email) | Usuários (contagem) | Uso IA (tokens/mês com mini barra) | Ações (Ver / Impersonar / Suspender / Deletar)

Ação "Impersonar": botão com ícone de olho na cor #1DD3C0 (accent) — ação especial destacada.

---

### Tenant — Detalhe

**Rota:** `/control/tenants/[id]`
**Prompt Stitch:**
Crie o perfil completo de um Tenant no Control. Shell dark completo, breadcrumb "Tenants > NomeDoTenant".

Header:
- Nome (Manrope 700, branco) + slug + status badge
- Badge "Org: [Nome da Org]" clicável → /control/orgs/[id]
- Botões: "Editar" | "Impersonar" (cor #1DD3C0, ícone Eye) | "Suspender" | kebab
- AuditBadge

Tabs: "Visão Geral" | "Usuários" | "Uso & Limites" | "Billing" | "Feature Flags" | "Configurações" | "Logs"

Aba Visão Geral:
- Card: dados do tenant (nome, slug, URL, timezone)
- Card: plano (nome, valor mensal, data início, trial se aplicável)
- Card: integrações ativas (chips: WhatsApp ✓, Gmail ✓, Stripe ✗)

Aba Uso & Limites:
- 5 barras de progresso: Usuários / Storage / Tokens IA / Sites / API calls
- Alertas automáticos em vermelho quando > 80%: "78% do limite de tokens IA usado"
- Gráfico de linha: consumo de tokens por dia (últimos 30 dias), linha #1DD3C0

Aba Billing:
- Card subscription ativa: plano + período + valor + próxima cobrança
- Botão "Gerar Invoice Manual" (ghost)
- Tabela invoices: número, data, valor, status badge, link download PDF

Aba Feature Flags:
- Lista de todas as flags com toggle por linha
- Badge "Global" (vem do default) vs "Override" (customizado para este tenant)

---

## PLANOS

### Planos — Lista

**Rota:** `/control/plans`
**Prompt Stitch:**
Crie a tela de Planos do Control. Shell dark, item "Planos" ativo.

PageHeader: "Planos de Assinatura". Botão "Novo Plano". Toggle "Públicos / Todos".

Grid de cards (3 colunas) — cada card com bg #12152C, border, border-radius 12px:
- Nome do plano (Manrope 700, 20px, branco)
- Badge: Público (verde) / Privado (amarelo) / Legado (muted)
- Preço mensal (bold) + preço anual equivalente
- Contagem "X tenants ativos" em muted
- Limites resumidos: usuários, storage, tokens
- Botões: "Editar" + "Duplicar" + "Arquivar" (kebab)

---

### Plano — Detalhe/Edição

**Rota:** `/control/plans/[id]`
**Prompt Stitch:**
Crie a tela de edição de Plano no Control. Shell dark, breadcrumb "Planos > Profissional".

PageHeader: nome do plano + status badge. Botões: "Salvar alterações" (#342CA4) + "Duplicar" + kebab (arquivar).

Formulário em seções (cards dark):
Card "Dados básicos": Nome, Descrição, Visibilidade (select: Público/Privado), Status.
Card "Preços": Preço mensal (R$), Preço anual (R$), Trial gratuito (toggle + input de dias).
Card "Limites de uso": campos numéricos com labels — Usuários máximos, Storage (GB), Tokens IA/mês, Sites, API calls/dia, Tenants por org.
Card "Features incluídas": checklist de toggles com labels — Conteúdo IA, Marketing, Social, Comunicação, Suporte, Tarefas, Relatórios Avançados, White-label, Domínio Customizado, API Access.
Card "Tenants ativos neste plano": tabela compacta com link para tenant.

AuditBadge no rodapé.

---

## INVOICES

### Invoices — Lista

**Rota:** `/control/invoices`
**Prompt Stitch:**
Crie a listagem de Invoices do Control. Shell dark, item "Invoices" ativo.

PageHeader: "Invoices". Botão "Gerar Invoice Manual" + "Export CSV".

KPIs inline abaixo do header (3 valores em row): "Total pago no mês R$XX.XXX" (verde) | "Total pendente R$X.XXX" (amarelo) | "Total vencido R$X.XXX" (vermelho).

Filtros: Status (Pago/Pendente/Vencido/Cancelado), Plano, Período (date range), Tenant.

DataTable dark:
Colunas: Checkbox | #INV-XXXXX | Tenant (nome+org) | Valor (R$, bold) | Status badge | Vencimento | Pago em | Ações (Ver / Reenviar email / Cancelar)

Status badges dark: Pago (verde) / Pendente (amarelo) / Vencido (vermelho) / Cancelado (muted/riscado).

---

### Invoice — Detalhe

**Rota:** `/control/invoices/[id]`
**Prompt Stitch:**
Crie o detalhe de Invoice. Shell dark, breadcrumb "Invoices > #INV-00042".

Header: número da invoice (Manrope 700) + status badge grande + tenant + data de emissão.
Botões: "Marcar como Pago" (verde) | "Reenviar Email" | "Baixar PDF" | "Cancelar" (vermelho/ghost).

Layout 2 colunas (65/35):
Coluna principal:
- Card "Destinatário" dark: nome do tenant, CNPJ, email de cobrança, endereço — estilo de nota fiscal
- Tabela de itens: Descrição | Qty | Valor unitário | Total — linha de separação + Subtotal + Total em bold grande
- Nota de rodapé: "Documento fiscal — Noro Guru Tecnologia Ltda."

Coluna lateral:
- Card "Dados do pagamento": método (Pix/boleto/cartão), data de pagamento, referência do gateway
- Card "Timeline" da invoice: eventos em lista vertical — "Emitida em ...", "Enviada em ...", "Visualizada em ...", "Paga em ..."

---

## OBSERVABILIDADE

### Status da Plataforma

**Rota:** `/control/observabilidade/status`
**Prompt Stitch:**
Crie a tela de Status da Plataforma no Control. Shell dark, breadcrumb "Observabilidade > Status".

Banner de status global: "✓ Todos os sistemas operacionais" em verde — ou estado alternativo com "⚠ Degradação parcial" em amarelo.

Grid de serviços (4 colunas, cards dark):
Por card: ícone do serviço + nome + badge ● status (Operacional/Degradado/Outage) + latência atual (p50: XXms) + uptime "99.98% nos últimos 30 dias".
Serviços: API Gateway, Database, Autenticação, Storage, IA Provider, Email, Pagamentos, Sites CDN.

Seção "Incidentes recentes":
Timeline: data + badge de severidade (Crítico vermelho / Atenção amarelo / Info azul) + título + status (Investigando / Monitorando / Resolvido) + duração.

Botão "Criar Incident Report" (ghost, ícone +) — abre modal.

---

## AUDIT LOG

### Audit Log Global

**Rota:** `/control/audit`
**Prompt Stitch:**
Crie a tela do Audit Log Global no Control. Shell dark, item "Audit Log" ativo.

PageHeader: "Audit Log" + contagem total de eventos. Botões: "Export CSV" + "Export JSON".

Toolbar dark: busca por entidade/ação + filtros: App (chips: core/control/sites/visa/api), Tipo de evento, Ator, Tenant, Date range.

DataTable dark (tabela densa, fonte 13px):
Colunas: Timestamp (UTC, mono font #1DD3C0) | App (badge colorido por app) | Evento (mono font, ex: control_tenant_suspended) | Ator (avatar + nome) | Entidade (tipo badge + ID + nome) | IP (mono) | Detalhes (botão "Ver")

Linhas com evento crítico (delete/suspend/impersonation): bg sutil vermelho transparente.

Drawer de detalhe do evento (520px, dark):
- Header: evento + timestamp
- JSON viewer com syntax highlight: payload completo antes/depois
- Aba "Headers": user-agent, session-id, etc.
- Ícone de cópia em cada valor

Nota de retenção no footer: "Eventos críticos: 2 anos · Padrão: 90 dias".

---

## FEATURE FLAGS

### Feature Flags

**Rota:** `/control/feature-flags`
**Prompt Stitch:**
Crie a tela de Feature Flags no Control. Shell dark, item "Feature Flags" ativo.

PageHeader: "Feature Flags" + contagem. Botão "Nova Feature Flag".

Toolbar: busca + filtros: Status (Ativa/Inativa), Escopo (Global/Por Plano/Por Tenant).

DataTable dark:
Colunas: Flag (nome técnico em mono, ex: ia_content_v2) | Descrição | Toggle Global (switch) | Escopo (badge) | Overrides (contagem, link) | Ações (Editar, Ver overrides, Deletar).

Toggle global: verde = ativo, cinza = inativo — com confirmação ao desativar flags críticas.

Modal "Nova Feature Flag" dark: campos Nome técnico (input mono), Descrição, Status padrão (toggle), Escopo (select: Global/Por Plano/Por Tenant), Rollout % (slider 0-100 com número ao lado).

---

*Documento gerado em: 2026-05-24 · Versão: 1.0*
*Para especificação completa de cada tela, consulte [DESIGN-CONTROL.md](./DESIGN-CONTROL.md)*
