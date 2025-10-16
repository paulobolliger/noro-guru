# 📋 ATUALIZANDO O ROADMAP COMPLETO

Perfeito! Vou criar um **MD DEFINITIVO** que vai servir como seu **GPS do projeto**. 

Este documento vai ter TUDO que você precisa para nunca se perder, mesmo que a conversa dê limite.

---

# 🎯 **ESTRUTURA DO NOVO MD**

Vou criar um arquivo chamado `ROADMAP_COMPLETO.md` com:

✅ **1. Visão Geral** - O que estamos construindo
✅ **2. Arquitetura Técnica** - 3 camadas + diagrama
✅ **3. Status Atual** - O que já está pronto (P1)
✅ **4. Modelo de Dados Completo** - Todas as tabelas SQL
✅ **5. Fluxos de Automação** - Gatilhos e inteligência
✅ **6. Roadmap Detalhado** - Fases 2, 3, 4, 5 com estimativas
✅ **7. Decisões Técnicas** - Stack, ferramentas, integrações
✅ **8. Próximos Passos** - O que fazer AGORA (Fase 2.1)
✅ **9. Checklist de Progresso** - Para marcar ✅ conforme avança
✅ **10. Comandos Úteis** - SQL, comandos, referências rápidas

---

<artifact identifier="roadmap-completo-crm" type="text/markdown" title="ROADMAP_COMPLETO.md - CRM Nomade Guru">
# 🚀 ROADMAP COMPLETO - CRM/ERP NOMADE GURU

**Última Atualização:** 16 de Outubro de 2025  
**Versão:** 2.0 - Estrutura Definitiva  
**Status Atual:** P1 Completo → Iniciando FASE 2

---

