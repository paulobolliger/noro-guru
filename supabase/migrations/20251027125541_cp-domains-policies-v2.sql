-- Simplificar policies de cp.domains e cp.api_keys para membership-only

-- cp.domains
ALTER TABLE cp.domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_domains_member_read ON cp.domains;
CREATE POLICY p_cp_domains_member_read ON cp.domains FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = domains.tenant_id
  )
);

DROP POLICY IF EXISTS p_cp_domains_admin_write ON cp.domains;
CREATE POLICY p_cp_domains_admin_write ON cp.domains FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = domains.tenant_id AND utr.role IN ('owner','admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = domains.tenant_id AND utr.role IN ('owner','admin')
  )
);

-- cp.api_keys
ALTER TABLE cp.api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_api_keys_member_read ON cp.api_keys;
CREATE POLICY p_cp_api_keys_member_read ON cp.api_keys FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = api_keys.tenant_id
  )
);

DROP POLICY IF EXISTS p_cp_api_keys_admin_write ON cp.api_keys;
CREATE POLICY p_cp_api_keys_admin_write ON cp.api_keys FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = api_keys.tenant_id AND utr.role IN ('owner','admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = api_keys.tenant_id AND utr.role IN ('owner','admin')
  )
);
