


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


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "staging_vistos";


ALTER SCHEMA "staging_vistos" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."billing_cycle" AS ENUM (
    'monthly',
    'quarterly',
    'yearly'
);


ALTER TYPE "public"."billing_cycle" OWNER TO "postgres";


CREATE TYPE "public"."billing_status" AS ENUM (
    'active',
    'trialing',
    'past_due',
    'canceled',
    'pending'
);


ALTER TYPE "public"."billing_status" OWNER TO "postgres";


CREATE TYPE "public"."control_plane_role" AS ENUM (
    'super_admin',
    'admin',
    'operador',
    'auditor',
    'readonly'
);


ALTER TYPE "public"."control_plane_role" OWNER TO "postgres";


CREATE TYPE "public"."fin_canal_notificacao" AS ENUM (
    'email',
    'whatsapp',
    'sms',
    'webhook'
);


ALTER TYPE "public"."fin_canal_notificacao" OWNER TO "postgres";


CREATE TYPE "public"."fin_referencia_data" AS ENUM (
    'emissao',
    'checkout',
    'embarque',
    'entrega',
    'personalizada'
);


ALTER TYPE "public"."fin_referencia_data" OWNER TO "postgres";


CREATE TYPE "public"."fin_status_adiantamento" AS ENUM (
    'ativo',
    'parcialmente_utilizado',
    'totalmente_utilizado',
    'cancelado',
    'expirado'
);


ALTER TYPE "public"."fin_status_adiantamento" OWNER TO "postgres";


CREATE TYPE "public"."fin_status_comissao" AS ENUM (
    'pendente',
    'prevista',
    'paga',
    'cancelada',
    'repassada'
);


ALTER TYPE "public"."fin_status_comissao" OWNER TO "postgres";


CREATE TYPE "public"."fin_status_credito" AS ENUM (
    'disponivel',
    'parcialmente_utilizado',
    'totalmente_utilizado',
    'expirado',
    'cancelado'
);


ALTER TYPE "public"."fin_status_credito" OWNER TO "postgres";


CREATE TYPE "public"."fin_status_duplicata" AS ENUM (
    'aberta',
    'parcialmente_recebida',
    'recebida',
    'vencida',
    'cancelada',
    'protestada',
    'negociacao'
);


ALTER TYPE "public"."fin_status_duplicata" OWNER TO "postgres";


CREATE TYPE "public"."fin_tipo_adiantamento" AS ENUM (
    'pagamento_antecipado',
    'deposito_garantia',
    'sinal',
    'credito_prepago'
);


ALTER TYPE "public"."fin_tipo_adiantamento" OWNER TO "postgres";


CREATE TYPE "public"."fin_tipo_comissao" AS ENUM (
    'hotel',
    'aereo',
    'tour',
    'seguro',
    'visto',
    'outro'
);


ALTER TYPE "public"."fin_tipo_comissao" OWNER TO "postgres";


CREATE TYPE "public"."fin_tipo_condicao_pagamento" AS ENUM (
    'a_vista',
    'd_plus_15',
    'd_plus_30',
    'd_plus_45',
    'd_plus_60',
    'apos_checkout',
    'apos_embarque',
    'entrada_mais_parcelas',
    'personalizado'
);


ALTER TYPE "public"."fin_tipo_condicao_pagamento" OWNER TO "postgres";


CREATE TYPE "public"."fin_tipo_credito" AS ENUM (
    'refund',
    'overpayment',
    'desconto_fornecedor',
    'credito_futuro',
    'estorno',
    'devolucao'
);


ALTER TYPE "public"."fin_tipo_credito" OWNER TO "postgres";


CREATE TYPE "public"."fin_tipo_lembrete" AS ENUM (
    'vencimento_proximo',
    'vencido',
    'cobranca',
    'confirmacao_pagamento'
);


ALTER TYPE "public"."fin_tipo_lembrete" OWNER TO "postgres";


CREATE TYPE "public"."fin_tipo_repassado" AS ENUM (
    'agencia',
    'consultor',
    'parceiro'
);


ALTER TYPE "public"."fin_tipo_repassado" OWNER TO "postgres";


CREATE TYPE "public"."forma_pagamento" AS ENUM (
    'pix',
    'cartao_credito',
    'cartao_debito',
    'boleto',
    'transferencia',
    'internacional',
    'dinheiro',
    'cheque'
);


ALTER TYPE "public"."forma_pagamento" OWNER TO "postgres";


CREATE TYPE "public"."marca" AS ENUM (
    'noro',
    'nomade',
    'safetrip',
    'vistos'
);


ALTER TYPE "public"."marca" OWNER TO "postgres";


CREATE TYPE "public"."moeda" AS ENUM (
    'BRL',
    'USD',
    'EUR',
    'GBP',
    'ARS',
    'CLP'
);


ALTER TYPE "public"."moeda" OWNER TO "postgres";


CREATE TYPE "public"."payment_method" AS ENUM (
    'credit_card',
    'pix',
    'bank_transfer',
    'boleto'
);


ALTER TYPE "public"."payment_method" OWNER TO "postgres";


CREATE TYPE "public"."pricing_report_margins" AS (
	"categoria" "text",
	"produto" "text",
	"custo" numeric,
	"preco_venda" numeric,
	"markup" numeric,
	"margem_lucro" numeric,
	"variacao_periodo_anterior" numeric
);


ALTER TYPE "public"."pricing_report_margins" OWNER TO "postgres";


CREATE TYPE "public"."pricing_report_rules" AS (
	"nome" "text",
	"tipo" "text",
	"condicao" "text",
	"markup" numeric,
	"data_criacao" timestamp with time zone,
	"data_modificacao" timestamp with time zone,
	"status" "text"
);


ALTER TYPE "public"."pricing_report_rules" OWNER TO "postgres";


CREATE TYPE "public"."pricing_report_simulations" AS (
	"id" "uuid",
	"produto" "text",
	"preco_base" numeric,
	"markup_aplicado" numeric,
	"preco_final" numeric,
	"data_simulacao" timestamp with time zone,
	"usuario" "text"
);


ALTER TYPE "public"."pricing_report_simulations" OWNER TO "postgres";


CREATE TYPE "public"."tenant_status" AS ENUM (
    'pending',
    'active',
    'suspended',
    'cancelled',
    'blocked'
);


ALTER TYPE "public"."tenant_status" OWNER TO "postgres";


CREATE TYPE "public"."tipo_markup" AS ENUM (
    'percentual',
    'fixo',
    'dinamico',
    'personalizado'
);


ALTER TYPE "public"."tipo_markup" OWNER TO "postgres";


CREATE TYPE "public"."tipo_regra_preco" AS ENUM (
    'markup_padrao',
    'volume',
    'sazonalidade',
    'cliente_categoria',
    'destino',
    'fornecedor',
    'produto'
);


ALTER TYPE "public"."tipo_regra_preco" OWNER TO "postgres";


CREATE TYPE "public"."user_status" AS ENUM (
    'ativo',
    'inativo',
    'pendente',
    'bloqueado'
);


ALTER TYPE "public"."user_status" OWNER TO "postgres";


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


CREATE OR REPLACE FUNCTION "cp"."ensure_activity_tenant_matches_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF NEW.tenant_id IS NOT NULL AND NEW.user_id IS NOT NULL THEN
        PERFORM 1 FROM cp.control_plane_users u WHERE u.id = NEW.user_id AND u.tenant_id = NEW.tenant_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'tenant_id (%) does not match control_plane_user tenant for user %', NEW.tenant_id, NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "cp"."ensure_activity_tenant_matches_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."has_role"("uid" "uuid", "tenant_id" "uuid", "role_text" "text") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists(
    select 1 from cp.user_tenant_roles utr
     where utr.user_id = uid and utr.tenant_id = tenant_id and utr.role = role_text
  );
$$;


ALTER FUNCTION "cp"."has_role"("uid" "uuid", "tenant_id" "uuid", "role_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."is_admin_of_tenant"("p_user" "uuid", "p_tenant" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = p_user AND utr.tenant_id = p_tenant AND utr.role IN ('admin','owner')
  );
$$;


ALTER FUNCTION "cp"."is_admin_of_tenant"("p_user" "uuid", "p_tenant" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."is_member"("uid" "uuid", "tenant_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists(
    select 1 from cp.user_tenant_roles utr
     where utr.user_id = uid and utr.tenant_id = tenant_id
  );
$$;


ALTER FUNCTION "cp"."is_member"("uid" "uuid", "tenant_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."is_member_of_tenant"("p_user" "uuid", "p_tenant" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = p_user AND utr.tenant_id = p_tenant
  );
$$;


ALTER FUNCTION "cp"."is_member_of_tenant"("p_user" "uuid", "p_tenant" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."is_super_admin"("uid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select coalesce(
    (select (raw_app_meta_data->>'super_admin')::boolean
     from auth.users where id = uid), false);
$$;


ALTER FUNCTION "cp"."is_super_admin"("uid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."set_owner_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
if new.owner_id is null then
new.owner_id := auth.uid();
end if;
return new;
end;
$$;


ALTER FUNCTION "cp"."set_owner_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "cp"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."tg_set_owner_default"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;$$;


ALTER FUNCTION "cp"."tg_set_owner_default"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "cp"."tg_set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;$$;


ALTER FUNCTION "cp"."tg_set_updated_at"() OWNER TO "postgres";


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



CREATE OR REPLACE FUNCTION "public"."atualizar_saldo_adiantamento"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.valor_disponivel = NEW.valor_original - NEW.valor_utilizado;
  
  IF NEW.valor_disponivel = 0 THEN
    NEW.status = 'totalmente_utilizado';
  ELSIF NEW.valor_utilizado > 0 AND NEW.valor_disponivel > 0 THEN
    NEW.status = 'parcialmente_utilizado';
  ELSIF NEW.data_expiracao IS NOT NULL AND NEW.data_expiracao < CURRENT_DATE THEN
    NEW.status = 'expirado';
  ELSE
    NEW.status = 'ativo';
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."atualizar_saldo_adiantamento"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."atualizar_saldo_conta"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.status = 'efetivada' THEN
        IF NEW.tipo = 'entrada' AND NEW.conta_destino_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        ELSIF NEW.tipo = 'saida' AND NEW.conta_origem_id IS NOT NULL THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
        ELSIF NEW.tipo = 'transferencia' THEN
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual - NEW.valor
            WHERE id = NEW.conta_origem_id;
            
            UPDATE public.fin_contas_bancarias 
            SET saldo_atual = saldo_atual + NEW.valor
            WHERE id = NEW.conta_destino_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."atualizar_saldo_conta"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."atualizar_saldo_credito"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.valor_disponivel = NEW.valor_original - NEW.valor_utilizado;
  
  IF NEW.valor_disponivel = 0 THEN
    NEW.status = 'totalmente_utilizado';
  ELSIF NEW.valor_utilizado > 0 AND NEW.valor_disponivel > 0 THEN
    NEW.status = 'parcialmente_utilizado';
  ELSIF NEW.data_expiracao IS NOT NULL AND NEW.data_expiracao < CURRENT_DATE THEN
    NEW.status = 'expirado';
  ELSE
    NEW.status = 'disponivel';
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."atualizar_saldo_credito"() OWNER TO "postgres";


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



CREATE OR REPLACE FUNCTION "public"."atualizar_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."atualizar_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."atualizar_valor_pendente_pagar"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.valor_pendente = NEW.valor_total - NEW.valor_pago - NEW.valor_credito_aplicado;
  
  IF NEW.valor_pendente = 0 THEN
    NEW.status = 'recebida';
    NEW.data_pagamento = CURRENT_DATE;
  ELSIF NEW.valor_pago > 0 AND NEW.valor_pendente > 0 THEN
    NEW.status = 'parcialmente_recebida';
  ELSIF NEW.data_vencimento < CURRENT_DATE AND NEW.valor_pendente > 0 THEN
    NEW.status = 'vencida';
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."atualizar_valor_pendente_pagar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."atualizar_valor_pendente_receber"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.valor_pendente = NEW.valor_total - NEW.valor_recebido;
  
  IF NEW.valor_pendente = 0 THEN
    NEW.status = 'recebida';
    NEW.data_recebimento = CURRENT_DATE;
  ELSIF NEW.valor_recebido > 0 AND NEW.valor_pendente > 0 THEN
    NEW.status = 'parcialmente_recebida';
  ELSIF NEW.data_vencimento < CURRENT_DATE AND NEW.valor_pendente > 0 THEN
    NEW.status = 'vencida';
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."atualizar_valor_pendente_receber"() OWNER TO "postgres";


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



CREATE OR REPLACE FUNCTION "public"."calcular_metricas_precos"("p_tenant_id" "uuid", "p_data_inicial" "date", "p_data_final" "date" DEFAULT CURRENT_DATE) RETURNS TABLE("periodo" "date", "margem_media" numeric, "markup_medio" numeric, "margem_minima" numeric, "margem_maxima" numeric, "total_produtos" integer, "regras_ativas" integer, "distribuicao_regras" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH historico_precos AS (
    SELECT 
      DATE_TRUNC('day', created_at)::DATE as data,
      valor_custo,
      valor_venda,
      ((valor_venda - valor_custo) / valor_custo * 100) as margem
    FROM historico_preco
    WHERE tenant_id = p_tenant_id
    AND created_at BETWEEN p_data_inicial AND p_data_final
  ),
  metricas_diarias AS (
    SELECT 
      data,
      AVG(margem) as margem_media,
      MIN(margem) as margem_minima,
      MAX(margem) as margem_maxima,
      COUNT(DISTINCT produto_id) as total_produtos
    FROM historico_precos
    GROUP BY data
  ),
  regras_distribuicao AS (
    SELECT 
      tipo,
      COUNT(*) as quantidade,
      SUM(CASE 
        WHEN tipo_markup = 'percentual' THEN valor_markup 
        ELSE valor_markup / 100 
      END) as valor_total
    FROM regras_preco
    WHERE tenant_id = p_tenant_id
    AND ativo = true
    GROUP BY tipo
  )
  SELECT 
    h.data as periodo,
    ROUND(h.margem_media::DECIMAL(10,2), 2) as margem_media,
    ROUND((
      SELECT AVG(CASE 
        WHEN tipo_markup = 'percentual' THEN valor_markup 
        ELSE valor_markup / 100 
      END)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
      AND (data_inicio IS NULL OR data_inicio <= h.data)
      AND (data_fim IS NULL OR data_fim >= h.data)
    )::DECIMAL(10,2), 2) as markup_medio,
    ROUND(h.margem_minima::DECIMAL(10,2), 2) as margem_minima,
    ROUND(h.margem_maxima::DECIMAL(10,2), 2) as margem_maxima,
    h.total_produtos,
    (
      SELECT COUNT(*)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
    ) as regras_ativas,
    (
      SELECT jsonb_agg(jsonb_build_object(
        'tipo', tipo,
        'quantidade', quantidade,
        'valor_total', valor_total
      ))
      FROM regras_distribuicao
    ) as distribuicao_regras
  FROM metricas_diarias h
  ORDER BY h.data;
END;
$$;


ALTER FUNCTION "public"."calcular_metricas_precos"("p_tenant_id" "uuid", "p_data_inicial" "date", "p_data_final" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calcular_preco_final"("preco_base" numeric, "produto_id" "uuid" DEFAULT NULL::"uuid", "cliente_id" "uuid" DEFAULT NULL::"uuid", "quantidade" integer DEFAULT NULL::integer, "data_ref" "date" DEFAULT CURRENT_DATE) RETURNS TABLE("preco_final" numeric, "markup_total" numeric, "detalhamento" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_regra regras_preco%ROWTYPE;
  v_markup DECIMAL(10,2);
  v_valor_final DECIMAL(10,2);
  v_detalhamento JSONB := '[]'::JSONB;
BEGIN
  v_valor_final := preco_base;
  v_markup := 0;
  
  FOR v_regra IN 
    SELECT * FROM public.regras_preco 
    WHERE ativo = true
    AND (data_inicio IS NULL OR data_inicio <= data_ref)
    AND (data_fim IS NULL OR data_fim >= data_ref)
    ORDER BY prioridade DESC
  LOOP
    CASE v_regra.tipo::text
      WHEN 'markup_padrao' THEN
        IF v_regra.tipo_markup::text = 'percentual' THEN
          v_markup := v_valor_final * (v_regra.valor_markup / 100);
        ELSE
          v_markup := v_regra.valor_markup;
        END IF;
      WHEN 'volume' THEN
        IF quantidade IS NOT NULL 
        AND (v_regra.valor_minimo IS NULL OR quantidade >= v_regra.valor_minimo)
        AND (v_regra.valor_maximo IS NULL OR quantidade <= v_regra.valor_maximo)
        THEN
          IF v_regra.tipo_markup::text = 'percentual' THEN
            v_markup := v_valor_final * (v_regra.valor_markup / 100);
          ELSE
            v_markup := v_regra.valor_markup;
          END IF;
        END IF;
    END CASE;
    
    v_valor_final := v_valor_final + COALESCE(v_markup,0);
    v_detalhamento := v_detalhamento || jsonb_build_object(
      'regra_id', v_regra.id,
      'nome_regra', v_regra.nome,
      'tipo_markup', v_regra.tipo_markup,
      'valor_markup', v_regra.valor_markup,
      'valor_aplicado', v_markup
    );
    
    IF v_regra.sobrepor_regras THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN QUERY 
  SELECT v_valor_final::DECIMAL(10,2), 
         (v_valor_final - preco_base)::DECIMAL(10,2), 
         v_detalhamento;
END;
$$;


ALTER FUNCTION "public"."calcular_preco_final"("preco_base" numeric, "produto_id" "uuid", "cliente_id" "uuid", "quantidade" integer, "data_ref" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calcular_previsoes_precos"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer DEFAULT 12) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  resultado jsonb;
BEGIN
  WITH dados_historicos AS (
    -- Agrega dados por mês para análise de tendência
    SELECT 
      date_trunc('month', p.data_atualizacao) as periodo,
      avg(p.custo) as custo_medio,
      avg(p.preco_venda) as preco_medio,
      avg(p.markup) as markup_medio,
      avg((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_media,
      count(*) as total_produtos
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY date_trunc('month', p.data_atualizacao)
    ORDER BY periodo
  ),
  analise_tendencia AS (
    -- Calcula coeficientes de tendência linear
    SELECT 
      regr_slope(custo_medio, extract(epoch from periodo)) as tendencia_custo,
      regr_slope(preco_medio, extract(epoch from periodo)) as tendencia_preco,
      regr_slope(markup_medio, extract(epoch from periodo)) as tendencia_markup,
      regr_slope(margem_media, extract(epoch from periodo)) as tendencia_margem,
      avg(custo_medio) as media_custo,
      avg(preco_medio) as media_preco,
      avg(markup_medio) as media_markup,
      avg(margem_media) as media_margem,
      stddev(custo_medio) as desvio_custo,
      stddev(preco_medio) as desvio_preco,
      stddev(markup_medio) as desvio_markup,
      stddev(margem_media) as desvio_margem
    FROM dados_historicos
  ),
  previsoes_mensais AS (
    -- Gera previsões para os próximos períodos
    SELECT 
      (data_final + (interval '1 month' * n))::date as periodo_previsto,
      (
        SELECT media_custo + (tendencia_custo * (n * 2629746))  -- segundos em um mês
        FROM analise_tendencia
      ) as custo_previsto,
      (
        SELECT media_preco + (tendencia_preco * (n * 2629746))
        FROM analise_tendencia
      ) as preco_previsto,
      (
        SELECT media_markup + (tendencia_markup * (n * 2629746))
        FROM analise_tendencia
      ) as markup_previsto,
      (
        SELECT media_margem + (tendencia_margem * (n * 2629746))
        FROM analise_tendencia
      ) as margem_prevista
    FROM generate_series(1, periodos_futuros) n
  ),
  categorias_tendencia AS (
    -- Analisa tendências por categoria
    SELECT 
      p.categoria,
      regr_slope(p.preco_venda, extract(epoch from p.data_atualizacao)) as tendencia_preco,
      regr_slope(p.markup, extract(epoch from p.data_atualizacao)) as tendencia_markup,
      regr_slope((p.preco_venda - p.custo) / p.preco_venda * 100, 
                 extract(epoch from p.data_atualizacao)) as tendencia_margem,
      avg(p.preco_venda) as preco_medio,
      avg(p.markup) as markup_medio,
      avg((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_media
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY p.categoria
    HAVING count(*) > 5  -- Apenas categorias com dados suficientes
  ),
  sazonalidade AS (
    -- Identifica padrões sazonais
    SELECT 
      extract(month from p.data_atualizacao) as mes,
      avg(p.preco_venda) / (
        SELECT avg(preco_venda) 
        FROM produtos 
        WHERE data_atualizacao BETWEEN data_inicial AND data_final
      ) as indice_sazonal_preco,
      avg(p.markup) / (
        SELECT avg(markup) 
        FROM produtos 
        WHERE data_atualizacao BETWEEN data_inicial AND data_final
      ) as indice_sazonal_markup
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY extract(month from p.data_atualizacao)
  )
  SELECT jsonb_build_object(
    'tendencias_gerais', (
      SELECT jsonb_build_object(
        'custos', jsonb_build_object(
          'tendencia', tendencia_custo,
          'media', media_custo,
          'desvio', desvio_custo
        ),
        'precos', jsonb_build_object(
          'tendencia', tendencia_preco,
          'media', media_preco,
          'desvio', desvio_preco
        ),
        'markup', jsonb_build_object(
          'tendencia', tendencia_markup,
          'media', media_markup,
          'desvio', desvio_markup
        ),
        'margem', jsonb_build_object(
          'tendencia', tendencia_margem,
          'media', media_margem,
          'desvio', desvio_margem
        )
      )
      FROM analise_tendencia
    ),
    'previsoes', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'periodo', to_char(periodo_previsto, 'YYYY-MM-DD'),
          'custo', round(custo_previsto::numeric, 2),
          'preco', round(preco_previsto::numeric, 2),
          'markup', round(markup_previsto::numeric, 2),
          'margem', round(margem_prevista::numeric, 2)
        )
        ORDER BY periodo_previsto
      )
      FROM previsoes_mensais
    ),
    'tendencias_categorias', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'categoria', categoria,
          'tendencia_preco', round(tendencia_preco::numeric, 4),
          'tendencia_markup', round(tendencia_markup::numeric, 4),
          'tendencia_margem', round(tendencia_margem::numeric, 4),
          'preco_medio', round(preco_medio::numeric, 2),
          'markup_medio', round(markup_medio::numeric, 2),
          'margem_media', round(margem_media::numeric, 2)
        )
        ORDER BY tendencia_margem DESC
      )
      FROM categorias_tendencia
    ),
    'sazonalidade', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'mes', mes,
          'indice_preco', round(indice_sazonal_preco::numeric, 4),
          'indice_markup', round(indice_sazonal_markup::numeric, 4)
        )
        ORDER BY mes
      )
      FROM sazonalidade
    ),
    'metricas_confianca', jsonb_build_object(
      'periodo_analise', jsonb_build_object(
        'inicio', data_inicial,
        'fim', data_final
      ),
      'total_registros', (
        SELECT count(*) 
        FROM produtos 
        WHERE data_atualizacao BETWEEN data_inicial AND data_final
      ),
      'categorias_analisadas', (
        SELECT count(*) 
        FROM categorias_tendencia
      )
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$;


ALTER FUNCTION "public"."calcular_previsoes_precos"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calcular_previsoes_precos"("p_tenant_id" "uuid", "data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer DEFAULT 12) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  resultado jsonb;
BEGIN
  WITH dados_historicos AS (
    -- Agrega dados por mês para análise de tendência
    SELECT 
      date_trunc('month', p.data_atualizacao) as periodo,
      avg(p.custo) as custo_medio,
      avg(p.preco_venda) as preco_medio,
      avg(p.markup) as markup_medio,
      avg((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_media,
      count(*) as total_produtos
    FROM produtos p
    WHERE p.tenant_id = p_tenant_id
    AND p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY date_trunc('month', p.data_atualizacao)
    ORDER BY periodo
  ),
  analise_tendencia AS (
    -- Calcula coeficientes de tendência linear
    SELECT 
      regr_slope(custo_medio, extract(epoch from periodo)) as tendencia_custo,
      regr_slope(preco_medio, extract(epoch from periodo)) as tendencia_preco,
      regr_slope(markup_medio, extract(epoch from periodo)) as tendencia_markup,
      regr_slope(margem_media, extract(epoch from periodo)) as tendencia_margem,
      avg(custo_medio) as media_custo,
      avg(preco_medio) as media_preco,
      avg(markup_medio) as media_markup,
      avg(margem_media) as media_margem,
      stddev(custo_medio) as desvio_custo,
      stddev(preco_medio) as desvio_preco,
      stddev(markup_medio) as desvio_markup,
      stddev(margem_media) as desvio_margem
    FROM dados_historicos
  ),
  previsoes_mensais AS (
    -- Gera previsões para os próximos períodos
    SELECT 
      (data_final + (interval '1 month' * n))::date as periodo_previsto,
      (
        SELECT media_custo + (tendencia_custo * (n * 2629746))  -- segundos em um mês
        FROM analise_tendencia
      ) as custo_previsto,
      (
        SELECT media_preco + (tendencia_preco * (n * 2629746))
        FROM analise_tendencia
      ) as preco_previsto,
      (
        SELECT media_markup + (tendencia_markup * (n * 2629746))
        FROM analise_tendencia
      ) as markup_previsto,
      (
        SELECT media_margem + (tendencia_margem * (n * 2629746))
        FROM analise_tendencia
      ) as margem_prevista
    FROM generate_series(1, periodos_futuros) n
  ),
  categorias_tendencia AS (
    -- Analisa tendências por categoria
    SELECT 
      p.categoria,
      regr_slope(p.preco_venda, extract(epoch from p.data_atualizacao)) as tendencia_preco,
      regr_slope(p.markup, extract(epoch from p.data_atualizacao)) as tendencia_markup,
      regr_slope((p.preco_venda - p.custo) / p.preco_venda * 100, 
                 extract(epoch from p.data_atualizacao)) as tendencia_margem,
      avg(p.preco_venda) as preco_medio,
      avg(p.markup) as markup_medio,
      avg((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_media
    FROM produtos p
    WHERE p.tenant_id = p_tenant_id
    AND p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY p.categoria
    HAVING count(*) > 5  -- Apenas categorias com dados suficientes
  ),
  sazonalidade AS (
    -- Identifica padrões sazonais
    SELECT 
      extract(month from p.data_atualizacao) as mes,
      avg(p.preco_venda) / (
        SELECT avg(preco_venda) 
        FROM produtos 
        WHERE tenant_id = p_tenant_id
        AND data_atualizacao BETWEEN data_inicial AND data_final
      ) as indice_sazonal_preco,
      avg(p.markup) / (
        SELECT avg(markup) 
        FROM produtos 
        WHERE tenant_id = p_tenant_id
        AND data_atualizacao BETWEEN data_inicial AND data_final
      ) as indice_sazonal_markup
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
    GROUP BY extract(month from p.data_atualizacao)
  )
  SELECT jsonb_build_object(
    'tendencias_gerais', (
      SELECT jsonb_build_object(
        'custos', jsonb_build_object(
          'tendencia', tendencia_custo,
          'media', media_custo,
          'desvio', desvio_custo
        ),
        'precos', jsonb_build_object(
          'tendencia', tendencia_preco,
          'media', media_preco,
          'desvio', desvio_preco
        ),
        'markup', jsonb_build_object(
          'tendencia', tendencia_markup,
          'media', media_markup,
          'desvio', desvio_markup
        ),
        'margem', jsonb_build_object(
          'tendencia', tendencia_margem,
          'media', media_margem,
          'desvio', desvio_margem
        )
      )
      FROM analise_tendencia
    ),
    'previsoes', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'periodo', to_char(periodo_previsto, 'YYYY-MM-DD'),
          'custo', round(custo_previsto::numeric, 2),
          'preco', round(preco_previsto::numeric, 2),
          'markup', round(markup_previsto::numeric, 2),
          'margem', round(margem_prevista::numeric, 2)
        )
        ORDER BY periodo_previsto
      )
      FROM previsoes_mensais
    ),
    'tendencias_categorias', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'categoria', categoria,
          'tendencia_preco', round(tendencia_preco::numeric, 4),
          'tendencia_markup', round(tendencia_markup::numeric, 4),
          'tendencia_margem', round(tendencia_margem::numeric, 4),
          'preco_medio', round(preco_medio::numeric, 2),
          'markup_medio', round(markup_medio::numeric, 2),
          'margem_media', round(margem_media::numeric, 2)
        )
        ORDER BY tendencia_margem DESC
      )
      FROM categorias_tendencia
    ),
    'sazonalidade', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'mes', mes,
          'indice_preco', round(indice_sazonal_preco::numeric, 4),
          'indice_markup', round(indice_sazonal_markup::numeric, 4)
        )
        ORDER BY mes
      )
      FROM sazonalidade
    ),
    'metricas_confianca', jsonb_build_object(
      'periodo_analise', jsonb_build_object(
        'inicio', data_inicial,
        'fim', data_final
      ),
      'total_registros', (
        SELECT count(*) 
        FROM produtos 
        WHERE tenant_id = p_tenant_id
        AND data_atualizacao BETWEEN data_inicial AND data_final
      ),
      'categorias_analisadas', (
        SELECT count(*) 
        FROM categorias_tendencia
      )
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$;


ALTER FUNCTION "public"."calcular_previsoes_precos"("p_tenant_id" "uuid", "data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) OWNER TO "postgres";

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



CREATE OR REPLACE FUNCTION "public"."gerar_relatorio_margens"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "incluir_comparativo" boolean DEFAULT true) RETURNS SETOF "public"."pricing_report_margins"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  WITH dados_periodo_atual AS (
    SELECT 
      p.categoria,
      p.nome as produto,
      p.custo,
      p.preco_venda,
      p.markup,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_lucro
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN data_inicial AND data_final
  ),
  dados_periodo_anterior AS (
    SELECT 
      p.categoria,
      p.nome as produto,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem_anterior
    FROM produtos p
    WHERE p.data_atualizacao BETWEEN 
      data_inicial - (data_final - data_inicial) AND 
      data_inicial
  )
  SELECT 
    d.categoria,
    d.produto,
    d.custo,
    d.preco_venda,
    d.markup,
    d.margem_lucro,
    CASE 
      WHEN incluir_comparativo THEN
        COALESCE(d.margem_lucro - da.margem_anterior, 0)
      ELSE 0
    END as variacao_periodo_anterior
  FROM dados_periodo_atual d
  LEFT JOIN dados_periodo_anterior da 
    ON d.categoria = da.categoria 
    AND d.produto = da.produto;
END;
$$;


ALTER FUNCTION "public"."gerar_relatorio_margens"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "incluir_comparativo" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."gerar_relatorio_regras"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) RETURNS SETOF "public"."pricing_report_rules"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.nome,
    r.tipo,
    r.condicao,
    r.markup,
    r.created_at as data_criacao,
    r.updated_at as data_modificacao,
    r.status
  FROM regras_preco r
  WHERE r.created_at BETWEEN data_inicial AND data_final
  ORDER BY r.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."gerar_relatorio_regras"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."gerar_relatorio_simulacoes"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) RETURNS SETOF "public"."pricing_report_simulations"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    p.nome as produto,
    s.preco_base,
    s.markup_aplicado,
    s.preco_final,
    s.created_at as data_simulacao,
    u.nome as usuario
  FROM simulacoes_preco s
  JOIN produtos p ON s.produto_id = p.id
  JOIN usuarios u ON s.usuario_id = u.id
  WHERE s.created_at BETWEEN data_inicial AND data_final
  ORDER BY s.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."gerar_relatorio_simulacoes"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) OWNER TO "postgres";


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


