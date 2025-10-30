


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "cp";


ALTER SCHEMA "cp" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "cp"."cp_dashboard_overview"() RETURNS TABLE("tenant_id" "uuid", "tenant_name" "text", "plan" "text", "status" "text", "total_users" integer, "total_events" integer, "last_event_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
declare
  r cp.tenants%rowtype;
  q text;
  c_users int;
  c_events int;
  last_evt timestamptz;
begin
  for r in select t.* from cp.tenants t loop
    begin
      q := format('select count(*) from tenant_%I.users', r.slug);
      execute q into c_users;
    exception when others then
      c_users := 0;
    end;

    select count(*), max(created_at)
      into c_events, last_evt
    from cp.system_events se
    where se.tenant_id = r.id;

    tenant_id := r.id;
    tenant_name := r.name;
    plan := r.plan;
    status := r.status;
    total_users := coalesce(c_users, 0);
    total_events := coalesce(c_events, 0);
    last_event_at := last_evt;

    return next;
  end loop;

  return;
end;
$$;


ALTER FUNCTION "cp"."cp_dashboard_overview"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."cp_list_users"("p_limit" integer, "p_offset" integer, "p_search" "text") RETURNS TABLE("id" "uuid", "email" "text", "created_at" timestamp with time zone, "last_sign_in_at" timestamp with time zone, "tenants_count" integer)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'cp', 'public'
    AS $$
select
u.id,
u.email,
u.created_at,
u.last_sign_in_at,
coalesce(m.tenants_count, 0) as tenants_count
from auth.users u
left join (
select utr.user_id, count(distinct utr.tenant_id)::int as tenants_count
from cp.user_tenant_roles utr
group by utr.user_id
) m on m.user_id = u.id
where (p_search is null or u.email ilike '%' || p_search || '%')
order by u.created_at desc
limit p_limit
offset p_offset
$$;


ALTER FUNCTION "cp"."cp_list_users"("p_limit" integer, "p_offset" integer, "p_search" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."cp_select_tenants"() RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "plan" "text", "status" "text", "billing_email" "text", "next_invoice_date" "date", "created_at" timestamp with time zone)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'cp', 'public'
    AS $$
select
t.id,
t.name,
t.slug,
t.plan,
t.status,
t.billing_email,
t.next_invoice_date,
t.created_at
from cp.tenants t
order by t.created_at desc
$$;


ALTER FUNCTION "cp"."cp_select_tenants"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."has_role"("uid" "uuid", "tenant_id" "uuid", "role_text" "text") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists(
    select 1 from cp.user_tenant_roles utr
     where utr.user_id = uid and utr.tenant_id = tenant_id and utr.role = role_text
  );
$$;


ALTER FUNCTION "cp"."has_role"("uid" "uuid", "tenant_id" "uuid", "role_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."is_member"("uid" "uuid", "tenant_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists(
    select 1 from cp.user_tenant_roles utr
     where utr.user_id = uid and utr.tenant_id = tenant_id
  );
$$;


ALTER FUNCTION "cp"."is_member"("uid" "uuid", "tenant_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."is_super_admin"("uid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select coalesce(
    (select (raw_app_meta_data->>'super_admin')::boolean
     from auth.users where id = uid), false);
$$;


ALTER FUNCTION "cp"."is_super_admin"("uid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."touch_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end $$;


ALTER FUNCTION "cp"."touch_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."atualizar_metricas_cliente"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Atualiza métricas quando pedido é concluído
  IF (TG_OP = 'UPDATE' AND NEW.status = 'concluido' AND OLD.status != 'concluido') THEN
    UPDATE noro_clientes
    SET 
      total_viagens = total_viagens + 1,
      total_gasto = total_gasto + NEW.valor_total,
      ticket_medio = (total_gasto + NEW.valor_total) / (total_viagens + 1),
      data_ultima_viagem = NEW.data_viagem_fim,
      updated_at = NOW()
    WHERE id = NEW.cliente_id;
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."atualizar_metricas_cliente"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."atualizar_metricas_cliente"() IS 'Atualiza métricas do cliente quando pedido é concluído';



CREATE OR REPLACE FUNCTION "public"."atualizar_totais_orcamento"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Atualiza os totais do orçamento quando itens são modificados
  UPDATE noro_orcamentos
  SET 
    valor_total = (
      SELECT COALESCE(SUM(valor_total), 0)
      FROM noro_orcamentos_itens
      WHERE orcamento_id = COALESCE(NEW.orcamento_id, OLD.orcamento_id)
      AND incluido = TRUE
    ),
    valor_custo = (
      SELECT COALESCE(SUM(valor_unitario_custo * quantidade), 0)
      FROM noro_orcamentos_itens
      WHERE orcamento_id = COALESCE(NEW.orcamento_id, OLD.orcamento_id)
      AND incluido = TRUE
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.orcamento_id, OLD.orcamento_id);
  
  -- Atualiza margem
  UPDATE noro_orcamentos
  SET 
    margem_lucro = valor_total - valor_custo,
    margem_percentual = CASE 
      WHEN valor_total > 0 THEN ((valor_total - valor_custo) / valor_total * 100)
      ELSE 0
    END
  WHERE id = COALESCE(NEW.orcamento_id, OLD.orcamento_id);
  
  RETURN COALESCE(NEW, OLD);
END;$$;


ALTER FUNCTION "public"."atualizar_totais_orcamento"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."atualizar_totais_orcamento"() IS 'Atualiza automaticamente os totais e margens do orçamento';



CREATE OR REPLACE FUNCTION "public"."atualizar_ultimo_contato"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Atualiza data de último contato no cliente
  IF NEW.cliente_id IS NOT NULL THEN
    UPDATE noro_clientes
    SET 
      data_ultimo_contato = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.cliente_id;
  END IF;
  
  -- Atualiza última comunicação no pedido
  IF NEW.pedido_id IS NOT NULL THEN
    UPDATE noro_pedidos
    SET 
      ultima_comunicacao = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.pedido_id;
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."atualizar_ultimo_contato"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."atualizar_ultimo_contato"() IS 'Atualiza data de último contato quando há nova interação';



CREATE OR REPLACE FUNCTION "public"."calcular_dias_atraso"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Calcula dias de atraso apenas para transações pendentes
  IF NEW.status = 'pendente' AND NEW.data_vencimento IS NOT NULL THEN
    NEW.dias_atraso := GREATEST(0, EXTRACT(DAY FROM (CURRENT_DATE - NEW.data_vencimento))::INT);
    
    -- Atualiza status para atrasado se passar do vencimento
    IF NEW.dias_atraso > 0 THEN
      NEW.status := 'atrasado';
    END IF;
  ELSE
    NEW.dias_atraso := 0;
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."calcular_dias_atraso"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."calcular_dias_atraso"() IS 'Calcula automaticamente os dias de atraso';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "cp"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "status" "text" DEFAULT 'provisioning'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "plan" "text" DEFAULT 'free'::"text",
    "billing_email" "text",
    "next_invoice_date" "date",
    "notes" "text"
);


ALTER TABLE "cp"."tenants" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cp_select_tenants"() RETURNS SETOF "cp"."tenants"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  select * from cp.tenants;
$$;


ALTER FUNCTION "public"."cp_select_tenants"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."criar_comissao_automatica"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  agente_comissao DECIMAL(5,2);
  valor_comissao DECIMAL(12,2);
BEGIN
  -- Apenas cria comissão se pedido for pago
  IF (TG_OP = 'UPDATE' AND NEW.status_pagamento = 'pago' AND OLD.status_pagamento != 'pago') THEN
    
    -- Busca percentual de comissão do agente (assumindo 5% padrão)
    agente_comissao := 5.00;
    
    -- Calcula valor da comissão
    valor_comissao := NEW.valor_total * (agente_comissao / 100);
    
    -- Cria registro de comissão
    INSERT INTO noro_comissoes (
      pedido_id,
      agente_id,
      tipo,
      descricao,
      valor_base,
      percentual,
      valor_comissao,
      moeda,
      status
    ) VALUES (
      NEW.id,
      NEW.created_by,
      'venda',
      'Comissão sobre pedido ' || NEW.numero_pedido,
      NEW.valor_total,
      agente_comissao,
      valor_comissao,
      NEW.moeda,
      'aprovado'
    );
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."criar_comissao_automatica"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."criar_comissao_automatica"() IS 'Cria comissão automaticamente quando pedido é pago';



CREATE OR REPLACE FUNCTION "public"."generate_numero_orcamento"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  ano_atual VARCHAR(4);
  proximo_numero INT;
  novo_numero VARCHAR(50);
BEGIN
  -- Pega o ano atual
  ano_atual := EXTRACT(YEAR FROM NOW())::VARCHAR;
  
  -- Busca o último número do ano
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(numero_orcamento FROM 'ORC-' || ano_atual || '-(\d+)')
      AS INTEGER
    )
  ), 0) + 1
  INTO proximo_numero
  FROM noro_orcamentos
  WHERE numero_orcamento LIKE 'ORC-' || ano_atual || '-%';
  
  -- Gera o novo número
  novo_numero := 'ORC-' || ano_atual || '-' || LPAD(proximo_numero::VARCHAR, 3, '0');
  
  -- Atribui ao registro
  NEW.numero_orcamento := novo_numero;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."generate_numero_orcamento"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."generate_numero_orcamento"() IS 'Gera número automático de orçamento no formato ORC-YYYY-XXX';



CREATE OR REPLACE FUNCTION "public"."generate_numero_pedido"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  ano_atual VARCHAR(4);
  proximo_numero INT;
  novo_numero VARCHAR(50);
BEGIN
  -- Pega o ano atual
  ano_atual := EXTRACT(YEAR FROM NOW())::VARCHAR;
  
  -- Busca o último número do ano
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(numero_pedido FROM 'PED-' || ano_atual || '-(\d+)')
      AS INTEGER
    )
  ), 0) + 1
  INTO proximo_numero
  FROM noro_pedidos
  WHERE numero_pedido LIKE 'PED-' || ano_atual || '-%';
  
  -- Gera o novo número
  novo_numero := 'PED-' || ano_atual || '-' || LPAD(proximo_numero::VARCHAR, 3, '0');
  
  -- Atribui ao registro
  NEW.numero_pedido := novo_numero;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."generate_numero_pedido"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."generate_numero_pedido"() IS 'Gera número automático de pedido no formato PED-YYYY-XXX';



CREATE OR REPLACE FUNCTION "public"."get_dashboard_metrics"("periodo_dias" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'leads_ativos', (SELECT count(*) FROM public.noro_leads WHERE created_at > now() - (periodo_dias || ' days')::interval),
        'leads_novos_periodo', (SELECT count(*) FROM public.noro_leads WHERE created_at > now() - (periodo_dias || ' days')::interval),
        'pedidos_ativos', 0,
        'receita_periodo', 0,
        'taxa_conversao', 0,
        'tarefas_pendentes', (SELECT count(*) FROM public.noro_tarefas WHERE status = 'pendente')
    ) INTO result;

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_dashboard_metrics"("periodo_dias" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  INSERT INTO public.noro_users (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nome',
    'cliente' -- Todos começam como cliente
  );
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."incrementar_uso_template"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  template_id_usado UUID;
BEGIN
  -- Verifica se há template_id no metadata
  IF NEW.metadata ? 'template_id' THEN
    template_id_usado := (NEW.metadata->>'template_id')::UUID;
    
    -- Incrementa contador de uso
    UPDATE noro_comunicacao_templates
    SET 
      vezes_usado = vezes_usado + 1,
      updated_at = NOW()
    WHERE id = template_id_usado;
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."incrementar_uso_template"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."incrementar_uso_template"() IS 'Incrementa contador de uso quando template é utilizado';



