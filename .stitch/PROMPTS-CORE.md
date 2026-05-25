# PROMPTS-CORE.md — Prompts Stitch para app.noro.guru

> App: `app.noro.guru` · Design System: **"Noro Core — Light"**
> Antes de usar estes prompts: execute o [STITCH-SETUP.md](./STITCH-SETUP.md) para criar o design system.
> Especificação completa de cada página: ver [DESIGN-CORE.md](./DESIGN-CORE.md)

---

## Como usar

1. Projeto Stitch já criado? ✓
2. Design system "Noro Core — Light" já criado? ✓
3. Cole o prompt de uma tela no `generate_screen_from_text`
4. Após gerar, aplique o design system "Noro Core — Light" via `apply_design_system`

Os prompts descrevem **conteúdo e comportamento**. Cores, fontes e espaçamentos vêm do design system.

---

## SHELL GLOBAL

### Sidebar

```text
Crie o componente Sidebar do app app.noro.guru. Shell lateral esquerda, 240px de largura.

Elementos de cima para baixo:
- Logo Noro Guru (topo)
- TenantSelector: dropdown com nome do tenant ativo e chevron
- Grupos de navegação com label de seção em caps pequeno:
  - COMERCIAL: Leads, Clientes, Orçamentos, Pedidos
  - FINANCEIRO: Financeiro, Billing
  - CONTEÚDO: Conteúdo IA, Marketing, Social
  - ATENDIMENTO: Comunicação, Suporte, Tarefas
  - CONFIGURAÇÕES: Meu Site, Relatórios, Configurações
- Item ativo com indicador visual de borda esquerda
- Rodapé: avatar + nome do usuário + link para perfil + botão sair

Estado colapsado (56px): apenas ícones com tooltip no hover.
Estado mobile: drawer overlay com backdrop.
Ícones: Lucide.
```

---

### Topbar

```text
Crie o componente Topbar do app app.noro.guru. Barra superior fixa, altura 56px, largura total menos sidebar.

Elementos da esquerda para direita:
- Botão hamburger (toggle da sidebar, visível em tablet/mobile)
- Breadcrumb: ícone home + setas + até 3 níveis, último nível em bold
- Espaço flexível
- Campo de busca global: ícone lupa + placeholder "Buscar... (Ctrl+K)", largura 280px
- Ícone de notificações com badge de contagem não lida
- Avatar circular com iniciais ou foto + dropdown: Meu perfil, Configurações, Sair
```

---

## AUTENTICAÇÃO & ONBOARDING

### Login — `/login`

```text
Crie a tela de login do app app.noro.guru. Sem sidebar ou topbar.

Layout: tela dividida em 2 colunas iguais.

Coluna esquerda (fundo primário sólido): logo centralizado, tagline "O sistema operacional da agência moderna.", ilustração geométrica sutil.

Coluna direita (fundo branco): card centralizado verticalmente, max-width 400px.
- Título "Bem-vindo de volta"
- Subtítulo "Entre na sua conta"
- Campo E-mail
- Campo Senha com toggle de visibilidade
- Row: checkbox "Lembrar-me" (esquerda) + link "Esqueci minha senha" (direita)
- Botão "Entrar" full-width, estilo primário
- Divider "ou"
- Botão "Entrar com Google" full-width, estilo secundário com ícone Google
- Link inferior: "Não tem conta? Criar conta gratuita"

Estado de erro: borda vermelha nos campos + mensagem abaixo do botão.
Estado loading: botão com spinner, campos desabilitados.
```

---

### Cadastro — `/cadastro`

```text
Crie a tela de cadastro do app app.noro.guru. Mesmo layout de 2 colunas do login.

Coluna esquerda: igual ao login.
Coluna direita: card centralizado, max-width 420px.
- Título "Criar sua conta"
- Subtítulo "Comece grátis. Sem cartão de crédito."
- Campo Nome completo
- Campo E-mail
- Campo Nome da agência
- Campo Telefone / WhatsApp com máscara BR
- Campo Senha com indicador visual de força (barra: fraca / média / forte)
- Campo Confirmar senha
- Checkbox com link para Termos de Serviço e Política de Privacidade
- Botão "Criar conta" full-width, estilo primário
- Link inferior: "Já tem conta? Entrar"
```