CREATE OR REPLACE FUNCTION "public"."obter_metricas_comparativas"("data_inicial_atual" timestamp with time zone, "data_final_atual" timestamp with time zone, "data_inicial_anterior" timestamp with time zone, "data_final_anterior" timestamp with time zone) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  resultado jsonb;
  metricas_atual jsonb;
  metricas_anterior jsonb;
BEGIN
  -- Calcula métricas do período atual
  WITH dados_periodo AS (
    SELECT 
      p.custo,
      p.preco_venda,
      p.markup,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem,
      p.categoria,
      p.data_atualizacao,
      r.id as regra_id,
      r.ativo as regra_ativa
    FROM produtos p
    LEFT JOIN regras_preco r ON r.categoria = p.categoria
    WHERE p.data_atualizacao BETWEEN data_inicial_atual AND data_final_atual
  ),
  evolucao AS (
    SELECT 
      date_trunc('day', data_atualizacao) as data,
      avg(margem) as margem,
      avg(markup) as markup
    FROM dados_periodo
    GROUP BY date_trunc('day', data_atualizacao)
    ORDER BY data
  ),
  distribuicao AS (
    SELECT 
      CASE 
        WHEN margem < 0 THEN 'Negativa'
        WHEN margem BETWEEN 0 AND 10 THEN '0-10%'
        WHEN margem BETWEEN 10 AND 20 THEN '10-20%'
        WHEN margem BETWEEN 20 AND 30 THEN '20-30%'
        WHEN margem BETWEEN 30 AND 40 THEN '30-40%'
        ELSE '40%+'
      END as faixa,
      count(*) as quantidade,
      (count(*)::float / (SELECT count(*) FROM dados_periodo) * 100) as percentual
    FROM dados_periodo
    GROUP BY 1
    ORDER BY 1
  )
  SELECT jsonb_build_object(
    'margemMedia', (SELECT avg(margem) FROM dados_periodo),
    'markupMedio', (SELECT avg(markup) FROM dados_periodo),
    'variacaoCustos', (
      SELECT ((max(custo) - min(custo)) / min(custo) * 100)
      FROM dados_periodo
    ),
    'variacaoPrecos', (
      SELECT ((max(preco_venda) - min(preco_venda)) / min(preco_venda) * 100)
      FROM dados_periodo
    ),
    'efetividadeRegras', (
      SELECT (count(*) FILTER (WHERE regra_ativa) * 100.0 / nullif(count(*), 0))
      FROM dados_periodo
      WHERE regra_id IS NOT NULL
    ),
    'distribuicaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'faixa', faixa,
          'quantidade', quantidade,
          'percentual', percentual
        )
      )
      FROM distribuicao
    ),
    'evolucaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'data', to_char(data, 'DD/MM/YYYY'),
          'margem', round(margem::numeric, 2),
          'markup', round(markup::numeric, 2)
        )
      )
      FROM evolucao
    )
  ) INTO metricas_atual;

  -- Calcula métricas do período anterior
  WITH dados_periodo AS (
    SELECT 
      p.custo,
      p.preco_venda,
      p.markup,
      ((p.preco_venda - p.custo) / p.preco_venda * 100) as margem,
      p.categoria,
      p.data_atualizacao,
      r.id as regra_id,
      r.ativo as regra_ativa
    FROM produtos p
    LEFT JOIN regras_preco r ON r.categoria = p.categoria
    WHERE p.data_atualizacao BETWEEN data_inicial_anterior AND data_final_anterior
  ),
  evolucao AS (
    SELECT 
      date_trunc('day', data_atualizacao) as data,
      avg(margem) as margem,
      avg(markup) as markup
    FROM dados_periodo
    GROUP BY date_trunc('day', data_atualizacao)
    ORDER BY data
  ),
  distribuicao AS (
    SELECT 
      CASE 
        WHEN margem < 0 THEN 'Negativa'
        WHEN margem BETWEEN 0 AND 10 THEN '0-10%'
        WHEN margem BETWEEN 10 AND 20 THEN '10-20%'
        WHEN margem BETWEEN 20 AND 30 THEN '20-30%'
        WHEN margem BETWEEN 30 AND 40 THEN '30-40%'
        ELSE '40%+'
      END as faixa,
      count(*) as quantidade,
      (count(*)::float / (SELECT count(*) FROM dados_periodo) * 100) as percentual
    FROM dados_periodo
    GROUP BY 1
    ORDER BY 1
  )
  SELECT jsonb_build_object(
    'margemMedia', (SELECT avg(margem) FROM dados_periodo),
    'markupMedio', (SELECT avg(markup) FROM dados_periodo),
    'variacaoCustos', (
      SELECT ((max(custo) - min(custo)) / min(custo) * 100)
      FROM dados_periodo
    ),
    'variacaoPrecos', (
      SELECT ((max(preco_venda) - min(preco_venda)) / min(preco_venda) * 100)
      FROM dados_periodo
    ),
    'efetividadeRegras', (
      SELECT (count(*) FILTER (WHERE regra_ativa) * 100.0 / nullif(count(*), 0))
      FROM dados_periodo
      WHERE regra_id IS NOT NULL
    ),
    'distribuicaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'faixa', faixa,
          'quantidade', quantidade,
          'percentual', percentual
        )
      )
      FROM distribuicao
    ),
    'evolucaoMargens', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'data', to_char(data, 'DD/MM/YYYY'),
          'margem', round(margem::numeric, 2),
          'markup', round(markup::numeric, 2)
        )
      )
      FROM evolucao
    )
  ) INTO metricas_anterior;

  -- Monta o resultado final
  SELECT jsonb_build_object(
    'periodoAtual', jsonb_build_object(
      'dataInicial', data_inicial_atual,
      'dataFinal', data_final_atual,
      'metricas', metricas_atual
    ),
    'periodoAnterior', jsonb_build_object(
      'dataInicial', data_inicial_anterior,
      'dataFinal', data_final_anterior,
      'metricas', metricas_anterior
    )
  ) INTO resultado;

  RETURN resultado;
END;
$$;


