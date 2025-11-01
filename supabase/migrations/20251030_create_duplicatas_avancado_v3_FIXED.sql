-- =====================================================
-- DUPLICATAS AVANÇADO - VERSÃO 3 FIXED
-- 100% IDEMPOTENTE - TODOS ENUMS COM IF NOT EXISTS
-- =====================================================

-- ENUMs idempotentes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_condicao_pagamento') THEN
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
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_referencia_data') THEN
        CREATE TYPE fin_referencia_data AS ENUM (
          'emissao',
          'checkout',
          'embarque',
          'entrega',
          'personalizada'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_status_duplicata') THEN
        CREATE TYPE fin_status_duplicata AS ENUM (
          'aberta',
          'parcialmente_recebida',
          'recebida',
          'vencida',
          'cancelada',
          'protestada',
          'negociacao'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_adiantamento') THEN
        CREATE TYPE fin_tipo_adiantamento AS ENUM (
          'pagamento_antecipado',
          'deposito_garantia',
          'sinal',
          'credito_prepago'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_status_adiantamento') THEN
        CREATE TYPE fin_status_adiantamento AS ENUM (
          'ativo',
          'parcialmente_utilizado',
          'totalmente_utilizado',
          'cancelado',
          'expirado'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_credito') THEN
        CREATE TYPE fin_tipo_credito AS ENUM (
          'refund',
          'overpayment',
          'desconto_fornecedor',
          'credito_futuro',
          'estorno',
          'devolucao'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_status_credito') THEN
        CREATE TYPE fin_status_credito AS ENUM (
          'disponivel',
          'parcialmente_utilizado',
          'totalmente_utilizado',
          'expirado',
          'cancelado'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_tipo_lembrete') THEN
        CREATE TYPE fin_tipo_lembrete AS ENUM (
          'vencimento_proximo',
          'vencido',
          'cobranca',
          'confirmacao_pagamento'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fin_canal_notificacao') THEN
        CREATE TYPE fin_canal_notificacao AS ENUM (
          'email',
          'whatsapp',
          'sms',
          'webhook'
        );
    END IF;
END $$;

-- =====================================================
-- 1. CONDIÇÕES DE PAGAMENTO
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_condicoes_pagamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(20),
  tipo fin_tipo_condicao_pagamento NOT NULL,
  
  dias_vencimento INTEGER DEFAULT 0,
  referencia_data fin_referencia_data DEFAULT 'emissao',
  numero_parcelas INTEGER DEFAULT 1,
  intervalo_parcelas INTEGER DEFAULT 30,
  
  percentual_desconto_antecipacao DECIMAL(5,2),
  percentual_juros_atraso DECIMAL(5,2),
  
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. DUPLICATAS A RECEBER
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_duplicatas_receber (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  numero_duplicata VARCHAR(50) NOT NULL,
  numero_nota_fiscal VARCHAR(50),
  serie_nota_fiscal VARCHAR(10),
  chave_acesso_nfe VARCHAR(44),
  
  -- Relacionamentos CORRIGIDOS
  cliente_id UUID REFERENCES public.clientes(id),
  fornecedor_intermediario_id UUID REFERENCES public.fin_fornecedores(id),
  reserva_id UUID,
  pedido_id UUID,
  orcamento_id UUID,
  condicao_pagamento_id UUID REFERENCES public.fin_condicoes_pagamento(id),
  
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
  data_referencia DATE,
  
  -- Status
  status fin_status_duplicata DEFAULT 'aberta',
  dias_atraso INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN status IN ('recebida', 'cancelada') THEN 0
      WHEN CURRENT_DATE > data_vencimento THEN EXTRACT(DAY FROM CURRENT_DATE - data_vencimento)::INTEGER
      ELSE 0
    END
  ) STORED,
  
  -- Cache
  cliente_nome VARCHAR(200),
  cliente_documento VARCHAR(20),
  cliente_email VARCHAR(200),
  cliente_telefone VARCHAR(20),
  
  -- Docs
  observacoes TEXT,
  condicao_pagamento_texto TEXT,
  documento_url TEXT,
  xml_nfe_url TEXT,
  
  -- Auditoria
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. DUPLICATAS A PAGAR
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_duplicatas_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  numero_duplicata VARCHAR(50) NOT NULL,
  numero_nota_fiscal VARCHAR(50),
  serie_nota_fiscal VARCHAR(10),
  chave_acesso_nfe VARCHAR(44),
  
  -- Relacionamentos CORRIGIDOS
  fornecedor_id UUID NOT NULL REFERENCES public.fin_fornecedores(id),
  reserva_id UUID,
  pedido_id UUID,
  condicao_pagamento_id UUID REFERENCES public.fin_condicoes_pagamento(id),
  adiantamento_id UUID,
  
  -- Valores
  valor_original DECIMAL(15,2) NOT NULL,
  valor_desconto DECIMAL(15,2) DEFAULT 0,
  valor_juros DECIMAL(15,2) DEFAULT 0,
  valor_total DECIMAL(15,2) NOT NULL,
  valor_pago DECIMAL(15,2) DEFAULT 0,
  valor_pendente DECIMAL(15,2) NOT NULL,
  valor_credito_aplicado DECIMAL(15,2) DEFAULT 0,
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  valor_brl DECIMAL(15,2) GENERATED ALWAYS AS (valor_total * taxa_cambio) STORED,
  
  -- Datas
  data_emissao DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  data_referencia DATE,
  
  -- Status
  status fin_status_duplicata DEFAULT 'aberta',
  dias_vencimento INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN status IN ('recebida', 'cancelada') THEN 0
      ELSE EXTRACT(DAY FROM data_vencimento - CURRENT_DATE)::INTEGER
    END
  ) STORED,
  
  -- Cache
  fornecedor_nome VARCHAR(200),
  fornecedor_documento VARCHAR(20),
  fornecedor_email VARCHAR(200),
  fornecedor_telefone VARCHAR(20),
  
  -- Pagamento
  forma_pagamento forma_pagamento,
  conta_bancaria_id UUID REFERENCES public.fin_contas_bancarias(id),
  comprovante_pagamento_url TEXT,
  
  -- Docs
  observacoes TEXT,
  condicao_pagamento_texto TEXT,
  documento_url TEXT,
  xml_nfe_url TEXT,
  
  -- Auditoria
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 4. PARCELAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_parcelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  duplicata_receber_id UUID REFERENCES public.fin_duplicatas_receber(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES public.fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  numero_parcela INTEGER NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  valor_pago DECIMAL(15,2) DEFAULT 0,
  
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  status fin_status_duplicata DEFAULT 'aberta',
  
  observacoes TEXT,
  
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
CREATE TABLE IF NOT EXISTS public.fin_adiantamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  numero_adiantamento VARCHAR(50) NOT NULL,
  tipo fin_tipo_adiantamento NOT NULL,
  
  fornecedor_id UUID NOT NULL REFERENCES public.fin_fornecedores(id),
  fornecedor_nome VARCHAR(200),
  reserva_id UUID,
  
  valor_original DECIMAL(15,2) NOT NULL,
  valor_utilizado DECIMAL(15,2) DEFAULT 0,
  valor_disponivel DECIMAL(15,2) NOT NULL,
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  
  data_pagamento DATE NOT NULL,
  data_expiracao DATE,
  
  status fin_status_adiantamento DEFAULT 'ativo',
  
  forma_pagamento forma_pagamento,
  conta_bancaria_id UUID REFERENCES public.fin_contas_bancarias(id),
  comprovante_pagamento_url TEXT,
  
  observacoes TEXT,
  condicoes_uso TEXT,
  
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. CRÉDITOS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_creditos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  marca marca NOT NULL,
  
  numero_credito VARCHAR(50) NOT NULL,
  tipo_credito fin_tipo_credito NOT NULL,
  
  fornecedor_id UUID NOT NULL REFERENCES public.fin_fornecedores(id),
  fornecedor_nome VARCHAR(200),
  duplicata_origem_id UUID,
  reserva_id UUID,
  
  valor_original DECIMAL(15,2) NOT NULL,
  valor_utilizado DECIMAL(15,2) DEFAULT 0,
  valor_disponivel DECIMAL(15,2) NOT NULL,
  
  moeda moeda DEFAULT 'BRL',
  taxa_cambio DECIMAL(10,6) DEFAULT 1,
  
  data_recebimento DATE NOT NULL,
  data_expiracao DATE,
  
  status fin_status_credito DEFAULT 'disponivel',
  
  motivo TEXT NOT NULL,
  documento_referencia VARCHAR(100),
  comprovante_url TEXT,
  
  observacoes TEXT,
  
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. UTILIZAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_utilizacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  adiantamento_id UUID REFERENCES public.fin_adiantamentos(id) ON DELETE CASCADE,
  credito_id UUID REFERENCES public.fin_creditos(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES public.fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  valor_utilizado DECIMAL(15,2) NOT NULL,
  data_utilizacao DATE NOT NULL,
  observacoes TEXT,
  
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_tipo_utilizacao CHECK (
    (adiantamento_id IS NOT NULL AND credito_id IS NULL) OR
    (adiantamento_id IS NULL AND credito_id IS NOT NULL)
  )
);

-- =====================================================
-- 8. LEMBRETES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_lembretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  duplicata_receber_id UUID REFERENCES public.fin_duplicatas_receber(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES public.fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  tipo_lembrete fin_tipo_lembrete NOT NULL,
  dias_antecedencia INTEGER DEFAULT 0,
  canais fin_canal_notificacao[] DEFAULT ARRAY['email']::fin_canal_notificacao[],
  
  destinatario_nome VARCHAR(200),
  destinatario_email VARCHAR(200),
  destinatario_telefone VARCHAR(20),
  
  programado_para TIMESTAMPTZ NOT NULL,
  enviado_em TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pendente',
  erro_mensagem TEXT,
  
  assunto TEXT,
  mensagem TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_condicoes_pagamento_tenant ON public.fin_condicoes_pagamento(tenant_id);
CREATE INDEX IF NOT EXISTS idx_condicoes_pagamento_ativo ON public.fin_condicoes_pagamento(ativo);

CREATE INDEX IF NOT EXISTS idx_duplicatas_receber_tenant ON public.fin_duplicatas_receber(tenant_id);
CREATE INDEX IF NOT EXISTS idx_duplicatas_receber_status ON public.fin_duplicatas_receber(status);
CREATE INDEX IF NOT EXISTS idx_duplicatas_receber_vencimento ON public.fin_duplicatas_receber(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_duplicatas_receber_cliente ON public.fin_duplicatas_receber(cliente_id);
CREATE INDEX IF NOT EXISTS idx_duplicatas_receber_reserva ON public.fin_duplicatas_receber(reserva_id);
CREATE INDEX IF NOT EXISTS idx_duplicatas_receber_nfe ON public.fin_duplicatas_receber(chave_acesso_nfe);

CREATE INDEX IF NOT EXISTS idx_duplicatas_pagar_tenant ON public.fin_duplicatas_pagar(tenant_id);
CREATE INDEX IF NOT EXISTS idx_duplicatas_pagar_status ON public.fin_duplicatas_pagar(status);
CREATE INDEX IF NOT EXISTS idx_duplicatas_pagar_vencimento ON public.fin_duplicatas_pagar(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_duplicatas_pagar_fornecedor ON public.fin_duplicatas_pagar(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_duplicatas_pagar_reserva ON public.fin_duplicatas_pagar(reserva_id);
CREATE INDEX IF NOT EXISTS idx_duplicatas_pagar_adiantamento ON public.fin_duplicatas_pagar(adiantamento_id);

CREATE INDEX IF NOT EXISTS idx_parcelas_duplicata_receber ON public.fin_parcelas(duplicata_receber_id);
CREATE INDEX IF NOT EXISTS idx_parcelas_duplicata_pagar ON public.fin_parcelas(duplicata_pagar_id);
CREATE INDEX IF NOT EXISTS idx_parcelas_vencimento ON public.fin_parcelas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_parcelas_status ON public.fin_parcelas(status);

CREATE INDEX IF NOT EXISTS idx_adiantamentos_tenant ON public.fin_adiantamentos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_adiantamentos_fornecedor ON public.fin_adiantamentos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_adiantamentos_status ON public.fin_adiantamentos(status);

CREATE INDEX IF NOT EXISTS idx_creditos_tenant ON public.fin_creditos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_creditos_fornecedor ON public.fin_creditos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_creditos_status ON public.fin_creditos(status);

CREATE INDEX IF NOT EXISTS idx_utilizacoes_adiantamento ON public.fin_utilizacoes(adiantamento_id);
CREATE INDEX IF NOT EXISTS idx_utilizacoes_credito ON public.fin_utilizacoes(credito_id);
CREATE INDEX IF NOT EXISTS idx_utilizacoes_duplicata ON public.fin_utilizacoes(duplicata_pagar_id);

CREATE INDEX IF NOT EXISTS idx_lembretes_duplicata_receber ON public.fin_lembretes(duplicata_receber_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_duplicata_pagar ON public.fin_lembretes(duplicata_pagar_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_programado ON public.fin_lembretes(programado_para);
CREATE INDEX IF NOT EXISTS idx_lembretes_status ON public.fin_lembretes(status);

-- =====================================================
-- VIEWS
-- =====================================================
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

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_condicoes_pagamento_updated_at ON public.fin_condicoes_pagamento;
CREATE TRIGGER update_condicoes_pagamento_updated_at BEFORE UPDATE ON public.fin_condicoes_pagamento
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_duplicatas_receber_updated_at ON public.fin_duplicatas_receber;
CREATE TRIGGER update_duplicatas_receber_updated_at BEFORE UPDATE ON public.fin_duplicatas_receber
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_duplicatas_pagar_updated_at ON public.fin_duplicatas_pagar;
CREATE TRIGGER update_duplicatas_pagar_updated_at BEFORE UPDATE ON public.fin_duplicatas_pagar
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_adiantamentos_updated_at ON public.fin_adiantamentos;
CREATE TRIGGER update_adiantamentos_updated_at BEFORE UPDATE ON public.fin_adiantamentos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creditos_updated_at ON public.fin_creditos;
CREATE TRIGGER update_creditos_updated_at BEFORE UPDATE ON public.fin_creditos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger atualizar valores pendentes
CREATE OR REPLACE FUNCTION atualizar_valor_pendente_receber()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_pendente = NEW.valor_total - NEW.valor_recebido;
  
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

DROP TRIGGER IF EXISTS trigger_atualizar_valor_pendente_receber ON public.fin_duplicatas_receber;
CREATE TRIGGER trigger_atualizar_valor_pendente_receber
BEFORE INSERT OR UPDATE ON public.fin_duplicatas_receber
FOR EACH ROW EXECUTE FUNCTION atualizar_valor_pendente_receber();

CREATE OR REPLACE FUNCTION atualizar_valor_pendente_pagar()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_pendente = NEW.valor_total - NEW.valor_pago - NEW.valor_credito_aplicado;
  
  IF NEW.valor_pendente = 0 THEN
    NEW.status = 'recebida';
    NEW.data_pagamento = CURRENT_DATE;
  ELSIF NEW.valor_pago > 0 AND NEW.valor_pendente > 0 THEN
    NEW.status = 'parcialmente_recebida';
  ELSIF NEW.data_vencimento < CURRENT_DATE AND NEW.valor_pendente > 0 THEN
    NEW.status = 'vencida';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_atualizar_valor_pendente_pagar ON public.fin_duplicatas_pagar;
CREATE TRIGGER trigger_atualizar_valor_pendente_pagar
BEFORE INSERT OR UPDATE ON public.fin_duplicatas_pagar
FOR EACH ROW EXECUTE FUNCTION atualizar_valor_pendente_pagar();

CREATE OR REPLACE FUNCTION atualizar_saldo_adiantamento()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_disponivel = NEW.valor_original - NEW.valor_utilizado;
  
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

DROP TRIGGER IF EXISTS trigger_atualizar_saldo_adiantamento ON public.fin_adiantamentos;
CREATE TRIGGER trigger_atualizar_saldo_adiantamento
BEFORE INSERT OR UPDATE ON public.fin_adiantamentos
FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_adiantamento();

CREATE OR REPLACE FUNCTION atualizar_saldo_credito()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_disponivel = NEW.valor_original - NEW.valor_utilizado;
  
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

DROP TRIGGER IF EXISTS trigger_atualizar_saldo_credito ON public.fin_creditos;
CREATE TRIGGER trigger_atualizar_saldo_credito
BEFORE INSERT OR UPDATE ON public.fin_creditos
FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_credito();

-- =====================================================
-- RLS
-- =====================================================
ALTER TABLE public.fin_condicoes_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_duplicatas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_duplicatas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_adiantamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_creditos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_utilizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_lembretes ENABLE ROW LEVEL SECURITY;