CREATE OR REPLACE FUNCTION "public"."insert_default_empresa_row"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  IF NOT EXISTS (SELECT 1 FROM noro_empresa) THEN
    INSERT INTO noro_empresa (id) VALUES (gen_random_uuid());
  END IF;
END;$$;


ALTER FUNCTION "public"."insert_default_empresa_row"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  RETURN EXISTS (
    SELECT 1 FROM noro_users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_lead"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  INSERT INTO noro_notificacoes (user_id, tipo, titulo, mensagem, link)
  SELECT 
    id,
    'novo_lead',
    'Novo Lead: ' || NEW.nome,
    'Um novo lead foi adicionado. Origem: ' || COALESCE(NEW.origem, 'Desconhecida'),
    '/admin/leads/' || NEW.id::text
  FROM noro_users
  WHERE role IN ('admin', 'super_admin');
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."notify_new_lead"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_orcamento_aceito"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$BEGIN
  IF NEW.status = 'aceito' AND (OLD.status IS NULL OR OLD.status != 'aceito') THEN
    INSERT INTO noro_notificacoes (user_id, tipo, titulo, mensagem, link)
    SELECT 
      id,
      'orcamento_aceito',
      'Orçamento Aceito: ' || NEW.numero_orcamento,
      'Cliente aceitou orçamento no valor de R$ ' || NEW.valor_total::text,
      '/admin/orcamentos/' || NEW.id::text
    FROM noro_users
    WHERE role IN ('admin', 'super_admin');
  END IF;
  
  RETURN NEW;
END;$_$;


ALTER FUNCTION "public"."notify_orcamento_aceito"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."pedido_criar_evento_timeline"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Quando pedido é criado
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO noro_pedidos_timeline (
      pedido_id,
      evento,
      titulo,
      descricao,
      tipo,
      icone,
      cor,
      created_by
    ) VALUES (
      NEW.id,
      'criado',
      'Pedido criado',
      'Pedido ' || NEW.numero_pedido || ' foi criado',
      'sistema',
      'plus',
      'blue',
      NEW.created_by
    );
  END IF;
  
  -- Quando status muda
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO noro_pedidos_timeline (
      pedido_id,
      evento,
      titulo,
      descricao,
      tipo,
      icone,
      cor,
      created_by
    ) VALUES (
      NEW.id,
      'status_alterado',
      'Status alterado',
      'Status alterado de "' || OLD.status || '" para "' || NEW.status || '"',
      'sistema',
      'refresh-cw',
      'yellow',
      NEW.updated_by
    );
  END IF;
  
  -- Quando pagamento muda
  IF (TG_OP = 'UPDATE' AND OLD.status_pagamento IS DISTINCT FROM NEW.status_pagamento) THEN
    INSERT INTO noro_pedidos_timeline (
      pedido_id,
      evento,
      titulo,
      descricao,
      tipo,
      icone,
      cor,
      valor,
      created_by
    ) VALUES (
      NEW.id,
      'pagamento_alterado',
      'Status de pagamento alterado',
      'Status alterado de "' || OLD.status_pagamento || '" para "' || NEW.status_pagamento || '"',
      'sistema',
      'dollar-sign',
      CASE NEW.status_pagamento
        WHEN 'pago' THEN 'green'
        WHEN 'parcial' THEN 'yellow'
        ELSE 'blue'
      END,
      NEW.valor_pago,
      NEW.updated_by
    );
  END IF;
  
  -- Quando é cancelado
  IF (TG_OP = 'UPDATE' AND NEW.cancelado_em IS NOT NULL AND OLD.cancelado_em IS NULL) THEN
    INSERT INTO noro_pedidos_timeline (
      pedido_id,
      evento,
      titulo,
      descricao,
      tipo,
      icone,
      cor,
      created_by
    ) VALUES (
      NEW.id,
      'cancelado',
      'Pedido cancelado',
      COALESCE('Motivo: ' || NEW.cancelado_motivo, 'Pedido foi cancelado'),
      'sistema',
      'x',
      'red',
      NEW.cancelado_por
    );
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."pedido_criar_evento_timeline"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."pedido_criar_evento_timeline"() IS 'Cria eventos automaticamente na timeline do pedido';



CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."trigger_set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_lead_on_pedido"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE noro_leads
    SET status = 'ganho'
    WHERE id = NEW.lead_id;
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."update_lead_on_pedido"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_pedido_status_pagamento"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  IF NEW.valor_pago >= NEW.valor_total THEN
    NEW.status_pagamento := 'pago_total';
  ELSIF NEW.valor_pago > 0 THEN
    NEW.status_pagamento := 'pago_parcial';
  ELSE
    NEW.status_pagamento := 'pendente';
  END IF;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."update_pedido_status_pagamento"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    -- O PERFORM executa a função vault.create_secret e descarta seu resultado.
    PERFORM vault.create_secret(p_secret, p_name);
END;$$;


ALTER FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."api_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "hash" "text" NOT NULL,
    "last4" "text" NOT NULL,
    "scope" "text"[] DEFAULT ARRAY[]::"text"[] NOT NULL,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."billing_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "period_start" "date" NOT NULL,
    "period_end" "date" NOT NULL,
    "amount_cents" integer DEFAULT 0 NOT NULL,
    "currency" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "items" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."billing_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."modules_registry" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "is_core" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "cp"."modules_registry" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "billing_event_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "provider_ref" "text",
    "amount_cents" integer NOT NULL,
    "currency" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "status" "text" NOT NULL,
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."plan_features" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "key" "text" NOT NULL,
    "value" "text" NOT NULL
);


ALTER TABLE "cp"."plan_features" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "price_cents" integer DEFAULT 0 NOT NULL,
    "currency" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "sort_order" integer DEFAULT 100 NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "cp"."plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."system_events" (
    "id" bigint NOT NULL,
    "actor_user_id" "uuid",
    "tenant_id" "uuid",
    "type" "text" NOT NULL,
    "message" "text",
    "data" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."system_events" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "cp"."system_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "cp"."system_events_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "cp"."system_events_id_seq" OWNED BY "cp"."system_events"."id";



CREATE TABLE IF NOT EXISTS "cp"."tenant_modules" (
    "tenant_id" "uuid" NOT NULL,
    "module_id" "uuid" NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "cp"."tenant_modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."tenant_plan" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "starts_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ends_at" timestamp with time zone,
    "auto_renew" boolean DEFAULT true NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "cp"."tenant_plan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."tenant_settings" (
    "tenant_id" "uuid" NOT NULL,
    "locale" "text" DEFAULT 'pt-BR'::"text",
    "timezone" "text" DEFAULT 'America/Sao_Paulo'::"text",
    "color_primary" "text" DEFAULT '#5053c4'::"text",
    "logo_url" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."tenant_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."usage_counters" (
    "id" bigint NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "period_start" "date" NOT NULL,
    "period_end" "date" NOT NULL,
    "metric" "text" NOT NULL,
    "value" numeric DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."usage_counters" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "cp"."usage_counters_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "cp"."usage_counters_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "cp"."usage_counters_id_seq" OWNED BY "cp"."usage_counters"."id";



CREATE TABLE IF NOT EXISTS "cp"."user_tenant_roles" (
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_tenant_roles_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'manager'::"text", 'agent'::"text", 'finance'::"text", 'viewer'::"text"])))
);


ALTER TABLE "cp"."user_tenant_roles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "cp"."v_users" AS
 SELECT "u"."id",
    "u"."email",
    "u"."created_at",
    "u"."last_sign_in_at",
    COALESCE("m"."tenants_count", 0) AS "tenants_count"
   FROM ("auth"."users" "u"
     LEFT JOIN ( SELECT "utr"."user_id",
            ("count"(DISTINCT "utr"."tenant_id"))::integer AS "tenants_count"
           FROM "cp"."user_tenant_roles" "utr"
          GROUP BY "utr"."user_id") "m" ON (("m"."user_id" = "u"."id")));


ALTER VIEW "cp"."v_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."webhooks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "code" "text" NOT NULL,
    "url" "text" NOT NULL,
    "secret" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."webhooks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_audit_log" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "acao" character varying(100) NOT NULL,
    "entidade" character varying(100) NOT NULL,
    "entidade_id" "uuid",
    "descricao" "text",
    "ip_address" "inet",
    "user_agent" "text",
    "dados_anteriores" "jsonb",
    "dados_novos" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_audit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_campanhas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "nome" character varying(255) NOT NULL,
    "assunto" character varying(255) NOT NULL,
    "conteudo_html" "text" NOT NULL,
    "status" character varying(50) DEFAULT 'rascunho'::character varying,
    "segmento" "jsonb",
    "total_destinatarios" integer,
    "total_enviados" integer DEFAULT 0,
    "total_abertos" integer DEFAULT 0,
    "total_cliques" integer DEFAULT 0,
    "agendado_para" timestamp without time zone,
    "enviado_em" timestamp without time zone,
    "created_by" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "nomade_campanhas_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('rascunho'::character varying)::"text", ('agendado'::character varying)::"text", ('enviando'::character varying)::"text", ('enviado'::character varying)::"text", ('cancelado'::character varying)::"text"])))
);


ALTER TABLE "public"."noro_campanhas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_clientes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nome" character varying(255) NOT NULL,
    "email" character varying(255),
    "telefone" character varying(50),
    "whatsapp" character varying(50),
    "cpf" character varying(20),
    "passaporte" character varying(50),
    "data_nascimento" "date",
    "nacionalidade" character varying(100),
    "profissao" character varying(100),
    "status" character varying(50) DEFAULT 'ativo'::character varying,
    "tipo" character varying(50) DEFAULT 'pessoa_fisica'::character varying,
    "segmento" character varying(100),
    "nivel" character varying(50) DEFAULT 'bronze'::character varying,
    "origem_lead_id" "uuid",
    "agente_responsavel_id" "uuid",
    "total_viagens" integer DEFAULT 0,
    "total_gasto" numeric(12,2) DEFAULT 0,
    "ticket_medio" numeric(12,2) DEFAULT 0,
    "nps_score" integer,
    "data_primeiro_contato" timestamp with time zone,
    "data_ultima_viagem" timestamp with time zone,
    "data_proxima_viagem" timestamp with time zone,
    "data_ultimo_contato" timestamp with time zone,
    "idioma_preferido" character varying(10) DEFAULT 'pt'::character varying,
    "moeda_preferida" character varying(10) DEFAULT 'EUR'::character varying,
    "tags" "text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    "razao_social" character varying(255),
    "nome_fantasia" character varying(255),
    "cnpj" character varying(20),
    "inscricao_estadual" character varying(50),
    "inscricao_municipal" character varying(50),
    "responsavel_nome" character varying(255),
    "responsavel_cargo" character varying(100),
    "responsavel_email" character varying(255),
    "responsavel_telefone" character varying(50)
);


ALTER TABLE "public"."noro_clientes" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_clientes" IS 'Tabela master de clientes - visão 360°';



COMMENT ON COLUMN "public"."noro_clientes"."total_viagens" IS 'Calculado automaticamente via trigger';



