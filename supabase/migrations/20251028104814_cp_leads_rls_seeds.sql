-- cp leads RLS + seeds (NORO)
BEGIN;

-- Helper: admin check
CREATE OR REPLACE FUNCTION cp.is_admin_of_tenant(p_user uuid, p_tenant uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = p_user AND utr.tenant_id = p_tenant AND utr.role IN ('admin','owner')
  );
$$;

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS cp.leads ENABLE ROW LEVEL SECURITY;
-- Comentado temporariamente - tabelas ainda não existem
-- ALTER TABLE IF EXISTS cp.lead_stages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE IF EXISTS cp.lead_activity ENABLE ROW LEVEL SECURITY;

-- Reset policies (defensive)
DO $$
DECLARE r record;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='cp' AND tablename='leads') THEN
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='cp' AND tablename='leads' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON cp.leads', r.policyname);
    END LOOP;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='cp' AND tablename='lead_stages') THEN
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='cp' AND tablename='lead_stages' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON cp.lead_stages', r.policyname);
    END LOOP;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='cp' AND tablename='lead_activity') THEN
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='cp' AND tablename='lead_activity' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON cp.lead_activity', r.policyname);
    END LOOP;
  END IF;
END$$;

-- Policies: cp.leads
CREATE POLICY p_cp_leads_select_member ON cp.leads
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = leads.tenant_id
  ));

CREATE POLICY p_cp_leads_insert_member ON cp.leads
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM cp.user_tenant_roles utr
      WHERE utr.user_id = auth.uid() AND utr.tenant_id = tenant_id
    )
  );

CREATE POLICY p_cp_leads_update_owner_admin ON cp.leads
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = leads.tenant_id
  ) AND (leads.owner_id = auth.uid() OR cp.is_admin_of_tenant(auth.uid(), leads.tenant_id)))
  WITH CHECK (EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = tenant_id
  ));

-- Policies: cp.lead_stages (comentado até tabela ser criada)
/*
CREATE POLICY p_cp_lead_stages_select_member ON cp.lead_stages
  FOR SELECT TO authenticated
  USING (cp.is_member_of_tenant(auth.uid(), tenant_id));

CREATE POLICY p_cp_lead_stages_modify_admin ON cp.lead_stages
  FOR ALL TO authenticated
  USING (cp.is_admin_of_tenant(auth.uid(), tenant_id))
  WITH CHECK (cp.is_admin_of_tenant(auth.uid(), tenant_id));
*/

-- Policies: cp.lead_activity (comentado até tabela ser criada)
/*
CREATE POLICY p_cp_lead_activity_select_member ON cp.lead_activity
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cp.leads l WHERE l.id = lead_id AND cp.is_member_of_tenant(auth.uid(), l.tenant_id)
  ));

CREATE POLICY p_cp_lead_activity_insert_member ON cp.lead_activity
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM cp.leads l WHERE l.id = lead_id AND cp.is_member_of_tenant(auth.uid(), l.tenant_id)
  ));
*/

-- Seeds (NORO) idempotent
-- 1) modules_registry: add unique(code) and seed basic modules
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='cp' AND table_name='modules_registry' AND constraint_name='modules_registry_code_key'
  ) THEN
    ALTER TABLE cp.modules_registry ADD CONSTRAINT modules_registry_code_key UNIQUE (code);
  END IF;
END$$;

INSERT INTO cp.modules_registry (id, name, code, is_core, is_active, metadata)
SELECT gen_random_uuid(), 'Leads', 'leads', true, true, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM cp.modules_registry WHERE code='leads');

INSERT INTO cp.modules_registry (id, name, code, is_core, is_active, metadata)
SELECT gen_random_uuid(), 'Billing', 'billing', true, true, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM cp.modules_registry WHERE code='billing');

-- 2) tenant_settings (upsert for NORO)
INSERT INTO cp.tenant_settings (tenant_id, logo_url, color_primary, timezone, locale, metadata)
SELECT t.id, NULL, '#5053C4', 'America/Sao_Paulo', 'pt-BR', '{}'::jsonb
FROM cp.tenants t WHERE t.slug='noro'
ON CONFLICT (tenant_id) DO UPDATE SET
  color_primary=EXCLUDED.color_primary,
  timezone=EXCLUDED.timezone,
  locale=EXCLUDED.locale,
  updated_at=now();

-- 3) lead_stages for NORO (comentado até tabela ser criada)
/*
INSERT INTO cp.lead_stages (tenant_id, slug, label, ord, is_won, is_lost)
SELECT t.id, s.slug, s.label, s.ord, s.is_won, s.is_lost
FROM cp.tenants t
CROSS JOIN (VALUES
  ('todo','To Do',10,false,false),
  ('in_progress','In Progress',20,false,false),
  ('qualified','Qualified',30,false,false),
  ('negotiation','Negotiation',40,false,false),
  ('won','Won',90,true,false),
  ('lost','Lost',99,false,true)
) AS s(slug,label,ord,is_won,is_lost)
WHERE t.slug='noro'
ON CONFLICT (tenant_id, slug) DO NOTHING;
*/

COMMIT;
