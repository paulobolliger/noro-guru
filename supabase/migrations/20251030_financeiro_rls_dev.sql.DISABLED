-- Políticas RLS temporárias para desenvolvimento
-- IMPORTANTE: Substituir por políticas adequadas em produção

BEGIN;

-- Desabilitar RLS temporariamente para permitir acesso aos dados
-- OU criar políticas permissivas para desenvolvimento

-- Opção 1: Desabilitar RLS (NÃO RECOMENDADO EM PRODUÇÃO)
-- ALTER TABLE public.fin_receitas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fin_despesas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fin_contas_bancarias DISABLE ROW LEVEL SECURITY;

-- Opção 2: Criar políticas permissivas (MELHOR)

-- ===========================
-- POLÍTICAS PARA FIN_RECEITAS
-- ===========================

-- SELECT (já existe)
DROP POLICY IF EXISTS "Allow all SELECT on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all SELECT on fin_receitas for development"
ON public.fin_receitas
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all INSERT on fin_receitas for development"
ON public.fin_receitas
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all UPDATE on fin_receitas for development"
ON public.fin_receitas
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_receitas for development" ON public.fin_receitas;
CREATE POLICY "Allow all DELETE on fin_receitas for development"
ON public.fin_receitas
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÍTICAS PARA FIN_DESPESAS
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all SELECT on fin_despesas for development"
ON public.fin_despesas
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all INSERT on fin_despesas for development"
ON public.fin_despesas
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all UPDATE on fin_despesas for development"
ON public.fin_despesas
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_despesas for development" ON public.fin_despesas;
CREATE POLICY "Allow all DELETE on fin_despesas for development"
ON public.fin_despesas
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÍTICAS PARA FIN_CONTAS_BANCARIAS
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all SELECT on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all INSERT on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all UPDATE on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_contas_bancarias for development" ON public.fin_contas_bancarias;
CREATE POLICY "Allow all DELETE on fin_contas_bancarias for development"
ON public.fin_contas_bancarias
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÍTICAS PARA FIN_CATEGORIAS
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all SELECT on fin_categorias for development"
ON public.fin_categorias
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all INSERT on fin_categorias for development"
ON public.fin_categorias
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all UPDATE on fin_categorias for development"
ON public.fin_categorias
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_categorias for development" ON public.fin_categorias;
CREATE POLICY "Allow all DELETE on fin_categorias for development"
ON public.fin_categorias
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÍTICAS PARA FIN_COMISSOES
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all SELECT on fin_comissoes for development"
ON public.fin_comissoes
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all INSERT on fin_comissoes for development"
ON public.fin_comissoes
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all UPDATE on fin_comissoes for development"
ON public.fin_comissoes
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_comissoes for development" ON public.fin_comissoes;
CREATE POLICY "Allow all DELETE on fin_comissoes for development"
ON public.fin_comissoes
FOR DELETE
TO authenticated, anon
USING (true);

-- ===========================
-- POLÍTICAS PARA FIN_PROJECOES
-- ===========================

-- SELECT
DROP POLICY IF EXISTS "Allow all SELECT on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all SELECT on fin_projecoes for development"
ON public.fin_projecoes
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT
DROP POLICY IF EXISTS "Allow all INSERT on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all INSERT on fin_projecoes for development"
ON public.fin_projecoes
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- UPDATE
DROP POLICY IF EXISTS "Allow all UPDATE on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all UPDATE on fin_projecoes for development"
ON public.fin_projecoes
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- DELETE
DROP POLICY IF EXISTS "Allow all DELETE on fin_projecoes for development" ON public.fin_projecoes;
CREATE POLICY "Allow all DELETE on fin_projecoes for development"
ON public.fin_projecoes
FOR DELETE
TO authenticated, anon
USING (true);

COMMIT;

-- Log
DO $$
BEGIN
    RAISE NOTICE '✅ Políticas RLS COMPLETAS (CRUD) de desenvolvimento aplicadas!';
    RAISE NOTICE 'Agora você pode: SELECT, INSERT, UPDATE e DELETE em todas as tabelas';
    RAISE NOTICE 'ATENÇÃO: Estas políticas permitem acesso irrestrito aos dados.';
    RAISE NOTICE 'Substitua por políticas adequadas antes de ir para produção!';
END $$;
