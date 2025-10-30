-- Schema: cp.leads

-- Estágios do Lead
CREATE TABLE IF NOT EXISTS cp.lead_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Leads
CREATE TABLE IF NOT EXISTS cp.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES cp.lead_stages(id),
  title text NOT NULL,
  description text,
  source text,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'novo',
  assigned_to uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Atividades do Lead
CREATE TABLE IF NOT EXISTS cp.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES cp.leads(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger para updated_at dos leads
CREATE OR REPLACE FUNCTION cp.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para leads
DROP TRIGGER IF EXISTS tr_leads_updated_at ON cp.leads;
CREATE TRIGGER tr_leads_updated_at
  BEFORE UPDATE ON cp.leads
  FOR EACH ROW
  EXECUTE FUNCTION cp.set_updated_at();

-- Trigger para lead_stages
DROP TRIGGER IF EXISTS tr_lead_stages_updated_at ON cp.lead_stages;
CREATE TRIGGER tr_lead_stages_updated_at
  BEFORE UPDATE ON cp.lead_stages
  FOR EACH ROW
  EXECUTE FUNCTION cp.set_updated_at();

-- Garante que a coluna stage_id existe na tabela cp.leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'cp' AND table_name = 'leads' AND column_name = 'stage_id'
  ) THEN
    EXECUTE 'ALTER TABLE cp.leads ADD COLUMN stage_id uuid REFERENCES cp.lead_stages(id)';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_tenant ON cp.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON cp.leads(stage_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON cp.leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_stages_tenant ON cp.lead_stages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_tenant ON cp.lead_activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON cp.lead_activities(lead_id);