ALTER FUNCTION "public"."obter_metricas_comparativas"("data_inicial_atual" timestamp with time zone, "data_final_atual" timestamp with time zone, "data_inicial_anterior" timestamp with time zone, "data_final_anterior" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."obter_metricas_gerais"("p_tenant_id" "uuid") RETURNS TABLE("total_produtos" integer, "margem_media_global" numeric, "markup_medio_global" numeric, "regras_ativas" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (
      SELECT COUNT(DISTINCT produto_id)
      FROM historico_preco
      WHERE tenant_id = p_tenant_id
    ) as total_produtos,
    (
      SELECT ROUND(AVG(
        ((valor_venda - valor_custo) / valor_custo * 100)
      )::DECIMAL(10,2), 2)
      FROM historico_preco
      WHERE tenant_id = p_tenant_id
    ) as margem_media_global,
    (
      SELECT ROUND(AVG(CASE 
        WHEN tipo_markup = 'percentual' THEN valor_markup 
        ELSE valor_markup / 100 
      END)::DECIMAL(10,2), 2)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
    ) as markup_medio_global,
    (
      SELECT COUNT(*)
      FROM regras_preco
      WHERE tenant_id = p_tenant_id
      AND ativo = true
    ) as regras_ativas;
END;
$$;


ALTER FUNCTION "public"."obter_metricas_gerais"("p_tenant_id" "uuid") OWNER TO "postgres";


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



CREATE OR REPLACE FUNCTION "public"."reordenar_markups"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."reordenar_markups"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."simular_preco"("tipo_produto" "text", "valor_custo" numeric, "quantidade" integer DEFAULT 1, "cliente_id" "uuid" DEFAULT NULL::"uuid", "fornecedor_id" "uuid" DEFAULT NULL::"uuid", "data_simulacao" "date" DEFAULT CURRENT_DATE) RETURNS TABLE("preco_final" numeric, "markup_total" numeric, "detalhamento" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."simular_preco"("tipo_produto" "text", "valor_custo" numeric, "quantidade" integer, "cliente_id" "uuid", "fornecedor_id" "uuid", "data_simulacao" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."support_auto_close_sweep"("p_days" integer DEFAULT 14) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'cp', 'extensions', 'pg_temp'
    AS $$
declare
  rec record;
begin
  for rec in
    update cp.support_tickets t
       set status = 'resolved',
           closed_at = now(),
           updated_at = now()
     where coalesce(t.status,'') not in ('resolved','closed')
       and coalesce((select max(m.created_at) from cp.support_messages m where m.ticket_id = t.id), t.created_at) < now() - (p_days || ' days')::interval
     returning t.id
  loop
    perform public.support_notify_http(json_build_object('type','ticket_updated','ticketId', rec.id));
  end loop;
end;
$$;


ALTER FUNCTION "public"."support_auto_close_sweep"("p_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."support_notify_http"("payload" "jsonb", "target_url" "text" DEFAULT "current_setting"('app.support_email_url'::"text", true), "secret" "text" DEFAULT "current_setting"('app.support_email_secret'::"text", true)) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
declare
  v_headers http_header[];
  v_url text;
  v_secret text;
  v_status int;
  v_content text;
begin
  v_url := coalesce(target_url, current_setting('app.support_email_url', true));
  v_secret := coalesce(secret, current_setting('app.support_email_secret', true));
  if v_url is null or v_secret is null then
    raise notice 'support_notify_http skipped: url or secret not configured';
    return;
  end if;
  v_headers := array[ http_header('Authorization', 'Bearer ' || v_secret), http_header('Content-Type','application/json') ];
  select status, content into v_status, v_content
  from extensions.http_post(v_url, payload::text, 'application/json', v_headers);
  if v_status not between 200 and 299 then
    raise warning 'support_notify_http failed % %', v_status, v_content;
  end if;
exception when others then
  raise warning 'support_notify_http error: %', sqlerrm;
end;
$$;


ALTER FUNCTION "public"."support_notify_http"("payload" "jsonb", "target_url" "text", "secret" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."support_set_function_config"("p_url" "text", "p_secret" "text") RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select set_config('app.support_email_url', p_url, false),
         set_config('app.support_email_secret', p_secret, false);
$$;


ALTER FUNCTION "public"."support_set_function_config"("p_url" "text", "p_secret" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."support_sla_sweep"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'cp', 'extensions', 'pg_temp'
    AS $$
declare
  rec record;
begin
  -- ensure SLA baseline for open tickets
  insert into cp.support_sla (ticket_id, tenant_id, target_at, created_at)
  select t.id, t.tenant_id, now() + interval '24 hours', now()
  from cp.support_tickets t
  left join cp.support_sla s on s.ticket_id = t.id
  where s.ticket_id is null
    and coalesce(t.status,'') not in ('resolved','closed');

  -- mark breached SLAs and notify once
  for rec in
    update cp.support_sla s
       set breached_at = now()
     from cp.support_tickets t
    where s.ticket_id = t.id
      and coalesce(t.status,'') not in ('resolved','closed')
      and s.target_at is not null
      and now() > s.target_at
      and s.breached_at is null
    returning s.ticket_id
  loop
    perform public.support_notify_http(json_build_object('type','ticket_updated','ticketId', rec.ticket_id));
  end loop;
end;
$$;


ALTER FUNCTION "public"."support_sla_sweep"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."trigger_set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_centros_custo_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_centros_custo_updated_at"() OWNER TO "postgres";


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
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    -- O PERFORM executa a função vault.create_secret e descarta seu resultado.
    PERFORM vault.create_secret(p_secret, p_name);
END;$$;


ALTER FUNCTION "public"."upsert_secret"("p_name" "text", "p_secret" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validar_regra_preco"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."validar_regra_preco"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."api_key_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "route" "text" NOT NULL,
    "country_from" "text",
    "country_to" "text",
    "purpose" "text",
    "duration" "text",
    "status" smallint NOT NULL,
    "elapsed_ms" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."api_key_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."api_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "hash" "text" NOT NULL,
    "last4" "text" NOT NULL,
    "scope" "text"[] DEFAULT ARRAY[]::"text"[] NOT NULL,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "key_hash" "text"
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


CREATE TABLE IF NOT EXISTS "cp"."contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "role" "text",
    "is_primary" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."control_plane_config" (
    "id" bigint DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "limites" "jsonb" DEFAULT '{"max_leads_por_tenant": 100, "max_usuarios_por_tenant": 5, "max_requisicoes_api_por_dia": 1000, "max_armazenamento_por_tenant": 1024}'::"jsonb" NOT NULL,
    "instancia" "jsonb" DEFAULT '{"modo_manutencao": false, "versao_atual_api": "1.0.0", "versao_minima_cli": "1.0.0", "dominios_permitidos": []}'::"jsonb" NOT NULL,
    "servicos" "jsonb" DEFAULT '{"oauth_habilitado": false, "convites_habilitados": true, "api_publica_habilitada": true, "registro_publico_habilitado": true}'::"jsonb" NOT NULL,
    CONSTRAINT "control_plane_config_singleton" CHECK (("id" = 1))
);


ALTER TABLE "cp"."control_plane_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."control_plane_user_activities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "tenant_id" "uuid",
    "tipo" "text" NOT NULL,
    "descricao" "text" NOT NULL,
    "ip_address" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "fk_tenant_user" CHECK (true)
);


ALTER TABLE "cp"."control_plane_user_activities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."control_plane_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_id" "uuid",
    "tenant_id" "uuid",
    "email" "text" NOT NULL,
    "nome" "text",
    "role" "text" DEFAULT 'readonly'::"text" NOT NULL,
    "status" "text" DEFAULT 'pendente'::"text" NOT NULL,
    "two_factor_enabled" boolean DEFAULT false NOT NULL,
    "permissoes" "jsonb"[] DEFAULT '{}'::"jsonb"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "avatar_url" "text",
    "ultimo_acesso" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "cp"."control_plane_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."domains" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."domains" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."invoices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subscription_id" "uuid",
    "tenant_id" "uuid" NOT NULL,
    "amount_cents" integer NOT NULL,
    "currency" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "issued_at" timestamp with time zone,
    "due_at" timestamp with time zone,
    "paid_at" timestamp with time zone,
    "stripe_invoice_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."invoices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."lead_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "action" "text" NOT NULL,
    "details" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."lead_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."lead_stages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "slug" "text" NOT NULL,
    "label" "text" NOT NULL,
    "ord" smallint DEFAULT 0 NOT NULL,
    "is_won" boolean DEFAULT false NOT NULL,
    "is_lost" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."lead_stages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_name" "text",
    "email" "text",
    "phone" "text",
    "source" "text",
    "stage" "text" DEFAULT 'novo'::"text",
    "value_cents" integer DEFAULT 0,
    "owner_id" "uuid",
    "tenant_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "utm_source" "text",
    "utm_medium" "text",
    "utm_campaign" "text",
    "utm_content" "text",
    "utm_term" "text",
    "capture_channel" "text" DEFAULT 'web'::"text",
    "consent" boolean DEFAULT false,
    "page_url" "text",
    "referrer" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "position" double precision DEFAULT 0,
    "stage_id" "uuid"
);


ALTER TABLE "cp"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."ledger_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."ledger_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."ledger_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "tenant_id" "uuid",
    "amount_cents" integer NOT NULL,
    "memo" "text",
    "occurred_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."ledger_entries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."modules_registry" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "is_core" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "cp"."modules_registry" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."notes" OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "cp"."subscription_addon_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subscription_id" "uuid",
    "addon_id" "uuid",
    "quantity" integer DEFAULT 1,
    "unit_price" numeric(10,2) NOT NULL,
    "total_price" numeric(10,2) NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ends_at" timestamp with time zone,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "positive_quantity" CHECK (("quantity" > 0)),
    CONSTRAINT "valid_prices" CHECK ((("unit_price" >= (0)::numeric) AND ("total_price" = (("quantity")::numeric * "unit_price"))))
);


ALTER TABLE "cp"."subscription_addon_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."subscription_addons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "billing_cycle" "public"."billing_cycle" DEFAULT 'monthly'::"public"."billing_cycle" NOT NULL,
    "is_public" boolean DEFAULT true,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."subscription_addons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."subscription_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT true,
    "is_custom" boolean DEFAULT false,
    "sort_order" integer DEFAULT 0,
    "monthly_price" numeric(10,2),
    "quarterly_price" numeric(10,2),
    "yearly_price" numeric(10,2),
    "setup_fee" numeric(10,2) DEFAULT 0,
    "trial_days" integer DEFAULT 0,
    "features" "jsonb" DEFAULT '{"users": 5, "api_access": false, "storage_gb": 10, "white_label": false, "custom_domain": false, "priority_support": false, "api_requests_per_day": 1000}'::"jsonb" NOT NULL,
    "modules" "jsonb" DEFAULT '{"crm": false, "core": true, "visa": false, "billing": false, "support": false}'::"jsonb" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."subscription_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "stripe_subscription_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."support_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "ticket_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "actor_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."support_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."support_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "ticket_id" "uuid" NOT NULL,
    "sender_id" "uuid",
    "sender_role" "text",
    "body" "text" NOT NULL,
    "attachments" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "internal" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."support_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."support_sla" (
    "ticket_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "policy" "text",
    "target_at" timestamp with time zone,
    "breached_at" timestamp with time zone,
    "resolved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."support_sla" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."support_tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "subject" "text" NOT NULL,
    "summary" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "priority" "text" DEFAULT 'normal'::"text" NOT NULL,
    "channel" "text",
    "requester_id" "uuid",
    "requester_email" "text",
    "assigned_to" "uuid",
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "first_response_at" timestamp with time zone,
    "last_message_at" timestamp with time zone,
    "closed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."support_tickets" OWNER TO "postgres";


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



CREATE TABLE IF NOT EXISTS "cp"."tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "title" "text" NOT NULL,
    "status" "text" DEFAULT 'aberta'::"text",
    "due_date" "date",
    "assigned_to" "uuid",
    "entity_type" "text",
    "entity_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "cp"."tasks" OWNER TO "postgres";


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


CREATE OR REPLACE VIEW "cp"."v_api_key_usage_daily" AS
 SELECT "date_trunc"('day'::"text", "created_at") AS "day",
    "tenant_id",
    "count"(*) AS "calls"
   FROM "cp"."api_key_logs"
  GROUP BY ("date_trunc"('day'::"text", "created_at")), "tenant_id";


ALTER VIEW "cp"."v_api_key_usage_daily" OWNER TO "postgres";


CREATE OR REPLACE VIEW "cp"."v_support_ticket_status_counts" AS
 SELECT "tenant_id",
    "status",
    ("count"(*))::integer AS "total"
   FROM "cp"."support_tickets"
  GROUP BY "tenant_id", "status";


ALTER VIEW "cp"."v_support_ticket_status_counts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "cp"."v_users" AS
 SELECT "u"."id",
    "u"."email",
    "u"."created_at",
    "u"."last_sign_in_at",
    (COALESCE("m"."tenants_count", (0)::bigint))::integer AS "tenants_count"
   FROM ("auth"."users" "u"
     LEFT JOIN ( SELECT "user_tenant_roles"."user_id",
            "count"(*) AS "tenants_count"
           FROM "cp"."user_tenant_roles"
          GROUP BY "user_tenant_roles"."user_id") "m" ON (("m"."user_id" = "u"."id")));


ALTER VIEW "cp"."v_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "cp"."webhook_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "source" "text",
    "event" "text",
    "status" "text",
    "payload" "jsonb",
    "response" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "cp"."webhook_logs" OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "public"."clientes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "nome" character varying(255) NOT NULL,
    "tipo" character varying(20),
    "cnpj_cpf" character varying(20),
    "email" character varying(255),
    "telefone" character varying(20),
    "telefone_secundario" character varying(20),
    "endereco_logradouro" character varying(255),
    "endereco_numero" character varying(20),
    "endereco_complemento" character varying(100),
    "endereco_bairro" character varying(100),
    "endereco_cidade" character varying(100),
    "endereco_estado" character varying(2),
    "endereco_cep" character varying(10),
    "endereco_pais" character varying(2) DEFAULT 'BR'::character varying,
    "limite_credito" numeric(15,2),
    "dias_prazo_pagamento" integer,
    "ativo" boolean DEFAULT true,
    "observacoes" "text",
    "tags" "text"[],
    "dados_adicionais" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "clientes_tipo_check" CHECK ((("tipo")::"text" = ANY ((ARRAY['pessoa_fisica'::character varying, 'pessoa_juridica'::character varying])::"text"[])))
);


ALTER TABLE "public"."clientes" OWNER TO "postgres";


COMMENT ON TABLE "public"."clientes" IS 'Clientes dos tenants';



CREATE TABLE IF NOT EXISTS "public"."fin_adiantamentos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "marca" "public"."marca" NOT NULL,
    "numero_adiantamento" character varying(50) NOT NULL,
    "tipo" "public"."fin_tipo_adiantamento" NOT NULL,
    "fornecedor_id" "uuid" NOT NULL,
    "fornecedor_nome" character varying(200),
    "reserva_id" "uuid",
    "valor_original" numeric(15,2) NOT NULL,
    "valor_utilizado" numeric(15,2) DEFAULT 0,
    "valor_disponivel" numeric(15,2) NOT NULL,
    "moeda" "public"."moeda" DEFAULT 'BRL'::"public"."moeda",
    "taxa_cambio" numeric(10,6) DEFAULT 1,
    "data_pagamento" "date" NOT NULL,
    "data_expiracao" "date",
    "status" "public"."fin_status_adiantamento" DEFAULT 'ativo'::"public"."fin_status_adiantamento",
    "forma_pagamento" "public"."forma_pagamento",
    "conta_bancaria_id" "uuid",
    "comprovante_pagamento_url" "text",
    "observacoes" "text",
    "condicoes_uso" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_adiantamentos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_alocacoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "centro_custo_id" "uuid" NOT NULL,
    "receita_id" "uuid",
    "despesa_id" "uuid",
    "tipo_rateio" character varying(30) NOT NULL,
    "percentual_alocacao" numeric(5,2),
    "valor_alocado" numeric(15,2) NOT NULL,
    "observacoes" "text",
    "data_alocacao" "date" DEFAULT CURRENT_DATE NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    CONSTRAINT "fin_alocacoes_check" CHECK (((("receita_id" IS NOT NULL) AND ("despesa_id" IS NULL)) OR (("receita_id" IS NULL) AND ("despesa_id" IS NOT NULL)))),
    CONSTRAINT "fin_alocacoes_check1" CHECK ((((("tipo_rateio")::"text" = 'percentual'::"text") AND ("percentual_alocacao" IS NOT NULL) AND ("percentual_alocacao" >= (0)::numeric) AND ("percentual_alocacao" <= (100)::numeric)) OR (("tipo_rateio")::"text" = ANY ((ARRAY['valor_fixo'::character varying, 'proporcional'::character varying])::"text"[])))),
    CONSTRAINT "fin_alocacoes_tipo_rateio_check" CHECK ((("tipo_rateio")::"text" = ANY ((ARRAY['percentual'::character varying, 'valor_fixo'::character varying, 'proporcional'::character varying])::"text"[])))
);


ALTER TABLE "public"."fin_alocacoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_categorias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "nome" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "categoria_pai_id" "uuid",
    "cor" "text",
    "icone" "text",
    "ordem" integer DEFAULT 0,
    "ativo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_categorias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_centros_custo" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "codigo" character varying(50) NOT NULL,
    "nome" character varying(255) NOT NULL,
    "descricao" "text",
    "tipo" character varying(50) NOT NULL,
    "marca" "public"."marca",
    "data_inicio" "date" NOT NULL,
    "data_fim" "date",
    "orcamento_previsto" numeric(15,2) DEFAULT 0,
    "moeda" "public"."moeda" DEFAULT 'BRL'::"public"."moeda",
    "meta_margem_percentual" numeric(5,2) DEFAULT 15.00,
    "meta_receita" numeric(15,2),
    "status" character varying(30) DEFAULT 'planejamento'::character varying NOT NULL,
    "responsavel_id" "uuid",
    "equipe" "jsonb",
    "tags" "text"[],
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    CONSTRAINT "fin_centros_custo_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['planejamento'::character varying, 'ativo'::character varying, 'concluido'::character varying, 'cancelado'::character varying])::"text"[]))),
    CONSTRAINT "fin_centros_custo_tipo_check" CHECK ((("tipo")::"text" = ANY ((ARRAY['viagem'::character varying, 'grupo'::character varying, 'cliente'::character varying, 'projeto'::character varying, 'evento'::character varying, 'outros'::character varying])::"text"[])))
);


ALTER TABLE "public"."fin_centros_custo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_comissoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "receita_id" "uuid",
    "fornecedor_id" "uuid",
    "percentual" numeric(5,2) NOT NULL,
    "valor_comissao" numeric(15,2) NOT NULL,
    "moeda" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "status" "text" DEFAULT 'pendente'::"text" NOT NULL,
    "data_vencimento" "date",
    "data_pagamento" "date",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_comissoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_comissoes_recebidas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "tipo" "public"."fin_tipo_comissao" NOT NULL,
    "fornecedor_id" "uuid",
    "produto_id" "uuid",
    "valor_bruto" numeric(15,2) NOT NULL,
    "percentual" numeric(5,2),
    "valor_comissao" numeric(15,2) NOT NULL,
    "moeda" "public"."moeda" DEFAULT 'BRL'::"public"."moeda",
    "data_prevista" "date",
    "data_recebida" "date",
    "status" "public"."fin_status_comissao" DEFAULT 'pendente'::"public"."fin_status_comissao",
    "origem" "text",
    "comprovante_url" "text",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_comissoes_recebidas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_comissoes_split" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "comissao_id" "uuid" NOT NULL,
    "tipo_repassado" "public"."fin_tipo_repassado" NOT NULL,
    "usuario_id" "uuid",
    "percentual" numeric(5,2),
    "valor_repassado" numeric(15,2),
    "status" "public"."fin_status_comissao" DEFAULT 'prevista'::"public"."fin_status_comissao",
    "data_repassada" "date",
    "metodo_pagamento" "text",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_comissoes_split" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_condicoes_pagamento" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "nome" character varying(100) NOT NULL,
    "codigo" character varying(20),
    "tipo" "public"."fin_tipo_condicao_pagamento" NOT NULL,
    "dias_vencimento" integer DEFAULT 0,
    "referencia_data" "public"."fin_referencia_data" DEFAULT 'emissao'::"public"."fin_referencia_data",
    "numero_parcelas" integer DEFAULT 1,
    "intervalo_parcelas" integer DEFAULT 30,
    "percentual_desconto_antecipacao" numeric(5,2),
    "percentual_juros_atraso" numeric(5,2),
    "descricao" "text",
    "ativo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_condicoes_pagamento" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_contas_bancarias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "marca" "text" NOT NULL,
    "nome" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "banco" "text" NOT NULL,
    "agencia" "text",
    "conta" "text",
    "moeda" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "saldo_inicial" numeric(15,2) DEFAULT 0,
    "saldo_atual" numeric(15,2) DEFAULT 0,
    "ativo" boolean DEFAULT true,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_contas_bancarias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_creditos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "marca" "public"."marca" NOT NULL,
    "numero_credito" character varying(50) NOT NULL,
    "tipo_credito" "public"."fin_tipo_credito" NOT NULL,
    "fornecedor_id" "uuid" NOT NULL,
    "fornecedor_nome" character varying(200),
    "duplicata_origem_id" "uuid",
    "reserva_id" "uuid",
    "valor_original" numeric(15,2) NOT NULL,
    "valor_utilizado" numeric(15,2) DEFAULT 0,
    "valor_disponivel" numeric(15,2) NOT NULL,
    "moeda" "public"."moeda" DEFAULT 'BRL'::"public"."moeda",
    "taxa_cambio" numeric(10,6) DEFAULT 1,
    "data_recebimento" "date" NOT NULL,
    "data_expiracao" "date",
    "status" "public"."fin_status_credito" DEFAULT 'disponivel'::"public"."fin_status_credito",
    "motivo" "text" NOT NULL,
    "documento_referencia" character varying(100),
    "comprovante_url" "text",
    "observacoes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_creditos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_despesas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "marca" "text" NOT NULL,
    "descricao" "text" NOT NULL,
    "categoria_id" "uuid",
    "valor" numeric(15,2) NOT NULL,
    "moeda" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "taxa_cambio" numeric(10,4) DEFAULT 1,
    "valor_brl" numeric(15,2) GENERATED ALWAYS AS (("valor" * "taxa_cambio")) STORED,
    "tipo_despesa" "text" NOT NULL,
    "fornecedor_id" "uuid",
    "pedido_id" "uuid",
    "status" "text" DEFAULT 'pendente'::"text" NOT NULL,
    "data_vencimento" "date" NOT NULL,
    "data_pagamento" "date",
    "data_competencia" "date" NOT NULL,
    "forma_pagamento" "text",
    "conta_bancaria_id" "uuid",
    "centro_custo" "text",
    "projeto_associado" "text",
    "recorrente" boolean DEFAULT false,
    "frequencia_recorrencia" "text",
    "proximo_vencimento" "date",
    "nota_fiscal" "text",
    "comprovante_url" "text",
    "observacoes" "text",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_despesas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_duplicatas_pagar" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "marca" "public"."marca" NOT NULL,
    "numero_duplicata" character varying(50) NOT NULL,
    "numero_nota_fiscal" character varying(50),
    "serie_nota_fiscal" character varying(10),
    "chave_acesso_nfe" character varying(44),
    "fornecedor_id" "uuid" NOT NULL,
    "reserva_id" "uuid",
    "pedido_id" "uuid",
    "condicao_pagamento_id" "uuid",
    "adiantamento_id" "uuid",
    "valor_original" numeric(15,2) NOT NULL,
    "valor_desconto" numeric(15,2) DEFAULT 0,
    "valor_juros" numeric(15,2) DEFAULT 0,
    "valor_total" numeric(15,2) NOT NULL,
    "valor_pago" numeric(15,2) DEFAULT 0,
    "valor_pendente" numeric(15,2) NOT NULL,
    "valor_credito_aplicado" numeric(15,2) DEFAULT 0,
    "moeda" "public"."moeda" DEFAULT 'BRL'::"public"."moeda",
    "taxa_cambio" numeric(10,6) DEFAULT 1,
    "valor_brl" numeric(15,2) GENERATED ALWAYS AS (("valor_total" * "taxa_cambio")) STORED,
    "data_emissao" "date" NOT NULL,
    "data_vencimento" "date" NOT NULL,
    "data_pagamento" "date",
    "data_referencia" "date",
    "status" "public"."fin_status_duplicata" DEFAULT 'aberta'::"public"."fin_status_duplicata",
    "fornecedor_nome" character varying(200),
    "fornecedor_documento" character varying(20),
    "fornecedor_email" character varying(200),
    "fornecedor_telefone" character varying(20),
    "forma_pagamento" "public"."forma_pagamento",
    "conta_bancaria_id" "uuid",
    "comprovante_pagamento_url" "text",
    "observacoes" "text",
    "condicao_pagamento_texto" "text",
    "documento_url" "text",
    "xml_nfe_url" "text",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_duplicatas_pagar" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_duplicatas_receber" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "marca" "public"."marca" NOT NULL,
    "numero_duplicata" character varying(50) NOT NULL,
    "numero_nota_fiscal" character varying(50),
    "serie_nota_fiscal" character varying(10),
    "chave_acesso_nfe" character varying(44),
    "cliente_id" "uuid",
    "fornecedor_intermediario_id" "uuid",
    "reserva_id" "uuid",
    "pedido_id" "uuid",
    "orcamento_id" "uuid",
    "condicao_pagamento_id" "uuid",
    "valor_original" numeric(15,2) NOT NULL,
    "valor_desconto" numeric(15,2) DEFAULT 0,
    "valor_juros" numeric(15,2) DEFAULT 0,
    "valor_total" numeric(15,2) NOT NULL,
    "valor_recebido" numeric(15,2) DEFAULT 0,
    "valor_pendente" numeric(15,2) NOT NULL,
    "moeda" "public"."moeda" DEFAULT 'BRL'::"public"."moeda",
    "taxa_cambio" numeric(10,6) DEFAULT 1,
    "valor_brl" numeric(15,2) GENERATED ALWAYS AS (("valor_total" * "taxa_cambio")) STORED,
    "data_emissao" "date" NOT NULL,
    "data_vencimento" "date" NOT NULL,
    "data_recebimento" "date",
    "data_referencia" "date",
    "status" "public"."fin_status_duplicata" DEFAULT 'aberta'::"public"."fin_status_duplicata",
    "cliente_nome" character varying(200),
    "cliente_documento" character varying(20),
    "cliente_email" character varying(200),
    "cliente_telefone" character varying(20),
    "observacoes" "text",
    "condicao_pagamento_texto" "text",
    "documento_url" "text",
    "xml_nfe_url" "text",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_duplicatas_receber" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_fornecedores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "nome" character varying(255) NOT NULL,
    "razao_social" character varying(255),
    "cnpj_cpf" character varying(20),
    "email" character varying(255),
    "telefone" character varying(20),
    "contato_nome" character varying(255),
    "endereco_logradouro" character varying(255),
    "endereco_numero" character varying(20),
    "endereco_complemento" character varying(100),
    "endereco_bairro" character varying(100),
    "endereco_cidade" character varying(100),
    "endereco_estado" character varying(2),
    "endereco_cep" character varying(10),
    "endereco_pais" character varying(2) DEFAULT 'BR'::character varying,
    "banco_codigo" character varying(10),
    "banco_nome" character varying(255),
    "agencia" character varying(20),
    "conta" character varying(30),
    "tipo_conta" character varying(20),
    "pix_chave" character varying(255),
    "pix_tipo" character varying(20),
    "prazo_pagamento_padrao" integer,
    "desconto_padrao" numeric(5,2),
    "tipo_servico" character varying(100),
    "categoria" character varying(100),
    "tags" "text"[],
    "ativo" boolean DEFAULT true,
    "observacoes" "text",
    "dados_adicionais" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "fin_fornecedores_pix_tipo_check" CHECK ((("pix_tipo")::"text" = ANY ((ARRAY['cpf'::character varying, 'cnpj'::character varying, 'email'::character varying, 'telefone'::character varying, 'aleatoria'::character varying])::"text"[]))),
    CONSTRAINT "fin_fornecedores_tipo_conta_check" CHECK ((("tipo_conta")::"text" = ANY ((ARRAY['corrente'::character varying, 'poupanca'::character varying])::"text"[])))
);


ALTER TABLE "public"."fin_fornecedores" OWNER TO "postgres";


COMMENT ON TABLE "public"."fin_fornecedores" IS 'Fornecedores para sistema financeiro';



CREATE TABLE IF NOT EXISTS "public"."fin_lembretes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "duplicata_receber_id" "uuid",
    "duplicata_pagar_id" "uuid",
    "tipo_lembrete" "public"."fin_tipo_lembrete" NOT NULL,
    "dias_antecedencia" integer DEFAULT 0,
    "canais" "public"."fin_canal_notificacao"[] DEFAULT ARRAY['email'::"public"."fin_canal_notificacao"],
    "destinatario_nome" character varying(200),
    "destinatario_email" character varying(200),
    "destinatario_telefone" character varying(20),
    "programado_para" timestamp with time zone NOT NULL,
    "enviado_em" timestamp with time zone,
    "status" character varying(20) DEFAULT 'pendente'::character varying,
    "erro_mensagem" "text",
    "assunto" "text",
    "mensagem" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_lembretes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_parcelas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "duplicata_receber_id" "uuid",
    "duplicata_pagar_id" "uuid",
    "numero_parcela" integer NOT NULL,
    "valor" numeric(15,2) NOT NULL,
    "valor_pago" numeric(15,2) DEFAULT 0,
    "data_vencimento" "date" NOT NULL,
    "data_pagamento" "date",
    "status" "public"."fin_status_duplicata" DEFAULT 'aberta'::"public"."fin_status_duplicata",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "check_duplicata_tipo" CHECK (((("duplicata_receber_id" IS NOT NULL) AND ("duplicata_pagar_id" IS NULL)) OR (("duplicata_receber_id" IS NULL) AND ("duplicata_pagar_id" IS NOT NULL))))
);


