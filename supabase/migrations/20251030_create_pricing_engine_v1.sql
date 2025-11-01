-- =======================================================
-- PRICING ENGINE - VERSÃO 1
-- Sistema de precificação e margens dinâmicas
-- =======================================================

-- ENUMs idempotentes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_markup') THEN
        CREATE TYPE fin_tipo_markup AS ENUM (
            'fixo',               -- Valor fixo adicionado
            'percentual',         -- Percentual sobre o custo
            'dinamico',          -- Calculado por regras
            'personalizado'       -- Definido manualmente
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_regra_preco') THEN
        CREATE TYPE fin_tipo_regra_preco AS ENUM (
            'markup_padrao',      -- Markup padrão por tipo de produto
            'volume',            -- Desconto por volume
            'sazonalidade',      -- Ajuste por sazonalidade
            'cliente_categoria', -- Preços por categoria de cliente
            'destino',          -- Markup específico por destino
            'fornecedor',       -- Markup específico por fornecedor
            'produto'           -- Markup específico por produto
        );
    END IF;
END $$;

-- =======================================================
-- 1. CONFIGURAÇÕES DE MARKUP PADRÃO
-- =======================================================
CREATE TABLE IF NOT EXISTS public.fin_markups_padrao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    tipo_produto VARCHAR(50) NOT NULL,   -- hotel, voo, transfer, etc
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    
    tipo_markup fin_tipo_markup NOT NULL,
    valor_markup DECIMAL(10,4) NOT NULL, -- Percentual ou valor fixo
    moeda moeda DEFAULT 'EUR',          -- Moeda do markup fixo
    
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT uk_markup_produto UNIQUE (tenant_id, tipo_produto)
);

-- =======================================================
-- 2. REGRAS DE PREÇO
-- =======================================================
CREATE TABLE IF NOT EXISTS public.fin_regras_preco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    nome VARCHAR(100) NOT NULL,
    tipo fin_tipo_regra_preco NOT NULL,
    descricao TEXT,
    
    -- Condições de aplicação
    valor_minimo DECIMAL(12,2),          -- Valor mínimo para aplicar
    valor_maximo DECIMAL(12,2),          -- Valor máximo para aplicar
    data_inicio DATE,                    -- Período de validade
    data_fim DATE,
    
    -- Configurações de markup
    tipo_markup fin_tipo_markup NOT NULL,
    valor_markup DECIMAL(10,4) NOT NULL, -- Percentual ou valor fixo
    moeda moeda DEFAULT 'EUR',          -- Moeda do markup fixo
    
    -- Flags de controle
    prioridade INTEGER DEFAULT 0,        -- Ordem de aplicação
    sobrepor_regras BOOLEAN DEFAULT false, -- Se sobrepõe outras regras
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    metadados JSONB,                    -- Dados específicos por tipo
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================================
-- 3. SIMULAÇÕES DE PREÇO
-- =======================================================
CREATE TABLE IF NOT EXISTS public.fin_simulacoes_preco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Referências
    tipo_produto VARCHAR(50) NOT NULL,
    fornecedor_id UUID REFERENCES public.fin_fornecedores(id),
    cliente_id UUID REFERENCES public.clientes(id),
    
    -- Valores base
    valor_custo DECIMAL(12,2) NOT NULL,
    moeda_custo moeda NOT NULL,
    taxa_cambio DECIMAL(10,6),
    valor_custo_brl DECIMAL(12,2) GENERATED ALWAYS AS (valor_custo * COALESCE(taxa_cambio, 1)) STORED,
    
    -- Cálculos
    markup_aplicado DECIMAL(10,4),
    valor_markup DECIMAL(12,2),
    valor_final DECIMAL(12,2),
    margem_lucro DECIMAL(12,2),
    margem_percentual DECIMAL(5,2),
    
    -- Regras aplicadas
    regras_aplicadas JSONB,             -- Lista de regras que afetaram o preço
    justificativa TEXT,                 -- Explicação do cálculo
    
    -- Auditoria
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================================
-- 4. HISTÓRICO DE PREÇOS
-- =======================================================
CREATE TABLE IF NOT EXISTS public.fin_historico_precos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Identificação do produto/serviço
    tipo_produto VARCHAR(50) NOT NULL,
    produto_id UUID NOT NULL,           -- ID do hotel, voo, etc
    fornecedor_id UUID REFERENCES public.fin_fornecedores(id),
    
    -- Valores
    valor_custo DECIMAL(12,2) NOT NULL,
    valor_venda DECIMAL(12,2) NOT NULL,
    moeda moeda NOT NULL,
    taxa_cambio DECIMAL(10,6),
    
    -- Margens
    markup_aplicado DECIMAL(10,4),
    margem_lucro DECIMAL(12,2),
    margem_percentual DECIMAL(5,2),
    
    -- Período
    data_inicio DATE NOT NULL,
    data_fim DATE,
    
    -- Metadados
    observacoes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================================
-- ÍNDICES
-- =======================================================
CREATE INDEX IF NOT EXISTS idx_markups_padrao_tenant ON public.fin_markups_padrao(tenant_id);
CREATE INDEX IF NOT EXISTS idx_markups_padrao_tipo ON public.fin_markups_padrao(tipo_produto);
CREATE INDEX IF NOT EXISTS idx_markups_padrao_ativo ON public.fin_markups_padrao(ativo);

