-- =====================================================
-- CENTRO DE CUSTOS - VERSÃO 3 FIXED
-- 100% IDEMPOTENTE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.fin_centros_custo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Identificação
  codigo VARCHAR(50) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  
  -- Classificação
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('viagem', 'grupo', 'cliente', 'projeto', 'evento', 'outros')),
  marca marca,
  
  -- Período
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  -- Financeiro
  orcamento_previsto DECIMAL(15,2) DEFAULT 0,
  moeda moeda DEFAULT 'BRL',
  
  -- Metas
  meta_margem_percentual DECIMAL(5,2) DEFAULT 15.00,
  meta_receita DECIMAL(15,2),
  
  -- Status
  status VARCHAR(30) NOT NULL DEFAULT 'planejamento' 
    CHECK (status IN ('planejamento', 'ativo', 'concluido', 'cancelado')),
  
  -- Responsáveis
  responsavel_id UUID REFERENCES public.users(id),
  equipe JSONB,
  
  -- Metadados
  tags TEXT[],
  metadata JSONB,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  
  -- Constraints
  CONSTRAINT unique_codigo_tenant UNIQUE (tenant_id, codigo)
);

CREATE TABLE IF NOT EXISTS public.fin_alocacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  centro_custo_id UUID NOT NULL REFERENCES public.fin_centros_custo(id) ON DELETE CASCADE,
  receita_id UUID REFERENCES public.fin_receitas(id) ON DELETE CASCADE,
  despesa_id UUID REFERENCES public.fin_despesas(id) ON DELETE CASCADE,
  
  -- Rateio
  tipo_rateio VARCHAR(30) NOT NULL CHECK (tipo_rateio IN ('percentual', 'valor_fixo', 'proporcional')),
  percentual_alocacao DECIMAL(5,2),
  valor_alocado DECIMAL(15,2) NOT NULL,
  
  -- Detalhes
  observacoes TEXT,
  data_alocacao DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  
  -- Constraints
  CHECK (
    (receita_id IS NOT NULL AND despesa_id IS NULL) OR
    (receita_id IS NULL AND despesa_id IS NOT NULL)
  ),
  CHECK (
    (tipo_rateio = 'percentual' AND percentual_alocacao IS NOT NULL AND percentual_alocacao >= 0 AND percentual_alocacao <= 100) OR
    (tipo_rateio IN ('valor_fixo', 'proporcional'))
  )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_centros_custo_tenant ON public.fin_centros_custo(tenant_id);
CREATE INDEX IF NOT EXISTS idx_centros_custo_status ON public.fin_centros_custo(status);
CREATE INDEX IF NOT EXISTS idx_centros_custo_tipo ON public.fin_centros_custo(tipo);
CREATE INDEX IF NOT EXISTS idx_centros_custo_marca ON public.fin_centros_custo(marca);
CREATE INDEX IF NOT EXISTS idx_centros_custo_datas ON public.fin_centros_custo(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_centros_custo_codigo ON public.fin_centros_custo(codigo);

CREATE INDEX IF NOT EXISTS idx_alocacoes_tenant ON public.fin_alocacoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_centro_custo ON public.fin_alocacoes(centro_custo_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_receita ON public.fin_alocacoes(receita_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_despesa ON public.fin_alocacoes(despesa_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_centros_custo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_centros_custo_updated_at ON public.fin_centros_custo;
CREATE TRIGGER trigger_centros_custo_updated_at
  BEFORE UPDATE ON public.fin_centros_custo
  FOR EACH ROW
  EXECUTE FUNCTION update_centros_custo_updated_at();

DROP TRIGGER IF EXISTS trigger_alocacoes_updated_at ON public.fin_alocacoes;
CREATE TRIGGER trigger_alocacoes_updated_at
  BEFORE UPDATE ON public.fin_alocacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_centros_custo_updated_at();

-- RLS
ALTER TABLE public.fin_centros_custo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_alocacoes ENABLE ROW LEVEL SECURITY;

-- View
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
  
  COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS receitas_total,
  COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS despesas_total,
  
  COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS margem_liquida,
  
  CASE 
    WHEN COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) > 0 THEN
      ((COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0)) / 
       COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 1)) * 100
    ELSE 0
  END AS margem_percentual,
  
  cc.orcamento_previsto - COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS saldo_orcamento,
  
  CASE 
    WHEN cc.orcamento_previsto > 0 THEN
      (COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) / cc.orcamento_previsto) * 100
    ELSE 0
  END AS percentual_orcamento_utilizado,
  
  COUNT(DISTINCT a.receita_id) AS qtd_receitas,
  COUNT(DISTINCT a.despesa_id) AS qtd_despesas,
  
  cc.created_at,
  cc.updated_at
  
FROM public.fin_centros_custo cc
LEFT JOIN public.fin_alocacoes a ON cc.id = a.centro_custo_id
GROUP BY cc.id;
