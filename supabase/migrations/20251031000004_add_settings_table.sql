-- Criar tabela de configurações se não existir
CREATE TABLE IF NOT EXISTS cp.settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Criar índice para melhor performance em buscas por chave
CREATE INDEX IF NOT EXISTS idx_settings_key ON cp.settings(key);

-- Habilitar RLS
ALTER TABLE cp.settings ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir apenas administradores
CREATE POLICY admin_all_settings ON cp.settings
    FOR ALL TO authenticated
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION cp.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_settings ON cp.settings;

CREATE TRIGGER set_updated_at_settings
    BEFORE UPDATE ON cp.settings
    FOR EACH ROW
    EXECUTE FUNCTION cp.set_updated_at();