-- API Keys Stage: Logs + Views + (Opcional) Rate Limit helpers

-- 1) Logs de uso por key
CREATE TABLE IF NOT EXISTS cp.api_key_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id uuid NOT NULL REFERENCES cp.api_keys(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  route text NOT NULL,
  country_from text,
  country_to text,
  purpose text,
  duration text,
  status int2 NOT NULL,
  elapsed_ms int4,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_key_logs_key_created ON cp.api_key_logs(key_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_key_logs_tenant_created ON cp.api_key_logs(tenant_id, created_at DESC);

-- 2) View agregada diária por key (últimos 30 dias)
CREATE OR REPLACE VIEW cp.v_api_key_usage_daily AS
SELECT
  l.key_id,
  date_trunc('day', l.created_at) AS day,
  count(*)::int AS calls,
  avg(l.elapsed_ms)::int AS avg_ms,
  sum(CASE WHEN l.status >= 500 THEN 1 ELSE 0 END)::int AS errors
FROM cp.api_key_logs l
WHERE l.created_at >= now() - interval '30 days'
GROUP BY l.key_id, date_trunc('day', l.created_at);

-- 3) RLS (somente super admins por enquanto)
ALTER TABLE cp.api_key_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_api_key_logs_read ON cp.api_key_logs;
CREATE POLICY p_api_key_logs_read ON cp.api_key_logs FOR SELECT USING (
  cp.is_super_admin(auth.uid())
);

-- (Opcional) poderemos expor uma função para contagem rolling:
-- CREATE OR REPLACE FUNCTION cp.key_calls_last_minute(p_key uuid)
-- RETURNS int AS $$
--   SELECT count(*)::int FROM cp.api_key_logs
--   WHERE key_id = p_key AND created_at >= now() - interval '1 minute';
-- $$ LANGUAGE sql STABLE;

-- Fim API Keys Stage