ALTER TABLE "public"."fin_parcelas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_plano_contas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "codigo" "text" NOT NULL,
    "nome" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "nivel" integer NOT NULL,
    "conta_pai_id" "uuid",
    "aceita_lancamento" boolean DEFAULT true,
    "ativo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_plano_contas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_projecoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "marca" "text" NOT NULL,
    "mes_referencia" "date" NOT NULL,
    "receita_prevista" numeric(15,2) DEFAULT 0,
    "despesa_prevista" numeric(15,2) DEFAULT 0,
    "saldo_previsto" numeric(15,2) GENERATED ALWAYS AS (("receita_prevista" - "despesa_prevista")) STORED,
    "receita_realizada" numeric(15,2) DEFAULT 0,
    "despesa_realizada" numeric(15,2) DEFAULT 0,
    "saldo_realizado" numeric(15,2) GENERATED ALWAYS AS (("receita_realizada" - "despesa_realizada")) STORED,
    "cenario" "text" DEFAULT 'realista'::"text",
    "observacoes" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_projecoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_receitas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "marca" "text" NOT NULL,
    "descricao" "text" NOT NULL,
    "categoria_id" "uuid",
    "valor" numeric(15,2) NOT NULL,
    "moeda" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "taxa_cambio" numeric(10,4) DEFAULT 1,
    "valor_brl" numeric(15,2) GENERATED ALWAYS AS (("valor" * "taxa_cambio")) STORED,
    "tipo_receita" "text" NOT NULL,
    "cliente_id" "uuid",
    "orcamento_id" "uuid",
    "pedido_id" "uuid",
    "status" "text" DEFAULT 'pendente'::"text" NOT NULL,
    "data_vencimento" "date" NOT NULL,
    "data_pagamento" "date",
    "data_competencia" "date" NOT NULL,
    "forma_pagamento" "text",
    "gateway_pagamento" "text",
    "transaction_id" "text",
    "conta_bancaria_id" "uuid",
    "possui_comissao" boolean DEFAULT false,
    "valor_comissao" numeric(15,2),
    "percentual_comissao" numeric(5,2),
    "fornecedor_comissao_id" "uuid",
    "recorrente" boolean DEFAULT false,
    "frequencia_recorrencia" "text",
    "proximo_vencimento" "date",
    "nota_fiscal" "text",
    "recibo_url" "text",
    "observacoes" "text",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_receitas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_regras_comissao" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "tipo" "public"."fin_tipo_comissao" NOT NULL,
    "produto_id" "uuid",
    "fornecedor_id" "uuid",
    "percentual" numeric(5,2),
    "valor_fixo" numeric(15,2),
    "faixa_inicial" numeric(15,2),
    "faixa_final" numeric(15,2),
    "ativo" boolean DEFAULT true,
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_regras_comissao" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_repasses_automacao" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "split_id" "uuid" NOT NULL,
    "status" "public"."fin_status_comissao" DEFAULT 'pendente'::"public"."fin_status_comissao",
    "data_agendada" "date",
    "data_executada" "date",
    "comprovante_url" "text",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_repasses_automacao" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_transacoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "marca" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "descricao" "text" NOT NULL,
    "valor" numeric(15,2) NOT NULL,
    "moeda" "text" DEFAULT 'BRL'::"text" NOT NULL,
    "conta_origem_id" "uuid",
    "conta_destino_id" "uuid",
    "receita_id" "uuid",
    "despesa_id" "uuid",
    "categoria_id" "uuid",
    "data_transacao" "date" DEFAULT CURRENT_DATE NOT NULL,
    "data_competencia" "date" DEFAULT CURRENT_DATE NOT NULL,
    "status" "text" DEFAULT 'efetivada'::"text" NOT NULL,
    "observacoes" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fin_transacoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fin_utilizacoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "adiantamento_id" "uuid",
    "credito_id" "uuid",
    "duplicata_pagar_id" "uuid",
    "valor_utilizado" numeric(15,2) NOT NULL,
    "data_utilizacao" "date" NOT NULL,
    "observacoes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "check_tipo_utilizacao" CHECK (((("adiantamento_id" IS NOT NULL) AND ("credito_id" IS NULL)) OR (("adiantamento_id" IS NULL) AND ("credito_id" IS NOT NULL))))
);


ALTER TABLE "public"."fin_utilizacoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."markups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "tipo_produto" character varying(50) NOT NULL,
    "nome" character varying(100) NOT NULL,
    "descricao" "text",
    "tipo_markup" "public"."tipo_markup" NOT NULL,
    "valor_markup" numeric(10,2) NOT NULL,
    "moeda" "public"."moeda" NOT NULL,
    "ativo" boolean DEFAULT true NOT NULL,
    "ordem" integer NOT NULL,
    "metadados" "jsonb",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."markups" OWNER TO "postgres";


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
    "responsavel_telefone" character varying(50),
    "tenant_id" "uuid" NOT NULL
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
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "deleted_at" timestamp with time zone,
    "tenant_id" "uuid" NOT NULL
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
    "tenant_id" "uuid" NOT NULL,
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "tenant_id" "uuid" NOT NULL,
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
    "created_at" timestamp without time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "deleted_at" timestamp with time zone,
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "deleted_at" timestamp with time zone,
    "tenant_id" "uuid" NOT NULL
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
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "uuid" NOT NULL
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
    "tenant_id" "uuid" NOT NULL,
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


CREATE TABLE IF NOT EXISTS "public"."regras_preco" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "nome" character varying(100) NOT NULL,
    "tipo" "public"."tipo_regra_preco" NOT NULL,
    "descricao" "text",
    "valor_minimo" numeric(10,2),
    "valor_maximo" numeric(10,2),
    "data_inicio" "date",
    "data_fim" "date",
    "tipo_markup" "public"."tipo_markup" NOT NULL,
    "valor_markup" numeric(10,2) NOT NULL,
    "moeda" "public"."moeda" NOT NULL,
    "prioridade" integer NOT NULL,
    "sobrepor_regras" boolean DEFAULT false NOT NULL,
    "ativo" boolean DEFAULT true NOT NULL,
    "metadados" "jsonb",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."regras_preco" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."subscription_plans" AS
 SELECT "id",
    "name",
    "slug",
    "description",
    "is_public",
    "is_custom",
    "sort_order",
    "monthly_price",
    "quarterly_price",
    "yearly_price",
    "setup_fee",
    "trial_days",
    "features",
    "modules",
    "metadata",
    "created_at",
    "updated_at"
   FROM "cp"."subscription_plans";


ALTER VIEW "public"."subscription_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nome" character varying(255) NOT NULL,
    "slug" character varying(100) NOT NULL,
    "marca" character varying(50),
    "ativo" boolean DEFAULT true,
    "plano" character varying(50) DEFAULT 'basic'::character varying,
    "max_usuarios" integer DEFAULT 5,
    "max_leads" integer,
    "max_processos" integer,
    "cnpj" character varying(20),
    "razao_social" character varying(255),
    "email_contato" character varying(255),
    "telefone" character varying(20),
    "endereco_logradouro" character varying(255),
    "endereco_numero" character varying(20),
    "endereco_complemento" character varying(100),
    "endereco_bairro" character varying(100),
    "endereco_cidade" character varying(100),
    "endereco_estado" character varying(2),
    "endereco_cep" character varying(10),
    "endereco_pais" character varying(2) DEFAULT 'BR'::character varying,
    "configuracoes" "jsonb" DEFAULT '{}'::"jsonb",
    "data_expiracao" "date",
    "ultima_atividade" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "tenants_marca_check" CHECK ((("marca")::"text" = ANY ((ARRAY['noro'::character varying, 'nomade'::character varying, 'safetrip'::character varying, 'vistos'::character varying])::"text"[]))),
    CONSTRAINT "tenants_plano_check" CHECK ((("plano")::"text" = ANY ((ARRAY['basic'::character varying, 'pro'::character varying, 'enterprise'::character varying])::"text"[])))
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


COMMENT ON TABLE "public"."tenants" IS 'Empresas/organizações no sistema multi-tenant';



CREATE TABLE IF NOT EXISTS "public"."user_tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "role" character varying(50) DEFAULT 'user'::character varying NOT NULL,
    "ativo" boolean DEFAULT true,
    "permissoes" "jsonb" DEFAULT '[]'::"jsonb",
    "data_convite" timestamp with time zone,
    "convite_aceito" boolean DEFAULT false,
    "convidado_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_tenants_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['owner'::character varying, 'admin'::character varying, 'manager'::character varying, 'user'::character varying, 'viewer'::character varying])::"text"[])))
);


ALTER TABLE "public"."user_tenants" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_tenants" IS 'Relacionamento usuários-tenants com roles';



COMMENT ON COLUMN "public"."user_tenants"."role" IS 'Papel: owner (dono), admin (administrador), manager (gerente), user (usuário), viewer (visualizador)';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid",
    "nome" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "telefone" character varying(20),
    "cpf" character varying(14),
    "avatar_url" "text",
    "bio" "text",
    "cargo" character varying(100),
    "ativo" boolean DEFAULT true,
    "email_verificado" boolean DEFAULT false,
    "preferencias" "jsonb" DEFAULT '{}'::"jsonb",
    "ultimo_login" timestamp with time zone,
    "ultimo_ip" character varying(45),
    "tentativas_login_falhas" integer DEFAULT 0,
    "bloqueado_ate" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'Usuários do sistema';



CREATE OR REPLACE VIEW "public"."v_fin_contas_pagar" AS
 SELECT "id",
    "marca",
    "descricao",
    "valor_brl" AS "valor",
    "data_vencimento",
        CASE
            WHEN (("data_vencimento" < CURRENT_DATE) AND ("status" = 'pendente'::"text")) THEN 'atrasado'::"text"
            ELSE "status"
        END AS "status_real",
    (CURRENT_DATE - "data_vencimento") AS "dias_atraso",
    "fornecedor_id",
    "forma_pagamento"
   FROM "public"."fin_despesas"
  WHERE ("status" = ANY (ARRAY['pendente'::"text", 'atrasado'::"text"]))
  ORDER BY "data_vencimento";


ALTER VIEW "public"."v_fin_contas_pagar" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_fin_contas_receber" AS
 SELECT "id",
    "marca",
    "descricao",
    "valor_brl" AS "valor",
    "data_vencimento",
        CASE
            WHEN (("data_vencimento" < CURRENT_DATE) AND ("status" = 'pendente'::"text")) THEN 'atrasado'::"text"
            ELSE "status"
        END AS "status_real",
    (CURRENT_DATE - "data_vencimento") AS "dias_atraso",
    "cliente_id",
    "forma_pagamento"
   FROM "public"."fin_receitas"
  WHERE ("status" = ANY (ARRAY['pendente'::"text", 'atrasado'::"text"]))
  ORDER BY "data_vencimento";


ALTER VIEW "public"."v_fin_contas_receber" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_fin_resumo_marca" AS
 WITH "receitas_agrupadas" AS (
         SELECT "fin_receitas"."marca",
            "date_trunc"('month'::"text", ("fin_receitas"."data_competencia")::timestamp with time zone) AS "mes",
            "sum"(
                CASE
                    WHEN ("fin_receitas"."status" = 'pago'::"text") THEN "fin_receitas"."valor_brl"
                    ELSE (0)::numeric
                END) AS "receita_realizada"
           FROM "public"."fin_receitas"
          GROUP BY "fin_receitas"."marca", ("date_trunc"('month'::"text", ("fin_receitas"."data_competencia")::timestamp with time zone))
        ), "despesas_agrupadas" AS (
         SELECT "fin_despesas"."marca",
            "date_trunc"('month'::"text", ("fin_despesas"."data_competencia")::timestamp with time zone) AS "mes",
            "sum"(
                CASE
                    WHEN ("fin_despesas"."status" = 'pago'::"text") THEN "fin_despesas"."valor_brl"
                    ELSE (0)::numeric
                END) AS "despesa_realizada"
           FROM "public"."fin_despesas"
          GROUP BY "fin_despesas"."marca", ("date_trunc"('month'::"text", ("fin_despesas"."data_competencia")::timestamp with time zone))
        )
 SELECT COALESCE("r"."marca", "d"."marca") AS "marca",
    COALESCE("r"."mes", "d"."mes") AS "mes",
    COALESCE("r"."receita_realizada", (0)::numeric) AS "receita_realizada",
    COALESCE("d"."despesa_realizada", (0)::numeric) AS "despesa_realizada",
    (COALESCE("r"."receita_realizada", (0)::numeric) - COALESCE("d"."despesa_realizada", (0)::numeric)) AS "lucro"
   FROM ("receitas_agrupadas" "r"
     FULL JOIN "despesas_agrupadas" "d" ON ((("r"."marca" = "d"."marca") AND ("r"."mes" = "d"."mes"))));


ALTER VIEW "public"."v_fin_resumo_marca" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visa_requirements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_from" "text" NOT NULL,
    "country_to" "text" NOT NULL,
    "purpose" "text" DEFAULT ''::"text",
    "duration" "text" DEFAULT ''::"text",
    "requirement" "jsonb",
    "last_checked_at" timestamp with time zone,
    "sources" "uuid"[] DEFAULT '{}'::"uuid"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."visa_requirements" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_visa_info_basic" AS
 SELECT "country_to" AS "country",
    "country_to" AS "country_code",
    NULL::"text" AS "flag_emoji",
    ("requirement" ->> 'general_info'::"text") AS "general_info_text",
    "updated_at",
    NULL::"text" AS "region",
    NULL::"text" AS "official_visa_link",
    ("requirement" -> 'visa_types'::"text") AS "visa_types",
    ("requirement" -> 'required_documents'::"text") AS "required_documents",
    ("requirement" -> 'process_steps'::"text") AS "process_steps",
    ("requirement" -> 'approval_tips'::"text") AS "approval_tips",
    ("requirement" -> 'health_info'::"text") AS "health_info",
    ("requirement" -> 'security_info'::"text") AS "security_info"
   FROM "public"."visa_requirements" "vr";


ALTER VIEW "public"."v_visa_info_basic" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visa_countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "iso2" "text",
    "iso3" "text",
    "country" "text" NOT NULL,
    "region" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."visa_countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visa_overrides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "country_from" "text" NOT NULL,
    "country_to" "text" NOT NULL,
    "purpose" "text",
    "duration" "text",
    "override" "jsonb" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."visa_overrides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visa_sources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "url" "text",
    "method" "text",
    "reliability" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."visa_sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visa_updates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "text",
    "source_id" "uuid",
    "status" "text",
    "diff" "jsonb",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "finished_at" timestamp with time zone
);


ALTER TABLE "public"."visa_updates" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_fin_duplicatas_pagar" AS
 SELECT "id",
    "tenant_id",
    "marca",
    "numero_duplicata",
    "numero_nota_fiscal",
    "serie_nota_fiscal",
    "chave_acesso_nfe",
    "fornecedor_id",
    "reserva_id",
    "pedido_id",
    "condicao_pagamento_id",
    "adiantamento_id",
    "valor_original",
    "valor_desconto",
    "valor_juros",
    "valor_total",
    "valor_pago",
    "valor_pendente",
    "valor_credito_aplicado",
    "moeda",
    "taxa_cambio",
    "valor_brl",
    "data_emissao",
    "data_vencimento",
    "data_pagamento",
    "data_referencia",
    "status",
    "fornecedor_nome",
    "fornecedor_documento",
    "fornecedor_email",
    "fornecedor_telefone",
    "forma_pagamento",
    "conta_bancaria_id",
    "comprovante_pagamento_url",
    "observacoes",
    "condicao_pagamento_texto",
    "documento_url",
    "xml_nfe_url",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
        CASE
            WHEN ("status" = ANY (ARRAY['recebida'::"public"."fin_status_duplicata", 'cancelada'::"public"."fin_status_duplicata"])) THEN 0
            ELSE ("data_vencimento" - CURRENT_DATE)
        END AS "dias_vencimento"
   FROM "public"."fin_duplicatas_pagar" "p";


ALTER VIEW "public"."vw_fin_duplicatas_pagar" OWNER TO "postgres";


COMMENT ON VIEW "public"."vw_fin_duplicatas_pagar" IS 'View dinâmica com cálculo automático de dias até o vencimento';



CREATE OR REPLACE VIEW "public"."vw_fin_duplicatas_receber" AS
 SELECT "id",
    "tenant_id",
    "marca",
    "numero_duplicata",
    "numero_nota_fiscal",
    "serie_nota_fiscal",
    "chave_acesso_nfe",
    "cliente_id",
    "fornecedor_intermediario_id",
    "reserva_id",
    "pedido_id",
    "orcamento_id",
    "condicao_pagamento_id",
    "valor_original",
    "valor_desconto",
    "valor_juros",
    "valor_total",
    "valor_recebido",
    "valor_pendente",
    "moeda",
    "taxa_cambio",
    "valor_brl",
    "data_emissao",
    "data_vencimento",
    "data_recebimento",
    "data_referencia",
    "status",
    "cliente_nome",
    "cliente_documento",
    "cliente_email",
    "cliente_telefone",
    "observacoes",
    "condicao_pagamento_texto",
    "documento_url",
    "xml_nfe_url",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
        CASE
            WHEN ("status" = ANY (ARRAY['recebida'::"public"."fin_status_duplicata", 'cancelada'::"public"."fin_status_duplicata"])) THEN 0
            WHEN (CURRENT_DATE > "data_vencimento") THEN (CURRENT_DATE - "data_vencimento")
            ELSE 0
        END AS "dias_atraso"
   FROM "public"."fin_duplicatas_receber" "r";


ALTER VIEW "public"."vw_fin_duplicatas_receber" OWNER TO "postgres";


COMMENT ON VIEW "public"."vw_fin_duplicatas_receber" IS 'View dinâmica com cálculo automático de dias em atraso';



CREATE OR REPLACE VIEW "public"."vw_previsao_comissoes_futuras" AS
 SELECT "tenant_id",
    "tipo",
    "fornecedor_id",
    "produto_id",
    "data_prevista",
    "sum"("valor_comissao") AS "total_previsto",
    "count"(*) AS "qtd_prevista"
   FROM "public"."fin_comissoes_recebidas" "c"
  WHERE ("status" = ANY (ARRAY['pendente'::"public"."fin_status_comissao", 'prevista'::"public"."fin_status_comissao"]))
  GROUP BY "tenant_id", "tipo", "fornecedor_id", "produto_id", "data_prevista";


ALTER VIEW "public"."vw_previsao_comissoes_futuras" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_rentabilidade_centros_custo" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"uuid" AS "tenant_id",
    NULL::character varying(50) AS "codigo",
    NULL::character varying(255) AS "nome",
    NULL::character varying(50) AS "tipo",
    NULL::"public"."marca" AS "marca",
    NULL::character varying(30) AS "status",
    NULL::"date" AS "data_inicio",
    NULL::"date" AS "data_fim",
    NULL::numeric(15,2) AS "orcamento_previsto",
    NULL::numeric(5,2) AS "meta_margem_percentual",
    NULL::numeric(15,2) AS "meta_receita",
    NULL::numeric AS "receitas_total",
    NULL::numeric AS "despesas_total",
    NULL::numeric AS "margem_liquida",
    NULL::numeric AS "margem_percentual",
    NULL::numeric AS "saldo_orcamento",
    NULL::numeric AS "percentual_orcamento_utilizado",
    NULL::bigint AS "qtd_receitas",
    NULL::bigint AS "qtd_despesas",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at";


ALTER VIEW "public"."vw_rentabilidade_centros_custo" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_saldo_adiantamentos" AS
 SELECT "tenant_id",
    "fornecedor_id",
    "fornecedor_nome",
    "count"(*) AS "total_adiantamentos",
    "sum"("valor_original") AS "valor_total_adiantado",
    "sum"("valor_utilizado") AS "valor_total_utilizado",
    "sum"("valor_disponivel") AS "saldo_disponivel",
    "count"(*) FILTER (WHERE ("status" = 'ativo'::"public"."fin_status_adiantamento")) AS "adiantamentos_ativos"
   FROM "public"."fin_adiantamentos" "a"
  WHERE ("status" = ANY (ARRAY['ativo'::"public"."fin_status_adiantamento", 'parcialmente_utilizado'::"public"."fin_status_adiantamento"]))
  GROUP BY "tenant_id", "fornecedor_id", "fornecedor_nome";


ALTER VIEW "public"."vw_saldo_adiantamentos" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_saldo_creditos" AS
 SELECT "tenant_id",
    "fornecedor_id",
    "fornecedor_nome",
    "count"(*) AS "total_creditos",
    "sum"("valor_original") AS "valor_total_creditos",
    "sum"("valor_utilizado") AS "valor_total_utilizado",
    "sum"("valor_disponivel") AS "saldo_disponivel",
    "count"(*) FILTER (WHERE ("tipo_credito" = 'refund'::"public"."fin_tipo_credito")) AS "total_refunds",
    "count"(*) FILTER (WHERE ("tipo_credito" = 'overpayment'::"public"."fin_tipo_credito")) AS "total_overpayments"
   FROM "public"."fin_creditos" "c"
  WHERE ("status" = ANY (ARRAY['disponivel'::"public"."fin_status_credito", 'parcialmente_utilizado'::"public"."fin_status_credito"]))
  GROUP BY "tenant_id", "fornecedor_id", "fornecedor_nome";


ALTER VIEW "public"."vw_saldo_creditos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "staging_vistos"."visa_info" (
    "id" "uuid",
    "country" "text",
    "country_code" "text",
    "flag_emoji" "text",
    "general_info" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "region" "text",
    "official_visa_link" "text",
    "visa_types" "jsonb",
    "required_documents" "jsonb",
    "process_steps" "jsonb",
    "approval_tips" "jsonb",
    "health_info" "jsonb",
    "security_info" "jsonb",
    "last_verified" "date",
    "data_source" "text",
    "slug" "text",
    "automation_status" "text",
    "priority_level" integer,
    "meta_description" "text",
    "og_image_url" "text"
);


ALTER TABLE "staging_vistos"."visa_info" OWNER TO "postgres";


ALTER TABLE ONLY "cp"."system_events" ALTER COLUMN "id" SET DEFAULT "nextval"('"cp"."system_events_id_seq"'::"regclass");



ALTER TABLE ONLY "cp"."usage_counters" ALTER COLUMN "id" SET DEFAULT "nextval"('"cp"."usage_counters_id_seq"'::"regclass");



ALTER TABLE ONLY "cp"."api_key_logs"
    ADD CONSTRAINT "api_key_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."api_keys"
    ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."api_keys"
    ADD CONSTRAINT "api_keys_tenant_id_name_key" UNIQUE ("tenant_id", "name");



ALTER TABLE ONLY "cp"."billing_events"
    ADD CONSTRAINT "billing_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."control_plane_config"
    ADD CONSTRAINT "control_plane_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."control_plane_user_activities"
    ADD CONSTRAINT "control_plane_user_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."control_plane_users"
    ADD CONSTRAINT "control_plane_users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "cp"."control_plane_users"
    ADD CONSTRAINT "control_plane_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."domains"
    ADD CONSTRAINT "domains_domain_key" UNIQUE ("domain");



ALTER TABLE ONLY "cp"."domains"
    ADD CONSTRAINT "domains_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."invoices"
    ADD CONSTRAINT "invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."lead_activity"
    ADD CONSTRAINT "lead_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."lead_stages"
    ADD CONSTRAINT "lead_stages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."lead_stages"
    ADD CONSTRAINT "lead_stages_tenant_id_slug_key" UNIQUE ("tenant_id", "slug");



ALTER TABLE ONLY "cp"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."ledger_accounts"
    ADD CONSTRAINT "ledger_accounts_code_key" UNIQUE ("code");



ALTER TABLE ONLY "cp"."ledger_accounts"
    ADD CONSTRAINT "ledger_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."ledger_entries"
    ADD CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."modules_registry"
    ADD CONSTRAINT "modules_registry_code_key" UNIQUE ("code");



ALTER TABLE ONLY "cp"."modules_registry"
    ADD CONSTRAINT "modules_registry_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



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



ALTER TABLE ONLY "cp"."subscription_addon_items"
    ADD CONSTRAINT "subscription_addon_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."subscription_addons"
    ADD CONSTRAINT "subscription_addons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "cp"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."support_events"
    ADD CONSTRAINT "support_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."support_messages"
    ADD CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."support_sla"
    ADD CONSTRAINT "support_sla_pkey" PRIMARY KEY ("ticket_id");



ALTER TABLE ONLY "cp"."support_tickets"
    ADD CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."system_events"
    ADD CONSTRAINT "system_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



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