COMMENT ON COLUMN "public"."noro_clientes"."total_gasto" IS 'Calculado automaticamente via trigger';



COMMENT ON COLUMN "public"."noro_clientes"."ticket_medio" IS 'Calculado automaticamente: total_gasto / total_viagens';



COMMENT ON COLUMN "public"."noro_clientes"."razao_social" IS 'Razão social da empresa (apenas PJ)';



COMMENT ON COLUMN "public"."noro_clientes"."nome_fantasia" IS 'Nome fantasia da empresa (apenas PJ)';



COMMENT ON COLUMN "public"."noro_clientes"."cnpj" IS 'CNPJ da empresa (apenas PJ)';



COMMENT ON COLUMN "public"."noro_clientes"."responsavel_nome" IS 'Nome do responsável/contato na empresa';



CREATE TABLE IF NOT EXISTS "public"."noro_clientes_contatos_emergencia" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "nome" character varying(255) NOT NULL,
    "parentesco" character varying(100),
    "telefone" character varying(50) NOT NULL,
    "email" character varying(255),
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_clientes_contatos_emergencia" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_clientes_contatos_emergencia" IS 'Contatos de emergência do cliente';



CREATE TABLE IF NOT EXISTS "public"."noro_clientes_documentos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "numero" character varying(100),
    "pais_emissor" character varying(100),
    "orgao_emissor" character varying(100),
    "data_emissao" "date",
    "data_validade" "date",
    "status" character varying(50) DEFAULT 'valido'::character varying,
    "arquivo_url" "text",
    "arquivo_public_id" character varying(255),
    "arquivo_nome" character varying(255),
    "arquivo_tamanho" integer,
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_clientes_documentos" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_clientes_documentos" IS 'Documentos do cliente (passaporte, vistos, etc)';



CREATE TABLE IF NOT EXISTS "public"."noro_clientes_enderecos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "principal" boolean DEFAULT false,
    "logradouro" character varying(255) NOT NULL,
    "numero" character varying(20),
    "complemento" character varying(100),
    "bairro" character varying(100),
    "cidade" character varying(100) NOT NULL,
    "estado" character varying(100),
    "cep" character varying(20),
    "pais" character varying(100) DEFAULT 'Brasil'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_clientes_enderecos" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_clientes_enderecos" IS 'Endereços do cliente';



CREATE TABLE IF NOT EXISTS "public"."noro_clientes_milhas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "companhia" character varying(100) NOT NULL,
    "numero_programa" character varying(100) NOT NULL,
    "categoria" character varying(50),
    "saldo_estimado" integer,
    "data_validade" "date",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_clientes_milhas" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_clientes_milhas" IS 'Programas de fidelidade/milhas do cliente';



CREATE TABLE IF NOT EXISTS "public"."noro_clientes_preferencias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "frequencia_viagem" character varying(50),
    "orcamento_medio" character varying(50),
    "estilo_viagem" "text"[],
    "destinos_favoritos" "text"[],
    "destinos_desejados" "text"[],
    "assento_preferido" character varying(50),
    "classe_preferida" character varying(50),
    "cia_aerea_preferida" "text"[],
    "programas_fidelidade" "jsonb" DEFAULT '[]'::"jsonb",
    "tipo_hospedagem" "text"[],
    "preferencias_quarto" character varying(100),
    "categoria_hotel" character varying(50),
    "restricoes_alimentares" "text"[],
    "refeicao_preferida" character varying(50),
    "necessidades_especiais" "text",
    "mobilidade_reduzida" boolean DEFAULT false,
    "viaja_com_criancas" boolean DEFAULT false,
    "idade_criancas" integer[],
    "viaja_com_pets" boolean DEFAULT false,
    "seguro_preferido" character varying(100),
    "cobertura_minima" numeric(12,2),
    "cobertura_covid" boolean DEFAULT true,
    "aluguel_carro" boolean DEFAULT false,
    "categoria_carro" character varying(50),
    "tours_guiados" boolean DEFAULT true,
    "transfers" boolean DEFAULT true,
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_clientes_preferencias" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_clientes_preferencias" IS 'Preferências de viagem do cliente';



CREATE TABLE IF NOT EXISTS "public"."noro_comissoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pedido_id" "uuid" NOT NULL,
    "agente_id" "uuid" NOT NULL,
    "transacao_id" "uuid",
    "tipo" character varying(50) DEFAULT 'venda'::character varying,
    "descricao" "text",
    "valor_base" numeric(12,2) NOT NULL,
    "percentual" numeric(5,2) NOT NULL,
    "valor_comissao" numeric(12,2) NOT NULL,
    "moeda" character varying(10) DEFAULT 'EUR'::character varying,
    "status" character varying(50) DEFAULT 'pendente'::character varying,
    "data_aprovacao" "date",
    "aprovado_por" "uuid",
    "data_pagamento" "date",
    "pago_por" "uuid",
    "metodo_pagamento" character varying(100),
    "comprovante_url" "text",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_comissoes" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_comissoes" IS 'Comissões dos agentes';



CREATE TABLE IF NOT EXISTS "public"."noro_comunicacao_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "nome" character varying(255) NOT NULL,
    "codigo" character varying(100),
    "descricao" "text",
    "assunto_template" "text",
    "conteudo_template" "text" NOT NULL,
    "variaveis" "text"[],
    "exemplo_preview" "text",
    "categoria" character varying(100),
    "trigger_automatico" character varying(100),
    "ativo" boolean DEFAULT true,
    "permite_edicao" boolean DEFAULT true,
    "cor_primaria" character varying(20),
    "assinatura_email" "text",
    "rodape_template" "text",
    "vezes_usado" integer DEFAULT 0,
    "taxa_abertura" numeric(5,2),
    "taxa_resposta" numeric(5,2),
    "tags" "text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_comunicacao_templates" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_comunicacao_templates" IS 'Templates reutilizáveis para comunicação';



COMMENT ON COLUMN "public"."noro_comunicacao_templates"."variaveis" IS 'Variáveis que podem ser usadas no template';



CREATE TABLE IF NOT EXISTS "public"."noro_configuracoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "tipo" "text" NOT NULL,
    "chave" "text" NOT NULL,
    "valor" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_configuracoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_empresa" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nome_empresa" "text",
    "documento" "text",
    "endereco" "jsonb",
    "telefone_comercial" "text",
    "email_principal" "text",
    "website" "text",
    "logo_url" "text",
    "data_fundacao" "date",
    "contato_principal" "jsonb",
    "dados_bancarios" "jsonb",
    "moeda_padrao" character varying(10) DEFAULT 'EUR'::character varying,
    "informacoes_fiscais" "jsonb",
    "redes_sociais" "jsonb",
    "horario_funcionamento" "text",
    "idiomas_falados" "text"[],
    "integracoes" "jsonb",
    "documentos" "jsonb",
    "branding" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_empresa" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_fornecedores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nome" character varying(255) NOT NULL,
    "nome_fantasia" character varying(255),
    "tipo" character varying(100),
    "email" character varying(255),
    "telefone" character varying(50),
    "whatsapp" character varying(50),
    "website" character varying(255),
    "contato_nome" character varying(255),
    "contato_cargo" character varying(100),
    "cnpj_nif" character varying(50),
    "inscricao_estadual" character varying(50),
    "endereco" "text",
    "cidade" character varying(100),
    "estado" character varying(100),
    "pais" character varying(100),
    "cep" character varying(20),
    "banco" character varying(100),
    "agencia" character varying(20),
    "conta" character varying(50),
    "pix" character varying(100),
    "swift" character varying(50),
    "iban" character varying(50),
    "condicoes_pagamento" "text",
    "prazo_pagamento_dias" integer DEFAULT 30,
    "percentual_comissao" numeric(5,2) DEFAULT 0,
    "desconto_padrao" numeric(5,2) DEFAULT 0,
    "rating" numeric(3,2),
    "total_avaliacoes" integer DEFAULT 0,
    "status" character varying(50) DEFAULT 'ativo'::character varying,
    "motivo_bloqueio" "text",
    "categorias" "text"[],
    "tags" "text"[],
    "observacoes" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."noro_fornecedores" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_fornecedores" IS 'Cadastro de fornecedores';



CREATE TABLE IF NOT EXISTS "public"."noro_leads" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "nome" character varying(255) NOT NULL,
    "email" character varying(255),
    "telefone" character varying(50),
    "whatsapp" character varying(50),
    "origem" character varying(100),
    "canal_preferencial" character varying(50),
    "status" character varying(50) DEFAULT 'novo'::character varying,
    "valor_estimado" numeric(10,2),
    "probabilidade" integer DEFAULT 50,
    "destino_interesse" "text",
    "periodo_viagem" "text",
    "num_pessoas" integer,
    "observacoes" "text",
    "proxima_acao" "text",
    "data_proxima_acao" timestamp without time zone,
    "responsavel" character varying(255),
    "tags" "text"[],
    "metadata" "jsonb",
    "perdido_motivo" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "nomade_leads_probabilidade_check" CHECK ((("probabilidade" >= 0) AND ("probabilidade" <= 100))),
    CONSTRAINT "nomade_leads_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('novo'::character varying)::"text", ('contato_inicial'::character varying)::"text", ('qualificado'::character varying)::"text", ('proposta_enviada'::character varying)::"text", ('negociacao'::character varying)::"text", ('ganho'::character varying)::"text", ('perdido'::character varying)::"text", ('inativo'::character varying)::"text"])))
);


ALTER TABLE "public"."noro_leads" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."noro_funil_vendas" AS
 SELECT "status",
    "count"(*) AS "quantidade",
    COALESCE("sum"("valor_estimado"), (0)::numeric) AS "valor_total",
    "round"("avg"("probabilidade"), 0) AS "probabilidade_media"
   FROM "public"."noro_leads"
  WHERE (("status")::"text" <> ALL (ARRAY[('perdido'::character varying)::"text", ('inativo'::character varying)::"text"]))
  GROUP BY "status"
  ORDER BY
        CASE "status"
            WHEN 'novo'::"text" THEN 1
            WHEN 'contato_inicial'::"text" THEN 2
            WHEN 'qualificado'::"text" THEN 3
            WHEN 'proposta_enviada'::"text" THEN 4
            WHEN 'negociacao'::"text" THEN 5
            WHEN 'ganho'::"text" THEN 6
            ELSE NULL::integer
        END;


ALTER VIEW "public"."noro_funil_vendas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_interacoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cliente_id" "uuid",
    "lead_id" "uuid",
    "pedido_id" "uuid",
    "orcamento_id" "uuid",
    "tipo" character varying(50) NOT NULL,
    "canal" character varying(50),
    "sentido" character varying(50),
    "assunto" character varying(255),
    "conteudo" "text",
    "resumo" "text",
    "anexos" "jsonb" DEFAULT '[]'::"jsonb",
    "lido" boolean DEFAULT false,
    "lido_em" timestamp with time zone,
    "respondido" boolean DEFAULT false,
    "respondido_em" timestamp with time zone,
    "sentimento" character varying(50),
    "sentimento_score" numeric(3,2),
    "intencao" character varying(100),
    "prioridade" character varying(50),
    "agendada_para" timestamp with time zone,
    "tags" "text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "agente_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_interacoes" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_interacoes" IS 'Registro de todas as interações com leads e clientes';



COMMENT ON COLUMN "public"."noro_interacoes"."resumo" IS 'Resumo automático gerado por IA';



