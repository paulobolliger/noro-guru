set check_function_bodies = off;

CREATE OR REPLACE FUNCTION cp.cp_dashboard_overview()
 RETURNS TABLE(tenant_id uuid, tenant_name text, plan text, status text, total_users integer, total_events integer, last_event_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION cp.cp_list_users(p_limit integer, p_offset integer, p_search text)
 RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, last_sign_in_at timestamp with time zone, tenants_count integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'cp', 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION cp.cp_select_tenants()
 RETURNS TABLE(id uuid, name text, slug text, plan text, status text, billing_email text, next_invoice_date date, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'cp', 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION cp.has_role(uid uuid, tenant_id uuid, role_text text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select exists(
    select 1 from cp.user_tenant_roles utr
     where utr.user_id = uid and utr.tenant_id = tenant_id and utr.role = role_text
  );
$function$
;

CREATE OR REPLACE FUNCTION cp.is_member(uid uuid, tenant_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select exists(
    select 1 from cp.user_tenant_roles utr
     where utr.user_id = uid and utr.tenant_id = tenant_id
  );
$function$
;

CREATE OR REPLACE FUNCTION cp.is_member_of_tenant(p_user uuid, p_tenant uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = p_user AND utr.tenant_id = p_tenant
  );
$function$
;

CREATE OR REPLACE FUNCTION cp.is_super_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(
    (select (raw_app_meta_data->>'super_admin')::boolean
     from auth.users where id = uid), false);
$function$
;

CREATE OR REPLACE FUNCTION cp.set_owner_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
if new.owner_id is null then
new.owner_id := auth.uid();
end if;
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION cp.tg_set_owner_default()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION cp.tg_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION cp.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end $function$
;


alter table "public"."noro_audit_log" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."noro_campanhas" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."noro_leads" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."noro_newsletter" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."noro_notificacoes" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."noro_tarefas" alter column "id" set default extensions.uuid_generate_v4();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.atualizar_metricas_cliente()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.atualizar_totais_orcamento()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.atualizar_ultimo_contato()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.calcular_dias_atraso()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.cp_select_tenants()
 RETURNS SETOF cp.tenants
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  select * from cp.tenants;
$function$
;

CREATE OR REPLACE FUNCTION public.criar_comissao_automatica()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.generate_numero_orcamento()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.generate_numero_pedido()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_metrics(periodo_dias integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.noro_users (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nome',
    'cliente' -- Todos começam como cliente
  );
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.incrementar_uso_template()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.insert_default_empresa_row()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  IF NOT EXISTS (SELECT 1 FROM noro_empresa) THEN
    INSERT INTO noro_empresa (id) VALUES (gen_random_uuid());
  END IF;
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN EXISTS (
    SELECT 1 FROM noro_users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_lead()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_orcamento_aceito()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.pedido_criar_evento_timeline()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_lead_on_pedido()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE noro_leads
    SET status = 'ganho'
    WHERE id = NEW.lead_id;
  END IF;
  
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_pedido_status_pagamento()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  IF NEW.valor_pago >= NEW.valor_total THEN
    NEW.status_pagamento := 'pago_total';
  ELSIF NEW.valor_pago > 0 THEN
    NEW.status_pagamento := 'pago_parcial';
  ELSE
    NEW.status_pagamento := 'pendente';
  END IF;
  
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_secret(p_name text, p_secret text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- O PERFORM executa a função vault.create_secret e descarta seu resultado.
    PERFORM vault.create_secret(p_secret, p_name);
END;$function$
;