ALTER TABLE ONLY "cp"."control_plane_users"
    ADD CONSTRAINT "unique_user_per_tenant" UNIQUE ("auth_id", "tenant_id");



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_tenant_id_period_start_metric_key" UNIQUE ("tenant_id", "period_start", "metric");



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_user_id_tenant_id_key" UNIQUE ("user_id", "tenant_id");



ALTER TABLE ONLY "cp"."webhook_logs"
    ADD CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_tenant_id_code_key" UNIQUE ("tenant_id", "code");



ALTER TABLE ONLY "public"."clientes"
    ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_adiantamentos"
    ADD CONSTRAINT "fin_adiantamentos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_alocacoes"
    ADD CONSTRAINT "fin_alocacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_categorias"
    ADD CONSTRAINT "fin_categorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_centros_custo"
    ADD CONSTRAINT "fin_centros_custo_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_comissoes"
    ADD CONSTRAINT "fin_comissoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_comissoes_recebidas"
    ADD CONSTRAINT "fin_comissoes_recebidas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_comissoes_split"
    ADD CONSTRAINT "fin_comissoes_split_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_condicoes_pagamento"
    ADD CONSTRAINT "fin_condicoes_pagamento_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_contas_bancarias"
    ADD CONSTRAINT "fin_contas_bancarias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_creditos"
    ADD CONSTRAINT "fin_creditos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_fornecedores"
    ADD CONSTRAINT "fin_fornecedores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_lembretes"
    ADD CONSTRAINT "fin_lembretes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_parcelas"
    ADD CONSTRAINT "fin_parcelas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_plano_contas"
    ADD CONSTRAINT "fin_plano_contas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_plano_contas"
    ADD CONSTRAINT "fin_plano_contas_tenant_id_codigo_key" UNIQUE ("tenant_id", "codigo");



ALTER TABLE ONLY "public"."fin_projecoes"
    ADD CONSTRAINT "fin_projecoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_projecoes"
    ADD CONSTRAINT "fin_projecoes_tenant_id_marca_mes_referencia_cenario_key" UNIQUE ("tenant_id", "marca", "mes_referencia", "cenario");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_regras_comissao"
    ADD CONSTRAINT "fin_regras_comissao_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_repasses_automacao"
    ADD CONSTRAINT "fin_repasses_automacao_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fin_utilizacoes"
    ADD CONSTRAINT "fin_utilizacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."markups"
    ADD CONSTRAINT "markups_pkey" PRIMARY KEY ("id");



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



ALTER TABLE ONLY "public"."regras_preco"
    ADD CONSTRAINT "regras_preco_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."fin_centros_custo"
    ADD CONSTRAINT "unique_codigo_tenant" UNIQUE ("tenant_id", "codigo");



ALTER TABLE ONLY "public"."user_tenants"
    ADD CONSTRAINT "user_tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_tenants"
    ADD CONSTRAINT "user_tenants_user_id_tenant_id_key" UNIQUE ("user_id", "tenant_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visa_countries"
    ADD CONSTRAINT "visa_countries_iso2_key" UNIQUE ("iso2");



ALTER TABLE ONLY "public"."visa_countries"
    ADD CONSTRAINT "visa_countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visa_overrides"
    ADD CONSTRAINT "visa_overrides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visa_requirements"
    ADD CONSTRAINT "visa_requirements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visa_sources"
    ADD CONSTRAINT "visa_sources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visa_updates"
    ADD CONSTRAINT "visa_updates_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_api_key_logs_key_created" ON "cp"."api_key_logs" USING "btree" ("key_id", "created_at" DESC);



CREATE INDEX "idx_api_key_logs_tenant_created" ON "cp"."api_key_logs" USING "btree" ("tenant_id", "created_at" DESC);



CREATE INDEX "idx_cp_contacts_tenant" ON "cp"."contacts" USING "btree" ("tenant_id");



CREATE INDEX "idx_cp_domains_default" ON "cp"."domains" USING "btree" ("tenant_id", "is_default");



CREATE INDEX "idx_cp_domains_tenant" ON "cp"."domains" USING "btree" ("tenant_id");



CREATE INDEX "idx_cp_invoices_tenant" ON "cp"."invoices" USING "btree" ("tenant_id");



CREATE INDEX "idx_cp_leads_owner" ON "cp"."leads" USING "btree" ("owner_id");



CREATE INDEX "idx_cp_leads_stage" ON "cp"."leads" USING "btree" ("stage");



CREATE INDEX "idx_cp_leads_stage_position" ON "cp"."leads" USING "btree" ("stage", "position");



CREATE INDEX "idx_cp_ledger_entries_account" ON "cp"."ledger_entries" USING "btree" ("account_id");



CREATE INDEX "idx_cp_notes_tenant" ON "cp"."notes" USING "btree" ("tenant_id");



CREATE INDEX "idx_cp_subs_tenant" ON "cp"."subscriptions" USING "btree" ("tenant_id");



CREATE INDEX "idx_cp_tasks_tenant" ON "cp"."tasks" USING "btree" ("tenant_id");



CREATE INDEX "idx_cp_webhook_logs_created" ON "cp"."webhook_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_cp_webhook_logs_event" ON "cp"."webhook_logs" USING "btree" ("event");



CREATE INDEX "idx_cp_webhook_logs_tenant" ON "cp"."webhook_logs" USING "btree" ("tenant_id");



CREATE INDEX "idx_leads_tags_gin" ON "cp"."leads" USING "gin" ("tags");



CREATE INDEX "idx_leads_tenant_created" ON "cp"."leads" USING "btree" ("tenant_id", "created_at");



CREATE INDEX "idx_leads_tenant_email" ON "cp"."leads" USING "btree" ("tenant_id", "email");



CREATE INDEX "idx_leads_tenant_owner" ON "cp"."leads" USING "btree" ("tenant_id", "owner_id");



CREATE INDEX "idx_leads_tenant_stage" ON "cp"."leads" USING "btree" ("tenant_id", "stage");



CREATE INDEX "idx_support_events_ticket" ON "cp"."support_events" USING "btree" ("ticket_id", "created_at");



CREATE INDEX "idx_support_messages_ticket" ON "cp"."support_messages" USING "btree" ("ticket_id", "created_at");



CREATE INDEX "idx_support_sla_target" ON "cp"."support_sla" USING "btree" ("target_at");



CREATE INDEX "idx_support_tickets_assigned" ON "cp"."support_tickets" USING "btree" ("assigned_to");



CREATE INDEX "idx_support_tickets_tenant_status" ON "cp"."support_tickets" USING "btree" ("tenant_id", "status");



CREATE UNIQUE INDEX "tenants_slug_idx" ON "cp"."tenants" USING "btree" ("slug");



CREATE UNIQUE INDEX "ux_cp_api_keys_key_hash" ON "cp"."api_keys" USING "btree" ("key_hash");



CREATE INDEX "idx_adiantamentos_fornecedor" ON "public"."fin_adiantamentos" USING "btree" ("fornecedor_id");



CREATE INDEX "idx_adiantamentos_status" ON "public"."fin_adiantamentos" USING "btree" ("status");



CREATE INDEX "idx_adiantamentos_tenant" ON "public"."fin_adiantamentos" USING "btree" ("tenant_id");



CREATE INDEX "idx_alocacoes_centro_custo" ON "public"."fin_alocacoes" USING "btree" ("centro_custo_id");



CREATE INDEX "idx_alocacoes_despesa" ON "public"."fin_alocacoes" USING "btree" ("despesa_id");



CREATE INDEX "idx_alocacoes_receita" ON "public"."fin_alocacoes" USING "btree" ("receita_id");



CREATE INDEX "idx_alocacoes_tenant" ON "public"."fin_alocacoes" USING "btree" ("tenant_id");



CREATE INDEX "idx_audit_entidade" ON "public"."noro_audit_log" USING "btree" ("entidade", "entidade_id");



CREATE INDEX "idx_audit_user" ON "public"."noro_audit_log" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_centros_custo_codigo" ON "public"."fin_centros_custo" USING "btree" ("codigo");



CREATE INDEX "idx_centros_custo_datas" ON "public"."fin_centros_custo" USING "btree" ("data_inicio", "data_fim");



CREATE INDEX "idx_centros_custo_marca" ON "public"."fin_centros_custo" USING "btree" ("marca");



CREATE INDEX "idx_centros_custo_status" ON "public"."fin_centros_custo" USING "btree" ("status");



CREATE INDEX "idx_centros_custo_tenant" ON "public"."fin_centros_custo" USING "btree" ("tenant_id");



CREATE INDEX "idx_centros_custo_tipo" ON "public"."fin_centros_custo" USING "btree" ("tipo");



CREATE INDEX "idx_clientes_agente" ON "public"."noro_clientes" USING "btree" ("agente_responsavel_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_clientes_ativo" ON "public"."clientes" USING "btree" ("ativo") WHERE ("ativo" = true);



CREATE INDEX "idx_clientes_cnpj" ON "public"."noro_clientes" USING "btree" ("cnpj") WHERE ("cnpj" IS NOT NULL);



CREATE INDEX "idx_clientes_cnpj_cpf" ON "public"."clientes" USING "btree" ("cnpj_cpf");



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



CREATE INDEX "idx_clientes_nome" ON "public"."clientes" USING "btree" ("nome");



CREATE INDEX "idx_clientes_origem_lead" ON "public"."noro_clientes" USING "btree" ("origem_lead_id");



CREATE INDEX "idx_clientes_prefs_cliente" ON "public"."noro_clientes_preferencias" USING "btree" ("cliente_id");



CREATE INDEX "idx_clientes_status" ON "public"."noro_clientes" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_clientes_tags" ON "public"."noro_clientes" USING "gin" ("tags");



CREATE INDEX "idx_clientes_tenant" ON "public"."clientes" USING "btree" ("tenant_id");



CREATE INDEX "idx_comissoes_agente" ON "public"."noro_comissoes" USING "btree" ("agente_id");



CREATE INDEX "idx_comissoes_data_pagamento" ON "public"."noro_comissoes" USING "btree" ("data_pagamento");



CREATE INDEX "idx_comissoes_pedido" ON "public"."noro_comissoes" USING "btree" ("pedido_id");



CREATE INDEX "idx_comissoes_recebidas_status" ON "public"."fin_comissoes_recebidas" USING "btree" ("status");



CREATE INDEX "idx_comissoes_recebidas_tenant" ON "public"."fin_comissoes_recebidas" USING "btree" ("tenant_id");



CREATE INDEX "idx_comissoes_split_comissao" ON "public"."fin_comissoes_split" USING "btree" ("comissao_id");



CREATE INDEX "idx_comissoes_split_usuario" ON "public"."fin_comissoes_split" USING "btree" ("usuario_id");



CREATE INDEX "idx_comissoes_status" ON "public"."noro_comissoes" USING "btree" ("status");



CREATE INDEX "idx_condicoes_pagamento_ativo" ON "public"."fin_condicoes_pagamento" USING "btree" ("ativo");



CREATE INDEX "idx_condicoes_pagamento_tenant" ON "public"."fin_condicoes_pagamento" USING "btree" ("tenant_id");



CREATE INDEX "idx_creditos_fornecedor" ON "public"."fin_creditos" USING "btree" ("fornecedor_id");



CREATE INDEX "idx_creditos_status" ON "public"."fin_creditos" USING "btree" ("status");



CREATE INDEX "idx_creditos_tenant" ON "public"."fin_creditos" USING "btree" ("tenant_id");



CREATE INDEX "idx_duplicatas_pagar_adiantamento" ON "public"."fin_duplicatas_pagar" USING "btree" ("adiantamento_id");



CREATE INDEX "idx_duplicatas_pagar_fornecedor" ON "public"."fin_duplicatas_pagar" USING "btree" ("fornecedor_id");



CREATE INDEX "idx_duplicatas_pagar_reserva" ON "public"."fin_duplicatas_pagar" USING "btree" ("reserva_id");



CREATE INDEX "idx_duplicatas_pagar_status" ON "public"."fin_duplicatas_pagar" USING "btree" ("status");



CREATE INDEX "idx_duplicatas_pagar_tenant" ON "public"."fin_duplicatas_pagar" USING "btree" ("tenant_id");



CREATE INDEX "idx_duplicatas_pagar_vencimento" ON "public"."fin_duplicatas_pagar" USING "btree" ("data_vencimento");



CREATE INDEX "idx_duplicatas_receber_cliente" ON "public"."fin_duplicatas_receber" USING "btree" ("cliente_id");



CREATE INDEX "idx_duplicatas_receber_nfe" ON "public"."fin_duplicatas_receber" USING "btree" ("chave_acesso_nfe");



CREATE INDEX "idx_duplicatas_receber_reserva" ON "public"."fin_duplicatas_receber" USING "btree" ("reserva_id");



CREATE INDEX "idx_duplicatas_receber_status" ON "public"."fin_duplicatas_receber" USING "btree" ("status");



CREATE INDEX "idx_duplicatas_receber_tenant" ON "public"."fin_duplicatas_receber" USING "btree" ("tenant_id");



CREATE INDEX "idx_duplicatas_receber_vencimento" ON "public"."fin_duplicatas_receber" USING "btree" ("data_vencimento");



CREATE INDEX "idx_fin_categorias_tenant" ON "public"."fin_categorias" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_categorias_tipo" ON "public"."fin_categorias" USING "btree" ("tipo");



CREATE INDEX "idx_fin_comissoes_fornecedor" ON "public"."fin_comissoes" USING "btree" ("fornecedor_id");



CREATE INDEX "idx_fin_comissoes_receita" ON "public"."fin_comissoes" USING "btree" ("receita_id");



CREATE INDEX "idx_fin_contas_ativo" ON "public"."fin_contas_bancarias" USING "btree" ("ativo");



CREATE INDEX "idx_fin_contas_marca" ON "public"."fin_contas_bancarias" USING "btree" ("marca");



CREATE INDEX "idx_fin_contas_tenant" ON "public"."fin_contas_bancarias" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_despesas_centro_custo" ON "public"."fin_despesas" USING "btree" ("centro_custo");



CREATE INDEX "idx_fin_despesas_competencia" ON "public"."fin_despesas" USING "btree" ("data_competencia");



CREATE INDEX "idx_fin_despesas_data_vencimento" ON "public"."fin_despesas" USING "btree" ("data_vencimento");



CREATE INDEX "idx_fin_despesas_fornecedor" ON "public"."fin_despesas" USING "btree" ("fornecedor_id");



CREATE INDEX "idx_fin_despesas_marca" ON "public"."fin_despesas" USING "btree" ("marca");



CREATE INDEX "idx_fin_despesas_pendentes" ON "public"."fin_despesas" USING "btree" ("tenant_id", "data_vencimento") WHERE ("status" = ANY (ARRAY['pendente'::"text", 'atrasado'::"text"]));



CREATE INDEX "idx_fin_despesas_status" ON "public"."fin_despesas" USING "btree" ("status");



CREATE INDEX "idx_fin_despesas_tenant" ON "public"."fin_despesas" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_despesas_tenant_competencia" ON "public"."fin_despesas" USING "btree" ("tenant_id", "data_competencia" DESC);



CREATE INDEX "idx_fin_despesas_tenant_marca_status" ON "public"."fin_despesas" USING "btree" ("tenant_id", "marca", "status");



CREATE INDEX "idx_fin_despesas_tenant_status" ON "public"."fin_despesas" USING "btree" ("tenant_id", "status");



CREATE INDEX "idx_fin_plano_tenant" ON "public"."fin_plano_contas" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_plano_tipo" ON "public"."fin_plano_contas" USING "btree" ("tipo");



CREATE INDEX "idx_fin_projecoes_mes" ON "public"."fin_projecoes" USING "btree" ("mes_referencia");



CREATE INDEX "idx_fin_projecoes_tenant" ON "public"."fin_projecoes" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_receitas_cliente" ON "public"."fin_receitas" USING "btree" ("cliente_id");



CREATE INDEX "idx_fin_receitas_competencia" ON "public"."fin_receitas" USING "btree" ("data_competencia");



CREATE INDEX "idx_fin_receitas_data_vencimento" ON "public"."fin_receitas" USING "btree" ("data_vencimento");



CREATE INDEX "idx_fin_receitas_marca" ON "public"."fin_receitas" USING "btree" ("marca");



CREATE INDEX "idx_fin_receitas_pendentes" ON "public"."fin_receitas" USING "btree" ("tenant_id", "data_vencimento") WHERE ("status" = ANY (ARRAY['pendente'::"text", 'atrasado'::"text"]));



CREATE INDEX "idx_fin_receitas_status" ON "public"."fin_receitas" USING "btree" ("status");



CREATE INDEX "idx_fin_receitas_tenant" ON "public"."fin_receitas" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_receitas_tenant_competencia" ON "public"."fin_receitas" USING "btree" ("tenant_id", "data_competencia" DESC);



CREATE INDEX "idx_fin_receitas_tenant_marca_status" ON "public"."fin_receitas" USING "btree" ("tenant_id", "marca", "status");



CREATE INDEX "idx_fin_receitas_tenant_status" ON "public"."fin_receitas" USING "btree" ("tenant_id", "status");



CREATE INDEX "idx_fin_transacoes_conta_destino" ON "public"."fin_transacoes" USING "btree" ("conta_destino_id");



CREATE INDEX "idx_fin_transacoes_conta_origem" ON "public"."fin_transacoes" USING "btree" ("conta_origem_id");



CREATE INDEX "idx_fin_transacoes_data" ON "public"."fin_transacoes" USING "btree" ("data_transacao");



CREATE INDEX "idx_fin_transacoes_marca" ON "public"."fin_transacoes" USING "btree" ("marca");



CREATE INDEX "idx_fin_transacoes_tenant" ON "public"."fin_transacoes" USING "btree" ("tenant_id");



CREATE INDEX "idx_fin_transacoes_tipo" ON "public"."fin_transacoes" USING "btree" ("tipo");



CREATE INDEX "idx_fornecedores_ativo" ON "public"."fin_fornecedores" USING "btree" ("ativo") WHERE ("ativo" = true);



CREATE INDEX "idx_fornecedores_categorias" ON "public"."noro_fornecedores" USING "gin" ("categorias");



CREATE INDEX "idx_fornecedores_cnpj" ON "public"."noro_fornecedores" USING "btree" ("cnpj_nif") WHERE ("cnpj_nif" IS NOT NULL);



CREATE INDEX "idx_fornecedores_cnpj_cpf" ON "public"."fin_fornecedores" USING "btree" ("cnpj_cpf");



CREATE INDEX "idx_fornecedores_nome" ON "public"."noro_fornecedores" USING "btree" ("nome") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_fornecedores_rating" ON "public"."noro_fornecedores" USING "btree" ("rating" DESC);



CREATE INDEX "idx_fornecedores_status" ON "public"."noro_fornecedores" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_fornecedores_tenant" ON "public"."fin_fornecedores" USING "btree" ("tenant_id");



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



CREATE INDEX "idx_lembretes_duplicata_pagar" ON "public"."fin_lembretes" USING "btree" ("duplicata_pagar_id");



CREATE INDEX "idx_lembretes_duplicata_receber" ON "public"."fin_lembretes" USING "btree" ("duplicata_receber_id");



CREATE INDEX "idx_lembretes_programado" ON "public"."fin_lembretes" USING "btree" ("programado_para");



CREATE INDEX "idx_lembretes_status" ON "public"."fin_lembretes" USING "btree" ("status");



CREATE INDEX "idx_newsletter_email" ON "public"."noro_newsletter" USING "btree" ("email");



CREATE INDEX "idx_newsletter_status" ON "public"."noro_newsletter" USING "btree" ("status");



CREATE INDEX "idx_noro_clientes_contatos_emergencia_tenant" ON "public"."noro_clientes_contatos_emergencia" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_clientes_documentos_tenant" ON "public"."noro_clientes_documentos" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_clientes_enderecos_tenant" ON "public"."noro_clientes_enderecos" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_clientes_milhas_tenant" ON "public"."noro_clientes_milhas" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_clientes_preferencias_tenant" ON "public"."noro_clientes_preferencias" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_clientes_tenant" ON "public"."noro_clientes" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_configuracoes_tenant" ON "public"."noro_configuracoes" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_empresa_tenant" ON "public"."noro_empresa" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_fornecedores_tenant" ON "public"."noro_fornecedores" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_interacoes_tenant" ON "public"."noro_interacoes" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_leads_tenant" ON "public"."noro_leads" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_newsletter_tenant" ON "public"."noro_newsletter" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_notificacoes_tenant" ON "public"."noro_notificacoes" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_notificacoes_user" ON "public"."noro_notificacoes" USING "btree" ("user_id");



CREATE INDEX "idx_noro_orcamentos_itens_tenant" ON "public"."noro_orcamentos_itens" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_orcamentos_tenant" ON "public"."noro_orcamentos" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_pedidos_itens_tenant" ON "public"."noro_pedidos_itens" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_pedidos_tenant" ON "public"."noro_pedidos" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_pedidos_timeline_tenant" ON "public"."noro_pedidos_timeline" USING "btree" ("tenant_id");



CREATE INDEX "idx_noro_tarefas_status" ON "public"."noro_tarefas" USING "btree" ("status");



CREATE INDEX "idx_noro_tarefas_tenant" ON "public"."noro_tarefas" USING "btree" ("tenant_id");



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



CREATE INDEX "idx_parcelas_duplicata_pagar" ON "public"."fin_parcelas" USING "btree" ("duplicata_pagar_id");



CREATE INDEX "idx_parcelas_duplicata_receber" ON "public"."fin_parcelas" USING "btree" ("duplicata_receber_id");



CREATE INDEX "idx_parcelas_status" ON "public"."fin_parcelas" USING "btree" ("status");



CREATE INDEX "idx_parcelas_vencimento" ON "public"."fin_parcelas" USING "btree" ("data_vencimento");



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



CREATE INDEX "idx_repasses_automacao_split" ON "public"."fin_repasses_automacao" USING "btree" ("split_id");



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



CREATE INDEX "idx_tenants_ativo" ON "public"."tenants" USING "btree" ("ativo") WHERE ("ativo" = true);



CREATE INDEX "idx_tenants_marca" ON "public"."tenants" USING "btree" ("marca");



CREATE INDEX "idx_tenants_plano" ON "public"."tenants" USING "btree" ("plano");



CREATE INDEX "idx_tenants_slug" ON "public"."tenants" USING "btree" ("slug");



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



CREATE INDEX "idx_user_tenants_ativo" ON "public"."user_tenants" USING "btree" ("ativo") WHERE ("ativo" = true);



CREATE INDEX "idx_user_tenants_role" ON "public"."user_tenants" USING "btree" ("role");



CREATE INDEX "idx_user_tenants_tenant" ON "public"."user_tenants" USING "btree" ("tenant_id");



CREATE INDEX "idx_user_tenants_user" ON "public"."user_tenants" USING "btree" ("user_id");



CREATE INDEX "idx_users_ativo" ON "public"."users" USING "btree" ("ativo") WHERE ("ativo" = true);



CREATE INDEX "idx_users_auth_user_id" ON "public"."users" USING "btree" ("auth_user_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_utilizacoes_adiantamento" ON "public"."fin_utilizacoes" USING "btree" ("adiantamento_id");



CREATE INDEX "idx_utilizacoes_credito" ON "public"."fin_utilizacoes" USING "btree" ("credito_id");



CREATE INDEX "idx_utilizacoes_duplicata" ON "public"."fin_utilizacoes" USING "btree" ("duplicata_pagar_id");



CREATE INDEX "idx_visa_overrides_tenant" ON "public"."visa_overrides" USING "btree" ("tenant_id");



CREATE INDEX "idx_vr_from_to" ON "public"."visa_requirements" USING "btree" ("country_from", "country_to");



CREATE INDEX "idx_vr_updated_at" ON "public"."visa_requirements" USING "btree" ("updated_at");



CREATE UNIQUE INDEX "one_row_only" ON "public"."noro_empresa" USING "btree" ((true));



CREATE UNIQUE INDEX "ux_visa_overrides_key" ON "public"."visa_overrides" USING "btree" ("tenant_id", "country_from", "country_to", "purpose", "duration");



CREATE UNIQUE INDEX "ux_visa_requirements_key" ON "public"."visa_requirements" USING "btree" ("country_from", "country_to", "purpose", "duration");



CREATE OR REPLACE VIEW "public"."vw_rentabilidade_centros_custo" AS
 SELECT "cc"."id",
    "cc"."tenant_id",
    "cc"."codigo",
    "cc"."nome",
    "cc"."tipo",
    "cc"."marca",
    "cc"."status",
    "cc"."data_inicio",
    "cc"."data_fim",
    "cc"."orcamento_previsto",
    "cc"."meta_margem_percentual",
    "cc"."meta_receita",
    COALESCE("sum"(
        CASE
            WHEN ("a"."receita_id" IS NOT NULL) THEN "a"."valor_alocado"
            ELSE (0)::numeric
        END), (0)::numeric) AS "receitas_total",
    COALESCE("sum"(
        CASE
            WHEN ("a"."despesa_id" IS NOT NULL) THEN "a"."valor_alocado"
            ELSE (0)::numeric
        END), (0)::numeric) AS "despesas_total",
    (COALESCE("sum"(
        CASE
            WHEN ("a"."receita_id" IS NOT NULL) THEN "a"."valor_alocado"
            ELSE (0)::numeric
        END), (0)::numeric) - COALESCE("sum"(
        CASE
            WHEN ("a"."despesa_id" IS NOT NULL) THEN "a"."valor_alocado"
            ELSE (0)::numeric
        END), (0)::numeric)) AS "margem_liquida",
        CASE
            WHEN (COALESCE("sum"(
            CASE
                WHEN ("a"."receita_id" IS NOT NULL) THEN "a"."valor_alocado"
                ELSE (0)::numeric
            END), (0)::numeric) > (0)::numeric) THEN (((COALESCE("sum"(
            CASE
                WHEN ("a"."receita_id" IS NOT NULL) THEN "a"."valor_alocado"
                ELSE (0)::numeric
            END), (0)::numeric) - COALESCE("sum"(
            CASE
                WHEN ("a"."despesa_id" IS NOT NULL) THEN "a"."valor_alocado"
                ELSE (0)::numeric
            END), (0)::numeric)) / COALESCE("sum"(
            CASE
                WHEN ("a"."receita_id" IS NOT NULL) THEN "a"."valor_alocado"
                ELSE (0)::numeric
            END), (1)::numeric)) * (100)::numeric)
            ELSE (0)::numeric
        END AS "margem_percentual",
    ("cc"."orcamento_previsto" - COALESCE("sum"(
        CASE
            WHEN ("a"."despesa_id" IS NOT NULL) THEN "a"."valor_alocado"
            ELSE (0)::numeric
        END), (0)::numeric)) AS "saldo_orcamento",
        CASE
            WHEN ("cc"."orcamento_previsto" > (0)::numeric) THEN ((COALESCE("sum"(
            CASE
                WHEN ("a"."despesa_id" IS NOT NULL) THEN "a"."valor_alocado"
                ELSE (0)::numeric
            END), (0)::numeric) / "cc"."orcamento_previsto") * (100)::numeric)
            ELSE (0)::numeric
        END AS "percentual_orcamento_utilizado",
    "count"(DISTINCT "a"."receita_id") AS "qtd_receitas",
    "count"(DISTINCT "a"."despesa_id") AS "qtd_despesas",
    "cc"."created_at",
    "cc"."updated_at"
   FROM ("public"."fin_centros_custo" "cc"
     LEFT JOIN "public"."fin_alocacoes" "a" ON (("cc"."id" = "a"."centro_custo_id")))
  GROUP BY "cc"."id";



CREATE OR REPLACE TRIGGER "tr_control_plane_config_updated_at" BEFORE UPDATE ON "cp"."control_plane_config" FOR EACH ROW EXECUTE FUNCTION "cp"."set_updated_at"();



CREATE OR REPLACE TRIGGER "tr_control_plane_user_activities_tenant_check" BEFORE INSERT OR UPDATE ON "cp"."control_plane_user_activities" FOR EACH ROW EXECUTE FUNCTION "cp"."ensure_activity_tenant_matches_user"();



CREATE OR REPLACE TRIGGER "tr_control_plane_users_updated_at" BEFORE UPDATE ON "cp"."control_plane_users" FOR EACH ROW EXECUTE FUNCTION "cp"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_billing_events_touch" BEFORE UPDATE ON "cp"."billing_events" FOR EACH ROW EXECUTE FUNCTION "cp"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "trg_cp_leads_set_owner" BEFORE INSERT ON "cp"."leads" FOR EACH ROW EXECUTE FUNCTION "cp"."set_owner_id"();



CREATE OR REPLACE TRIGGER "trg_cp_leads_set_owner_default" BEFORE INSERT ON "cp"."leads" FOR EACH ROW EXECUTE FUNCTION "cp"."tg_set_owner_default"();



CREATE OR REPLACE TRIGGER "trg_cp_leads_set_updated_at" BEFORE UPDATE ON "cp"."leads" FOR EACH ROW EXECUTE FUNCTION "cp"."tg_set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_tenant_settings_touch" BEFORE UPDATE ON "cp"."tenant_settings" FOR EACH ROW EXECUTE FUNCTION "cp"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "trg_tenants_touch" BEFORE UPDATE ON "cp"."tenants" FOR EACH ROW EXECUTE FUNCTION "cp"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "atualizar_markup_timestamp" BEFORE UPDATE ON "public"."markups" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_updated_at"();



CREATE OR REPLACE TRIGGER "atualizar_regra_preco_timestamp" BEFORE UPDATE ON "public"."regras_preco" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_updated_at"();



CREATE OR REPLACE TRIGGER "manter_ordem_markups" AFTER INSERT OR DELETE OR UPDATE ON "public"."markups" FOR EACH ROW EXECUTE FUNCTION "public"."reordenar_markups"();



CREATE OR REPLACE TRIGGER "notify_on_new_lead" AFTER INSERT ON "public"."noro_leads" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_lead"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."noro_empresa" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_alocacoes_updated_at" BEFORE UPDATE ON "public"."fin_alocacoes" FOR EACH ROW EXECUTE FUNCTION "public"."update_centros_custo_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_metricas_cliente" AFTER UPDATE ON "public"."noro_pedidos" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_metricas_cliente"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_saldo" AFTER INSERT ON "public"."fin_transacoes" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_saldo_conta"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_saldo_adiantamento" BEFORE INSERT OR UPDATE ON "public"."fin_adiantamentos" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_saldo_adiantamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_saldo_credito" BEFORE INSERT OR UPDATE ON "public"."fin_creditos" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_saldo_credito"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_totais_orcamento_delete" AFTER DELETE ON "public"."noro_orcamentos_itens" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_totais_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_totais_orcamento_insert" AFTER INSERT ON "public"."noro_orcamentos_itens" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_totais_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_totais_orcamento_update" AFTER UPDATE ON "public"."noro_orcamentos_itens" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_totais_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_ultimo_contato" AFTER INSERT ON "public"."noro_interacoes" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_ultimo_contato"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_valor_pendente_pagar" BEFORE INSERT OR UPDATE ON "public"."fin_duplicatas_pagar" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_valor_pendente_pagar"();



CREATE OR REPLACE TRIGGER "trigger_atualizar_valor_pendente_receber" BEFORE INSERT OR UPDATE ON "public"."fin_duplicatas_receber" FOR EACH ROW EXECUTE FUNCTION "public"."atualizar_valor_pendente_receber"();



CREATE OR REPLACE TRIGGER "trigger_calcular_dias_atraso" BEFORE INSERT OR UPDATE ON "public"."noro_transacoes" FOR EACH ROW EXECUTE FUNCTION "public"."calcular_dias_atraso"();



CREATE OR REPLACE TRIGGER "trigger_centros_custo_updated_at" BEFORE UPDATE ON "public"."fin_centros_custo" FOR EACH ROW EXECUTE FUNCTION "public"."update_centros_custo_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_criar_comissao_automatica" AFTER UPDATE ON "public"."noro_pedidos" FOR EACH ROW EXECUTE FUNCTION "public"."criar_comissao_automatica"();



CREATE OR REPLACE TRIGGER "trigger_generate_numero_orcamento" BEFORE INSERT ON "public"."noro_orcamentos" FOR EACH ROW WHEN ((("new"."numero_orcamento" IS NULL) OR (("new"."numero_orcamento")::"text" = ''::"text"))) EXECUTE FUNCTION "public"."generate_numero_orcamento"();



CREATE OR REPLACE TRIGGER "trigger_generate_numero_pedido" BEFORE INSERT ON "public"."noro_pedidos" FOR EACH ROW WHEN ((("new"."numero_pedido" IS NULL) OR (("new"."numero_pedido")::"text" = ''::"text"))) EXECUTE FUNCTION "public"."generate_numero_pedido"();



CREATE OR REPLACE TRIGGER "trigger_incrementar_uso_template" AFTER INSERT ON "public"."noro_interacoes" FOR EACH ROW EXECUTE FUNCTION "public"."incrementar_uso_template"();



CREATE OR REPLACE TRIGGER "trigger_pedido_timeline" AFTER INSERT OR UPDATE ON "public"."noro_pedidos" FOR EACH ROW EXECUTE FUNCTION "public"."pedido_criar_evento_timeline"();



CREATE OR REPLACE TRIGGER "update_adiantamentos_updated_at" BEFORE UPDATE ON "public"."fin_adiantamentos" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_clientes_updated_at" BEFORE UPDATE ON "public"."clientes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_condicoes_pagamento_updated_at" BEFORE UPDATE ON "public"."fin_condicoes_pagamento" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_creditos_updated_at" BEFORE UPDATE ON "public"."fin_creditos" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_duplicatas_pagar_updated_at" BEFORE UPDATE ON "public"."fin_duplicatas_pagar" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_duplicatas_receber_updated_at" BEFORE UPDATE ON "public"."fin_duplicatas_receber" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fin_comissoes_updated_at" BEFORE UPDATE ON "public"."fin_comissoes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fin_contas_bancarias_updated_at" BEFORE UPDATE ON "public"."fin_contas_bancarias" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fin_despesas_updated_at" BEFORE UPDATE ON "public"."fin_despesas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fin_projecoes_updated_at" BEFORE UPDATE ON "public"."fin_projecoes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fin_receitas_updated_at" BEFORE UPDATE ON "public"."fin_receitas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fornecedores_updated_at" BEFORE UPDATE ON "public"."fin_fornecedores" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_nomade_leads_updated_at" BEFORE UPDATE ON "public"."noro_leads" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_nomade_tarefas_updated_at" BEFORE UPDATE ON "public"."noro_tarefas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_nomade_users_updated_at" BEFORE UPDATE ON "public"."noro_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tenants_updated_at" BEFORE UPDATE ON "public"."tenants" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_tenants_updated_at" BEFORE UPDATE ON "public"."user_tenants" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "validar_regra_preco_trigger" BEFORE INSERT OR UPDATE ON "public"."regras_preco" FOR EACH ROW EXECUTE FUNCTION "public"."validar_regra_preco"();



ALTER TABLE ONLY "cp"."api_key_logs"
    ADD CONSTRAINT "api_key_logs_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "cp"."api_keys"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."api_key_logs"
    ADD CONSTRAINT "api_key_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."api_keys"
    ADD CONSTRAINT "api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."billing_events"
    ADD CONSTRAINT "billing_events_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."billing_events"
    ADD CONSTRAINT "billing_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."contacts"
    ADD CONSTRAINT "contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."control_plane_user_activities"
    ADD CONSTRAINT "control_plane_user_activities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id");



ALTER TABLE ONLY "cp"."control_plane_user_activities"
    ADD CONSTRAINT "control_plane_user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cp"."control_plane_users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."control_plane_users"
    ADD CONSTRAINT "control_plane_users_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "cp"."control_plane_users"
    ADD CONSTRAINT "control_plane_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id");



ALTER TABLE ONLY "cp"."domains"
    ADD CONSTRAINT "domains_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."invoices"
    ADD CONSTRAINT "invoices_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "cp"."subscriptions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."invoices"
    ADD CONSTRAINT "invoices_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."lead_activity"
    ADD CONSTRAINT "lead_activity_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "cp"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."leads"
    ADD CONSTRAINT "leads_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "cp"."lead_stages"("id");



ALTER TABLE ONLY "cp"."leads"
    ADD CONSTRAINT "leads_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."ledger_entries"
    ADD CONSTRAINT "ledger_entries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "cp"."ledger_accounts"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."ledger_entries"
    ADD CONSTRAINT "ledger_entries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."notes"
    ADD CONSTRAINT "notes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."payments"
    ADD CONSTRAINT "payments_billing_event_fkey" FOREIGN KEY ("billing_event_id") REFERENCES "cp"."billing_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."payments"
    ADD CONSTRAINT "payments_billing_event_id_fkey" FOREIGN KEY ("billing_event_id") REFERENCES "cp"."billing_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."plan_features"
    ADD CONSTRAINT "plan_features_plan_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."plan_features"
    ADD CONSTRAINT "plan_features_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."subscription_addon_items"
    ADD CONSTRAINT "subscription_addon_items_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "cp"."subscription_addons"("id");



ALTER TABLE ONLY "cp"."subscription_addon_items"
    ADD CONSTRAINT "subscription_addon_items_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "cp"."subscriptions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."subscriptions"
    ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."subscriptions"
    ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."support_events"
    ADD CONSTRAINT "support_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."support_events"
    ADD CONSTRAINT "support_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."support_events"
    ADD CONSTRAINT "support_events_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "cp"."support_tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."support_messages"
    ADD CONSTRAINT "support_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."support_messages"
    ADD CONSTRAINT "support_messages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."support_messages"
    ADD CONSTRAINT "support_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "cp"."support_tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."support_sla"
    ADD CONSTRAINT "support_sla_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "cp"."support_tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."support_tickets"
    ADD CONSTRAINT "support_tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."support_tickets"
    ADD CONSTRAINT "support_tickets_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."support_tickets"
    ADD CONSTRAINT "support_tickets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."system_events"
    ADD CONSTRAINT "system_events_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."tasks"
    ADD CONSTRAINT "tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_module_fkey" FOREIGN KEY ("module_id") REFERENCES "cp"."modules_registry"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "cp"."modules_registry"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_modules"
    ADD CONSTRAINT "tenant_modules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_plan_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cp"."plans"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_plan"
    ADD CONSTRAINT "tenant_plan_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_settings"
    ADD CONSTRAINT "tenant_settings_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."tenant_settings"
    ADD CONSTRAINT "tenant_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."usage_counters"
    ADD CONSTRAINT "usage_counters_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_user_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."user_tenant_roles"
    ADD CONSTRAINT "user_tenant_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_tenant_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "cp"."webhooks"
    ADD CONSTRAINT "webhooks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."clientes"
    ADD CONSTRAINT "clientes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_adiantamentos"
    ADD CONSTRAINT "fin_adiantamentos_conta_bancaria_id_fkey" FOREIGN KEY ("conta_bancaria_id") REFERENCES "public"."fin_contas_bancarias"("id");



ALTER TABLE ONLY "public"."fin_adiantamentos"
    ADD CONSTRAINT "fin_adiantamentos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_adiantamentos"
    ADD CONSTRAINT "fin_adiantamentos_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fin_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_adiantamentos"
    ADD CONSTRAINT "fin_adiantamentos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_alocacoes"
    ADD CONSTRAINT "fin_alocacoes_centro_custo_id_fkey" FOREIGN KEY ("centro_custo_id") REFERENCES "public"."fin_centros_custo"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_alocacoes"
    ADD CONSTRAINT "fin_alocacoes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_alocacoes"
    ADD CONSTRAINT "fin_alocacoes_despesa_id_fkey" FOREIGN KEY ("despesa_id") REFERENCES "public"."fin_despesas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_alocacoes"
    ADD CONSTRAINT "fin_alocacoes_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "public"."fin_receitas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_alocacoes"
    ADD CONSTRAINT "fin_alocacoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_categorias"
    ADD CONSTRAINT "fin_categorias_categoria_pai_id_fkey" FOREIGN KEY ("categoria_pai_id") REFERENCES "public"."fin_categorias"("id");



ALTER TABLE ONLY "public"."fin_categorias"
    ADD CONSTRAINT "fin_categorias_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_centros_custo"
    ADD CONSTRAINT "fin_centros_custo_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_centros_custo"
    ADD CONSTRAINT "fin_centros_custo_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_centros_custo"
    ADD CONSTRAINT "fin_centros_custo_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_comissoes"
    ADD CONSTRAINT "fin_comissoes_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."noro_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_comissoes_recebidas"
    ADD CONSTRAINT "fin_comissoes_recebidas_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fin_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_comissoes_recebidas"
    ADD CONSTRAINT "fin_comissoes_recebidas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_comissoes"
    ADD CONSTRAINT "fin_comissoes_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "public"."fin_receitas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_comissoes_split"
    ADD CONSTRAINT "fin_comissoes_split_comissao_id_fkey" FOREIGN KEY ("comissao_id") REFERENCES "public"."fin_comissoes_recebidas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_comissoes_split"
    ADD CONSTRAINT "fin_comissoes_split_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_comissoes"
    ADD CONSTRAINT "fin_comissoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_condicoes_pagamento"
    ADD CONSTRAINT "fin_condicoes_pagamento_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_contas_bancarias"
    ADD CONSTRAINT "fin_contas_bancarias_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_creditos"
    ADD CONSTRAINT "fin_creditos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_creditos"
    ADD CONSTRAINT "fin_creditos_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fin_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_creditos"
    ADD CONSTRAINT "fin_creditos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."fin_categorias"("id");



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_conta_bancaria_id_fkey" FOREIGN KEY ("conta_bancaria_id") REFERENCES "public"."fin_contas_bancarias"("id");



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."noro_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id");



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_despesas"
    ADD CONSTRAINT "fin_despesas_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_condicao_pagamento_id_fkey" FOREIGN KEY ("condicao_pagamento_id") REFERENCES "public"."fin_condicoes_pagamento"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_conta_bancaria_id_fkey" FOREIGN KEY ("conta_bancaria_id") REFERENCES "public"."fin_contas_bancarias"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fin_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_duplicatas_pagar"
    ADD CONSTRAINT "fin_duplicatas_pagar_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_condicao_pagamento_id_fkey" FOREIGN KEY ("condicao_pagamento_id") REFERENCES "public"."fin_condicoes_pagamento"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_fornecedor_intermediario_id_fkey" FOREIGN KEY ("fornecedor_intermediario_id") REFERENCES "public"."fin_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_duplicatas_receber"
    ADD CONSTRAINT "fin_duplicatas_receber_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_fornecedores"
    ADD CONSTRAINT "fin_fornecedores_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_lembretes"
    ADD CONSTRAINT "fin_lembretes_duplicata_pagar_id_fkey" FOREIGN KEY ("duplicata_pagar_id") REFERENCES "public"."fin_duplicatas_pagar"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_lembretes"
    ADD CONSTRAINT "fin_lembretes_duplicata_receber_id_fkey" FOREIGN KEY ("duplicata_receber_id") REFERENCES "public"."fin_duplicatas_receber"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_lembretes"
    ADD CONSTRAINT "fin_lembretes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_parcelas"
    ADD CONSTRAINT "fin_parcelas_duplicata_pagar_id_fkey" FOREIGN KEY ("duplicata_pagar_id") REFERENCES "public"."fin_duplicatas_pagar"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_parcelas"
    ADD CONSTRAINT "fin_parcelas_duplicata_receber_id_fkey" FOREIGN KEY ("duplicata_receber_id") REFERENCES "public"."fin_duplicatas_receber"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_parcelas"
    ADD CONSTRAINT "fin_parcelas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_plano_contas"
    ADD CONSTRAINT "fin_plano_contas_conta_pai_id_fkey" FOREIGN KEY ("conta_pai_id") REFERENCES "public"."fin_plano_contas"("id");



