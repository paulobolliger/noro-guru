-- Migration para corrigir Unique Constraints da tabela de configurações
-- Necessário para o UPSERT funcionar com Multi-tenant

-- 1. Tentar remover constraints antigas que possam conflitar
ALTER TABLE public.noro_configuracoes DROP CONSTRAINT IF EXISTS noro_configuracoes_tipo_chave_key;
ALTER TABLE public.noro_configuracoes DROP CONSTRAINT IF EXISTS noro_configuracoes_tipo_chave_user_id_key;
DROP INDEX IF EXISTS public.idx_noro_configuracoes_unique;
DROP INDEX IF EXISTS public.noro_configuracoes_tipo_chave_idx;

-- 2. Limpar duplicatas antes de criar índice único (segurança)
DELETE FROM public.noro_configuracoes a USING public.noro_configuracoes b
WHERE a.id < b.id
  AND a.tenant_id = b.tenant_id
  AND a.tipo = b.tipo
  AND a.chave = b.chave
  AND (a.user_id = b.user_id OR (a.user_id IS NULL AND b.user_id IS NULL));

-- 3. Criar o Índice Único "Moderno" (PG 15+) que trata NULLs como valores iguais
-- Isso permite que (tenant_id, tipo, chave, NULL) seja único, impedindo duplicatas de config de sistema
-- E permite que o ON CONFLICT (tenant_id, tipo, chave, user_id) funcione corretamente
CREATE UNIQUE INDEX idx_noro_configs_tenant_unique 
ON public.noro_configuracoes (tenant_id, tipo, chave, user_id) 
NULLS NOT DISTINCT;

-- 4. Adicionar constraint baseada no índice (opcional, mas bom para integridade)
ALTER TABLE public.noro_configuracoes 
ADD CONSTRAINT uq_noro_configs_tenant 
UNIQUE USING INDEX idx_noro_configs_tenant_unique;
