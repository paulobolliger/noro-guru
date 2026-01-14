-- Migration para corrigir a Foreign Key de noro_configuracoes
-- O problema: A tabela referenciava 'cp.tenants', mas o sistema roda em cima de 'public.tenants'.
-- Além disso, existem registros órfãos que impedem a criação da nova constraint.

-- ==============================================================================
-- 1. LIMPEZA DE DADOS ÓRFÃOS (CRÍTICO PARA O SUCESSO DA MIGRATION)
-- ==============================================================================

-- Remove configurações que apontam para tenants inexistentes
DELETE FROM public.noro_configuracoes 
WHERE tenant_id NOT IN (SELECT id FROM public.tenants);

-- Remove empresas que apontam para tenants inexistentes
DELETE FROM public.noro_empresa 
WHERE tenant_id NOT IN (SELECT id FROM public.tenants);

-- Remove notificações que apontam para tenants inexistentes
DELETE FROM public.noro_notificacoes 
WHERE tenant_id NOT IN (SELECT id FROM public.tenants);


-- ==============================================================================
-- 2. RECRIAR CONSTRAINTS CORRETAS
-- ==============================================================================

-- 2.1 noro_configuracoes
ALTER TABLE public.noro_configuracoes DROP CONSTRAINT IF EXISTS noro_configuracoes_tenant_fk;

ALTER TABLE public.noro_configuracoes
ADD CONSTRAINT noro_configuracoes_tenant_fk 
FOREIGN KEY (tenant_id) 
REFERENCES public.tenants(id) 
ON DELETE CASCADE;

-- 2.2 noro_empresa
ALTER TABLE public.noro_empresa DROP CONSTRAINT IF EXISTS noro_empresa_tenant_fk;

ALTER TABLE public.noro_empresa
ADD CONSTRAINT noro_empresa_tenant_fk 
FOREIGN KEY (tenant_id) 
REFERENCES public.tenants(id) 
ON DELETE CASCADE;

-- 2.3 noro_notificacoes
ALTER TABLE public.noro_notificacoes DROP CONSTRAINT IF EXISTS noro_notificacoes_tenant_fk;

ALTER TABLE public.noro_notificacoes
ADD CONSTRAINT noro_notificacoes_tenant_fk 
FOREIGN KEY (tenant_id) 
REFERENCES public.tenants(id) 
ON DELETE CASCADE;
