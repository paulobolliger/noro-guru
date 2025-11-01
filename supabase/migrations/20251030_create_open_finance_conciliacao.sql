-- =====================================================
-- MIGRATION: Open Finance e Conciliação Bancária
-- Descrição: Tabelas para integração Open Finance, 
-- importação de extratos e conciliação automática
-- Data: 30/10/2025
-- =====================================================

-- =====================================================
-- 1. CONTAS BANCÁRIAS
-- =====================================================

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS public.fin_contas_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar colunas se não existirem (safe migration)
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
  
  -- Sincronização
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

-- Adicionar constraints se não existirem
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

-- Índices para contas bancárias (apenas os novos campos Open Finance)
-- Nota: índices básicos (tenant_id, ativo) já existem da migration financeiro_schema.sql
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
-- 2. CONEXÕES OPEN FINANCE (OAuth e Consent)
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
  consent_permissions TEXT[], -- Lista de permissões concedidas
  
  -- Dados da Instituição
  instituicao_id VARCHAR(100) NOT NULL,
  instituicao_nome VARCHAR(255),
  
  -- Status da Conexão
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
  ultimo_erro TEXT,
  ultima_tentativa_refresh TIMESTAMPTZ,
  tentativas_refresh_falhadas INTEGER DEFAULT 0,
  
  -- Metadados
  configuracoes JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para conexões
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
-- 3. TRANSAÇÕES BANCÁRIAS (Extrato)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_transacoes_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  conta_bancaria_id UUID NOT NULL REFERENCES public.fin_contas_bancarias(id) ON DELETE CASCADE,
  
  -- Dados da Transação
  data_transacao DATE NOT NULL,
  data_lancamento DATE, -- Data que entrou no extrato
  tipo_transacao VARCHAR(50) NOT NULL CHECK (tipo_transacao IN ('credito', 'debito', 'transferencia_entrada', 'transferencia_saida', 'pix_entrada', 'pix_saida', 'ted', 'doc', 'boleto', 'tarifa', 'juros', 'outros')),
  
  -- Valores
  valor DECIMAL(15, 2) NOT NULL,
  saldo_apos_transacao DECIMAL(15, 2),
  moeda VARCHAR(3) DEFAULT 'BRL',
  
  -- Descrição e Categorização
  descricao TEXT NOT NULL,
  descricao_original TEXT, -- Descrição do banco sem processamento
  categoria VARCHAR(100), -- Categoria automática ou manual
  
  -- Identificação Externa
  transaction_id VARCHAR(255), -- ID único do banco/Open Finance
  codigo_autenticacao VARCHAR(100),
  
  -- Participantes (quando disponível)
  participante_nome VARCHAR(255), -- Nome do pagador/recebedor
  participante_documento VARCHAR(20), -- CPF/CNPJ
  participante_banco VARCHAR(10),
  participante_agencia VARCHAR(20),
  participante_conta VARCHAR(30),
  
  -- Conciliação
  conciliado BOOLEAN DEFAULT false,
  conciliacao_automatica BOOLEAN DEFAULT false,
  conciliacao_data TIMESTAMPTZ,
  
  -- Origem dos Dados
  origem VARCHAR(50) NOT NULL CHECK (origem IN ('openfinance', 'ofx', 'csv', 'xlsx', 'pdf', 'manual')),
  importacao_id UUID, -- Referência ao lote de importação
  
  -- Metadados
  observacoes TEXT,
  dados_adicionais JSONB DEFAULT '{}', -- Dados extras do Open Finance
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para transações
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
-- 4. CONCILIAÇÕES (Match entre Transação e Duplicata)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_conciliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  transacao_bancaria_id UUID NOT NULL REFERENCES public.fin_transacoes_bancarias(id) ON DELETE CASCADE,
  
  -- Tipo de Conciliação
  tipo_duplicata VARCHAR(50) NOT NULL CHECK (tipo_duplicata IN ('receber', 'pagar')),
  duplicata_receber_id UUID REFERENCES public.fin_duplicatas_receber(id) ON DELETE CASCADE,
  duplicata_pagar_id UUID REFERENCES public.fin_duplicatas_pagar(id) ON DELETE CASCADE,
  
  -- Dados da Conciliação
  valor_conciliado DECIMAL(15, 2) NOT NULL,
  data_conciliacao DATE NOT NULL,
  
  -- Score e Status
  score_matching DECIMAL(5, 2), -- 0-100: confiança do match automático
  tipo_conciliacao VARCHAR(50) NOT NULL DEFAULT 'manual' CHECK (tipo_conciliacao IN ('automatica', 'manual', 'sugerida', 'parcial')),
  status VARCHAR(50) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('pendente', 'confirmada', 'desfeita', 'conflito')),
  
  -- Diferenças (quando houver)
  diferenca_valor DECIMAL(15, 2) DEFAULT 0,
  diferenca_data INTEGER DEFAULT 0, -- Dias de diferença
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

