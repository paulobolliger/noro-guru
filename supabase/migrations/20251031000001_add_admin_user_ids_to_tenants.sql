-- Adiciona coluna admin_user_ids à tabela tenants se ela não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tenants' 
        AND column_name = 'admin_user_ids'
    ) THEN
        ALTER TABLE public.tenants
        ADD COLUMN admin_user_ids uuid[] DEFAULT '{}';
    END IF;
END $$;

-- Atualiza as policies do billing para usar a nova coluna
DROP POLICY IF EXISTS tenant_read_own_subscription ON billing.subscriptions;
DROP POLICY IF EXISTS tenant_read_own_payment_methods ON billing.payment_methods;
DROP POLICY IF EXISTS tenant_read_own_invoices ON billing.invoices;
DROP POLICY IF EXISTS tenant_read_own_transactions ON billing.transactions;

-- Recria as policies com a verificação correta
CREATE POLICY tenant_read_own_subscription ON billing.subscriptions
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT id FROM public.tenants 
    WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
  ));

CREATE POLICY tenant_read_own_payment_methods ON billing.payment_methods
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT id FROM public.tenants 
    WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
  ));

CREATE POLICY tenant_read_own_invoices ON billing.invoices
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT id FROM public.tenants 
    WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
  ));

CREATE POLICY tenant_read_own_transactions ON billing.transactions
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT id FROM public.tenants 
    WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
  ));