-- Control Plane Tables
CREATE SCHEMA IF NOT EXISTS cp;

-- Control Plane Users
CREATE TABLE IF NOT EXISTS cp.control_plane_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  nome text,
  role text NOT NULL DEFAULT 'readonly',
  status text NOT NULL DEFAULT 'pendente',
  two_factor_enabled boolean NOT NULL DEFAULT false,
  permissoes jsonb[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  avatar_url text,
  ultimo_acesso timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION cp.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_control_plane_users_updated_at ON cp.control_plane_users;

CREATE TRIGGER tr_control_plane_users_updated_at
  BEFORE UPDATE ON cp.control_plane_users
  FOR EACH ROW
  EXECUTE FUNCTION cp.set_updated_at();

-- Control Plane User Activities
CREATE TABLE IF NOT EXISTS cp.control_plane_user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES cp.control_plane_users(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text NOT NULL,
  ip_address text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE cp.control_plane_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cp.control_plane_user_activities ENABLE ROW LEVEL SECURITY;

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

-- Importar usuários existentes de noro_users
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