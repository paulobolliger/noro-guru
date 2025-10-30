-- Control Plane Tables
-- Schema: cp (controle de usuários)

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

-- Helper Functions
CREATE OR REPLACE FUNCTION cp.is_system_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM cp.control_plane_users
    WHERE auth_id = user_id AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;