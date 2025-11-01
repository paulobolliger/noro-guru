-- =====================================================
-- FINANCEIRO SCHEMA - VERSÃO 3 FIXED
-- 100% IDEMPOTENTE - TESTADO
-- =====================================================

-- CREATE TYPES (IDEMPOTENT)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'marca') THEN
        CREATE TYPE marca AS ENUM ('noro', 'nomade', 'safetrip', 'vistos');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moeda') THEN
        CREATE TYPE moeda AS ENUM ('BRL', 'USD', 'EUR', 'GBP', 'ARS', 'CLP');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'forma_pagamento') THEN
        CREATE TYPE forma_pagamento AS ENUM ('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia', 'internacional', 'dinheiro', 'cheque');
    END IF;
END $$;

-- =====================================================
-- 1. CONTAS BANCÁRIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_contas_bancarias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    marca marca NOT NULL,
    nome text NOT NULL,
    tipo text NOT NULL,
    banco text NOT NULL,
    agencia text,
    conta text,
    moeda moeda NOT NULL DEFAULT 'BRL',
    saldo_inicial numeric(15,2) DEFAULT 0,
    saldo_atual numeric(15,2) DEFAULT 0,
    ativo boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_contas_tenant ON public.fin_contas_bancarias(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_contas_marca ON public.fin_contas_bancarias(marca);
CREATE INDEX IF NOT EXISTS idx_fin_contas_ativo ON public.fin_contas_bancarias(ativo);

-- =====================================================
-- 2. CATEGORIAS FINANCEIRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_categorias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nome text NOT NULL,
    tipo text NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria_pai_id uuid REFERENCES public.fin_categorias(id),
    cor text,
    icone text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_categorias_tenant ON public.fin_categorias(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_categorias_tipo ON public.fin_categorias(tipo);

-- =====================================================
-- 3. RECEITAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_receitas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    marca marca NOT NULL,
    descricao text NOT NULL,
    categoria_id uuid REFERENCES public.fin_categorias(id),
    valor numeric(15,2) NOT NULL,
    moeda moeda NOT NULL DEFAULT 'BRL',
    taxa_cambio numeric(10,4) DEFAULT 1,
    valor_brl numeric(15,2) GENERATED ALWAYS AS (valor * taxa_cambio) STORED,
    
    tipo_receita text NOT NULL,
    
    -- Relacionamentos
    cliente_id uuid REFERENCES public.clientes(id),
    orcamento_id uuid,
    pedido_id uuid,
    
    -- Controle financeiro
    status text NOT NULL DEFAULT 'pendente',
    data_vencimento date NOT NULL,
    data_pagamento date,
    data_competencia date NOT NULL,
    
    forma_pagamento forma_pagamento,
    gateway_pagamento text,
    transaction_id text,
    
    conta_bancaria_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Comissões
    possui_comissao boolean DEFAULT false,
    valor_comissao numeric(15,2),
    percentual_comissao numeric(5,2),
    fornecedor_comissao_id uuid REFERENCES public.fin_fornecedores(id),
    
    -- Recorrência
    recorrente boolean DEFAULT false,
    frequencia_recorrencia text,
    proximo_vencimento date,
    
    -- Notas e documentos
    nota_fiscal text,
    recibo_url text,
    observacoes text,
    
    -- Auditoria
    created_by uuid REFERENCES public.users(id),
    updated_by uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_receitas_tenant ON public.fin_receitas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_marca ON public.fin_receitas(marca);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_status ON public.fin_receitas(status);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_data_vencimento ON public.fin_receitas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_cliente ON public.fin_receitas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_competencia ON public.fin_receitas(data_competencia);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_tenant_status ON public.fin_receitas(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_tenant_competencia ON public.fin_receitas(tenant_id, data_competencia DESC);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_tenant_marca_status ON public.fin_receitas(tenant_id, marca, status);
CREATE INDEX IF NOT EXISTS idx_fin_receitas_pendentes ON public.fin_receitas(tenant_id, data_vencimento) 
WHERE status IN ('pendente', 'atrasado');

-- =====================================================
-- 4. DESPESAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_despesas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    marca marca NOT NULL,
    descricao text NOT NULL,
    categoria_id uuid REFERENCES public.fin_categorias(id),
    valor numeric(15,2) NOT NULL,
    moeda moeda NOT NULL DEFAULT 'BRL',
    taxa_cambio numeric(10,4) DEFAULT 1,
    valor_brl numeric(15,2) GENERATED ALWAYS AS (valor * taxa_cambio) STORED,
    
    tipo_despesa text NOT NULL,
    
    -- Relacionamentos
    fornecedor_id uuid REFERENCES public.fin_fornecedores(id),
    pedido_id uuid,
    
    -- Controle financeiro
    status text NOT NULL DEFAULT 'pendente',
    data_vencimento date NOT NULL,
    data_pagamento date,
    data_competencia date NOT NULL,
    
    forma_pagamento forma_pagamento,
    conta_bancaria_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Centro de custo
    centro_custo text,
    projeto_associado text,
    
    -- Recorrência
    recorrente boolean DEFAULT false,
    frequencia_recorrencia text,
    proximo_vencimento date,
    
    -- Documentos
    nota_fiscal text,
    comprovante_url text,
    observacoes text,
    
    -- Auditoria
    created_by uuid REFERENCES public.users(id),
    updated_by uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_despesas_tenant ON public.fin_despesas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_marca ON public.fin_despesas(marca);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_status ON public.fin_despesas(status);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_data_vencimento ON public.fin_despesas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_fornecedor ON public.fin_despesas(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_competencia ON public.fin_despesas(data_competencia);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_centro_custo ON public.fin_despesas(centro_custo);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_tenant_status ON public.fin_despesas(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_tenant_competencia ON public.fin_despesas(tenant_id, data_competencia DESC);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_tenant_marca_status ON public.fin_despesas(tenant_id, marca, status);
CREATE INDEX IF NOT EXISTS idx_fin_despesas_pendentes ON public.fin_despesas(tenant_id, data_vencimento) 
WHERE status IN ('pendente', 'atrasado');

-- =====================================================
-- 5. TRANSAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_transacoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    marca marca NOT NULL,
    tipo text NOT NULL CHECK (tipo IN ('entrada', 'saida', 'transferencia')),
    descricao text NOT NULL,
    valor numeric(15,2) NOT NULL,
    moeda moeda NOT NULL DEFAULT 'BRL',
    
    conta_origem_id uuid REFERENCES public.fin_contas_bancarias(id),
    conta_destino_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    receita_id uuid REFERENCES public.fin_receitas(id),
    despesa_id uuid REFERENCES public.fin_despesas(id),
    
    categoria_id uuid REFERENCES public.fin_categorias(id),
    
    data_transacao date NOT NULL DEFAULT CURRENT_DATE,
    data_competencia date NOT NULL DEFAULT CURRENT_DATE,
    
    status text NOT NULL DEFAULT 'efetivada',
    
    observacoes text,
    metadata jsonb DEFAULT '{}',
    
    created_by uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_transacoes_tenant ON public.fin_transacoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_marca ON public.fin_transacoes(marca);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_tipo ON public.fin_transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_data ON public.fin_transacoes(data_transacao);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_conta_origem ON public.fin_transacoes(conta_origem_id);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_conta_destino ON public.fin_transacoes(conta_destino_id);

-- =====================================================
-- 6. PLANO DE CONTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_plano_contas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    codigo text NOT NULL,
    nome text NOT NULL,
    tipo text NOT NULL,
    nivel integer NOT NULL,
    conta_pai_id uuid REFERENCES public.fin_plano_contas(id),
    aceita_lancamento boolean DEFAULT true,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, codigo)
);

CREATE INDEX IF NOT EXISTS idx_fin_plano_tenant ON public.fin_plano_contas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_plano_tipo ON public.fin_plano_contas(tipo);

-- =====================================================
-- 7. COMISSÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_comissoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    receita_id uuid REFERENCES public.fin_receitas(id) ON DELETE CASCADE,
    fornecedor_id uuid REFERENCES public.fin_fornecedores(id),
    
    percentual numeric(5,2) NOT NULL,
    valor_comissao numeric(15,2) NOT NULL,
    moeda moeda NOT NULL DEFAULT 'BRL',
    
    status text NOT NULL DEFAULT 'pendente',
    data_vencimento date,
    data_pagamento date,
    
    observacoes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fin_comissoes_receita ON public.fin_comissoes(receita_id);
CREATE INDEX IF NOT EXISTS idx_fin_comissoes_fornecedor ON public.fin_comissoes(fornecedor_id);

-- =====================================================
-- 8. PROJEÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_projecoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    marca marca NOT NULL,
    mes_referencia date NOT NULL,
    
    receita_prevista numeric(15,2) DEFAULT 0,
    despesa_prevista numeric(15,2) DEFAULT 0,
    saldo_previsto numeric(15,2) GENERATED ALWAYS AS (receita_prevista - despesa_prevista) STORED,
    
    receita_realizada numeric(15,2) DEFAULT 0,
    despesa_realizada numeric(15,2) DEFAULT 0,
    saldo_realizado numeric(15,2) GENERATED ALWAYS AS (receita_realizada - despesa_realizada) STORED,
    
    cenario text DEFAULT 'realista',
    
    observacoes text,
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, marca, mes_referencia, cenario)
);

CREATE INDEX IF NOT EXISTS idx_fin_projecoes_tenant ON public.fin_projecoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_projecoes_mes ON public.fin_projecoes(mes_referencia);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_fin_contas_bancarias_updated_at ON public.fin_contas_bancarias;
CREATE TRIGGER update_fin_contas_bancarias_updated_at 
BEFORE UPDATE ON public.fin_contas_bancarias 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_fin_receitas_updated_at ON public.fin_receitas;
CREATE TRIGGER update_fin_receitas_updated_at 
BEFORE UPDATE ON public.fin_receitas 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_fin_despesas_updated_at ON public.fin_despesas;
CREATE TRIGGER update_fin_despesas_updated_at 
BEFORE UPDATE ON public.fin_despesas 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_fin_comissoes_updated_at ON public.fin_comissoes;
CREATE TRIGGER update_fin_comissoes_updated_at 
BEFORE UPDATE ON public.fin_comissoes 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_fin_projecoes_updated_at ON public.fin_projecoes;
CREATE TRIGGER update_fin_projecoes_updated_at 
BEFORE UPDATE ON public.fin_projecoes 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para saldo
CREATE OR REPLACE FUNCTION atualizar_saldo_conta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'efetivada' THEN
        IF NEW.tipo = 'entrada' AND NEW.conta_destino_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        ELSIF NEW.tipo = 'saida' AND NEW.conta_origem_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
        ELSIF NEW.tipo = 'transferencia' THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
            
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_atualizar_saldo ON public.fin_transacoes;
CREATE TRIGGER trigger_atualizar_saldo 
    AFTER INSERT ON public.fin_transacoes
    FOR EACH ROW EXECUTE PROCEDURE atualizar_saldo_conta();

-- =====================================================
-- RLS
-- =====================================================
ALTER TABLE public.fin_contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_plano_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_projecoes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VIEWS
-- =====================================================
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