ALTER TABLE ONLY "public"."fin_plano_contas"
    ADD CONSTRAINT "fin_plano_contas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_projecoes"
    ADD CONSTRAINT "fin_projecoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."fin_categorias"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_conta_bancaria_id_fkey" FOREIGN KEY ("conta_bancaria_id") REFERENCES "public"."fin_contas_bancarias"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_fornecedor_comissao_id_fkey" FOREIGN KEY ("fornecedor_comissao_id") REFERENCES "public"."noro_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "public"."noro_orcamentos"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id");



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_receitas"
    ADD CONSTRAINT "fin_receitas_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."fin_regras_comissao"
    ADD CONSTRAINT "fin_regras_comissao_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fin_fornecedores"("id");



ALTER TABLE ONLY "public"."fin_regras_comissao"
    ADD CONSTRAINT "fin_regras_comissao_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_repasses_automacao"
    ADD CONSTRAINT "fin_repasses_automacao_split_id_fkey" FOREIGN KEY ("split_id") REFERENCES "public"."fin_comissoes_split"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."fin_categorias"("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "public"."fin_contas_bancarias"("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_conta_origem_id_fkey" FOREIGN KEY ("conta_origem_id") REFERENCES "public"."fin_contas_bancarias"("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_despesa_id_fkey" FOREIGN KEY ("despesa_id") REFERENCES "public"."fin_despesas"("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "public"."fin_receitas"("id");



ALTER TABLE ONLY "public"."fin_transacoes"
    ADD CONSTRAINT "fin_transacoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_utilizacoes"
    ADD CONSTRAINT "fin_utilizacoes_adiantamento_id_fkey" FOREIGN KEY ("adiantamento_id") REFERENCES "public"."fin_adiantamentos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_utilizacoes"
    ADD CONSTRAINT "fin_utilizacoes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."fin_utilizacoes"
    ADD CONSTRAINT "fin_utilizacoes_credito_id_fkey" FOREIGN KEY ("credito_id") REFERENCES "public"."fin_creditos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_utilizacoes"
    ADD CONSTRAINT "fin_utilizacoes_duplicata_pagar_id_fkey" FOREIGN KEY ("duplicata_pagar_id") REFERENCES "public"."fin_duplicatas_pagar"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fin_utilizacoes"
    ADD CONSTRAINT "fin_utilizacoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."markups"
    ADD CONSTRAINT "markups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."markups"
    ADD CONSTRAINT "markups_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id");



