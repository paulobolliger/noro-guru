-- =====================================================
-- MIGRATION MASTER COMPLETA - SISTEMA FINANCEIRO
-- Data: 30/10/2025
-- Total: 6 migrations consolidadas
-- ORDEM: Base  Schema  Centros Custo  Duplicatas  Open Finance  RLS
-- ATUALIZADO: Corrigido conflito de índices
-- =====================================================


-- ============================================
-- ARQUIVO: 20251030000000_create_base_tenants.sql
-- ============================================

-- =====================================================
-- MIGRATION: Base Multi-Tenant System
-- DescriÃ§Ã£o: Tabelas essenciais para sistema multi-tenant
-- Data: 30/10/2025
-- Prioridade: EXECUTAR PRIMEIRO (antes de todas as outras migrations)
-- =====================================================

-- =====================================================
-- 1. TABELA TENANTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- IdentificaÃ§Ã£o
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE, -- URL-friendly identifier
  
  -- Tipo de tenant (marca)
  marca VARCHAR(50) CHECK (marca IN ('noro', 'nomade', 'safetrip', 'vistos')),
  
  -- ConfiguraÃ§Ãµes
  ativo BOOLEAN DEFAULT true,
  plano VARCHAR(50) DEFAULT 'basic' CHECK (plano IN ('basic', 'pro', 'enterprise')),
  
  -- Limites e Quotas
  max_usuarios INTEGER DEFAULT 5,
  max_leads INTEGER,
  max_processos INTEGER,
  
  -- InformaÃ§Ãµes da Empresa
  cnpj VARCHAR(20),
  razao_social VARCHAR(255),
  email_contato VARCHAR(255),
  telefone VARCHAR(20),
  
  -- EndereÃ§o
  endereco_logradouro VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  endereco_pais VARCHAR(2) DEFAULT 'BR',
  
  -- ConfiguraÃ§Ãµes Gerais
  configuracoes JSONB DEFAULT '{}',
  
  -- Metadados
  data_expiracao DATE, -- Para planos trial
  ultima_atividade TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_marca ON public.tenants(marca);
CREATE INDEX IF NOT EXISTS idx_tenants_ativo ON public.tenants(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_tenants_plano ON public.tenants(plano);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tenants_updated_at ON public.tenants;
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 2. TABELA USERS (se nÃ£o existir)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Auth (integraÃ§Ã£o com Supabase Auth)
  auth_user_id UUID UNIQUE, -- ReferÃªncia ao auth.users
  
  -- Dados Pessoais
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  cpf VARCHAR(14),
  
  -- Avatar e Perfil
  avatar_url TEXT,
  bio TEXT,
  cargo VARCHAR(100),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  email_verificado BOOLEAN DEFAULT false,
  
  -- ConfiguraÃ§Ãµes
  preferencias JSONB DEFAULT '{}',
  
  -- SeguranÃ§a
  ultimo_login TIMESTAMPTZ,
  ultimo_ip VARCHAR(45),
  tentativas_login_falhas INTEGER DEFAULT 0,
  bloqueado_ate TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_ativo ON public.users(ativo) WHERE ativo = true;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 3. TABELA USER_TENANTS (Relacionamento N:N)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Papel do usuÃ¡rio neste tenant
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'manager', 'user', 'viewer')),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- PermissÃµes EspecÃ­ficas
  permissoes JSONB DEFAULT '[]', -- Array de permissÃµes customizadas
  
  -- Metadados
  data_convite TIMESTAMPTZ,
  convite_aceito BOOLEAN DEFAULT false,
  convidado_por UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: UsuÃ¡rio nÃ£o pode estar duplicado no mesmo tenant
  UNIQUE(user_id, tenant_id)
);

-- Ãndices
CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON public.user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON public.user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_role ON public.user_tenants(role);
CREATE INDEX IF NOT EXISTS idx_user_tenants_ativo ON public.user_tenants(ativo) WHERE ativo = true;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_user_tenants_updated_at ON public.user_tenants;
CREATE TRIGGER update_user_tenants_updated_at
  BEFORE UPDATE ON public.user_tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 4. TABELA CLIENTES (usado em duplicatas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- IdentificaÃ§Ã£o
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('pessoa_fisica', 'pessoa_juridica')),
  cnpj_cpf VARCHAR(20),
  
  -- Contato
  email VARCHAR(255),
  telefone VARCHAR(20),
  telefone_secundario VARCHAR(20),
  
  -- EndereÃ§o
  endereco_logradouro VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  endereco_pais VARCHAR(2) DEFAULT 'BR',
  
  -- Financeiro
  limite_credito DECIMAL(15, 2),
  dias_prazo_pagamento INTEGER,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- ObservaÃ§Ãµes
  observacoes TEXT,
  tags TEXT[],
  
  -- Metadados
  dados_adicionais JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices
