CREATE TYPE tipo_markup AS ENUM ('percentual', 'fixo', 'dinamico', 'personalizado');
CREATE TYPE tipo_regra_preco AS ENUM (
  'markup_padrao',
  'volume',
  'sazonalidade',
  'cliente_categoria',
  'destino',
  'fornecedor',
  'produto'
);
CREATE TYPE moeda AS ENUM ('BRL', 'USD', 'EUR');

CREATE TABLE markups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  tipo_produto VARCHAR(50) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo_markup tipo_markup NOT NULL,
  valor_markup DECIMAL(10,2) NOT NULL,
  moeda moeda NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL,
  metadados JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE regras_preco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  nome VARCHAR(100) NOT NULL,
  tipo tipo_regra_preco NOT NULL,
  descricao TEXT,
  
  -- Condições
  valor_minimo DECIMAL(10,2),
  valor_maximo DECIMAL(10,2),
  data_inicio DATE,
  data_fim DATE,
  
  -- Markup
  tipo_markup tipo_markup NOT NULL,
  valor_markup DECIMAL(10,2) NOT NULL,
  moeda moeda NOT NULL,
  
  -- Controle
  prioridade INTEGER NOT NULL,
  sobrepor_regras BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadados
  metadados JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Função para calcular preço final considerando regras
CREATE OR REPLACE FUNCTION calcular_preco_final(
  preco_base DECIMAL(10,2),
  produto_id UUID DEFAULT NULL,
  cliente_id UUID DEFAULT NULL,
  quantidade INTEGER DEFAULT NULL,
  data_ref DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  preco_final DECIMAL(10,2),
  markup_total DECIMAL(10,2),
  detalhamento JSONB
) AS $$
DECLARE
  v_regra regras_preco;
  v_markup DECIMAL(10,2);
  v_valor_final DECIMAL(10,2);
  v_detalhamento JSONB := '[]'::JSONB;
BEGIN
  -- Inicializa com o preço base
  v_valor_final := preco_base;
  v_markup := 0;
  
  -- Busca todas as regras ativas ordenadas por prioridade
  FOR v_regra IN 
    SELECT * FROM regras_preco 
    WHERE ativo = true
    AND (data_inicio IS NULL OR data_inicio <= data_ref)
    AND (data_fim IS NULL OR data_fim >= data_ref)
    ORDER BY prioridade DESC
  LOOP
    -- Verifica condições específicas para cada tipo de regra
    CASE v_regra.tipo
      WHEN 'markup_padrao' THEN
        -- Aplica markup padrão
        IF v_regra.tipo_markup = 'percentual' THEN
          v_markup := v_valor_final * (v_regra.valor_markup / 100);
        ELSE
          v_markup := v_regra.valor_markup;
        END IF;
        
      WHEN 'volume' THEN
        -- Verifica condições de volume
        IF quantidade IS NOT NULL 
        AND (v_regra.valor_minimo IS NULL OR quantidade >= v_regra.valor_minimo)
        AND (v_regra.valor_maximo IS NULL OR quantidade <= v_regra.valor_maximo)
        THEN
          IF v_regra.tipo_markup = 'percentual' THEN
            v_markup := v_valor_final * (v_regra.valor_markup / 100);
          ELSE
            v_markup := v_regra.valor_markup;
          END IF;
        END IF;
        
      -- Implementar outros tipos de regras conforme necessário
      
    END CASE;
    
    -- Atualiza valor final e detalhamento
    v_valor_final := v_valor_final + v_markup;
    v_detalhamento := v_detalhamento || jsonb_build_object(
      'regra_id', v_regra.id,
      'nome_regra', v_regra.nome,
      'tipo_markup', v_regra.tipo_markup,
      'valor_markup', v_regra.valor_markup,
      'valor_aplicado', v_markup
    );
    
    -- Se a regra deve sobrepor outras, interrompe o processamento
    IF v_regra.sobrepor_regras THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN QUERY 
  SELECT v_valor_final::DECIMAL(10,2), 
         (v_valor_final - preco_base)::DECIMAL(10,2), 
         v_detalhamento;
END;
$$ LANGUAGE plpgsql;