-- Índices para conciliações
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
-- 5. IMPORTAÇÕES DE EXTRATO (Histórico de Uploads)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fin_importacoes_extrato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  conta_bancaria_id UUID NOT NULL REFERENCES public.fin_contas_bancarias(id) ON DELETE CASCADE,
  
  -- Dados da Importação
  tipo_arquivo VARCHAR(50) NOT NULL CHECK (tipo_arquivo IN ('ofx', 'csv', 'xlsx', 'pdf', 'openfinance')),
  nome_arquivo VARCHAR(255),
  tamanho_arquivo INTEGER, -- bytes
  
  -- Processamento
  status VARCHAR(50) NOT NULL DEFAULT 'processando' CHECK (status IN ('processando', 'concluido', 'erro', 'parcial')),
  total_transacoes INTEGER DEFAULT 0,
  transacoes_importadas INTEGER DEFAULT 0,
  transacoes_duplicadas INTEGER DEFAULT 0,
  transacoes_erro INTEGER DEFAULT 0,
  
  -- Período dos Dados
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

-- Índices para importações
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

-- View: Transações Não Conciliadas
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
  AND t.tipo_transacao NOT IN ('tarifa', 'juros') -- Excluir tarifas e juros por padrão
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

-- View: Sugestões de Conciliação Automática
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
    (ABS(tp.valor - dp.valor) / NULLIF(dp.valor, 0) * 50) - -- Penalidade por diferença de valor (max 50)
    (ABS(DATE_PART('day', tp.data_transacao - dp.data_vencimento)) * 5) - -- Penalidade por diferença de data (5 pontos por dia)
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
  AND ABS(tp.valor - dp.valor) < (dp.valor * 0.05) -- Diferença de até 5%
  AND ABS(DATE_PART('day', tp.data_transacao - dp.data_vencimento)) <= 7 -- Diferença de até 7 dias
ORDER BY 
  score_matching DESC;

-- View: Estatísticas de Conciliação
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
-- 7. TRIGGERS PARA CONCILIAÇÃO
-- =====================================================

-- Trigger: Marcar transação como conciliada quando criar conciliação
CREATE OR REPLACE FUNCTION public.fn_marcar_transacao_conciliada()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar flag de conciliação na transação
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

-- Trigger: Desmarcar transação quando desfazer conciliação
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
-- 9. COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.fin_contas_bancarias IS 'Contas bancárias com suporte a Open Finance';
COMMENT ON TABLE public.fin_conexoes_openfinance IS 'Conexões OAuth e consent do Open Finance';
COMMENT ON TABLE public.fin_transacoes_bancarias IS 'Transações bancárias (extrato) de todas as origens';
COMMENT ON TABLE public.fin_conciliacoes IS 'Conciliação entre transações e duplicatas';
COMMENT ON TABLE public.fin_importacoes_extrato IS 'Histórico de importações de extratos';

COMMENT ON VIEW public.vw_transacoes_nao_conciliadas IS 'Transações bancárias ainda não conciliadas';
COMMENT ON VIEW public.vw_saldo_contas_bancarias IS 'Saldo e estatísticas das contas bancárias';
COMMENT ON VIEW public.vw_sugestoes_conciliacao IS 'Sugestões automáticas de conciliação com score';
COMMENT ON VIEW public.vw_estatisticas_conciliacao IS 'Estatísticas de conciliação por conta';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