ALTER TABLE ONLY "public"."noro_audit_log"
    ADD CONSTRAINT "noro_audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_campanhas"
    ADD CONSTRAINT "noro_campanhas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "noro_clientes_agente_responsavel_id_fkey" FOREIGN KEY ("agente_responsavel_id") REFERENCES "public"."noro_users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_clientes_contatos_emergencia"
    ADD CONSTRAINT "noro_clientes_contatos_emergencia_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_contatos_emergencia"
    ADD CONSTRAINT "noro_clientes_contatos_emergencia_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_clientes_documentos"
    ADD CONSTRAINT "noro_clientes_documentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_documentos"
    ADD CONSTRAINT "noro_clientes_documentos_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_clientes_enderecos"
    ADD CONSTRAINT "noro_clientes_enderecos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_enderecos"
    ADD CONSTRAINT "noro_clientes_enderecos_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_clientes_milhas"
    ADD CONSTRAINT "noro_clientes_milhas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_milhas"
    ADD CONSTRAINT "noro_clientes_milhas_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "noro_clientes_origem_lead_id_fkey" FOREIGN KEY ("origem_lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_clientes_preferencias"
    ADD CONSTRAINT "noro_clientes_preferencias_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_clientes_preferencias"
    ADD CONSTRAINT "noro_clientes_preferencias_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_clientes"
    ADD CONSTRAINT "noro_clientes_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



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
    ADD CONSTRAINT "noro_configuracoes_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_configuracoes"
    ADD CONSTRAINT "noro_configuracoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."noro_empresa"
    ADD CONSTRAINT "noro_empresa_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_fornecedores"
    ADD CONSTRAINT "noro_fornecedores_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



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



ALTER TABLE ONLY "public"."noro_interacoes"
    ADD CONSTRAINT "noro_interacoes_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_leads"
    ADD CONSTRAINT "noro_leads_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_newsletter"
    ADD CONSTRAINT "noro_newsletter_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_notificacoes"
    ADD CONSTRAINT "noro_notificacoes_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_notificacoes"
    ADD CONSTRAINT "noro_notificacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."noro_users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."noro_clientes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_orcamentos_itens"
    ADD CONSTRAINT "noro_orcamentos_itens_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "public"."noro_orcamentos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_orcamentos_itens"
    ADD CONSTRAINT "noro_orcamentos_itens_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_orcamentos"
    ADD CONSTRAINT "noro_orcamentos_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



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



ALTER TABLE ONLY "public"."noro_pedidos_itens"
    ADD CONSTRAINT "noro_pedidos_itens_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "public"."noro_orcamentos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_pedidos_timeline"
    ADD CONSTRAINT "noro_pedidos_timeline_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_pedidos_timeline"
    ADD CONSTRAINT "noro_pedidos_timeline_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."noro_pedidos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."noro_pedidos_timeline"
    ADD CONSTRAINT "noro_pedidos_timeline_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."noro_pedidos"
    ADD CONSTRAINT "noro_pedidos_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."noro_leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_responsavel_fkey" FOREIGN KEY ("responsavel") REFERENCES "public"."noro_users"("id");



ALTER TABLE ONLY "public"."noro_tarefas"
    ADD CONSTRAINT "noro_tarefas_tenant_fk" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE RESTRICT;



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



ALTER TABLE ONLY "public"."regras_preco"
    ADD CONSTRAINT "regras_preco_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."regras_preco"
    ADD CONSTRAINT "regras_preco_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id");



ALTER TABLE ONLY "public"."user_tenants"
    ADD CONSTRAINT "user_tenants_convidado_por_fkey" FOREIGN KEY ("convidado_por") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."user_tenants"
    ADD CONSTRAINT "user_tenants_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_tenants"
    ADD CONSTRAINT "user_tenants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visa_overrides"
    ADD CONSTRAINT "visa_overrides_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "cp"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visa_updates"
    ADD CONSTRAINT "visa_updates_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."visa_sources"("id") ON DELETE SET NULL;



ALTER TABLE "cp"."api_key_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."api_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."billing_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."contacts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "control_read_api_key_logs" ON "cp"."api_key_logs" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_api_keys" ON "cp"."api_keys" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_domains" ON "cp"."domains" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_invoices" ON "cp"."invoices" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_ledger_accounts" ON "cp"."ledger_accounts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_ledger_entries" ON "cp"."ledger_entries" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_tenants" ON "cp"."tenants" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "control_read_webhook_logs" ON "cp"."webhook_logs" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "cp"."domains" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."invoices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."lead_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."lead_stages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."ledger_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."ledger_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."modules_registry" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."notes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "p_api_key_logs_read" ON "cp"."api_key_logs" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_api_keys_admin_write" ON "cp"."api_keys" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "api_keys"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "api_keys"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))));



CREATE POLICY "p_cp_api_keys_member_read" ON "cp"."api_keys" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "api_keys"."tenant_id")))));



CREATE POLICY "p_cp_billing_all" ON "cp"."billing_events" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_billing_read" ON "cp"."billing_events" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_contacts_all" ON "cp"."contacts" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "p_cp_domains_admin_write" ON "cp"."domains" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "domains"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "domains"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))));



CREATE POLICY "p_cp_domains_member_read" ON "cp"."domains" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "domains"."tenant_id")))));



CREATE POLICY "p_cp_events_all" ON "cp"."system_events" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_events_read" ON "cp"."system_events" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_invoices_read" ON "cp"."invoices" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "p_cp_keys_all" ON "cp"."api_keys" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_keys_read" ON "cp"."api_keys" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_lead_activity_insert_member" ON "cp"."lead_activity" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."leads" "l"
  WHERE (("l"."id" = "lead_activity"."lead_id") AND "cp"."is_member_of_tenant"("auth"."uid"(), "l"."tenant_id")))));



CREATE POLICY "p_cp_lead_activity_select_member" ON "cp"."lead_activity" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "cp"."leads" "l"
  WHERE (("l"."id" = "lead_activity"."lead_id") AND "cp"."is_member_of_tenant"("auth"."uid"(), "l"."tenant_id")))));



CREATE POLICY "p_cp_lead_stages_modify_admin" ON "cp"."lead_stages" TO "authenticated" USING ("cp"."is_admin_of_tenant"("auth"."uid"(), "tenant_id")) WITH CHECK ("cp"."is_admin_of_tenant"("auth"."uid"(), "tenant_id"));



CREATE POLICY "p_cp_lead_stages_select_member" ON "cp"."lead_stages" FOR SELECT TO "authenticated" USING ("cp"."is_member_of_tenant"("auth"."uid"(), "tenant_id"));



CREATE POLICY "p_cp_leads_insert_member" ON "cp"."leads" FOR INSERT TO "authenticated" WITH CHECK ((("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "utr"."tenant_id"))))));



CREATE POLICY "p_cp_leads_select_member" ON "cp"."leads" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "leads"."tenant_id")))));



CREATE POLICY "p_cp_leads_update_owner_admin" ON "cp"."leads" FOR UPDATE TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "leads"."tenant_id")))) AND (("owner_id" = "auth"."uid"()) OR "cp"."is_admin_of_tenant"("auth"."uid"(), "tenant_id")))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "utr"."tenant_id")))));



CREATE POLICY "p_cp_ledger_accounts_read" ON "cp"."ledger_accounts" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "p_cp_ledger_entries_read" ON "cp"."ledger_entries" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "p_cp_modules_all" ON "cp"."modules_registry" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_modules_read" ON "cp"."modules_registry" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_notes_author" ON "cp"."notes" FOR INSERT WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "p_cp_notes_tenant_read" ON "cp"."notes" FOR SELECT USING (((("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "notes"."tenant_id"))))) OR ("created_by" = "auth"."uid"())));



CREATE POLICY "p_cp_payments_all" ON "cp"."payments" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_payments_read" ON "cp"."payments" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_planfeat_all" ON "cp"."plan_features" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_planfeat_read" ON "cp"."plan_features" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_plans_all" ON "cp"."plans" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_plans_read" ON "cp"."plans" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "p_cp_settings_all" ON "cp"."tenant_settings" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_settings_read" ON "cp"."tenant_settings" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_subs_read" ON "cp"."subscriptions" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "p_cp_tasks_assignee" ON "cp"."tasks" USING (("assigned_to" = "auth"."uid"())) WITH CHECK (("assigned_to" = "auth"."uid"()));



CREATE POLICY "p_cp_tasks_tenant_read" ON "cp"."tasks" FOR SELECT USING ((("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "tasks"."tenant_id"))))));



CREATE POLICY "p_cp_tenantmods_all" ON "cp"."tenant_modules" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantmods_read" ON "cp"."tenant_modules" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantplan_all" ON "cp"."tenant_plan" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenantplan_read" ON "cp"."tenant_plan" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenants_all" ON "cp"."tenants" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_tenants_member_read" ON "cp"."tenants" FOR SELECT USING (("cp"."is_super_admin"("auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "tenants"."id"))))));



CREATE POLICY "p_cp_tenants_read" ON "cp"."tenants" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_usage_all" ON "cp"."usage_counters" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_usage_read" ON "cp"."usage_counters" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_userroles_all" ON "cp"."user_tenant_roles" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_userroles_read" ON "cp"."user_tenant_roles" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_utr_self" ON "cp"."user_tenant_roles" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR "cp"."is_super_admin"("auth"."uid"())));



CREATE POLICY "p_cp_webhooks_all" ON "cp"."webhooks" USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_cp_webhooks_member_read" ON "cp"."webhooks" FOR SELECT USING (("cp"."is_super_admin"("auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "webhooks"."tenant_id"))))));



CREATE POLICY "p_cp_webhooks_read" ON "cp"."webhooks" FOR SELECT USING ("cp"."is_super_admin"("auth"."uid"()));



CREATE POLICY "p_support_events_insert" ON "cp"."support_events" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_events"."ticket_id") AND ("support_events"."tenant_id" = "t"."tenant_id") AND (("t"."assigned_to" = "auth"."uid"()) OR ("t"."requester_id" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id"))))))))));



CREATE POLICY "p_support_events_select" ON "cp"."support_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_events"."ticket_id") AND (("t"."assigned_to" = "auth"."uid"()) OR ("t"."requester_id" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id"))))))))));



CREATE POLICY "p_support_messages_insert" ON "cp"."support_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_messages"."ticket_id") AND ("support_messages"."tenant_id" = "t"."tenant_id") AND (("t"."assigned_to" = "auth"."uid"()) OR ("t"."requester_id" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id"))))))))));



CREATE POLICY "p_support_messages_select" ON "cp"."support_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_messages"."ticket_id") AND (("t"."assigned_to" = "auth"."uid"()) OR ("t"."requester_id" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id"))))))))));



CREATE POLICY "p_support_sla_select" ON "cp"."support_sla" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_sla"."ticket_id") AND (("t"."assigned_to" = "auth"."uid"()) OR ("t"."requester_id" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id"))))))))));



CREATE POLICY "p_support_sla_upsert" ON "cp"."support_sla" USING ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_sla"."ticket_id") AND ("support_sla"."tenant_id" = "t"."tenant_id") AND (("t"."assigned_to" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id")))))))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."support_tickets" "t"
  WHERE (("t"."id" = "support_sla"."ticket_id") AND ("support_sla"."tenant_id" = "t"."tenant_id") AND (("t"."assigned_to" = "auth"."uid"()) OR (("t"."tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
           FROM "cp"."user_tenant_roles" "utr"
          WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "t"."tenant_id"))))))))));



CREATE POLICY "p_support_tickets_insert" ON "cp"."support_tickets" FOR INSERT WITH CHECK ((("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "support_tickets"."tenant_id"))))));



CREATE POLICY "p_support_tickets_select" ON "cp"."support_tickets" FOR SELECT USING (((("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "support_tickets"."tenant_id"))))) OR ("assigned_to" = "auth"."uid"()) OR ("requester_id" = "auth"."uid"())));



CREATE POLICY "p_support_tickets_update" ON "cp"."support_tickets" FOR UPDATE USING ((("assigned_to" = "auth"."uid"()) OR (("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "support_tickets"."tenant_id"))))))) WITH CHECK ((("tenant_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "support_tickets"."tenant_id"))))));



ALTER TABLE "cp"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."plan_features" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."support_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."support_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."support_sla" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."support_tickets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."system_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenant_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenant_plan" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenant_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."usage_counters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."user_tenant_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "cp"."webhook_logs" ENABLE ROW LEVEL SECURITY;


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



CREATE POLICY "Allow all DELETE on fin_categorias for development" ON "public"."fin_categorias" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all DELETE on fin_comissoes for development" ON "public"."fin_comissoes" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all DELETE on fin_contas_bancarias for development" ON "public"."fin_contas_bancarias" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all DELETE on fin_despesas for development" ON "public"."fin_despesas" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all DELETE on fin_projecoes for development" ON "public"."fin_projecoes" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all DELETE on fin_receitas for development" ON "public"."fin_receitas" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all INSERT on fin_categorias for development" ON "public"."fin_categorias" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow all INSERT on fin_comissoes for development" ON "public"."fin_comissoes" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow all INSERT on fin_contas_bancarias for development" ON "public"."fin_contas_bancarias" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow all INSERT on fin_despesas for development" ON "public"."fin_despesas" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow all INSERT on fin_projecoes for development" ON "public"."fin_projecoes" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow all INSERT on fin_receitas for development" ON "public"."fin_receitas" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow all SELECT on fin_categorias for development" ON "public"."fin_categorias" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all SELECT on fin_comissoes for development" ON "public"."fin_comissoes" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all SELECT on fin_contas_bancarias for development" ON "public"."fin_contas_bancarias" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all SELECT on fin_despesas for development" ON "public"."fin_despesas" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all SELECT on fin_projecoes for development" ON "public"."fin_projecoes" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all SELECT on fin_receitas for development" ON "public"."fin_receitas" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow all UPDATE on fin_categorias for development" ON "public"."fin_categorias" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all UPDATE on fin_comissoes for development" ON "public"."fin_comissoes" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all UPDATE on fin_contas_bancarias for development" ON "public"."fin_contas_bancarias" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all UPDATE on fin_despesas for development" ON "public"."fin_despesas" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all UPDATE on fin_projecoes for development" ON "public"."fin_projecoes" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all UPDATE on fin_receitas for development" ON "public"."fin_receitas" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can subscribe to newsletter" ON "public"."noro_newsletter" FOR INSERT WITH CHECK (true);



CREATE POLICY "Authenticated users can view fornecedores" ON "public"."noro_fornecedores" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can view templates" ON "public"."noro_comunicacao_templates" FOR SELECT USING ((("auth"."uid"() IS NOT NULL) AND ("ativo" = true)));



CREATE POLICY "Clients can view own leads" ON "public"."noro_leads" FOR SELECT USING ((("email")::"text" IN ( SELECT "noro_users"."email"
   FROM "public"."noro_users"
  WHERE ("noro_users"."id" = "auth"."uid"()))));



CREATE POLICY "Enable read access for everyone" ON "public"."noro_audit_log" FOR SELECT USING (true);



CREATE POLICY "Only admins can access campanhas" ON "public"."noro_campanhas" USING ("public"."is_admin"());



CREATE POLICY "Only admins can view audit_log" ON "public"."noro_audit_log" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Permitir leitura para usuários autenticados do tenant" ON "public"."fin_contas_bancarias" FOR SELECT TO "authenticated" USING (("tenant_id" IN ( SELECT "control_plane_users"."tenant_id"
   FROM "cp"."control_plane_users"
  WHERE ("control_plane_users"."auth_id" = "auth"."uid"()))));



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



CREATE POLICY "Usuários podem atualizar markups do seu tenant" ON "public"."markups" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem atualizar regras de preço do seu tenant" ON "public"."regras_preco" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem criar markups no seu tenant" ON "public"."markups" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem criar regras de preço no seu tenant" ON "public"."regras_preco" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem excluir markups do seu tenant" ON "public"."markups" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem excluir regras de preço do seu tenant" ON "public"."regras_preco" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem ver markups do seu tenant" ON "public"."markups" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Usuários podem ver regras de preço do seu tenant" ON "public"."regras_preco" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_tenants" "ut"
  WHERE (("ut"."tenant_id" = "ut"."tenant_id") AND ("ut"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



ALTER TABLE "public"."clientes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "clientes_tenant_isolation" ON "public"."clientes" USING (("tenant_id" IN ( SELECT "user_tenants"."tenant_id"
   FROM "public"."user_tenants"
  WHERE ("user_tenants"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."fin_adiantamentos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_alocacoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_categorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_centros_custo" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_comissoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_condicoes_pagamento" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_contas_bancarias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_creditos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_despesas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_duplicatas_pagar" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_duplicatas_receber" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_fornecedores" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_lembretes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_parcelas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_plano_contas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_projecoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_receitas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_transacoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fin_utilizacoes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fornecedores_tenant_isolation" ON "public"."fin_fornecedores" USING (("tenant_id" IN ( SELECT "user_tenants"."tenant_id"
   FROM "public"."user_tenants"
  WHERE ("user_tenants"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."markups" ENABLE ROW LEVEL SECURITY;


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


ALTER TABLE "public"."noro_configuracoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."noro_empresa" ENABLE ROW LEVEL SECURITY;


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


CREATE POLICY "p_countries_read" ON "public"."visa_countries" FOR SELECT USING (true);



CREATE POLICY "p_noro_cli_contato_modify" ON "public"."noro_clientes_contatos_emergencia" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_contatos_emergencia"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_contatos_emergencia"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_cli_contato_select" ON "public"."noro_clientes_contatos_emergencia" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_contatos_emergencia"."tenant_id")))));



CREATE POLICY "p_noro_cli_docs_modify" ON "public"."noro_clientes_documentos" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_documentos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_documentos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_cli_docs_select" ON "public"."noro_clientes_documentos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_documentos"."tenant_id")))));



CREATE POLICY "p_noro_cli_end_modify" ON "public"."noro_clientes_enderecos" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_enderecos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_enderecos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_cli_end_select" ON "public"."noro_clientes_enderecos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_enderecos"."tenant_id")))));



CREATE POLICY "p_noro_cli_milhas_modify" ON "public"."noro_clientes_milhas" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_milhas"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_milhas"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_cli_milhas_select" ON "public"."noro_clientes_milhas" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_milhas"."tenant_id")))));



CREATE POLICY "p_noro_cli_pref_modify" ON "public"."noro_clientes_preferencias" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_preferencias"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_preferencias"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_cli_pref_select" ON "public"."noro_clientes_preferencias" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes_preferencias"."tenant_id")))));



CREATE POLICY "p_noro_clientes_modify" ON "public"."noro_clientes" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_clientes_select" ON "public"."noro_clientes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_clientes"."tenant_id")))));



CREATE POLICY "p_noro_configuracoes_modify" ON "public"."noro_configuracoes" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_configuracoes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_configuracoes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_configuracoes_select" ON "public"."noro_configuracoes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_configuracoes"."tenant_id")))));



CREATE POLICY "p_noro_empresa_modify" ON "public"."noro_empresa" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_empresa"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_empresa"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_empresa_select" ON "public"."noro_empresa" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_empresa"."tenant_id")))));



CREATE POLICY "p_noro_fornecedores_modify" ON "public"."noro_fornecedores" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_fornecedores"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_fornecedores"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_fornecedores_select" ON "public"."noro_fornecedores" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_fornecedores"."tenant_id")))));



CREATE POLICY "p_noro_interacoes_modify" ON "public"."noro_interacoes" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_interacoes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_interacoes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_interacoes_select" ON "public"."noro_interacoes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_interacoes"."tenant_id")))));



CREATE POLICY "p_noro_leads_modify" ON "public"."noro_leads" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_leads"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_leads"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_leads_select" ON "public"."noro_leads" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_leads"."tenant_id")))));



CREATE POLICY "p_noro_newsletter_modify" ON "public"."noro_newsletter" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_newsletter"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_newsletter"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_newsletter_select" ON "public"."noro_newsletter" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_newsletter"."tenant_id")))));



CREATE POLICY "p_noro_notificacoes_modify" ON "public"."noro_notificacoes" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_notificacoes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_notificacoes"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_notificacoes_select" ON "public"."noro_notificacoes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_notificacoes"."tenant_id")))));



CREATE POLICY "p_noro_orcamentos_itens_modify" ON "public"."noro_orcamentos_itens" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_orcamentos_itens"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_orcamentos_itens"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_orcamentos_itens_select" ON "public"."noro_orcamentos_itens" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_orcamentos_itens"."tenant_id")))));



CREATE POLICY "p_noro_orcamentos_modify" ON "public"."noro_orcamentos" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_orcamentos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_orcamentos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_orcamentos_select" ON "public"."noro_orcamentos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_orcamentos"."tenant_id")))));



CREATE POLICY "p_noro_pedidos_itens_modify" ON "public"."noro_pedidos_itens" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos_itens"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos_itens"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_pedidos_itens_select" ON "public"."noro_pedidos_itens" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos_itens"."tenant_id")))));



CREATE POLICY "p_noro_pedidos_modify" ON "public"."noro_pedidos" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_pedidos_select" ON "public"."noro_pedidos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos"."tenant_id")))));



CREATE POLICY "p_noro_pedidos_timeline_modify" ON "public"."noro_pedidos_timeline" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos_timeline"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos_timeline"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_pedidos_timeline_select" ON "public"."noro_pedidos_timeline" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_pedidos_timeline"."tenant_id")))));



CREATE POLICY "p_noro_tarefas_modify" ON "public"."noro_tarefas" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_tarefas"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_tarefas"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_noro_tarefas_select" ON "public"."noro_tarefas" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "noro_tarefas"."tenant_id")))));



CREATE POLICY "p_overrides_modify" ON "public"."visa_overrides" USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "visa_overrides"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "visa_overrides"."tenant_id") AND ("utr"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"]))))));



CREATE POLICY "p_overrides_select" ON "public"."visa_overrides" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "cp"."user_tenant_roles" "utr"
  WHERE (("utr"."user_id" = "auth"."uid"()) AND ("utr"."tenant_id" = "visa_overrides"."tenant_id")))));



CREATE POLICY "p_requirements_read" ON "public"."visa_requirements" FOR SELECT USING (true);



CREATE POLICY "p_sources_read" ON "public"."visa_sources" FOR SELECT USING (true);



CREATE POLICY "p_updates_read" ON "public"."visa_updates" FOR SELECT USING (true);



