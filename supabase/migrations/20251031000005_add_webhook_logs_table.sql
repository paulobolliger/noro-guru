-- Criar tabela para logs de webhook do Stripe
CREATE TABLE IF NOT EXISTS cp.stripe_webhook_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    status text NOT NULL CHECK (status IN ('success', 'error')),
    payload jsonb NOT NULL,
    error text,
    created_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON cp.stripe_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON cp.stripe_webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON cp.stripe_webhook_logs(created_at DESC);

-- Habilitar RLS
ALTER TABLE cp.stripe_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Criar política para admins
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'cp' 
        AND tablename = 'stripe_webhook_logs' 
        AND policyname = 'admin_all_webhook_logs'
    ) THEN
        CREATE POLICY admin_all_webhook_logs ON cp.stripe_webhook_logs
            FOR ALL TO authenticated
            USING (auth.jwt()->>'role' = 'admin')
            WITH CHECK (auth.jwt()->>'role' = 'admin');
    END IF;
END $$;