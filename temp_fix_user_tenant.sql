-- Criar tenant de teste se não existir
INSERT INTO cp.tenants (name, slug, created_at, updated_at)
VALUES ('Empresa Teste', 'empresa-teste', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- Inserir associação do usuário com tenant (substitua <tenant_id> pelo ID retornado acima)
-- Usuário: d368aedd-d0c7-49fc-9bd9-09a36cd9af2d
-- Role: admin

-- Primeiro, vamos ver se já existe algum tenant:
SELECT id, name, slug FROM cp.tenants LIMIT 5;

-- Depois associar o usuário a um tenant existente ou ao novo:
-- DESCOMENTE E SUBSTITUA <tenant_id> após verificar os tenants:
-- INSERT INTO cp.user_tenant_roles (user_id, tenant_id, role, created_at, updated_at)
-- VALUES ('d368aedd-d0c7-49fc-9bd9-09a36cd9af2d', '<tenant_id>', 'admin', NOW(), NOW())
-- ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- Verificar associações do usuário:
SELECT 
  utr.user_id,
  utr.tenant_id,
  utr.role,
  t.name as tenant_name,
  t.slug as tenant_slug
FROM cp.user_tenant_roles utr
JOIN cp.tenants t ON t.id = utr.tenant_id
WHERE utr.user_id = 'd368aedd-d0c7-49fc-9bd9-09a36cd9af2d';