COMMENT ON COLUMN "public"."noro_interacoes"."sentimento_score" IS 'Score de sentimento calculado por IA';



CREATE TABLE IF NOT EXISTS "public"."noro_newsletter" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "nome" character varying(255),
    "status" character varying(20) DEFAULT 'ativo'::character varying,
    "origem" character varying(100),
    "tags" "text"[],
    "interesses" "text"[],
    "metadata" "jsonb",
    "confirmado_em" timestamp without time zone,
    "descadastrado_em" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "nomade_newsletter_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('ativo'::character varying)::"text", ('inativo'::character varying)::"text", ('descadastrado'::character varying)::"text", ('bounce'::character varying)::"text"])))
);


ALTER TABLE "public"."noro_newsletter" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_notificacoes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "tipo" character varying(50) NOT NULL,
    "titulo" character varying(255) NOT NULL,
    "mensagem" "text",
    "link" "text",
    "lida" boolean DEFAULT false,
    "lida_em" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_notificacoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_orcamentos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "numero_orcamento" character varying(50) NOT NULL,
    "cliente_id" "uuid",
    "lead_id" "uuid",
    "titulo" character varying(255) NOT NULL,
    "descricao" "text",
    "destinos" "text"[] NOT NULL,
    "data_viagem_inicio" "date",
    "data_viagem_fim" "date",
    "num_dias" integer,
    "num_pessoas" integer DEFAULT 1,
    "num_adultos" integer DEFAULT 1,
    "num_criancas" integer DEFAULT 0,
    "num_bebes" integer DEFAULT 0,
    "valor_total" numeric(12,2) DEFAULT 0 NOT NULL,
    "valor_custo" numeric(12,2) DEFAULT 0,
    "margem_lucro" numeric(12,2) DEFAULT 0,
    "margem_percentual" numeric(5,2) DEFAULT 0,
    "valor_sinal" numeric(12,2) DEFAULT 0,
    "moeda" character varying(10) DEFAULT 'EUR'::character varying,
    "status" character varying(50) DEFAULT 'rascunho'::character varying,
    "validade_ate" "date",
    "prioridade" character varying(50) DEFAULT 'media'::character varying,
    "enviado_em" timestamp with time zone,
    "enviado_para" character varying(255),
    "visualizado_em" timestamp with time zone,
    "visualizado_contador" integer DEFAULT 0,
    "respondido_em" timestamp with time zone,
    "aprovado_em" timestamp with time zone,
    "recusado_em" timestamp with time zone,
    "recusado_motivo" "text",
    "roteiro" "jsonb" DEFAULT '[]'::"jsonb",
    "condicoes_pagamento" "text",
    "politica_cancelamento" "text",
    "observacoes_internas" "text",
    "observacoes_cliente" "text",
    "pdf_url" "text",
    "pdf_public_id" character varying(255),
    "pdf_gerado_em" timestamp with time zone,
    "pdf_versao" integer DEFAULT 1,
    "template_usado" character varying(100),
    "personalizacao" "jsonb" DEFAULT '{}'::"jsonb",
    "tags" "text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."noro_orcamentos" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_orcamentos" IS 'Orçamentos de viagens';



COMMENT ON COLUMN "public"."noro_orcamentos"."visualizado_contador" IS 'Quantas vezes o orçamento foi visualizado';



COMMENT ON COLUMN "public"."noro_orcamentos"."roteiro" IS 'Roteiro dia a dia em formato JSON';



CREATE TABLE IF NOT EXISTS "public"."noro_orcamentos_itens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "orcamento_id" "uuid" NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "categoria" character varying(100),
    "fornecedor" character varying(255),
    "fornecedor_id" "uuid",
    "produto" character varying(255) NOT NULL,
    "descricao" "text",
    "data_servico" "date",
    "data_fim" "date",
    "hora_inicio" time without time zone,
    "hora_fim" time without time zone,
    "localizador" character varying(100),
    "quantidade" integer DEFAULT 1,
    "unidade" character varying(50) DEFAULT 'unidade'::character varying,
    "valor_unitario_custo" numeric(12,2) DEFAULT 0,
    "valor_unitario_venda" numeric(12,2) NOT NULL,
    "valor_total" numeric(12,2) NOT NULL,
    "margem" numeric(12,2) DEFAULT 0,
    "margem_percentual" numeric(5,2) DEFAULT 0,
    "detalhes" "jsonb" DEFAULT '{}'::"jsonb",
    "incluido" boolean DEFAULT true,
    "opcional" boolean DEFAULT false,
    "ordem" integer DEFAULT 0,
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_orcamentos_itens" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_orcamentos_itens" IS 'Itens detalhados do orçamento';



COMMENT ON COLUMN "public"."noro_orcamentos_itens"."incluido" IS 'TRUE = incluído no pacote, FALSE = adicional';



COMMENT ON COLUMN "public"."noro_orcamentos_itens"."opcional" IS 'TRUE = item opcional que o cliente pode escolher';



CREATE TABLE IF NOT EXISTS "public"."noro_pedidos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "numero_pedido" character varying(50) NOT NULL,
    "orcamento_id" "uuid",
    "cliente_id" "uuid" NOT NULL,
    "titulo" character varying(255) NOT NULL,
    "destinos" "text"[] NOT NULL,
    "data_viagem_inicio" "date" NOT NULL,
    "data_viagem_fim" "date" NOT NULL,
    "num_dias" integer NOT NULL,
    "num_pessoas" integer DEFAULT 1,
    "valor_total" numeric(12,2) NOT NULL,
    "valor_pago" numeric(12,2) DEFAULT 0,
    "valor_pendente" numeric(12,2) DEFAULT 0,
    "moeda" character varying(10) DEFAULT 'EUR'::character varying,
    "status_pagamento" character varying(50) DEFAULT 'pendente'::character varying,
    "metodo_pagamento" character varying(100),
    "condicoes_pagamento" "text",
    "num_parcelas" integer DEFAULT 1,
    "valor_parcela" numeric(12,2),
    "status" character varying(50) DEFAULT 'confirmado'::character varying,
    "urgente" boolean DEFAULT false,
    "cancelado_em" timestamp with time zone,
    "cancelado_por" "uuid",
    "cancelado_motivo" "text",
    "valor_reembolso" numeric(12,2),
    "passageiros" "jsonb" DEFAULT '[]'::"jsonb",
    "vouchers" "jsonb" DEFAULT '[]'::"jsonb",
    "contratos" "jsonb" DEFAULT '[]'::"jsonb",
    "documentos" "jsonb" DEFAULT '[]'::"jsonb",
    "ultima_comunicacao" timestamp with time zone,
    "proxima_acao" "text",
    "proxima_acao_data" "date",
    "observacoes" "text",
    "observacoes_internas" "text",
    "tags" "text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."noro_pedidos" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_pedidos" IS 'Pedidos/Reservas confirmadas';



COMMENT ON COLUMN "public"."noro_pedidos"."passageiros" IS 'Lista de passageiros em formato JSON';



COMMENT ON COLUMN "public"."noro_pedidos"."vouchers" IS 'Vouchers e documentos de viagem';



CREATE TABLE IF NOT EXISTS "public"."noro_pedidos_itens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pedido_id" "uuid" NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "categoria" character varying(100),
    "fornecedor" character varying(255),
    "fornecedor_id" "uuid",
    "fornecedor_contato" character varying(255),
    "produto" character varying(255) NOT NULL,
    "descricao" "text",
    "data_servico" "date",
    "data_fim" "date",
    "hora_inicio" time without time zone,
    "hora_fim" time without time zone,
    "localizador" character varying(100),
    "status_confirmacao" character varying(50) DEFAULT 'pendente'::character varying,
    "confirmado_em" timestamp with time zone,
    "confirmado_por" "uuid",
    "quantidade" integer DEFAULT 1,
    "valor_unitario" numeric(12,2) NOT NULL,
    "valor_total" numeric(12,2) NOT NULL,
    "valor_custo" numeric(12,2),
    "comissao" numeric(12,2) DEFAULT 0,
    "comissao_percentual" numeric(5,2) DEFAULT 0,
    "detalhes" "jsonb" DEFAULT '{}'::"jsonb",
    "voucher_url" "text",
    "voucher_public_id" character varying(255),
    "voucher_emitido_em" timestamp with time zone,
    "observacoes" "text",
    "observacoes_internas" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_pedidos_itens" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_pedidos_itens" IS 'Itens/serviços do pedido';



CREATE TABLE IF NOT EXISTS "public"."noro_pedidos_timeline" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pedido_id" "uuid" NOT NULL,
    "evento" character varying(100) NOT NULL,
    "titulo" character varying(255),
    "descricao" "text",
    "tipo" character varying(50),
    "icone" character varying(50),
    "cor" character varying(50),
    "item_id" "uuid",
    "valor" numeric(12,2),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."noro_pedidos_timeline" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_pedidos_timeline" IS 'Histórico de eventos do pedido';



CREATE TABLE IF NOT EXISTS "public"."noro_tarefas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "lead_id" "uuid",
    "pedido_id" "uuid",
    "titulo" "text" NOT NULL,
    "descricao" "text",
    "prioridade" character varying(20) DEFAULT 'media'::character varying,
    "status" character varying(20) DEFAULT 'pendente'::character varying,
    "responsavel" "uuid",
    "data_vencimento" timestamp without time zone,
    "concluido_em" timestamp without time zone,
    "tags" "text"[],
    "created_by" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "nomade_tarefas_prioridade_check" CHECK ((("prioridade")::"text" = ANY (ARRAY[('baixa'::character varying)::"text", ('media'::character varying)::"text", ('alta'::character varying)::"text", ('urgente'::character varying)::"text"]))),
    CONSTRAINT "nomade_tarefas_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('pendente'::character varying)::"text", ('em_andamento'::character varying)::"text", ('concluido'::character varying)::"text", ('cancelado'::character varying)::"text"])))
);


ALTER TABLE "public"."noro_tarefas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_transacoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "categoria" character varying(100) NOT NULL,
    "subcategoria" character varying(100),
    "pedido_id" "uuid",
    "cliente_id" "uuid",
    "fornecedor_id" "uuid",
    "fornecedor_nome" character varying(255),
    "descricao" "text" NOT NULL,
    "numero_documento" character varying(100),
    "valor" numeric(12,2) NOT NULL,
    "moeda" character varying(10) DEFAULT 'EUR'::character varying,
    "valor_convertido_brl" numeric(12,2),
    "taxa_conversao" numeric(10,6),
    "data_transacao" "date" NOT NULL,
    "data_vencimento" "date",
    "data_pagamento" "date",
    "data_competencia" "date",
    "status" character varying(50) DEFAULT 'pendente'::character varying,
    "dias_atraso" integer DEFAULT 0,
    "metodo_pagamento" character varying(100),
    "conta_bancaria" character varying(100),
    "comprovante_url" "text",
    "comprovante_public_id" character varying(255),
    "nota_fiscal_numero" character varying(100),
    "nota_fiscal_url" "text",
    "nota_fiscal_public_id" character varying(255),
    "nota_fiscal_emitida" boolean DEFAULT false,
    "parcela_numero" integer,
    "parcela_total" integer,
    "transacao_origem_id" "uuid",
    "centro_custo" character varying(100),
    "conta_contabil" character varying(100),
    "plano_contas" character varying(100),
    "reconciliado" boolean DEFAULT false,
    "reconciliado_em" timestamp with time zone,
    "reconciliado_por" "uuid",
    "tags" "text"[],
    "observacoes" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."noro_transacoes" OWNER TO "postgres";