---

### Onboarding — Passo 1 — `/onboarding/agencia`

```text
Crie o passo 1 do wizard de onboarding do app app.noro.guru. Sem sidebar. Header mínimo com logo centralizado.

Layout: card centralizado, max-width 560px.
- Indicador de progresso no topo: 4 etapas, etapa 1 ativa. Label "Passo 1 de 4"
- Título "Vamos conhecer sua agência"
- Subtítulo descritivo muted
- Campo Nome da agência (pré-preenchido se disponível)
- Campo CNPJ com máscara (opcional)
- Select "Tamanho da equipe": 1 consultor / 2–5 / 6–15 / 16–50 / 50+
- Select "Principal serviço": Viagens nacionais / Internacionais / Pacotes / Vistos / Todos
- Campo Site atual (URL, opcional)
- Botão "Próximo →" full-width, estilo primário
- Link "Pular por agora" em muted abaixo
```

---

### Onboarding — Passo 2 — `/onboarding/pipeline`

```text
Crie o passo 2 do wizard de onboarding. Mesma estrutura do passo 1 com etapa 2 ativa.

- Título "Configure seu pipeline de vendas"
- Subtítulo explicativo

Lista de etapas do pipeline com drag-and-drop (handles à esquerda):
- Novo Lead
- Qualificado
- Proposta Enviada
- Negociação
- Fechado — Ganho
- Fechado — Perdido

Botão "+ Adicionar etapa" abaixo da lista (estilo ghost com ícone +).
Nota informativa: "Você pode personalizar as etapas depois em Configurações."
Botões lado a lado: "← Voltar" (ghost) e "Próximo →" (primário).
```

---

### Onboarding — Passo 3 — `/onboarding/whatsapp`

```text
Crie o passo 3 do wizard de onboarding. Etapa 3 ativa no indicador de progresso.

- Título "Conecte seu WhatsApp"
- Subtítulo explicativo

3 opções em cards clicáveis de seleção única:
- "WhatsApp Business API" — badge "Mais recursos", descrição "Mensagens ilimitadas, automações, chatbot"
- "Conexão via QR Code" — descrição "Conecte seu número existente em 1 minuto"
- "Pular por agora" — estilo ghost/muted

Ao selecionar "QR Code": área abaixo exibe QR Code placeholder 200×200px com instrução "Abra o WhatsApp → Aparelhos conectados → Conectar aparelho".

Botões: "← Voltar" e "Próximo →".
```

---

### Onboarding — Passo 4 — `/onboarding/equipe`

```text
Crie o passo 4 (último) do wizard de onboarding. Etapa 4 ativa.

- Título "Convide sua equipe"
- Subtítulo explicativo

Campo de convite em linha: input de email + select de role (Comercial / Financeiro / Atendimento / Admin) + botão "Adicionar". Permite múltiplas linhas.

Lista de convites adicionados: avatar com iniciais + email + badge de role + botão X para remover.

Card informativo azul: "Cada membro receberá um e-mail de convite. Você pode convidar mais pessoas depois."

Botões: "← Voltar" e "Ir para o painel →" (primário, preenchido).
Após clicar em "Ir para o painel": animação de celebração/confetti e redirect para /dashboard.
```

---

## DASHBOARD

### Dashboard Principal — `/dashboard`

```text
Crie a tela de Dashboard principal do app app.noro.guru. Shell completo: Sidebar (item "Dashboard" ativo) + Topbar. Breadcrumb: "Dashboard".

PageHeader: "Bom dia, [Nome] 👋", subtítulo "Aqui está o resumo do dia". Sem botão de ação.

Linha 1 — 4 cards de KPI em row:
- "Leads ativos" com ícone Users, número grande, variação % vs mês anterior
- "Orçamentos abertos" com ícone FileText, número e variação
- "Receita do mês" com ícone TrendingUp, valor em R$, variação
- "Tarefas pendentes" com ícone CheckSquare, número, badge vermelho de urgentes

Linha 2 — 2 colunas (60/40):
- Card "Pipeline de Vendas": kanban mini com 5 colunas (Novo / Qualificado / Proposta / Negociação / Fechado), cards com nome do lead + valor, contagem por coluna no header
- Card "Próximas Tarefas": lista de 5 tarefas com checkbox, nome, prazo (vermelho se vencido), avatar do responsável

Linha 3 — 2 colunas (50/50):
- Card "Mensagens recentes": lista de 4 conversas com avatar, nome, preview de mensagem, timestamp, badge de não lidas
- Card "Receita x Meta": gráfico de barras por mês com linha de meta
```