ALTER TABLE "public"."regras_preco" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tenants_user_access" ON "public"."tenants" USING (("id" IN ( SELECT "user_tenants"."tenant_id"
   FROM "public"."user_tenants"
  WHERE ("user_tenants"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."user_tenants" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_tenants_access" ON "public"."user_tenants" USING ((("user_id" = "auth"."uid"()) OR ("tenant_id" IN ( SELECT "user_tenants_1"."tenant_id"
   FROM "public"."user_tenants" "user_tenants_1"
  WHERE ("user_tenants_1"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_own_record" ON "public"."users" USING ((("auth_user_id" = "auth"."uid"()) OR ("id" IN ( SELECT "ut2"."user_id"
   FROM ("public"."user_tenants" "ut1"
     JOIN "public"."user_tenants" "ut2" ON (("ut1"."tenant_id" = "ut2"."tenant_id")))
  WHERE ("ut1"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."visa_countries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visa_overrides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visa_requirements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visa_sources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visa_updates" ENABLE ROW LEVEL SECURITY;




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



GRANT ALL ON FUNCTION "public"."atualizar_saldo_adiantamento"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_saldo_adiantamento"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_saldo_adiantamento"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_saldo_conta"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_saldo_conta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_saldo_conta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_saldo_credito"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_saldo_credito"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_saldo_credito"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_totais_orcamento"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_totais_orcamento"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_totais_orcamento"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_ultimo_contato"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_ultimo_contato"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_ultimo_contato"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_valor_pendente_pagar"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_valor_pendente_pagar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_valor_pendente_pagar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."atualizar_valor_pendente_receber"() TO "anon";
GRANT ALL ON FUNCTION "public"."atualizar_valor_pendente_receber"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."atualizar_valor_pendente_receber"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_dias_atraso"() TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_dias_atraso"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_dias_atraso"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_metricas_precos"("p_tenant_id" "uuid", "p_data_inicial" "date", "p_data_final" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_metricas_precos"("p_tenant_id" "uuid", "p_data_inicial" "date", "p_data_final" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_metricas_precos"("p_tenant_id" "uuid", "p_data_inicial" "date", "p_data_final" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_preco_final"("preco_base" numeric, "produto_id" "uuid", "cliente_id" "uuid", "quantidade" integer, "data_ref" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_preco_final"("preco_base" numeric, "produto_id" "uuid", "cliente_id" "uuid", "quantidade" integer, "data_ref" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_preco_final"("preco_base" numeric, "produto_id" "uuid", "cliente_id" "uuid", "quantidade" integer, "data_ref" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_previsoes_precos"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_previsoes_precos"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_previsoes_precos"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_previsoes_precos"("p_tenant_id" "uuid", "data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_previsoes_precos"("p_tenant_id" "uuid", "data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_previsoes_precos"("p_tenant_id" "uuid", "data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "periodos_futuros" integer) TO "service_role";



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
GRANT ALL ON TABLE "cp"."tenants" TO "service_role";



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



GRANT ALL ON FUNCTION "public"."gerar_relatorio_margens"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "incluir_comparativo" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."gerar_relatorio_margens"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "incluir_comparativo" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gerar_relatorio_margens"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone, "incluir_comparativo" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."gerar_relatorio_regras"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."gerar_relatorio_regras"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gerar_relatorio_regras"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."gerar_relatorio_simulacoes"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."gerar_relatorio_simulacoes"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gerar_relatorio_simulacoes"("data_inicial" timestamp with time zone, "data_final" timestamp with time zone) TO "service_role";



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



GRANT ALL ON FUNCTION "public"."obter_metricas_comparativas"("data_inicial_atual" timestamp with time zone, "data_final_atual" timestamp with time zone, "data_inicial_anterior" timestamp with time zone, "data_final_anterior" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."obter_metricas_comparativas"("data_inicial_atual" timestamp with time zone, "data_final_atual" timestamp with time zone, "data_inicial_anterior" timestamp with time zone, "data_final_anterior" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."obter_metricas_comparativas"("data_inicial_atual" timestamp with time zone, "data_final_atual" timestamp with time zone, "data_inicial_anterior" timestamp with time zone, "data_final_anterior" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."obter_metricas_gerais"("p_tenant_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."obter_metricas_gerais"("p_tenant_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."obter_metricas_gerais"("p_tenant_id" "uuid") TO "service_role";



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



GRANT ALL ON FUNCTION "public"."reordenar_markups"() TO "anon";
GRANT ALL ON FUNCTION "public"."reordenar_markups"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reordenar_markups"() TO "service_role";



GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."simular_preco"("tipo_produto" "text", "valor_custo" numeric, "quantidade" integer, "cliente_id" "uuid", "fornecedor_id" "uuid", "data_simulacao" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."simular_preco"("tipo_produto" "text", "valor_custo" numeric, "quantidade" integer, "cliente_id" "uuid", "fornecedor_id" "uuid", "data_simulacao" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."simular_preco"("tipo_produto" "text", "valor_custo" numeric, "quantidade" integer, "cliente_id" "uuid", "fornecedor_id" "uuid", "data_simulacao" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."support_auto_close_sweep"("p_days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."support_auto_close_sweep"("p_days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."support_auto_close_sweep"("p_days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."support_notify_http"("payload" "jsonb", "target_url" "text", "secret" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."support_notify_http"("payload" "jsonb", "target_url" "text", "secret" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."support_notify_http"("payload" "jsonb", "target_url" "text", "secret" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."support_set_function_config"("p_url" "text", "p_secret" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."support_set_function_config"("p_url" "text", "p_secret" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."support_set_function_config"("p_url" "text", "p_secret" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."support_sla_sweep"() TO "anon";
GRANT ALL ON FUNCTION "public"."support_sla_sweep"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."support_sla_sweep"() TO "service_role";



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



GRANT ALL ON FUNCTION "public"."update_centros_custo_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_centros_custo_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_centros_custo_updated_at"() TO "service_role";



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



GRANT ALL ON FUNCTION "public"."validar_regra_preco"() TO "anon";
GRANT ALL ON FUNCTION "public"."validar_regra_preco"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validar_regra_preco"() TO "service_role";












GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "service_role";



GRANT SELECT ON TABLE "cp"."api_key_logs" TO "anon";
GRANT SELECT ON TABLE "cp"."api_key_logs" TO "authenticated";
GRANT ALL ON TABLE "cp"."api_key_logs" TO "service_role";



GRANT SELECT ON TABLE "cp"."api_keys" TO "anon";
GRANT SELECT ON TABLE "cp"."api_keys" TO "authenticated";
GRANT ALL ON TABLE "cp"."api_keys" TO "service_role";



GRANT SELECT ON TABLE "cp"."billing_events" TO "anon";
GRANT SELECT ON TABLE "cp"."billing_events" TO "authenticated";
GRANT ALL ON TABLE "cp"."billing_events" TO "service_role";



GRANT SELECT ON TABLE "cp"."contacts" TO "anon";
GRANT SELECT ON TABLE "cp"."contacts" TO "authenticated";
GRANT ALL ON TABLE "cp"."contacts" TO "service_role";



GRANT SELECT ON TABLE "cp"."control_plane_config" TO "anon";
GRANT SELECT ON TABLE "cp"."control_plane_config" TO "authenticated";
GRANT ALL ON TABLE "cp"."control_plane_config" TO "service_role";



GRANT SELECT ON TABLE "cp"."control_plane_user_activities" TO "anon";
GRANT SELECT ON TABLE "cp"."control_plane_user_activities" TO "authenticated";
GRANT ALL ON TABLE "cp"."control_plane_user_activities" TO "service_role";



GRANT SELECT ON TABLE "cp"."control_plane_users" TO "anon";
GRANT SELECT ON TABLE "cp"."control_plane_users" TO "authenticated";
GRANT ALL ON TABLE "cp"."control_plane_users" TO "service_role";



GRANT SELECT ON TABLE "cp"."domains" TO "anon";
GRANT SELECT ON TABLE "cp"."domains" TO "authenticated";
GRANT ALL ON TABLE "cp"."domains" TO "service_role";



GRANT SELECT ON TABLE "cp"."invoices" TO "anon";
GRANT SELECT ON TABLE "cp"."invoices" TO "authenticated";
GRANT ALL ON TABLE "cp"."invoices" TO "service_role";



GRANT INSERT,DELETE,UPDATE ON TABLE "cp"."lead_activity" TO "authenticated";
GRANT ALL ON TABLE "cp"."lead_activity" TO "service_role";



GRANT INSERT,DELETE,UPDATE ON TABLE "cp"."lead_stages" TO "authenticated";
GRANT ALL ON TABLE "cp"."lead_stages" TO "service_role";



GRANT SELECT,INSERT ON TABLE "cp"."leads" TO "anon";
GRANT SELECT,INSERT,UPDATE ON TABLE "cp"."leads" TO "authenticated";
GRANT ALL ON TABLE "cp"."leads" TO "service_role";



GRANT SELECT ON TABLE "cp"."ledger_accounts" TO "anon";
GRANT SELECT ON TABLE "cp"."ledger_accounts" TO "authenticated";
GRANT ALL ON TABLE "cp"."ledger_accounts" TO "service_role";



GRANT SELECT ON TABLE "cp"."ledger_entries" TO "anon";
GRANT SELECT ON TABLE "cp"."ledger_entries" TO "authenticated";
GRANT ALL ON TABLE "cp"."ledger_entries" TO "service_role";



GRANT SELECT ON TABLE "cp"."modules_registry" TO "anon";
GRANT SELECT ON TABLE "cp"."modules_registry" TO "authenticated";
GRANT ALL ON TABLE "cp"."modules_registry" TO "service_role";



GRANT SELECT ON TABLE "cp"."notes" TO "anon";
GRANT SELECT ON TABLE "cp"."notes" TO "authenticated";
GRANT ALL ON TABLE "cp"."notes" TO "service_role";



GRANT SELECT ON TABLE "cp"."payments" TO "anon";
GRANT SELECT ON TABLE "cp"."payments" TO "authenticated";
GRANT ALL ON TABLE "cp"."payments" TO "service_role";



GRANT SELECT ON TABLE "cp"."plan_features" TO "anon";
GRANT SELECT ON TABLE "cp"."plan_features" TO "authenticated";
GRANT ALL ON TABLE "cp"."plan_features" TO "service_role";



GRANT SELECT ON TABLE "cp"."plans" TO "anon";
GRANT SELECT ON TABLE "cp"."plans" TO "authenticated";
GRANT ALL ON TABLE "cp"."plans" TO "service_role";



GRANT SELECT ON TABLE "cp"."subscription_addon_items" TO "anon";
GRANT SELECT ON TABLE "cp"."subscription_addon_items" TO "authenticated";
GRANT ALL ON TABLE "cp"."subscription_addon_items" TO "service_role";



GRANT SELECT ON TABLE "cp"."subscription_addons" TO "anon";
GRANT SELECT ON TABLE "cp"."subscription_addons" TO "authenticated";
GRANT ALL ON TABLE "cp"."subscription_addons" TO "service_role";



GRANT SELECT ON TABLE "cp"."subscription_plans" TO "anon";
GRANT SELECT ON TABLE "cp"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "cp"."subscription_plans" TO "service_role";



GRANT SELECT ON TABLE "cp"."subscriptions" TO "anon";
GRANT SELECT ON TABLE "cp"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "cp"."subscriptions" TO "service_role";



GRANT SELECT ON TABLE "cp"."support_events" TO "anon";
GRANT SELECT ON TABLE "cp"."support_events" TO "authenticated";
GRANT ALL ON TABLE "cp"."support_events" TO "service_role";



GRANT SELECT ON TABLE "cp"."support_messages" TO "anon";
GRANT SELECT ON TABLE "cp"."support_messages" TO "authenticated";
GRANT ALL ON TABLE "cp"."support_messages" TO "service_role";



GRANT SELECT ON TABLE "cp"."support_sla" TO "anon";
GRANT SELECT ON TABLE "cp"."support_sla" TO "authenticated";
GRANT ALL ON TABLE "cp"."support_sla" TO "service_role";



GRANT SELECT ON TABLE "cp"."support_tickets" TO "anon";
GRANT SELECT ON TABLE "cp"."support_tickets" TO "authenticated";
GRANT ALL ON TABLE "cp"."support_tickets" TO "service_role";



GRANT SELECT ON TABLE "cp"."system_events" TO "anon";
GRANT SELECT ON TABLE "cp"."system_events" TO "authenticated";
GRANT ALL ON TABLE "cp"."system_events" TO "service_role";



GRANT USAGE ON SEQUENCE "cp"."system_events_id_seq" TO "anon";
GRANT USAGE ON SEQUENCE "cp"."system_events_id_seq" TO "authenticated";
GRANT SELECT,USAGE ON SEQUENCE "cp"."system_events_id_seq" TO "service_role";



GRANT SELECT ON TABLE "cp"."tasks" TO "anon";
GRANT SELECT ON TABLE "cp"."tasks" TO "authenticated";
GRANT ALL ON TABLE "cp"."tasks" TO "service_role";



GRANT SELECT ON TABLE "cp"."tenant_modules" TO "anon";
GRANT SELECT ON TABLE "cp"."tenant_modules" TO "authenticated";
GRANT ALL ON TABLE "cp"."tenant_modules" TO "service_role";



GRANT SELECT ON TABLE "cp"."tenant_plan" TO "anon";
GRANT SELECT ON TABLE "cp"."tenant_plan" TO "authenticated";
GRANT ALL ON TABLE "cp"."tenant_plan" TO "service_role";



GRANT SELECT ON TABLE "cp"."tenant_settings" TO "anon";
GRANT SELECT ON TABLE "cp"."tenant_settings" TO "authenticated";
GRANT ALL ON TABLE "cp"."tenant_settings" TO "service_role";



GRANT SELECT ON TABLE "cp"."usage_counters" TO "anon";
GRANT SELECT ON TABLE "cp"."usage_counters" TO "authenticated";
GRANT ALL ON TABLE "cp"."usage_counters" TO "service_role";



GRANT USAGE ON SEQUENCE "cp"."usage_counters_id_seq" TO "anon";
GRANT USAGE ON SEQUENCE "cp"."usage_counters_id_seq" TO "authenticated";
GRANT SELECT,USAGE ON SEQUENCE "cp"."usage_counters_id_seq" TO "service_role";



GRANT SELECT ON TABLE "cp"."user_tenant_roles" TO "anon";
GRANT SELECT ON TABLE "cp"."user_tenant_roles" TO "authenticated";
GRANT ALL ON TABLE "cp"."user_tenant_roles" TO "service_role";



GRANT SELECT ON TABLE "cp"."v_api_key_usage_daily" TO "anon";
GRANT SELECT ON TABLE "cp"."v_api_key_usage_daily" TO "authenticated";
GRANT ALL ON TABLE "cp"."v_api_key_usage_daily" TO "service_role";



GRANT SELECT ON TABLE "cp"."v_support_ticket_status_counts" TO "anon";
GRANT SELECT ON TABLE "cp"."v_support_ticket_status_counts" TO "authenticated";
GRANT ALL ON TABLE "cp"."v_support_ticket_status_counts" TO "service_role";



GRANT SELECT ON TABLE "cp"."v_users" TO "anon";
GRANT SELECT ON TABLE "cp"."v_users" TO "authenticated";
GRANT ALL ON TABLE "cp"."v_users" TO "service_role";



GRANT ALL ON TABLE "cp"."webhook_logs" TO "service_role";



GRANT SELECT ON TABLE "cp"."webhooks" TO "anon";
GRANT SELECT ON TABLE "cp"."webhooks" TO "authenticated";
GRANT ALL ON TABLE "cp"."webhooks" TO "service_role";
























GRANT ALL ON TABLE "public"."clientes" TO "anon";
GRANT ALL ON TABLE "public"."clientes" TO "authenticated";
GRANT ALL ON TABLE "public"."clientes" TO "service_role";



GRANT ALL ON TABLE "public"."fin_adiantamentos" TO "anon";
GRANT ALL ON TABLE "public"."fin_adiantamentos" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_adiantamentos" TO "service_role";



GRANT ALL ON TABLE "public"."fin_alocacoes" TO "anon";
GRANT ALL ON TABLE "public"."fin_alocacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_alocacoes" TO "service_role";



GRANT ALL ON TABLE "public"."fin_categorias" TO "anon";
GRANT ALL ON TABLE "public"."fin_categorias" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_categorias" TO "service_role";



GRANT ALL ON TABLE "public"."fin_centros_custo" TO "anon";
GRANT ALL ON TABLE "public"."fin_centros_custo" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_centros_custo" TO "service_role";



GRANT ALL ON TABLE "public"."fin_comissoes" TO "anon";
GRANT ALL ON TABLE "public"."fin_comissoes" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_comissoes" TO "service_role";



GRANT ALL ON TABLE "public"."fin_comissoes_recebidas" TO "anon";
GRANT ALL ON TABLE "public"."fin_comissoes_recebidas" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_comissoes_recebidas" TO "service_role";



GRANT ALL ON TABLE "public"."fin_comissoes_split" TO "anon";
GRANT ALL ON TABLE "public"."fin_comissoes_split" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_comissoes_split" TO "service_role";



GRANT ALL ON TABLE "public"."fin_condicoes_pagamento" TO "anon";
GRANT ALL ON TABLE "public"."fin_condicoes_pagamento" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_condicoes_pagamento" TO "service_role";



GRANT ALL ON TABLE "public"."fin_contas_bancarias" TO "anon";
GRANT ALL ON TABLE "public"."fin_contas_bancarias" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_contas_bancarias" TO "service_role";



GRANT ALL ON TABLE "public"."fin_creditos" TO "anon";
GRANT ALL ON TABLE "public"."fin_creditos" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_creditos" TO "service_role";



GRANT ALL ON TABLE "public"."fin_despesas" TO "anon";
GRANT ALL ON TABLE "public"."fin_despesas" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_despesas" TO "service_role";



GRANT ALL ON TABLE "public"."fin_duplicatas_pagar" TO "anon";
GRANT ALL ON TABLE "public"."fin_duplicatas_pagar" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_duplicatas_pagar" TO "service_role";



GRANT ALL ON TABLE "public"."fin_duplicatas_receber" TO "anon";
GRANT ALL ON TABLE "public"."fin_duplicatas_receber" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_duplicatas_receber" TO "service_role";



GRANT ALL ON TABLE "public"."fin_fornecedores" TO "anon";
GRANT ALL ON TABLE "public"."fin_fornecedores" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_fornecedores" TO "service_role";



GRANT ALL ON TABLE "public"."fin_lembretes" TO "anon";
GRANT ALL ON TABLE "public"."fin_lembretes" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_lembretes" TO "service_role";



GRANT ALL ON TABLE "public"."fin_parcelas" TO "anon";
GRANT ALL ON TABLE "public"."fin_parcelas" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_parcelas" TO "service_role";



GRANT ALL ON TABLE "public"."fin_plano_contas" TO "anon";
GRANT ALL ON TABLE "public"."fin_plano_contas" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_plano_contas" TO "service_role";



GRANT ALL ON TABLE "public"."fin_projecoes" TO "anon";
GRANT ALL ON TABLE "public"."fin_projecoes" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_projecoes" TO "service_role";



GRANT ALL ON TABLE "public"."fin_receitas" TO "anon";
GRANT ALL ON TABLE "public"."fin_receitas" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_receitas" TO "service_role";



GRANT ALL ON TABLE "public"."fin_regras_comissao" TO "anon";
GRANT ALL ON TABLE "public"."fin_regras_comissao" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_regras_comissao" TO "service_role";



GRANT ALL ON TABLE "public"."fin_repasses_automacao" TO "anon";
GRANT ALL ON TABLE "public"."fin_repasses_automacao" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_repasses_automacao" TO "service_role";



GRANT ALL ON TABLE "public"."fin_transacoes" TO "anon";
GRANT ALL ON TABLE "public"."fin_transacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_transacoes" TO "service_role";



GRANT ALL ON TABLE "public"."fin_utilizacoes" TO "anon";
GRANT ALL ON TABLE "public"."fin_utilizacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."fin_utilizacoes" TO "service_role";



GRANT ALL ON TABLE "public"."markups" TO "anon";
GRANT ALL ON TABLE "public"."markups" TO "authenticated";
GRANT ALL ON TABLE "public"."markups" TO "service_role";



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



GRANT ALL ON TABLE "public"."regras_preco" TO "anon";
GRANT ALL ON TABLE "public"."regras_preco" TO "authenticated";
GRANT ALL ON TABLE "public"."regras_preco" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";



GRANT ALL ON TABLE "public"."user_tenants" TO "anon";
GRANT ALL ON TABLE "public"."user_tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."user_tenants" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."v_fin_contas_pagar" TO "anon";
GRANT ALL ON TABLE "public"."v_fin_contas_pagar" TO "authenticated";
GRANT ALL ON TABLE "public"."v_fin_contas_pagar" TO "service_role";



GRANT ALL ON TABLE "public"."v_fin_contas_receber" TO "anon";
GRANT ALL ON TABLE "public"."v_fin_contas_receber" TO "authenticated";
GRANT ALL ON TABLE "public"."v_fin_contas_receber" TO "service_role";



GRANT ALL ON TABLE "public"."v_fin_resumo_marca" TO "anon";
GRANT ALL ON TABLE "public"."v_fin_resumo_marca" TO "authenticated";
GRANT ALL ON TABLE "public"."v_fin_resumo_marca" TO "service_role";



GRANT ALL ON TABLE "public"."visa_requirements" TO "anon";
GRANT ALL ON TABLE "public"."visa_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."visa_requirements" TO "service_role";



GRANT ALL ON TABLE "public"."v_visa_info_basic" TO "anon";
GRANT ALL ON TABLE "public"."v_visa_info_basic" TO "authenticated";
GRANT ALL ON TABLE "public"."v_visa_info_basic" TO "service_role";



GRANT ALL ON TABLE "public"."visa_countries" TO "anon";
GRANT ALL ON TABLE "public"."visa_countries" TO "authenticated";
GRANT ALL ON TABLE "public"."visa_countries" TO "service_role";



GRANT ALL ON TABLE "public"."visa_overrides" TO "anon";
GRANT ALL ON TABLE "public"."visa_overrides" TO "authenticated";
GRANT ALL ON TABLE "public"."visa_overrides" TO "service_role";



GRANT ALL ON TABLE "public"."visa_sources" TO "anon";
GRANT ALL ON TABLE "public"."visa_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."visa_sources" TO "service_role";



GRANT ALL ON TABLE "public"."visa_updates" TO "anon";
GRANT ALL ON TABLE "public"."visa_updates" TO "authenticated";
GRANT ALL ON TABLE "public"."visa_updates" TO "service_role";



GRANT ALL ON TABLE "public"."vw_fin_duplicatas_pagar" TO "anon";
GRANT ALL ON TABLE "public"."vw_fin_duplicatas_pagar" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_fin_duplicatas_pagar" TO "service_role";



GRANT ALL ON TABLE "public"."vw_fin_duplicatas_receber" TO "anon";
GRANT ALL ON TABLE "public"."vw_fin_duplicatas_receber" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_fin_duplicatas_receber" TO "service_role";



GRANT ALL ON TABLE "public"."vw_previsao_comissoes_futuras" TO "anon";
GRANT ALL ON TABLE "public"."vw_previsao_comissoes_futuras" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_previsao_comissoes_futuras" TO "service_role";



GRANT ALL ON TABLE "public"."vw_rentabilidade_centros_custo" TO "anon";
GRANT ALL ON TABLE "public"."vw_rentabilidade_centros_custo" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_rentabilidade_centros_custo" TO "service_role";



GRANT ALL ON TABLE "public"."vw_saldo_adiantamentos" TO "anon";
GRANT ALL ON TABLE "public"."vw_saldo_adiantamentos" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_saldo_adiantamentos" TO "service_role";



GRANT ALL ON TABLE "public"."vw_saldo_creditos" TO "anon";
GRANT ALL ON TABLE "public"."vw_saldo_creditos" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_saldo_creditos" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT USAGE ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT USAGE ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT SELECT,USAGE ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT SELECT ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT SELECT ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "cp" GRANT ALL ON TABLES TO "service_role";



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
