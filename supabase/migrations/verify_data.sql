-- Verificar se os dados foram inseridos

-- 1. Verificar tenant
SELECT 'TENANT NORO' as tabela, id, name, slug FROM cp.tenants WHERE slug = 'noro';

-- 2. Verificar categorias
SELECT 'CATEGORIAS' as tabela, COUNT(*) as total FROM fin_categorias WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- 3. Verificar contas bancárias
SELECT 'CONTAS BANCÁRIAS' as tabela, COUNT(*) as total FROM fin_contas_bancarias WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- 4. Verificar receitas
SELECT 'RECEITAS' as tabela, COUNT(*) as total, SUM(valor) as valor_total FROM fin_receitas WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- 5. Verificar despesas
SELECT 'DESPESAS' as tabela, COUNT(*) as total, SUM(valor) as valor_total FROM fin_despesas WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- 6. Verificar comissões
SELECT 'COMISSÕES' as tabela, COUNT(*) as total FROM fin_comissoes WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- 7. Verificar projeções
SELECT 'PROJEÇÕES' as tabela, COUNT(*) as total FROM fin_projecoes WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro');

-- 8. Detalhe das receitas por status
SELECT 'RECEITAS POR STATUS' as tipo, status, COUNT(*) as quantidade, SUM(valor) as total
FROM fin_receitas 
WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
GROUP BY status;

-- 9. Detalhe das despesas por status
SELECT 'DESPESAS POR STATUS' as tipo, status, COUNT(*) as quantidade, SUM(valor) as total
FROM fin_despesas 
WHERE tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
GROUP BY status;
