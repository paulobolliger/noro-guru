-- Multi-tenant Stage 1
-- - cp.domains (resolução por domínio)
-- - tenant_id em noro_clientes e noro_leads (backfill com tenant 'noro')
-- - RLS + policies por tenant para clientes e leads

-- 1) Garantir tenant principal "noro"
INSERT INTO cp.tenants (id, name, slug, plan, status, billing_email)
SELECT gen_random_uuid(), 'Noro Guru', 'noro', 'pro', 'active', 'billing@noro.guru'
WHERE NOT EXISTS (SELECT 1 FROM cp.tenants WHERE slug = 'noro');

-- 2) cp.domains: resolução por domínio → tenant
CREATE TABLE IF NOT EXISTS cp.domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  domain text NOT NULL UNIQUE,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Domínios principais
INSERT INTO cp.domains (tenant_id, domain, is_default)
SELECT t.id, 'noro.guru', true FROM cp.tenants t WHERE t.slug = 'noro'
ON CONFLICT (domain) DO NOTHING;

INSERT INTO cp.domains (tenant_id, domain, is_default)
SELECT t.id, 'control.noro.guru', false FROM cp.tenants t WHERE t.slug = 'noro'
ON CONFLICT (domain) DO NOTHING;

INSERT INTO cp.domains (tenant_id, domain, is_default)
SELECT t.id, 'core.noro.guru', false FROM cp.tenants t WHERE t.slug = 'noro'
ON CONFLICT (domain) DO NOTHING;

INSERT INTO cp.domains (tenant_id, domain, is_default)
SELECT t.id, 'visa-api.noro.guru', false FROM cp.tenants t WHERE t.slug = 'noro'
ON CONFLICT (domain) DO NOTHING;

-- 4) Adicionar tenant_id em noro_clientes (NULL → backfill → NOT NULL)
ALTER TABLE public.noro_clientes ADD COLUMN IF NOT EXISTS tenant_id uuid;

UPDATE public.noro_clientes c
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE tenant_id IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'noro_clientes'
      AND column_name = 'tenant_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.noro_clientes ALTER COLUMN tenant_id SET NOT NULL';
  END IF;
END $$;

-- FK apenas se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'noro_clientes_tenant_fk'
  ) THEN
    ALTER TABLE public.noro_clientes
      ADD CONSTRAINT noro_clientes_tenant_fk
      FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_noro_clientes_tenant ON public.noro_clientes(tenant_id);

-- 5) Adicionar tenant_id em noro_leads (NULL → backfill → NOT NULL)
ALTER TABLE public.noro_leads ADD COLUMN IF NOT EXISTS tenant_id uuid;

UPDATE public.noro_leads l
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE tenant_id IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'noro_leads'
      AND column_name = 'tenant_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.noro_leads ALTER COLUMN tenant_id SET NOT NULL';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'noro_leads_tenant_fk'
  ) THEN
    ALTER TABLE public.noro_leads
      ADD CONSTRAINT noro_leads_tenant_fk
      FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_noro_leads_tenant ON public.noro_leads(tenant_id);

-- 6) RLS e policies multi-tenant (clientes)
ALTER TABLE public.noro_clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p_noro_clientes_select ON public.noro_clientes;
DROP POLICY IF EXISTS p_noro_clientes_modify ON public.noro_clientes;

CREATE POLICY p_noro_clientes_select
ON public.noro_clientes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_clientes.tenant_id
  )
);

CREATE POLICY p_noro_clientes_modify
ON public.noro_clientes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_clientes.tenant_id
      AND utr.role IN ('owner','admin','member')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_clientes.tenant_id
      AND utr.role IN ('owner','admin','member')
  )
);

-- 7) RLS e policies multi-tenant (leads)
ALTER TABLE public.noro_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p_noro_leads_select ON public.noro_leads;
DROP POLICY IF EXISTS p_noro_leads_modify ON public.noro_leads;

CREATE POLICY p_noro_leads_select
ON public.noro_leads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_leads.tenant_id
  )
);

CREATE POLICY p_noro_leads_modify
ON public.noro_leads
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_leads.tenant_id
      AND utr.role IN ('owner','admin','member')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_leads.tenant_id
      AND utr.role IN ('owner','admin','member')
  )
);

-- Fim Stage 1
