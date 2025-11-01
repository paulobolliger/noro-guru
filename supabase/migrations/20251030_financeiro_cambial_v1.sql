-- =====================================================
-- CONTROLE CAMBIAL E MULTIMOEDA - VERSÃO 1
-- 100% IDEMPOTENTE
-- =====================================================

-- ENUMs idempotentes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_cambio') THEN
        CREATE TYPE fin_tipo_cambio AS ENUM (
            'comercial',
            'turismo',
            'interno_noro',
            'fixo_grupo'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_moeda_base') THEN
        CREATE TYPE fin_moeda_base AS ENUM (
            'USD',
            'EUR',
            'GBP',
            'BRL'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_fonte_taxa') THEN
        CREATE TYPE fin_fonte_taxa AS ENUM (
            'bcb',
            'remessa_online',
            'wise',
            'manual',
            'contrato'
        );
    END IF;
END $$;

-- Tabela de configurações de câmbio por grupo
CREATE TABLE IF NOT EXISTS public.fin_config_cambio_grupo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    grupo_id UUID NOT NULL,
    moeda fin_moeda_base NOT NULL,
    tipo_cambio fin_tipo_cambio NOT NULL,
    taxa_fixa DECIMAL(10,4),
    margem_cambio DECIMAL(5,2),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de taxas de câmbio (histórico)
CREATE TABLE IF NOT EXISTS public.fin_taxas_cambio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    data_taxa DATE NOT NULL,
    hora_taxa TIME NOT NULL,
    moeda_origem fin_moeda_base NOT NULL,
    moeda_destino fin_moeda_base NOT NULL,
    tipo_cambio fin_tipo_cambio NOT NULL,
    taxa_compra DECIMAL(10,4) NOT NULL,
    taxa_venda DECIMAL(10,4) NOT NULL,
    fonte_taxa fin_fonte_taxa NOT NULL,
    spread DECIMAL(5,2),
    iof DECIMAL(5,2),
    outras_taxas DECIMAL(5,2),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de alertas cambiais
CREATE TABLE IF NOT EXISTS public.fin_alertas_cambio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    moeda fin_moeda_base NOT NULL,
    tipo_cambio fin_tipo_cambio NOT NULL,
    valor_gatilho DECIMAL(10,4) NOT NULL,
    variacao_percentual DECIMAL(5,2) NOT NULL,
    mensagem TEXT,
    notificado_em TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de simulações de margem
CREATE TABLE IF NOT EXISTS public.fin_simulacoes_margem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    produto_id UUID,
    moeda_origem fin_moeda_base NOT NULL,
    moeda_destino fin_moeda_base NOT NULL,
    valor_original DECIMAL(15,2) NOT NULL,
    taxa_cambio DECIMAL(10,4) NOT NULL,
    spread DECIMAL(5,2),
    iof DECIMAL(5,2),
    outras_taxas DECIMAL(5,2),
    markup DECIMAL(5,2),
    valor_final DECIMAL(15,2) NOT NULL,
    margem_final DECIMAL(5,2) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES public.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_config_cambio_grupo_tenant ON public.fin_config_cambio_grupo(tenant_id);
CREATE INDEX IF NOT EXISTS idx_config_cambio_grupo_ativo ON public.fin_config_cambio_grupo(ativo);

CREATE INDEX IF NOT EXISTS idx_taxas_cambio_tenant ON public.fin_taxas_cambio(tenant_id);
CREATE INDEX IF NOT EXISTS idx_taxas_cambio_data ON public.fin_taxas_cambio(data_taxa);
CREATE INDEX IF NOT EXISTS idx_taxas_cambio_moedas ON public.fin_taxas_cambio(moeda_origem, moeda_destino);

CREATE INDEX IF NOT EXISTS idx_alertas_cambio_tenant ON public.fin_alertas_cambio(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alertas_cambio_moeda ON public.fin_alertas_cambio(moeda);

CREATE INDEX IF NOT EXISTS idx_simulacoes_margem_tenant ON public.fin_simulacoes_margem(tenant_id);
CREATE INDEX IF NOT EXISTS idx_simulacoes_margem_produto ON public.fin_simulacoes_margem(produto_id);

-- View de variação cambial
CREATE OR REPLACE VIEW vw_variacao_cambial AS
WITH dias_anteriores AS (
    SELECT 
        tenant_id,
        moeda_origem,
        moeda_destino,
        tipo_cambio,
        data_taxa,
        taxa_venda,
        LAG(taxa_venda, 1) OVER (
            PARTITION BY tenant_id, moeda_origem, moeda_destino, tipo_cambio 
            ORDER BY data_taxa
        ) as taxa_anterior,
        LAG(taxa_venda, 7) OVER (
            PARTITION BY tenant_id, moeda_origem, moeda_destino, tipo_cambio 
            ORDER BY data_taxa
        ) as taxa_7_dias,
        LAG(taxa_venda, 30) OVER (
            PARTITION BY tenant_id, moeda_origem, moeda_destino, tipo_cambio 
            ORDER BY data_taxa
        ) as taxa_30_dias
    FROM fin_taxas_cambio
)
SELECT
    tenant_id,
    moeda_origem,
    moeda_destino,
    tipo_cambio,
    data_taxa,
    taxa_venda as taxa_atual,
    taxa_anterior,
    taxa_7_dias,
    taxa_30_dias,
    CASE 
        WHEN taxa_anterior IS NOT NULL THEN 
            ((taxa_venda - taxa_anterior) / taxa_anterior * 100)
        ELSE 0 
    END as variacao_diaria,
    CASE 
        WHEN taxa_7_dias IS NOT NULL THEN 
            ((taxa_venda - taxa_7_dias) / taxa_7_dias * 100)
        ELSE 0 
    END as variacao_semanal,
    CASE 
        WHEN taxa_30_dias IS NOT NULL THEN 
            ((taxa_venda - taxa_30_dias) / taxa_30_dias * 100)
        ELSE 0 
    END as variacao_mensal
FROM dias_anteriores
WHERE data_taxa >= CURRENT_DATE - INTERVAL '90 days';

-- RLS
ALTER TABLE public.fin_config_cambio_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_taxas_cambio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_alertas_cambio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_simulacoes_margem ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE fin_config_cambio_grupo IS 'Configurações de câmbio por grupo/marca';
COMMENT ON TABLE fin_taxas_cambio IS 'Histórico de taxas de câmbio com spread e IOF';
COMMENT ON TABLE fin_alertas_cambio IS 'Alertas de variação cambial significativa';
COMMENT ON TABLE fin_simulacoes_margem IS 'Simulações de margem em diferentes moedas';
COMMENT ON VIEW vw_variacao_cambial IS 'Análise de variação cambial (diária, semanal, mensal)';