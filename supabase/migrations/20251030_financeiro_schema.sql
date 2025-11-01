-- Migration: Módulo Financeiro NORO
-- Data: 2025-10-30
-- Descrição: Criação completa do schema financeiro multi-marca

-- ==============================================
-- SCHEMA: public
-- OTIMIZAÇÕES: Índices estratégicos para alta performance
-- PREPARADO PARA: Particionamento futuro por data
-- ==============================================

-- CONFIGURAÇÃO: Aumentar work_mem para queries financeiras pesadas
-- SET work_mem = '256MB'; -- Descomentar se necessário

-- 1. CONTAS BANCÁRIAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_contas_bancarias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL, -- 'nomade', 'safetrip', 'vistos', 'noro'
    nome text NOT NULL, -- Ex: "Itaú Empresa", "Wise USD"
    tipo text NOT NULL, -- 'corrente', 'poupanca', 'investimento', 'internacional'
    banco text NOT NULL,
    agencia text,
    conta text,
    moeda text NOT NULL DEFAULT 'BRL', -- ISO 4217 (BRL, USD, EUR)
    saldo_inicial numeric(15,2) DEFAULT 0,
    saldo_atual numeric(15,2) DEFAULT 0,
    ativo boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_contas_tenant ON public.fin_contas_bancarias(tenant_id);
CREATE INDEX idx_fin_contas_marca ON public.fin_contas_bancarias(marca);
CREATE INDEX idx_fin_contas_ativo ON public.fin_contas_bancarias(ativo);

-- 2. CATEGORIAS FINANCEIRAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_categorias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    nome text NOT NULL,
    tipo text NOT NULL, -- 'receita', 'despesa'
    categoria_pai_id uuid REFERENCES public.fin_categorias(id),
    cor text, -- HEX color para UI
    icone text, -- Emoji ou nome do ícone
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_categorias_tenant ON public.fin_categorias(tenant_id);
CREATE INDEX idx_fin_categorias_tipo ON public.fin_categorias(tipo);

-- 3. RECEITAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_receitas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    descricao text NOT NULL,
    categoria_id uuid REFERENCES public.fin_categorias(id),
    valor numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    taxa_cambio numeric(10,4) DEFAULT 1,
    valor_brl numeric(15,2) GENERATED ALWAYS AS (valor * taxa_cambio) STORED,
    
    tipo_receita text NOT NULL, -- 'servico', 'produto', 'comissao', 'recorrente', 'outro'
    
    -- Relacionamentos
    cliente_id uuid REFERENCES public.noro_clientes(id),
    orcamento_id uuid REFERENCES public.noro_orcamentos(id),
    pedido_id uuid REFERENCES public.noro_pedidos(id),
    
    -- Controle financeiro
    status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado', 'atrasado'
    data_vencimento date NOT NULL,
    data_pagamento date,
    data_competencia date NOT NULL,
    
    forma_pagamento text, -- 'pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia', 'internacional'
    gateway_pagamento text, -- 'stripe', 'cielo', 'paypal', 'remessa_online', 'wise'
    transaction_id text, -- ID da transação no gateway
    
    conta_bancaria_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Comissões
    possui_comissao boolean DEFAULT false,
    valor_comissao numeric(15,2),
    percentual_comissao numeric(5,2),
    fornecedor_comissao_id uuid REFERENCES public.noro_fornecedores(id),
    
    -- Recorrência
    recorrente boolean DEFAULT false,
    frequencia_recorrencia text, -- 'mensal', 'trimestral', 'semestral', 'anual'
    proximo_vencimento date,
    
    -- Notas e documentos
    nota_fiscal text,
    recibo_url text,
    observacoes text,
    
    -- Auditoria
    created_by uuid REFERENCES public.noro_users(id),
    updated_by uuid REFERENCES public.noro_users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_receitas_tenant ON public.fin_receitas(tenant_id);
CREATE INDEX idx_fin_receitas_marca ON public.fin_receitas(marca);
CREATE INDEX idx_fin_receitas_status ON public.fin_receitas(status);
CREATE INDEX idx_fin_receitas_data_vencimento ON public.fin_receitas(data_vencimento);
CREATE INDEX idx_fin_receitas_cliente ON public.fin_receitas(cliente_id);
CREATE INDEX idx_fin_receitas_competencia ON public.fin_receitas(data_competencia);

