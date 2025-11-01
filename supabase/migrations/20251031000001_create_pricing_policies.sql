-- Habilita RLS para as tabelas
ALTER TABLE markups ENABLE ROW LEVEL SECURITY;
ALTER TABLE regras_preco ENABLE ROW LEVEL SECURITY;

-- Políticas para markups
CREATE POLICY "Usuários podem ver markups do seu tenant"
  ON markups FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar markups no seu tenant"
  ON markups FOR INSERT
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar markups do seu tenant"
  ON markups FOR UPDATE
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem excluir markups do seu tenant"
  ON markups FOR DELETE
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

-- Políticas para regras_preco
CREATE POLICY "Usuários podem ver regras de preço do seu tenant"
  ON regras_preco FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar regras de preço no seu tenant"
  ON regras_preco FOR INSERT
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar regras de preço do seu tenant"
  ON regras_preco FOR UPDATE
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem excluir regras de preço do seu tenant"
  ON regras_preco FOR DELETE
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users
    WHERE user_id = auth.uid()
  ));