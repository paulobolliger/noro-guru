-- =====================================================
-- CENTRO DE CUSTOS E PROJETOS
-- Controle de rentabilidade por viagem, grupo ou cliente
-- =====================================================

-- Tabela de Centros de Custo (Projetos)
CREATE TABLE IF NOT EXISTS public.fin_centros_custo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  
  -- Identificação
  codigo VARCHAR(50) NOT NULL, -- Ex: "RIO-OUT-25", "GRUPO-ARGENTINA-123"
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  
  -- Classificação
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('viagem', 'grupo', 'cliente', 'projeto', 'evento', 'outros')),
  marca VARCHAR(50) CHECK (marca IN ('noro', 'nomade', 'safetrip', 'vistos', 'outro')),
  
  -- Período
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
  
  -- Responsáveis
  responsavel_id UUID, -- FK para usuário responsável
  equipe JSONB, -- Array de user_ids da equipe
  
  -- Metadados
  tags TEXT[], -- Tags para busca/filtro
  metadata JSONB, -- Dados extras específicos do tipo
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CONSTRAINT unique_codigo_tenant UNIQUE (tenant_id, codigo)
);

-- Tabela de Alocações (Rateio de Receitas e Despesas)
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
  ), -- Deve ter receita OU despesa, não ambos
  CHECK (
    (tipo_rateio = 'percentual' AND percentual_alocacao IS NOT NULL AND percentual_alocacao >= 0 AND percentual_alocacao <= 100) OR
    (tipo_rateio IN ('valor_fixo', 'proporcional'))
  )
);

-- Índices para performance
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
CREATE POLICY "Centros de custo são isolados por tenant"
  ON public.fin_centros_custo
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Policy para alocações
CREATE POLICY "Alocações são isoladas por tenant"
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
  
  -- Cálculos
  COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) AS margem_liquida,
  
  CASE 
    WHEN COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) > 0 THEN
      ((COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN a.despesa_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 0)) / 
       COALESCE(SUM(CASE WHEN a.receita_id IS NOT NULL THEN a.valor_alocado ELSE 0 END), 1)) * 100
    ELSE 0
  END AS margem_percentual,
  
  -- Orçamento
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

-- Comentários
COMMENT ON TABLE public.fin_centros_custo IS 'Centros de custo e projetos para controle de rentabilidade';
COMMENT ON TABLE public.fin_alocacoes IS 'Alocação e rateio de receitas e despesas em centros de custo';
COMMENT ON VIEW public.vw_rentabilidade_centros_custo IS 'View agregada com cálculos de rentabilidade por centro de custo';

COMMENT ON COLUMN public.fin_centros_custo.codigo IS 'Código único do projeto (ex: RIO-OUT-25)';
COMMENT ON COLUMN public.fin_centros_custo.tipo IS 'Tipo: viagem, grupo, cliente, projeto, evento, outros';
COMMENT ON COLUMN public.fin_centros_custo.meta_margem_percentual IS 'Meta de margem líquida em percentual (padrão 15%)';
COMMENT ON COLUMN public.fin_alocacoes.tipo_rateio IS 'Tipo de rateio: percentual, valor_fixo, proporcional';