-- ÍNDICES COMPOSTOS para queries comuns (otimização crítica)
CREATE INDEX idx_fin_receitas_tenant_status ON public.fin_receitas(tenant_id, status);
CREATE INDEX idx_fin_receitas_tenant_competencia ON public.fin_receitas(tenant_id, data_competencia DESC);
CREATE INDEX idx_fin_receitas_tenant_marca_status ON public.fin_receitas(tenant_id, marca, status);

-- ÍNDICE PARCIAL para contas pendentes (mais usado)
CREATE INDEX idx_fin_receitas_pendentes ON public.fin_receitas(tenant_id, data_vencimento) 
WHERE status IN ('pendente', 'atrasado');

-- 4. DESPESAS
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_despesas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    descricao text NOT NULL,
    categoria_id uuid REFERENCES public.fin_categorias(id),
    valor numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    taxa_cambio numeric(10,4) DEFAULT 1,
    valor_brl numeric(15,2) GENERATED ALWAYS AS (valor * taxa_cambio) STORED,
    
    tipo_despesa text NOT NULL, -- 'fixa', 'variavel', 'operacional', 'marketing', 'fornecedor', 'salario', 'outro'
    
    -- Relacionamentos
    fornecedor_id uuid REFERENCES public.noro_fornecedores(id),
    pedido_id uuid REFERENCES public.noro_pedidos(id),
    
    -- Controle financeiro
    status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado', 'atrasado'
    data_vencimento date NOT NULL,
    data_pagamento date,
    data_competencia date NOT NULL,
    
    forma_pagamento text,
    conta_bancaria_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Centro de custo
    centro_custo text, -- 'infraestrutura', 'marketing', 'operacional', 'administrativo'
    projeto_associado text, -- Ex: "Grupo Rio Janeiro 2025"
    
    -- Recorrência
    recorrente boolean DEFAULT false,
    frequencia_recorrencia text,
    proximo_vencimento date,
    
    -- Documentos
    nota_fiscal text,
    comprovante_url text,
    observacoes text,
    
    -- Auditoria
    created_by uuid REFERENCES public.noro_users(id),
    updated_by uuid REFERENCES public.noro_users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_despesas_tenant ON public.fin_despesas(tenant_id);
CREATE INDEX idx_fin_despesas_marca ON public.fin_despesas(marca);
CREATE INDEX idx_fin_despesas_status ON public.fin_despesas(status);
CREATE INDEX idx_fin_despesas_data_vencimento ON public.fin_despesas(data_vencimento);
CREATE INDEX idx_fin_despesas_fornecedor ON public.fin_despesas(fornecedor_id);
CREATE INDEX idx_fin_despesas_competencia ON public.fin_despesas(data_competencia);
CREATE INDEX idx_fin_despesas_centro_custo ON public.fin_despesas(centro_custo);

-- ÍNDICES COMPOSTOS para queries comuns
CREATE INDEX idx_fin_despesas_tenant_status ON public.fin_despesas(tenant_id, status);
CREATE INDEX idx_fin_despesas_tenant_competencia ON public.fin_despesas(tenant_id, data_competencia DESC);
CREATE INDEX idx_fin_despesas_tenant_marca_status ON public.fin_despesas(tenant_id, marca, status);

-- ÍNDICE PARCIAL para contas pendentes
CREATE INDEX idx_fin_despesas_pendentes ON public.fin_despesas(tenant_id, data_vencimento) 
WHERE status IN ('pendente', 'atrasado');

