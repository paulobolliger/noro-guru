-- Leads ingestion and organization migration
-- Safe, idempotent-ish (IF NOT EXISTS) changes for cp.leads and support tables.

-- 1) Ensure schema cp exists
CREATE SCHEMA IF NOT EXISTS cp;

-- 2) Extend cp.leads with capture/utm fields
ALTER TABLE IF EXISTS cp.leads
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS capture_channel text DEFAULT 'web',
  ADD COLUMN IF NOT EXISTS consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS page_url text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- 3) Indices to speed up common filters
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relkind='i' AND c.relname='idx_leads_tenant_stage' AND n.nspname='cp'
  ) THEN
    EXECUTE 'CREATE INDEX idx_leads_tenant_stage ON cp.leads (tenant_id, stage)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relkind='i' AND c.relname='idx_leads_tenant_owner' AND n.nspname='cp'
  ) THEN
    EXECUTE 'CREATE INDEX idx_leads_tenant_owner ON cp.leads (tenant_id, owner_id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relkind='i' AND c.relname='idx_leads_tenant_created' AND n.nspname='cp'
  ) THEN
    EXECUTE 'CREATE INDEX idx_leads_tenant_created ON cp.leads (tenant_id, created_at)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relkind='i' AND c.relname='idx_leads_tenant_email' AND n.nspname='cp'
  ) THEN
    EXECUTE 'CREATE INDEX idx_leads_tenant_email ON cp.leads (tenant_id, email)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relkind='i' AND c.relname='idx_leads_tags_gin' AND n.nspname='cp'
  ) THEN
    EXECUTE 'CREATE INDEX idx_leads_tags_gin ON cp.leads USING GIN (tags)';
  END IF;
END$$;

-- 4) Support tables
CREATE TABLE IF NOT EXISTS cp.lead_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  slug text NOT NULL,
  label text NOT NULL,
  ord smallint NOT NULL DEFAULT 0,
  is_won boolean NOT NULL DEFAULT false,
  is_lost boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS cp.lead_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL,
  actor_id uuid,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5) FKs if cp.leads exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='cp' AND table_name='leads') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.constraint_column_usage WHERE table_schema='cp' AND table_name='lead_activity' AND constraint_name='lead_activity_lead_id_fkey'
    ) THEN
      ALTER TABLE cp.lead_activity
        ADD CONSTRAINT lead_activity_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES cp.leads (id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

-- 6) Updated_at trigger and default owner on insert
CREATE OR REPLACE FUNCTION cp.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='cp' AND table_name='leads' AND column_name='updated_at') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE t.tgname='trg_cp_leads_set_updated_at' AND n.nspname='cp' AND c.relname='leads'
    ) THEN
      EXECUTE 'CREATE TRIGGER trg_cp_leads_set_updated_at BEFORE UPDATE ON cp.leads FOR EACH ROW EXECUTE FUNCTION cp.tg_set_updated_at()';
    END IF;
  END IF;
END$$;

CREATE OR REPLACE FUNCTION cp.tg_set_owner_default()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE t.tgname='trg_cp_leads_set_owner_default' AND n.nspname='cp' AND c.relname='leads'
  ) THEN
    EXECUTE 'CREATE TRIGGER trg_cp_leads_set_owner_default BEFORE INSERT ON cp.leads FOR EACH ROW EXECUTE FUNCTION cp.tg_set_owner_default()';
  END IF;
END$$;

-- 7) RLS policies (safe defaults)
ALTER TABLE cp.lead_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.lead_activity ENABLE ROW LEVEL SECURITY;
-- Keep cp.leads policies as-is (already configured em projeto). Add for new tables:

-- Helper: membership check
CREATE OR REPLACE FUNCTION cp.is_member_of_tenant(p_user uuid, p_tenant uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = p_user AND utr.tenant_id = p_tenant
  );
$$;

-- lead_stages: select/insert/update restricted to tenant members
DROP POLICY IF EXISTS p_lead_stages_select ON cp.lead_stages;
CREATE POLICY p_lead_stages_select ON cp.lead_stages
  FOR SELECT TO authenticated
  USING (cp.is_member_of_tenant(auth.uid(), tenant_id));

DROP POLICY IF EXISTS p_lead_stages_modify ON cp.lead_stages;
CREATE POLICY p_lead_stages_modify ON cp.lead_stages
  FOR ALL TO authenticated
  USING (cp.is_member_of_tenant(auth.uid(), tenant_id))
  WITH CHECK (cp.is_member_of_tenant(auth.uid(), tenant_id));

-- lead_activity: readable by members of the lead's tenant
DROP POLICY IF EXISTS p_lead_activity_select ON cp.lead_activity;
CREATE POLICY p_lead_activity_select ON cp.lead_activity
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cp.leads l WHERE l.id = lead_id AND cp.is_member_of_tenant(auth.uid(), l.tenant_id)
  ));

DROP POLICY IF EXISTS p_lead_activity_insert ON cp.lead_activity;
CREATE POLICY p_lead_activity_insert ON cp.lead_activity
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM cp.leads l WHERE l.id = lead_id AND cp.is_member_of_tenant(auth.uid(), l.tenant_id)
  ));

-- 8) Grants (minimal):
GRANT SELECT ON TABLE cp.lead_stages, cp.lead_activity TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE cp.lead_stages, cp.lead_activity TO authenticated, service_role;