---

### Dashboard Comercial — `/dashboard/comercial`

```text
Crie a tela Dashboard Comercial. Shell completo. PageHeader com tabs: "Geral" | "Comercial" (ativa) | "Financeiro" | "Marketing".

5 KPIs em row: Leads novos no mês (com sparkline) | Taxa de conversão lead→cliente (%) | Ticket médio dos orçamentos (R$) | Orçamentos aprovados no mês | Ciclo médio de venda (dias).

Seção principal (2 colunas):
- Gráfico de funil: Leads → Qualificados → Proposta → Fechados, percentuais em cada etapa
- Tabela "Top 5 consultores do mês": avatar, nome, leads ativos, orçamentos enviados, taxa de conversão, receita gerada

Seção secundária (2 colunas):
- Gráfico de linha "Leads por canal de origem" (últimos 30 dias): linhas por canal (WhatsApp, Site, Indicação, Redes sociais)
- Card "Orçamentos prestes a vencer": lista com cliente, valor, dias restantes, botão "Ver orçamento"
```

---

## CRM & PIPELINE — LEADS

### Leads — Kanban — `/leads`

```text
Crie a tela de Leads com view Kanban. Shell completo, item "Leads" ativo na sidebar.

PageHeader: "Leads", subtítulo sobre pipeline de prospecção.
Ações: botão "Importar" (ghost) + botão "Novo Lead" (primário, ícone +).
Tabs de view: "Kanban" (ativa) | "Lista" | "Mapa de Calor".

Toolbar: busca por nome/empresa + filtros (Consultor, Canal de origem, Período) + botão "Filtros avançados".

Kanban — 5 colunas com scroll horizontal:
- Colunas: Novo Lead / Qualificado / Proposta Enviada / Negociação / Fechado
- Header de coluna: nome + contagem de cards + valor total em R$
- Cards draggáveis: nome do lead (bold), empresa, valor estimado (badge), canal de origem (ícone: whatsapp/email/site), data da última interação, avatar do consultor, ponto de urgência (vermelho se sem contato há muitos dias)
- Botão "+" no header de cada coluna

Estado empty por coluna: área pontilhada com texto "Arraste leads aqui ou clique em +" e ícone central.
```

---

### Leads — Lista — `/leads?view=lista`

```text
Crie a view de tabela dos Leads. Tab "Lista" selecionada. Mesmo PageHeader e toolbar da view Kanban.

DataTable com colunas:
- Checkbox de seleção
- Nome do lead + empresa (negrito + muted)
- Status badge colorido por etapa (Novo/Qualificado/Proposta/Negociação/Fechado/Perdido)
- Canal de origem (ícone + label)
- Consultor (avatar + nome)
- Valor estimado (R$)
- Última interação (data relativa)
- Ações por linha (kebab): Ver, Editar, Mover etapa, Converter em cliente, Arquivar

Barra de ações bulk (ao selecionar múltiplos): "Mover para etapa", "Atribuir consultor", "Exportar", "Arquivar" + contagem selecionados.

Paginação: 25 por página, seletor de quantidade, navegação.

Estado empty: ilustração + "Nenhum lead encontrado" + botão "Criar primeiro lead".
```

---

### Lead — Detalhe — `/leads/[id]`

