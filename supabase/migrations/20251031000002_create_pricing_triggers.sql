-- Função para validar regras de preço
CREATE OR REPLACE FUNCTION validar_regra_preco()
RETURNS TRIGGER AS $$
BEGIN
  -- Validações básicas
  IF NEW.valor_minimo IS NOT NULL AND NEW.valor_maximo IS NOT NULL 
  AND NEW.valor_minimo > NEW.valor_maximo THEN
    RAISE EXCEPTION 'O valor mínimo não pode ser maior que o valor máximo';
  END IF;

  IF NEW.data_inicio IS NOT NULL AND NEW.data_fim IS NOT NULL 
  AND NEW.data_inicio > NEW.data_fim THEN
    RAISE EXCEPTION 'A data de início não pode ser posterior à data de fim';
  END IF;

  -- Validações específicas por tipo
  CASE NEW.tipo
    WHEN 'volume' THEN
      IF NEW.valor_minimo IS NULL THEN
        RAISE EXCEPTION 'Regras de volume precisam de um valor mínimo definido';
      END IF;
      
    WHEN 'sazonalidade' THEN
      IF NEW.data_inicio IS NULL OR NEW.data_fim IS NULL THEN
        RAISE EXCEPTION 'Regras de sazonalidade precisam de datas de início e fim definidas';
      END IF;
      
  END CASE;

  -- Validações de markup
  IF NEW.tipo_markup = 'percentual' AND (NEW.valor_markup < 0 OR NEW.valor_markup > 1000) THEN
    RAISE EXCEPTION 'Percentual de markup deve estar entre 0 e 1000';
  END IF;

  IF NEW.tipo_markup = 'fixo' AND NEW.valor_markup < 0 THEN
    RAISE EXCEPTION 'Valor fixo de markup não pode ser negativo';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar regras antes de inserir/atualizar
CREATE TRIGGER validar_regra_preco_trigger
  BEFORE INSERT OR UPDATE ON regras_preco
  FOR EACH ROW
  EXECUTE FUNCTION validar_regra_preco();

-- Função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER atualizar_markup_timestamp
  BEFORE UPDATE ON markups
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER atualizar_regra_preco_timestamp
  BEFORE UPDATE ON regras_preco
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at();

-- Função para ordenar markups
CREATE OR REPLACE FUNCTION reordenar_markups()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a ordem foi alterada
  IF TG_OP = 'UPDATE' AND OLD.ordem != NEW.ordem THEN
    -- Atualiza a ordem dos outros markups
    UPDATE markups
    SET ordem = CASE 
      WHEN ordem > OLD.ordem AND ordem <= NEW.ordem THEN ordem - 1
      WHEN ordem < OLD.ordem AND ordem >= NEW.ordem THEN ordem + 1
      ELSE ordem
    END
    WHERE id != NEW.id
    AND tenant_id = NEW.tenant_id;
  -- Se é uma nova inserção
  ELSIF TG_OP = 'INSERT' THEN
    -- Incrementa a ordem dos markups existentes
    UPDATE markups
    SET ordem = ordem + 1
    WHERE ordem >= NEW.ordem
    AND id != NEW.id
    AND tenant_id = NEW.tenant_id;
  -- Se é uma exclusão
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementa a ordem dos markups posteriores
    UPDATE markups
    SET ordem = ordem - 1
    WHERE ordem > OLD.ordem
    AND tenant_id = OLD.tenant_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para manter a ordem dos markups
CREATE TRIGGER manter_ordem_markups
  AFTER INSERT OR UPDATE OR DELETE ON markups
  FOR EACH ROW
  EXECUTE FUNCTION reordenar_markups();