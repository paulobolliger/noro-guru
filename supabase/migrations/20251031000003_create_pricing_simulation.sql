-- Função para simular preço com todas as regras aplicáveis
CREATE OR REPLACE FUNCTION simular_preco(
  IN tipo_produto TEXT,
  IN valor_custo DECIMAL(10,2),
  IN quantidade INTEGER DEFAULT 1,
  IN cliente_id UUID DEFAULT NULL,
  IN fornecedor_id UUID DEFAULT NULL,
  IN data_simulacao DATE DEFAULT CURRENT_DATE
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
  v_markup_total DECIMAL(10,2);
  v_detalhamento JSONB := '[]'::JSONB;
  v_tenant_id UUID;
BEGIN
  -- Obtém o tenant_id do usuário atual
  SELECT tenant_id INTO v_tenant_id 
  FROM tenant_users 
  WHERE user_id = auth.uid() 
  LIMIT 1;

  -- Inicializa com o valor de custo
  v_valor_final := valor_custo;
  v_markup_total := 0;
  
  -- Busca todas as regras ativas aplicáveis, ordenadas por prioridade
  FOR v_regra IN 
    SELECT * FROM regras_preco 
    WHERE ativo = true
    AND tenant_id = v_tenant_id
    AND (data_inicio IS NULL OR data_inicio <= data_simulacao)
    AND (data_fim IS NULL OR data_fim >= data_simulacao)
    ORDER BY prioridade DESC
  LOOP
    -- Inicializa markup como 0 para cada regra
    v_markup := 0;
    
    -- Verifica condições específicas para cada tipo de regra
    CASE v_regra.tipo
      WHEN 'markup_padrao' THEN
        -- Aplica markup padrão se o tipo de produto corresponde
        IF v_regra.metadados->>'tipo_produto' = tipo_produto THEN
          v_markup := CASE 
            WHEN v_regra.tipo_markup = 'percentual' THEN 
              v_valor_final * (v_regra.valor_markup / 100)
            ELSE 
              v_regra.valor_markup
          END;
        END IF;
        
      WHEN 'volume' THEN
        -- Verifica condições de volume
        IF quantidade >= COALESCE(v_regra.valor_minimo, 0)
        AND (v_regra.valor_maximo IS NULL OR quantidade <= v_regra.valor_maximo)
        THEN
          v_markup := CASE 
            WHEN v_regra.tipo_markup = 'percentual' THEN 
              v_valor_final * (v_regra.valor_markup / 100)
            ELSE 
              v_regra.valor_markup
          END;
        END IF;
        
      WHEN 'cliente_categoria' THEN
        -- Aplica regra baseada na categoria do cliente
        IF cliente_id IS NOT NULL 
        AND v_regra.metadados->>'cliente_id' = cliente_id::TEXT THEN
          v_markup := CASE 
            WHEN v_regra.tipo_markup = 'percentual' THEN 
              v_valor_final * (v_regra.valor_markup / 100)
            ELSE 
              v_regra.valor_markup
          END;
        END IF;
        
      WHEN 'fornecedor' THEN
        -- Aplica regra baseada no fornecedor
        IF fornecedor_id IS NOT NULL 
        AND v_regra.metadados->>'fornecedor_id' = fornecedor_id::TEXT THEN
          v_markup := CASE 
            WHEN v_regra.tipo_markup = 'percentual' THEN 
              v_valor_final * (v_regra.valor_markup / 100)
            ELSE 
              v_regra.valor_markup
          END;
        END IF;
        
      WHEN 'sazonalidade' THEN
        -- Aplica regra sazonal se estiver dentro do período
        IF data_simulacao BETWEEN v_regra.data_inicio AND v_regra.data_fim THEN
          v_markup := CASE 
            WHEN v_regra.tipo_markup = 'percentual' THEN 
              v_valor_final * (v_regra.valor_markup / 100)
            ELSE 
              v_regra.valor_markup
          END;
        END IF;
        
    END CASE;
    
    -- Se um markup foi calculado para esta regra
    IF v_markup > 0 THEN
      -- Atualiza o valor final e o markup total
      v_valor_final := v_valor_final + v_markup;
      v_markup_total := v_markup_total + v_markup;
      
      -- Adiciona ao detalhamento
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
    END IF;
  END LOOP;
  
  -- Retorna o resultado
  RETURN QUERY 
  SELECT 
    ROUND(v_valor_final, 2)::DECIMAL(10,2),
    ROUND(v_markup_total, 2)::DECIMAL(10,2),
    v_detalhamento;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;