CREATE INDEX IF NOT EXISTS idx_clientes_tenant ON public.clientes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj_cpf ON public.clientes(cnpj_cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON public.clientes(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON public.clientes(nome);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. TABELA FORNECEDORES (usado em duplicatas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- IdentificaÃ§Ã£o
  nome VARCHAR(255) NOT NULL,
  razao_social VARCHAR(255),
  cnpj_cpf VARCHAR(20),
  
  -- Contato
  email VARCHAR(255),
  telefone VARCHAR(20),
  contato_nome VARCHAR(255),
  
  -- EndereÃ§o
  endereco_logradouro VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  endereco_pais VARCHAR(2) DEFAULT 'BR',
  
  -- Dados BancÃ¡rios
  banco_codigo VARCHAR(10),
  banco_nome VARCHAR(255),
  agencia VARCHAR(20),
  conta VARCHAR(30),
  tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente', 'poupanca')),
  pix_chave VARCHAR(255),
  pix_tipo VARCHAR(20) CHECK (pix_tipo IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria')),
  
  -- Financeiro
  prazo_pagamento_padrao INTEGER, -- dias
  desconto_padrao DECIMAL(5, 2), -- percentual
  
  -- ClassificaÃ§Ã£o
  tipo_servico VARCHAR(100),
  categoria VARCHAR(100),
  tags TEXT[],
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- ObservaÃ§Ãµes
  observacoes TEXT,
  
  -- Metadados
  dados_adicionais JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices
CREATE INDEX IF NOT EXISTS idx_fornecedores_tenant ON public.fin_fornecedores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fornecedores_cnpj_cpf ON public.fin_fornecedores(cnpj_cpf);
CREATE INDEX IF NOT EXISTS idx_fornecedores_ativo ON public.fin_fornecedores(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_fornecedores_nome ON public.fin_fornecedores(nome);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_fornecedores_updated_at ON public.fin_fornecedores;
CREATE TRIGGER update_fornecedores_updated_at
  BEFORE UPDATE ON public.fin_fornecedores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_fornecedores ENABLE ROW LEVEL SECURITY;

-- Policies para tenants
DROP POLICY IF EXISTS tenants_user_access ON public.tenants;
CREATE POLICY tenants_user_access ON public.tenants
  FOR ALL
  USING (id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Policies para users
DROP POLICY IF EXISTS users_own_record ON public.users;
CREATE POLICY users_own_record ON public.users
  FOR ALL
  USING (auth_user_id = auth.uid() OR id IN (
    SELECT ut2.user_id 
    FROM public.user_tenants ut1
    JOIN public.user_tenants ut2 ON ut1.tenant_id = ut2.tenant_id
    WHERE ut1.user_id = auth.uid()
  ));

-- Policies para user_tenants
DROP POLICY IF EXISTS user_tenants_access ON public.user_tenants;
CREATE POLICY user_tenants_access ON public.user_tenants
  FOR ALL
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()
  ));

-- Policies para clientes
DROP POLICY IF EXISTS clientes_tenant_isolation ON public.clientes;
CREATE POLICY clientes_tenant_isolation ON public.clientes
  FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Policies para fornecedores
DROP POLICY IF EXISTS fornecedores_tenant_isolation ON public.fin_fornecedores;
CREATE POLICY fornecedores_tenant_isolation ON public.fin_fornecedores
  FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- =====================================================
-- 7. SEED DATA (Opcional - Tenants PadrÃ£o)
-- =====================================================

-- Inserir tenants padrÃ£o se nÃ£o existirem
INSERT INTO public.tenants (id, nome, slug, marca, ativo, plano)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'NORO Vistos', 'noro', 'noro', true, 'enterprise'),
  ('00000000-0000-0000-0000-000000000002', 'NÃ´made Vistos', 'nomade', 'nomade', true, 'enterprise'),
  ('00000000-0000-0000-0000-000000000003', 'SafeTrip', 'safetrip', 'safetrip', true, 'pro'),
  ('00000000-0000-0000-0000-000000000004', 'Vistos Online', 'vistos', 'vistos', true, 'pro')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 8. COMENTÃRIOS
-- =====================================================

COMMENT ON TABLE public.tenants IS 'Empresas/organizaÃ§Ãµes no sistema multi-tenant';
COMMENT ON TABLE public.users IS 'UsuÃ¡rios do sistema';
COMMENT ON TABLE public.user_tenants IS 'Relacionamento usuÃ¡rios-tenants com roles';
COMMENT ON TABLE public.clientes IS 'Clientes dos tenants';
COMMENT ON TABLE public.fin_fornecedores IS 'Fornecedores para sistema financeiro';

COMMENT ON COLUMN public.user_tenants.role IS 'Papel: owner (dono), admin (administrador), manager (gerente), user (usuÃ¡rio), viewer (visualizador)';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================


-- ============================================
-- ARQUIVO: 20251030_financeiro_schema.sql
-- ============================================

-- Migration: MÃ³dulo Financeiro NORO
-- Data: 2025-10-30
-- DescriÃ§Ã£o: CriaÃ§Ã£o completa do schema financeiro multi-marca

-- ==============================================
-- SCHEMA: public
-- OTIMIZAÃ‡Ã•ES: Ãndices estratÃ©gicos para alta performance
-- PREPARADO PARA: Particionamento futuro por data
-- ==============================================

-- CONFIGURAÃ‡ÃƒO: Aumentar work_mem para queries financeiras pesadas
-- SET work_mem = '256MB'; -- Descomentar se necessÃ¡rio

-- 1. CONTAS BANCÃRIAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_contas_bancarias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL, -- 'nomade', 'safetrip', 'vistos', 'noro'
    nome text NOT NULL, -- Ex: "ItaÃº Empresa", "Wise USD"
    tipo text NOT NULL, -- 'corrente', 'poupanca', 'investimento', 'internacional'
    banco text NOT NULL,
    agencia text,
    conta text,
    moeda text NOT NULL DEFAULT 'BRL', -- ISO 4217 (BRL, USD, EUR)
    saldo_inicial numeric(15,2) DEFAULT 0,
    saldo_atual numeric(15,2) DEFAULT 0,
    ativo boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_contas_tenant ON public.fin_contas_bancarias(tenant_id);
CREATE INDEX idx_fin_contas_marca ON public.fin_contas_bancarias(marca);
CREATE INDEX idx_fin_contas_ativo ON public.fin_contas_bancarias(ativo);

-- 2. CATEGORIAS FINANCEIRAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_categorias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    nome text NOT NULL,
    tipo text NOT NULL, -- 'receita', 'despesa'
    categoria_pai_id uuid REFERENCES public.fin_categorias(id),
    cor text, -- HEX color para UI
    icone text, -- Emoji ou nome do Ã­cone
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_categorias_tenant ON public.fin_categorias(tenant_id);
CREATE INDEX idx_fin_categorias_tipo ON public.fin_categorias(tipo);

-- 3. RECEITAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_receitas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    descricao text NOT NULL,
    categoria_id uuid REFERENCES public.fin_categorias(id),
    valor numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    taxa_cambio numeric(10,4) DEFAULT 1,
    valor_brl numeric(15,2) GENERATED ALWAYS AS (valor * taxa_cambio) STORED,
    
    tipo_receita text NOT NULL, -- 'servico', 'produto', 'comissao', 'recorrente', 'outro'
    
    -- Relacionamentos
    cliente_id uuid REFERENCES public.noro_clientes(id),
    orcamento_id uuid REFERENCES public.noro_orcamentos(id),
    pedido_id uuid REFERENCES public.noro_pedidos(id),
    
    -- Controle financeiro
    status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado', 'atrasado'
    data_vencimento date NOT NULL,
    data_pagamento date,
    data_competencia date NOT NULL,
    
    forma_pagamento text, -- 'pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia', 'internacional'
    gateway_pagamento text, -- 'stripe', 'cielo', 'paypal', 'remessa_online', 'wise'
    transaction_id text, -- ID da transaÃ§Ã£o no gateway
    
    conta_bancaria_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- ComissÃµes
    possui_comissao boolean DEFAULT false,
    valor_comissao numeric(15,2),
    percentual_comissao numeric(5,2),
    fornecedor_comissao_id uuid REFERENCES public.noro_fornecedores(id),
    
    -- RecorrÃªncia
    recorrente boolean DEFAULT false,
    frequencia_recorrencia text, -- 'mensal', 'trimestral', 'semestral', 'anual'
    proximo_vencimento date,
    
    -- Notas e documentos
    nota_fiscal text,
    recibo_url text,
    observacoes text,
    
    -- Auditoria
    created_by uuid REFERENCES public.noro_users(id),
    updated_by uuid REFERENCES public.noro_users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_receitas_tenant ON public.fin_receitas(tenant_id);
CREATE INDEX idx_fin_receitas_marca ON public.fin_receitas(marca);
CREATE INDEX idx_fin_receitas_status ON public.fin_receitas(status);
CREATE INDEX idx_fin_receitas_data_vencimento ON public.fin_receitas(data_vencimento);
CREATE INDEX idx_fin_receitas_cliente ON public.fin_receitas(cliente_id);
CREATE INDEX idx_fin_receitas_competencia ON public.fin_receitas(data_competencia);

-- ÃNDICES COMPOSTOS para queries comuns (otimizaÃ§Ã£o crÃ­tica)
CREATE INDEX idx_fin_receitas_tenant_status ON public.fin_receitas(tenant_id, status);
CREATE INDEX idx_fin_receitas_tenant_competencia ON public.fin_receitas(tenant_id, data_competencia DESC);
CREATE INDEX idx_fin_receitas_tenant_marca_status ON public.fin_receitas(tenant_id, marca, status);

-- ÃNDICE PARCIAL para contas pendentes (mais usado)
CREATE INDEX idx_fin_receitas_pendentes ON public.fin_receitas(tenant_id, data_vencimento) 
WHERE status IN ('pendente', 'atrasado');

-- 4. DESPESAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_despesas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    descricao text NOT NULL,
    categoria_id uuid REFERENCES public.fin_categorias(id),
    valor numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    taxa_cambio numeric(10,4) DEFAULT 1,
    valor_brl numeric(15,2) GENERATED ALWAYS AS (valor * taxa_cambio) STORED,
    
    tipo_despesa text NOT NULL, -- 'fixa', 'variavel', 'operacional', 'marketing', 'fornecedor', 'salario', 'outro'
    
    -- Relacionamentos
    fornecedor_id uuid REFERENCES public.noro_fornecedores(id),
    pedido_id uuid REFERENCES public.noro_pedidos(id),
    
    -- Controle financeiro
    status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado', 'atrasado'
    data_vencimento date NOT NULL,
    data_pagamento date,
    data_competencia date NOT NULL,
    
    forma_pagamento text,
    conta_bancaria_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Centro de custo
    centro_custo text, -- 'infraestrutura', 'marketing', 'operacional', 'administrativo'
    projeto_associado text, -- Ex: "Grupo Rio Janeiro 2025"
    
    -- RecorrÃªncia
    recorrente boolean DEFAULT false,
    frequencia_recorrencia text,
    proximo_vencimento date,
    
    -- Documentos
    nota_fiscal text,
    comprovante_url text,
    observacoes text,
    
    -- Auditoria
    created_by uuid REFERENCES public.noro_users(id),
    updated_by uuid REFERENCES public.noro_users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_despesas_tenant ON public.fin_despesas(tenant_id);
CREATE INDEX idx_fin_despesas_marca ON public.fin_despesas(marca);
CREATE INDEX idx_fin_despesas_status ON public.fin_despesas(status);
CREATE INDEX idx_fin_despesas_data_vencimento ON public.fin_despesas(data_vencimento);
CREATE INDEX idx_fin_despesas_fornecedor ON public.fin_despesas(fornecedor_id);
CREATE INDEX idx_fin_despesas_competencia ON public.fin_despesas(data_competencia);
CREATE INDEX idx_fin_despesas_centro_custo ON public.fin_despesas(centro_custo);

-- ÃNDICES COMPOSTOS para queries comuns
CREATE INDEX idx_fin_despesas_tenant_status ON public.fin_despesas(tenant_id, status);
CREATE INDEX idx_fin_despesas_tenant_competencia ON public.fin_despesas(tenant_id, data_competencia DESC);
CREATE INDEX idx_fin_despesas_tenant_marca_status ON public.fin_despesas(tenant_id, marca, status);

-- ÃNDICE PARCIAL para contas pendentes
CREATE INDEX idx_fin_despesas_pendentes ON public.fin_despesas(tenant_id, data_vencimento) 
WHERE status IN ('pendente', 'atrasado');

-- 5. FLUXO DE CAIXA (TRANSAÃ‡Ã•ES)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_transacoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    tipo text NOT NULL, -- 'entrada', 'saida', 'transferencia'
    descricao text NOT NULL,
    valor numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    
    conta_origem_id uuid REFERENCES public.fin_contas_bancarias(id),
    conta_destino_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Relacionamento com receitas/despesas
    receita_id uuid REFERENCES public.fin_receitas(id),
    despesa_id uuid REFERENCES public.fin_despesas(id),
    
    categoria_id uuid REFERENCES public.fin_categorias(id),
    
    data_transacao date NOT NULL DEFAULT CURRENT_DATE,
    data_competencia date NOT NULL DEFAULT CURRENT_DATE,
    
    status text NOT NULL DEFAULT 'efetivada', -- 'pendente', 'efetivada', 'cancelada'
    
    observacoes text,
    metadata jsonb DEFAULT '{}',
    
    created_by uuid REFERENCES public.noro_users(id),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_transacoes_tenant ON public.fin_transacoes(tenant_id);
CREATE INDEX idx_fin_transacoes_marca ON public.fin_transacoes(marca);
CREATE INDEX idx_fin_transacoes_tipo ON public.fin_transacoes(tipo);
CREATE INDEX idx_fin_transacoes_data ON public.fin_transacoes(data_transacao);
CREATE INDEX idx_fin_transacoes_conta_origem ON public.fin_transacoes(conta_origem_id);
CREATE INDEX idx_fin_transacoes_conta_destino ON public.fin_transacoes(conta_destino_id);

-- 6. PLANO DE CONTAS CONTÃBIL
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_plano_contas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    codigo text NOT NULL, -- Ex: "1.1.01.001"
    nome text NOT NULL,
    tipo text NOT NULL, -- 'ativo', 'passivo', 'receita', 'despesa', 'patrimonio_liquido'
    nivel integer NOT NULL,
    conta_pai_id uuid REFERENCES public.fin_plano_contas(id),
    aceita_lancamento boolean DEFAULT true,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, codigo)
);

CREATE INDEX idx_fin_plano_tenant ON public.fin_plano_contas(tenant_id);
CREATE INDEX idx_fin_plano_tipo ON public.fin_plano_contas(tipo);

-- 7. COMISSÃ•ES
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_comissoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    receita_id uuid REFERENCES public.fin_receitas(id) ON DELETE CASCADE,
    fornecedor_id uuid REFERENCES public.noro_fornecedores(id),
    
    percentual numeric(5,2) NOT NULL,
    valor_comissao numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    
    status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado'
    data_vencimento date,
    data_pagamento date,
    
    observacoes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_comissoes_receita ON public.fin_comissoes(receita_id);
CREATE INDEX idx_fin_comissoes_fornecedor ON public.fin_comissoes(fornecedor_id);

-- 8. PROJEÃ‡Ã•ES DE FLUXO DE CAIXA
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_projecoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    mes_referencia date NOT NULL, -- Primeiro dia do mÃªs
    
    receita_prevista numeric(15,2) DEFAULT 0,
    despesa_prevista numeric(15,2) DEFAULT 0,
    saldo_previsto numeric(15,2) GENERATED ALWAYS AS (receita_prevista - despesa_prevista) STORED,
    
    receita_realizada numeric(15,2) DEFAULT 0,
    despesa_realizada numeric(15,2) DEFAULT 0,
    saldo_realizado numeric(15,2) GENERATED ALWAYS AS (receita_realizada - despesa_realizada) STORED,
    
    cenario text DEFAULT 'realista', -- 'otimista', 'realista', 'pessimista'
    
    observacoes text,
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, marca, mes_referencia, cenario)
);

CREATE INDEX idx_fin_projecoes_tenant ON public.fin_projecoes(tenant_id);
CREATE INDEX idx_fin_projecoes_mes ON public.fin_projecoes(mes_referencia);

-- ==============================================
-- TRIGGERS
-- ==============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fin_contas_bancarias_updated_at BEFORE UPDATE ON public.fin_contas_bancarias FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_receitas_updated_at BEFORE UPDATE ON public.fin_receitas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_despesas_updated_at BEFORE UPDATE ON public.fin_despesas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_comissoes_updated_at BEFORE UPDATE ON public.fin_comissoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_projecoes_updated_at BEFORE UPDATE ON public.fin_projecoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para atualizar saldo da conta ao criar transaÃ§Ã£o
CREATE OR REPLACE FUNCTION atualizar_saldo_conta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'efetivada' THEN
        -- Se for entrada ou saÃ­da simples
        IF NEW.tipo = 'entrada' AND NEW.conta_destino_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        ELSIF NEW.tipo = 'saida' AND NEW.conta_origem_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
        ELSIF NEW.tipo = 'transferencia' THEN
            -- Debita da origem
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
            -- Credita no destino
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_atualizar_saldo 
    AFTER INSERT ON public.fin_transacoes
    FOR EACH ROW EXECUTE PROCEDURE atualizar_saldo_conta();

-- ==============================================
-- RLS (Row Level Security)
-- ==============================================

ALTER TABLE public.fin_contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_plano_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_projecoes ENABLE ROW LEVEL SECURITY;

-- Policy: UsuÃ¡rios autenticados podem ler dados do seu tenant
CREATE POLICY "Permitir leitura para usuÃ¡rios autenticados do tenant"
    ON public.fin_contas_bancarias FOR SELECT
    TO authenticated
    USING (
        tenant_id IN (
            SELECT tenant_id FROM cp.control_plane_users 
            WHERE auth_id = auth.uid()
        )
    );

-- Replicar policies similares para todas as tabelas financeiras
-- (Por questÃ£o de espaÃ§o, seria replicado para cada tabela)

-- ==============================================
-- VIEWS ÃšTEIS
-- ==============================================

-- View: Resumo financeiro por marca
CREATE OR REPLACE VIEW v_fin_resumo_marca AS
WITH receitas_agrupadas AS (
    SELECT 
        marca,
        DATE_TRUNC('month', data_competencia) as mes,
        SUM(CASE WHEN status = 'pago' THEN valor_brl ELSE 0 END) as receita_realizada
    FROM fin_receitas
    GROUP BY marca, DATE_TRUNC('month', data_competencia)
),
despesas_agrupadas AS (
    SELECT 
        marca,
        DATE_TRUNC('month', data_competencia) as mes,
        SUM(CASE WHEN status = 'pago' THEN valor_brl ELSE 0 END) as despesa_realizada
    FROM fin_despesas
    GROUP BY marca, DATE_TRUNC('month', data_competencia)
)
SELECT 
    COALESCE(r.marca, d.marca) as marca,
    COALESCE(r.mes, d.mes) as mes,
    COALESCE(r.receita_realizada, 0) as receita_realizada,
    COALESCE(d.despesa_realizada, 0) as despesa_realizada,
    COALESCE(r.receita_realizada, 0) - COALESCE(d.despesa_realizada, 0) as lucro
FROM receitas_agrupadas r
FULL OUTER JOIN despesas_agrupadas d 
    ON r.marca = d.marca AND r.mes = d.mes;

-- View: Contas a receber
CREATE OR REPLACE VIEW v_fin_contas_receber AS
SELECT 
    id,
    marca,
    descricao,
    valor_brl as valor,
    data_vencimento,
    CASE 
        WHEN data_vencimento < CURRENT_DATE AND status = 'pendente' THEN 'atrasado'
        ELSE status
    END as status_real,
    CURRENT_DATE - data_vencimento as dias_atraso,
    cliente_id,
    forma_pagamento
