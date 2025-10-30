-- Garantir USAGE no schema cp e SELECT controlado por RLS
GRANT USAGE ON SCHEMA cp TO anon, authenticated, service_role;
-- Permite introspecção de views e functions quando RLS estiver correta
GRANT SELECT ON ALL TABLES IN SCHEMA cp TO authenticated, anon, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA cp GRANT SELECT ON TABLES TO authenticated, anon;
