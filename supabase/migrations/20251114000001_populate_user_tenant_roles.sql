-- Migration: Popular user_tenant_roles e criar trigger de auto-atribuição
-- Data: 2025-11-14
-- Descrição: Atribui todos os usuários existentes ao tenant 'noro' e cria trigger para novos usuários

-- 1. Popular tabela com usuários existentes
-- Atribui todos os usuários ao tenant 'noro' com role 'admin'
INSERT INTO cp.user_tenant_roles (user_id, tenant_id, role)
SELECT
  u.id as user_id,
  (SELECT id FROM cp.tenants WHERE slug = 'noro' LIMIT 1) as tenant_id,
  'admin' as role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM cp.user_tenant_roles utr
  WHERE utr.user_id = u.id
)
ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- 2. Criar função para auto-atribuir novos usuários a um tenant
CREATE OR REPLACE FUNCTION cp.auto_assign_user_to_default_tenant()
RETURNS TRIGGER AS $$
DECLARE
  default_tenant_id uuid;
BEGIN
  -- Obter tenant padrão 'noro'
  -- Em produção, isso pode vir de um contexto de signup
  SELECT id INTO default_tenant_id
  FROM cp.tenants
  WHERE slug = 'noro'
  LIMIT 1;

  -- Se tenant padrão existe, atribuir usuário
  IF default_tenant_id IS NOT NULL THEN
    INSERT INTO cp.user_tenant_roles (user_id, tenant_id, role)
    VALUES (NEW.id, default_tenant_id, 'viewer')
    ON CONFLICT (user_id, tenant_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION cp.auto_assign_user_to_default_tenant();

-- 4. Comentários
COMMENT ON FUNCTION cp.auto_assign_user_to_default_tenant() IS
  'Atribui automaticamente novos usuários ao tenant padrão (noro) com role viewer';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
  'Trigger que executa auto_assign_user_to_default_tenant após criação de usuário';
