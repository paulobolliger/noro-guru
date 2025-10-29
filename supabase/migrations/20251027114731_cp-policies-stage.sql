-- cp policies stage: abrir leituras essenciais para membros/admins

-- user_tenant_roles: o usuário pode ler seus próprios vínculos
ALTER TABLE cp.user_tenant_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_utr_self ON cp.user_tenant_roles;
CREATE POLICY p_cp_utr_self ON cp.user_tenant_roles FOR SELECT USING (
  user_id = auth.uid() OR cp.is_super_admin(auth.uid())
);

-- tenants: membros podem ver os tenants aos quais pertencem
ALTER TABLE cp.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_tenants_member_read ON cp.tenants;
CREATE POLICY p_cp_tenants_member_read ON cp.tenants FOR SELECT USING (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = tenants.id
  )
);

-- api_keys: membros leem; owners/admins criam/excluem
ALTER TABLE cp.api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_api_keys_member_read ON cp.api_keys;
CREATE POLICY p_cp_api_keys_member_read ON cp.api_keys FOR SELECT USING (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = api_keys.tenant_id
  )
);

DROP POLICY IF EXISTS p_cp_api_keys_admin_write ON cp.api_keys;
CREATE POLICY p_cp_api_keys_admin_write ON cp.api_keys FOR ALL USING (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = api_keys.tenant_id AND utr.role IN ('owner','admin')
  )
) WITH CHECK (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = api_keys.tenant_id AND utr.role IN ('owner','admin')
  )
);