FROM fin_receitas
WHERE status IN ('pendente', 'atrasado')
ORDER BY data_vencimento;

-- View: Contas a pagar
CREATE OR REPLACE VIEW v_fin_contas_pagar AS
SELECT 
    id,
    marca,
    descricao,
    valor_brl as valor,
    data_vencimento,
    CASE 
        WHEN data_vencimento < CURRENT_DATE AND status = 'pendente' THEN 'atrasado'
        ELSE status
    END as status_real,
    CURRENT_DATE - data_vencimento as dias_atraso,
    fornecedor_id,
    forma_pagamento
FROM fin_despesas
WHERE status IN ('pendente', 'atrasado')
ORDER BY data_vencimento;

-- ==============================================
-- SEED DATA
-- ==============================================

-- Categorias padrÃ£o de receita
INSERT INTO public.fin_categorias (tenant_id, nome, tipo, cor, icone, ordem) VALUES
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'ServiÃ§os de Viagem', 'receita', '#10b981', 'âœˆï¸', 1),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Vistos', 'receita', '#3b82f6', 'ðŸ“‹', 2),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Seguros', 'receita', '#8b5cf6', 'ðŸ›¡ï¸', 3),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'ComissÃµes', 'receita', '#f59e0b', 'ðŸ’°', 4),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Assinaturas Recorrentes', 'receita', '#06b6d4', 'ðŸ”„', 5);

-- Categorias padrÃ£o de despesa
INSERT INTO public.fin_categorias (tenant_id, nome, tipo, cor, icone, ordem) VALUES
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Fornecedores', 'despesa', '#ef4444', 'ðŸ¢', 1),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Infraestrutura', 'despesa', '#6366f1', 'ðŸ–¥ï¸', 2),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Marketing', 'despesa', '#ec4899', 'ðŸ“¢', 3),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'SalÃ¡rios', 'despesa', '#14b8a6', 'ðŸ‘¥', 4),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Impostos', 'despesa', '#f97316', 'ðŸ“Š', 5);

-- ==============================================
-- NOTAS DE ESCALABILIDADE E PERFORMANCE
-- ==============================================

-- QUANDO MIGRAR PARA BD SEPARADO?
-- Considere separar o mÃ³dulo financeiro quando:
-- 1. Volume de transaÃ§Ãµes > 1 milhÃ£o/mÃªs
-- 2. LatÃªncia de queries > 500ms consistentemente
-- 3. ConexÃµes simultÃ¢neas > 80% do pool do Supabase
-- 4. Precisa de backup mais frequente (ex: a cada 1h)

-- PARTICIONAMENTO (Futuro)
-- Se o volume crescer muito, particionar por data:
-- CREATE TABLE fin_receitas_2025_01 PARTITION OF fin_receitas
--   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- ARCHIVING (Futuro)
-- Mover dados antigos (> 2 anos) para tabelas de arquivo:
-- CREATE TABLE fin_receitas_archive AS 
--   SELECT * FROM fin_receitas WHERE data_competencia < '2023-01-01';

-- MATERIALIZED VIEWS para Dashboards (Futuro)
-- Se dashboards ficarem lentos, criar views materializadas:
-- CREATE MATERIALIZED VIEW mv_fin_kpis_mensal AS
--   SELECT tenant_id, marca, DATE_TRUNC('month', data_competencia) as mes,
--          SUM(valor_brl) as receita_total
--   FROM fin_receitas WHERE status = 'pago'
--   GROUP BY 1, 2, 3;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_fin_kpis_mensal;

-- CONNECTION POOLING
-- Usar PgBouncer se comeÃ§ar a ter problemas de conexÃ£o:
-- https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool

COMMIT;


-- ============================================
-- ARQUIVO: 20251030_create_centros_custo.sql
-- ============================================

-- =====================================================
-- CENTRO DE CUSTOS E PROJETOS
-- Controle de rentabilidade por viagem, grupo ou cliente
-- =====================================================

-- Tabela de Centros de Custo (Projetos)
CREATE TABLE IF NOT EXISTS public.fin_centros_custo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- IdentificaÃ§Ã£o
  codigo VARCHAR(50) NOT NULL, -- Ex: "RIO-OUT-25", "GRUPO-ARGENTINA-123"
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  
  -- ClassificaÃ§Ã£o
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('viagem', 'grupo', 'cliente', 'projeto', 'evento', 'outros')),
  marca VARCHAR(50) CHECK (marca IN ('noro', 'nomade', 'safetrip', 'vistos', 'outro')),
  
  -- PerÃ­odo
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  -- Financeiro
  orcamento_previsto DECIMAL(15,2) DEFAULT 0,
  moeda VARCHAR(3) DEFAULT 'BRL',
  
  -- Metas
  meta_margem_percentual DECIMAL(5,2) DEFAULT 15.00, -- Meta de margem em %
  meta_receita DECIMAL(15,2),
  
  -- Status
  status VARCHAR(30) NOT NULL DEFAULT 'planejamento' 
    CHECK (status IN ('planejamento', 'ativo', 'concluido', 'cancelado')),
  
  -- ResponsÃ¡veis
  responsavel_id UUID, -- FK para usuÃ¡rio responsÃ¡vel
  equipe JSONB, -- Array de user_ids da equipe
  
  -- Metadados
  tags TEXT[], -- Tags para busca/filtro
  metadata JSONB, -- Dados extras especÃ­ficos do tipo
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CONSTRAINT unique_codigo_tenant UNIQUE (tenant_id, codigo)
);

-- Tabela de AlocaÃ§Ãµes (Rateio de Receitas e Despesas)
CREATE TABLE IF NOT EXISTS public.fin_alocacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  centro_custo_id UUID NOT NULL REFERENCES public.fin_centros_custo(id) ON DELETE CASCADE,
  receita_id UUID REFERENCES public.fin_receitas(id) ON DELETE CASCADE,
  despesa_id UUID REFERENCES public.fin_despesas(id) ON DELETE CASCADE,
  
  -- Rateio
  tipo_rateio VARCHAR(30) NOT NULL CHECK (tipo_rateio IN ('percentual', 'valor_fixo', 'proporcional')),
  percentual_alocacao DECIMAL(5,2), -- 0-100%
  valor_alocado DECIMAL(15,2) NOT NULL, -- Valor em BRL
  
  -- Detalhes
  observacoes TEXT,
  data_alocacao DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CHECK (
    (receita_id IS NOT NULL AND despesa_id IS NULL) OR
    (receita_id IS NULL AND despesa_id IS NOT NULL)
  ), -- Deve ter receita OU despesa, nÃ£o ambos
  CHECK (
    (tipo_rateio = 'percentual' AND percentual_alocacao IS NOT NULL AND percentual_alocacao >= 0 AND percentual_alocacao <= 100) OR
    (tipo_rateio IN ('valor_fixo', 'proporcional'))
  )
);

-- Ãndices para performance
CREATE INDEX idx_centros_custo_tenant ON public.fin_centros_custo(tenant_id);
CREATE INDEX idx_centros_custo_status ON public.fin_centros_custo(status);
CREATE INDEX idx_centros_custo_tipo ON public.fin_centros_custo(tipo);
CREATE INDEX idx_centros_custo_marca ON public.fin_centros_custo(marca);
CREATE INDEX idx_centros_custo_datas ON public.fin_centros_custo(data_inicio, data_fim);
CREATE INDEX idx_centros_custo_codigo ON public.fin_centros_custo(codigo);

CREATE INDEX idx_alocacoes_tenant ON public.fin_alocacoes(tenant_id);
CREATE INDEX idx_alocacoes_centro_custo ON public.fin_alocacoes(centro_custo_id);
CREATE INDEX idx_alocacoes_receita ON public.fin_alocacoes(receita_id);
CREATE INDEX idx_alocacoes_despesa ON public.fin_alocacoes(despesa_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_centros_custo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_centros_custo_updated_at
  BEFORE UPDATE ON public.fin_centros_custo
  FOR EACH ROW
  EXECUTE FUNCTION update_centros_custo_updated_at();

CREATE TRIGGER trigger_alocacoes_updated_at
  BEFORE UPDATE ON public.fin_alocacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_centros_custo_updated_at();

-- RLS Policies
ALTER TABLE public.fin_centros_custo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_alocacoes ENABLE ROW LEVEL SECURITY;

-- Policy para centros de custo
CREATE POLICY "Centros de custo sÃ£o isolados por tenant"
  ON public.fin_centros_custo
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Policy para alocaÃ§Ãµes
CREATE POLICY "AlocaÃ§Ãµes sÃ£o isoladas por tenant"
  ON public.fin_alocacoes
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- View para Rentabilidade por Centro de Custo
CREATE OR REPLACE VIEW public.vw_rentabilidade_centros_custo AS
SELECT 
  cc.id,
  cc.tenant_id,
  cc.codigo,
  cc.nome,
  cc.tipo,
  cc.marca,
  cc.status,
  cc.data_inicio,
  cc.data_fim,
  cc.orcamento_previsto,
  cc.meta_margem_percentual,
  cc.meta_receita,
  
  -- Receitas
  COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS receitas_total,
  
  -- Despesas
  COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS despesas_total,
  
  -- CÃ¡lculos
  COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS margem_liquida,
  
  CASE 
    WHEN COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) > 0 THEN
      ((COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0)) / 
       COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 1)) * 100
    ELSE 0
  END AS margem_percentual,
  
  -- OrÃ§amento
  cc.orcamento_previsto - COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS saldo_orcamento,
  
  CASE 
    WHEN cc.orcamento_previsto > 0 THEN
      (COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) / cc.orcamento_previsto) * 100
    ELSE 0
  END AS percentual_orcamento_utilizado,
  
  -- Contadores
  COUNT(DISTINCT a.receita_id) AS qtd_receitas,
  COUNT(DISTINCT a.despesa_id) AS qtd_despesas,
  
  cc.created_at,
  cc.updated_at
  
FROM public.fin_centros_custo cc
LEFT JOIN public.fin_alocacoes a ON cc.id = a.centro_custo_id
GROUP BY cc.id;

-- ComentÃ¡rios
COMMENT ON TABLE public.fin_centros_custo IS 'Centros de custo e projetos para controle de rentabilidade';
COMMENT ON TABLE public.fin_alocacoes IS 'AlocaÃ§Ã£o e rateio de receitas e despesas em centros de custo';
COMMENT ON VIEW public.vw_rentabilidade_centros_custo IS 'View agregada com cÃ¡lculos de rentabilidade por centro de custo';

COMMENT ON COLUMN public.fin_centros_custo.codigo IS 'CÃ³digo Ãºnico do projeto (ex: RIO-OUT-25)';
COMMENT ON COLUMN public.fin_centros_custo.tipo IS 'Tipo: viagem, grupo, cliente, projeto, evento, outros';
COMMENT ON COLUMN public.fin_centros_custo.meta_margem_percentual IS 'Meta de margem lÃ­quida em percentual (padrÃ£o 15%)';
COMMENT ON COLUMN public.fin_alocacoes.tipo_rateio IS 'Tipo de rateio: percentual, valor_fixo, proporcional';


-- ============================================
-- ARQUIVO: 20251030_create_duplicatas_avancado.sql
-- ============================================

-- =====================================================
-- CONTAS A PAGAR/RECEBER AVANÃ‡ADO
-- Duplicatas, Adiantamentos, CrÃ©ditos e CondiÃ§Ãµes
-- =====================================================

-- =====================================================
-- 1. CONDIÃ‡Ã•ES DE PAGAMENTO
-- =====================================================

CREATE TYPE fin_tipo_condicao_pagamento AS ENUM (
  'a_vista',
  'd_plus_15',
  'd_plus_30',
  'd_plus_45',
  'd_plus_60',
  'apos_checkout',
  'apos_embarque',
  'entrada_mais_parcelas',
  'personalizado'
);

CREATE TYPE fin_referencia_data AS ENUM (
  'emissao',
  'checkout',
  'embarque',
  'entrega',
  'personalizada'
);