COMMENT ON TABLE "public"."noro_transacoes" IS 'Transações financeiras (receitas, despesas, comissões)';



COMMENT ON COLUMN "public"."noro_transacoes"."dias_atraso" IS 'Calculado automaticamente via trigger';



CREATE TABLE IF NOT EXISTS "public"."noro_update_tokens" (
    "token" "uuid" NOT NULL,
    "cliente_id" "uuid" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "used_at" timestamp with time zone
);


ALTER TABLE "public"."noro_update_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."noro_users" (
    "id" "uuid" NOT NULL,
    "email" character varying(255) NOT NULL,
    "nome" character varying(255),
    "role" character varying(20) DEFAULT 'cliente'::character varying,
    "avatar_url" "text",
    "telefone" character varying(50),
    "whatsapp" character varying(50),
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "nomade_users_role_check" CHECK ((("role")::"text" = ANY (ARRAY[('cliente'::character varying)::"text", ('admin'::character varying)::"text", ('super_admin'::character varying)::"text"])))
);


ALTER TABLE "public"."noro_users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."orcamento_sequence"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."orcamento_sequence" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pedido_sequence"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pedido_sequence" OWNER TO "postgres";


ALTER TABLE ONLY "cp"."system_events" ALTER COLUMN "id" SET DEFAULT "nextval"('"cp"."system_events_id_seq"'::"regclass");



ALTER TABLE ONLY "cp"."usage_counters" ALTER COLUMN "id" SET DEFAULT "nextval"('"cp"."usage_counters_id_seq"'::"regclass");



ALTER TABLE ONLY "cp"."api_keys"
    ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."api_keys"
    ADD CONSTRAINT "api_keys_tenant_id_name_key" UNIQUE ("tenant_id", "name");



ALTER TABLE ONLY "cp"."billing_events"
    ADD CONSTRAINT "billing_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."modules_registry"
    ADD CONSTRAINT "modules_registry_code_key" UNIQUE ("code");



ALTER TABLE ONLY "cp"."modules_registry"
    ADD CONSTRAINT "modules_registry_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."plan_features"
    ADD CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."plan_features"
    ADD CONSTRAINT "plan_features_plan_id_key_key" UNIQUE ("plan_id", "key");



ALTER TABLE ONLY "cp"."plans"
    ADD CONSTRAINT "plans_code_key" UNIQUE ("code");



ALTER TABLE ONLY "cp"."plans"
    ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."system_events"
    ADD CONSTRAINT "system_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_pkey" PRIMARY KEY ("tenant_id", "module_id");



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."tenant_settings"
    ADD CONSTRAINT "tenant_settings_pkey" PRIMARY KEY ("tenant_id");



ALTER TABLE ONLY "cp"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."tenants"
    ADD CONSTRAINT "tenants_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_tenant_id_period_start_metric_key" UNIQUE ("tenant_id", "period_start", "metric");



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_user_id_tenant_id_key" UNIQUE ("user_id", "tenant_id");



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_tenant_id_code_key" UNIQUE ("tenant_id", "code");



ALTER TABLE ONLY "public"."noro_audit_log"
    ADD CONSTRAINT "nomade_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_campanhas"
    ADD CONSTRAINT "nomade_campanhas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_clientes_contatos_emergencia"
    ADD CONSTRAINT "nomade_clientes_contatos_emergencia_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_clientes_documentos"
    ADD CONSTRAINT "nomade_clientes_documentos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "nomade_clientes_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."noro_clientes_enderecos"
    ADD CONSTRAINT "nomade_clientes_enderecos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_clientes_milhas"
    ADD CONSTRAINT "nomade_clientes_milhas_cliente_id_companhia_key" UNIQUE ("cliente_id", "companhia");



ALTER TABLE ONLY "public"."noro_clientes_milhas"
    ADD CONSTRAINT "nomade_clientes_milhas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "nomade_clientes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_clientes_preferencias"
    ADD CONSTRAINT "nomade_clientes_preferencias_cliente_id_key" UNIQUE ("cliente_id");



ALTER TABLE ONLY "public"."noro_clientes_preferencias"
    ADD CONSTRAINT "nomade_clientes_preferencias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_comissoes"
    ADD CONSTRAINT "nomade_comissoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_comunicacao_templates"
    ADD CONSTRAINT "nomade_comunicacao_templates_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."noro_comunicacao_templates"
    ADD CONSTRAINT "nomade_comunicacao_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_configuracoes"
    ADD CONSTRAINT "nomade_configuracoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_configuracoes"
    ADD CONSTRAINT "nomade_configuracoes_user_id_tipo_chave_key" UNIQUE ("user_id", "tipo", "chave");



ALTER TABLE ONLY "public"."noro_empresa"
    ADD CONSTRAINT "nomade_empresa_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_fornecedores"
    ADD CONSTRAINT "nomade_fornecedores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "nomade_interacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_leads"
    ADD CONSTRAINT "nomade_leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_newsletter"
    ADD CONSTRAINT "nomade_newsletter_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."noro_newsletter"
    ADD CONSTRAINT "nomade_newsletter_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_notificacoes"
    ADD CONSTRAINT "nomade_notificacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_orcamentos_itens"
    ADD CONSTRAINT "nomade_orcamentos_itens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "nomade_orcamentos_numero_orcamento_key" UNIQUE ("numero_orcamento");



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "nomade_orcamentos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_pedidos_itens"
    ADD CONSTRAINT "nomade_pedidos_itens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "nomade_pedidos_numero_pedido_key" UNIQUE ("numero_pedido");



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "nomade_pedidos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_pedidos_timeline"
    ADD CONSTRAINT "nomade_pedidos_timeline_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "nomade_tarefas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "nomade_transacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_users"
    ADD CONSTRAINT "nomade_users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."noro_users"
    ADD CONSTRAINT "nomade_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."noro_update_tokens"
    ADD CONSTRAINT "noro_update_tokens_pkey" PRIMARY KEY ("token");



CREATE UNIQUE INDEX "tenants_slug_idx" ON "cp"."tenants" USING "btree" ("slug");



CREATE INDEX "idx_audit_entidade" ON "public"."noro_audit_log" USING "btree" ("entidade", "entidade_id");



CREATE INDEX "idx_audit_user" ON "public"."noro_audit_log" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_clientes_agente" ON "public"."noro_clientes" USING "btree" ("agente_responsavel_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_clientes_cnpj" ON "public"."noro_clientes" USING "btree" ("cnpj") WHERE ("cnpj" IS NOT NULL);



CREATE INDEX "idx_clientes_contatos_cliente" ON "public"."noro_clientes_contatos_emergencia" USING "btree" ("cliente_id");



CREATE INDEX "idx_clientes_cpf" ON "public"."noro_clientes" USING "btree" ("cpf") WHERE ("cpf" IS NOT NULL);



CREATE INDEX "idx_clientes_docs_cliente" ON "public"."noro_clientes_documentos" USING "btree" ("cliente_id");



CREATE INDEX "idx_clientes_docs_tipo" ON "public"."noro_clientes_documentos" USING "btree" ("tipo");



CREATE INDEX "idx_clientes_docs_validade" ON "public"."noro_clientes_documentos" USING "btree" ("data_validade") WHERE ("data_validade" IS NOT NULL);



CREATE INDEX "idx_clientes_email" ON "public"."noro_clientes" USING "btree" ("email") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_clientes_enderecos_cliente" ON "public"."noro_clientes_enderecos" USING "btree" ("cliente_id");



CREATE INDEX "idx_clientes_enderecos_principal" ON "public"."noro_clientes_enderecos" USING "btree" ("cliente_id", "principal") WHERE ("principal" = true);



CREATE INDEX "idx_clientes_milhas_cliente" ON "public"."noro_clientes_milhas" USING "btree" ("cliente_id");



CREATE INDEX "idx_clientes_milhas_companhia" ON "public"."noro_clientes_milhas" USING "btree" ("companhia");



CREATE INDEX "idx_clientes_origem_lead" ON "public"."noro_clientes" USING "btree" ("origem_lead_id");



CREATE INDEX "idx_clientes_prefs_cliente" ON "public"."noro_clientes_preferencias" USING "btree" ("cliente_id");



CREATE INDEX "idx_clientes_status" ON "public"."noro_clientes" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_clientes_tags" ON "public"."noro_clientes" USING "gin" ("tags");



CREATE INDEX "idx_comissoes_agente" ON "public"."noro_comissoes" USING "btree" ("agente_id");



CREATE INDEX "idx_comissoes_data_pagamento" ON "public"."noro_comissoes" USING "btree" ("data_pagamento");



CREATE INDEX "idx_comissoes_pedido" ON "public"."noro_comissoes" USING "btree" ("pedido_id");



CREATE INDEX "idx_comissoes_status" ON "public"."noro_comissoes" USING "btree" ("status");



CREATE INDEX "idx_fornecedores_categorias" ON "public"."noro_fornecedores" USING "gin" ("categorias");



CREATE INDEX "idx_fornecedores_cnpj" ON "public"."noro_fornecedores" USING "btree" ("cnpj_nif") WHERE ("cnpj_nif" IS NOT NULL);



CREATE INDEX "idx_fornecedores_nome" ON "public"."noro_fornecedores" USING "btree" ("nome") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_fornecedores_rating" ON "public"."noro_fornecedores" USING "btree" ("rating" DESC);



CREATE INDEX "idx_fornecedores_status" ON "public"."noro_fornecedores" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_fornecedores_tipo" ON "public"."noro_fornecedores" USING "btree" ("tipo") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_interacoes_agendada" ON "public"."noro_interacoes" USING "btree" ("agendada_para") WHERE ("agendada_para" IS NOT NULL);



CREATE INDEX "idx_interacoes_agente" ON "public"."noro_interacoes" USING "btree" ("agente_id");



CREATE INDEX "idx_interacoes_cliente" ON "public"."noro_interacoes" USING "btree" ("cliente_id");



CREATE INDEX "idx_interacoes_created_at" ON "public"."noro_interacoes" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_interacoes_intencao" ON "public"."noro_interacoes" USING "btree" ("intencao");



CREATE INDEX "idx_interacoes_lead" ON "public"."noro_interacoes" USING "btree" ("lead_id");



CREATE INDEX "idx_interacoes_lido" ON "public"."noro_interacoes" USING "btree" ("lido") WHERE ("lido" = false);



CREATE INDEX "idx_interacoes_orcamento" ON "public"."noro_interacoes" USING "btree" ("orcamento_id");



CREATE INDEX "idx_interacoes_pedido" ON "public"."noro_interacoes" USING "btree" ("pedido_id");



CREATE INDEX "idx_interacoes_prioridade" ON "public"."noro_interacoes" USING "btree" ("prioridade");



CREATE INDEX "idx_interacoes_sentido" ON "public"."noro_interacoes" USING "btree" ("sentido");



CREATE INDEX "idx_interacoes_tipo" ON "public"."noro_interacoes" USING "btree" ("tipo");



CREATE INDEX "idx_leads_created_at" ON "public"."noro_leads" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_leads_email" ON "public"."noro_leads" USING "btree" ("email");



CREATE INDEX "idx_leads_origem" ON "public"."noro_leads" USING "btree" ("origem");