```text
Crie a tela de detalhe de um Lead. Shell completo. Breadcrumb: "Leads > João Silva".

Layout: coluna principal (65%) + sidebar de contexto (35%).

Coluna principal:
PageHeader: nome do lead (grande) + badge de status + botões: "Editar", "Converter em Cliente" (primário), kebab (arquivar, deletar).
Tabs: "Visão Geral" (ativa) | "Histórico" | "Tarefas" | "Documentos"

Aba Visão Geral:
- Card "Dados do Lead": nome, empresa, email clicável, telefone/WhatsApp clicável, canal de origem, data de entrada, consultor responsável com select para reatribuir
- Card "Interesse & Qualificação": destino de interesse, período previsto, número de viajantes, orçamento estimado, notas de qualificação (textarea)
- Card "Próxima ação": campos de data/hora + tipo (ligar / email / WhatsApp / reunião) + nota + botão "Salvar ação"

Aba Histórico: timeline vertical de todas as interações, mensagens, mudanças de etapa, orçamentos criados.

Sidebar direita:
- Card "Etapa no Pipeline": select de etapa + data de entrada na etapa atual
- Card "Conversão": valor estimado (R$), probabilidade (slider 0–100%)
- Card "Atividade Rápida": botões "WhatsApp", "E-mail", "Ligar", "Agendar"
- Card "Orçamentos": lista de orçamentos vinculados + botão "Criar orçamento"
```

---

### Drawer — Novo Lead

```text
Crie o drawer de criação de Novo Lead. Painel lateral direito, 520px de largura.

Header: "Novo Lead" + botão X para fechar.

Formulário em seções:
Seção "Contato":
- Nome completo (obrigatório)
- E-mail
- Telefone / WhatsApp
- Empresa/Agência

Seção "Qualificação":
- Etapa inicial (select, padrão: Novo Lead)
- Consultor responsável (select com avatares)
- Canal de origem (select: WhatsApp / Site / Indicação / Redes sociais / Email / Ligação / Evento / Outro)
- Valor estimado (R$)

Seção "Interesse":
- Destino de interesse
- Período previsto (date range picker)
- Número de viajantes
- Notas iniciais (textarea 4 linhas)

Footer: botão "Cancelar" (ghost) + "Criar Lead" (primário).
```

---

## CRM & PIPELINE — CLIENTES

### Clientes — Lista — `/clientes`

```text
Crie a tela de listagem de Clientes. Shell completo, item "Clientes" ativo.

PageHeader: "Clientes", subtítulo descritivo.
Botões: "Novo Cliente" (primário) + "Importar" (ghost).

Toolbar: busca + filtros (Consultor, Categoria VIP/regular, Período) + toggle de view (grid / tabela).

View padrão — Grid de cards (3 colunas):
Por card: avatar com iniciais + nome em bold + email muted + badge categoria (VIP em dourado / regular) + última viagem realizada + valor total gasto em R$ + ícone de acesso rápido ao WhatsApp.

View tabela alternativa: mesmas informações em colunas + LTV + número de pedidos + data do último contato.
```

---

### Cliente — Hub 360° — `/clientes/[id]`

```text
Crie a tela do Hub 360° de um Cliente. Shell completo. Breadcrumb: "Clientes > Maria Oliveira".

Header da página: avatar 64px + nome (grande, bold) + badge VIP dourado (se aplicável) + cidade + email + WhatsApp (clicáveis) + botões: "Editar", "Novo Orçamento" (primário), kebab.

Tabs horizontais:
"Dados" | "Documentos" | "Pedidos" | "Financeiro" | "Histórico" | "Milhas" | "Preferências" | "Timeline"

Aba Dados (padrão):
- Card "Dados Pessoais": nome completo, CPF mascarado, data de nascimento, passaporte (número + validade com alerta se < 6 meses), nacionalidade
- Card "Contato": email, telefone, WhatsApp, endereço
- Card "Dados Comerciais": consultor responsável, categoria, origem, data de cadastro, LTV total

Aba Documentos: grid de cards (passaporte, visto, CNH) com nome, validade, tipo, download, badge "Vencendo" se < 90 dias.

Aba Pedidos: tabela de todos os pedidos com destino, data, status badge, valor, link.

Aba Timeline: feed cronológico de todas as interações, orçamentos, pedidos, mensagens.
```

---

## CRM & PIPELINE — ORÇAMENTOS

### Orçamentos — Lista — `/orcamentos`

