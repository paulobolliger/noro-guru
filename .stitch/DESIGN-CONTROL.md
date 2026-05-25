# DESIGN-CONTROL.md — Especificação Completa do Control

> App: `admin.noro.guru` · Owner: Super Admin / Plataforma · Tema: Dark (neutral_dark + text_dark_theme)
> Referência de tokens, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> **Acesso exclusivo:** roles `super_admin` e `admin_operacional` da plataforma Noro.

---

## ÍNDICE

1. [Componentes Globais do Shell](#1-componentes-globais-do-shell)
2. [Fluxos de Navegação Principais](#2-fluxos-de-navegação-principais)
3. [Autenticação do Control](#3-autenticação-do-control)
4. [Dashboard Executivo](#4-dashboard-executivo)
5. [Organizações](#5-organizações)
6. [Tenants](#6-tenants)
7. [Usuários da Plataforma](#7-usuários-da-plataforma)
8. [Planos & Cobrança](#8-planos--cobrança)
9. [Subscriptions](#9-subscriptions)
10. [Invoices (Billing da Plataforma)](#10-invoices-billing-da-plataforma)
11. [Impersonation](#11-impersonation)
12. [Feature Flags](#12-feature-flags)
13. [Templates Globais](#13-templates-globais)
14. [Integrações de Plataforma](#14-integrações-de-plataforma)
15. [Webhooks da Plataforma](#15-webhooks-da-plataforma)
16. [Domínios Customizados](#16-domínios-customizados)
17. [Observabilidade & Logs](#17-observabilidade--logs)
18. [Configurações da Plataforma](#18-configurações-da-plataforma)
19. [Changelog & Releases](#19-changelog--releases)
20. [Audit Log Global](#20-audit-log-global)

---

## 1. Componentes Globais do Shell

Estes componentes existem em **todas** as páginas protegidas do Control. Nunca devem ser recriados por página.

### 1.1 Sidebar

**Posição:** Lateral esquerda, fixa em desktop, drawer em mobile.

**Tema:** Dark — background `noro_dark_purple` (#12152C), texto `text_dark_theme.primary`.

**Elementos:**
- Logo Noro Guru + badge "Control" (cor `noro_gold`) — topo, clicável → `/control/dashboard`
- **Sem TenantSelector** — Control é contexto de plataforma global; contexto de org/tenant é por página
- Grupos de navegação:
  - **Visão Geral** — Dashboard
  - **Orgs & Tenants** — Organizações, Tenants
  - **Usuários** — Usuários da Plataforma
  - **Monetização** — Planos, Subscriptions, Invoices
  - **Operações** — Impersonation, Feature Flags, Templates
  - **Integrações** — Integrações, Webhooks, Domínios
  - **Observabilidade** — Logs, Métricas, Alertas
  - **Plataforma** — Configurações, Changelog, Releases, Audit Log
- Item ativo com indicador visual (borda esquerda em `noro_gold` ou `noro_accent`)
- Rodapé da sidebar: avatar do super_admin + nome + role badge + link para `/control/configuracoes/perfil`
- Botão de recolher sidebar (ícone chevron)

**Estados:**
- Expanded (desktop padrão): largura 240px, labels visíveis
- Collapsed: largura 56px, apenas ícones com tooltip
- Mobile: drawer overlay com backdrop escuro

**Comportamento:**
- Persistir estado collapsed/expanded em localStorage
- Grupo ativo do módulo permanece aberto ao navegar

---

### 1.2 Topbar

**Posição:** Topo fixo, largura total menos sidebar. Background `noro_dark_purple`, border-bottom sutil.

**Elementos (da esquerda para direita):**
- Botão de toggle da sidebar (mobile/tablet)
- `Breadcrumb` — contexto da página atual com ícone de home → `/control/dashboard` (máx. 4 níveis para entidades aninhadas)
- **ContextBadge** (quando em contexto de org/tenant específico): chip com nome da org/tenant + botão "Sair do contexto"
- `GlobalSearch` do Control — busca em orgs, tenants, usuários (atalho `Ctrl+K` / `Cmd+K`)
- Badge de alertas críticos (vermelho) — problemas de plataforma, overdue invoices, erros de integração
- Avatar do super_admin → dropdown: perfil, configurações, sair

**Estados da busca global:**
- Idle: placeholder "Buscar org, tenant, usuário..."
- Active: modal de resultados agrupados por tipo (Org · Tenant · Usuário)
- Loading: shimmer nos resultados
- Empty: "Nenhum resultado para [query]"

---

### 1.3 PageHeader

**Posição:** Logo abaixo da topbar, dentro da área de conteúdo.

**Elementos:**
- Título da página (Manrope 700, tamanho display)
- Breadcrumb secundário (quando necessário por profundidade)
- Slot de descrição opcional (subtítulo muted)
- Slot de ações (máx. 1 botão primário + 2 secundários)
- Slot de filtros de contexto (ex: seletor de org para filtrar listagens)

---

### 1.4 Toast / Notificações de Ação

Mesmo padrão do Core, adaptado ao tema dark:
- 4 tipos: `success` / `error` / `warning` / `info`
- Auto-dismiss em 4s para success/warning/info; erros **sem** auto-dismiss
- Máx. 3 simultâneos; empilham bottom-right
- Mensagens de audit incluem link "Ver no Audit Log"

---

### 1.5 Modal / Dialog

- 5 tamanhos: `sm` (400px) / `md` (560px) / `lg` (720px) / `xl` (960px) / `fullscreen`
- ESC fecha (exceto ações críticas: delete, impersonation, suspend)
- Para ações destrutivas: modal com campo de confirmação por digitação (ex: "Digite o nome do tenant para confirmar")
- Sem modal-em-modal; drawer é alternativa para contexto adicional

---

### 1.6 Drawer / Sheet de Contexto

- Largura 520px, painel lateral direito
- Usado para: preview de org/tenant, detalhes de usuário, histórico de invoice, logs de webhook
- Header com nome da entidade + badge de status
- Botão "Abrir página completa" no header do drawer
- ESC ou clique fora fecha

---

### 1.7 DataTable do Control

Versão do DataTable com capacidades adicionais para dados de plataforma:
- **Colunas fixas** (esquerda): checkbox + nome/ID da entidade
- Sort por coluna, com indicador visual
- Filtros avançados em toolbar (dropdown por status, plano, data)
- Bulk checkbox + barra de ações bulk (suspend, export, enviar email)
- Kebab por linha: ver detalhes, editar, suspender, deletar
- Paginação: 10 / 25 / 50 / 100 por página
- Estados: loading (skeleton rows) / empty / error / filtrado-sem-resultado
- **Export CSV/JSON** no toolbar para todas as listagens

---

### 1.8 AuditBadge

Componente inline usado em qualquer entidade modificável:
- Exibe: "Editado por [nome] em [data]" com ícone de relógio
- Clicável → abre drawer com histórico completo do audit log para aquela entidade

---

## 2. Fluxos de Navegação Principais

### 2.1 Fluxo de Onboarding de Nova Org

```
/control/orgs (nova) → Modal "Criar Org"
  → preenche nome, slug, plano inicial
  → salva → /control/orgs/[id]
  → cria primeiro Tenant (botão "Criar Tenant")
  → /control/tenants/[id]
  → convida admin do tenant → email enviado
  → tenant ativo na listagem
```

### 2.2 Fluxo de Impersonation

```
/control/tenants/[id] → botão "Impersonar Tenant"
  → Modal de confirmação (auditado)
  → redireciona para app.noro.guru com token de impersonation
  → ContextBadge na Topbar do Core mostra "Impersonando: [tenant]"
  → botão "Encerrar Impersonation" → volta para /control/tenants/[id]
  → evento auditado: control_impersonation_started / ended
```

### 2.3 Fluxo de Gestão de Faturamento

```
/control/plans → configura planos e preços
  → /control/subscriptions → associa tenant a plano
  → /control/invoices → gera/visualiza faturas
  → /control/invoices/[id] → detalhe + ações (pagar, cancelar, reenviar)
```

### 2.4 Fluxo de Gestão de Domínio Customizado

```
/control/dominios → lista todos os domínios
  → drawer por domínio: status DNS, SSL, tenant vinculado
  → /control/dominios/[id] → verificação DNS, renovação SSL
  → alertas automáticos: SSL expirando em 30/7/1 dia
```

---

## 3. Autenticação do Control

### 3.1 `/control/login`

**Objetivo:** Autenticar super_admins e admin_operacionais no painel de controle da plataforma.

**Elementos:**
- Header mínimo: logo Noro Guru + badge "Control" (sem sidebar)
- Card centralizado em tela cheia (fundo `noro_dark`)
- Título: "Acesso ao Control"
- Alerta de segurança: "Área restrita — acesso monitorado e auditado"
- Campo: Email (type email, autocomplete username)
- Campo: Senha (type password, toggle show/hide)
- Checkbox: "Lembrar por 30 dias"
- Botão primário: "Entrar" (full width)
- Link: "Esqueci minha senha" → `/control/redefinir-senha`
- **Sem link de cadastro** — usuários do Control são criados apenas por outros super_admins

**Validações:**
- Email formato inválido: erro inline
- Credenciais inválidas: erro genérico "E-mail ou senha incorretos" (sem distinguir qual)
- Rate limiting: após 5 tentativas → bloqueio temporário 15 min + alerta no Audit Log

**Conexões:**
- Sucesso → `/control/dashboard`
- Tentativas suspeitas → alerta no Audit Log + notificação para super_admins

**Estados:** default / loading / error / rate-limited

---

### 3.2 `/control/redefinir-senha`

**Objetivo:** Recuperação de acesso para admins do Control.

**Elementos:**
- Mesmo shell mínimo do login
- Campo: Email para envio do link de reset
- Botão: "Enviar link de reset"
- Mensagem de sucesso: "Se este e-mail existir, você receberá o link em instantes."

**Conexões:**
- Após envio → instrução para verificar email
- Link no email → página de nova senha (token UUID)

---

## 4. Dashboard Executivo

### 4.1 `/control/dashboard`

**Objetivo:** Visão executiva de toda a plataforma — saúde, crescimento, receita e alertas críticos.

**Elementos:**

**Barra de KPIs (topo):**
- Total de Orgs ativas
- Total de Tenants ativos
- MRR (Receita Recorrente Mensal) em R$
- Churn do mês (% e quantidade)
- Novas ativações no mês
- Tickets de suporte abertos (link → `/control/logs/erros`)

**Seção: Saúde da Plataforma**
- Status dos serviços core (API, DB, Supabase, Cloudflare) — indicadores verde/amarelo/vermelho
- Uptime dos últimos 30 dias (barra visual %)
- Alertas ativos (lista de itens críticos com severidade)

**Seção: Crescimento**
- Gráfico de linha: Tenants ativos por mês (últimos 12 meses)
- Gráfico de barra: MRR por mês (últimos 12 meses)
- Tabela top 5 tenants por uso de IA (tokens consumidos)

**Seção: Billing Overview**
- Invoices vencidas (badge vermelho com contagem)
- Receita prevista para o mês
- Receita realizada até hoje

**Seção: Atividade Recente**
- Feed de últimas ações no Audit Log (20 itens) — entidade, ação, usuário, timestamp
- Link "Ver Audit Log completo" → `/control/audit`

**Conexões:**
- KPI de Orgs → `/control/orgs`
- KPI de Tenants → `/control/tenants`
- KPI de MRR → `/control/invoices`
- Status services → `/control/observabilidade/status`
- Alertas → `/control/observabilidade/alertas`

**Estados:** loading (skeleton completo) / dados carregados / erro parcial (seção individual com fallback)

---

## 5. Organizações

### 5.1 `/control/orgs`

**Objetivo:** Listar e gerenciar todas as organizações (agências) cadastradas na plataforma.

**Elementos:**

**Toolbar:**
- Título "Organizações" + contagem total
- Input de busca por nome/slug
- Filtros: Status (ativa, suspensa, trial, cancelada), Plano, Data de criação
- Botão "Nova Organização" (abre modal)
- Botão Export CSV

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Nome | Logo + nome + slug |
| Status | Badge (ativa / suspensa / trial / cancelada) |
| Plano | Nome do plano + período |
| Tenants | Contagem de tenants vinculados |
| MRR | Valor mensal em R$ |
| Criado em | Data formatada |
| Ações | Ver, Editar, Suspender, Deletar |

**Modal "Nova Organização":**
- Campo: Nome da organização
- Campo: Slug (auto-gerado a partir do nome, editável)
- Campo: Email do responsável
- Select: Plano inicial
- Toggle: Período trial (sim/não + duração em dias)
- Botão "Criar Organização"

**Conexões:**
- Linha clicável → `/control/orgs/[id]`
- Ação Suspender → Modal de confirmação → registro no Audit Log
- Ação Deletar → Modal com campo de confirmação por digitação

**Estados:** loading / empty (nenhuma org) / lista carregada / erro

---

### 5.2 `/control/orgs/[id]`

**Objetivo:** Perfil completo de uma organização — dados, tenants, billing, histórico.

**Elementos:**

**Header da página:**
- Logo/ícone da org + nome + slug + badge de status
- Botões de ação: Editar, Suspender/Reativar, Deletar
- `AuditBadge` com última modificação

**Tabs:**
- **Visão Geral** — dados cadastrais, configurações, metadata
- **Tenants** — lista de tenants vinculados (subtabela com status, plano, uso)
- **Billing** — subscriptions ativas, invoices, histórico de pagamento
- **Usuários** — usuários com acesso a qualquer tenant desta org
- **Logs** — audit log filtrado por esta org

**Aba Visão Geral:**
- Card: dados da org (nome, slug, email, telefone, CNPJ, endereço)
- Card: configurações (plano, status, data de ativação, trial expira em)
- Card: limites de uso (tenants max, usuários max, storage, tokens IA/mês)

**Aba Tenants:**
- Lista com cards ou tabela: nome do tenant, status, plano, admin, última atividade
- Botão "Criar Tenant para esta Org"

**Aba Billing:**
- Subscription ativa: plano, valor, próxima cobrança, status
- Tabela de invoices com status (pago / pendente / vencido)
- Total pago historicamente

**Aba Usuários:**
- Tabela de usuários com role por tenant
- Botão "Convidar Usuário"

**Aba Logs:**
- Timeline de ações auditadas para esta org

**Conexões:**
- Tenant na listagem → `/control/tenants/[id]`
- Invoice na listagem → `/control/invoices/[id]`
- Botão "Criar Tenant" → modal inline

---

## 6. Tenants

### 6.1 `/control/tenants`

**Objetivo:** Listar e gerenciar todos os tenants (instâncias operacionais) da plataforma.

**Elementos:**

**Toolbar:**
- Título "Tenants" + contagem total
- Input de busca por nome/slug/org
- Filtros: Status, Plano, Organização, Data de ativação
- Botão "Novo Tenant"
- Botão Export CSV

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Nome | Nome do tenant + slug |
| Organização | Nome da org vinculada |
| Status | Badge (ativo / suspenso / trial / cancelado) |
| Plano | Nome do plano |
| Admin | Nome + email do admin principal |
| Usuários | Contagem |
| Uso IA | Tokens consumidos no mês |
| Ações | Ver, Impersonar, Suspender, Deletar |

**Conexões:**
- Linha → `/control/tenants/[id]`
- Impersonar → fluxo de impersonation (§2.2)
- Filtro por Organização → pré-seleciona org no filtro

---

### 6.2 `/control/tenants/[id]`

**Objetivo:** Perfil completo de um tenant — configurações, usuários, uso, billing e ações admin.

**Elementos:**

**Header da página:**
- Nome do tenant + slug + badge de status
- Badge da Org mãe (clicável → `/control/orgs/[id-da-org]`)
- Botões: Editar, Impersonar, Suspender/Reativar, Deletar
- `AuditBadge`

**Tabs:**
- **Visão Geral** — dados, configurações, status
- **Usuários** — lista de usuários e roles neste tenant
- **Uso & Limites** — consumo de recursos em tempo real
- **Billing** — subscription, invoices, histórico
- **Feature Flags** — flags ativas/inativas para este tenant específico
- **Configurações** — integrações, webhooks, domínio customizado
- **Logs** — audit log filtrado por tenant

**Aba Visão Geral:**
- Card: dados do tenant (nome, slug, URL, timezone, idioma)
- Card: plano atual (nome, valor, data de ativação, expiração trial se aplicável)
- Card: configurações de IA (provider, modelo, temperatura, limites)
- Card: integrações ativas (lista de badge de integração)

**Aba Usuários:**
- Tabela: nome, email, role, último acesso, status (ativo / inativo)
- Botão "Convidar Usuário ao Tenant"
- Ação de linha: alterar role, remover do tenant

**Aba Uso & Limites:**
- Barra de progresso por recurso: Usuários, Storage, Tokens IA/mês, Sites publicados, API calls/dia
- Gráfico de linha: consumo de tokens por dia (últimos 30 dias)
- Alertas de limite (ex: "78% do limite de tokens usado")

**Aba Billing:**
- Subscription ativa com detalhes
- Lista de invoices: data, valor, status, link de pagamento
- Botão "Gerar Invoice Manual"
- Botão "Ajustar Subscription"

**Aba Feature Flags:**
- Lista de todas as flags disponíveis na plataforma
- Toggle por flag (override para este tenant)
- Badge "Global" vs "Override por Tenant"

**Aba Configurações:**
- Subseção: Integrações ativas (OAuth tokens, chaves API externas)
- Subseção: Webhooks configurados pelo tenant
- Subseção: Domínio customizado (status, DNS, SSL)

**Aba Logs:**
- Timeline filtrada de todas as ações do tenant

**Conexões:**
- Org badge → `/control/orgs/[id]`
- Invoice na listagem → `/control/invoices/[id]`
- Impersonar → fluxo §2.2

---

## 7. Usuários da Plataforma

### 7.1 `/control/usuarios`

**Objetivo:** Gerenciar todos os usuários com acesso ao Control (super_admins, admins operacionais).

**Elementos:**

**Toolbar:**
- Título "Usuários do Control" + contagem
- Busca por nome/email
- Filtro por role (super_admin / admin_operacional)
- Botão "Convidar Usuário ao Control"

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Nome | Avatar + nome + email |
| Role | Badge (super_admin / admin_operacional) |
| Status | Ativo / Inativo / Convidado pendente |
| Último acesso | Data/hora |
| 2FA | Ativo / Inativo |
| Ações | Ver, Editar Role, Desativar |

**Modal "Convidar Usuário":**
- Campo: Email
- Select: Role (super_admin / admin_operacional)
- Botão "Enviar Convite"
- Convite expira em 48h

---

### 7.2 `/control/usuarios/[id]`

**Objetivo:** Perfil detalhado de um usuário do Control.

**Elementos:**
- Header: avatar + nome + email + role badge + status
- Card: dados do perfil (nome, email, telefone, timezone)
- Card: segurança (2FA status, sessões ativas, último login, IP)
- Card: permissões (role + descrição das permissões)
- Tabela: histórico de ações no Audit Log (últimas 50)
- Ações: Alterar Role, Forçar Logout Todas Sessões, Desativar Conta
- `AuditBadge`

**Conexões:**
- Ações → registros no Audit Log

---

## 8. Planos & Cobrança

### 8.1 `/control/plans`

**Objetivo:** Gerenciar os planos de assinatura disponíveis para os tenants.

**Elementos:**

**Header:**
- Título "Planos" + total de planos ativos
- Botão "Novo Plano"
- Toggle: "Ver apenas planos públicos / todos"

**Grid de planos (cards):**
- Por card: nome do plano, badge (público/privado/legado), preço mensal, preço anual
- Contagem de tenants ativos neste plano
- Limites: usuários, storage, tokens IA, sites
- Botões: Editar, Duplicar, Arquivar

**Conexões:**
- Card de plano → `/control/plans/[id]`

---

### 8.2 `/control/plans/[id]`

**Objetivo:** Configurar todos os detalhes de um plano de assinatura.

**Elementos:**
- Header: nome do plano + badge status + `AuditBadge`
- Seção: dados básicos (nome, descrição, visibilidade)
- Seção: preços (mensal em R$, anual em R$, trial gratuito em dias)
- Seção: limites de uso
  - Usuários máximos
  - Storage em GB
  - Tokens IA por mês
  - Sites publicados
  - API calls por dia
  - Tenants por organização
- Seção: features incluídas (checklist de módulos habilitados)
  - Conteúdo IA, Marketing, Social, Comunicação, Support, Tarefas, Relatórios Avançados, White-label, Domínio Customizado, API Access
- Seção: tenants ativos neste plano (tabela com contagem e link)
- Botões: Salvar, Duplicar Plano, Arquivar Plano

**Conexões:**
- Tenants na seção → `/control/tenants/[id]`

---

### 8.3 `/control/plans/novo`

**Objetivo:** Formulário de criação de novo plano.

**Elementos:**
- Mesmo formulário do `/control/plans/[id]` com campos em branco
- Botão "Criar Plano"
- Opção "Duplicar a partir de..." — select de plano existente como base

---

## 9. Subscriptions

### 9.1 `/control/subscriptions`

**Objetivo:** Visualizar e gerenciar todas as subscriptions ativas na plataforma.

**Elementos:**

**Toolbar:**
- Título "Subscriptions" + totais (ativa, trial, cancelada, suspensa)
- Busca por tenant/org
- Filtros: Status, Plano, Período (mensal/anual), Data de renovação
- Botão "Nova Subscription Manual"
- Export CSV

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Tenant | Nome + org |
| Plano | Nome do plano |
| Status | Badge (ativa / trial / suspensa / cancelada) |
| Período | Mensal / Anual |
| Valor | R$ por período |
| Próxima cobrança | Data |
| Ações | Ver, Ajustar, Cancelar |

---

### 9.2 `/control/subscriptions/[id]`

**Objetivo:** Detalhe de uma subscription com histórico de mudanças e ações.

**Elementos:**
- Header: tenant + plano + status badge
- Card: dados da subscription (data início, próxima cobrança, período, valor)
- Card: histórico de mudanças (upgrades, downgrades, pausas)
- Seção: invoices vinculadas a esta subscription
- Ações: Fazer Upgrade/Downgrade, Pausar, Cancelar, Adicionar Crédito
- `AuditBadge`

---

## 10. Invoices (Billing da Plataforma)

### 10.1 `/control/invoices`

**Objetivo:** Listar e gerenciar todas as faturas de cobrança dos tenants.

**Elementos:**

**Toolbar:**
- Título "Invoices" + totais por status
- KPIs inline: Total pago no mês / Total pendente / Total vencido (em R$)
- Busca por tenant/número da invoice
- Filtros: Status (pago / pendente / vencido / cancelado), Plano, Período, Data
- Botão "Gerar Invoice Manual"
- Export CSV / Export PDF (lote)

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Número | #INV-XXXXX |
| Tenant | Nome + org |
| Valor | R$ total |
| Status | Badge (pago / pendente / vencido / cancelado) |
| Vencimento | Data |
| Pago em | Data (ou —) |
| Ações | Ver, Reenviar email, Cancelar |

---

### 10.2 `/control/invoices/[id]`

**Objetivo:** Detalhe completo de uma invoice com itens, pagamento e histórico.

**Elementos:**
- Header: número da invoice + status badge + tenant + data de emissão
- Card: dados do tenant (nome, CNPJ, email de cobrança, endereço)
- Tabela de itens: descrição (plano + período), quantidade, valor unitário, total
- Card: totais (subtotal, impostos se aplicável, total)
- Card: dados do pagamento (método, data, referência, gateway)
- Timeline: histórico de eventos desta invoice (emitida, enviada, paga, venceu, cancelada)
- Ações: Marcar como Pago, Reenviar Email, Baixar PDF, Cancelar Invoice
- `AuditBadge`

---

## 11. Impersonation

### 11.1 `/control/impersonation`

**Objetivo:** Registro e controle de todas as sessões de impersonation realizadas por admins.

**Elementos:**
- Título "Histórico de Impersonation"
- KPIs: sessões ativas agora / sessões hoje / total do mês
- DataTable:
  | Coluna | Conteúdo |
  |---|---|
  | Admin | Quem impersonou |
  | Tenant | Qual tenant foi acessado |
  | Iniciado em | Data/hora |
  | Encerrado em | Data/hora (ou "Ativa" em badge vermelho) |
  | Duração | Tempo da sessão |
  | Ações | Encerrar sessão ativa (apenas admin super) |

**Regras:**
- Toda sessão de impersonation gera evento `control_impersonation_started` e `control_impersonation_ended` no Audit Log
- Sessões ativas podem ser encerradas remotamente por super_admin
- Admin_operacional não pode impersonar tenants de outras regiões/planos (se configurado)

---

## 12. Feature Flags

### 12.1 `/control/feature-flags`

**Objetivo:** Gerenciar o rollout de funcionalidades por tenant, plano ou percentual.

**Elementos:**

**Toolbar:**
- Título "Feature Flags" + contagem
- Busca por nome da flag
- Filtros: Status (ativa/inativa), Escopo (global/plano/tenant)
- Botão "Nova Feature Flag"

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Flag | Nome técnico (kebab-case) |
| Descrição | Texto curto |
| Status | Toggle ativo/inativo (global) |
| Escopo | Global / Por Plano / Por Tenant |
| Overrides | Contagem de overrides individuais |
| Ações | Editar, Ver overrides, Deletar |

**Modal "Nova Feature Flag":**
- Nome técnico (slug, ex: `ia_content_v2`)
- Descrição legível
- Status padrão (ativo/inativo)
- Escopo: Global / Filtrar por Plano(s) / Filtrar por Tenant(s) específicos
- Percentual de rollout (0-100%)

---

### 12.2 `/control/feature-flags/[id]`

**Objetivo:** Configurar em detalhe e ver o alcance de uma feature flag.

**Elementos:**
- Header: nome técnico + status badge global
- Card: configuração (descrição, status, escopo, rollout %)
- Seção: "Planos com acesso" — checklist de planos
- Seção: "Overrides por Tenant" — tabela de tenants com override específico (toggle por linha)
- Seção: histórico de mudanças (quem alterou o quê e quando)
- Botões: Salvar, Ativar para Todos, Desativar para Todos, Deletar

---

## 13. Templates Globais

### 13.1 `/control/templates`

**Objetivo:** Gerenciar templates pré-configurados que os tenants podem usar como ponto de partida.

**Elementos:**

**Toolbar:**
- Título "Templates Globais" + contagem
- Busca por nome/categoria
- Filtros: Tipo (email, conteúdo, contrato, site)
- Botão "Novo Template"

**Grid de cards:**
- Por card: nome, tipo, thumbnail (se visual), ícone, contagem de uso por tenants
- Botões: Editar, Duplicar, Arquivar

---

### 13.2 `/control/templates/[id]`

**Objetivo:** Editor do template com preview e configurações de disponibilidade.

**Elementos:**
- Header: nome + tipo + status (ativo/arquivado)
- Editor de conteúdo (por tipo):
  - Email: editor rico com variáveis `{{nome_cliente}}`, `{{link_doc}}`
  - Contrato: editor texto com blocos de cláusulas
  - Site: referência para sites/templates
- Card: disponibilidade — quais planos têm acesso
- Card: estatísticas — quantos tenants usam este template
- Botões: Salvar, Preview, Duplicar, Arquivar

---

## 14. Integrações de Plataforma

### 14.1 `/control/integracoes`

**Objetivo:** Configurar integrações de plataforma que afetam todos os tenants (email provider, SMS, push, pagamentos).

**Elementos:**

**Seções por categoria:**

**Email Transacional:**
- Provider ativo (Resend / Sendgrid / SES)
- Status da integração (badge verde/vermelho)
- Configurações: API key (mascarada), domínio de envio, reply-to
- Botão "Testar envio"
- Estatísticas: emails enviados hoje / bounce rate / spam rate

**Gateway de Pagamento:**
- Gateways configurados (Stripe, Asaas, PagSeguro)
- Status por gateway
- Configurações: chaves públicas/privadas (mascaradas), webhook endpoint, modo (sandbox/produção)
- Botão "Testar webhook"

**SMS / Push:**
- Provider (Twilio, etc.)
- Status e configurações básicas

**IA / LLM:**
- Providers configurados (OpenAI, Anthropic, Google)
- Modelo padrão por provider
- Limites de custo por provider
- Chaves de API (mascaradas)
- Estatísticas: tokens usados hoje / custo estimado

**Botão por integração:** Editar Configurações → modal com campos

---

## 15. Webhooks da Plataforma

### 15.1 `/control/webhooks`

**Objetivo:** Webhooks de plataforma — eventos emitidos pela infraestrutura Noro para sistemas externos.

**Elementos:**

**Toolbar:**
- Título "Webhooks da Plataforma" + contagem
- Busca por URL/evento
- Filtros: Status, Evento, Data
- Botão "Novo Webhook"

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| URL | Endpoint de destino (truncado) |
| Eventos | Lista de eventos inscritos |
| Status | Ativo / Inativo / Erro |
| Último envio | Data/hora + status (200/500) |
| Ações | Ver logs, Editar, Testar, Deletar |

---

### 15.2 `/control/webhooks/[id]`

**Objetivo:** Detalhe de um webhook com logs de entrega e configurações.

**Elementos:**
- Header: URL + status
- Card: configurações (URL, secret, eventos inscritos)
- Seção: "Eventos inscritos" — checklist de todos os eventos `control_*` disponíveis
- Seção: "Histórico de entregas" — tabela (data, evento, status HTTP, tempo de resposta)
- Botão "Reenviar falhas" — reprocessar entregas com erro
- Botão "Testar Webhook" — envia payload de teste
- `AuditBadge`

---

## 16. Domínios Customizados

### 16.1 `/control/dominios`

**Objetivo:** Monitorar e gerenciar todos os domínios customizados configurados pelos tenants.

**Elementos:**

**Toolbar:**
- Título "Domínios Customizados" + contagem
- Busca por domínio/tenant
- Filtros: Status (ativo / pendente verificação / erro DNS / SSL expirando)
- Export CSV

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Domínio | URL do domínio |
| Tenant | Tenant vinculado |
| Status DNS | Verificado / Pendente / Erro |
| SSL | Válido / Expirando / Expirado |
| SSL expira em | Data |
| Ações | Ver, Forçar verificação, Revogar |

**Alertas automáticos no topo:**
- "3 domínios com SSL expirando em menos de 7 dias"
- "2 domínios com erro de DNS"

---

### 16.2 `/control/dominios/[id]`

**Objetivo:** Detalhe de um domínio customizado com diagnóstico DNS e gestão de SSL.

**Elementos:**
- Header: domínio + status badge
- Card: informações (domínio, tenant vinculado, data de configuração)
- Card: status DNS — registros DNS esperados vs encontrados (tabela)
  - Registro CNAME/A esperado com valor correto
  - Status de propagação (verificado / pendente / erro)
  - Botão "Verificar novamente"
- Card: SSL
  - Certificado: emitido por, válido de, expira em
  - Status: válido / expirando (badge amarelo < 30 dias) / expirado (badge vermelho)
  - Botão "Renovar certificado"
- Seção: histórico de eventos (verificações, renovações SSL, erros)
- `AuditBadge`

---

## 17. Observabilidade & Logs

### 17.1 `/control/observabilidade`

**Objetivo:** Hub central de monitoramento da plataforma — status, métricas, alertas e erros.

**Elementos:**

**Tabs:**
- **Status** — saúde dos serviços em tempo real
- **Métricas** — gráficos de performance
- **Alertas** — alertas ativos e histórico
- **Erros** — log de erros da plataforma

---

### 17.2 `/control/observabilidade/status`

**Objetivo:** Status em tempo real de todos os serviços da plataforma.

**Elementos:**
- Grid de cards por serviço: API Gateway, Database, Auth, Storage, IA Provider, Email, Pagamentos, Sites CDN
- Por card: ícone do serviço, status (operacional / degradado / outage), latência p50/p95, uptime 30 dias
- Timeline de incidentes recentes (últimos 30 dias)
- Botão "Criar Incident Report" → abre modal de comunicação de incidente

---

### 17.3 `/control/observabilidade/metricas`

**Objetivo:** Gráficos de performance e uso da plataforma.

**Elementos:**
- Seletor de período (últimas 24h / 7 dias / 30 dias / custom)
- Gráfico: Requisições/minuto por endpoint
- Gráfico: Latência p50/p95/p99 por serviço
- Gráfico: Uso de CPU/memória (infraestrutura)
- Gráfico: Tokens IA consumidos por tenant (top 10)
- Gráfico: Novos usuários / ativações por dia

---

### 17.4 `/control/observabilidade/alertas`

**Objetivo:** Alertas configurados e histórico de disparo.

**Elementos:**

**Seção: Alertas Ativos**
- Lista de alertas ativos com severidade (crítico / warning / info), descrição, data de início, ações

**Seção: Configurar Alertas**
- DataTable de regras: nome, condição (ex: "latência > 500ms por 5min"), canal de notificação, status
- Botão "Novo Alerta"

---

### 17.5 `/control/observabilidade/erros`

**Objetivo:** Log de erros da plataforma com stacktrace e contexto.

**Elementos:**
- Toolbar: busca, filtros (severidade, serviço, data), Export
- DataTable: timestamp, serviço, código de erro, mensagem (truncada), ocorrências, usuário/tenant afetado
- Clique na linha → drawer com stacktrace completo, payload da requisição, contexto do tenant

---

## 18. Configurações da Plataforma

### 18.1 `/control/configuracoes`

**Objetivo:** Hub de configurações globais da plataforma Noro.

**Elementos:**
- Menu lateral secundário (sub-navegação):
  - Geral
  - Segurança
  - Email & Comunicação
  - Limites Globais
  - SEO & Legal
  - Time do Control

---

### 18.2 `/control/configuracoes/geral`

**Elementos:**
- Nome da plataforma, URL base, logo, favicon
- Timezone padrão, idioma padrão
- Modo de manutenção (toggle + mensagem customizável)
- Rodapé global das aplicações (texto legal)

---

### 18.3 `/control/configuracoes/seguranca`

**Elementos:**
- Política de senhas (comprimento mínimo, complexidade, expiração)
- 2FA obrigatório para super_admins (toggle)
- Timeout de sessão (minutos de inatividade)
- IP allowlist para acesso ao Control (campo de IPs/CIDRs)
- Configurações de rate limiting global

---

### 18.4 `/control/configuracoes/limites-globais`

**Elementos:**
- Limites padrão para tenants sem plano configurado
- Limites de segurança máximos (ex: nenhum tenant pode ter > X tokens/mês)
- Configurações de queue e throttling

---

### 18.5 `/control/configuracoes/seo-legal`

**Elementos:**
- Textos de Termos de Serviço (editor rico)
- Texto de Política de Privacidade
- Texto de LGPD
- Meta tags globais

---

### 18.6 `/control/configuracoes/time`

**Objetivo:** Gerenciar membros do time interno da Noro com acesso ao Control.

**Elementos:**
- Lista de membros do time com role e status
- Botão "Convidar Membro"
- Ações: alterar role, desativar

**Conexão:**
- Redireciona para `/control/usuarios` (são a mesma entidade) com filtro de contexto

---

## 19. Changelog & Releases

### 19.1 `/control/changelog`

**Objetivo:** Registro de todas as mudanças e releases da plataforma Noro.

**Elementos:**

**Toolbar:**
- Título "Changelog da Plataforma"
- Filtros: Tipo (feature / bugfix / breaking / deprecation / security), Versão, Data
- Botão "Nova Entrada"

**Lista de entradas (timeline vertical):**
- Por entrada: versão badge, data, tipo badge, título, descrição (markdown), apps afetados (chips: Core / Control / Sites / Visa / API)
- Ação: Editar, Deletar

**Conexões:**
- Entradas do changelog são publicadas automaticamente no `/changelog` do site público (Web)

---

### 19.2 `/control/releases`

**Objetivo:** Gerenciar deploys e versões dos apps do ecossistema.

**Elementos:**
- DataTable: versão, app (Core/Control/Sites/API), data de deploy, status (ativo/rollback), commit hash, notas
- Por linha: botão "Ver changelog vinculado", "Rollback para esta versão"
- Ação de Rollback: modal de confirmação com alerta de impacto

---

## 20. Audit Log Global

### 20.1 `/control/audit`

**Objetivo:** Registro imutável de todas as ações críticas realizadas na plataforma por qualquer ator.

**Elementos:**

**Toolbar:**
- Título "Audit Log" + contagem total de eventos
- Busca por entidade/usuário/ação
- Filtros: App (core/control/sites/visa/api), Tipo de evento, Usuário/Admin, Tenant, Data (range)
- Export CSV / Export JSON (para compliance)

**DataTable:**
| Coluna | Conteúdo |
|---|---|
| Timestamp | Data e hora (UTC) com precisão de ms |
| App | Badge do app que gerou o evento |
| Evento | `{app}_{modulo}_{acao}` (ex: `control_tenant_suspended`) |
| Ator | Nome + email + role |
| Entidade | Tipo + ID + nome (ex: Tenant · t_abc123 · AgênciaXYZ) |
| IP | Endereço IP da requisição |
| Detalhes | Botão "Ver" → drawer com payload completo |

**Drawer de detalhe do evento:**
- Payload JSON completo (before/after para edições)
- Headers da requisição (User-Agent, etc.)
- Session ID

**Regras de retenção:**
- Eventos críticos (delete, suspend, impersonation, role change): retenção 2 anos
- Eventos padrão: retenção 90 dias
- Export para compliance disponível a qualquer tempo

**Conexões:**
- `AuditBadge` em qualquer entidade → abre este log pré-filtrado por entidade
- Alertas de segurança → link para evento específico no Audit Log

---

*Documento gerado em: 2026-05-24 · Versão: 1.0 · App: admin.noro.guru*
