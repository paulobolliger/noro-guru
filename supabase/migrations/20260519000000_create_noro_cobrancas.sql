-- Tabela de cobranças dos pedidos (criada para suportar os providers de pagamento)
-- Relaciona-se com noro_pedidos e noro_clientes

CREATE TABLE IF NOT EXISTS public.noro_cobrancas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid REFERENCES cp.tenants(id) ON DELETE RESTRICT,
  pedido_id       uuid NOT NULL REFERENCES public.noro_pedidos(id) ON DELETE CASCADE,
  cliente_id      uuid REFERENCES public.noro_clientes(id) ON DELETE SET NULL,
  valor           numeric(12, 2) NOT NULL CHECK (valor > 0),
  provider        text NOT NULL CHECK (provider IN ('STRIPE', 'CIELO', 'BTG', 'BOLETO', 'MANUAL')),
  status          text NOT NULL DEFAULT 'PENDENTE'
                    CHECK (status IN ('PENDENTE', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'ERRO_API', 'CANCELADO')),
  data_vencimento date NOT NULL,
  parcelas        int4 NOT NULL DEFAULT 1 CHECK (parcelas >= 1),
  transaction_id  text,
  provider_data   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noro_cobrancas_pedido  ON public.noro_cobrancas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_noro_cobrancas_cliente ON public.noro_cobrancas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_noro_cobrancas_status  ON public.noro_cobrancas(status);

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_noro_cobrancas_updated_at ON public.noro_cobrancas;
CREATE TRIGGER trg_noro_cobrancas_updated_at
  BEFORE UPDATE ON public.noro_cobrancas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.noro_cobrancas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p_noro_cobrancas_select ON public.noro_cobrancas;
CREATE POLICY p_noro_cobrancas_select ON public.noro_cobrancas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cp.user_tenant_roles utr
      WHERE utr.user_id = auth.uid()
        AND utr.tenant_id = noro_cobrancas.tenant_id
    )
  );

DROP POLICY IF EXISTS p_noro_cobrancas_modify ON public.noro_cobrancas;
CREATE POLICY p_noro_cobrancas_modify ON public.noro_cobrancas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cp.user_tenant_roles utr
      WHERE utr.user_id = auth.uid()
        AND utr.tenant_id = noro_cobrancas.tenant_id
        AND utr.role IN ('owner', 'admin', 'member')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cp.user_tenant_roles utr
      WHERE utr.user_id = auth.uid()
        AND utr.tenant_id = noro_cobrancas.tenant_id
        AND utr.role IN ('owner', 'admin', 'member')
    )
  );