CREATE TABLE fin_condicoes_pagamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- IdentificaÃ§Ã£o
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(20),
  tipo fin_tipo_condicao_pagamento NOT NULL,
  
  -- ConfiguraÃ§Ã£o
  dias_vencimento INTEGER DEFAULT 0,
  referencia_data fin_referencia_data DEFAULT 'emissao',
  numero_parcelas INTEGER DEFAULT 1,
  intervalo_parcelas INTEGER DEFAULT 30, -- dias entre parcelas
  
  -- Descontos/Juros
  percentual_desconto_antecipacao DECIMAL(5,2),
  percentual_juros_atraso DECIMAL(5,2),
  
  -- ObservaÃ§Ãµes
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. DUPLICATAS A RECEBER
-- =====================================================

CREATE TYPE fin_status_duplicata AS ENUM (
  'aberta',
  'parcialmente_recebida',
  'recebida',
  'vencida',
  'cancelada',
  'protestada',
  'negociacao'
);

CREATE TABLE fin_duplicatas_receber (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  -- IdentificaÃ§Ã£o
  numero_duplicata VARCHAR(50) NOT NULL,
  numero_nota_fiscal VARCHAR(50),
  serie_nota_fiscal VARCHAR(10),
  chave_acesso_nfe VARCHAR(44), -- Chave de acesso da NF-e
  
  -- Relacionamentos
  cliente_id UUID, -- referencia a tabela de clientes
  fornecedor_intermediario_id UUID, -- fornecedor que intermediou
  reserva_id UUID, -- vinculaÃ§Ã£o com reserva
  pedido_id UUID, -- vinculaÃ§Ã£o com pedido
  orcamento_id UUID,
  condicao_pagamento_id UUID REFERENCES fin_condicoes_pagamento(id),
  
  -- Valores
  valor_original DECIMAL(15,2) NOT NULL,
  valor_desconto DECIMAL(15,2) DEFAULT 0,
  valor_juros DECIMAL(15,2) DEFAULT 0,
  valor_total DECIMAL(15,2) NOT NULL,
  valor_recebido DECIMAL(15,2) DEFAULT 0,
  valor_pendente DECIMAL(15,2) NOT NULL,
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  valor_brl DECIMAL(15,2) GENERATED ALWAYS AS (valor_total * taxa_cambio) STORED,
  
  -- Datas
  data_emissao DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  data_recebimento DATE,
  data_referencia DATE, -- data base para cÃ¡lculo (checkout, embarque, etc)
  
  -- Status e Controle
  status fin_status_duplicata DEFAULT 'aberta',
  dias_atraso INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN status IN ('recebida', 'cancelada') THEN 0
      WHEN CURRENT_DATE > data_vencimento THEN EXTRACT(DAY FROM CURRENT_DATE - data_vencimento)::INTEGER
      ELSE 0
    END
  ) STORED,
  
  -- Dados do Cliente (cache para relatÃ³rios)
  cliente_nome VARCHAR(200),
  cliente_documento VARCHAR(20),
  cliente_email VARCHAR(200),
  cliente_telefone VARCHAR(20),
  
  -- ObservaÃ§Ãµes e Documentos
  observacoes TEXT,
  condicao_pagamento_texto TEXT, -- descriÃ§Ã£o textual da condiÃ§Ã£o
  documento_url TEXT,
  xml_nfe_url TEXT, -- URL do XML da NF-e armazenado
  
  -- Auditoria
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. DUPLICATAS A PAGAR
-- =====================================================

CREATE TABLE fin_duplicatas_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  -- IdentificaÃ§Ã£o
  numero_duplicata VARCHAR(50) NOT NULL,
  numero_nota_fiscal VARCHAR(50),
  serie_nota_fiscal VARCHAR(10),
  chave_acesso_nfe VARCHAR(44),
  
  -- Relacionamentos
  fornecedor_id UUID NOT NULL, -- referencia a tabela de fornecedores
  reserva_id UUID,
  pedido_id UUID,
  condicao_pagamento_id UUID REFERENCES fin_condicoes_pagamento(id),
  adiantamento_id UUID, -- vinculado a um adiantamento
  
  -- Valores
  valor_original DECIMAL(15,2) NOT NULL,
  valor_desconto DECIMAL(15,2) DEFAULT 0,
  valor_juros DECIMAL(15,2) DEFAULT 0,
  valor_total DECIMAL(15,2) NOT NULL,
  valor_pago DECIMAL(15,2) DEFAULT 0,
  valor_pendente DECIMAL(15,2) NOT NULL,
  valor_credito_aplicado DECIMAL(15,2) DEFAULT 0, -- crÃ©ditos aplicados
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  valor_brl DECIMAL(15,2) GENERATED ALWAYS AS (valor_total * taxa_cambio) STORED,
  
  -- Datas
  data_emissao DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  data_referencia DATE,
  
  -- Status e Controle
  status fin_status_duplicata DEFAULT 'aberta',
  dias_vencimento INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN status IN ('recebida', 'cancelada') THEN 0
      ELSE EXTRACT(DAY FROM data_vencimento - CURRENT_DATE)::INTEGER
    END
  ) STORED,
  
  -- Dados do Fornecedor (cache)
  fornecedor_nome VARCHAR(200),
  fornecedor_documento VARCHAR(20),
  fornecedor_email VARCHAR(200),
  fornecedor_telefone VARCHAR(20),
  
  -- Controle de Pagamento
  forma_pagamento forma_pagamento,
  conta_bancaria_id UUID,
  comprovante_pagamento_url TEXT,
  
  -- ObservaÃ§Ãµes e Documentos
  observacoes TEXT,
  condicao_pagamento_texto TEXT,
  documento_url TEXT,
  xml_nfe_url TEXT,
  
  -- Auditoria
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 4. PARCELAS (para duplicatas parceladas)
-- =====================================================

CREATE TABLE fin_parcelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  duplicata_receber_id UUID REFERENCES fin_duplicatas_receber(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  -- Parcela
  numero_parcela INTEGER NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  valor_pago DECIMAL(15,2) DEFAULT 0,
  
  -- Datas
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  -- Status
  status fin_status_duplicata DEFAULT 'aberta',
  
  -- ObservaÃ§Ãµes
  observacoes TEXT,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_duplicata_tipo CHECK (
    (duplicata_receber_id IS NOT NULL AND duplicata_pagar_id IS NULL) OR
    (duplicata_receber_id IS NULL AND duplicata_pagar_id IS NOT NULL)
  )
);

-- =====================================================
-- 5. ADIANTAMENTOS
-- =====================================================

CREATE TYPE fin_tipo_adiantamento AS ENUM (
  'pagamento_antecipado',
  'deposito_garantia',
  'sinal',
  'credito_prepago'
);

CREATE TYPE fin_status_adiantamento AS ENUM (
  'ativo',
  'parcialmente_utilizado',
  'totalmente_utilizado',
  'cancelado',
  'expirado'
);

CREATE TABLE fin_adiantamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  -- IdentificaÃ§Ã£o
  numero_adiantamento VARCHAR(50) NOT NULL,
  tipo fin_tipo_adiantamento NOT NULL,
  
  -- Relacionamentos
  fornecedor_id UUID NOT NULL,
  fornecedor_nome VARCHAR(200),
  reserva_id UUID,
  
  -- Valores
  valor_original DECIMAL(15,2) NOT NULL,
  valor_utilizado DECIMAL(15,2) DEFAULT 0,
  valor_disponivel DECIMAL(15,2) NOT NULL,
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  
  -- Datas
  data_pagamento DATE NOT NULL,
  data_expiracao DATE, -- alguns adiantamentos podem expirar
  
  -- Status
  status fin_status_adiantamento DEFAULT 'ativo',
  
  -- Controle
  forma_pagamento forma_pagamento,
  conta_bancaria_id UUID,
  comprovante_pagamento_url TEXT,
  
  -- ObservaÃ§Ãµes
  observacoes TEXT,
  condicoes_uso TEXT,
  
  -- Auditoria
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. CRÃ‰DITOS E REFUNDS
-- =====================================================

CREATE TYPE fin_tipo_credito AS ENUM (
  'refund',
  'overpayment',
  'desconto_fornecedor',
  'credito_futuro',
  'estorno',
  'devolucao'
);

CREATE TYPE fin_status_credito AS ENUM (
  'disponivel',
  'parcialmente_utilizado',
  'totalmente_utilizado',
  'expirado',
  'cancelado'
);

CREATE TABLE fin_creditos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  -- IdentificaÃ§Ã£o
  numero_credito VARCHAR(50) NOT NULL,
  tipo_credito fin_tipo_credito NOT NULL,
  
  -- Relacionamentos
  fornecedor_id UUID NOT NULL,
  fornecedor_nome VARCHAR(200),
  duplicata_origem_id UUID, -- duplicata que gerou o crÃ©dito
  reserva_id UUID,
  
  -- Valores
  valor_original DECIMAL(15,2) NOT NULL,
  valor_utilizado DECIMAL(15,2) DEFAULT 0,
  valor_disponivel DECIMAL(15,2) NOT NULL,
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  
  -- Datas
  data_recebimento DATE NOT NULL,
  data_expiracao DATE,
  
  -- Status
  status fin_status_credito DEFAULT 'disponivel',
  
  -- DocumentaÃ§Ã£o
  motivo TEXT NOT NULL,
  documento_referencia VARCHAR(100),
  comprovante_url TEXT,
  
  -- ObservaÃ§Ãµes
  observacoes TEXT,
  
  -- Auditoria
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. HISTÃ“RICO DE UTILIZAÃ‡ÃƒO (Adiantamentos e CrÃ©ditos)
-- =====================================================

CREATE TABLE fin_utilizacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  adiantamento_id UUID REFERENCES fin_adiantamentos(id) ON DELETE CASCADE,
  credito_id UUID REFERENCES fin_creditos(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  -- Valores
  valor_utilizado DECIMAL(15,2) NOT NULL,
  
  -- Data
  data_utilizacao DATE NOT NULL,
  
  -- ObservaÃ§Ãµes
  observacoes TEXT,
  
  -- Auditoria
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_tipo_utilizacao CHECK (
    (adiantamento_id IS NOT NULL AND credito_id IS NULL) OR
    (adiantamento_id IS NULL AND credito_id IS NOT NULL)
  )
);

-- =====================================================
-- 8. LEMBRETES E NOTIFICAÃ‡Ã•ES
-- =====================================================

CREATE TYPE fin_tipo_lembrete AS ENUM (
  'vencimento_proximo',
  'vencido',
  'cobranca',
  'confirmacao_pagamento'
);

CREATE TYPE fin_canal_notificacao AS ENUM (
  'email',
  'whatsapp',
  'sms',
  'webhook'
);

