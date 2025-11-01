-- =====================================================
-- MIGRATION: Base Multi-Tenant System
-- Descrição: Tabelas essenciais para sistema multi-tenant
-- Data: 30/10/2025
-- Prioridade: EXECUTAR PRIMEIRO (antes de todas as outras migrations)
-- =====================================================

-- =====================================================
-- 1. TABELA TENANTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE, -- URL-friendly identifier
  
  -- Tipo de tenant (marca)
  marca VARCHAR(50) CHECK (marca IN ('noro', 'nomade', 'safetrip', 'vistos')),
  
  -- Configurações
  ativo BOOLEAN DEFAULT true,
  plano VARCHAR(50) DEFAULT 'basic' CHECK (plano IN ('basic', 'pro', 'enterprise')),
  
  -- Limites e Quotas
  max_usuarios INTEGER DEFAULT 5,
  max_leads INTEGER,
  max_processos INTEGER,
  
  -- Informações da Empresa
  cnpj VARCHAR(20),
  razao_social VARCHAR(255),
  email_contato VARCHAR(255),
  telefone VARCHAR(20),
  
  -- Endereço
  endereco_logradouro VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  endereco_pais VARCHAR(2) DEFAULT 'BR',
  
  -- Configurações Gerais
  configuracoes JSONB DEFAULT '{}',
  
  -- Metadados
  data_expiracao DATE, -- Para planos trial
  ultima_atividade TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
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
-- 2. TABELA USERS (se não existir)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Auth (integração com Supabase Auth)
  auth_user_id UUID UNIQUE, -- Referência ao auth.users
  
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
  
  -- Configurações
  preferencias JSONB DEFAULT '{}',
  
  -- Segurança
  ultimo_login TIMESTAMPTZ,
  ultimo_ip VARCHAR(45),
  tentativas_login_falhas INTEGER DEFAULT 0,
  bloqueado_ate TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
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
  
  -- Papel do usuário neste tenant
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'manager', 'user', 'viewer')),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Permissões Específicas
  permissoes JSONB DEFAULT '[]', -- Array de permissões customizadas
  
  -- Metadados
  data_convite TIMESTAMPTZ,
  convite_aceito BOOLEAN DEFAULT false,
  convidado_por UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: Usuário não pode estar duplicado no mesmo tenant
  UNIQUE(user_id, tenant_id)
);

-- Índices
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
  
  -- Identificação
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('pessoa_fisica', 'pessoa_juridica')),
  cnpj_cpf VARCHAR(20),
  
  -- Contato
  email VARCHAR(255),
  telefone VARCHAR(20),
  telefone_secundario VARCHAR(20),
  
  -- Endereço
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
  
  -- Observações
  observacoes TEXT,
  tags TEXT[],
  
  -- Metadados
  dados_adicionais JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
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
  
  -- Identificação
  nome VARCHAR(255) NOT NULL,
  razao_social VARCHAR(255),
  cnpj_cpf VARCHAR(20),
  
  -- Contato
  email VARCHAR(255),
  telefone VARCHAR(20),
  contato_nome VARCHAR(255),
  
  -- Endereço
  endereco_logradouro VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  endereco_pais VARCHAR(2) DEFAULT 'BR',
  
  -- Dados Bancários
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
  
  -- Classificação
  tipo_servico VARCHAR(100),
  categoria VARCHAR(100),
  tags TEXT[],
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados
  dados_adicionais JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
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
-- 7. SEED DATA (Opcional - Tenants Padrão)
-- =====================================================

-- Inserir tenants padrão se não existirem
INSERT INTO public.tenants (id, nome, slug, marca, ativo, plano)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'NORO Vistos', 'noro', 'noro', true, 'enterprise'),
  ('00000000-0000-0000-0000-000000000002', 'Nômade Vistos', 'nomade', 'nomade', true, 'enterprise'),
  ('00000000-0000-0000-0000-000000000003', 'SafeTrip', 'safetrip', 'safetrip', true, 'pro'),
  ('00000000-0000-0000-0000-000000000004', 'Vistos Online', 'vistos', 'vistos', true, 'pro')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 8. COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.tenants IS 'Empresas/organizações no sistema multi-tenant';
COMMENT ON TABLE public.users IS 'Usuários do sistema';
COMMENT ON TABLE public.user_tenants IS 'Relacionamento usuários-tenants com roles';
COMMENT ON TABLE public.clientes IS 'Clientes dos tenants';
COMMENT ON TABLE public.fin_fornecedores IS 'Fornecedores para sistema financeiro';

COMMENT ON COLUMN public.user_tenants.role IS 'Papel: owner (dono), admin (administrador), manager (gerente), user (usuário), viewer (visualizador)';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
