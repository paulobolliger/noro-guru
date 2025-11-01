-- Migration: Dados de Teste - Módulo Financeiro NORO
-- Data: 2025-10-30
-- Descrição: Popular banco com dados realistas para testar o dashboard

BEGIN;

-- Variáveis auxiliares
DO $$
DECLARE
    v_tenant_id uuid;
    v_categoria_viagens uuid;
    v_categoria_vistos uuid;
    v_categoria_fornecedores uuid;
    v_categoria_infra uuid;
    v_conta_bancaria_id uuid;
BEGIN
    -- Obter tenant NORO
    SELECT id INTO v_tenant_id FROM cp.tenants WHERE slug = 'noro' LIMIT 1;
    
    -- LIMPAR DADOS DE TESTE ANTERIORES (se existirem)
    RAISE NOTICE 'Limpando dados de teste anteriores...';
    DELETE FROM fin_comissoes WHERE tenant_id = v_tenant_id;
    DELETE FROM fin_projecoes WHERE tenant_id = v_tenant_id;
    DELETE FROM fin_receitas WHERE tenant_id = v_tenant_id;
    DELETE FROM fin_despesas WHERE tenant_id = v_tenant_id;
    DELETE FROM fin_contas_bancarias WHERE tenant_id = v_tenant_id;
    RAISE NOTICE 'Dados anteriores removidos!';
    
    -- Obter IDs das categorias
    SELECT id INTO v_categoria_viagens FROM fin_categorias WHERE nome = 'Serviços de Viagem' AND tenant_id = v_tenant_id;
    SELECT id INTO v_categoria_vistos FROM fin_categorias WHERE nome = 'Vistos' AND tenant_id = v_tenant_id;
    SELECT id INTO v_categoria_fornecedores FROM fin_categorias WHERE nome = 'Fornecedores' AND tenant_id = v_tenant_id;
    SELECT id INTO v_categoria_infra FROM fin_categorias WHERE nome = 'Infraestrutura' AND tenant_id = v_tenant_id;
    
    -- 1. CRIAR CONTAS BANCÁRIAS
    -- ===========================
    
    -- Conta principal BRL
    INSERT INTO fin_contas_bancarias (tenant_id, marca, nome, tipo, banco, agencia, conta, moeda, saldo_inicial, saldo_atual)
    VALUES (v_tenant_id, 'noro', 'Itaú Empresarial', 'corrente', 'Itaú', '0001', '12345-6', 'BRL', 50000.00, 50000.00)
    RETURNING id INTO v_conta_bancaria_id;
    
    -- Conta USD para operações internacionais
    INSERT INTO fin_contas_bancarias (tenant_id, marca, nome, tipo, banco, moeda, saldo_inicial, saldo_atual)
    VALUES (v_tenant_id, 'noro', 'Wise USD', 'internacional', 'Wise', 'USD', 10000.00, 10000.00);
    
    -- Conta poupança
    INSERT INTO fin_contas_bancarias (tenant_id, marca, nome, tipo, banco, moeda, saldo_inicial, saldo_atual)
    VALUES (v_tenant_id, 'noro', 'Poupança Reserva', 'poupanca', 'Itaú', 'BRL', 20000.00, 20000.00);
    
    -- 2. CRIAR RECEITAS (últimos 6 meses)
    -- =====================================
    
    -- Receitas recorrentes (assinaturas)
    INSERT INTO fin_receitas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_receita, 
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, recorrente, frequencia_recorrencia, conta_bancaria_id
    )
    SELECT 
        v_tenant_id,
        'noro',
        'Assinatura Mensal - Cliente ' || i,
        (SELECT id FROM fin_categorias WHERE nome = 'Assinaturas Recorrentes' AND tenant_id = v_tenant_id),
        (ARRAY[297.00, 497.00, 797.00, 997.00])[floor(random() * 4 + 1)],
        'recorrente',
        'pago',
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval) + INTERVAL '5 days',
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval),
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval) + INTERVAL '7 days',
        'cartao_credito',
        true,
        'mensal',
        v_conta_bancaria_id
    FROM generate_series(0, 5) mes
    CROSS JOIN generate_series(1, 8) i;
    
    -- Receitas de serviços de viagem
    INSERT INTO fin_receitas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_receita,
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, conta_bancaria_id
    ) VALUES
    (v_tenant_id, 'nomade', 'Pacote Europa - Família Silva', v_categoria_viagens, 15800.00, 'servico', 'pago', CURRENT_DATE - 45, CURRENT_DATE - 45, CURRENT_DATE - 43, 'pix', v_conta_bancaria_id),
    (v_tenant_id, 'nomade', 'Consultoria Viagem - João Santos', v_categoria_viagens, 3500.00, 'servico', 'pago', CURRENT_DATE - 30, CURRENT_DATE - 30, CURRENT_DATE - 28, 'transferencia', v_conta_bancaria_id),
    (v_tenant_id, 'nomade', 'Pacote Dubai - Casal Oliveira', v_categoria_viagens, 22500.00, 'servico', 'pago', CURRENT_DATE - 20, CURRENT_DATE - 20, CURRENT_DATE - 18, 'cartao_credito', v_conta_bancaria_id),
    (v_tenant_id, 'safetrip', 'Seguro Viagem Anual - Maria Costa', (SELECT id FROM fin_categorias WHERE nome = 'Seguros' AND tenant_id = v_tenant_id), 1200.00, 'produto', 'pago', CURRENT_DATE - 15, CURRENT_DATE - 15, CURRENT_DATE - 13, 'boleto', v_conta_bancaria_id),
    (v_tenant_id, 'nomade', 'Pacote Ásia - Grupo Empresarial', v_categoria_viagens, 45000.00, 'servico', 'pendente', CURRENT_DATE + 10, CURRENT_DATE + 5, NULL, 'transferencia', v_conta_bancaria_id),
    (v_tenant_id, 'nomade', 'Consultoria Lua de Mel - Ana Paula', v_categoria_viagens, 8500.00, 'servico', 'pendente', CURRENT_DATE + 15, CURRENT_DATE + 10, NULL, 'pix', v_conta_bancaria_id);
    
    -- Receitas de vistos
    INSERT INTO fin_receitas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_receita,
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, possui_comissao, percentual_comissao, conta_bancaria_id
    ) VALUES
    (v_tenant_id, 'vistos', 'Visto EUA - Pedro Martins', v_categoria_vistos, 850.00, 'servico', 'pago', CURRENT_DATE - 25, CURRENT_DATE - 25, CURRENT_DATE - 24, 'pix', true, 15.00, v_conta_bancaria_id),
    (v_tenant_id, 'vistos', 'Visto Canadá - Família Rocha', v_categoria_vistos, 1200.00, 'servico', 'pago', CURRENT_DATE - 18, CURRENT_DATE - 18, CURRENT_DATE - 16, 'transferencia', true, 15.00, v_conta_bancaria_id),
    (v_tenant_id, 'vistos', 'Visto Schengen - Laura Mendes', v_categoria_vistos, 650.00, 'servico', 'pago', CURRENT_DATE - 12, CURRENT_DATE - 12, CURRENT_DATE - 10, 'cartao_credito', true, 15.00, v_conta_bancaria_id),
    (v_tenant_id, 'vistos', 'Visto Austrália - Carlos Lima', v_categoria_vistos, 950.00, 'servico', 'pendente', CURRENT_DATE + 5, CURRENT_DATE, NULL, 'pix', true, 15.00, v_conta_bancaria_id);
    
    -- 3. CRIAR DESPESAS (últimos 6 meses)
    -- =====================================
    
    -- Despesas com fornecedores
    INSERT INTO fin_despesas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_despesa,
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, conta_bancaria_id
    ) VALUES
    (v_tenant_id, 'nomade', 'Aéreo - Grupo Europa', v_categoria_fornecedores, 12000.00, 'fornecedor', 'pago', CURRENT_DATE - 40, CURRENT_DATE - 40, CURRENT_DATE - 38, 'transferencia', v_conta_bancaria_id),
    (v_tenant_id, 'nomade', 'Hotel Dubai - 7 noites', v_categoria_fornecedores, 8500.00, 'fornecedor', 'pago', CURRENT_DATE - 22, CURRENT_DATE - 22, CURRENT_DATE - 20, 'cartao_credito', v_conta_bancaria_id),
    (v_tenant_id, 'vistos', 'Taxa Consular - Diversos', v_categoria_fornecedores, 2500.00, 'fornecedor', 'pago', CURRENT_DATE - 15, CURRENT_DATE - 15, CURRENT_DATE - 14, 'transferencia', v_conta_bancaria_id),
    (v_tenant_id, 'nomade', 'Seguro Grupo - Pacote Ásia', v_categoria_fornecedores, 3200.00, 'fornecedor', 'pendente', CURRENT_DATE + 8, CURRENT_DATE + 5, NULL, 'boleto', v_conta_bancaria_id);
    
    -- Despesas de infraestrutura
    INSERT INTO fin_despesas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_despesa,
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, recorrente, frequencia_recorrencia, centro_custo, conta_bancaria_id
    )
    SELECT 
        v_tenant_id,
        'noro',
        tipo_despesa,
        v_categoria_infra,
        valor,
        'fixa',
        CASE WHEN mes = 0 THEN 'pendente' ELSE 'pago' END,
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval) + INTERVAL '10 days',
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval),
        CASE WHEN mes = 0 THEN NULL ELSE DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval) + INTERVAL '12 days' END,
        'debito_automatico',
        true,
        'mensal',
        'infraestrutura',
        v_conta_bancaria_id
    FROM (VALUES 
        ('Supabase Pro', 125.00),
        ('Vercel Pro', 180.00),
        ('AWS Services', 450.00),
        ('Domain + SSL', 85.00),
        ('Google Workspace', 280.00)
    ) AS despesas(tipo_despesa, valor)
    CROSS JOIN generate_series(0, 5) mes;
    
    -- Despesas de marketing
    INSERT INTO fin_despesas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_despesa,
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, centro_custo, conta_bancaria_id
    ) VALUES
    (v_tenant_id, 'nomade', 'Google Ads - Campanha Europa', (SELECT id FROM fin_categorias WHERE nome = 'Marketing' AND tenant_id = v_tenant_id), 2500.00, 'marketing', 'pago', CURRENT_DATE - 35, CURRENT_DATE - 35, CURRENT_DATE - 33, 'cartao_credito', 'marketing', v_conta_bancaria_id),
    (v_tenant_id, 'vistos', 'Meta Ads - Captação Leads', (SELECT id FROM fin_categorias WHERE nome = 'Marketing' AND tenant_id = v_tenant_id), 1800.00, 'marketing', 'pago', CURRENT_DATE - 20, CURRENT_DATE - 20, CURRENT_DATE - 18, 'cartao_credito', 'marketing', v_conta_bancaria_id),
    (v_tenant_id, 'noro', 'Produção Conteúdo - Agência', (SELECT id FROM fin_categorias WHERE nome = 'Marketing' AND tenant_id = v_tenant_id), 3500.00, 'marketing', 'pendente', CURRENT_DATE + 5, CURRENT_DATE, NULL, 'transferencia', 'marketing', v_conta_bancaria_id);
    
    -- Despesas com salários (últimos 3 meses)
    INSERT INTO fin_despesas (
        tenant_id, marca, descricao, categoria_id, valor, tipo_despesa,
        status, data_vencimento, data_competencia, data_pagamento,
        forma_pagamento, recorrente, frequencia_recorrencia, centro_custo, conta_bancaria_id
    )
    SELECT 
        v_tenant_id,
        'noro',
        'Folha de Pagamento - ' || TO_CHAR(DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval), 'MM/YYYY'),
        (SELECT id FROM fin_categorias WHERE nome = 'Salários' AND tenant_id = v_tenant_id),
        15600.00,
        'salario',
        'pago',
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval) + INTERVAL '5 days',
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval),
        DATE_TRUNC('month', CURRENT_DATE - (mes || ' months')::interval) + INTERVAL '5 days',
        'transferencia',
        true,
        'mensal',
        'administrativo',
        v_conta_bancaria_id
    FROM generate_series(0, 2) mes;
    
    -- 4. CRIAR COMISSÕES (baseadas nas receitas de vistos)
    -- ======================================================
    
    INSERT INTO fin_comissoes (tenant_id, receita_id, percentual, valor_comissao, status, data_vencimento, data_pagamento)
    SELECT 
        v_tenant_id,
        r.id,
        r.percentual_comissao,
        r.valor * (r.percentual_comissao / 100),
        CASE WHEN r.status = 'pago' THEN 'pago' ELSE 'pendente' END,
        r.data_vencimento + INTERVAL '30 days',
        CASE WHEN r.status = 'pago' THEN r.data_pagamento + INTERVAL '30 days' ELSE NULL END
    FROM fin_receitas r
    WHERE r.tenant_id = v_tenant_id 
      AND r.possui_comissao = true;
    
    -- 5. CRIAR PROJEÇÕES (próximos 3 meses)
    -- =======================================
    
    INSERT INTO fin_projecoes (
        tenant_id, marca, mes_referencia, 
        receita_prevista, despesa_prevista,
        receita_realizada, despesa_realizada,
        cenario
    )
    SELECT 
        v_tenant_id,
        marca,
        DATE_TRUNC('month', CURRENT_DATE + (mes || ' months')::interval),
        CASE marca
            WHEN 'nomade' THEN 45000.00
            WHEN 'safetrip' THEN 8000.00
            WHEN 'vistos' THEN 6000.00
            ELSE 12000.00
        END,
        CASE marca
            WHEN 'nomade' THEN 28000.00
            WHEN 'safetrip' THEN 3500.00
            WHEN 'vistos' THEN 2800.00
            ELSE 8500.00
        END,
        0,
        0,
        'realista'
    FROM generate_series(1, 3) mes
    CROSS JOIN (VALUES ('nomade'), ('safetrip'), ('vistos'), ('noro')) AS marcas(marca);
    
    RAISE NOTICE 'Dados de teste criados com sucesso!';
    RAISE NOTICE 'Receitas: ~50 registros';
    RAISE NOTICE 'Despesas: ~40 registros';
    RAISE NOTICE 'Comissões: ~4 registros';
    RAISE NOTICE 'Contas bancárias: 3';
    RAISE NOTICE 'Projeções: 12 registros (3 meses × 4 marcas)';
    
END $$;

COMMIT;