CREATE INDEX "idx_leads_status" ON "public"."noro_leads" USING "btree" ("status");



CREATE INDEX "idx_newsletter_email" ON "public"."noro_newsletter" USING "btree" ("email");



CREATE INDEX "idx_newsletter_status" ON "public"."noro_newsletter" USING "btree" ("status");



CREATE INDEX "idx_noro_notificacoes_user" ON "public"."noro_notificacoes" USING "btree" ("user_id");



CREATE INDEX "idx_noro_tarefas_status" ON "public"."noro_tarefas" USING "btree" ("status");



CREATE INDEX "idx_notificacoes_user" ON "public"."noro_notificacoes" USING "btree" ("user_id", "lida", "created_at" DESC);



CREATE INDEX "idx_orcamentos_cliente" ON "public"."noro_orcamentos" USING "btree" ("cliente_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_orcamentos_created_by" ON "public"."noro_orcamentos" USING "btree" ("created_by");



CREATE INDEX "idx_orcamentos_data_viagem" ON "public"."noro_orcamentos" USING "btree" ("data_viagem_inicio");



CREATE INDEX "idx_orcamentos_itens_data" ON "public"."noro_orcamentos_itens" USING "btree" ("data_servico");



CREATE INDEX "idx_orcamentos_itens_fornecedor" ON "public"."noro_orcamentos_itens" USING "btree" ("fornecedor");



CREATE INDEX "idx_orcamentos_itens_orcamento" ON "public"."noro_orcamentos_itens" USING "btree" ("orcamento_id");



CREATE INDEX "idx_orcamentos_itens_tipo" ON "public"."noro_orcamentos_itens" USING "btree" ("tipo");



CREATE INDEX "idx_orcamentos_lead" ON "public"."noro_orcamentos" USING "btree" ("lead_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_orcamentos_numero" ON "public"."noro_orcamentos" USING "btree" ("numero_orcamento");



CREATE INDEX "idx_orcamentos_status" ON "public"."noro_orcamentos" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_orcamentos_validade" ON "public"."noro_orcamentos" USING "btree" ("validade_ate") WHERE (("status")::"text" <> 'aprovado'::"text");



CREATE INDEX "idx_pedidos_cliente" ON "public"."noro_pedidos" USING "btree" ("cliente_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_pedidos_created_by" ON "public"."noro_pedidos" USING "btree" ("created_by");



CREATE INDEX "idx_pedidos_data_viagem" ON "public"."noro_pedidos" USING "btree" ("data_viagem_inicio");



CREATE INDEX "idx_pedidos_itens_data" ON "public"."noro_pedidos_itens" USING "btree" ("data_servico");



CREATE INDEX "idx_pedidos_itens_fornecedor" ON "public"."noro_pedidos_itens" USING "btree" ("fornecedor");



CREATE INDEX "idx_pedidos_itens_localizador" ON "public"."noro_pedidos_itens" USING "btree" ("localizador");



CREATE INDEX "idx_pedidos_itens_pedido" ON "public"."noro_pedidos_itens" USING "btree" ("pedido_id");



CREATE INDEX "idx_pedidos_itens_status" ON "public"."noro_pedidos_itens" USING "btree" ("status_confirmacao");



CREATE INDEX "idx_pedidos_itens_tipo" ON "public"."noro_pedidos_itens" USING "btree" ("tipo");



CREATE INDEX "idx_pedidos_numero" ON "public"."noro_pedidos" USING "btree" ("numero_pedido");



CREATE INDEX "idx_pedidos_orcamento" ON "public"."noro_pedidos" USING "btree" ("orcamento_id");



CREATE INDEX "idx_pedidos_status" ON "public"."noro_pedidos" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_pedidos_status_pagamento" ON "public"."noro_pedidos" USING "btree" ("status_pagamento");



CREATE INDEX "idx_pedidos_timeline_created_at" ON "public"."noro_pedidos_timeline" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_pedidos_timeline_evento" ON "public"."noro_pedidos_timeline" USING "btree" ("evento");



CREATE INDEX "idx_pedidos_timeline_pedido" ON "public"."noro_pedidos_timeline" USING "btree" ("pedido_id");



CREATE INDEX "idx_pedidos_urgente" ON "public"."noro_pedidos" USING "btree" ("urgente") WHERE ("urgente" = true);



CREATE INDEX "idx_tarefas_lead" ON "public"."noro_tarefas" USING "btree" ("lead_id");



CREATE INDEX "idx_tarefas_pedido" ON "public"."noro_tarefas" USING "btree" ("pedido_id");



CREATE INDEX "idx_tarefas_responsavel" ON "public"."noro_tarefas" USING "btree" ("responsavel");



CREATE INDEX "idx_tarefas_status" ON "public"."noro_tarefas" USING "btree" ("status");



CREATE INDEX "idx_tarefas_vencimento" ON "public"."noro_tarefas" USING "btree" ("data_vencimento");



CREATE INDEX "idx_templates_ativo" ON "public"."noro_comunicacao_templates" USING "btree" ("ativo") WHERE ("ativo" = true);



CREATE INDEX "idx_templates_categoria" ON "public"."noro_comunicacao_templates" USING "btree" ("categoria");



CREATE INDEX "idx_templates_codigo" ON "public"."noro_comunicacao_templates" USING "btree" ("codigo");



CREATE INDEX "idx_templates_tipo" ON "public"."noro_comunicacao_templates" USING "btree" ("tipo");



CREATE INDEX "idx_templates_trigger" ON "public"."noro_comunicacao_templates" USING "btree" ("trigger_automatico") WHERE ("trigger_automatico" IS NOT NULL);



CREATE INDEX "idx_transacoes_categoria" ON "public"."noro_transacoes" USING "btree" ("categoria");



CREATE INDEX "idx_transacoes_centro_custo" ON "public"."noro_transacoes" USING "btree" ("centro_custo");



CREATE INDEX "idx_transacoes_cliente" ON "public"."noro_transacoes" USING "btree" ("cliente_id");



CREATE INDEX "idx_transacoes_data_pagamento" ON "public"."noro_transacoes" USING "btree" ("data_pagamento");



CREATE INDEX "idx_transacoes_data_transacao" ON "public"."noro_transacoes" USING "btree" ("data_transacao");



CREATE INDEX "idx_transacoes_data_vencimento" ON "public"."noro_transacoes" USING "btree" ("data_vencimento") WHERE (("status")::"text" = 'pendente'::"text");



CREATE INDEX "idx_transacoes_fornecedor" ON "public"."noro_transacoes" USING "btree" ("fornecedor_id");



CREATE INDEX "idx_transacoes_metodo" ON "public"."noro_transacoes" USING "btree" ("metodo_pagamento");



CREATE INDEX "idx_transacoes_pedido" ON "public"."noro_transacoes" USING "btree" ("pedido_id");



CREATE INDEX "idx_transacoes_reconciliado" ON "public"."noro_transacoes" USING "btree" ("reconciliado") WHERE ("reconciliado" = false);



CREATE INDEX "idx_transacoes_status" ON "public"."noro_transacoes" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_transacoes_tipo" ON "public"."noro_transacoes" USING "btree" ("tipo") WHERE ("deleted_at" IS NULL);



CREATE UNIQUE INDEX "one_row_only" ON "public"."noro_empresa" USING "btree" ((true));



CREATE OR REPLACE TRIGGER "trg_billing_events_touch" BEFORE UPDATE ON "cp"."billing_events" FOR EACH ROW EXECUTE FUNCTION "cp"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "trg_tenant_settings_touch" BEFORE UPDATE ON "cp"."tenant_settings" FOR EACH ROW EXECUTE FUNCTION "cp"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "trg_tenants_touch" BEFORE UPDATE ON "cp"."tenants" FOR EACH ROW EXECUTE FUNCTION "cp"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "notify_on_new_lead" AFTER INSERT ON "public"."noro_leads" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_lead"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."noro_empresa" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_metricas_cliente" AFTER UPDATE ON "public"."noro_pedidos" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_metricas_cliente"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_totais_orcamento_delete" AFTER DELETE ON "public"."noro_orcamentos_itens" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_totais_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_totais_orcamento_insert" AFTER INSERT ON "public"."noro_orcamentos_itens" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_totais_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_totais_orcamento_update" AFTER UPDATE ON "public"."noro_orcamentos_itens" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_totais_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_ultimo_contato" AFTER INSERT ON "public"."noro_interacoes" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_ultimo_contato"();



CREATE OR REPLACE TRIGGER "trigger_calcular_dias_atraso" BEFORE INSERT OR UPDATE ON "public"."noro_transacoes" FOR EACH ROW EXECUTE FUNCTION "public"."calcular_dias_atraso"();



CREATE OR REPLACE TRIGGER "trigger_criar_comissao_automatica" AFTER UPDATE ON "public"."noro_pedidos" FOR EACH ROW EXECUTE FUNCTION "public"."criar_comissao_automatica"();



CREATE OR REPLACE TRIGGER "trigger_generate_numero_orcamento" BEFORE INSERT ON "public"."noro_orcamentos" FOR EACH ROW WHEN ((("new"."numero_orcamento" IS NULL) OR (("new"."numero_orcamento")::"text" = ''::"text"))) EXECUTE FUNCTION "public"."generate_numero_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_generate_numero_pedido" BEFORE INSERT ON "public"."noro_pedidos" FOR EACH ROW WHEN ((("new"."numero_pedido" IS NULL) OR (("new"."numero_pedido")::"text" = ''::"text"))) EXECUTE FUNCTION "public"."generate_numero_pedido"();



CREATE OR REPLACE TRIGGER "trigger_incrementar_uso_template" AFTER INSERT ON "public"."noro_interacoes" FOR EACH ROW EXECUTE FUNCTION "public"."incrementar_uso_template"();



CREATE OR REPLACE TRIGGER "trigger_pedido_timeline" AFTER INSERT OR UPDATE ON "public"."noro_pedidos" FOR EACH ROW EXECUTE FUNCTION "public"."pedido_criar_evento_timeline"();



CREATE OR REPLACE TRIGGER "update_nomade_leads_updated_at" BEFORE UPDATE ON "public"."noro_leads" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_nomade_tarefas_updated_at" BEFORE UPDATE ON "public"."noro_tarefas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_nomade_users_updated_at" BEFORE UPDATE ON "public"."noro_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "cp"."api_keys"
    ADD CONSTRAINT "api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."billing_events"
    ADD CONSTRAINT "billing_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."payments"
    ADD CONSTRAINT "payments_billing_event_id_fkey" FOREIGN KEY ("billing_event_id") REFERENCES "cp"."billing_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."plan_features"
    ADD CONSTRAINT "plan_features_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "cp"."modules_registry"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_settings"
    ADD CONSTRAINT "tenant_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_audit_log"
    ADD CONSTRAINT "noro_audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_campanhas"
    ADD CONSTRAINT "noro_campanhas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "noro_clientes_agente_responsavel_id_fkey" FOREIGN KEY ("agente_responsavel_id") REFERENCES "public"."noro_users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_clientes_contatos_emergencia"
    ADD CONSTRAINT "noro_clientes_contatos_emergencia_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_documentos"
    ADD CONSTRAINT "noro_clientes_documentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_enderecos"
    ADD CONSTRAINT "noro_clientes_enderecos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_milhas"
    ADD CONSTRAINT "noro_clientes_milhas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "noro_clientes_origem_lead_id_fkey" FOREIGN KEY ("origem_lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_clientes_preferencias"
    ADD CONSTRAINT "noro_clientes_preferencias_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_comissoes"
    ADD CONSTRAINT "noro_comissoes_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "public"."noro_users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_comissoes"
    ADD CONSTRAINT "noro_comissoes_aprovado_por_fkey" FOREIGN KEY ("aprovado_por") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_comissoes"
    ADD CONSTRAINT "noro_comissoes_pago_por_fkey" FOREIGN KEY ("pago_por") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_comissoes"
    ADD CONSTRAINT "noro_comissoes_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_comissoes"
    ADD CONSTRAINT "noro_comissoes_transacao_id_fkey" FOREIGN KEY ("transacao_id") REFERENCES "public"."noro_transacoes"("id");



ALTER TABLE ONLY "public"."noro_comunicacao_templates"
    ADD CONSTRAINT "noro_comunicacao_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_comunicacao_templates"
    ADD CONSTRAINT "noro_comunicacao_templates_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_configuracoes"
    ADD CONSTRAINT "noro_configuracoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "noro_interacoes_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "noro_interacoes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "noro_interacoes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "noro_interacoes_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "public"."noro_orcamentos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "noro_interacoes_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_notificacoes"
    ADD CONSTRAINT "noro_notificacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."noro_users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_orcamentos_itens"
    ADD CONSTRAINT "noro_orcamentos_itens_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "public"."noro_orcamentos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_cancelado_por_fkey" FOREIGN KEY ("cancelado_por") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_pedidos_itens"
    ADD CONSTRAINT "noro_pedidos_itens_confirmado_por_fkey" FOREIGN KEY ("confirmado_por") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_pedidos_itens"
    ADD CONSTRAINT "noro_pedidos_itens_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "public"."noro_orcamentos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_pedidos_timeline"
    ADD CONSTRAINT "noro_pedidos_timeline_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_pedidos_timeline"
    ADD CONSTRAINT "noro_pedidos_timeline_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_responsavel_fkey" FOREIGN KEY ("responsavel") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."noro_fornecedores"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_reconciliado_por_fkey" FOREIGN KEY ("reconciliado_por") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_transacao_origem_id_fkey" FOREIGN KEY ("transacao_origem_id") REFERENCES "public"."noro_transacoes"("id");



ALTER TABLE ONLY "public"."noro_transacoes"
    ADD CONSTRAINT "noro_transacoes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE "cp"."api_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."billing_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."modules_registry" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "p_cp_billing_all" ON "cp"."billing_events" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_billing_read" ON "cp"."billing_events" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_events_all" ON "cp"."system_events" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_events_read" ON "cp"."system_events" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_keys_all" ON "cp"."api_keys" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_keys_read" ON "cp"."api_keys" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_modules_all" ON "cp"."modules_registry" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_modules_read" ON "cp"."modules_registry" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_payments_all" ON "cp"."payments" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_payments_read" ON "cp"."payments" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_planfeat_all" ON "cp"."plan_features" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_planfeat_read" ON "cp"."plan_features" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_plans_all" ON "cp"."plans" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_plans_read" ON "cp"."plans" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_settings_all" ON "cp"."tenant_settings" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_settings_read" ON "cp"."tenant_settings" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantmods_all" ON "cp"."tenant_modules" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantmods_read" ON "cp"."tenant_modules" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantplan_all" ON "cp"."tenant_plan" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantplan_read" ON "cp"."tenant_plan" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenants_all" ON "cp"."tenants" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenants_read" ON "cp"."tenants" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_usage_all" ON "cp"."usage_counters" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_usage_read" ON "cp"."usage_counters" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_userroles_all" ON "cp"."user_tenant_roles" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_userroles_read" ON "cp"."user_tenant_roles" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_webhooks_all" ON "cp"."webhooks" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_webhooks_read" ON "cp"."webhooks" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



ALTER TABLE "cp"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."plan_features" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."system_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenant_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenant_plan" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenant_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."usage_counters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."user_tenant_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."webhooks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Admins can create notificacoes" ON "public"."noro_notificacoes" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can do everything on clientes" ON "public"."noro_clientes" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))));



CREATE POLICY "Admins can manage comissoes" ON "public"."noro_comissoes" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text", ('financeiro'::character varying)::"text"]))))));



CREATE POLICY "Admins can manage fornecedores" ON "public"."noro_fornecedores" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))));