CREATE TABLE fin_lembretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  duplicata_receber_id UUID REFERENCES fin_duplicatas_receber(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  -- ConfiguraÃ§Ã£o do Lembrete
  tipo_lembrete fin_tipo_lembrete NOT NULL,
  dias_antecedencia INTEGER DEFAULT 0,
  canais fin_canal_notificacao[] DEFAULT ARRAY['email']::fin_canal_notificacao[],
  
  -- DestinatÃ¡rios
  destinatario_nome VARCHAR(200),
  destinatario_email VARCHAR(200),
  destinatario_telefone VARCHAR(20),
  
  -- Controle de Envio
  programado_para TIMESTAMPTZ NOT NULL,
  enviado_em TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, enviado, falha
  erro_mensagem TEXT,
  
  -- ConteÃºdo
  assunto TEXT,
  mensagem TEXT,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 9. ÃNDICES
-- =====================================================

-- CondiÃ§Ãµes de Pagamento
CREATE INDEX idx_condicoes_pagamento_tenant ON fin_condicoes_pagamento(tenant_id);
CREATE INDEX idx_condicoes_pagamento_ativo ON fin_condicoes_pagamento(ativo);

-- Duplicatas a Receber
CREATE INDEX idx_duplicatas_receber_tenant ON fin_duplicatas_receber(tenant_id);
CREATE INDEX idx_duplicatas_receber_status ON fin_duplicatas_receber(status);
CREATE INDEX idx_duplicatas_receber_vencimento ON fin_duplicatas_receber(data_vencimento);
CREATE INDEX idx_duplicatas_receber_cliente ON fin_duplicatas_receber(cliente_id);
CREATE INDEX idx_duplicatas_receber_reserva ON fin_duplicatas_receber(reserva_id);
CREATE INDEX idx_duplicatas_receber_nfe ON fin_duplicatas_receber(chave_acesso_nfe);

-- Duplicatas a Pagar
CREATE INDEX idx_duplicatas_pagar_tenant ON fin_duplicatas_pagar(tenant_id);
CREATE INDEX idx_duplicatas_pagar_status ON fin_duplicatas_pagar(status);
CREATE INDEX idx_duplicatas_pagar_vencimento ON fin_duplicatas_pagar(data_vencimento);
CREATE INDEX idx_duplicatas_pagar_fornecedor ON fin_duplicatas_pagar(fornecedor_id);
CREATE INDEX idx_duplicatas_pagar_reserva ON fin_duplicatas_pagar(reserva_id);
CREATE INDEX idx_duplicatas_pagar_adiantamento ON fin_duplicatas_pagar(adiantamento_id);

-- Parcelas
CREATE INDEX idx_parcelas_duplicata_receber ON fin_parcelas(duplicata_receber_id);
CREATE INDEX idx_parcelas_duplicata_pagar ON fin_parcelas(duplicata_pagar_id);
CREATE INDEX idx_parcelas_vencimento ON fin_parcelas(data_vencimento);
CREATE INDEX idx_parcelas_status ON fin_parcelas(status);

-- Adiantamentos
CREATE INDEX idx_adiantamentos_tenant ON fin_adiantamentos(tenant_id);
CREATE INDEX idx_adiantamentos_fornecedor ON fin_adiantamentos(fornecedor_id);
CREATE INDEX idx_adiantamentos_status ON fin_adiantamentos(status);

-- CrÃ©ditos
CREATE INDEX idx_creditos_tenant ON fin_creditos(tenant_id);
CREATE INDEX idx_creditos_fornecedor ON fin_creditos(fornecedor_id);
CREATE INDEX idx_creditos_status ON fin_creditos(status);

-- UtilizaÃ§Ãµes
CREATE INDEX idx_utilizacoes_adiantamento ON fin_utilizacoes(adiantamento_id);
CREATE INDEX idx_utilizacoes_credito ON fin_utilizacoes(credito_id);
CREATE INDEX idx_utilizacoes_duplicata ON fin_utilizacoes(duplicata_pagar_id);

-- Lembretes
CREATE INDEX idx_lembretes_duplicata_receber ON fin_lembretes(duplicata_receber_id);
CREATE INDEX idx_lembretes_duplicata_pagar ON fin_lembretes(duplicata_pagar_id);
CREATE INDEX idx_lembretes_programado ON fin_lembretes(programado_para);
CREATE INDEX idx_lembretes_status ON fin_lembretes(status);

-- =====================================================
-- 10. VIEWS CALCULADAS
-- =====================================================

-- View: Saldo de Adiantamentos por Fornecedor
CREATE OR REPLACE VIEW vw_saldo_adiantamentos AS
SELECT 
  a.tenant_id,
  a.fornecedor_id,
  a.fornecedor_nome,
  COUNT(*) as total_adiantamentos,
  SUM(a.valor_original) as valor_total_adiantado,
  SUM(a.valor_utilizado) as valor_total_utilizado,
  SUM(a.valor_disponivel) as saldo_disponivel,
  COUNT(*) FILTER (WHERE a.status = 'ativo') as adiantamentos_ativos
FROM fin_adiantamentos a
WHERE a.status IN ('ativo', 'parcialmente_utilizado')
GROUP BY a.tenant_id, a.fornecedor_id, a.fornecedor_nome;

-- View: Saldo de CrÃ©ditos por Fornecedor
CREATE OR REPLACE VIEW vw_saldo_creditos AS
SELECT 
  c.tenant_id,
  c.fornecedor_id,
  c.fornecedor_nome,
  COUNT(*) as total_creditos,
  SUM(c.valor_original) as valor_total_creditos,
  SUM(c.valor_utilizado) as valor_total_utilizado,
  SUM(c.valor_disponivel) as saldo_disponivel,
  COUNT(*) FILTER (WHERE c.tipo_credito = 'refund') as total_refunds,
  COUNT(*) FILTER (WHERE c.tipo_credito = 'overpayment') as total_overpayments
FROM fin_creditos c
WHERE c.status IN ('disponivel', 'parcialmente_utilizado')
GROUP BY c.tenant_id, c.fornecedor_id, c.fornecedor_nome;

-- View: Aging de Contas a Receber
CREATE OR REPLACE VIEW vw_aging_receber AS
SELECT 
  dr.tenant_id,
  dr.marca,
  COUNT(*) as total_duplicatas,
  SUM(dr.valor_pendente) as total_pendente,
  COUNT(*) FILTER (WHERE dr.dias_atraso = 0 AND dr.status = 'aberta') as a_vencer,
  SUM(dr.valor_pendente) FILTER (WHERE dr.dias_atraso = 0 AND dr.status = 'aberta') as valor_a_vencer,
  COUNT(*) FILTER (WHERE dr.dias_atraso BETWEEN 1 AND 30) as vencidas_30,
  SUM(dr.valor_pendente) FILTER (WHERE dr.dias_atraso BETWEEN 1 AND 30) as valor_vencidas_30,
  COUNT(*) FILTER (WHERE dr.dias_atraso BETWEEN 31 AND 60) as vencidas_60,
  SUM(dr.valor_pendente) FILTER (WHERE dr.dias_atraso BETWEEN 31 AND 60) as valor_vencidas_60,
  COUNT(*) FILTER (WHERE dr.dias_atraso BETWEEN 61 AND 90) as vencidas_90,
  SUM(dr.valor_pendente) FILTER (WHERE dr.dias_atraso BETWEEN 61 AND 90) as valor_vencidas_90,
  COUNT(*) FILTER (WHERE dr.dias_atraso > 90) as vencidas_90_plus,
  SUM(dr.valor_pendente) FILTER (WHERE dr.dias_atraso > 90) as valor_vencidas_90_plus
FROM fin_duplicatas_receber dr
WHERE dr.status IN ('aberta', 'parcialmente_recebida', 'vencida')
GROUP BY dr.tenant_id, dr.marca;

-- View: Aging de Contas a Pagar
CREATE OR REPLACE VIEW vw_aging_pagar AS
SELECT 
  dp.tenant_id,
  dp.marca,
  COUNT(*) as total_duplicatas,
  SUM(dp.valor_pendente) as total_pendente,
  COUNT(*) FILTER (WHERE dp.dias_vencimento > 0) as a_vencer,
  SUM(dp.valor_pendente) FILTER (WHERE dp.dias_vencimento > 0) as valor_a_vencer,
  COUNT(*) FILTER (WHERE dp.dias_vencimento BETWEEN -30 AND -1) as vencidas_30,
  SUM(dp.valor_pendente) FILTER (WHERE dp.dias_vencimento BETWEEN -30 AND -1) as valor_vencidas_30,
  COUNT(*) FILTER (WHERE dp.dias_vencimento BETWEEN -60 AND -31) as vencidas_60,
  SUM(dp.valor_pendente) FILTER (WHERE dp.dias_vencimento BETWEEN -60 AND -31) as valor_vencidas_60,
  COUNT(*) FILTER (WHERE dp.dias_vencimento < -60) as vencidas_60_plus,
  SUM(dp.valor_pendente) FILTER (WHERE dp.dias_vencimento < -60) as valor_vencidas_60_plus
FROM fin_duplicatas_pagar dp
WHERE dp.status IN ('aberta', 'parcialmente_recebida', 'vencida')
GROUP BY dp.tenant_id, dp.marca;

-- View: Fluxo de Caixa Projetado (90 dias)
CREATE OR REPLACE VIEW vw_fluxo_caixa_projetado AS
WITH projecao AS (
  SELECT 
    tenant_id,
    marca,
    data_vencimento as data,
    'receber' as tipo,
    SUM(valor_pendente) as valor
  FROM fin_duplicatas_receber
  WHERE status IN ('aberta', 'parcialmente_recebida')
    AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
  GROUP BY tenant_id, marca, data_vencimento
  
  UNION ALL
  
  SELECT 
    tenant_id,
    marca,
    data_vencimento as data,
    'pagar' as tipo,
    -SUM(valor_pendente) as valor
  FROM fin_duplicatas_pagar
  WHERE status IN ('aberta', 'parcialmente_recebida')
    AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
  GROUP BY tenant_id, marca, data_vencimento
)
SELECT 
  tenant_id,
  marca,
  data,
  SUM(valor) FILTER (WHERE tipo = 'receber') as entradas,
  ABS(SUM(valor) FILTER (WHERE tipo = 'pagar')) as saidas,
  SUM(valor) as saldo_dia,
  SUM(SUM(valor)) OVER (
    PARTITION BY tenant_id, marca 
    ORDER BY data 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) as saldo_acumulado
FROM projecao
GROUP BY tenant_id, marca, data
ORDER BY tenant_id, marca, data;

-- View: Status Financeiro por Reserva
CREATE OR REPLACE VIEW vw_financeiro_reservas AS
SELECT 
  COALESCE(dr.reserva_id, dp.reserva_id) as reserva_id,
  COALESCE(dr.tenant_id, dp.tenant_id) as tenant_id,
  COALESCE(dr.marca, dp.marca) as marca,
  
  -- Contas a Receber
  COUNT(DISTINCT dr.id) as total_duplicatas_receber,
  SUM(dr.valor_total) as valor_total_receber,
  SUM(dr.valor_recebido) as valor_recebido,
  SUM(dr.valor_pendente) as valor_pendente_receber,
  
  -- Contas a Pagar
  COUNT(DISTINCT dp.id) as total_duplicatas_pagar,
  SUM(dp.valor_total) as valor_total_pagar,
  SUM(dp.valor_pago) as valor_pago,
  SUM(dp.valor_pendente) as valor_pendente_pagar,
  
  -- Status Geral
  CASE 
    WHEN SUM(dr.valor_pendente) = 0 AND SUM(dp.valor_pendente) = 0 THEN 'quitado'
    WHEN SUM(dr.valor_pendente) > 0 AND SUM(dp.valor_pendente) = 0 THEN 'pendente_recebimento'
    WHEN SUM(dr.valor_pendente) = 0 AND SUM(dp.valor_pendente) > 0 THEN 'pendente_pagamento'
    ELSE 'pendente_ambos'
  END as status_financeiro
  
FROM fin_duplicatas_receber dr
FULL OUTER JOIN fin_duplicatas_pagar dp 
  ON dr.reserva_id = dp.reserva_id 
  AND dr.tenant_id = dp.tenant_id
WHERE (dr.reserva_id IS NOT NULL OR dp.reserva_id IS NOT NULL)
GROUP BY COALESCE(dr.reserva_id, dp.reserva_id), 
         COALESCE(dr.tenant_id, dp.tenant_id),
         COALESCE(dr.marca, dp.marca);

-- =====================================================
-- 11. TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_condicoes_pagamento_updated_at BEFORE UPDATE ON fin_condicoes_pagamento
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_duplicatas_receber_updated_at BEFORE UPDATE ON fin_duplicatas_receber
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_duplicatas_pagar_updated_at BEFORE UPDATE ON fin_duplicatas_pagar
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adiantamentos_updated_at BEFORE UPDATE ON fin_adiantamentos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creditos_updated_at BEFORE UPDATE ON fin_creditos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar valor_pendente em duplicatas a receber
CREATE OR REPLACE FUNCTION atualizar_valor_pendente_receber()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_pendente = NEW.valor_total - NEW.valor_recebido;
  
  -- Atualizar status baseado no valor pendente
  IF NEW.valor_pendente = 0 THEN
    NEW.status = 'recebida';
    NEW.data_recebimento = CURRENT_DATE;
  ELSIF NEW.valor_recebido > 0 AND NEW.valor_pendente > 0 THEN
    NEW.status = 'parcialmente_recebida';
  ELSIF NEW.data_vencimento < CURRENT_DATE AND NEW.valor_pendente > 0 THEN
    NEW.status = 'vencida';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_valor_pendente_receber
BEFORE INSERT OR UPDATE ON fin_duplicatas_receber
FOR EACH ROW EXECUTE FUNCTION atualizar_valor_pendente_receber();

-- Trigger para atualizar valor_pendente em duplicatas a pagar
CREATE OR REPLACE FUNCTION atualizar_valor_pendente_pagar()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_pendente = NEW.valor_total - NEW.valor_pago - NEW.valor_credito_aplicado;
  
  -- Atualizar status
  IF NEW.valor_pendente = 0 THEN
    NEW.status = 'recebida'; -- usa mesmo enum
    NEW.data_pagamento = CURRENT_DATE;
  ELSIF NEW.valor_pago > 0 AND NEW.valor_pendente > 0 THEN
    NEW.status = 'parcialmente_recebida';
  ELSIF NEW.data_vencimento < CURRENT_DATE AND NEW.valor_pendente > 0 THEN
    NEW.status = 'vencida';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_valor_pendente_pagar
BEFORE INSERT OR UPDATE ON fin_duplicatas_pagar
FOR EACH ROW EXECUTE FUNCTION atualizar_valor_pendente_pagar();

-- Trigger para atualizar saldo de adiantamentos
CREATE OR REPLACE FUNCTION atualizar_saldo_adiantamento()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_disponivel = NEW.valor_original - NEW.valor_utilizado;
  
  -- Atualizar status
  IF NEW.valor_disponivel = 0 THEN
    NEW.status = 'totalmente_utilizado';
  ELSIF NEW.valor_utilizado > 0 AND NEW.valor_disponivel > 0 THEN
    NEW.status = 'parcialmente_utilizado';
  ELSIF NEW.data_expiracao IS NOT NULL AND NEW.data_expiracao < CURRENT_DATE THEN
    NEW.status = 'expirado';
  ELSE
    NEW.status = 'ativo';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_saldo_adiantamento
BEFORE INSERT OR UPDATE ON fin_adiantamentos
FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_adiantamento();

-- Trigger para atualizar saldo de crÃ©ditos
CREATE OR REPLACE FUNCTION atualizar_saldo_credito()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_disponivel = NEW.valor_original - NEW.valor_utilizado;
  
  -- Atualizar status
  IF NEW.valor_disponivel = 0 THEN
    NEW.status = 'totalmente_utilizado';
  ELSIF NEW.valor_utilizado > 0 AND NEW.valor_disponivel > 0 THEN
    NEW.status = 'parcialmente_utilizado';
  ELSIF NEW.data_expiracao IS NOT NULL AND NEW.data_expiracao < CURRENT_DATE THEN
    NEW.status = 'expirado';
  ELSE
    NEW.status = 'disponivel';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_saldo_credito
BEFORE INSERT OR UPDATE ON fin_creditos
FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_credito();

-- =====================================================
-- 12. RLS POLICIES
-- =====================================================

-- Habilitar RLS
ALTER TABLE fin_condicoes_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_duplicatas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_duplicatas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_adiantamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_creditos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_utilizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin_lembretes ENABLE ROW LEVEL SECURITY;

-- Policies para fin_condicoes_pagamento
CREATE POLICY "Users can view their tenant conditions" ON fin_condicoes_pagamento
FOR SELECT USING (tenant_id IN (SELECT id FROM cp.tenants));

CREATE POLICY "Users can insert their tenant conditions" ON fin_condicoes_pagamento
FOR INSERT WITH CHECK (tenant_id IN (SELECT id FROM cp.tenants));

CREATE POLICY "Users can update their tenant conditions" ON fin_condicoes_pagamento
FOR UPDATE USING (tenant_id IN (SELECT id FROM cp.tenants));

CREATE POLICY "Users can delete their tenant conditions" ON fin_condicoes_pagamento
FOR DELETE USING (tenant_id IN (SELECT id FROM cp.tenants));

-- Policies para duplicatas_receber (similar para outras tabelas)
CREATE POLICY "Users can view their tenant duplicatas receber" ON fin_duplicatas_receber
FOR SELECT USING (tenant_id IN (SELECT id FROM cp.tenants));

CREATE POLICY "Users can insert their tenant duplicatas receber" ON fin_duplicatas_receber
FOR INSERT WITH CHECK (tenant_id IN (SELECT id FROM cp.tenants));

CREATE POLICY "Users can update their tenant duplicatas receber" ON fin_duplicatas_receber
FOR UPDATE USING (tenant_id IN (SELECT id FROM cp.tenants));

CREATE POLICY "Users can delete their tenant duplicatas receber" ON fin_duplicatas_receber
FOR DELETE USING (tenant_id IN (SELECT id FROM cp.tenants));

-- Repetir policies similares para outras tabelas...
-- (duplicatas_pagar, parcelas, adiantamentos, creditos, utilizacoes, lembretes)

-- =====================================================
-- 13. COMENTÃRIOS
-- =====================================================

COMMENT ON TABLE fin_condicoes_pagamento IS 'CondiÃ§Ãµes de pagamento prÃ©-configuradas';
COMMENT ON TABLE fin_duplicatas_receber IS 'Contas a receber de clientes';
COMMENT ON TABLE fin_duplicatas_pagar IS 'Contas a pagar para fornecedores';
COMMENT ON TABLE fin_parcelas IS 'Parcelas de duplicatas parceladas';
COMMENT ON TABLE fin_adiantamentos IS 'Adiantamentos pagos a fornecedores';
COMMENT ON TABLE fin_creditos IS 'CrÃ©ditos e refunds recebidos de fornecedores';
COMMENT ON TABLE fin_utilizacoes IS 'HistÃ³rico de utilizaÃ§Ã£o de adiantamentos e crÃ©ditos';
COMMENT ON TABLE fin_lembretes IS 'Lembretes e notificaÃ§Ãµes de vencimentos e cobranÃ§as';

COMMENT ON VIEW vw_saldo_adiantamentos IS 'Saldo consolidado de adiantamentos por fornecedor';
COMMENT ON VIEW vw_saldo_creditos IS 'Saldo consolidado de crÃ©ditos por fornecedor';
COMMENT ON VIEW vw_aging_receber IS 'AnÃ¡lise de aging de contas a receber';
COMMENT ON VIEW vw_aging_pagar IS 'AnÃ¡lise de aging de contas a pagar';
COMMENT ON VIEW vw_fluxo_caixa_projetado IS 'ProjeÃ§Ã£o de fluxo de caixa para 90 dias';
COMMENT ON VIEW vw_financeiro_reservas IS 'Status financeiro consolidado por reserva';


-- ============================================
-- ARQUIVO: 20251030_create_open_finance_conciliacao.sql
-- ============================================

-- =====================================================
-- MIGRATION: Open Finance e ConciliaÃ§Ã£o BancÃ¡ria
-- DescriÃ§Ã£o: Tabelas para integraÃ§Ã£o Open Finance, 
-- importaÃ§Ã£o de extratos e conciliaÃ§Ã£o automÃ¡tica
-- Data: 30/10/2025
-- =====================================================

-- =====================================================
-- 1. CONTAS BANCÃRIAS
-- =====================================================

-- Criar tabela se nÃ£o existir
CREATE TABLE IF NOT EXISTS public.fin_contas_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar colunas se nÃ£o existirem (safe migration)
DO $$ 
BEGIN
  -- Dados da Conta
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'banco_codigo') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN banco_codigo VARCHAR(10);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'banco_nome') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN banco_nome VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'agencia') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN agencia VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'conta') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN conta VARCHAR(30);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'tipo_conta') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN tipo_conta VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'moeda') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN moeda VARCHAR(3) DEFAULT 'BRL';
  END IF;
  
  -- Saldo e Status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'saldo_atual') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN saldo_atual DECIMAL(15, 2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'saldo_data_atualizacao') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN saldo_data_atualizacao TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'ativo') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN ativo BOOLEAN DEFAULT true;
  END IF;
  
  -- Open Finance
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'openfinance_habilitado') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN openfinance_habilitado BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'openfinance_instituicao_id') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN openfinance_instituicao_id VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'openfinance_branch_id') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN openfinance_branch_id VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'openfinance_account_id') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN openfinance_account_id VARCHAR(100);
  END IF;
  
  -- SincronizaÃ§Ã£o
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'ultima_sincronizacao') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN ultima_sincronizacao TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'proxima_sincronizacao') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN proxima_sincronizacao TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'sincronizacao_automatica') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN sincronizacao_automatica BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'frequencia_sincronizacao') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN frequencia_sincronizacao VARCHAR(20) DEFAULT 'diaria';
  END IF;
  
  -- Metadados
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'observacoes') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN observacoes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fin_contas_bancarias' AND column_name = 'configuracoes') THEN
    ALTER TABLE public.fin_contas_bancarias ADD COLUMN configuracoes JSONB DEFAULT '{}';
  END IF;
