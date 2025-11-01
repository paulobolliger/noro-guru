-- =====================================================
-- COMISSÕES E REPASSES - VERSÃO 1
-- 100% IDEMPOTENTE
-- =====================================================

-- ENUMs idempotentes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_comissao') THEN
        CREATE TYPE fin_tipo_comissao AS ENUM ('hotel', 'aereo', 'tour', 'seguro', 'visto', 'outro');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_status_comissao') THEN
        CREATE TYPE fin_status_comissao AS ENUM ('pendente', 'prevista', 'paga', 'cancelada', 'repassada');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_repassado') THEN
        CREATE TYPE fin_tipo_repassado AS ENUM ('agencia', 'consultor', 'parceiro');
    END IF;
END $$;

-- Tabela de regras de comissão por produto
CREATE TABLE IF NOT EXISTS public.fin_regras_comissao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  tipo fin_tipo_comissao NOT NULL,
  produto_id UUID,
  fornecedor_id UUID REFERENCES public.fin_fornecedores(id),
  percentual NUMERIC(5,2),
  valor_fixo NUMERIC(15,2),
  faixa_inicial NUMERIC(15,2),
  faixa_final NUMERIC(15,2),
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de comissões recebidas
CREATE TABLE IF NOT EXISTS public.fin_comissoes_recebidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  tipo fin_tipo_comissao NOT NULL,
  fornecedor_id UUID REFERENCES public.fin_fornecedores(id),
  produto_id UUID,
  valor_bruto NUMERIC(15,2) NOT NULL,
  percentual NUMERIC(5,2),
  valor_comissao NUMERIC(15,2) NOT NULL,
  moeda moeda DEFAULT 'BRL',
  data_prevista DATE,
  data_recebida DATE,
  status fin_status_comissao DEFAULT 'pendente',
  origem TEXT, -- ex: Expedia, Flytour
  comprovante_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de split de comissão
CREATE TABLE IF NOT EXISTS public.fin_comissoes_split (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comissao_id UUID NOT NULL REFERENCES public.fin_comissoes_recebidas(id) ON DELETE CASCADE,
  tipo_repassado fin_tipo_repassado NOT NULL,
  usuario_id UUID REFERENCES public.users(id),
  percentual NUMERIC(5,2),
  valor_repassado NUMERIC(15,2),
  status fin_status_comissao DEFAULT 'prevista',
  data_repassada DATE,
  metodo_pagamento TEXT, -- PIX, Remessa Online
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de automação de repasses
CREATE TABLE IF NOT EXISTS public.fin_repasses_automacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID NOT NULL REFERENCES public.fin_comissoes_split(id) ON DELETE CASCADE,
  status fin_status_comissao DEFAULT 'pendente',
  data_agendada DATE,
  data_executada DATE,
  comprovante_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Painel de previsão de comissões futuras (view)
CREATE OR REPLACE VIEW public.vw_previsao_comissoes_futuras AS
SELECT 
  c.tenant_id,
  c.tipo,
  c.fornecedor_id,
  c.produto_id,
  c.data_prevista,
  SUM(c.valor_comissao) AS total_previsto,
  COUNT(*) AS qtd_prevista
FROM public.fin_comissoes_recebidas c
WHERE c.status IN ('pendente', 'prevista')
GROUP BY c.tenant_id, c.tipo, c.fornecedor_id, c.produto_id, c.data_prevista;

-- Índices
CREATE INDEX IF NOT EXISTS idx_comissoes_recebidas_tenant ON public.fin_comissoes_recebidas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_recebidas_status ON public.fin_comissoes_recebidas(status);
CREATE INDEX IF NOT EXISTS idx_comissoes_split_comissao ON public.fin_comissoes_split(comissao_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_split_usuario ON public.fin_comissoes_split(usuario_id);
CREATE INDEX IF NOT EXISTS idx_repasses_automacao_split ON public.fin_repasses_automacao(split_id);
