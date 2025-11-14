-- Migration: Funções de contexto de sessão para tenant
-- Data: 2025-11-14
-- Descrição: Funções para gerenciar tenant_id no contexto da sessão PostgreSQL

-- 1. Função para definir tenant_id no contexto da sessão
CREATE OR REPLACE FUNCTION public.set_tenant_context(p_tenant_id uuid)
RETURNS void AS $$
BEGIN
  -- Set config com escopo de transação (false = dura toda a sessão)
  PERFORM set_config('app.current_tenant_id', p_tenant_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.set_tenant_context(uuid) IS
  'Define o tenant_id no contexto da sessão PostgreSQL para uso em RLS policies';

-- 2. Função para obter tenant_id do contexto da sessão
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_current_tenant_id() IS
  'Retorna o tenant_id do contexto da sessão, ou NULL se não definido';

-- 3. Função helper para verificar se usuário pertence ao tenant
CREATE OR REPLACE FUNCTION cp.user_belongs_to_tenant(
  p_user_id uuid,
  p_tenant_id uuid
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM cp.user_tenant_roles
    WHERE user_id = p_user_id
    AND tenant_id = p_tenant_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION cp.user_belongs_to_tenant(uuid, uuid) IS
  'Verifica se um usuário tem acesso a um tenant específico';

-- 4. Função para obter role do usuário em um tenant
CREATE OR REPLACE FUNCTION cp.get_user_role_in_tenant(
  p_user_id uuid,
  p_tenant_id uuid
)
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM cp.user_tenant_roles
  WHERE user_id = p_user_id
  AND tenant_id = p_tenant_id
  LIMIT 1;

  RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION cp.get_user_role_in_tenant(uuid, uuid) IS
  'Retorna a role do usuário em um tenant específico, ou "none" se não tiver acesso';

-- 5. Função para listar tenants do usuário
CREATE OR REPLACE FUNCTION cp.get_user_tenants(p_user_id uuid)
RETURNS TABLE (
  tenant_id uuid,
  tenant_name text,
  tenant_slug text,
  user_role text,
  is_active boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id as tenant_id,
    t.name as tenant_name,
    t.slug as tenant_slug,
    utr.role as user_role,
    (t.status = 'active') as is_active
  FROM cp.user_tenant_roles utr
  JOIN cp.tenants t ON t.id = utr.tenant_id
  WHERE utr.user_id = p_user_id
  ORDER BY t.name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION cp.get_user_tenants(uuid) IS
  'Lista todos os tenants aos quais o usuário tem acesso';

-- 6. Grants necessários
GRANT EXECUTE ON FUNCTION public.set_tenant_context(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_tenant_id() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION cp.user_belongs_to_tenant(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION cp.get_user_role_in_tenant(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION cp.get_user_tenants(uuid) TO authenticated;