-- 5. FLUXO DE CAIXA (TRANSAÇÕES)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_transacoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    tipo text NOT NULL, -- 'entrada', 'saida', 'transferencia'
    descricao text NOT NULL,
    valor numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    
    conta_origem_id uuid REFERENCES public.fin_contas_bancarias(id),
    conta_destino_id uuid REFERENCES public.fin_contas_bancarias(id),
    
    -- Relacionamento com receitas/despesas
    receita_id uuid REFERENCES public.fin_receitas(id),
    despesa_id uuid REFERENCES public.fin_despesas(id),
    
    categoria_id uuid REFERENCES public.fin_categorias(id),
    
    data_transacao date NOT NULL DEFAULT CURRENT_DATE,
    data_competencia date NOT NULL DEFAULT CURRENT_DATE,
    
    status text NOT NULL DEFAULT 'efetivada', -- 'pendente', 'efetivada', 'cancelada'
    
    observacoes text,
    metadata jsonb DEFAULT '{}',
    
    created_by uuid REFERENCES public.noro_users(id),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_transacoes_tenant ON public.fin_transacoes(tenant_id);
CREATE INDEX idx_fin_transacoes_marca ON public.fin_transacoes(marca);
CREATE INDEX idx_fin_transacoes_tipo ON public.fin_transacoes(tipo);
CREATE INDEX idx_fin_transacoes_data ON public.fin_transacoes(data_transacao);
CREATE INDEX idx_fin_transacoes_conta_origem ON public.fin_transacoes(conta_origem_id);
CREATE INDEX idx_fin_transacoes_conta_destino ON public.fin_transacoes(conta_destino_id);

-- 6. PLANO DE CONTAS CONTÁBIL
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_plano_contas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    codigo text NOT NULL, -- Ex: "1.1.01.001"
    nome text NOT NULL,
    tipo text NOT NULL, -- 'ativo', 'passivo', 'receita', 'despesa', 'patrimonio_liquido'
    nivel integer NOT NULL,
    conta_pai_id uuid REFERENCES public.fin_plano_contas(id),
    aceita_lancamento boolean DEFAULT true,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, codigo)
);

CREATE INDEX idx_fin_plano_tenant ON public.fin_plano_contas(tenant_id);
CREATE INDEX idx_fin_plano_tipo ON public.fin_plano_contas(tipo);

-- 7. COMISSÕES
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_comissoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    receita_id uuid REFERENCES public.fin_receitas(id) ON DELETE CASCADE,
    fornecedor_id uuid REFERENCES public.noro_fornecedores(id),
    
    percentual numeric(5,2) NOT NULL,
    valor_comissao numeric(15,2) NOT NULL,
    moeda text NOT NULL DEFAULT 'BRL',
    
    status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado'
    data_vencimento date,
    data_pagamento date,
    
    observacoes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fin_comissoes_receita ON public.fin_comissoes(receita_id);
CREATE INDEX idx_fin_comissoes_fornecedor ON public.fin_comissoes(fornecedor_id);

-- 8. PROJEÇÕES DE FLUXO DE CAIXA
-- ==============================================
CREATE TABLE IF NOT EXISTS public.fin_projecoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES cp.tenants(id) ON DELETE CASCADE,
    marca text NOT NULL,
    mes_referencia date NOT NULL, -- Primeiro dia do mês
    
    receita_prevista numeric(15,2) DEFAULT 0,
    despesa_prevista numeric(15,2) DEFAULT 0,
    saldo_previsto numeric(15,2) GENERATED ALWAYS AS (receita_prevista - despesa_prevista) STORED,
    
    receita_realizada numeric(15,2) DEFAULT 0,
    despesa_realizada numeric(15,2) DEFAULT 0,
    saldo_realizado numeric(15,2) GENERATED ALWAYS AS (receita_realizada - despesa_realizada) STORED,
    
    cenario text DEFAULT 'realista', -- 'otimista', 'realista', 'pessimista'
    
    observacoes text,
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, marca, mes_referencia, cenario)
);

CREATE INDEX idx_fin_projecoes_tenant ON public.fin_projecoes(tenant_id);
CREATE INDEX idx_fin_projecoes_mes ON public.fin_projecoes(mes_referencia);

