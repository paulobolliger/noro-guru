-- =====================================================
-- CONTAS A PAGAR/RECEBER AVANÇADO
-- Duplicatas, Adiantamentos, Créditos e Condições
-- =====================================================

-- =====================================================
-- 1. CONDIÇÕES DE PAGAMENTO
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
  
  -- Identificação
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(20),
  tipo fin_tipo_condicao_pagamento NOT NULL,
  
  -- Configuração
  dias_vencimento INTEGER DEFAULT 0,
  referencia_data fin_referencia_data DEFAULT 'emissao',
  numero_parcelas INTEGER DEFAULT 1,
  intervalo_parcelas INTEGER DEFAULT 30, -- dias entre parcelas
  
  -- Descontos/Juros
  percentual_desconto_antecipacao DECIMAL(5,2),
  percentual_juros_atraso DECIMAL(5,2),
  
  -- Observações
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
  
  -- Identificação
  numero_duplicata VARCHAR(50) NOT NULL,
  numero_nota_fiscal VARCHAR(50),
  serie_nota_fiscal VARCHAR(10),
  chave_acesso_nfe VARCHAR(44), -- Chave de acesso da NF-e
  
  -- Relacionamentos
  cliente_id UUID, -- referencia a tabela de clientes
  fornecedor_intermediario_id UUID, -- fornecedor que intermediou
  reserva_id UUID, -- vinculação com reserva
  pedido_id UUID, -- vinculação com pedido
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
  data_referencia DATE, -- data base para cálculo (checkout, embarque, etc)
  
  -- Status e Controle
  status fin_status_duplicata DEFAULT 'aberta',
  dias_atraso INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN status IN ('recebida', 'cancelada') THEN 0
      WHEN CURRENT_DATE > data_vencimento THEN EXTRACT(DAY FROM CURRENT_DATE - data_vencimento)::INTEGER
      ELSE 0
    END
  ) STORED,
  
  -- Dados do Cliente (cache para relatórios)
  cliente_nome VARCHAR(200),
  cliente_documento VARCHAR(20),
  cliente_email VARCHAR(200),
  cliente_telefone VARCHAR(20),
  
  -- Observações e Documentos
  observacoes TEXT,
  condicao_pagamento_texto TEXT, -- descrição textual da condição
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
  
  -- Identificação
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
  valor_credito_aplicado DECIMAL(15,2) DEFAULT 0, -- créditos aplicados
  
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
  
  -- Observações e Documentos
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
  
  -- Observações
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
  
  -- Identificação
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
  
  -- Observações
  observacoes TEXT,
  condicoes_uso TEXT,
  
  -- Auditoria
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. CRÉDITOS E REFUNDS
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
  
  -- Identificação
  numero_credito VARCHAR(50) NOT NULL,
  tipo_credito fin_tipo_credito NOT NULL,
  
  -- Relacionamentos
  fornecedor_id UUID NOT NULL,
  fornecedor_nome VARCHAR(200),
  duplicata_origem_id UUID, -- duplicata que gerou o crédito
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
  
  -- Documentação
  motivo TEXT NOT NULL,
  documento_referencia VARCHAR(100),
  comprovante_url TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. HISTÓRICO DE UTILIZAÇÃO (Adiantamentos e Créditos)
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
  
  -- Observações
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
-- 8. LEMBRETES E NOTIFICAÇÕES
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
  
  -- Configuração do Lembrete
  tipo_lembrete fin_tipo_lembrete NOT NULL,
  dias_antecedencia INTEGER DEFAULT 0,
  canais fin_canal_notificacao[] DEFAULT ARRAY['email']::fin_canal_notificacao[],
  
  -- Destinatários
  destinatario_nome VARCHAR(200),
  destinatario_email VARCHAR(200),
  destinatario_telefone VARCHAR(20),
  
  -- Controle de Envio
  programado_para TIMESTAMPTZ NOT NULL,
  enviado_em TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, enviado, falha
  erro_mensagem TEXT,
  
  -- Conteúdo
  assunto TEXT,
  mensagem TEXT,
  
  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 9. ÍNDICES
-- =====================================================

-- Condições de Pagamento
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

-- Créditos
CREATE INDEX idx_creditos_tenant ON fin_creditos(tenant_id);
CREATE INDEX idx_creditos_fornecedor ON fin_creditos(fornecedor_id);
CREATE INDEX idx_creditos_status ON fin_creditos(status);

-- Utilizações
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

-- View: Saldo de Créditos por Fornecedor
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

-- Trigger para atualizar saldo de créditos
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
-- 13. COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE fin_condicoes_pagamento IS 'Condições de pagamento pré-configuradas';
COMMENT ON TABLE fin_duplicatas_receber IS 'Contas a receber de clientes';
COMMENT ON TABLE fin_duplicatas_pagar IS 'Contas a pagar para fornecedores';
COMMENT ON TABLE fin_parcelas IS 'Parcelas de duplicatas parceladas';
COMMENT ON TABLE fin_adiantamentos IS 'Adiantamentos pagos a fornecedores';
COMMENT ON TABLE fin_creditos IS 'Créditos e refunds recebidos de fornecedores';
COMMENT ON TABLE fin_utilizacoes IS 'Histórico de utilização de adiantamentos e créditos';
COMMENT ON TABLE fin_lembretes IS 'Lembretes e notificações de vencimentos e cobranças';

COMMENT ON VIEW vw_saldo_adiantamentos IS 'Saldo consolidado de adiantamentos por fornecedor';
COMMENT ON VIEW vw_saldo_creditos IS 'Saldo consolidado de créditos por fornecedor';
COMMENT ON VIEW vw_aging_receber IS 'Análise de aging de contas a receber';
COMMENT ON VIEW vw_aging_pagar IS 'Análise de aging de contas a pagar';
COMMENT ON VIEW vw_fluxo_caixa_projetado IS 'Projeção de fluxo de caixa para 90 dias';
COMMENT ON VIEW vw_financeiro_reservas IS 'Status financeiro consolidado por reserva';
