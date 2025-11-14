-- Migration: Sistema de auditoria de segurança
-- Data: 2025-11-14
-- Descrição: Log de eventos de segurança e tentativas de acesso não autorizado

-- 1. Criar tabela de log de auditoria
CREATE TABLE IF NOT EXISTS cp.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id uuid REFERENCES cp.tenants(id) ON DELETE SET NULL,
  action text NOT NULL,  -- 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ACCESS_DENIED'
  table_name text NOT NULL,
  record_id uuid,
  blocked boolean DEFAULT false,
  reason text,
  ip_address inet,
  user_agent text,
  request_path text,
  created_at timestamptz DEFAULT now()
);

-- 2. Criar indexes para performance
CREATE INDEX idx_audit_log_user_time ON cp.security_audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_tenant_time ON cp.security_audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_audit_log_blocked ON cp.security_audit_log(blocked, created_at DESC) WHERE blocked = true;
CREATE INDEX idx_audit_log_table ON cp.security_audit_log(table_name, created_at DESC);
CREATE INDEX idx_audit_log_action ON cp.security_audit_log(action, created_at DESC);

-- 3. Enable RLS na tabela de auditoria
ALTER TABLE cp.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas admins do sistema podem ver logs
CREATE POLICY "System admins can view audit logs"
ON cp.security_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    JOIN cp.tenants t ON t.id = utr.tenant_id
    WHERE utr.user_id = auth.uid()
    AND t.slug = 'noro'  -- Tenant sistema
    AND utr.role = 'admin'
  )
);

-- Policy: Sistema pode inserir logs (via service role)
CREATE POLICY "System can insert audit logs"
ON cp.security_audit_log
FOR INSERT
WITH CHECK (true);

-- 4. Função para logar eventos de segurança
CREATE OR REPLACE FUNCTION cp.log_security_event(
  p_action text,
  p_table_name text,
  p_record_id uuid DEFAULT NULL,
  p_blocked boolean DEFAULT false,
  p_reason text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_request_path text DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_tenant_id uuid;
BEGIN
  -- Tentar obter tenant_id do contexto
  BEGIN
    v_tenant_id := get_current_tenant_id();
  EXCEPTION WHEN OTHERS THEN
    v_tenant_id := NULL;
  END;

  -- Inserir log
  INSERT INTO cp.security_audit_log (
    user_id,
    tenant_id,
    action,
    table_name,
    record_id,
    blocked,
    reason,
    ip_address,
    user_agent,
    request_path
  ) VALUES (
    auth.uid(),
    v_tenant_id,
    p_action,
    p_table_name,
    p_record_id,
    p_blocked,
    p_reason,
    p_ip_address,
    p_user_agent,
    p_request_path
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cp.log_security_event IS
  'Registra evento de segurança no log de auditoria';

-- 5. Função para obter estatísticas de segurança
CREATE OR REPLACE FUNCTION cp.get_security_stats(
  p_tenant_id uuid DEFAULT NULL,
  p_days integer DEFAULT 7
)
RETURNS TABLE (
  total_events bigint,
  blocked_attempts bigint,
  unique_users bigint,
  most_common_action text,
  most_targeted_table text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_events,
    COUNT(*) FILTER (WHERE blocked = true)::bigint as blocked_attempts,
    COUNT(DISTINCT user_id)::bigint as unique_users,
    MODE() WITHIN GROUP (ORDER BY action) as most_common_action,
    MODE() WITHIN GROUP (ORDER BY table_name) as most_targeted_table
  FROM cp.security_audit_log
  WHERE
    created_at >= now() - (p_days || ' days')::interval
    AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION cp.get_security_stats IS
  'Retorna estatísticas de segurança para um período';

-- 6. View para alertas de segurança
CREATE OR REPLACE VIEW cp.security_alerts AS
SELECT
  id,
  user_id,
  tenant_id,
  action,
  table_name,
  reason,
  ip_address,
  created_at,
  -- Calcular severidade
  CASE
    WHEN action = 'DELETE' AND blocked THEN 'critical'
    WHEN action IN ('UPDATE', 'INSERT') AND blocked THEN 'high'
    WHEN blocked THEN 'medium'
    ELSE 'low'
  END as severity
FROM cp.security_audit_log
WHERE blocked = true
ORDER BY created_at DESC;

COMMENT ON VIEW cp.security_alerts IS
  'View de alertas de segurança com severidade calculada';

-- 7. Grants
GRANT EXECUTE ON FUNCTION cp.log_security_event TO authenticated, anon;
GRANT EXECUTE ON FUNCTION cp.get_security_stats TO authenticated;
GRANT SELECT ON cp.security_alerts TO authenticated;