END $$;

-- Adicionar constraints se nÃ£o existirem
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fin_contas_bancarias_tipo_conta_check') THEN
    ALTER TABLE public.fin_contas_bancarias 
    ADD CONSTRAINT fin_contas_bancarias_tipo_conta_check 
    CHECK (tipo_conta IN ('corrente', 'poupanca', 'investimento', 'pagamento'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fin_contas_bancarias_freq_sync_check') THEN
    ALTER TABLE public.fin_contas_bancarias 
    ADD CONSTRAINT fin_contas_bancarias_freq_sync_check 
    CHECK (frequencia_sincronizacao IN ('horaria', 'diaria', 'semanal', 'manual'));
  END IF;
END $$;

-- Ãndices para contas bancÃ¡rias (apenas os novos campos Open Finance)
-- Nota: Ã­ndices bÃ¡sicos (tenant_id, ativo) jÃ¡ existem da migration financeiro_schema.sql
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_banco_codigo ON public.fin_contas_bancarias(banco_codigo);
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_openfinance_habilitado ON public.fin_contas_bancarias(openfinance_habilitado) WHERE openfinance_habilitado = true;
CREATE INDEX IF NOT EXISTS idx_fin_contas_bancarias_ultima_sincronizacao ON public.fin_contas_bancarias(ultima_sincronizacao) WHERE ultima_sincronizacao IS NOT NULL;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_fin_contas_bancarias_updated_at ON public.fin_contas_bancarias;
CREATE TRIGGER update_fin_contas_bancarias_updated_at
  BEFORE UPDATE ON public.fin_contas_bancarias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 2. CONEXÃ•ES OPEN FINANCE (OAuth e Consent)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_conexoes_openfinance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  conta_bancaria_id UUID NOT NULL REFERENCES public.fin_contas_bancarias(id) ON DELETE CASCADE,
  
  -- OAuth
  access_token TEXT, -- Criptografado
  refresh_token TEXT, -- Criptografado
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  scope TEXT,
  
  -- Consent Management
  consent_id VARCHAR(255) NOT NULL, -- ID do consentimento no Open Finance
  consent_status VARCHAR(50) NOT NULL CHECK (consent_status IN ('awaiting_authorisation', 'authorised', 'rejected', 'consumed', 'revoked')),
  consent_expires_at TIMESTAMPTZ,
  consent_permissions TEXT[], -- Lista de permissÃµes concedidas
  
  -- Dados da InstituiÃ§Ã£o
  instituicao_id VARCHAR(100) NOT NULL,
  instituicao_nome VARCHAR(255),
  
  -- Status da ConexÃ£o
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
  ultimo_erro TEXT,
  ultima_tentativa_refresh TIMESTAMPTZ,
  tentativas_refresh_falhadas INTEGER DEFAULT 0,
  
  -- Metadados
  configuracoes JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices para conexÃµes
CREATE INDEX IF NOT EXISTS idx_fin_conexoes_openfinance_tenant ON public.fin_conexoes_openfinance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_conexoes_openfinance_conta ON public.fin_conexoes_openfinance(conta_bancaria_id);
CREATE INDEX IF NOT EXISTS idx_fin_conexoes_openfinance_status ON public.fin_conexoes_openfinance(status);
CREATE INDEX IF NOT EXISTS idx_fin_conexoes_openfinance_consent ON public.fin_conexoes_openfinance(consent_id);
CREATE INDEX IF NOT EXISTS idx_fin_conexoes_openfinance_expires ON public.fin_conexoes_openfinance(expires_at);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_fin_conexoes_openfinance_updated_at ON public.fin_conexoes_openfinance;
CREATE TRIGGER update_fin_conexoes_openfinance_updated_at
  BEFORE UPDATE ON public.fin_conexoes_openfinance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 3. TRANSAÃ‡Ã•ES BANCÃRIAS (Extrato)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_transacoes_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  conta_bancaria_id UUID NOT NULL REFERENCES public.fin_contas_bancarias(id) ON DELETE CASCADE,
  
  -- Dados da TransaÃ§Ã£o
  data_transacao DATE NOT NULL,
  data_lancamento DATE, -- Data que entrou no extrato
  tipo_transacao VARCHAR(50) NOT NULL CHECK (tipo_transacao IN ('credito', 'debito', 'transferencia_entrada', 'transferencia_saida', 'pix_entrada', 'pix_saida', 'ted', 'doc', 'boleto', 'tarifa', 'juros', 'outros')),
  
  -- Valores
  valor DECIMAL(15, 2) NOT NULL,
  saldo_apos_transacao DECIMAL(15, 2),
  moeda VARCHAR(3) DEFAULT 'BRL',
  
  -- DescriÃ§Ã£o e CategorizaÃ§Ã£o
  descricao TEXT NOT NULL,
  descricao_original TEXT, -- DescriÃ§Ã£o do banco sem processamento
  categoria VARCHAR(100), -- Categoria automÃ¡tica ou manual
  
  -- IdentificaÃ§Ã£o Externa
  transaction_id VARCHAR(255), -- ID Ãºnico do banco/Open Finance
  codigo_autenticacao VARCHAR(100),
  
  -- Participantes (quando disponÃ­vel)
  participante_nome VARCHAR(255), -- Nome do pagador/recebedor
  participante_documento VARCHAR(20), -- CPF/CNPJ
  participante_banco VARCHAR(10),
  participante_agencia VARCHAR(20),
  participante_conta VARCHAR(30),
  
  -- ConciliaÃ§Ã£o
  conciliado BOOLEAN DEFAULT false,
  conciliacao_automatica BOOLEAN DEFAULT false,
  conciliacao_data TIMESTAMPTZ,
  
  -- Origem dos Dados
  origem VARCHAR(50) NOT NULL CHECK (origem IN ('openfinance', 'ofx', 'csv', 'xlsx', 'pdf', 'manual')),
  importacao_id UUID, -- ReferÃªncia ao lote de importaÃ§Ã£o
  
  -- Metadados
  observacoes TEXT,
  dados_adicionais JSONB DEFAULT '{}', -- Dados extras do Open Finance
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices para transaÃ§Ãµes
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_tenant ON public.fin_transacoes_bancarias(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_conta ON public.fin_transacoes_bancarias(conta_bancaria_id);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_data ON public.fin_transacoes_bancarias(data_transacao);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_tipo ON public.fin_transacoes_bancarias(tipo_transacao);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_conciliado ON public.fin_transacoes_bancarias(conciliado) WHERE conciliado = false;
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_transaction_id ON public.fin_transacoes_bancarias(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_bancarias_importacao ON public.fin_transacoes_bancarias(importacao_id) WHERE importacao_id IS NOT NULL;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_fin_transacoes_bancarias_updated_at ON public.fin_transacoes_bancarias;
CREATE TRIGGER update_fin_transacoes_bancarias_updated_at
  BEFORE UPDATE ON public.fin_transacoes_bancarias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 4. CONCILIAÃ‡Ã•ES (Match entre TransaÃ§Ã£o e Duplicata)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_conciliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  transacao_bancaria_id UUID NOT NULL REFERENCES public.fin_transacoes_bancarias(id) ON DELETE CASCADE,
  
  -- Tipo de ConciliaÃ§Ã£o
  tipo_duplicata VARCHAR(50) NOT NULL CHECK (tipo_duplicata IN ('receber', 'pagar')),
  duplicata_receber_id UUID REFERENCES public.fin_duplicatas_receber(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES public.fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  -- Dados da ConciliaÃ§Ã£o
  valor_conciliado DECIMAL(15, 2) NOT NULL,
  data_conciliacao DATE NOT NULL,
  
  -- Score e Status
  score_matching DECIMAL(5, 2), -- 0-100: confianÃ§a do match automÃ¡tico
  tipo_conciliacao VARCHAR(50) NOT NULL DEFAULT 'manual' CHECK (tipo_conciliacao IN ('automatica', 'manual', 'sugerida', 'parcial')),
  status VARCHAR(50) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('pendente', 'confirmada', 'desfeita', 'conflito')),
  
  -- DiferenÃ§as (quando houver)
  diferenca_valor DECIMAL(15, 2) DEFAULT 0,
  diferenca_data INTEGER DEFAULT 0, -- Dias de diferenÃ§a
  motivo_diferenca TEXT,
  
  -- Auditoria
  conciliado_por UUID REFERENCES public.users(id),
  conciliado_em TIMESTAMPTZ DEFAULT NOW(),
  desfeito_por UUID REFERENCES public.users(id),
  desfeito_em TIMESTAMPTZ,
  motivo_desfazer TEXT,
  
  -- Metadados
  observacoes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_duplicata_tipo CHECK (
    (tipo_duplicata = 'receber' AND duplicata_receber_id IS NOT NULL AND duplicata_pagar_id IS NULL) OR
    (tipo_duplicata = 'pagar' AND duplicata_pagar_id IS NOT NULL AND duplicata_receber_id IS NULL)
  )
);

-- Ãndices para conciliaÃ§Ãµes
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_tenant ON public.fin_conciliacoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_transacao ON public.fin_conciliacoes(transacao_bancaria_id);
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_duplicata_receber ON public.fin_conciliacoes(duplicata_receber_id) WHERE duplicata_receber_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_duplicata_pagar ON public.fin_conciliacoes(duplicata_pagar_id) WHERE duplicata_pagar_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_status ON public.fin_conciliacoes(status);
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_tipo ON public.fin_conciliacoes(tipo_conciliacao);
CREATE INDEX IF NOT EXISTS idx_fin_conciliacoes_data ON public.fin_conciliacoes(data_conciliacao);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_fin_conciliacoes_updated_at ON public.fin_conciliacoes;
CREATE TRIGGER update_fin_conciliacoes_updated_at
  BEFORE UPDATE ON public.fin_conciliacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. IMPORTAÃ‡Ã•ES DE EXTRATO (HistÃ³rico de Uploads)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_importacoes_extrato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  conta_bancaria_id UUID NOT NULL REFERENCES public.fin_contas_bancarias(id) ON DELETE CASCADE,
  
  -- Dados da ImportaÃ§Ã£o
  tipo_arquivo VARCHAR(50) NOT NULL CHECK (tipo_arquivo IN ('ofx', 'csv', 'xlsx', 'pdf', 'openfinance')),
  nome_arquivo VARCHAR(255),
  tamanho_arquivo INTEGER, -- bytes
  
  -- Processamento
  status VARCHAR(50) NOT NULL DEFAULT 'processando' CHECK (status IN ('processando', 'concluido', 'erro', 'parcial')),
  total_transacoes INTEGER DEFAULT 0,
  transacoes_importadas INTEGER DEFAULT 0,
  transacoes_duplicadas INTEGER DEFAULT 0,
  transacoes_erro INTEGER DEFAULT 0,
  
  -- PerÃ­odo dos Dados
  data_inicio DATE,
  data_fim DATE,
  
  -- Resultado
  erro_mensagem TEXT,
  log_processamento JSONB DEFAULT '[]',
  
  -- Auditoria
  importado_por UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ãndices para importaÃ§Ãµes
CREATE INDEX IF NOT EXISTS idx_fin_importacoes_extrato_tenant ON public.fin_importacoes_extrato(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_importacoes_extrato_conta ON public.fin_importacoes_extrato(conta_bancaria_id);
CREATE INDEX IF NOT EXISTS idx_fin_importacoes_extrato_status ON public.fin_importacoes_extrato(status);
CREATE INDEX IF NOT EXISTS idx_fin_importacoes_extrato_tipo ON public.fin_importacoes_extrato(tipo_arquivo);
CREATE INDEX IF NOT EXISTS idx_fin_importacoes_extrato_data ON public.fin_importacoes_extrato(created_at);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_fin_importacoes_extrato_updated_at ON public.fin_importacoes_extrato;
CREATE TRIGGER update_fin_importacoes_extrato_updated_at
  BEFORE UPDATE ON public.fin_importacoes_extrato
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 6. VIEWS
-- =====================================================

-- View: TransaÃ§Ãµes NÃ£o Conciliadas
CREATE OR REPLACE VIEW public.vw_transacoes_nao_conciliadas AS
SELECT 
  t.*,
  c.banco_nome,
  c.agencia,
  c.conta,
  CASE 
    WHEN t.tipo_transacao IN ('credito', 'transferencia_entrada', 'pix_entrada') THEN 'receber'
    WHEN t.tipo_transacao IN ('debito', 'transferencia_saida', 'pix_saida', 'boleto', 'ted', 'doc') THEN 'pagar'
    ELSE 'outro'
  END AS tipo_sugerido,
  DATE_PART('day', NOW() - t.data_transacao) AS dias_pendente
FROM 
  public.fin_transacoes_bancarias t
  INNER JOIN public.fin_contas_bancarias c ON c.id = t.conta_bancaria_id
WHERE 
  t.conciliado = false
  AND t.tipo_transacao NOT IN ('tarifa', 'juros') -- Excluir tarifas e juros por padrÃ£o
ORDER BY 
  t.data_transacao DESC;

-- View: Saldo das Contas
CREATE OR REPLACE VIEW public.vw_saldo_contas_bancarias AS
SELECT 
  c.id AS conta_id,
  c.tenant_id,
  c.banco_nome,
  c.agencia,
  c.conta,
  c.tipo_conta,
  c.saldo_atual,
  c.saldo_data_atualizacao,
  c.ultima_sincronizacao,
  c.openfinance_habilitado,
  co.status AS openfinance_status,
  co.consent_expires_at AS openfinance_consent_expira,
  COUNT(DISTINCT t.id) AS total_transacoes,
  COUNT(DISTINCT t.id) FILTER (WHERE t.conciliado = false) AS transacoes_nao_conciliadas,
  SUM(t.valor) FILTER (WHERE t.tipo_transacao IN ('credito', 'transferencia_entrada', 'pix_entrada') AND t.conciliado = false) AS creditos_nao_conciliados,
  SUM(t.valor) FILTER (WHERE t.tipo_transacao IN ('debito', 'transferencia_saida', 'pix_saida', 'boleto') AND t.conciliado = false) AS debitos_nao_conciliados
FROM 
  public.fin_contas_bancarias c
  LEFT JOIN public.fin_conexoes_openfinance co ON co.conta_bancaria_id = c.id AND co.status = 'active'
  LEFT JOIN public.fin_transacoes_bancarias t ON t.conta_bancaria_id = c.id
WHERE 
  c.ativo = true
GROUP BY 
  c.id, c.tenant_id, c.banco_nome, c.agencia, c.conta, c.tipo_conta, 
  c.saldo_atual, c.saldo_data_atualizacao, c.ultima_sincronizacao, 
  c.openfinance_habilitado, co.status, co.consent_expires_at;

-- View: SugestÃµes de ConciliaÃ§Ã£o AutomÃ¡tica
CREATE OR REPLACE VIEW public.vw_sugestoes_conciliacao AS
WITH transacoes_pendentes AS (
  SELECT 
    t.id AS transacao_id,
    t.tenant_id,
    t.data_transacao,
    t.valor,
    t.tipo_transacao,
    t.descricao,
    t.participante_nome,
    t.participante_documento
  FROM 
    public.fin_transacoes_bancarias t
  WHERE 
    t.conciliado = false
    AND t.tipo_transacao NOT IN ('tarifa', 'juros')
),
duplicatas_pendentes_receber AS (
  SELECT 
    dr.id AS duplicata_id,
    'receber' AS tipo,
    dr.tenant_id,
    dr.data_vencimento,
    dr.valor_pendente AS valor,
    c.nome AS cliente_nome,
    c.cnpj_cpf AS cliente_documento
  FROM 
    public.fin_duplicatas_receber dr
    LEFT JOIN public.clientes c ON c.id = dr.cliente_id
  WHERE 
    dr.status IN ('pendente', 'parcial')
),
duplicatas_pendentes_pagar AS (
  SELECT 
    dp.id AS duplicata_id,
    'pagar' AS tipo,
    dp.tenant_id,
    dp.data_vencimento,
    dp.valor_pendente AS valor,
    f.nome AS fornecedor_nome,
    f.cnpj_cpf AS fornecedor_documento
  FROM 
    public.fin_duplicatas_pagar dp
    LEFT JOIN public.fin_fornecedores f ON f.id = dp.fornecedor_id
  WHERE 
    dp.status IN ('pendente', 'parcial')
)
SELECT 
  tp.transacao_id,
  dp.duplicata_id,
  dp.tipo AS tipo_duplicata,
  tp.data_transacao,
  dp.data_vencimento,
  tp.valor AS valor_transacao,
  dp.valor AS valor_duplicata,
  ABS(tp.valor - dp.valor) AS diferenca_valor,
  ABS(DATE_PART('day', tp.data_transacao - dp.data_vencimento)) AS diferenca_dias,
  tp.descricao AS descricao_transacao,
  COALESCE(dp.cliente_nome, dp.fornecedor_nome) AS participante_nome,
  COALESCE(dp.cliente_documento, dp.fornecedor_documento) AS participante_documento,
  -- Score de matching (0-100)
  GREATEST(0, 100 - 
    (ABS(tp.valor - dp.valor) / NULLIF(dp.valor, 0) * 50) - -- Penalidade por diferenÃ§a de valor (max 50)
    (ABS(DATE_PART('day', tp.data_transacao - dp.data_vencimento)) * 5) - -- Penalidade por diferenÃ§a de data (5 pontos por dia)
    (CASE WHEN tp.participante_documento IS NOT NULL AND tp.participante_documento != COALESCE(dp.cliente_documento, dp.fornecedor_documento) THEN 30 ELSE 0 END) -- Penalidade por documento diferente
  ) AS score_matching
FROM 
  transacoes_pendentes tp
  CROSS JOIN (
    SELECT * FROM duplicatas_pendentes_receber
    UNION ALL
    SELECT * FROM duplicatas_pendentes_pagar
  ) dp
WHERE 
  tp.tenant_id = dp.tenant_id
  AND (
    (tp.tipo_transacao IN ('credito', 'transferencia_entrada', 'pix_entrada') AND dp.tipo = 'receber') OR
    (tp.tipo_transacao IN ('debito', 'transferencia_saida', 'pix_saida', 'boleto', 'ted', 'doc') AND dp.tipo = 'pagar')
  )
  AND ABS(tp.valor - dp.valor) < (dp.valor * 0.05) -- DiferenÃ§a de atÃ© 5%
  AND ABS(DATE_PART('day', tp.data_transacao - dp.data_vencimento)) <= 7 -- DiferenÃ§a de atÃ© 7 dias
ORDER BY 
  score_matching DESC;

-- View: EstatÃ­sticas de ConciliaÃ§Ã£o
CREATE OR REPLACE VIEW public.vw_estatisticas_conciliacao AS
SELECT 
  c.id AS conta_id,
  c.tenant_id,
  c.banco_nome,
  COUNT(DISTINCT t.id) AS total_transacoes,
  COUNT(DISTINCT t.id) FILTER (WHERE t.conciliado = true) AS transacoes_conciliadas,
  COUNT(DISTINCT t.id) FILTER (WHERE t.conciliado = false) AS transacoes_pendentes,
  ROUND(
    (COUNT(DISTINCT t.id) FILTER (WHERE t.conciliado = true)::DECIMAL / 
     NULLIF(COUNT(DISTINCT t.id), 0) * 100), 2
  ) AS percentual_conciliado,
  COUNT(DISTINCT conc.id) FILTER (WHERE conc.tipo_conciliacao = 'automatica') AS conciliacoes_automaticas,
  COUNT(DISTINCT conc.id) FILTER (WHERE conc.tipo_conciliacao = 'manual') AS conciliacoes_manuais,
  SUM(t.valor) FILTER (WHERE t.conciliado = false AND t.tipo_transacao IN ('credito', 'transferencia_entrada', 'pix_entrada')) AS valor_creditos_pendentes,
  SUM(t.valor) FILTER (WHERE t.conciliado = false AND t.tipo_transacao IN ('debito', 'transferencia_saida', 'pix_saida', 'boleto')) AS valor_debitos_pendentes
FROM 
  public.fin_contas_bancarias c
  LEFT JOIN public.fin_transacoes_bancarias t ON t.conta_bancaria_id = c.id
  LEFT JOIN public.fin_conciliacoes conc ON conc.transacao_bancaria_id = t.id
WHERE 
  c.ativo = true
GROUP BY 
  c.id, c.tenant_id, c.banco_nome;

-- =====================================================
-- 7. TRIGGERS PARA CONCILIAÃ‡ÃƒO
-- =====================================================

-- Trigger: Marcar transaÃ§Ã£o como conciliada quando criar conciliaÃ§Ã£o
CREATE OR REPLACE FUNCTION public.fn_marcar_transacao_conciliada()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar flag de conciliaÃ§Ã£o na transaÃ§Ã£o
  UPDATE public.fin_transacoes_bancarias
  SET 
    conciliado = true,
    conciliacao_automatica = (NEW.tipo_conciliacao = 'automatica'),
    conciliacao_data = NEW.conciliado_em
  WHERE 
    id = NEW.transacao_bancaria_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_marcar_transacao_conciliada ON public.fin_conciliacoes;
CREATE TRIGGER trg_marcar_transacao_conciliada
  AFTER INSERT ON public.fin_conciliacoes
  FOR EACH ROW
  WHEN (NEW.status = 'confirmada')
  EXECUTE FUNCTION public.fn_marcar_transacao_conciliada();

-- Trigger: Desmarcar transaÃ§Ã£o quando desfazer conciliaÃ§Ã£o
CREATE OR REPLACE FUNCTION public.fn_desmarcar_transacao_conciliada()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'desfeita' AND OLD.status = 'confirmada' THEN
    UPDATE public.fin_transacoes_bancarias
    SET 
      conciliado = false,
      conciliacao_automatica = false,
      conciliacao_data = NULL
    WHERE 
      id = NEW.transacao_bancaria_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_desmarcar_transacao_conciliada ON public.fin_conciliacoes;
CREATE TRIGGER trg_desmarcar_transacao_conciliada
  AFTER UPDATE ON public.fin_conciliacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_desmarcar_transacao_conciliada();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.fin_contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_conexoes_openfinance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_transacoes_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_conciliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_importacoes_extrato ENABLE ROW LEVEL SECURITY;

-- Policies para fin_contas_bancarias
DROP POLICY IF EXISTS fin_contas_bancarias_tenant_isolation ON public.fin_contas_bancarias;
CREATE POLICY fin_contas_bancarias_tenant_isolation ON public.fin_contas_bancarias
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Policies para fin_conexoes_openfinance
DROP POLICY IF EXISTS fin_conexoes_openfinance_tenant_isolation ON public.fin_conexoes_openfinance;
CREATE POLICY fin_conexoes_openfinance_tenant_isolation ON public.fin_conexoes_openfinance
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Policies para fin_transacoes_bancarias
DROP POLICY IF EXISTS fin_transacoes_bancarias_tenant_isolation ON public.fin_transacoes_bancarias;
CREATE POLICY fin_transacoes_bancarias_tenant_isolation ON public.fin_transacoes_bancarias
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Policies para fin_conciliacoes
DROP POLICY IF EXISTS fin_conciliacoes_tenant_isolation ON public.fin_conciliacoes;
CREATE POLICY fin_conciliacoes_tenant_isolation ON public.fin_conciliacoes
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- Policies para fin_importacoes_extrato
DROP POLICY IF EXISTS fin_importacoes_extrato_tenant_isolation ON public.fin_importacoes_extrato;
CREATE POLICY fin_importacoes_extrato_tenant_isolation ON public.fin_importacoes_extrato
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()));

-- =====================================================
-- 9. COMENTÃRIOS
-- =====================================================

COMMENT ON TABLE public.fin_contas_bancarias IS 'Contas bancÃ¡rias com suporte a Open Finance';
COMMENT ON TABLE public.fin_conexoes_openfinance IS 'ConexÃµes OAuth e consent do Open Finance';
COMMENT ON TABLE public.fin_transacoes_bancarias IS 'TransaÃ§Ãµes bancÃ¡rias (extrato) de todas as origens';
COMMENT ON TABLE public.fin_conciliacoes IS 'ConciliaÃ§Ã£o entre transaÃ§Ãµes e duplicatas';
COMMENT ON TABLE public.fin_importacoes_extrato IS 'HistÃ³rico de importaÃ§Ãµes de extratos';

COMMENT ON VIEW public.vw_transacoes_nao_conciliadas IS 'TransaÃ§Ãµes bancÃ¡rias ainda nÃ£o conciliadas';
COMMENT ON VIEW public.vw_saldo_contas_bancarias IS 'Saldo e estatÃ­sticas das contas bancÃ¡rias';
COMMENT ON VIEW public.vw_sugestoes_conciliacao IS 'SugestÃµes automÃ¡ticas de conciliaÃ§Ã£o com score';
COMMENT ON VIEW public.vw_estatisticas_conciliacao IS 'EstatÃ­sticas de conciliaÃ§Ã£o por conta';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================


-- ============================================
-- ARQUIVO: 20251030_financeiro_rls_dev.sql
-- ============================================

-- PolÃ­ticas RLS temporÃ¡rias para desenvolvimento
-- IMPORTANTE: Substituir por polÃ­ticas adequadas em produÃ§Ã£o

BEGIN;

-- Desabilitar RLS temporariamente para permitir acesso aos dados
-- OU criar polÃ­ticas permissivas para desenvolvimento

-- OpÃ§Ã£o 1: Desabilitar RLS (NÃƒO RECOMENDADO EM PRODUÃ‡ÃƒO)
-- ALTER TABLE public.fin_receitas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fin_despesas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fin_contas_bancarias DISABLE ROW LEVEL SECURITY;

-- OpÃ§Ã£o 2: Criar polÃ­ticas permissivas (MELHOR)

-- ===========================
-- POLÃTICAS PARA FIN_RECEITAS
-- ===========================

-- SELECT (jÃ¡ existe)
DROP POLICY IF EXISTS "Allow all SELECT on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all SELECT on fin_receitas for development"
ON public.fin_receitas
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all INSERT on fin_receitas for development"
ON public.fin_receitas
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all UPDATE on fin_receitas for development"
ON public.fin_receitas
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all DELETE on fin_receitas for development"
ON public.fin_receitas
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÃTICAS PARA FIN_DESPESAS
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all SELECT on fin_despesas for development"
ON public.fin_despesas
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all INSERT on fin_despesas for development"
ON public.fin_despesas
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all UPDATE on fin_despesas for development"
ON public.fin_despesas
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all DELETE on fin_despesas for development"
ON public.fin_despesas
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÃTICAS PARA FIN_CONTAS_BANCARIAS
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all SELECT on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all INSERT on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all UPDATE on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all DELETE on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÃTICAS PARA FIN_CATEGORIAS
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all SELECT on fin_categorias for development"
ON public.fin_categorias
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all INSERT on fin_categorias for development"
ON public.fin_categorias
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all UPDATE on fin_categorias for development"
ON public.fin_categorias
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all DELETE on fin_categorias for development"
ON public.fin_categorias
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÃTICAS PARA FIN_COMISSOES
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all SELECT on fin_comissoes for development"
ON public.fin_comissoes
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all INSERT on fin_comissoes for development"
ON public.fin_comissoes
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all UPDATE on fin_comissoes for development"
ON public.fin_comissoes
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all DELETE on fin_comissoes for development"
ON public.fin_comissoes
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÃTICAS PARA FIN_PROJECOES
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all SELECT on fin_projecoes for development"
ON public.fin_projecoes
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all INSERT on fin_projecoes for development"
ON public.fin_projecoes
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all UPDATE on fin_projecoes for development"
ON public.fin_projecoes
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all DELETE on fin_projecoes for development"
ON public.fin_projecoes
FOR DELETE
TO authenticated, anon
USING (true);

COMMIT;

-- Log
DO $$
BEGIN
    RAISE NOTICE 'âœ… PolÃ­ticas RLS COMPLETAS (CRUD) de desenvolvimento aplicadas!';
    RAISE NOTICE 'Agora vocÃª pode: SELECT, INSERT, UPDATE e DELETE em todas as tabelas';
    RAISE NOTICE 'ATENÃ‡ÃƒO: Estas polÃ­ticas permitem acesso irrestrito aos dados.';
    RAISE NOTICE 'Substitua por polÃ­ticas adequadas antes de ir para produÃ§Ã£o!';
END $$;

