-- RLS Policies para Control Plane
BEGIN;

-- Ensure RLS is enabled
ALTER TABLE cp.control_plane_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.control_plane_user_activities ENABLE ROW LEVEL SECURITY;

-- Reset policies (defensive)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='cp' AND tablename='control_plane_users' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cp.control_plane_users', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='cp' AND tablename='control_plane_user_activities' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cp.control_plane_user_activities', r.policyname);
  END LOOP;
END$$;

-- Policies para control_plane_users
CREATE POLICY "Permitir leitura para usuários logados"
  ON cp.control_plane_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir atualização apenas para super_admin e admin"
  ON cp.control_plane_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cp.control_plane_users u
      WHERE u.auth_id = auth.uid()
      AND u.role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cp.control_plane_users u
      WHERE u.auth_id = auth.uid()
      AND u.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Permitir inserção apenas para super_admin e admin"
  ON cp.control_plane_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cp.control_plane_users u
      WHERE u.auth_id = auth.uid()
      AND u.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Permitir deleção apenas para super_admin"
  ON cp.control_plane_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cp.control_plane_users u
      WHERE u.auth_id = auth.uid()
      AND u.role = 'super_admin'
    )
  );

-- Policies para control_plane_user_activities
CREATE POLICY "Permitir leitura de atividades para usuários logados"
  ON cp.control_plane_user_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de atividades para usuários logados"
  ON cp.control_plane_user_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Import inicial de usuários do noro_users
INSERT INTO cp.control_plane_users (auth_id, email, nome, role, status, two_factor_enabled)
SELECT 
  nu.id as auth_id,
  nu.email,
  nu.nome,
  CASE 
    WHEN nu.role = 'admin' THEN 'super_admin'
    ELSE 'readonly'
  END as role,
  'ativo' as status,
  false as two_factor_enabled
FROM public.noro_users nu
ON CONFLICT (email) DO NOTHING;

-- Garantir que o usuário super_admin inicial existe
INSERT INTO cp.control_plane_users (auth_id, email, nome, role, status, two_factor_enabled)
SELECT 
  u.id as auth_id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'nome', 'Admin') as nome,
  'super_admin' as role,
  'ativo' as status,
  false as two_factor_enabled
FROM auth.users u
WHERE u.email = 'paulo.bolliger@gmail.com'
ON CONFLICT (email) DO 
  UPDATE SET role = 'super_admin', status = 'ativo';

COMMIT;