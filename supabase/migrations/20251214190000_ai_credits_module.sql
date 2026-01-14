-- AI Credits / Wallet Module
-- Sistema de créditos pré-pagos para uso de IA por tenant

-- 1. Carteira do Tenant (Saldo)
CREATE TABLE IF NOT EXISTS public.noro_ai_wallets (
    tenant_id uuid PRIMARY KEY REFERENCES cp.tenants(id) ON DELETE CASCADE,
    balance_cents bigint NOT NULL DEFAULT 0, -- Saldo em centavos
    updated_at timestamptz DEFAULT now()
);

-- RLS: Tenants só veem sua própria carteira
ALTER TABLE public.noro_ai_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_noro_ai_wallets_select ON public.noro_ai_wallets FOR SELECT USING (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_wallets.tenant_id)
);

-- Ninguém edita saldo diretamente via cliente, apenas via funções/server side
-- Então não criamos policy de UPDATE/INSERT para public role, apenas para service role se precisar, ou deixamos fechado.


-- 2. Transações (Histórico de Compra e Uso)
CREATE TABLE IF NOT EXISTS public.noro_ai_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
    amount_cents bigint NOT NULL, -- Positivo = Compra/Bônus; Negativo = Uso
    type text NOT NULL, -- 'purchase', 'usage', 'adjustment', 'bonus'
    description text,
    metadata jsonb, -- Link para o roteiro/artigo gerado ou ID do pagamento
    created_at timestamptz DEFAULT now()
);

-- Index para histórico rápido
CREATE INDEX IF NOT EXISTS idx_noro_ai_trans_tenant ON public.noro_ai_transactions(tenant_id);

-- RLS
ALTER TABLE public.noro_ai_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_noro_ai_transactions_select ON public.noro_ai_transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_transactions.tenant_id)
);

-- Trigger para atualizar saldo automaticamente
CREATE OR REPLACE FUNCTION public.update_ai_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.noro_ai_wallets (tenant_id, balance_cents)
    VALUES (NEW.tenant_id, NEW.amount_cents)
    ON CONFLICT (tenant_id)
    DO UPDATE SET 
        balance_cents = noro_ai_wallets.balance_cents + NEW.amount_cents,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_update_ai_wallet
AFTER INSERT ON public.noro_ai_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_ai_wallet_balance();