```text
Crie a tela de listagem de Orçamentos. Shell completo, item "Orçamentos" ativo.

PageHeader: "Orçamentos". Botão "Novo Orçamento" (primário).
Tabs de filtro: "Todos" | "Rascunho" | "Enviados" | "Aprovados" | "Vencidos"

KPIs acima da tabela (4 valores): Total em aberto (R$) | Aprovados no mês | Taxa de aprovação (%) | Ticket médio.

DataTable:
- Número do orçamento (#ORC-001)
- Cliente (avatar + nome)
- Destino
- Valor total (R$, bold)
- Status badge: Rascunho / Enviado / Aprovado / Vencido / Cancelado
- Válido até (data, alerta visual se < 3 dias)
- Consultor (avatar)
- Ações kebab: Ver, Duplicar, Enviar por e-mail, Converter em Pedido, Deletar
```

---

### Orçamento — Detalhe — `/orcamentos/[id]`

```text
Crie a tela de detalhe de Orçamento. Shell completo. Breadcrumb: "Orçamentos > #ORC-042".

Layout: conteúdo principal (70%) + sidebar (30%).

Conteúdo principal:
PageHeader: "#ORC-042 — Viagem para Portugal" + status badge + botões: "Editar", "Enviar por E-mail", "Baixar PDF", kebab.

Card "Cliente & Viagem": cliente (avatar + nome + link para hub 360°), destino, datas, número de passageiros, tipo de viagem.

Card "Roteiro": seções colapsáveis por dia ("Dia 1 — Lisboa", "Dia 2 — Sintra"...), lista de atividades/hospedagem/transporte por dia com ícones. Botão "Gerar roteiro com IA" em destaque accent.

Card "Itens do Orçamento": tabela com descrição (voo, hotel, passeio), fornecedor, quantidade, valor unitário, total. Rodapé com subtotal, taxas, desconto, TOTAL em bold grande.

Sidebar:
- Card de status + data de validade + botões "Aprovar" (success) / "Recusar" (destrutivo)
- Card "Histórico": timeline de eventos do orçamento
- Card "Aprovação do cliente": link copiável + status de visualização
```

---

## CRM & PIPELINE — PEDIDOS

### Pedidos — Lista — `/pedidos`

```text
Crie a tela de listagem de Pedidos. Shell completo, item "Pedidos" ativo.

PageHeader: "Pedidos". Botão "Novo Pedido" (primário).
Tabs: "Todos" | "Em andamento" | "Confirmados" | "Concluídos" | "Cancelados"

DataTable:
- Número (#PED-001)
- Cliente (avatar + nome)
- Destino + datas
- Status badge
- Passageiros (contagem)
- Valor total (R$)
- Saldo a receber (R$, destaque se positivo)
- Consultor (avatar)
- Ações: Ver, Editar, Cancelar
```

---

### Pedido — Detalhe — `/pedidos/[id]`

```text
Crie a tela de detalhe de Pedido. Shell completo. Breadcrumb: "Pedidos > #PED-023".

PageHeader: "#PED-023 — Lua de mel em Maldivas" + status badge + botões: "Editar", kebab.

Tabs: "Resumo" | "Passageiros" | "Fornecedores" | "Financeiro"

Aba Resumo:
- Card: cliente + destino + datas + número de pax + consultor
- Card "Status do pedido": stepper horizontal (Novo → Confirmado → Pago → Operando → Concluído), step atual destacado
- Card "Checklist de operação": lista de tarefas com checkboxes, responsável e prazo

Aba Passageiros: tabela com nome, CPF, passaporte, data de nascimento, tipo (adulto/criança/bebê), botão "Adicionar passageiro".

Aba Fornecedores: tabela com fornecedor, voucher, localizador, status de confirmação, valor, botão "Adicionar fornecedor".

Aba Financeiro: resumo de receita, custos, margem, contas a receber (parcelas), contas a pagar, saldo.
```

---

## FINANCEIRO

### Financeiro — Overview — `/financeiro`

