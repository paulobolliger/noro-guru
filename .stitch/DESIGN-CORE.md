# DESIGN-CORE.md — Especificação Completa do Core

> App: `app.noro.guru` · Owner: Tenant · Tema: Light (neutral_light)
> Referência de tokens, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)

---

## ÍNDICE

1. [Componentes Globais do Shell](#1-componentes-globais-do-shell)
2. [Fluxos de Navegação Principais](#2-fluxos-de-navegação-principais)
3. [Autenticação & Onboarding](#3-autenticação--onboarding)
4. [Dashboard](#4-dashboard)
5. [CRM & Pipeline — Leads](#5-crm--pipeline--leads)
6. [CRM & Pipeline — Clientes (Hub 360°)](#6-crm--pipeline--clientes-hub-360)
7. [CRM & Pipeline — Orçamentos](#7-crm--pipeline--orçamentos)
8. [CRM & Pipeline — Pedidos](#8-crm--pipeline--pedidos)
9. [Financeiro](#9-financeiro)
10. [Billing do Tenant](#10-billing-do-tenant)
11. [Conteúdo IA](#11-conteúdo-ia)
12. [Marketing & Social](#12-marketing--social)
13. [Atendimento Omnichannel](#13-atendimento-omnichannel)
14. [Support & Tickets](#14-support--tickets)
15. [Tarefas](#15-tarefas)
16. [Custos IA](#16-custos-ia)
17. [Meu Site](#17-meu-site)
18. [Relatórios](#18-relatórios)
19. [Configurações & Governança](#19-configurações--governança)
20. [Notificações](#20-notificações)

---

## 1. Componentes Globais do Shell

Estes componentes existem em **todas** as páginas protegidas do Core. Nunca devem ser recriados por página.

### 1.1 Sidebar

**Posição:** Lateral esquerda, fixa em desktop, drawer em mobile.

**Elementos:**
- Logo Noro Guru (topo) — clicável → `/dashboard`
- `TenantSelector` — dropdown para troca de contexto de tenant
- Grupos de navegação pelos 5 pilares (ver §7.2 do DESIGN.md)
- Item ativo com indicador visual (borda esquerda em `noro_primary`)
- Rodapé da sidebar: avatar do usuário logado + nome + link para `/configuracoes/perfil`
- Botão de recolher sidebar (ícone chevron)

**Estados:**
- Expanded (desktop padrão): largura 240px, labels visíveis
- Collapsed: largura 56px, apenas ícones com tooltip
- Mobile: drawer overlay com backdrop

**Comportamento:**
- Persistir estado collapsed/expanded em localStorage
- Grupo ativo do pilar permanece aberto ao navegar

---

### 1.2 Topbar

**Posição:** Topo fixo, largura total menos sidebar.

**Elementos (da esquerda para direita):**
- Botão de toggle da sidebar (mobile/tablet)
- `Breadcrumb` — contexto da página atual (máx. 3 níveis)
- `GlobalSearch` — barra de busca global (atalho `Ctrl+K` / `Cmd+K`)
- Ícone de notificações (`/notificacoes`) com badge de contagem não lida
- Avatar do usuário → dropdown: perfil, configurações, sair

**Estados da busca global:**
- Idle: placeholder "Buscar clientes, leads, orçamentos..."
- Active: modal de resultados agrupados por entidade
- Loading: shimmer nos resultados
- Empty: "Nenhum resultado para [query]"

---

### 1.3 PageHeader

**Posição:** Topo da área de conteúdo, abaixo da Topbar.

**Elementos:**
- Título da página (Manrope 700, `fg`)
- Breadcrumb secundário quando necessário
- Slot de ações primárias (direita) — máx. 1 botão primário + 2 secundários
- Slot de filtros globais quando aplicável (ex: seletor de período)

**Regra:** Um único `<Button variant="primary">` por PageHeader.

---

### 1.4 Toast / Feedback Global

Sistema de notificações inline para ações do usuário:

| Tipo | Cor | Quando usar |
|---|---|---|
| Success | `success` | Operação concluída com sucesso |
| Error | `destructive` | Falha em operação — com mensagem acionável |
| Warning | `warning` | Ação com risco ou pendência |
| Info | `info` | Informação contextual neutra |

**Regras:**
- Duração padrão: 4s (auto-dismiss)
- Erros críticos: sem auto-dismiss, com botão "Tentar novamente"
- Posição: canto inferior direito
- Máx. 3 toasts simultâneos

---

### 1.5 Modal / Dialog Padrão

**Tamanhos disponíveis:** sm (400px) · md (560px) · lg (720px) · xl (900px) · fullscreen

**Estrutura obrigatória:**
- Header: título + botão fechar (X)
- Body: conteúdo com scroll interno quando necessário
- Footer: ações (direita) — máx. 1 primário + 1 secundário + 1 destrutivo

**Regras:**
- Fechar com ESC e clique no backdrop (exceto modais críticos)
- Modais destrutivos: não fechar com clique no backdrop
- Sem modal dentro de modal

---

### 1.6 Drawer / Sheet

Painel lateral deslizante para contexto adicional sem sair da página.

**Posição:** Direita por padrão (largura 480px em desktop).

**Usos:**
- Detalhe rápido de entidade sem navegar
- Formulário de criação rápida
- Filtros avançados de tabela

---

### 1.7 Tabela Padrão (`<DataTable>`)

**Elementos obrigatórios:**
- Cabeçalho com ordenação clicável por coluna
- Checkbox de seleção por linha (bulk actions)
- Menu de ações por linha (kebab `···`)
- Paginação: itens por página (10/25/50) + navegação
- Barra de bulk actions (aparece ao selecionar ≥1 linha)
- Estado vazio com ilustração + CTA
- Estado loading com skeleton rows
- Estado erro com CTA "Tentar novamente"

**Comportamento:**
- Filtros ativos refletidos na URL como query params
- Seleção de página preservada ao voltar do detalhe

---

### 1.8 Header & Footer (páginas públicas do Core)

As páginas `/login`, `/cadastro`, `/onboarding/*`, `/convites/[token]` e `/redefinir-senha` usam shell público:

**Header público:**
- Logo Noro Guru (centralizado ou esquerda)
- Link "Já tenho conta" / "Voltar" conforme contexto

**Footer público:**
- Links: Privacidade · Termos · Suporte
- © Noro Guru

---

## 2. Fluxos de Navegação Principais

### Fluxo Comercial (eixo principal do Core)
```
/leads → /leads/[id] → /clientes/novo (converter lead)
/clientes/[id] → /orcamentos/novo (criar orçamento)
/orcamentos/[id]/aprovacao → /pedidos/[id] (converter orçamento)
/pedidos/[id] → /financeiro/contas-receber (faturar pedido)
/financeiro/contas-receber → /financeiro/billing/invoices (emitir cobrança)
```

### Fluxo de Conteúdo IA
```
/conteudo → /conteudo/roteiros → /orcamentos/[id]/roteiro (usar roteiro)
/conteudo/artigos → /site/blog (publicar no site)
/conteudo → /marketing/social (distribuir nas redes)
```

### Fluxo de Atendimento
```
/comunicacao → /comunicacao/chat → /clientes/[id] (vincular conversa)
/comunicacao → /support/tickets (escalar)
/support/[id] → /pedidos/[id] (vincular pedido ao ticket)
```

### Fluxo de Publicação de Site
```
/site/editor → /site/paginas → /site/publicacao → [agencia].sites.noro.guru
```

---

## 3. Autenticação & Onboarding

### `/login`

**Objetivo:** Autenticar usuário existente.

**Elementos:**
- Logo Noro Guru
- Formulário: e-mail + senha
- Botão primário: "Entrar"
- Link: "Esqueci minha senha" → `/redefinir-senha`
- Link: "Criar conta" → `/cadastro`
- Separador + "Entrar com Google" (OAuth)
- Mensagem de erro inline por campo

**Conexões:**
- Sucesso → `/dashboard` (ou `return_to` se vier de handoff)
- Primeiro acesso → `/onboarding`

---

### `/cadastro`

**Objetivo:** Registrar novo tenant no ecossistema.

**Elementos:**
- Formulário: nome · e-mail · senha · nome da agência
- Checkbox: aceite de Termos e Política de Privacidade
- Botão primário: "Criar conta"
- Link: "Já tenho conta" → `/login`
- "Cadastrar com Google" (OAuth)

**Conexões:**
- Sucesso → `/onboarding`

---

### `/onboarding`

**Objetivo:** Wizard de primeiro acesso — configurar o tenant antes de usar o produto.

**Estrutura:** Stepper horizontal com 4 passos. Progress bar no topo.

**Passos:**

| Rota | Passo | Elementos |
|---|---|---|
| `/onboarding/agencia` | 1/4 — Sua agência | Nome, CNPJ, segmento (turismo/vistos/ambos), logo upload |
| `/onboarding/equipe` | 2/4 — Sua equipe | Convidar membros por e-mail com role, ou pular |
| `/onboarding/site` | 3/4 — Seu site | Escolher slug, template inicial, ou pular |
| `/onboarding/concluido` | 4/4 — Pronto! | Resumo do que foi configurado + CTAs para começar |

**Elementos comuns:**
- Botão "Anterior" (secundário) + "Próximo" / "Concluir" (primário)
- Link "Pular esta etapa" (exceto passo 1)
- Barra de progresso com % de conclusão

**Conexões:**
- Conclusão → `/dashboard`
- Pular tudo → `/dashboard` com banner de "Complete seu perfil"

---

### `/convites/[token]`

**Objetivo:** Aceitar convite de membro da equipe. Rota pública.

**Elementos:**
- Card central: nome da agência que convidou + role atribuída
- Formulário: nome + senha (se novo usuário) ou apenas confirmação (se já tem conta)
- Botão primário: "Aceitar convite"
- Link: "Recusar convite"

**Conexões:**
- Sucesso → `/dashboard` do tenant correspondente
- Token inválido ou expirado → página de erro com CTA "Solicitar novo convite"

---

### `/redefinir-senha` e `/redefinir-senha/[token]`

**`/redefinir-senha`:** Formulário de e-mail → envia link de redefinição.

**`/redefinir-senha/[token]`:** Formulário de nova senha + confirmação.

**Conexões:**
- Sucesso → `/login` com toast "Senha redefinida com sucesso"

---

## 4. Dashboard

### `/dashboard`

**Objetivo:** Visão geral operacional do tenant — estado atual do negócio num relance.

**Elementos:**
- `PageHeader`: "Dashboard" + seletor de período (hoje / 7d / 30d / personalizado)
- Bloco de KPIs (grid 4 colunas): Leads ativos · Orçamentos abertos · Receita do período · Tickets abertos
- Seção "Pipeline" — kanban compacto de leads (5 colunas, leitura rápida)
- Seção "Alertas" — tarefas vencidas, cobranças atrasadas, SLA em risco
- Seção "Últimas atividades" — timeline dos últimos eventos do tenant
- Seção "Conteúdo" — próximas publicações agendadas

**Conexões:**
- KPI de Leads → `/leads`
- KPI de Orçamentos → `/orcamentos`
- KPI de Receita → `/financeiro/overview`
- KPI de Tickets → `/support/tickets`
- Card de lead no pipeline → `/leads/[id]`
- Alerta de cobrança → `/financeiro/billing/delinquency`
- Item da timeline → entidade correspondente

---

### `/dashboard/executivo`

**Objetivo:** Visão consolidada para tomada de decisão — receita, margem, pipeline e projeção.

**Elementos:**
- KPIs: MRR · Churn estimado · Taxa de conversão (lead→pedido) · Ticket médio
- Gráfico de receita realizada vs. projetada (linha, 12 meses)
- Funil de conversão: Leads → Clientes → Orçamentos → Pedidos
- Top 5 clientes por receita no período
- Top 5 destinos vendidos

**Conexões:**
- Drill-down em qualquer KPI → relatório ou lista correspondente

---

### `/dashboard/comercial`

**Objetivo:** Pipeline comercial e performance da equipe de vendas.

**Elementos:**
- KPIs: Leads novos · Taxa de qualificação · Propostas enviadas · Taxa de fechamento
- Kanban de leads por estágio (leitura/ação rápida)
- Tabela: leads por responsável com taxa de conversão
- Orçamentos com aprovação pendente

**Conexões:**
- Lead → `/leads/[id]`
- Orçamento pendente → `/orcamentos/[id]/aprovacao`

---

### `/dashboard/financeiro`

**Objetivo:** Saúde financeira do tenant no período selecionado.

**Elementos:**
- KPIs: Receita bruta · Despesas · Saldo em caixa · Inadimplência (%)
- Gráfico fluxo de caixa (barras empilhadas: entradas/saídas)
- Cobranças vencendo em 7 dias (lista compacta)
- Últimos 5 pagamentos recebidos

**Conexões:**
- KPI → subpágina do `/financeiro` correspondente
- Cobrança → `/financeiro/billing/charges`

---

### `/dashboard/marketing`

**Objetivo:** Performance de conteúdo e canais de marketing.

**Elementos:**
- KPIs: Posts publicados no período · Alcance total · E-mails enviados · Taxa de abertura
- Calendário editorial semanal (próximas publicações)
- Performance por canal (gráfico de barras)
- Roteiros gerados pela IA no período + custo associado

**Conexões:**
- Post → `/social/posts`
- Calendário → `/social/calendario`
- Custo IA → `/custos/all`

---

## 5. CRM & Pipeline — Leads

### `/leads`

**Objetivo:** Listar, filtrar e gerenciar todos os leads do tenant.

**Elementos:**
- `PageHeader`: "Leads" + botão primário "Novo lead" + botão "Importar"
- Toggle de view: Lista | Kanban
- Filtros: status · responsável · fonte · período de criação · tag
- `<DataTable>` com colunas: Nome · Empresa · Status · Responsável · Fonte · Criado em · Última atividade
- `<StatusBadge>` por status: Novo (info) · Qualificado (warning) · Proposta (warning) · Fechado (success) · Perdido (destructive)
- Menu de linha: Ver · Editar · Converter para cliente · Arquivar

**Conexões:**
- "Novo lead" → `/leads/novo`
- "Importar" → `/leads/importar`
- Toggle Kanban → `/leads/kanban`
- Linha da tabela → `/leads/[id]`

---

### `/leads/novo`

**Objetivo:** Criar um novo lead manualmente.

**Elementos:**
- `PageHeader`: "Novo Lead" com breadcrumb "Leads / Novo"
- Formulário em seções:
  - **Identificação:** nome · empresa · cargo · e-mail · telefone
  - **Qualificação:** fonte (dropdown) · tag · responsável · temperatura (Frio/Morno/Quente)
  - **Contexto:** interesse principal · destino desejado · data estimada · orçamento estimado
  - **Notas:** textarea livre
- Botões: "Cancelar" (secundário) + "Salvar lead" (primário)
- Proteção contra saída sem salvar (dialog de confirmação)

**Conexões:**
- Sucesso → `/leads/[id]` do lead criado com toast "Lead criado"
- Cancelar → `/leads`

---

### `/leads/importar`

**Objetivo:** Importar leads em lote via CSV ou integração.

**Elementos:**
- Área de drag & drop de arquivo CSV
- Preview da planilha com mapeamento de colunas
- Validação de campos obrigatórios antes de importar
- Seletor de responsável padrão para os leads importados
- Botão primário: "Importar [N] leads"
- Link: "Baixar planilha modelo"

**Conexões:**
- Sucesso → `/leads` com toast "N leads importados"
- Erros de validação → lista de linhas com problema antes de confirmar

---

### `/leads/kanban`

**Objetivo:** Visualizar e mover leads por estágio do pipeline.

**Elementos:**
- Colunas: Novo · Contato feito · Qualificado · Proposta enviada · Negociação · Fechado · Perdido
- Cards com: nome · empresa · temperatura · responsável · data de criação
- Drag & drop entre colunas com confirmação de mudança de status
- Contador de leads + valor estimado por coluna
- Botão flutuante "Novo lead" (primary)
- Filtro rápido por responsável (topbar da view)

**Conexões:**
- Card → `/leads/[id]`
- "Novo lead" → `/leads/novo`

---

### `/leads/[id]`

**Objetivo:** Ver e gerenciar um lead específico.

**Elementos:**
- Header do lead: Nome + empresa + badge de status + temperatura + botões de ação
- Ações disponíveis: "Editar" · "Converter para cliente" · "Criar orçamento" · "Arquivar"
- Painel lateral esquerdo (1/3): dados rápidos (responsável, fonte, tag, contato, orçamento estimado)
- Área central (2/3) com abas:
  - **Visão geral:** resumo de dados + notas
  - **Timeline:** histórico cronológico de interações e mudanças de status
  - **Tarefas:** tarefas vinculadas ao lead
- Formulário de nova atividade (nota, ligação, e-mail, reunião)

**Conexões:**
- "Editar" → `/leads/[id]/editar`
- "Converter para cliente" → `/clientes/novo` (pré-preenchido)
- "Criar orçamento" → `/orcamentos/novo` (pré-vinculado ao lead)
- Timeline → `[id]/timeline`
- Voltar → `/leads` (preservando filtros)

---

### `/leads/[id]/editar`

**Objetivo:** Editar dados do lead.

**Elementos:** Mesmo formulário de `/leads/novo` pré-preenchido.

**Conexões:**
- Salvar → `/leads/[id]` com toast "Lead atualizado"
- Cancelar → `/leads/[id]`

---

### `/leads/[id]/timeline`

**Objetivo:** Histórico completo de atividades do lead.

**Elementos:**
- Timeline vertical cronológica (mais recente no topo)
- Filtro por tipo de evento: nota · status · e-mail · ligação · reunião
- Cada item: tipo de evento + autor + data + conteúdo resumido
- Formulário inline: adicionar nova nota ou atividade

**Conexões:**
- Voltar → `/leads/[id]`

---

## 6. CRM & Pipeline — Clientes (Hub 360°)

### `/clientes`

**Objetivo:** Listar e gerenciar todos os clientes do tenant.

**Elementos:**
- `PageHeader`: "Clientes" + botão primário "Novo cliente"
- Filtros: status · segmento · responsável · cidade · período de cadastro
- `<DataTable>` com colunas: Nome · CPF/CNPJ · E-mail · Telefone · Responsável · Último pedido · Status
- Menu de linha: Ver 360° · Editar · Criar orçamento · Inativar

**Conexões:**
- "Novo cliente" → `/clientes/novo`
- Linha → `/clientes/[id]`

---

### `/clientes/novo`

**Objetivo:** Cadastrar novo cliente.

**Elementos:**
- Formulário em seções:
  - **Dados pessoais:** nome · CPF/CNPJ · data de nascimento · nacionalidade
  - **Contato:** e-mail(s) · telefone(s) · WhatsApp
  - **Endereço:** CEP + autopreenchimento
  - **Perfil de viagem:** destinos preferidos · classe preferida · restrições alimentares · observações
- Botões: "Cancelar" + "Salvar cliente" (primário)

**Conexões:**
- Sucesso → `/clientes/[id]`

---

### `/clientes/[id]`

**Objetivo:** Hub 360° do cliente — visão completa em abas.

**Elementos:**
- Header: nome + avatar + badge de status + ações rápidas
- Ações: "Criar orçamento" · "Iniciar conversa" · "Nova tarefa" · "Editar"
- Painel lateral (1/3): dados essenciais (contato, responsável, tags, última interação)
- Área central (2/3) com abas:

| Aba | Rota | Conteúdo |
|---|---|---|
| Dados | `/clientes/[id]/dados` | Dados pessoais e contatos completos |
| Documentos | `/clientes/[id]/documentos` | Passaporte, vistos, documentos anexados |
| Pedidos | `/clientes/[id]/pedidos` | Todos os pedidos vinculados ao cliente |
| Financeiro | `/clientes/[id]/financeiro` | Histórico de cobranças e pagamentos |
| Histórico | `/clientes/[id]/historico` | Atendimentos e interações passadas |
| Milhas | `/clientes/[id]/milhas` | Programas de fidelidade e saldos |
| Preferências | `/clientes/[id]/preferencias` | Perfil completo de viagem |
| Timeline | `/clientes/[id]/timeline` | Linha do tempo de toda a relação |

**Conexões:**
- "Criar orçamento" → `/orcamentos/novo?cliente=[id]`
- "Iniciar conversa" → `/comunicacao/whatsapp?cliente=[id]`
- Pedido na aba → `/pedidos/[id]`
- Fatura na aba → `/financeiro/billing/invoices?cliente=[id]`

---

### `/clientes/[id]/documentos`

**Elementos:**
- Lista de documentos por categoria: Passaporte · Visto · RG · CNH · Outros
- Upload drag & drop com preview para PDF e imagens
- Data de validade por documento com alerta de vencimento próximo
- Botão "Solicitar documento" (envia mensagem ao cliente)

---

### `/clientes/[id]/milhas`

**Elementos:**
- Cards por programa de fidelidade: LATAM Pass · Smiles · TudoAzul · outros
- Saldo atual + validade dos pontos
- Histórico de acúmulo/resgate
- Campo para adicionar programa manualmente

---

## 7. CRM & Pipeline — Orçamentos

### `/orcamentos`

**Objetivo:** Listar e gerenciar todos os orçamentos do tenant.

**Elementos:**
- `PageHeader`: "Orçamentos" + "Novo orçamento" (primário)
- Filtros: status · cliente · responsável · período · valor (range)
- `<DataTable>` colunas: Nº · Cliente · Destino · Valor · Status · Responsável · Validade · Criado em
- Badges de status: Rascunho (muted) · Enviado (info) · Em aprovação (warning) · Aprovado (success) · Recusado (destructive) · Expirado (destructive)
- Menu de linha: Ver · Duplicar · Converter em pedido · Cancelar

**Conexões:**
- "Novo orçamento" → `/orcamentos/novo`
- Linha → `/orcamentos/[id]`

---

### `/orcamentos/novo`

**Objetivo:** Criar novo orçamento.

**Elementos:**
- Formulário em seções:
  - **Cliente:** busca/seleção (autocomplete) ou "Criar novo cliente"
  - **Destino & datas:** origem · destino · data ida/volta · duração
  - **Passageiros:** adultos · crianças · bebês (com idades)
  - **Serviços:** checkboxes de aéreo · hotel · transfer · passeios · seguro · visto
  - **Geração IA:** botão "Gerar Roteiro AI" → abre drawer com opções de geração
  - **Financeiro:** valor estimado · moeda · forma de pagamento prevista
  - **Validade:** data de expiração do orçamento
- Botões: "Salvar rascunho" (secundário) + "Salvar e enviar" (primário)

**Conexões:**
- Salvar → `/orcamentos/[id]`
- "Gerar Roteiro AI" → drawer de configuração da IA → `/orcamentos/[id]/roteiro`

---

### `/orcamentos/[id]`

**Objetivo:** Ver e gerenciar o orçamento completo.

**Elementos:**
- Header: Nº do orçamento + cliente + status + validade + ações
- Ações: "Editar" · "Enviar para cliente" · "Converter em pedido" · "Duplicar" · "Cancelar"
- Abas:

| Aba | Rota | Conteúdo |
|---|---|---|
| Resumo | `/orcamentos/[id]` | Dados gerais, serviços, valor total |
| Roteiro IA | `/orcamentos/[id]/roteiro` | Roteiro gerado, edição e aprovação |
| Proposta | `/orcamentos/[id]/proposta` | Preview formatado para o cliente |
| PDF | `/orcamentos/[id]/pdf` | Geração e download do PDF |
| Aprovação | `/orcamentos/[id]/aprovacao` | Status de aprovação e histórico |

**Conexões:**
- "Converter em pedido" → `/pedidos/novo?orcamento=[id]` (confirmação com dialog)
- "Enviar para cliente" → dialog de envio (e-mail + WhatsApp)
- Cliente → `/clientes/[id]`
- Voltar → `/orcamentos`

---

### `/orcamentos/[id]/roteiro`

**Objetivo:** Visualizar e editar o roteiro gerado pela IA.

**Elementos:**
- Editor de texto rico com o roteiro gerado
- Botão "Regenerar" com opções (tom, estilo, detalhamento)
- Botão "Aprovar roteiro" → move para proposta
- Histórico de versões geradas
- Custo da geração (tokens utilizados) com link para `/custos/roteiros`

---

### `/orcamentos/[id]/aprovacao`

**Objetivo:** Gerenciar o fluxo de aprovação do orçamento pelo cliente.

**Elementos:**
- Status atual: "Aguardando aprovação do cliente"
- Link público de aprovação (copiável) + QR Code
- Histórico: quem viu, quando, o que respondeu
- Botão "Registrar aprovação manual" (quando cliente aprova por fora do sistema)
- Botão "Cancelar aprovação pendente"

---

## 8. CRM & Pipeline — Pedidos

### `/pedidos`

**Objetivo:** Listar e gerenciar todos os pedidos/vendas do tenant.

**Elementos:**
- `PageHeader`: "Pedidos" + "Novo pedido" (primário)
- Filtros: status · cliente · responsável · período · destino · valor
- `<DataTable>` colunas: Nº · Cliente · Destino · Datas da viagem · Valor · Status · Responsável
- Badges: Confirmado (success) · Em andamento (info) · Concluído (success) · Cancelado (destructive)

**Conexões:**
- Linha → `/pedidos/[id]`

---

### `/pedidos/[id]`

**Objetivo:** Gestão completa de um pedido confirmado.

**Elementos:**
- Header: Nº + cliente + status + datas da viagem + valor total + ações
- Ações: "Editar" · "Emitir cobrança" · "Cancelar pedido"
- Abas:

| Aba | Rota | Conteúdo |
|---|---|---|
| Resumo | `/pedidos/[id]` | Serviços, valor, datas, responsável |
| Passageiros | `/pedidos/[id]/passageiros` | Dados de cada passageiro |
| Fornecedores | `/pedidos/[id]/fornecedores` | Serviços contratados e fornecedores |
| Financeiro | `/pedidos/[id]/financeiro` | Cobranças e pagamentos vinculados |
| Timeline | `/pedidos/[id]/timeline` | Histórico de status e atividades |

**Conexões:**
- "Emitir cobrança" → `/financeiro/billing/invoices/novo?pedido=[id]`
- Cliente → `/clientes/[id]`
- Orçamento de origem → `/orcamentos/[id]`

---

### `/pedidos/[id]/passageiros`

**Elementos:**
- Lista de passageiros com: nome · CPF · passaporte · data de nascimento · tipo (adulto/criança/bebê)
- Botão "Adicionar passageiro" → drawer de formulário
- Alertas de documentos vencidos ou faltantes

---

### `/pedidos/[id]/fornecedores`

**Elementos:**
- Lista de serviços contratados: tipo · fornecedor · valor de custo · valor de venda · margem
- Botão "Adicionar serviço" → drawer
- Cálculo automático de margem total

---

## 9. Financeiro

### `/financeiro` → redirect para `/financeiro/overview`

### `/financeiro/overview`

**Objetivo:** Saúde financeira consolidada do tenant.

**Elementos:**
- `PageHeader`: "Financeiro" + seletor de período
- KPIs: Receita bruta · Despesas · Resultado líquido · Inadimplência · Saldo em caixa
- Gráfico: receita vs. despesa (barras por mês)
- Cards de ação rápida: "Registrar recebimento" · "Registrar pagamento" · "Nova despesa"
- Alertas: cobranças vencendo hoje + lançamentos sem classificação

**Conexões:**
- KPI → subpágina correspondente
- Alerta → entidade específica

---

### `/financeiro/contas-receber`

**Objetivo:** Carteira de recebíveis dos clientes finais.

**Elementos:**
- KPIs: Total a receber · Vencido · A vencer 30d · Recebido no período
- Filtros: status (a vencer / vencido / recebido) · cliente · período
- `<DataTable>` colunas: Cliente · Referência (pedido/orçamento) · Valor · Vencimento · Status · Ação
- Bulk action: "Enviar lembrete de cobrança"
- Menu de linha: Registrar recebimento · Renegociar · Emitir cobrança · Ver pedido

**Conexões:**
- Registrar recebimento → drawer de baixa manual
- Ver pedido → `/pedidos/[id]`
- Emitir cobrança → `/financeiro/billing/invoices`

---

### `/financeiro/contas-pagar`

**Objetivo:** Controle de obrigações e pagamentos a fornecedores.

**Elementos:**
- KPIs: Total a pagar · Vencido · A vencer 30d · Pago no período
- Filtros: status · fornecedor · categoria · período
- `<DataTable>` colunas: Fornecedor · Descrição · Valor · Vencimento · Centro de custo · Status
- Menu de linha: Registrar pagamento · Cancelar · Editar · Anexar comprovante

---

### `/financeiro/fluxo-caixa`

**Objetivo:** Previsão e realizado de entradas/saídas.

**Elementos:**
- Seletor de granularidade: por dia / semana / mês
- Gráfico de linha: previsto vs. realizado
- Tabela: data · descrição · tipo (entrada/saída) · valor · saldo acumulado
- Indicador visual de risco de ruptura (saldo negativo previsto)

---

### `/financeiro/conciliacao`

**Objetivo:** Conciliar lançamentos internos com extratos bancários/gateways.

**Elementos:**
- Upload de extrato bancário (OFX, CSV)
- Lista de lançamentos não conciliados (dois lados: sistema vs. extrato)
- Ação de conciliar par a par (drag ou checkbox)
- Indicador de saldo a conciliar

---

### `/financeiro/resultado`

**Objetivo:** Demonstrativo de resultado do tenant por período.

**Elementos:**
- Seletor de período (mês/trimestre/ano)
- DRE simplificado: Receita bruta · Deduções · Receita líquida · Custos · Despesas · Resultado
- Comparativo com período anterior
- Drill-down por categoria

---

## 10. Billing do Tenant

> Ver mapa completo de páginas em [DESIGN.md §14](./DESIGN.md#14-módulo-billing--execução-por-app).

### `/financeiro/billing/overview`

**Objetivo:** Saúde de receita do tenant e carteira de cobrança.

**Elementos:**
- KPIs: Faturado no período · Recebido · Em aberto · Inadimplente
- Gráfico de barras: faturas emitidas vs. pagas por mês
- Alertas: faturas vencidas há mais de 30 dias
- CTA rápido: "Emitir cobrança" (primário)

---

### `/financeiro/billing/invoices`

**Objetivo:** Emissão e gestão de faturas para clientes finais.

**Elementos:**
- Botão "Emitir cobrança" (primário)
- Filtros: status · cliente · período · valor
- `<DataTable>` colunas: Nº fatura · Cliente · Pedido · Valor · Emissão · Vencimento · Status
- Menu de linha: Ver · Enviar · Cancelar · Emitir segunda via · Registrar pagamento

---

### `/financeiro/billing/settings`

**Objetivo:** Regras de cobrança do tenant.

**Elementos:**
- Configuração de juros e multa por atraso
- Meios de pagamento aceitos (toggle por gateway)
- Templates de e-mail de cobrança
- Dados fiscais (CNPJ, razão social, endereço para NF)
- Botão "Salvar configurações" (primário)
- Alert de impacto antes de salvar mudanças que afetam cobranças futuras

---

## 11. Conteúdo IA

### `/conteudo`

**Objetivo:** Hub de produção de conteúdo com IA.

**Elementos:**
- `PageHeader`: "Conteúdo" + "Criar conteúdo" (primário)
- Cards de acesso rápido por tipo: Roteiros · Artigos · Templates · SEO
- Estatísticas do período: peças criadas · publicadas · custo de IA
- Fila de revisão pendente (lista compacta)

---

### `/conteudo/roteiros` e `/conteudo/roteiros/a-publicar`

**Elementos:**
- Tabs: "A publicar" | "Publicados"
- Filtros: responsável · destino · data de criação
- `<DataTable>` colunas: Título · Destino · Status · Responsável · Criado em · Ações
- Menu de linha: Editar · Usar em orçamento · Publicar · Arquivar

**Conexões:**
- "Usar em orçamento" → `/orcamentos/novo` ou `/orcamentos/[id]/roteiro`

---

### `/conteudo/artigos` e `/conteudo/artigos/a-publicar`

**Elementos:** Idêntico aos roteiros, com ação "Publicar no Blog" ao invés de "Usar em orçamento".

**Conexões:**
- "Publicar no Blog" → `/site/blog`
- "Publicar no Social" → `/social/posts/novo`

---

### `/conteudo/seo`

**Objetivo:** Gerenciar palavras-chave, metadados e estratégia de SEO do conteúdo.

**Elementos:**
- Lista de palavras-chave monitoradas com volume e posição estimada
- Sugestões de pautas baseadas em palavras-chave (IA)
- Metadados globais do site (title, description padrão)
- Sitemap status

---

## 12. Marketing & Social

### `/marketing`

**Objetivo:** Hub de marketing e distribuição.

**Elementos:**
- Cards de acesso: Social · E-mail · Campanhas · Automações · Analytics
- Resumo de performance: alcance semanal · posts agendados · e-mails enviados

---

### `/marketing/email`

**Elementos:**
- Botão "Nova campanha" (primário)
- Lista de campanhas: enviadas / em rascunho / agendadas
- KPIs: Taxa de abertura · Taxa de clique · Cancelamentos
- Integrações: status de conexão com provedor (Mailchimp, Brevo, etc.)

---

### `/social/posts`

**Elementos:**
- Botão "Novo post" (primário)
- Filtros: canal · status · responsável · período
- Lista de posts com preview de imagem, texto resumido, canal, status e data agendada
- Menu de linha: Editar · Publicar agora · Reagendar · Excluir

---

### `/social/calendario`

**Objetivo:** Visão de calendário editorial da agência.

**Elementos:**
- Calendário mensal com posts agendados por dia e canal
- Drag & drop para reagendar
- Mini-preview ao hover no post
- Botão flutuante "Agendar post" (primário)

---

## 13. Atendimento Omnichannel

### `/comunicacao`

**Objetivo:** Central de atendimento — todas as conversas ativas em todos os canais.

**Layout:** 3 colunas (ver Layout D no DESIGN.md §9).

**Coluna esquerda (lista de conversas):**
- Abas de fila: Minhas · Aguardando · Todos · Finalizados
- Busca de conversa
- Card de conversa: avatar · nome · canal (ícone) · preview da última mensagem · horário · badge de não lidas

**Coluna central (chat ativo):**
- Header da conversa: nome · canal · status · ações (transferir, finalizar, atribuir)
- Histórico de mensagens com scroll infinito
- Diferenciação visual: mensagem do agente (direita) · cliente (esquerda) · nota interna (fundo amarelo)
- Campo de resposta: texto + emoji + anexo + botão de template
- Botão "Finalizar atendimento" (destrutivo com confirmação)

**Coluna direita (contexto):**
- Dados do cliente (se vinculado): nome, histórico de pedidos, última compra
- Botão "Vincular cliente" → busca em `/clientes`
- Botão "Criar lead" (se não for cliente)
- Ações rápidas: "Criar tarefa" · "Criar ticket" · "Abrir no CRM"
- Tags da conversa

**Conexões:**
- Cliente vinculado → `/clientes/[id]`
- "Criar ticket" → `/support/tickets/novo?conversa=[id]`

---

### `/comunicacao/chatbot`

**Objetivo:** Configurar o chatbot de atendimento automático.

**Elementos:**
- Editor de fluxo visual (nós e conexões)
- Biblioteca de respostas pré-definidas
- Configuração de horário de atendimento
- Regras de transferência para humano (palavras-chave, horário, tentativas)
- Status do chatbot: Ativo / Pausado / Em teste
- Botão "Salvar fluxo" (primário) + "Testar bot" (secundário)

---

## 14. Support & Tickets

### `/support/tickets`

**Objetivo:** Listar e gerenciar todos os tickets de suporte.

**Elementos:**
- `PageHeader`: "Tickets" + "Novo ticket" (primário)
- Filtros: status · prioridade · responsável · canal de origem · período
- `<DataTable>` colunas: Nº · Assunto · Cliente · Prioridade · Status · Responsável · Aberto em · SLA
- Badge de SLA: verde (no prazo) · amarelo (risco) · vermelho (violado)
- Menu de linha: Ver · Atribuir · Resolver · Fechar · Reabrir

**Conexões:**
- Linha → `/support/[id]`

---

### `/support/[id]`

**Objetivo:** Gerenciar um ticket de suporte específico.

**Elementos:**
- Header: Nº · assunto · status · prioridade · SLA countdown · ações
- Fio de mensagens (histórico do atendimento)
- Painel lateral: dados do cliente · pedido vinculado · histórico de tickets do cliente
- Campo de resposta + toggle "Nota interna"
- Ações: "Resolver" · "Escalar" · "Transferir" · "Fechar"

**Conexões:**
- Cliente → `/clientes/[id]`
- Pedido → `/pedidos/[id]`

---

### `/support/sla`

**Objetivo:** Monitorar cumprimento de SLA por fila, agente e canal.

**Elementos:**
- KPIs: Taxa de cumprimento de SLA (%) · TMA (tempo médio de atendimento) · TMPR (primeira resposta)
- Gráfico por período
- Tabela de violações por ticket

---

## 15. Tarefas

### `/tarefas`

**Objetivo:** Hub de tarefas do tenant.

**Elementos:**
- Abas: Minhas · Equipe · Calendário
- Filtros: status · responsável · entidade vinculada · vencimento
- `<DataTable>` colunas: Título · Vínculo (lead/cliente/pedido) · Responsável · Vencimento · Status · Prioridade
- Botão "Nova tarefa" (primário)

---

### `/tarefas/calendario`

**Objetivo:** Visualização calendário de tarefas e compromissos.

**Elementos:**
- Calendário mensal/semanal/diário (toggle de view)
- Tarefas e compromissos como eventos
- Filtro por responsável
- Criação rápida de tarefa ao clicar em data/hora

---

## 16. Custos IA

### `/custos`

**Objetivo:** Hub de controle de custos de uso de IA do tenant.

**Elementos:**
- KPIs: Custo total do período · Custo por tipo (roteiro/artigo/imagem) · Tokens consumidos · Projeção do mês
- Alerta se consumo > 80% do limite do plano
- Gráfico de consumo por dia/semana
- Cards por categoria: Roteiros · Artigos · Imagens · Tokens

**Conexões:**
- Card → subpágina correspondente (`/custos/roteiros`, etc.)
- Alerta de limite → `/configuracoes/plano`

---

### `/custos/tokens`

**Objetivo:** Detalhe de consumo de tokens por modelo e operação.

**Elementos:**
- Tabela: modelo (ex: GPT-4o, Claude) · operação · tokens input · tokens output · custo · data
- Filtros: modelo · operação · período
- Exportação CSV

---

## 17. Meu Site

### `/site`

**Objetivo:** Hub de gestão do site publicado da agência.

**Elementos:**
- Preview do site atual (iframe ou thumbnail)
- Status de publicação: Publicado em `[slug].sites.noro.guru` · Último update
- KPIs: Visitas (30d) · Páginas mais acessadas · Leads gerados pelo site
- Ações rápidas: "Editar site" · "Ver site publicado" · "Configurar domínio"

---

### `/site/editor`

**Objetivo:** Editor visual do site da agência.

**Elementos:**
- Canvas de edição WYSIWYG (ou por seções/blocos)
- Painel de blocos disponíveis (arrastar e soltar)
- Configuração de cores e tipografia do site
- Preview mobile/tablet/desktop
- Botão "Salvar rascunho" (secundário) + "Publicar" (primário)
- Histórico de versões

**Conexões:**
- Publicar → aciona build em `/site/publicacao` + deploy em `[slug].sites.noro.guru`

---

### `/site/publicacao`

**Objetivo:** Status e controle do processo de publicação.

**Elementos:**
- Status atual: Publicado / Em build / Com erro / Despublicado
- Histórico de publicações com data, autor e status
- Botão "Publicar agora" (primário) · "Despublicar" (destrutivo com confirmação)
- Log de build (expansível)

---

### `/site/dominio`

**Objetivo:** Configurar domínio personalizado do site.

**Elementos:**
- Slug atual: `[slug].sites.noro.guru` (editável com validação de disponibilidade)
- Seção de domínio customizado: campo de domínio + instruções de DNS
- Status de verificação do domínio: Pendente / Verificado / Erro de DNS
- Botão "Verificar domínio" + instruções passo a passo

---

## 18. Relatórios

### `/relatorios`

**Objetivo:** Hub de relatórios analíticos do tenant.

**Elementos:**
- Cards de acesso: Comercial · Financeiro · Marketing · Operacional
- Seletor de período global (aplicado a todos)
- Botão "Exportar" (PDF/CSV) disponível em cada relatório

---

### `/relatorios/comercial`

**Elementos:**
- Funil de conversão (leads → clientes → orçamentos → pedidos → receita)
- Taxa de conversão por estágio
- Top responsáveis por performance
- Top destinos vendidos no período
- Ticket médio por período

---

### `/relatorios/financeiro`

**Elementos:**
- DRE simplificado do período
- Gráfico de evolução de receita vs. despesa
- Análise de inadimplência
- Evolução do fluxo de caixa

---

### `/relatorios/marketing`

**Elementos:**
- Performance por canal (social, e-mail, blog)
- Conteúdo com melhor engajamento
- Custo de IA vs. alcance gerado
- Leads gerados por canal

---

## 19. Configurações & Governança

### `/configuracoes`

**Objetivo:** Hub de configurações do tenant.

**Elementos:**
- Menu lateral com seções (ou cards grid)
- Resumo de saúde da conta: % de perfil completo · integrações ativas · plano atual

---

### `/configuracoes/equipe`

**Elementos:**
- Lista de membros: avatar · nome · e-mail · role · status (ativo/convidado/inativo)
- Botão "Convidar membro" (primário) → drawer com e-mail + seleção de role
- Menu de linha: Editar role · Desativar · Revogar acesso

**Conexões:**
- "Convidar" → gera token → `/convites/[token]` (enviado por e-mail)
- Ver convites pendentes → `/configuracoes/convites`

---

### `/configuracoes/convites`

**Elementos:**
- Lista de convites enviados: e-mail · role · data de envio · status (pendente / expirado / aceito)
- Botão "Reenviar" por convite expirado
- Botão "Cancelar convite" (destrutivo)

---

### `/configuracoes/plano`

**Objetivo:** Visualizar plano atual e gerenciar upgrade.

**Elementos:**
- Card do plano atual: nome · limites (usuários, IA tokens/mês, sites) · próxima cobrança
- Uso atual vs. limite (barras de progresso por recurso)
- Comparativo de planos disponíveis
- Botão "Fazer upgrade" (primário) → handoff para Control Billing

---

### `/configuracoes/pagamentos`

**Elementos:**
- Gateways conectados: Stripe · Cielo · BTG Pactual · Pix
- Status de cada conexão: Conectado / Erro / Desconectado
- Botão "Configurar" por gateway → drawer de configuração de credenciais
- Chave de API mascarada (revelar com confirmação de senha)

---

### `/configuracoes/api`

**Elementos:**
- Lista de API keys do tenant: nome · prefixo · criada em · último uso · permissões
- Botão "Criar nova chave" (primário) → dialog com nome + permissões + expiração
- Revogar chave (destrutivo com confirmação + digitar "REVOGAR")

---

### `/configuracoes/webhooks`

**Elementos:**
- Lista de endpoints registrados: URL · eventos · status (ativo/inativo) · último disparo
- Botão "Adicionar endpoint" (primário)
- Menu de linha: Editar · Testar · Desativar · Excluir
- Log de entregas por endpoint (expansível)

---

## 20. Notificações

### `/notificacoes`

**Objetivo:** Central de notificações do operador logado.

**Elementos:**
- Filtros: todas · não lidas · por tipo (comercial / financeiro / sistema / atendimento)
- Lista de notificações: ícone de tipo · texto · timestamp · badge "não lida"
- Ações em lote: "Marcar todas como lidas" · "Limpar notificações antigas"
- Cada notificação é clicável → vai para entidade relacionada

**Conexões:**
- Notificação de lead → `/leads/[id]`
- Notificação de pagamento → `/financeiro/billing/invoices`
- Notificação de SLA → `/support/[id]`
- Notificação de cobrança vencida → `/financeiro/contas-receber`

---

*DESIGN-CORE.md — Especificação de páginas, elementos e conexões do Core.*
*Proprietário: Paulo Bolliger. Última revisão: 2026-05-24.*