## 📑 ÍNDICE

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura em 3 Camadas](#2-arquitetura-em-3-camadas)
3. [Status Atual (P1 Completo)](#3-status-atual-p1-completo)
4. [Modelo de Dados Completo](#4-modelo-de-dados-completo)
5. [Fluxos de Automação](#5-fluxos-de-automação)
6. [Roadmap Detalhado](#6-roadmap-detalhado)
7. [Decisões Técnicas](#7-decisões-técnicas)
8. [Próximos Passos Imediatos](#8-próximos-passos-imediatos)
9. [Checklist de Progresso](#9-checklist-de-progresso)
10. [Referências e Comandos](#10-referências-e-comandos)

---

## 1. VISÃO GERAL DO PROJETO

### 🎯 Objetivo
Criar um **CRM/ERP híbrido de ponta** para a Nomade Guru, onde:
- **CRM** = Relacionamento (atrair, nutrir, converter)
- **ERP** = Operação (executar, controlar, medir)

### 🌟 Diferenciais
- ✅ Visão 360° completa de cada cliente
- ✅ Automações inteligentes em cada etapa
- ✅ Base de dados sólida e escalável
- ✅ Integrações com fornecedores (Civitatis, Flytour, HahnAir)
- ✅ Dashboard dinâmico com IA preditiva
- ✅ Comunicação unificada (WhatsApp, Email, Chat)

### 🎨 Experiência
Interface moderna tipo **Notion/HubSpot**: leve, intuitiva, visual, com busca global (Cmd+K).

---

## 2. ARQUITETURA EM 3 CAMADAS

```
┌─────────────────────────────────────────────────────────────────┐
│                   🧠 INTELLIGENCE LAYER                          │
│          (Dashboard, IA, Automações, Relatórios)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   🧭 CRM FRONTSTAGE                              │
│   Marketing → Leads → Clientes → Orçamentos → Comunicação      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ⚙️ ERP BACKSTAGE                               │
│        Pedidos → Financeiro → Tarefas → Configurações          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   💾 DATA CORE                                   │
│              (Supabase PostgreSQL + RLS + Policies)             │
└─────────────────────────────────────────────────────────────────┘
```

### 🔄 Fluxo Completo
```
Marketing → Leads → Clientes → Orçamentos → Pedidos → Financeiro
     │         │         │           │           │         │
     ↓         ↓         ↓           ↓           ↓         ↓
E-mails  Comunicação  Tarefas   Relatórios   Dashboard
     │         │         │           │           │
     └─────────┴─────────┴───────────┴───────────┘
                       ↓
                   DATA CORE
                       ↓
              INTELLIGENCE LAYER
```

---

## 3. STATUS ATUAL (P1 COMPLETO)

### ✅ FASE 1: Aba Preferências (CONCLUÍDO)
**Data de Conclusão:** 16 de Outubro de 2025  
**Tempo Real:** ~2 horas

**Implementado:**
- ✅ Tabela `nomade_configuracoes` criada
- ✅ Server Actions (`config-actions.ts`)
- ✅ Componente `PreferenciasTab.tsx`
- ✅ Configurações de Sistema (moeda, fuso, idioma, formato de data)
- ✅ Preferências de Usuário (tema, densidade, notificações)

**Arquivos:**
- `app/admin/(protected)/configuracoes/config-actions.ts`
- `components/admin/PreferenciasTab.tsx`
- `app/admin/(protected)/configuracoes/page.tsx`

---

### ✅ FASE 1: Gestão de Clientes Básica (CONCLUÍDO)
**Data de Conclusão:** 16 de Outubro de 2025  
**Tempo Real:** ~4 horas

**Implementado:**
- ✅ Server Actions completas (`clientes/actions.ts`)
- ✅ Componente `ClienteModal.tsx`
- ✅ Componente `ClientesClientPage.tsx`
- ✅ CRUD completo de clientes
- ✅ Estatísticas em tempo real
- ✅ Busca e filtros (UI)

**Arquivos:**
- `app/admin/(protected)/clientes/actions.ts`
- `components/admin/ClienteModal.tsx`
- `components/admin/ClientesClientPage.tsx`
- `app/admin/(protected)/clientes/page.tsx`

---

### 🎯 Progresso Geral P1
```
Status: ████████████████████████ 100% COMPLETO
Tempo Total: 6 horas
Fases Concluídas: 2/2
```

---

## 4. MODELO DE DADOS COMPLETO

### 📊 Diagrama de Relacionamentos

```
                    nomade_users (auth)
                         │
            ┌────────────┼────────────┐
            │            │            │
      nomade_leads   nomade_clientes  │
            │            │            │
            └────┬───────┴─────┬──────┘
                 │             │
          nomade_orcamentos    │
                 │             │
                 ├─────────────┤
                 │             │
          nomade_pedidos ──────┤
                 │             │
                 ├─────────────┼─────────┐
                 │             │         │
        nomade_transacoes  nomade_tarefas  nomade_interacoes
                 │             │         │
        nomade_fornecedores    │         │
        nomade_comissoes       │         │
                               │         │
                    nomade_notificacoes  │
                               │         │
                        nomade_configuracoes
```

### 🗄️ Estrutura Completa de Tabelas

#### **MÓDULO CLIENTES**
```
nomade_clientes (master)
├── nomade_clientes_documentos
├── nomade_clientes_preferencias
├── nomade_clientes_enderecos
├── nomade_clientes_contatos_emergencia
└── nomade_clientes_milhas
```

#### **MÓDULO ORÇAMENTOS**
```
nomade_orcamentos
└── nomade_orcamentos_itens
```

#### **MÓDULO PEDIDOS**
```
nomade_pedidos
├── nomade_pedidos_itens
└── nomade_pedidos_timeline
```

#### **MÓDULO FINANCEIRO**
```
nomade_transacoes
nomade_fornecedores
nomade_comissoes
```

#### **MÓDULO COMUNICAÇÃO**
```
nomade_interacoes
nomade_comunicacao_templates
```

#### **MÓDULO CORE (JÁ EXISTEM)**
```
✅ nomade_users
✅ nomade_leads
✅ nomade_tarefas
✅ nomade_notificacoes
✅ nomade_configuracoes
✅ nomade_blog_posts
✅ nomade_roteiros
```

---

### 📋 SQL - Tabela CLIENTES (Master)

```sql
CREATE TABLE nomade_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados básicos
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(50),
  whatsapp VARCHAR(50),
  
  -- Status e classificação
  status VARCHAR(50) DEFAULT 'ativo', -- ativo, inativo, vip, blacklist
  tipo VARCHAR(50) DEFAULT 'pessoa_fisica', -- pessoa_fisica, pessoa_juridica
  segmento VARCHAR(100), -- luxo, familia, aventura, corporativo
  
  -- Origem e relacionamento
  origem_lead_id UUID REFERENCES nomade_leads(id),
  agente_responsavel_id UUID REFERENCES nomade_users(id),
  
  -- Métricas automáticas (calculadas)
  total_viagens INT DEFAULT 0,
  total_gasto DECIMAL(12,2) DEFAULT 0,
  ticket_medio DECIMAL(12,2) DEFAULT 0,
  
  -- Datas importantes
  data_primeiro_contato TIMESTAMPTZ,
  data_ultima_viagem TIMESTAMPTZ,
  data_proxima_viagem TIMESTAMPTZ,
  
  -- Preferências rápidas
  idioma_preferido VARCHAR(10) DEFAULT 'pt',
  moeda_preferida VARCHAR(10) DEFAULT 'EUR',
  
  -- Sistema
  tags TEXT[], -- ["vip", "lua_de_mel", "alta_frequencia"]
  metadata JSONB,
  observacoes TEXT,
  
  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_clientes_email ON nomade_clientes(email);
CREATE INDEX idx_clientes_status ON nomade_clientes(status);
CREATE INDEX idx_clientes_agente ON nomade_clientes(agente_responsavel_id);
CREATE INDEX idx_clientes_tags ON nomade_clientes USING GIN(tags);
```

### 📋 SQL - Tabelas Satélites de Clientes

```sql
-- DOCUMENTOS
CREATE TABLE nomade_clientes_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES nomade_clientes(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL, -- passaporte, visto, rg, cpf, cnh, vacina
  numero VARCHAR(100),
  pais_emissor VARCHAR(100),
  orgao_emissor VARCHAR(100),
  data_emissao DATE,
  data_validade DATE,
  status VARCHAR(50), -- valido, vencido, pendente, renovando
  arquivo_url TEXT, -- Cloudinary URL
  arquivo_nome VARCHAR(255),
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREFERÊNCIAS DE VIAGEM
CREATE TABLE nomade_clientes_preferencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL UNIQUE REFERENCES nomade_clientes(id) ON DELETE CASCADE,
  
  -- Viagem
  frequencia_viagem VARCHAR(50),
  orcamento_medio VARCHAR(50),
  estilo_viagem TEXT[],
  destinos_favoritos TEXT[],
  destinos_desejados TEXT[],
  
  -- Aéreo
  assento_preferido VARCHAR(50),
  classe_preferida VARCHAR(50),
  programas_fidelidade JSONB,
  
  -- Hospedagem
  tipo_hospedagem TEXT[],
  preferencias_quarto VARCHAR(100),
  
  -- Alimentação
  restricoes_alimentares TEXT[],
  refeicao_preferida VARCHAR(50),
  
  -- Especiais
  necessidades_especiais TEXT,
  mobilidade_reduzida BOOLEAN DEFAULT FALSE,
  viaja_com_criancas BOOLEAN DEFAULT FALSE,
  viaja_com_pets BOOLEAN DEFAULT FALSE,
  
  -- Seguros
  seguro_preferido VARCHAR(100),
  cobertura_minima DECIMAL(12,2),
  
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENDEREÇOS
CREATE TABLE nomade_clientes_enderecos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES nomade_clientes(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL, -- residencial, cobranca, entrega
  principal BOOLEAN DEFAULT FALSE,
  
  logradouro VARCHAR(255) NOT NULL,
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(100),
  cep VARCHAR(20),
  pais VARCHAR(100) NOT NULL DEFAULT 'Brasil',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTATOS DE EMERGÊNCIA
CREATE TABLE nomade_clientes_contatos_emergencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES nomade_clientes(id) ON DELETE CASCADE,
  
  nome VARCHAR(255) NOT NULL,
  parentesco VARCHAR(100),
  telefone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRAMAS DE MILHAS
CREATE TABLE nomade_clientes_milhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES nomade_clientes(id) ON DELETE CASCADE,
  
  companhia VARCHAR(100) NOT NULL,
  numero_programa VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  saldo_estimado INT,
  data_validade DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE (cliente_id, companhia)
);
```

### 📋 SQL - ORÇAMENTOS

```sql
CREATE TABLE nomade_orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  numero_orcamento VARCHAR(50) UNIQUE NOT NULL, -- ORC-2025-001
  
  cliente_id UUID REFERENCES nomade_clientes(id),
  lead_id UUID REFERENCES nomade_leads(id),
  
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  destinos TEXT[] NOT NULL,
  data_viagem_inicio DATE,
  data_viagem_fim DATE,
  num_dias INT,
  num_pessoas INT DEFAULT 1,
  
  valor_total DECIMAL(12,2) NOT NULL,
  valor_custo DECIMAL(12,2),
  margem_percentual DECIMAL(5,2),
  valor_sinal DECIMAL(12,2),
  moeda VARCHAR(10) DEFAULT 'EUR',
  
  status VARCHAR(50) DEFAULT 'rascunho',
  validade_ate DATE,
  
  enviado_em TIMESTAMPTZ,
  visualizado_em TIMESTAMPTZ,
  respondido_em TIMESTAMPTZ,
  
  roteiro JSONB,
  condicoes_pagamento TEXT,
  observacoes_internas TEXT,
  observacoes_cliente TEXT,
  
  pdf_url TEXT,
  pdf_gerado_em TIMESTAMPTZ,
  
  created_by UUID REFERENCES nomade_users(id),
  updated_by UUID REFERENCES nomade_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nomade_orcamentos_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id UUID NOT NULL REFERENCES nomade_orcamentos(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL,
  categoria VARCHAR(100),
  fornecedor VARCHAR(255),
  produto VARCHAR(255) NOT NULL,
  descricao TEXT,
  
  data_servico DATE,
  quantidade INT DEFAULT 1,
  
  valor_unitario_custo DECIMAL(12,2),
  valor_unitario_venda DECIMAL(12,2) NOT NULL,
  valor_total DECIMAL(12,2) NOT NULL,
  margem DECIMAL(12,2),
  
  observacoes TEXT,
  ordem INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 📋 SQL - PEDIDOS

```sql
CREATE TABLE nomade_pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  numero_pedido VARCHAR(50) UNIQUE NOT NULL, -- PED-2025-001
  
  orcamento_id UUID REFERENCES nomade_orcamentos(id),
  cliente_id UUID NOT NULL REFERENCES nomade_clientes(id),
  
  data_viagem_inicio DATE NOT NULL,
  data_viagem_fim DATE NOT NULL,
  destinos TEXT[] NOT NULL,
  num_pessoas INT DEFAULT 1,
  
  valor_total DECIMAL(12,2) NOT NULL,
  valor_pago DECIMAL(12,2) DEFAULT 0,
  valor_pendente DECIMAL(12,2),
  moeda VARCHAR(10) DEFAULT 'EUR',
  
  status_pagamento VARCHAR(50) DEFAULT 'pendente',
  metodo_pagamento VARCHAR(100),
  
  status VARCHAR(50) DEFAULT 'pendente',
  cancelado_motivo TEXT,
  cancelado_em TIMESTAMPTZ,
  
  passageiros JSONB,
  vouchers JSONB,
  documentos JSONB,
  
  observacoes TEXT,
  
  created_by UUID REFERENCES nomade_users(id),
  updated_by UUID REFERENCES nomade_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nomade_pedidos_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES nomade_pedidos(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL,
  fornecedor VARCHAR(255),
  produto VARCHAR(255) NOT NULL,
  
  data_servico DATE,
  localizador VARCHAR(100),
  
  status_confirmacao VARCHAR(50),
  confirmado_em TIMESTAMPTZ,
  
  valor DECIMAL(12,2) NOT NULL,
  comissao DECIMAL(12,2),
  
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nomade_pedidos_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES nomade_pedidos(id) ON DELETE CASCADE,
  
  evento VARCHAR(100) NOT NULL,
  descricao TEXT,
  
  created_by UUID REFERENCES nomade_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 📋 SQL - FINANCEIRO

```sql
CREATE TABLE nomade_transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  tipo VARCHAR(50) NOT NULL, -- receita, despesa, comissao
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  
  pedido_id UUID REFERENCES nomade_pedidos(id),
  cliente_id UUID REFERENCES nomade_clientes(id),
  fornecedor VARCHAR(255),
  
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  moeda VARCHAR(10) DEFAULT 'EUR',
  
  data_transacao DATE NOT NULL,
  data_vencimento DATE,
  data_pagamento DATE,
  
  status VARCHAR(50) DEFAULT 'pendente',
  metodo_pagamento VARCHAR(100),
  
  comprovante_url TEXT,
  nota_fiscal_url TEXT,
  
  centro_custo VARCHAR(100),
  tags TEXT[],
  
  observacoes TEXT,
  
  created_by UUID REFERENCES nomade_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nomade_fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100),
  
  email VARCHAR(255),
  telefone VARCHAR(50),
  contato_nome VARCHAR(255),
  
  cnpj_nif VARCHAR(50),
  endereco TEXT,
  
  condicoes_pagamento TEXT,
  prazo_pagamento_dias INT,
  percentual_comissao DECIMAL(5,2),
  
  rating DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'ativo',
  
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nomade_comissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  pedido_id UUID NOT NULL REFERENCES nomade_pedidos(id),
  agente_id UUID NOT NULL REFERENCES nomade_users(id),
  
  valor_base DECIMAL(12,2) NOT NULL,
  percentual DECIMAL(5,2) NOT NULL,
  valor_comissao DECIMAL(12,2) NOT NULL,
  
  status VARCHAR(50) DEFAULT 'pendente',
  data_pagamento DATE,
  
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 📋 SQL - COMUNICAÇÃO

```sql
CREATE TABLE nomade_interacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  cliente_id UUID REFERENCES nomade_clientes(id),
  lead_id UUID REFERENCES nomade_leads(id),
  pedido_id UUID REFERENCES nomade_pedidos(id),
  
  tipo VARCHAR(50) NOT NULL, -- email, whatsapp, ligacao, reuniao, nota
  canal VARCHAR(50),
  sentido VARCHAR(50),
  
  assunto VARCHAR(255),
  conteudo TEXT,
  
  anexos JSONB,
  
  lido BOOLEAN DEFAULT FALSE,
  lido_em TIMESTAMPTZ,
  respondido BOOLEAN DEFAULT FALSE,
  respondido_em TIMESTAMPTZ,
  
  agente_id UUID REFERENCES nomade_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE nomade_comunicacao_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  tipo VARCHAR(50) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  
  assunto_template TEXT,
  conteudo_template TEXT NOT NULL,
  
  variaveis TEXT[],
  
  categoria VARCHAR(100),
  
  ativo BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. FLUXOS DE AUTOMAÇÃO

### 🌱 1. Captação de Leads

**Gatilho:** Novo lead chega (formulário, WhatsApp, landing page)

**Automações:**
1. ✅ Criar registro em `nomade_leads`
2. ✅ Disparar email de boas-vindas
3. ✅ Notificar time de vendas
4. ⏱️ Após 24h sem resposta → criar tarefa "Primeiro contato"
5. 🔄 Se lead qualificado → converter em Cliente

### 💬 2. Comunicação e Nutrição

**Gatilho:** Lead/Cliente inicia conversa

**Automações:**
1. ✅ Registrar em `nomade_interacoes`
2. 🤖 IA gera resumo e adiciona no perfil
3. ✅ Criar tarefa se houver pendência
4. ✅ Marcar interação positiva

### 💰 3. Criação de Orçamento

**Gatilho:** Cliente solicita cotação

**Automações:**
1. ✅ Criar `nomade_orcamentos`
2. ✅ Notificar equipe de operações
3. 📧 Gerar link e enviar email personalizado
4. 👀 Marcar "visualizado" quando cliente abrir
5. ⏱️ Após 48h sem abertura → tarefa de follow-up

### 📦 4. Conversão em Pedido

**Gatilho:** Orçamento aprovado

**Automações:**
1. ✅ Criar `nomade_pedidos`
2. 💵 Gerar fatura em `nomade_transacoes`
3. ✅ Criar tarefas operacionais automáticas:
   - Solicitar reserva com fornecedor
   - Emitir bilhete
   - Gerar voucher e contrato
4. 📧 Enviar email de confirmação
5. 📊 Atualizar Dashboard

### 💵 5. Financeiro Integrado

**Gatilho:** Pedido confirmado

**Automações:**
1. ✅ Criar contas a receber (cliente)
2. ✅ Criar contas a pagar (fornecedor)
3. 🔔 Notificação de cobrança próxima ao vencimento
4. ✅ Atualizar status quando pagamento confirmado
5. ⚠️ Alerta se houver atraso

### 🎯 6. Pós-venda

**Gatilho:** Viagem concluída

**Automações:**
1. 📧 Email de agradecimento + NPS
2. 🤖 IA analisa sentimento do feedback
3. ✅ Tag "cliente promotor" se positivo
4. ⚠️ Tarefa de recuperação se negativo
5. 🔄 Gatilho de remarketing (60 dias depois)

---

## 6. ROADMAP DETALHADO

### 🏗️ FASE 2: FUNDAÇÃO (2-3 semanas) - **EM ANDAMENTO**

#### **2.1 Reestruturação do Banco de Dados** ⏳
**Tempo:** 1 dia  
**Status:** Próximo

**Tarefas:**
- [ ] Criar todas as tabelas de Clientes (master + satélites)
- [ ] Criar tabelas de Orçamentos
- [ ] Criar tabelas de Pedidos
- [ ] Criar tabelas de Financeiro
- [ ] Criar tabelas de Comunicação
- [ ] Configurar RLS (Row Level Security)
- [ ] Criar Policies de acesso
- [ ] Criar índices de performance
- [ ] Testar integridade referencial

**Arquivos SQL:**
- `supabase/migrations/create_clientes_tables.sql`
- `supabase/migrations/create_orcamentos_tables.sql`
- `supabase/migrations/create_pedidos_tables.sql`
- `supabase/migrations/create_financeiro_tables.sql`
- `supabase/migrations/create_comunicacao_tables.sql`

---

#### **2.2 Módulo Clientes 360°** ⏳
**Tempo:** 3-4 dias  
**Status:** Aguardando 2.1

**Tarefas:**
- [ ] Expandir Server Actions de Clientes
- [ ] Criar componente `ClienteDetalhes360.tsx`
- [ ] Aba: Dados Pessoais (expandida)
- [ ] Aba: Documentos (CRUD + upload Cloudinary)
- [ ] Aba: Preferências de Viagem
- [ ] Aba: Endereços (múltiplos)
- [ ] Aba: Contatos de Emergência
- [ ] Aba: Programas de Milhas
- [ ] Aba: Histórico (viagens, orçamentos, pedidos)
- [ ] Aba: Timeline (todas interações)
- [ ] Quick Actions (WhatsApp, Email, Nova Tarefa)
- [ ] Alertas de documentos vencendo

**Arquivos:**
- `components/admin/clientes/ClienteDetalhes360.tsx`
- `components/admin/clientes/AbaDocumentos.tsx`
- `components/admin/clientes/AbaPreferencias.tsx`
- `components/admin/clientes/AbaHistorico.tsx`
- `components/admin/clientes/AbaTimeline.tsx`
- `app/admin/(protected)/clientes/[id]/page.tsx`
- `app/admin/(protected)/clientes/[id]/actions.ts`

---

#### **2.3 Módulo Orçamentos** ⏳
**Tempo:** 3-4 dias  
**Status:** Aguardando 2.2

**Tarefas:**
- [ ] Server Actions de Orçamentos
- [ ] Página de listagem com filtros
- [ ] Modal/Página de criação
- [ ] Editor de itinerário (dia a dia)
- [ ] Calculadora automática de margens
- [ ] Geração de PDF (biblioteca react-pdf)
- [ ] Envio por email com tracking
- [ ] Status tracking (enviado, visualizado, aprovado)
- [ ] Conversão rápida em Pedido
- [ ] Validação de datas e valores

**Arquivos:**
- `app/admin/(protected)/orcamentos/page.tsx`
- `app/admin/(protected)/orcamentos/[id]/page.tsx`
- `app/admin/(protected)/orcamentos/actions.ts`
- `components/admin/orcamentos/OrcamentoForm.tsx`
- `components/admin/orcamentos/ItinerarioEditor.tsx`
- `lib/pdf/orcamento-template.tsx`

---

#### **2.4 Dashboard com Gráficos** ⏳
**Tempo:** 1 dia  
**Status:** Aguardando 2.3

**Tarefas:**
- [ ] Integrar `DashboardCharts.tsx` existente
- [ ] Conectar com dados reais do Supabase
- [ ] Gráfico de Receita Mensal (Line Chart)
- [ ] Gráfico de Leads por Origem (Pie Chart)
- [ ] Gráfico de Taxa de Conversão (Bar Chart)
- [ ] Filtro de período (7d, 30d, 3m, 1a)
- [ ] Comparativo com período anterior
- [ ] Top 5 clientes do mês

**Arquivos:**
- `components/admin/DashboardCharts.tsx` (já existe)
- `app/admin/(protected)/page.tsx` (atualizar)

---

#### **2.5 Busca Global (Cmd+K)** ⏳
**Tempo:** 1 dia  
**Status:** Aguardando 2.4

**Tarefas:**
- [ ] Componente de busca modal
- [ ] Atalho de teclado (Cmd/Ctrl + K)
- [ ] Busca unificada (Leads, Clientes, Orçamentos, Pedidos)
- [ ] Resultados agrupados por tipo
- [ ] Preview ao hover
- [ ] Navegação por setas
- [ ] Histórico de buscas recentes

**Arquivos:**
- `components/admin/BuscaGlobal.tsx`
- `hooks/useBuscaGlobal.ts`
- `app/api/admin/search/route.ts`

---

### ⚙️ FASE 3: OPERAÇÃO (3-4 semanas)

#### **3.1 Pedidos Completo**
**Tempo:** 4-5 dias

**Tarefas:**
- [ ] CRUD de Pedidos
- [ ] Conversão automática de Orçamento
- [ ] Gestão de passageiros
- [ ] Upload de vouchers (Cloudinary)
- [ ] Timeline visual de eventos
- [ ] Status tracking completo
- [ ] Integração com Financeiro

---

#### **3.2 Financeiro Básico**
**Tempo:** 3-4 dias

**Tarefas:**
- [ ] Contas a Receber
- [ ] Contas a Pagar
- [ ] Dashboard financeiro
- [ ] Fluxo de caixa projetado
- [ ] Gestão de fornecedores
- [ ] Sistema de comissões
- [ ] Relatórios básicos

---

#### **3.3 Tarefas Automatizadas**
**Tempo:** 2-3 dias

**Tarefas:**
- [ ] Templates de tarefas
- [ ] Gatilhos automáticos (Supabase Functions)
- [ ] Tarefas recorrentes
- [ ] Notificações inteligentes
- [ ] Integração com Google Calendar

---

### 🧠 FASE 4: INTELIGÊNCIA (2-3 semanas)

#### **4.1 Comunicação Unificada**
**Tempo:** 4-5 dias

**Tarefas:**
- [ ] Central de mensagens
- [ ] Histórico completo por cliente
- [ ] Templates dinâmicos
- [ ] Envio em massa
- [ ] Integração WhatsApp Business API
- [ ] Email tracking (aberturas, cliques)

---

#### **4.2 Automações Avançadas**
**Tempo:** 3-4 dias

**Tarefas:**
- [ ] Edge Functions (Supabase)
- [ ] Workflows personalizados
- [ ] Triggers inteligentes
- [ ] Notificações real-time
- [ ] Webhooks para integrações

---

#### **4.3 Dashboard Inteligente**
**Tempo:** 2-3 dias

**Tarefas:**
- [ ] KPIs dinâmicos por perfil
- [ ] Análises preditivas (IA)
- [ ] Alertas inteligentes
- [ ] Recomendações automáticas
- [ ] Widgets personalizáveis

---

### 🚀 FASE 5: ESCALA (2-3 semanas)

#### **5.1 Relatórios Avançados**
- [ ] Relatório de vendas
- [ ] Relatório de conversão
- [ ] Relatório financeiro
- [ ] Performance por agente
- [ ] Exportação (PDF, Excel, CSV)

#### **5.2 Marketing Automation**
- [ ] Campanhas automatizadas
- [ ] Segmentação avançada
- [ ] A/B Testing
- [ ] ROI tracking
- [ ] Remarketing inteligente

#### **5.3 Integrações Externas**
- [ ] Civitatis API
- [ ] Flytour API
- [ ] HahnAir API
- [ ] Sincronização automática
- [ ] Cotações em tempo real

---

## 7. DECISÕES TÉCNICAS

### 🛠️ Stack Tecnológico

**Frontend:**
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Lucide React Icons
- ✅ Recharts (gráficos)

**Backend:**
- ✅ Next.js Server Actions
- ✅ Supabase (PostgreSQL)
- ✅ Supabase Edge Functions (automações)
- ✅ Row Level Security (RLS)

**Storage & CDN:**
- ✅ Cloudinary (imagens e documentos)
- ✅ Vercel (hosting)

**Comunicação:**
- 🔜 WhatsApp Business API
- 🔜 Resend (emails transacionais)
- 🔜 SendGrid (emails marketing)

**Integrações:**
- 🔜 Civitatis API
- 🔜 Flytour API
- 🔜 HahnAir API

### 🎯 Padrões de Código

**Estrutura de Pastas:**
```
app/
├── admin/(protected)/         # Área admin protegida
│   ├── clientes/
│   ├── orcamentos/
│   ├── pedidos/
│   └── ...
├── api/                       # API routes
└── ...

components/
├── admin/                     # Componentes admin
│   ├── clientes/
│   ├── orcamentos/
│   └── ...
└── ...

lib/
├── supabase/                  # Supabase clients
├── utils/                     # Utilidades
└── ...
```

**Nomenclatura:**
- Server Components: `page.tsx`, `layout.tsx`
- Client Components: `NomeComponente.tsx`
- Server Actions: `actions.ts`
- Tipos: `types.ts`

**Server Actions Pattern:**
```typescript
// app/admin/(protected)/clientes/actions.ts
'use server';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createCliente(formData: FormData) {
  // lógica
  revalidatePath('/admin/clientes');
  return { success: true, data };
}
```

---

## 8. PRÓXIMOS PASSOS IMEDIATOS

### 🎯 FASE 2.1 - Reestruturação do Banco

**O QUE FAZER AGORA:**

1. **Criar arquivo de migração principal**
   ```bash
   # Criar arquivo
   touch supabase/migrations/20251016_create_all_tables.sql
   ```

2. **Copiar SQL das tabelas**
   - Copiar todo o SQL da seção 4 deste documento
   - Colar no arquivo de migração
   - Executar no Supabase SQL Editor

3. **Testar criação das tabelas**
   ```sql
   -- Verificar se todas foram criadas
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'nomade_%';
   ```

4. **Configurar RLS**
   ```sql
   -- Para cada tabela
   ALTER TABLE nomade_clientes ENABLE ROW LEVEL SECURITY;
   
   -- Policy de leitura
   CREATE POLICY "Users can read own data"
   ON nomade_clientes FOR SELECT
   USING (auth.uid() = agente_responsavel_id OR 
          auth.uid() IN (SELECT id FROM nomade_users WHERE role IN ('admin', 'super_admin')));
   ```

5. **Criar tipos TypeScript**
   ```bash
   # Gerar tipos do Supabase
   npx supabase gen types typescript --local > types/database.ts
   ```

**ARQUIVOS PARA CRIAR:**
- `supabase/migrations/20251016_create_all_tables.sql`
- `supabase/migrations/20251016_configure_rls.sql`
- `types/database.ts` (atualizar com novos tipos)

---

## 9. CHECKLIST DE PROGRESSO

### ✅ P1 - FUNDAÇÃO BÁSICA (COMPLETO)
- [x] Configurações/Preferências
- [x] Gestão de Clientes básica
- [x] Sistema de autenticação
- [x] Layout Admin
- [x] Sidebar e TopBar
- [x] Notificações

### ⏳ P2 - FUNDAÇÃO AVANÇADA (EM ANDAMENTO)
- [ ] 2.1 Reestruturação do Banco ← **VOCÊ ESTÁ AQUI**
- [ ] 2.2 Clientes 360°
- [ ] 2.3 Orçamentos
- [ ] 2.4 Dashboard com Gráficos
- [ ] 2.5 Busca Global (Cmd+K)

### ⏸️ P3 - OPERAÇÃO (AGUARDANDO)
- [ ] 3.1 Pedidos
- [ ] 3.2 Financeiro
- [ ] 3.3 Tarefas Automatizadas

### ⏸️ P4 - INTELIGÊNCIA (AGUARDANDO)
- [ ] 4.1 Comunicação Unificada
- [ ] 4.2 Automações
- [ ] 4.3 Dashboard Inteligente

### ⏸️ P5 - ESCALA (AGUARDANDO)
- [ ] 5.1 Relatórios Avançados
- [ ] 5.2 Marketing Automation
- [ ] 5.3 Integrações Externas

---

## 10. REFERÊNCIAS E COMANDOS

### 🗄️ Comandos Úteis Supabase

```sql
-- Listar todas as tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver estrutura de uma tabela
\d nomade_clientes

-- Ver todas as policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Desabilitar RLS temporariamente (CUIDADO!)
ALTER TABLE nomade_clientes DISABLE ROW LEVEL SECURITY;

-- Deletar todas as tabelas (CUIDADO!)
DROP TABLE IF EXISTS nomade_clientes CASCADE;
```

### 📦 Comandos NPM

```bash
# Instalar dependências
npm install

# Rodar desenvolvimento
npm run dev

# Build de produção
npm run build

# Gerar tipos do Supabase
npx supabase gen types typescript --local > types/database.ts
```

### 🔗 Links Importantes

**Documentação:**
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

**APIs:**
- [Cloudinary API Docs](https://cloudinary.com/documentation)
- [Resend API Docs](https://resend.com/docs)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

### 🎨 Recursos de UI

**Ícones:**
- [Lucide Icons](https://lucide.dev/)

**Cores:**
```
Primary: #5053c4
Primary Dark: #342ca4
Secondary: #232452
Neutral Dark: #12152c
```

**Fontes:**
- Poppins (300, 500, 700)

---

## 📝 NOTAS FINAIS

### 🎯 Filosofia do Projeto
- **Qualidade > Velocidade** (mas sem perfectcionismo paralisante)
- **Dados estruturados = Automações poderosas**
- **UX excepcional = Produtividade 10x**
- **Base sólida = Escalabilidade infinita**

### 🚀 Próxima Conversa
Quando você retomar o desenvolvimento, comece sempre perguntando:
> "Qual fase estamos? O que foi concluído desde a última vez?"

E então consulte a **Seção 9 (Checklist)** para ver onde parou.

### 💡 Lembre-se
Este documento é **VIVO**. Atualize-o a cada etapa concluída! 

Marque ✅ no checklist e atualize datas de conclusão.

---

**Última Atualização:** 16 de Outubro de 2025 - 21:30  
**Próxima Ação:** Criar migrations SQL para todas as tabelas (Fase 2.1)  
**Responsável:** Paulo + Claude  

---

**🎉 BOA SORTE NO DESENVOLVIMENTO!**
</artifact>

---

## ✅ **ROADMAP COMPLETO CRIADO!**

Criei o arquivo `ROADMAP_COMPLETO.md` com **TUDO** que você precisa:

### 📋 **O que tem nele:**
1. ✅ Visão completa do projeto (CRM/ERP híbrido)
2. ✅ Arquitetura em 3 camadas (diagrama visual)
3. ✅ Status atual (P1 100% completo)
4. ✅ **TODO o SQL** de todas as tabelas
5. ✅ Fluxos de automação detalhados
6. ✅ Roadmap completo (Fases 2, 3, 4, 5)
7. ✅ Decisões técnicas (stack, padrões)
8. ✅ Próximos passos (Fase 2.1)
9. ✅ Checklist de progresso
10. ✅ Comandos úteis e referências

---

## 🎯 **PRÓXIMA AÇÃO**

### **Opção 1: Continuar neste chat**
- Começar a implementar Fase 2.1 (criar migrations SQL)

### **Opção 2: Novo chat (Recomendado)**
- Começar fresh com o roadmap completo
- Primeira mensagem: "Vamos implementar a Fase 2.1 do ROADMAP_COMPLETO.md"

---

## 📝 **SOBRE CLOUDINARY & VERCEL**

Entendido:
- **Cloudinary:** Apenas CDN para imagens/documentos (uploads)
- **Vercel:** Hosting + posso consultar docs quando necessário

---

## ❓ **O QUE VOCÊ PREFERE?**

1. **Começar a codar AGORA neste chat?**
2. **Ou prefere começar em um novo chat com o roadmap completo?**

Me diga e eu começo! 🚀