```text
Crie o overview de Financeiro. Shell completo, item "Financeiro" ativo.

PageHeader: "Financeiro".
Tabs: "Overview" (ativa) | "A Receber" | "A Pagar" | "Fluxo de Caixa" | "Conciliação" | "Resultado"

Aba Overview:
4 KPIs em row: Saldo atual em conta (R$) | A Receber no mês (R$) | A Pagar no mês (R$) | Lucro líquido projetado (R$).

Gráfico principal: barras duplas por mês (últimos 6 meses) — receita vs despesa, linha de saldo. Título "Fluxo Financeiro".

2 colunas:
- "Próximos vencimentos a receber": lista com cliente, valor, dias, badge urgente se hoje/amanhã
- "Próximos vencimentos a pagar": lista com fornecedor, valor, dias, badge urgente

Card "Contas bancárias": lista com saldo atual, nome do banco, tipo (corrente/poupança).
```

---

### Financeiro — Contas a Receber — `/financeiro/contas-receber`

```text
Crie a tela Contas a Receber. Shell completo. Breadcrumb: "Financeiro > A Receber".

KPIs: Total em aberto (R$) | Vencido (R$, destaque erro) | A vencer em 30 dias (R$) | Recebido no mês (R$).

PageHeader com botão "Nova cobrança" (primário). Filtros: status, período, consultor, forma de pagamento.

DataTable:
- Cliente (avatar + nome)
- Pedido vinculado (link)
- Descrição (ex: parcela 1/3)
- Valor (R$)
- Vencimento (data, destaque erro se vencido)
- Status badge: Pendente / Pago / Vencido / Parcialmente pago
- Forma de pagamento (ícone: pix/boleto/cartão/transferência)
- Ações: Registrar pagamento, Editar, Cancelar
```

---

## BILLING

### Billing — Overview — `/billing`

```text
Crie a tela de Billing do tenant. Shell completo, item "Billing" ativo.

PageHeader: "Billing & Assinatura".

Card "Plano atual" com destaque visual (borda primária):
- Nome do plano em bold grande + badge "Ativo"
- Valor mensal em R$ em tamanho display
- Próxima cobrança: data + valor
- Barras de uso: Usuários (X de Y), Storage (X de Y GB), Tokens IA/mês (X de X), Sites (X de Y)
- Botão "Fazer upgrade" (primário) + "Gerenciar assinatura" (ghost)

Card "Próxima fatura": valor estimado + data de vencimento + breakdown de itens.

Seção "Histórico de faturas": tabela com data, valor, status badge, botão download PDF.

Card "Método de pagamento": dados do método ativo + botão "Atualizar".
```

---

## CONTEÚDO IA

### Conteúdo — Hub — `/conteudo`

```text
Crie o hub de Conteúdo IA. Shell completo, item "Conteúdo IA" ativo.

PageHeader: "Conteúdo IA", subtítulo "Gere roteiros, posts e materiais em segundos".

Grid 2×3 de cards de acesso rápido:
- "Roteiro de Viagem" — ícone mapa + descrição + botão "Gerar"
- "Post para Instagram" — ícone câmera + botão "Gerar"
- "E-mail de orçamento" — ícone envelope + botão "Gerar"
- "Descrição de destino" — ícone globo + botão "Gerar"
- "Roteiro personalizado" — ícone wand + botão "Gerar"
- "Post para Blog" — ícone file-text + botão "Gerar"

Seção "Gerados recentemente": lista de últimas 5 gerações com tipo, título, data, botão "Ver" e botão "Copiar".

Seção "Uso de IA este mês": barra de progresso (X de Y tokens) + link para /custos-ia.
```

---

### Gerador de Roteiro — `/conteudo/roteiro`

```text
Crie a tela do Gerador de Roteiro de Viagem por IA. Shell completo. Breadcrumb: "Conteúdo IA > Roteiro de Viagem".

Layout: formulário de configuração (esquerda, 40%) + área de resultado (direita, 60%).

Formulário esquerdo:
- Destino(s): campo com tags (ex: "Lisboa, Sintra, Porto")
- Duração: select (3, 5, 7, 10, 14 dias)
- Perfil do viajante: chips de seleção múltipla (Casal, Família, Aventureiro, Cultura, Luxo, Econômico)
- Ritmo: slider (Tranquilo ←→ Intenso)
- Incluir: toggles (Hospedagem, Restaurantes, Passeios, Transporte, Dicas locais)
- Tom do texto: select (Informativo, Inspiracional, Técnico)
- Idioma de saída: select (PT-BR, EN, ES)
- Botão "Gerar roteiro com IA" full-width, estilo accent

Área de resultado (direita):
- Estado vazio: ilustração de mapa + "Configure os parâmetros e clique em Gerar"
- Estado loading: animação de typing + "Gerando seu roteiro..."
- Estado com conteúdo: roteiro em markdown renderizado por dias
- Ações: "Copiar tudo", "Editar", "Exportar PDF", "Vincular a orçamento"
```