CREATE POLICY "Admins can manage templates" ON "public"."noro_comunicacao_templates" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))));



CREATE POLICY "Admins can update all profiles" ON "public"."noro_users" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "Admins can view all profiles" ON "public"."noro_users" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins full access to leads" ON "public"."noro_leads" USING ("public"."is_admin"());



CREATE POLICY "Admins full access to newsletter" ON "public"."noro_newsletter" USING ("public"."is_admin"());



CREATE POLICY "Admins full access to tarefas" ON "public"."noro_tarefas" USING ("public"."is_admin"());



CREATE POLICY "Agentes can view their clientes" ON "public"."noro_clientes" FOR SELECT USING ((("agente_responsavel_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"])))))));



CREATE POLICY "Agentes can view their comissoes" ON "public"."noro_comissoes" FOR SELECT USING ((("agente_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text", ('financeiro'::character varying)::"text"])))))));



CREATE POLICY "Anyone can subscribe to newsletter" ON "public"."noro_newsletter" FOR INSERT WITH CHECK (true);



CREATE POLICY "Authenticated users can view fornecedores" ON "public"."noro_fornecedores" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can view templates" ON "public"."noro_comunicacao_templates" FOR SELECT USING ((("auth"."uid"() IS NOT NULL) AND ("ativo" = true)));



CREATE POLICY "Clients can view own leads" ON "public"."noro_leads" FOR SELECT USING ((("email")::"text" IN ( SELECT "noro_users"."email"
   FROM "public"."noro_users"
  WHERE ("noro_users"."id" = "auth"."uid"()))));



CREATE POLICY "Enable read access for everyone" ON "public"."noro_audit_log" FOR SELECT USING (true);



CREATE POLICY "Only admins can access campanhas" ON "public"."noro_campanhas" USING ("public"."is_admin"());



