-- Policies para cp.domains e cp.webhooks (membros leem, admins escrevem)

ALTER TABLE cp.domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_domains_member_read ON cp.domains;
CREATE POLICY p_cp_domains_member_read ON cp.domains FOR SELECT USING (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = domains.tenant_id
  )
);

DROP POLICY IF EXISTS p_cp_domains_admin_write ON cp.domains;
CREATE POLICY p_cp_domains_admin_write ON cp.domains FOR ALL USING (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = domains.tenant_id AND utr.role IN ('owner','admin')
  )
) WITH CHECK (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = domains.tenant_id AND utr.role IN ('owner','admin')
  )
);

-- Relaxar leitura de webhooks para membros do tenant
ALTER TABLE cp.webhooks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cp_webhooks_member_read ON cp.webhooks;
CREATE POLICY p_cp_webhooks_member_read ON cp.webhooks FOR SELECT USING (
  cp.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = webhooks.tenant_id
  )
);
