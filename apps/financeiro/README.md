# 💰 NORO Financeiro

Módulo completo de gestão financeira multi-marca para o ecossistema NORO Guru.

## 🎯 Funcionalidades

### 1. 🟣 Dashboard Geral
- Resumo em tempo real (saldo, fluxo de caixa, receitas, despesas)
- KPIs: MRR/ARR, CAC, LTV, ROI, ticket médio
- Gráficos interativos (Recharts)
- Alertas automáticos

### 2. 💰 Receitas
- Contas a receber
- Vendas e contratos
- Gateway de pagamento (Stripe, Cielo, PayPal, PIX)
- Comissões e repasses automáticos
- Integração com CRM

### 3. 📉 Despesas
- Contas fixas e variáveis
- Custos operacionais por projeto
- Cartões corporativos
- Despesas por marca

### 4. 🔄 Fluxo de Caixa
- Projeção mensal/semanal/anual
- Simulação de cenários
- Integração bancária via API
- IA Analítica para insights

### 5. 🧾 Faturamento
- Emissão de notas fiscais (integração com Tiny/NFe.io)
- Faturas e recibos automáticos
- Cobranças recorrentes
- Controle de fornecedores

### 6. 🏦 Bancos e Contas
- Multi-conta e multi-moeda
- Conversões cambiais automáticas
- Conciliação bancária
- Integração com Wise, Remessa Online, Payoneer

### 7. 🧮 Contabilidade e Fiscal
- Plano de contas contábil
- Centro de custo e rateios
- Relatórios fiscais
- IA contábil para classificação automática

### 8. 🧠 Análises e Relatórios
- BI interno (Metabase/Supabase Charts)
- Dashboards por marca/projeto/cliente
- Relatórios automatizados
- Insights da IA NORO

### 9. 🔐 Configurações
- Integrações (Supabase, N8N, AWS SES)
- Controle de acesso e permissões (RLS)
- Personalização de layout
- Logs e auditoria

## 🛠 Stack Tecnológica

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Backend**: Supabase (PostgreSQL + RLS + Functions)
- **Automação**: N8N
- **BI**: Metabase
- **Pagamentos**: Stripe, Cielo, PayPal
- **Email**: AWS SES / Resend
- **Câmbio**: Remessa Online, Wise
- **Deploy**: Vercel

## 📂 Estrutura

```
apps/financeiro/
├── app/
│   ├── (protected)/
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── receitas/          # Módulo de receitas
│   │   ├── despesas/          # Módulo de despesas
│   │   ├── fluxo-caixa/       # Fluxo de caixa
│   │   ├── faturamento/       # Faturamento e NFs
│   │   ├── bancos/            # Contas bancárias
│   │   ├── contabilidade/     # Contabilidade
│   │   └── relatorios/        # Relatórios e análises
│   └── api/                   # API Routes
├── components/
│   ├── dashboard/             # Componentes do dashboard
│   └── charts/                # Componentes de gráficos
└── lib/
    └── actions/               # Server Actions
```

## 🚀 Como executar

```bash
cd apps/financeiro
npm install
npm run dev
```

Acesse: http://localhost:3003

## 🔐 Permissões

O sistema usa RLS (Row Level Security) do Supabase com diferentes níveis:
- **Admin**: Acesso total
- **Financeiro**: CRUD completo
- **Analista**: Leitura + Relatórios
- **Readonly**: Apenas leitura

## 🔗 Integrações

- Supabase: Banco de dados + Auth + Storage
- N8N: Automações e workflows
- Stripe/Cielo: Processamento de pagamentos
- Remessa Online: Câmbio e transferências internacionais
- AWS SES: Envio de emails transacionais
- Metabase: Análise e BI