CREATE INDEX IF NOT EXISTS idx_regras_preco_tenant ON public.fin_regras_preco(tenant_id);
CREATE INDEX IF NOT EXISTS idx_regras_preco_tipo ON public.fin_regras_preco(tipo);
CREATE INDEX IF NOT EXISTS idx_regras_preco_datas ON public.fin_regras_preco(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_regras_preco_ativo ON public.fin_regras_preco(ativo);
CREATE INDEX IF NOT EXISTS idx_regras_preco_prioridade ON public.fin_regras_preco(prioridade);

CREATE INDEX IF NOT EXISTS idx_simulacoes_tenant ON public.fin_simulacoes_preco(tenant_id);
CREATE INDEX IF NOT EXISTS idx_simulacoes_tipo ON public.fin_simulacoes_preco(tipo_produto);
CREATE INDEX IF NOT EXISTS idx_simulacoes_fornecedor ON public.fin_simulacoes_preco(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_simulacoes_cliente ON public.fin_simulacoes_preco(cliente_id);

CREATE INDEX IF NOT EXISTS idx_historico_tenant ON public.fin_historico_precos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_historico_produto ON public.fin_historico_precos(tipo_produto, produto_id);
CREATE INDEX IF NOT EXISTS idx_historico_fornecedor ON public.fin_historico_precos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_historico_datas ON public.fin_historico_precos(data_inicio, data_fim);

-- =======================================================
-- TRIGGERS
-- =======================================================
-- Trigger para atualizar timestamps
DROP TRIGGER IF EXISTS update_markups_padrao_updated_at ON public.fin_markups_padrao;
CREATE TRIGGER update_markups_padrao_updated_at 
    BEFORE UPDATE ON public.fin_markups_padrao
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_regras_preco_updated_at ON public.fin_regras_preco;
CREATE TRIGGER update_regras_preco_updated_at 
    BEFORE UPDATE ON public.fin_regras_preco
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =======================================================
-- FUNÇÕES
-- =======================================================
-- Função para calcular markup com base nas regras
CREATE OR REPLACE FUNCTION calcular_markup_final(
    p_tenant_id UUID,
    p_tipo_produto VARCHAR(50),
    p_valor_custo DECIMAL(12,2),
    p_fornecedor_id UUID = NULL,
    p_cliente_id UUID = NULL,
    p_data DATE = CURRENT_DATE
)
RETURNS TABLE (
    markup_valor DECIMAL(10,4),
    markup_tipo fin_tipo_markup,
    regras_aplicadas JSONB,
    justificativa TEXT
) AS $$
DECLARE
    v_markup_padrao RECORD;
    v_regras JSONB := '[]'::JSONB;
    v_justificativa TEXT := '';
    v_markup_final DECIMAL(10,4);
    v_tipo_final fin_tipo_markup;
BEGIN
    -- 1. Buscar markup padrão
    SELECT * INTO v_markup_padrao 
    FROM fin_markups_padrao 
    WHERE tenant_id = p_tenant_id 
    AND tipo_produto = p_tipo_produto
    AND ativo = true;
    
    IF FOUND THEN
        v_markup_final := v_markup_padrao.valor_markup;
        v_tipo_final := v_markup_padrao.tipo_markup;
        v_regras := v_regras || jsonb_build_object(
            'tipo', 'markup_padrao',
            'valor', v_markup_final,
            'descricao', 'Markup padrão para ' || p_tipo_produto
        );
    ELSE
        v_markup_final := 10.00; -- Markup padrão de 10%
        v_tipo_final := 'percentual'::fin_tipo_markup;
    END IF;
    
    -- 2. Aplicar regras específicas
    FOR r IN (
        SELECT *
        FROM fin_regras_preco
        WHERE tenant_id = p_tenant_id
        AND ativo = true
        AND (data_inicio IS NULL OR data_inicio <= p_data)
        AND (data_fim IS NULL OR data_fim >= p_data)
        AND (valor_minimo IS NULL OR valor_minimo <= p_valor_custo)
        AND (valor_maximo IS NULL OR valor_maximo >= p_valor_custo)
        ORDER BY prioridade DESC
    ) LOOP
        -- Verificar se a regra deve sobrepor as anteriores
        IF r.sobrepor_regras THEN
            v_markup_final := r.valor_markup;
            v_tipo_final := r.tipo_markup;
            v_regras := '[]'::JSONB;
        ELSE
            -- Ajustar markup conforme tipo da regra
            CASE 
                WHEN r.tipo_markup = 'percentual' THEN
                    v_markup_final := v_markup_final + r.valor_markup;
                WHEN r.tipo_markup = 'fixo' THEN
                    -- Converter para percentual equivalente
                    v_markup_final := v_markup_final + (r.valor_markup / p_valor_custo * 100);
            END CASE;
        END IF;
        
        -- Registrar regra aplicada
        v_regras := v_regras || jsonb_build_object(
            'tipo', r.tipo::TEXT,
            'valor', r.valor_markup,
            'descricao', r.descricao
        );
    END LOOP;
    
    -- 3. Gerar justificativa
    v_justificativa := 'Markup final de ' || v_markup_final || '% calculado com base em ' || 
                      jsonb_array_length(v_regras) || ' regras.';
    
    RETURN QUERY 
    SELECT v_markup_final, v_tipo_final, v_regras, v_justificativa;
END;
$$ LANGUAGE plpgsql;

-- =======================================================
-- RLS
-- =======================================================
ALTER TABLE public.fin_markups_padrao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_regras_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_simulacoes_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_historico_precos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS serão definidas em arquivo separado

-- =======================================================
-- COMENTÁRIOS
-- =======================================================
COMMENT ON TABLE public.fin_markups_padrao IS 'Configurações de markup padrão por tipo de produto';
COMMENT ON TABLE public.fin_regras_preco IS 'Regras de precificação dinâmica';
COMMENT ON TABLE public.fin_simulacoes_preco IS 'Simulações e cálculos de preço';
COMMENT ON TABLE public.fin_historico_precos IS 'Histórico de preços aplicados';