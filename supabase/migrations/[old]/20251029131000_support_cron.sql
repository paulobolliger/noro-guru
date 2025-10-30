-- Support automation without external workers
create extension if not exists http with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- store function URL/secret used by support_notify_http
create or replace function public.support_set_function_config(p_url text, p_secret text)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  select set_config('app.support_email_url', p_url, false),
         set_config('app.support_email_secret', p_secret, false);
$$;

grant execute on function public.support_set_function_config(text,text) to authenticated;

create or replace function public.support_notify_http(payload jsonb,
  target_url text default current_setting('app.support_email_url', true),
  secret text default current_setting('app.support_email_secret', true))
returns void
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
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

grant execute on function public.support_notify_http(jsonb,text,text) to authenticated;

create or replace function public.support_sla_sweep()
returns void
language plpgsql
security definer
set search_path = public, cp, extensions, pg_temp
as $$
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

grant execute on function public.support_sla_sweep() to authenticated;

create or replace function public.support_auto_close_sweep(p_days int default 14)
returns void
language plpgsql
security definer
set search_path = public, cp, extensions, pg_temp
as $$
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

grant execute on function public.support_auto_close_sweep(int) to authenticated;

-- schedule cron jobs (idempotent)
select cron.unschedule('support_sla_sweep_5min') where exists (select 1 from cron.job where jobname = 'support_sla_sweep_5min');
select cron.unschedule('support_auto_close_daily') where exists (select 1 from cron.job where jobname = 'support_auto_close_daily');

select cron.schedule('support_sla_sweep_5min', '*/5 * * * *', $$select public.support_sla_sweep();$$);
select cron.schedule('support_auto_close_daily', '0 3 * * *', $$select public.support_auto_close_sweep(14);$$);