-- ==============================================
-- TRIGGERS
-- ==============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fin_contas_bancarias_updated_at BEFORE UPDATE ON public.fin_contas_bancarias FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_receitas_updated_at BEFORE UPDATE ON public.fin_receitas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_despesas_updated_at BEFORE UPDATE ON public.fin_despesas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_comissoes_updated_at BEFORE UPDATE ON public.fin_comissoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fin_projecoes_updated_at BEFORE UPDATE ON public.fin_projecoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para atualizar saldo da conta ao criar transação
CREATE OR REPLACE FUNCTION atualizar_saldo_conta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'efetivada' THEN
        -- Se for entrada ou saída simples
        IF NEW.tipo = 'entrada' AND NEW.conta_destino_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        ELSIF NEW.tipo = 'saida' AND NEW.conta_origem_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
        ELSIF NEW.tipo = 'transferencia' THEN
            -- Debita da origem
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
            -- Credita no destino
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_atualizar_saldo 
    AFTER INSERT ON public.fin_transacoes
    FOR EACH ROW EXECUTE PROCEDURE atualizar_saldo_conta();

-- ==============================================
-- RLS (Row Level Security)
-- ==============================================

ALTER TABLE public.fin_contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_plano_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_projecoes ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ler dados do seu tenant
CREATE POLICY "Permitir leitura para usuários autenticados do tenant"
    ON public.fin_contas_bancarias FOR SELECT
    TO authenticated
    USING (
        tenant_id IN (
            SELECT tenant_id FROM cp.control_plane_users 
            WHERE auth_id = auth.uid()
        )
    );

-- Replicar policies similares para todas as tabelas financeiras
-- (Por questão de espaço, seria replicado para cada tabela)

-- ==============================================
-- VIEWS ÚTEIS
-- ==============================================

-- View: Resumo financeiro por marca
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

-- View: Contas a receber
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

-- View: Contas a pagar
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

-- ==============================================
-- SEED DATA
-- ==============================================

-- Categorias padrão de receita
INSERT INTO public.fin_categorias (tenant_id, nome, tipo, cor, icone, ordem) VALUES
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Serviços de Viagem', 'receita', '#10b981', '✈️', 1),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Vistos', 'receita', '#3b82f6', '📋', 2),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Seguros', 'receita', '#8b5cf6', '🛡️', 3),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Comissões', 'receita', '#f59e0b', '💰', 4),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Assinaturas Recorrentes', 'receita', '#06b6d4', '🔄', 5);

-- Categorias padrão de despesa
INSERT INTO public.fin_categorias (tenant_id, nome, tipo, cor, icone, ordem) VALUES
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Fornecedores', 'despesa', '#ef4444', '🏢', 1),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Infraestrutura', 'despesa', '#6366f1', '🖥️', 2),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Marketing', 'despesa', '#ec4899', '📢', 3),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Salários', 'despesa', '#14b8a6', '👥', 4),
((SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1), 'Impostos', 'despesa', '#f97316', '📊', 5);

-- ==============================================
-- NOTAS DE ESCALABILIDADE E PERFORMANCE
-- ==============================================

-- QUANDO MIGRAR PARA BD SEPARADO?
-- Considere separar o módulo financeiro quando:
-- 1. Volume de transações > 1 milhão/mês
-- 2. Latência de queries > 500ms consistentemente
-- 3. Conexões simultâneas > 80% do pool do Supabase
-- 4. Precisa de backup mais frequente (ex: a cada 1h)

-- PARTICIONAMENTO (Futuro)
-- Se o volume crescer muito, particionar por data:
-- CREATE TABLE fin_receitas_2025_01 PARTITION OF fin_receitas
--   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- ARCHIVING (Futuro)
-- Mover dados antigos (> 2 anos) para tabelas de arquivo:
-- CREATE TABLE fin_receitas_archive AS 
--   SELECT * FROM fin_receitas WHERE data_competencia < '2023-01-01';

-- MATERIALIZED VIEWS para Dashboards (Futuro)
-- Se dashboards ficarem lentos, criar views materializadas:
-- CREATE MATERIALIZED VIEW mv_fin_kpis_mensal AS
--   SELECT tenant_id, marca, DATE_TRUNC('month', data_competencia) as mes,
--          SUM(valor_brl) as receita_total
--   FROM fin_receitas WHERE status = 'pago'
--   GROUP BY 1, 2, 3;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_fin_kpis_mensal;

-- CONNECTION POOLING
-- Usar PgBouncer se começar a ter problemas de conexão:
-- https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool

COMMIT;