---

## ATENDIMENTO OMNICHANNEL

### Comunicação — Inbox — `/comunicacao`

```text
Crie a tela de Comunicação Omnichannel. Shell completo, item "Comunicação" ativo.

Layout de 3 colunas full-height (sem scroll de página, scroll interno por coluna):

Coluna 1 — Lista de conversas (320px):
- Header: "Inbox" + botão filtro + select "Todos os canais"
- Campo de busca por nome/mensagem
- Lista: avatar + nome + preview da última mensagem + timestamp + badge de não lidas
- Badge de canal por conversa (ícone whatsapp/email/chat)
- Conversa ativa com indicador visual de seleção

Coluna 2 — Chat ativo (flex 1):
- Header: avatar + nome do contato + status online/offline + botões "Ver perfil" e "Abrir no Hub 360°"
- Área de mensagens: bolhas à esquerda (contato) e direita (agente), timestamps, indicadores de leitura
- Ícone de canal em cada bolha
- Rodapé: textarea "Digite uma mensagem..." + ícone emoji + ícone anexo + botão enviar
- Sugestões de IA como chip acima do textarea

Coluna 3 — Contexto do contato (280px):
- Mini card: foto + nome + email + WhatsApp
- Tabs: "Perfil" | "Pedidos" | "Histórico"
- Aba Perfil: dados do contato + botão "Ver Hub 360°"
- Aba Pedidos: lista compacta de pedidos ativos
```

---

## CONFIGURAÇÕES

### Configurações — Equipe — `/configuracoes/equipe`

```text
Crie a tela Configurações > Equipe. Shell completo. Breadcrumb: "Configurações > Equipe".

Sub-navegação de configurações (tabs horizontais ou sidebar secundária): Equipe (ativa) | Convites | Plano | Pagamentos | API Keys | Webhooks | Perfil | Notificações.

PageHeader: "Equipe". Botão "Convidar membro" (primário).

DataTable dos membros:
- Avatar + Nome + email
- Badge de role: Admin / Comercial / Financeiro / Atendimento / Marketing / Viewer
- Status: Ativo / Inativo
- Último acesso (data relativa)
- Ações: Editar role (dropdown inline), Desativar, Remover

Modal "Convidar membro": campo email + select de role + botão "Enviar convite". Nota: "O convite expira em 48 horas."
```

---

### Configurações — Plano — `/configuracoes/plano`

```text
Crie a tela Configurações > Plano. Shell completo. Sub-navegação com "Plano" ativo.

Card "Plano atual" com destaque visual (borda esquerda primária):
- Nome do plano em bold + badge "Ativo"
- Valor mensal + data da próxima renovação
- Badge de período: Mensal / Anual

Seção "Uso do plano" com barras de progresso (ficam vermelhas se > 80%):
- Usuários: X / Y
- Storage: X GB / Y GB
- Tokens IA: X.XXX / XX.XXX por mês
- Sites publicados: X / Y
- API calls por dia: X / Y

Grid de planos disponíveis (3 cards lado a lado):
Por card: nome, preço mensal, lista de limites, botão "Fazer upgrade" ou "Plano atual" (desabilitado no plano ativo). Card do plano atual com borda de destaque.

Link "Cancelar assinatura" discreto no final da página com aviso ao hover.
```

---

*Documento gerado em: 2026-05-24 · Versão: 1.0*
*Para especificação completa de cada tela, consulte [DESIGN-CORE.md](./DESIGN-CORE.md)*
*Configuração inicial do Stitch: ver [STITCH-SETUP.md](./STITCH-SETUP.md)*
