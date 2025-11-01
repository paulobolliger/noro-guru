-- Multi-tenant Stage 2
-- - tenant_id + RLS/policies em tabelas: orçamentos/pedidos e relacionadas
-- Tabelas-alvo (existentes conforme schema remoto):
--   public.noro_orcamentos, public.noro_orcamentos_itens,
--   public.noro_pedidos, public.noro_pedidos_itens, public.noro_pedidos_timeline
-- Obs.: backfill inicial define tenant_id = tenant 'noro'

-- Helper: obter id do tenant 'noro'
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM cp.tenants WHERE slug = 'noro') THEN
    INSERT INTO cp.tenants (id, name, slug, plan, status)
    VALUES (gen_random_uuid(), 'Noro Guru', 'noro', 'pro', 'active');
  END IF;
END $$;

-- 1) noro_orcamentos
ALTER TABLE public.noro_orcamentos ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_orcamentos SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_orcamentos' AND column_name='tenant_id'
  ) THEN EXECUTE 'ALTER TABLE public.noro_orcamentos ALTER COLUMN tenant_id SET NOT NULL'; END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noro_orcamentos_tenant_fk') THEN
    ALTER TABLE public.noro_orcamentos
      ADD CONSTRAINT noro_orcamentos_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_noro_orcamentos_tenant ON public.noro_orcamentos(tenant_id);

ALTER TABLE public.noro_orcamentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_orcamentos_select ON public.noro_orcamentos;
DROP POLICY IF EXISTS p_noro_orcamentos_modify ON public.noro_orcamentos;
CREATE POLICY p_noro_orcamentos_select ON public.noro_orcamentos FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_orcamentos.tenant_id)
);
CREATE POLICY p_noro_orcamentos_modify ON public.noro_orcamentos FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_orcamentos.tenant_id AND utr.role IN ('owner','admin','member')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_orcamentos.tenant_id AND utr.role IN ('owner','admin','member')
  )
);

-- 2) noro_orcamentos_itens
ALTER TABLE public.noro_orcamentos_itens ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_orcamentos_itens SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_orcamentos_itens' AND column_name='tenant_id'
  ) THEN EXECUTE 'ALTER TABLE public.noro_orcamentos_itens ALTER COLUMN tenant_id SET NOT NULL'; END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noro_orcamentos_itens_tenant_fk') THEN
    ALTER TABLE public.noro_orcamentos_itens
      ADD CONSTRAINT noro_orcamentos_itens_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_noro_orcamentos_itens_tenant ON public.noro_orcamentos_itens(tenant_id);

ALTER TABLE public.noro_orcamentos_itens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_orcamentos_itens_select ON public.noro_orcamentos_itens;
DROP POLICY IF EXISTS p_noro_orcamentos_itens_modify ON public.noro_orcamentos_itens;
CREATE POLICY p_noro_orcamentos_itens_select ON public.noro_orcamentos_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_orcamentos_itens.tenant_id)
);
CREATE POLICY p_noro_orcamentos_itens_modify ON public.noro_orcamentos_itens FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_orcamentos_itens.tenant_id AND utr.role IN ('owner','admin','member')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_orcamentos_itens.tenant_id AND utr.role IN ('owner','admin','member')
  )
);

-- 3) noro_pedidos
ALTER TABLE public.noro_pedidos ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_pedidos SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_pedidos' AND column_name='tenant_id'
  ) THEN EXECUTE 'ALTER TABLE public.noro_pedidos ALTER COLUMN tenant_id SET NOT NULL'; END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noro_pedidos_tenant_fk') THEN
    ALTER TABLE public.noro_pedidos
      ADD CONSTRAINT noro_pedidos_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_noro_pedidos_tenant ON public.noro_pedidos(tenant_id);

ALTER TABLE public.noro_pedidos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_pedidos_select ON public.noro_pedidos;
DROP POLICY IF EXISTS p_noro_pedidos_modify ON public.noro_pedidos;
CREATE POLICY p_noro_pedidos_select ON public.noro_pedidos FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos.tenant_id)
);
CREATE POLICY p_noro_pedidos_modify ON public.noro_pedidos FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos.tenant_id AND utr.role IN ('owner','admin','member')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos.tenant_id AND utr.role IN ('owner','admin','member')
  )
);

-- 4) noro_pedidos_itens
ALTER TABLE public.noro_pedidos_itens ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_pedidos_itens SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_pedidos_itens' AND column_name='tenant_id'
  ) THEN EXECUTE 'ALTER TABLE public.noro_pedidos_itens ALTER COLUMN tenant_id SET NOT NULL'; END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noro_pedidos_itens_tenant_fk') THEN
    ALTER TABLE public.noro_pedidos_itens
      ADD CONSTRAINT noro_pedidos_itens_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_noro_pedidos_itens_tenant ON public.noro_pedidos_itens(tenant_id);

ALTER TABLE public.noro_pedidos_itens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_pedidos_itens_select ON public.noro_pedidos_itens;
DROP POLICY IF EXISTS p_noro_pedidos_itens_modify ON public.noro_pedidos_itens;
CREATE POLICY p_noro_pedidos_itens_select ON public.noro_pedidos_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos_itens.tenant_id)
);
CREATE POLICY p_noro_pedidos_itens_modify ON public.noro_pedidos_itens FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos_itens.tenant_id AND utr.role IN ('owner','admin','member')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos_itens.tenant_id AND utr.role IN ('owner','admin','member')
  )
);

-- 5) noro_pedidos_timeline
ALTER TABLE public.noro_pedidos_timeline ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_pedidos_timeline SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_pedidos_timeline' AND column_name='tenant_id'
  ) THEN EXECUTE 'ALTER TABLE public.noro_pedidos_timeline ALTER COLUMN tenant_id SET NOT NULL'; END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noro_pedidos_timeline_tenant_fk') THEN
    ALTER TABLE public.noro_pedidos_timeline
      ADD CONSTRAINT noro_pedidos_timeline_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_noro_pedidos_timeline_tenant ON public.noro_pedidos_timeline(tenant_id);

ALTER TABLE public.noro_pedidos_timeline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_pedidos_timeline_select ON public.noro_pedidos_timeline;
DROP POLICY IF EXISTS p_noro_pedidos_timeline_modify ON public.noro_pedidos_timeline;
CREATE POLICY p_noro_pedidos_timeline_select ON public.noro_pedidos_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos_timeline.tenant_id)
);
CREATE POLICY p_noro_pedidos_timeline_modify ON public.noro_pedidos_timeline FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos_timeline.tenant_id AND utr.role IN ('owner','admin','member')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() AND utr.tenant_id = noro_pedidos_timeline.tenant_id AND utr.role IN ('owner','admin','member')
  )
);

-- Fim Stage 2