CREATE POLICY "Only admins can view audit_log" ON "public"."noro_audit_log" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "System can insert audit_log" ON "public"."noro_audit_log" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can access cliente contatos emergencia" ON "public"."noro_clientes_contatos_emergencia" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_clientes"
  WHERE (("noro_clientes"."id" = "noro_clientes_contatos_emergencia"."cliente_id") AND (("noro_clientes"."agente_responsavel_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access cliente documents" ON "public"."noro_clientes_documentos" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_clientes"
  WHERE (("noro_clientes"."id" = "noro_clientes_documentos"."cliente_id") AND (("noro_clientes"."agente_responsavel_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access cliente enderecos" ON "public"."noro_clientes_enderecos" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_clientes"
  WHERE (("noro_clientes"."id" = "noro_clientes_enderecos"."cliente_id") AND (("noro_clientes"."agente_responsavel_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access cliente milhas" ON "public"."noro_clientes_milhas" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_clientes"
  WHERE (("noro_clientes"."id" = "noro_clientes_milhas"."cliente_id") AND (("noro_clientes"."agente_responsavel_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access cliente preferences" ON "public"."noro_clientes_preferencias" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_clientes"
  WHERE (("noro_clientes"."id" = "noro_clientes_preferencias"."cliente_id") AND (("noro_clientes"."agente_responsavel_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access interacoes" ON "public"."noro_interacoes" USING ((("agente_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"])))))));



CREATE POLICY "Users can access orcamentos" ON "public"."noro_orcamentos" USING ((("created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"])))))));



CREATE POLICY "Users can access orcamentos itens" ON "public"."noro_orcamentos_itens" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_orcamentos"
  WHERE (("noro_orcamentos"."id" = "noro_orcamentos_itens"."orcamento_id") AND (("noro_orcamentos"."created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access pedidos" ON "public"."noro_pedidos" USING ((("created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"])))))));



CREATE POLICY "Users can access pedidos itens" ON "public"."noro_pedidos_itens" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_pedidos"
  WHERE (("noro_pedidos"."id" = "noro_pedidos_itens"."pedido_id") AND (("noro_pedidos"."created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access pedidos timeline" ON "public"."noro_pedidos_timeline" USING ((EXISTS ( SELECT 1
   FROM "public"."noro_pedidos"
  WHERE (("noro_pedidos"."id" = "noro_pedidos_timeline"."pedido_id") AND (("noro_pedidos"."created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."noro_users"
          WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text"]))))))))));



CREATE POLICY "Users can access transacoes" ON "public"."noro_transacoes" USING ((("created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."noro_users"
  WHERE (("noro_users"."id" = "auth"."uid"()) AND (("noro_users"."role")::"text" = ANY (ARRAY[('admin'::character varying)::"text", ('super_admin'::character varying)::"text", ('financeiro'::character varying)::"text"])))))));



CREATE POLICY "Users can update assigned tarefas" ON "public"."noro_tarefas" FOR UPDATE USING (("responsavel" = "auth"."uid"()));



CREATE POLICY "Users can update own newsletter" ON "public"."noro_newsletter" FOR UPDATE USING ((("email")::"text" IN ( SELECT "noro_users"."email"
   FROM "public"."noro_users"
  WHERE ("noro_users"."id" = "auth"."uid"()))));



CREATE POLICY "Users can update own notificacoes" ON "public"."noro_notificacoes" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update own profile" ON "public"."noro_users" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view assigned tarefas" ON "public"."noro_tarefas" FOR SELECT USING (("responsavel" = "auth"."uid"()));



CREATE POLICY "Users can view own notificacoes" ON "public"."noro_notificacoes" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own profile" ON "public"."noro_users" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."noro_audit_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_campanhas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_clientes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_clientes_contatos_emergencia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_clientes_documentos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_clientes_enderecos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_clientes_milhas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_clientes_preferencias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_comissoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_comunicacao_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_fornecedores" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_interacoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_newsletter" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_notificacoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_orcamentos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_orcamentos_itens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_pedidos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_pedidos_itens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_pedidos_timeline" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_tarefas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_transacoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "cp" TO "anon";
GRANT USAGE ON SCHEMA "cp" TO "authenticated";
GRANT USAGE ON SCHEMA "cp" TO "service_role";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"(character) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "anon";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"("inet") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "anon";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "service_role";



GRANT ALL ON FUNCTION "cp"."cp_dashboard_overview"() TO "anon";
GRANT ALL ON FUNCTION "cp"."cp_dashboard_overview"() TO "authenticated";
GRANT ALL ON FUNCTION "cp"."cp_dashboard_overview"() TO "service_role";



GRANT ALL ON FUNCTION "cp"."cp_list_users"("p_limit" integer, "p_offset" integer, "p_search" "text") TO "anon";
GRANT ALL ON FUNCTION "cp"."cp_list_users"("p_limit" integer, "p_offset" integer, "p_search" "text") TO "authenticated";
GRANT ALL ON FUNCTION "cp"."cp_list_users"("p_limit" integer, "p_offset" integer, "p_search" "text") TO "service_role";



GRANT ALL ON FUNCTION "cp"."cp_select_tenants"() TO "anon";
GRANT ALL ON FUNCTION "cp"."cp_select_tenants"() TO "authenticated";
GRANT ALL ON FUNCTION "cp"."cp_select_tenants"() TO "service_role";


































































































































































GRANT ALL ON FUNCTION "public"."atualizar_metricas_cliente"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_metricas_cliente"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_metricas_cliente"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_totais_orcamento"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_totais_orcamento"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_totais_orcamento"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_ultimo_contato"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_ultimo_contato"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_ultimo_contato"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_dias_atraso"() TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_dias_atraso"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_dias_atraso"() TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "service_role";



GRANT SELECT,INSERT,UPDATE ON TABLE "cp"."tenants" TO "authenticated";
GRANT SELECT ON TABLE "cp"."tenants" TO "anon";
GRANT SELECT ON TABLE "cp"."tenants" TO "service_role";



GRANT ALL ON FUNCTION "public"."cp_select_tenants"() TO "anon";
GRANT ALL ON FUNCTION "public"."cp_select_tenants"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cp_select_tenants"() TO "service_role";



GRANT ALL ON FUNCTION "public"."criar_comissao_automatica"() TO "anon";
GRANT ALL ON FUNCTION "public"."criar_comissao_automatica"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."criar_comissao_automatica"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_numero_orcamento"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_numero_orcamento"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_numero_orcamento"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_numero_pedido"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_numero_pedido"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_numero_pedido"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_dashboard_metrics"("periodo_dias" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_metrics"("periodo_dias" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_metrics"("periodo_dias" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."incrementar_uso_template"() TO "anon";
GRANT ALL ON FUNCTION "public"."incrementar_uso_template"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."incrementar_uso_template"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_default_empresa_row"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_default_empresa_row"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_default_empresa_row"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_lead"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_lead"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_lead"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_orcamento_aceito"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_orcamento_aceito"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_orcamento_aceito"() TO "service_role";



GRANT ALL ON FUNCTION "public"."pedido_criar_evento_timeline"() TO "anon";
GRANT ALL ON FUNCTION "public"."pedido_criar_evento_timeline"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."pedido_criar_evento_timeline"() TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_lead_on_pedido"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_lead_on_pedido"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_lead_on_pedido"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_pedido_status_pagamento"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_pedido_status_pagamento"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_pedido_status_pagamento"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") TO "service_role";












GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "service_role";



GRANT SELECT ON TABLE "cp"."api_keys" TO "anon";
GRANT SELECT ON TABLE "cp"."api_keys" TO "authenticated";
GRANT SELECT ON TABLE "cp"."api_keys" TO "service_role";



GRANT SELECT ON TABLE "cp"."billing_events" TO "anon";
GRANT SELECT ON TABLE "cp"."billing_events" TO "authenticated";
GRANT SELECT ON TABLE "cp"."billing_events" TO "service_role";



GRANT SELECT ON TABLE "cp"."modules_registry" TO "anon";
GRANT SELECT ON TABLE "cp"."modules_registry" TO "authenticated";
GRANT SELECT ON TABLE "cp"."modules_registry" TO "service_role";



GRANT SELECT ON TABLE "cp"."payments" TO "anon";
GRANT SELECT ON TABLE "cp"."payments" TO "authenticated";
GRANT SELECT ON TABLE "cp"."payments" TO "service_role";



GRANT SELECT ON TABLE "cp"."plan_features" TO "anon";
GRANT SELECT ON TABLE "cp"."plan_features" TO "authenticated";
GRANT SELECT ON TABLE "cp"."plan_features" TO "service_role";



GRANT SELECT ON TABLE "cp"."plans" TO "anon";
GRANT SELECT ON TABLE "cp"."plans" TO "authenticated";
GRANT SELECT ON TABLE "cp"."plans" TO "service_role";



GRANT SELECT ON TABLE "cp"."system_events" TO "anon";
GRANT SELECT ON TABLE "cp"."system_events" TO "authenticated";
GRANT SELECT ON TABLE "cp"."system_events" TO "service_role";



GRANT USAGE ON SEQUENCE "cp"."system_events_id_seq" TO "anon";
GRANT USAGE ON SEQUENCE "cp"."system_events_id_seq" TO "authenticated";
GRANT USAGE ON SEQUENCE "cp"."system_events_id_seq" TO "service_role";



GRANT SELECT ON TABLE "cp"."tenant_modules" TO "anon";
GRANT SELECT ON TABLE "cp"."tenant_modules" TO "authenticated";
GRANT SELECT ON TABLE "cp"."tenant_modules" TO "service_role";



GRANT SELECT ON TABLE "cp"."tenant_plan" TO "anon";
GRANT SELECT ON TABLE "cp"."tenant_plan" TO "authenticated";
GRANT SELECT ON TABLE "cp"."tenant_plan" TO "service_role";



GRANT SELECT ON TABLE "cp"."tenant_settings" TO "anon";
GRANT SELECT ON TABLE "cp"."tenant_settings" TO "authenticated";
GRANT SELECT ON TABLE "cp"."tenant_settings" TO "service_role";



GRANT SELECT ON TABLE "cp"."usage_counters" TO "anon";
GRANT SELECT ON TABLE "cp"."usage_counters" TO "authenticated";
GRANT SELECT ON TABLE "cp"."usage_counters" TO "service_role";



GRANT USAGE ON SEQUENCE "cp"."usage_counters_id_seq" TO "anon";
GRANT USAGE ON SEQUENCE "cp"."usage_counters_id_seq" TO "authenticated";
GRANT USAGE ON SEQUENCE "cp"."usage_counters_id_seq" TO "service_role";



GRANT SELECT ON TABLE "cp"."user_tenant_roles" TO "anon";
GRANT SELECT ON TABLE "cp"."user_tenant_roles" TO "authenticated";
GRANT SELECT ON TABLE "cp"."user_tenant_roles" TO "service_role";



GRANT SELECT ON TABLE "cp"."v_users" TO "anon";
GRANT SELECT ON TABLE "cp"."v_users" TO "authenticated";
GRANT SELECT ON TABLE "cp"."v_users" TO "service_role";



GRANT SELECT ON TABLE "cp"."webhooks" TO "anon";
GRANT SELECT ON TABLE "cp"."webhooks" TO "authenticated";
GRANT SELECT ON TABLE "cp"."webhooks" TO "service_role";


















GRANT ALL ON TABLE "public"."noro_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."noro_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."noro_campanhas" TO "anon";
GRANT ALL ON TABLE "public"."noro_campanhas" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_campanhas" TO "service_role";



GRANT ALL ON TABLE "public"."noro_clientes" TO "anon";
GRANT ALL ON TABLE "public"."noro_clientes" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_clientes" TO "service_role";



GRANT ALL ON TABLE "public"."noro_clientes_contatos_emergencia" TO "anon";
GRANT ALL ON TABLE "public"."noro_clientes_contatos_emergencia" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_clientes_contatos_emergencia" TO "service_role";



GRANT ALL ON TABLE "public"."noro_clientes_documentos" TO "anon";
GRANT ALL ON TABLE "public"."noro_clientes_documentos" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_clientes_documentos" TO "service_role";



GRANT ALL ON TABLE "public"."noro_clientes_enderecos" TO "anon";
GRANT ALL ON TABLE "public"."noro_clientes_enderecos" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_clientes_enderecos" TO "service_role";



GRANT ALL ON TABLE "public"."noro_clientes_milhas" TO "anon";
GRANT ALL ON TABLE "public"."noro_clientes_milhas" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_clientes_milhas" TO "service_role";



GRANT ALL ON TABLE "public"."noro_clientes_preferencias" TO "anon";
GRANT ALL ON TABLE "public"."noro_clientes_preferencias" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_clientes_preferencias" TO "service_role";



GRANT ALL ON TABLE "public"."noro_comissoes" TO "anon";
GRANT ALL ON TABLE "public"."noro_comissoes" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_comissoes" TO "service_role";



GRANT ALL ON TABLE "public"."noro_comunicacao_templates" TO "anon";
GRANT ALL ON TABLE "public"."noro_comunicacao_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_comunicacao_templates" TO "service_role";



GRANT ALL ON TABLE "public"."noro_configuracoes" TO "anon";
GRANT ALL ON TABLE "public"."noro_configuracoes" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_configuracoes" TO "service_role";



GRANT ALL ON TABLE "public"."noro_empresa" TO "anon";
GRANT ALL ON TABLE "public"."noro_empresa" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_empresa" TO "service_role";



GRANT ALL ON TABLE "public"."noro_fornecedores" TO "anon";
GRANT ALL ON TABLE "public"."noro_fornecedores" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_fornecedores" TO "service_role";



GRANT ALL ON TABLE "public"."noro_leads" TO "anon";
GRANT ALL ON TABLE "public"."noro_leads" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_leads" TO "service_role";



GRANT ALL ON TABLE "public"."noro_funil_vendas" TO "anon";
GRANT ALL ON TABLE "public"."noro_funil_vendas" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_funil_vendas" TO "service_role";



GRANT ALL ON TABLE "public"."noro_interacoes" TO "anon";
GRANT ALL ON TABLE "public"."noro_interacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_interacoes" TO "service_role";



GRANT ALL ON TABLE "public"."noro_newsletter" TO "anon";
GRANT ALL ON TABLE "public"."noro_newsletter" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_newsletter" TO "service_role";



GRANT ALL ON TABLE "public"."noro_notificacoes" TO "anon";
GRANT ALL ON TABLE "public"."noro_notificacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_notificacoes" TO "service_role";



GRANT ALL ON TABLE "public"."noro_orcamentos" TO "anon";
GRANT ALL ON TABLE "public"."noro_orcamentos" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_orcamentos" TO "service_role";



GRANT ALL ON TABLE "public"."noro_orcamentos_itens" TO "anon";
GRANT ALL ON TABLE "public"."noro_orcamentos_itens" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_orcamentos_itens" TO "service_role";



GRANT ALL ON TABLE "public"."noro_pedidos" TO "anon";
GRANT ALL ON TABLE "public"."noro_pedidos" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_pedidos" TO "service_role";



GRANT ALL ON TABLE "public"."noro_pedidos_itens" TO "anon";
GRANT ALL ON TABLE "public"."noro_pedidos_itens" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_pedidos_itens" TO "service_role";



GRANT ALL ON TABLE "public"."noro_pedidos_timeline" TO "anon";
GRANT ALL ON TABLE "public"."noro_pedidos_timeline" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_pedidos_timeline" TO "service_role";



GRANT ALL ON TABLE "public"."noro_tarefas" TO "anon";
GRANT ALL ON TABLE "public"."noro_tarefas" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_tarefas" TO "service_role";



GRANT ALL ON TABLE "public"."noro_transacoes" TO "anon";
GRANT ALL ON TABLE "public"."noro_transacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_transacoes" TO "service_role";



GRANT ALL ON TABLE "public"."noro_update_tokens" TO "anon";
GRANT ALL ON TABLE "public"."noro_update_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_update_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."noro_users" TO "anon";
GRANT ALL ON TABLE "public"."noro_users" TO "authenticated";
GRANT ALL ON TABLE "public"."noro_users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."orcamento_sequence" TO "anon";
GRANT ALL ON SEQUENCE "public"."orcamento_sequence" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orcamento_sequence" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pedido_sequence" TO "anon";
GRANT ALL ON SEQUENCE "public"."pedido_sequence" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pedido_sequence" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT USAGE ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT USAGE ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT USAGE ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT SELECT ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT SELECT ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT SELECT ON TABLES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


