drop policy "p_cp_leads_owner" on "cp"."leads";

drop policy "p_cp_leads_tenant_read" on "cp"."leads";

revoke select on table "cp"."api_key_logs" from "anon";

revoke select on table "cp"."api_key_logs" from "authenticated";

revoke select on table "cp"."api_key_logs" from "service_role";

revoke select on table "cp"."api_keys" from "anon";

revoke select on table "cp"."api_keys" from "authenticated";

revoke select on table "cp"."api_keys" from "service_role";

revoke select on table "cp"."billing_events" from "anon";

revoke select on table "cp"."billing_events" from "authenticated";

revoke select on table "cp"."billing_events" from "service_role";

revoke select on table "cp"."contacts" from "anon";

revoke select on table "cp"."contacts" from "authenticated";

revoke select on table "cp"."contacts" from "service_role";

revoke select on table "cp"."domains" from "anon";

revoke select on table "cp"."domains" from "authenticated";

revoke select on table "cp"."domains" from "service_role";

revoke select on table "cp"."invoices" from "anon";

revoke select on table "cp"."invoices" from "authenticated";

revoke select on table "cp"."invoices" from "service_role";

revoke select on table "cp"."leads" from "anon";

revoke select on table "cp"."leads" from "authenticated";

revoke select on table "cp"."leads" from "service_role";

revoke select on table "cp"."ledger_accounts" from "anon";

revoke select on table "cp"."ledger_accounts" from "authenticated";

revoke select on table "cp"."ledger_accounts" from "service_role";

revoke select on table "cp"."ledger_entries" from "anon";

revoke select on table "cp"."ledger_entries" from "authenticated";

revoke select on table "cp"."ledger_entries" from "service_role";

revoke select on table "cp"."modules_registry" from "anon";

revoke select on table "cp"."modules_registry" from "authenticated";

revoke select on table "cp"."modules_registry" from "service_role";

revoke select on table "cp"."notes" from "anon";

revoke select on table "cp"."notes" from "authenticated";

revoke select on table "cp"."notes" from "service_role";

revoke select on table "cp"."payments" from "anon";

revoke select on table "cp"."payments" from "authenticated";

revoke select on table "cp"."payments" from "service_role";

revoke select on table "cp"."plan_features" from "anon";

revoke select on table "cp"."plan_features" from "authenticated";

revoke select on table "cp"."plan_features" from "service_role";

revoke select on table "cp"."plans" from "anon";

revoke select on table "cp"."plans" from "authenticated";

revoke select on table "cp"."plans" from "service_role";

revoke select on table "cp"."subscriptions" from "anon";

revoke select on table "cp"."subscriptions" from "authenticated";

revoke select on table "cp"."subscriptions" from "service_role";

revoke select on table "cp"."system_events" from "anon";

revoke select on table "cp"."system_events" from "authenticated";

revoke select on table "cp"."system_events" from "service_role";

revoke select on table "cp"."tasks" from "anon";

revoke select on table "cp"."tasks" from "authenticated";

revoke select on table "cp"."tasks" from "service_role";

revoke select on table "cp"."tenant_modules" from "anon";

revoke select on table "cp"."tenant_modules" from "authenticated";

revoke select on table "cp"."tenant_modules" from "service_role";

revoke select on table "cp"."tenant_plan" from "anon";

revoke select on table "cp"."tenant_plan" from "authenticated";

revoke select on table "cp"."tenant_plan" from "service_role";

revoke select on table "cp"."tenant_settings" from "anon";

revoke select on table "cp"."tenant_settings" from "authenticated";

revoke select on table "cp"."tenant_settings" from "service_role";

revoke select on table "cp"."tenants" from "anon";

revoke insert on table "cp"."tenants" from "authenticated";

revoke select on table "cp"."tenants" from "authenticated";

revoke update on table "cp"."tenants" from "authenticated";

revoke select on table "cp"."tenants" from "service_role";

revoke select on table "cp"."usage_counters" from "anon";

revoke select on table "cp"."usage_counters" from "authenticated";

revoke select on table "cp"."usage_counters" from "service_role";

revoke select on table "cp"."user_tenant_roles" from "anon";

revoke select on table "cp"."user_tenant_roles" from "authenticated";

revoke select on table "cp"."user_tenant_roles" from "service_role";

revoke select on table "cp"."webhooks" from "anon";

revoke select on table "cp"."webhooks" from "authenticated";

revoke select on table "cp"."webhooks" from "service_role";

drop view if exists "cp"."v_api_key_usage_daily";

create table "cp"."lead_activity" (
    "id" uuid not null default gen_random_uuid(),
    "lead_id" uuid not null,
    "actor_id" uuid,
    "action" text not null,
    "details" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
);


alter table "cp"."lead_activity" enable row level security;

create table "cp"."lead_stages" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "slug" text not null,
    "label" text not null,
    "ord" smallint not null default 0,
    "is_won" boolean not null default false,
    "is_lost" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "cp"."lead_stages" enable row level security;

create table "cp"."webhook_logs" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "source" text,
    "event" text,
    "status" text,
    "payload" jsonb,
    "response" jsonb,
    "created_at" timestamp with time zone default now()
);


alter table "cp"."webhook_logs" enable row level security;

alter table "cp"."api_keys" add column "key_hash" text;

alter table "cp"."leads" add column "capture_channel" text default 'web'::text;

alter table "cp"."leads" add column "consent" boolean default false;

alter table "cp"."leads" add column "page_url" text;

alter table "cp"."leads" add column "referrer" text;

alter table "cp"."leads" add column "tags" text[] default '{}'::text[];

alter table "cp"."leads" add column "utm_campaign" text;

alter table "cp"."leads" add column "utm_content" text;

alter table "cp"."leads" add column "utm_medium" text;

alter table "cp"."leads" add column "utm_source" text;

alter table "cp"."leads" add column "utm_term" text;

CREATE INDEX idx_cp_domains_default ON cp.domains USING btree (tenant_id, is_default);

CREATE INDEX idx_cp_domains_tenant ON cp.domains USING btree (tenant_id);

CREATE INDEX idx_cp_leads_owner ON cp.leads USING btree (owner_id);

CREATE INDEX idx_cp_webhook_logs_created ON cp.webhook_logs USING btree (created_at DESC);

CREATE INDEX idx_cp_webhook_logs_event ON cp.webhook_logs USING btree (event);

CREATE INDEX idx_cp_webhook_logs_tenant ON cp.webhook_logs USING btree (tenant_id);

CREATE INDEX idx_leads_tags_gin ON cp.leads USING gin (tags);

CREATE INDEX idx_leads_tenant_created ON cp.leads USING btree (tenant_id, created_at);

CREATE INDEX idx_leads_tenant_email ON cp.leads USING btree (tenant_id, email);

CREATE INDEX idx_leads_tenant_owner ON cp.leads USING btree (tenant_id, owner_id);

CREATE INDEX idx_leads_tenant_stage ON cp.leads USING btree (tenant_id, stage);

CREATE UNIQUE INDEX lead_activity_pkey ON cp.lead_activity USING btree (id);

CREATE UNIQUE INDEX lead_stages_pkey ON cp.lead_stages USING btree (id);

CREATE UNIQUE INDEX lead_stages_tenant_id_slug_key ON cp.lead_stages USING btree (tenant_id, slug);

CREATE UNIQUE INDEX ux_cp_api_keys_key_hash ON cp.api_keys USING btree (key_hash);

CREATE UNIQUE INDEX webhook_logs_pkey ON cp.webhook_logs USING btree (id);

alter table "cp"."lead_activity" add constraint "lead_activity_pkey" PRIMARY KEY using index "lead_activity_pkey";

alter table "cp"."lead_stages" add constraint "lead_stages_pkey" PRIMARY KEY using index "lead_stages_pkey";

alter table "cp"."webhook_logs" add constraint "webhook_logs_pkey" PRIMARY KEY using index "webhook_logs_pkey";

alter table "cp"."billing_events" add constraint "billing_events_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE not valid;

alter table "cp"."billing_events" validate constraint "billing_events_tenant_fkey";

alter table "cp"."lead_activity" add constraint "lead_activity_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES cp.leads(id) ON DELETE CASCADE not valid;

alter table "cp"."lead_activity" validate constraint "lead_activity_lead_id_fkey";

alter table "cp"."lead_stages" add constraint "lead_stages_tenant_id_slug_key" UNIQUE using index "lead_stages_tenant_id_slug_key";

alter table "cp"."payments" add constraint "payments_billing_event_fkey" FOREIGN KEY (billing_event_id) REFERENCES cp.billing_events(id) ON DELETE CASCADE not valid;

alter table "cp"."payments" validate constraint "payments_billing_event_fkey";

alter table "cp"."plan_features" add constraint "plan_features_plan_fkey" FOREIGN KEY (plan_id) REFERENCES cp.plans(id) ON DELETE CASCADE not valid;

alter table "cp"."plan_features" validate constraint "plan_features_plan_fkey";

alter table "cp"."system_events" add constraint "system_events_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE SET NULL not valid;

alter table "cp"."system_events" validate constraint "system_events_tenant_fkey";

alter table "cp"."tenant_modules" add constraint "tenant_modules_module_fkey" FOREIGN KEY (module_id) REFERENCES cp.modules_registry(id) ON DELETE RESTRICT not valid;

alter table "cp"."tenant_modules" validate constraint "tenant_modules_module_fkey";

alter table "cp"."tenant_modules" add constraint "tenant_modules_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE not valid;

alter table "cp"."tenant_modules" validate constraint "tenant_modules_tenant_fkey";

alter table "cp"."tenant_plan" add constraint "tenant_plan_plan_fkey" FOREIGN KEY (plan_id) REFERENCES cp.plans(id) ON DELETE RESTRICT not valid;

alter table "cp"."tenant_plan" validate constraint "tenant_plan_plan_fkey";

alter table "cp"."tenant_plan" add constraint "tenant_plan_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE not valid;

alter table "cp"."tenant_plan" validate constraint "tenant_plan_tenant_fkey";

alter table "cp"."tenant_settings" add constraint "tenant_settings_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE not valid;

alter table "cp"."tenant_settings" validate constraint "tenant_settings_tenant_fkey";

alter table "cp"."usage_counters" add constraint "usage_counters_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE not valid;

alter table "cp"."usage_counters" validate constraint "usage_counters_tenant_fkey";

alter table "cp"."user_tenant_roles" add constraint "user_tenant_roles_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE not valid;

alter table "cp"."user_tenant_roles" validate constraint "user_tenant_roles_tenant_fkey";

alter table "cp"."user_tenant_roles" add constraint "user_tenant_roles_user_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "cp"."user_tenant_roles" validate constraint "user_tenant_roles_user_fkey";

alter table "cp"."webhooks" add constraint "webhooks_tenant_fkey" FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE SET NULL not valid;

alter table "cp"."webhooks" validate constraint "webhooks_tenant_fkey";

set check_function_bodies = off;

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

CREATE OR REPLACE FUNCTION cp.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end $function$
;

create or replace view "cp"."v_api_key_usage_daily" as  SELECT date_trunc('day'::text, created_at) AS day,
    tenant_id,
    count(*) AS calls
   FROM cp.api_key_logs
  GROUP BY (date_trunc('day'::text, created_at)), tenant_id;


create or replace view "cp"."v_users" as  SELECT u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    (COALESCE(m.tenants_count, (0)::bigint))::integer AS tenants_count
   FROM (auth.users u
     LEFT JOIN ( SELECT user_tenant_roles.user_id,
            count(*) AS tenants_count
           FROM cp.user_tenant_roles
          GROUP BY user_tenant_roles.user_id) m ON ((m.user_id = u.id)));


create policy "control_read_api_key_logs"
on "cp"."api_key_logs"
as permissive
for select
to authenticated
using (true);


create policy "control_read_api_keys"
on "cp"."api_keys"
as permissive
for select
to authenticated
using (true);


create policy "control_read_domains"
on "cp"."domains"
as permissive
for select
to authenticated
using (true);


create policy "control_read_invoices"
on "cp"."invoices"
as permissive
for select
to authenticated
using (true);


create policy "p_lead_activity_insert"
on "cp"."lead_activity"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM cp.leads l
  WHERE ((l.id = lead_activity.lead_id) AND cp.is_member_of_tenant(auth.uid(), l.tenant_id)))));


create policy "p_lead_activity_select"
on "cp"."lead_activity"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM cp.leads l
  WHERE ((l.id = lead_activity.lead_id) AND cp.is_member_of_tenant(auth.uid(), l.tenant_id)))));


create policy "p_lead_stages_modify"
on "cp"."lead_stages"
as permissive
for all
to authenticated
using (cp.is_member_of_tenant(auth.uid(), tenant_id))
with check (cp.is_member_of_tenant(auth.uid(), tenant_id));


create policy "p_lead_stages_select"
on "cp"."lead_stages"
as permissive
for select
to authenticated
using (cp.is_member_of_tenant(auth.uid(), tenant_id));


create policy "control_read_leads"
on "cp"."leads"
as permissive
for select
to authenticated
using (true);


create policy "leads_insert_auth"
on "cp"."leads"
as permissive
for insert
to authenticated
with check (true);


create policy "leads_insert_public"
on "cp"."leads"
as permissive
for insert
to anon
with check (true);


create policy "leads_select_all"
on "cp"."leads"
as permissive
for select
to authenticated
using (true);


create policy "leads_update_owner"
on "cp"."leads"
as permissive
for update
to authenticated
using ((owner_id = auth.uid()))
with check ((owner_id = auth.uid()));


create policy "control_read_ledger_accounts"
on "cp"."ledger_accounts"
as permissive
for select
to authenticated
using (true);


create policy "control_read_ledger_entries"
on "cp"."ledger_entries"
as permissive
for select
to authenticated
using (true);


create policy "control_read_tenants"
on "cp"."tenants"
as permissive
for select
to authenticated
using (true);


create policy "control_read_webhook_logs"
on "cp"."webhook_logs"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER trg_cp_leads_set_owner BEFORE INSERT ON cp.leads FOR EACH ROW EXECUTE FUNCTION cp.set_owner_id();

CREATE TRIGGER trg_cp_leads_set_owner_default BEFORE INSERT ON cp.leads FOR EACH ROW EXECUTE FUNCTION cp.tg_set_owner_default();

CREATE TRIGGER trg_cp_leads_set_updated_at BEFORE UPDATE ON cp.leads FOR EACH ROW EXECUTE FUNCTION cp.tg_set_updated_at();


revoke delete on table "public"."noro_audit_log" from "anon";

revoke insert on table "public"."noro_audit_log" from "anon";

revoke references on table "public"."noro_audit_log" from "anon";

revoke select on table "public"."noro_audit_log" from "anon";

revoke trigger on table "public"."noro_audit_log" from "anon";

revoke truncate on table "public"."noro_audit_log" from "anon";

revoke update on table "public"."noro_audit_log" from "anon";

revoke delete on table "public"."noro_audit_log" from "authenticated";

revoke insert on table "public"."noro_audit_log" from "authenticated";

revoke references on table "public"."noro_audit_log" from "authenticated";

revoke select on table "public"."noro_audit_log" from "authenticated";

revoke trigger on table "public"."noro_audit_log" from "authenticated";

revoke truncate on table "public"."noro_audit_log" from "authenticated";

revoke update on table "public"."noro_audit_log" from "authenticated";

revoke delete on table "public"."noro_audit_log" from "service_role";

revoke insert on table "public"."noro_audit_log" from "service_role";

revoke references on table "public"."noro_audit_log" from "service_role";

revoke select on table "public"."noro_audit_log" from "service_role";

revoke trigger on table "public"."noro_audit_log" from "service_role";

revoke truncate on table "public"."noro_audit_log" from "service_role";

revoke update on table "public"."noro_audit_log" from "service_role";

revoke delete on table "public"."noro_campanhas" from "anon";

revoke insert on table "public"."noro_campanhas" from "anon";

revoke references on table "public"."noro_campanhas" from "anon";

revoke select on table "public"."noro_campanhas" from "anon";

revoke trigger on table "public"."noro_campanhas" from "anon";

revoke truncate on table "public"."noro_campanhas" from "anon";

revoke update on table "public"."noro_campanhas" from "anon";

revoke delete on table "public"."noro_campanhas" from "authenticated";

revoke insert on table "public"."noro_campanhas" from "authenticated";

revoke references on table "public"."noro_campanhas" from "authenticated";

revoke select on table "public"."noro_campanhas" from "authenticated";

revoke trigger on table "public"."noro_campanhas" from "authenticated";

revoke truncate on table "public"."noro_campanhas" from "authenticated";

revoke update on table "public"."noro_campanhas" from "authenticated";

revoke delete on table "public"."noro_campanhas" from "service_role";

revoke insert on table "public"."noro_campanhas" from "service_role";

revoke references on table "public"."noro_campanhas" from "service_role";

revoke select on table "public"."noro_campanhas" from "service_role";

revoke trigger on table "public"."noro_campanhas" from "service_role";

revoke truncate on table "public"."noro_campanhas" from "service_role";

revoke update on table "public"."noro_campanhas" from "service_role";

revoke delete on table "public"."noro_clientes" from "anon";

revoke insert on table "public"."noro_clientes" from "anon";

revoke references on table "public"."noro_clientes" from "anon";

revoke select on table "public"."noro_clientes" from "anon";

revoke trigger on table "public"."noro_clientes" from "anon";

revoke truncate on table "public"."noro_clientes" from "anon";

revoke update on table "public"."noro_clientes" from "anon";

revoke delete on table "public"."noro_clientes" from "authenticated";

revoke insert on table "public"."noro_clientes" from "authenticated";

revoke references on table "public"."noro_clientes" from "authenticated";

revoke select on table "public"."noro_clientes" from "authenticated";

revoke trigger on table "public"."noro_clientes" from "authenticated";

revoke truncate on table "public"."noro_clientes" from "authenticated";

revoke update on table "public"."noro_clientes" from "authenticated";

revoke delete on table "public"."noro_clientes" from "service_role";

revoke insert on table "public"."noro_clientes" from "service_role";

revoke references on table "public"."noro_clientes" from "service_role";

revoke select on table "public"."noro_clientes" from "service_role";

revoke trigger on table "public"."noro_clientes" from "service_role";

revoke truncate on table "public"."noro_clientes" from "service_role";

revoke update on table "public"."noro_clientes" from "service_role";

revoke delete on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke insert on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke references on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke select on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke trigger on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke truncate on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke update on table "public"."noro_clientes_contatos_emergencia" from "anon";

revoke delete on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke insert on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke references on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke select on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke trigger on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke truncate on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke update on table "public"."noro_clientes_contatos_emergencia" from "authenticated";

revoke delete on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke insert on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke references on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke select on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke trigger on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke truncate on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke update on table "public"."noro_clientes_contatos_emergencia" from "service_role";

revoke delete on table "public"."noro_clientes_documentos" from "anon";

revoke insert on table "public"."noro_clientes_documentos" from "anon";

revoke references on table "public"."noro_clientes_documentos" from "anon";

revoke select on table "public"."noro_clientes_documentos" from "anon";

revoke trigger on table "public"."noro_clientes_documentos" from "anon";

revoke truncate on table "public"."noro_clientes_documentos" from "anon";

revoke update on table "public"."noro_clientes_documentos" from "anon";

revoke delete on table "public"."noro_clientes_documentos" from "authenticated";

revoke insert on table "public"."noro_clientes_documentos" from "authenticated";

revoke references on table "public"."noro_clientes_documentos" from "authenticated";

revoke select on table "public"."noro_clientes_documentos" from "authenticated";

revoke trigger on table "public"."noro_clientes_documentos" from "authenticated";

revoke truncate on table "public"."noro_clientes_documentos" from "authenticated";

revoke update on table "public"."noro_clientes_documentos" from "authenticated";

revoke delete on table "public"."noro_clientes_documentos" from "service_role";

revoke insert on table "public"."noro_clientes_documentos" from "service_role";

revoke references on table "public"."noro_clientes_documentos" from "service_role";

revoke select on table "public"."noro_clientes_documentos" from "service_role";

revoke trigger on table "public"."noro_clientes_documentos" from "service_role";

revoke truncate on table "public"."noro_clientes_documentos" from "service_role";

revoke update on table "public"."noro_clientes_documentos" from "service_role";

revoke delete on table "public"."noro_clientes_enderecos" from "anon";

revoke insert on table "public"."noro_clientes_enderecos" from "anon";

revoke references on table "public"."noro_clientes_enderecos" from "anon";

revoke select on table "public"."noro_clientes_enderecos" from "anon";

revoke trigger on table "public"."noro_clientes_enderecos" from "anon";

revoke truncate on table "public"."noro_clientes_enderecos" from "anon";

revoke update on table "public"."noro_clientes_enderecos" from "anon";

revoke delete on table "public"."noro_clientes_enderecos" from "authenticated";

revoke insert on table "public"."noro_clientes_enderecos" from "authenticated";

revoke references on table "public"."noro_clientes_enderecos" from "authenticated";

revoke select on table "public"."noro_clientes_enderecos" from "authenticated";

revoke trigger on table "public"."noro_clientes_enderecos" from "authenticated";

revoke truncate on table "public"."noro_clientes_enderecos" from "authenticated";

revoke update on table "public"."noro_clientes_enderecos" from "authenticated";

revoke delete on table "public"."noro_clientes_enderecos" from "service_role";

revoke insert on table "public"."noro_clientes_enderecos" from "service_role";

revoke references on table "public"."noro_clientes_enderecos" from "service_role";

revoke select on table "public"."noro_clientes_enderecos" from "service_role";

revoke trigger on table "public"."noro_clientes_enderecos" from "service_role";

revoke truncate on table "public"."noro_clientes_enderecos" from "service_role";

revoke update on table "public"."noro_clientes_enderecos" from "service_role";

revoke delete on table "public"."noro_clientes_milhas" from "anon";

revoke insert on table "public"."noro_clientes_milhas" from "anon";

revoke references on table "public"."noro_clientes_milhas" from "anon";

revoke select on table "public"."noro_clientes_milhas" from "anon";

revoke trigger on table "public"."noro_clientes_milhas" from "anon";

revoke truncate on table "public"."noro_clientes_milhas" from "anon";

revoke update on table "public"."noro_clientes_milhas" from "anon";

revoke delete on table "public"."noro_clientes_milhas" from "authenticated";

revoke insert on table "public"."noro_clientes_milhas" from "authenticated";

revoke references on table "public"."noro_clientes_milhas" from "authenticated";

revoke select on table "public"."noro_clientes_milhas" from "authenticated";

revoke trigger on table "public"."noro_clientes_milhas" from "authenticated";

revoke truncate on table "public"."noro_clientes_milhas" from "authenticated";

revoke update on table "public"."noro_clientes_milhas" from "authenticated";

revoke delete on table "public"."noro_clientes_milhas" from "service_role";

revoke insert on table "public"."noro_clientes_milhas" from "service_role";

revoke references on table "public"."noro_clientes_milhas" from "service_role";

revoke select on table "public"."noro_clientes_milhas" from "service_role";

revoke trigger on table "public"."noro_clientes_milhas" from "service_role";

revoke truncate on table "public"."noro_clientes_milhas" from "service_role";

revoke update on table "public"."noro_clientes_milhas" from "service_role";

revoke delete on table "public"."noro_clientes_preferencias" from "anon";

revoke insert on table "public"."noro_clientes_preferencias" from "anon";

revoke references on table "public"."noro_clientes_preferencias" from "anon";

revoke select on table "public"."noro_clientes_preferencias" from "anon";

revoke trigger on table "public"."noro_clientes_preferencias" from "anon";

revoke truncate on table "public"."noro_clientes_preferencias" from "anon";

revoke update on table "public"."noro_clientes_preferencias" from "anon";

revoke delete on table "public"."noro_clientes_preferencias" from "authenticated";

revoke insert on table "public"."noro_clientes_preferencias" from "authenticated";

revoke references on table "public"."noro_clientes_preferencias" from "authenticated";

revoke select on table "public"."noro_clientes_preferencias" from "authenticated";

revoke trigger on table "public"."noro_clientes_preferencias" from "authenticated";

revoke truncate on table "public"."noro_clientes_preferencias" from "authenticated";

revoke update on table "public"."noro_clientes_preferencias" from "authenticated";

revoke delete on table "public"."noro_clientes_preferencias" from "service_role";

revoke insert on table "public"."noro_clientes_preferencias" from "service_role";

revoke references on table "public"."noro_clientes_preferencias" from "service_role";

revoke select on table "public"."noro_clientes_preferencias" from "service_role";

revoke trigger on table "public"."noro_clientes_preferencias" from "service_role";

revoke truncate on table "public"."noro_clientes_preferencias" from "service_role";

revoke update on table "public"."noro_clientes_preferencias" from "service_role";

revoke delete on table "public"."noro_comissoes" from "anon";

revoke insert on table "public"."noro_comissoes" from "anon";

revoke references on table "public"."noro_comissoes" from "anon";

revoke select on table "public"."noro_comissoes" from "anon";

revoke trigger on table "public"."noro_comissoes" from "anon";

revoke truncate on table "public"."noro_comissoes" from "anon";

revoke update on table "public"."noro_comissoes" from "anon";

revoke delete on table "public"."noro_comissoes" from "authenticated";

revoke insert on table "public"."noro_comissoes" from "authenticated";

revoke references on table "public"."noro_comissoes" from "authenticated";

revoke select on table "public"."noro_comissoes" from "authenticated";

revoke trigger on table "public"."noro_comissoes" from "authenticated";

revoke truncate on table "public"."noro_comissoes" from "authenticated";

revoke update on table "public"."noro_comissoes" from "authenticated";

revoke delete on table "public"."noro_comissoes" from "service_role";

revoke insert on table "public"."noro_comissoes" from "service_role";

revoke references on table "public"."noro_comissoes" from "service_role";

revoke select on table "public"."noro_comissoes" from "service_role";

revoke trigger on table "public"."noro_comissoes" from "service_role";

revoke truncate on table "public"."noro_comissoes" from "service_role";

revoke update on table "public"."noro_comissoes" from "service_role";

revoke delete on table "public"."noro_comunicacao_templates" from "anon";

revoke insert on table "public"."noro_comunicacao_templates" from "anon";

revoke references on table "public"."noro_comunicacao_templates" from "anon";

revoke select on table "public"."noro_comunicacao_templates" from "anon";

revoke trigger on table "public"."noro_comunicacao_templates" from "anon";

revoke truncate on table "public"."noro_comunicacao_templates" from "anon";

revoke update on table "public"."noro_comunicacao_templates" from "anon";

revoke delete on table "public"."noro_comunicacao_templates" from "authenticated";

revoke insert on table "public"."noro_comunicacao_templates" from "authenticated";

revoke references on table "public"."noro_comunicacao_templates" from "authenticated";

revoke select on table "public"."noro_comunicacao_templates" from "authenticated";

revoke trigger on table "public"."noro_comunicacao_templates" from "authenticated";

revoke truncate on table "public"."noro_comunicacao_templates" from "authenticated";

revoke update on table "public"."noro_comunicacao_templates" from "authenticated";

revoke delete on table "public"."noro_comunicacao_templates" from "service_role";

revoke insert on table "public"."noro_comunicacao_templates" from "service_role";

revoke references on table "public"."noro_comunicacao_templates" from "service_role";

revoke select on table "public"."noro_comunicacao_templates" from "service_role";

revoke trigger on table "public"."noro_comunicacao_templates" from "service_role";

revoke truncate on table "public"."noro_comunicacao_templates" from "service_role";

revoke update on table "public"."noro_comunicacao_templates" from "service_role";

revoke delete on table "public"."noro_configuracoes" from "anon";

revoke insert on table "public"."noro_configuracoes" from "anon";

revoke references on table "public"."noro_configuracoes" from "anon";

revoke select on table "public"."noro_configuracoes" from "anon";

revoke trigger on table "public"."noro_configuracoes" from "anon";

revoke truncate on table "public"."noro_configuracoes" from "anon";

revoke update on table "public"."noro_configuracoes" from "anon";

revoke delete on table "public"."noro_configuracoes" from "authenticated";

revoke insert on table "public"."noro_configuracoes" from "authenticated";

revoke references on table "public"."noro_configuracoes" from "authenticated";

revoke select on table "public"."noro_configuracoes" from "authenticated";

revoke trigger on table "public"."noro_configuracoes" from "authenticated";

revoke truncate on table "public"."noro_configuracoes" from "authenticated";

revoke update on table "public"."noro_configuracoes" from "authenticated";

revoke delete on table "public"."noro_configuracoes" from "service_role";

revoke insert on table "public"."noro_configuracoes" from "service_role";

revoke references on table "public"."noro_configuracoes" from "service_role";

revoke select on table "public"."noro_configuracoes" from "service_role";

revoke trigger on table "public"."noro_configuracoes" from "service_role";

revoke truncate on table "public"."noro_configuracoes" from "service_role";

revoke update on table "public"."noro_configuracoes" from "service_role";

revoke delete on table "public"."noro_empresa" from "anon";

revoke insert on table "public"."noro_empresa" from "anon";

revoke references on table "public"."noro_empresa" from "anon";

revoke select on table "public"."noro_empresa" from "anon";

revoke trigger on table "public"."noro_empresa" from "anon";

revoke truncate on table "public"."noro_empresa" from "anon";

revoke update on table "public"."noro_empresa" from "anon";

revoke delete on table "public"."noro_empresa" from "authenticated";

revoke insert on table "public"."noro_empresa" from "authenticated";

revoke references on table "public"."noro_empresa" from "authenticated";

revoke select on table "public"."noro_empresa" from "authenticated";

revoke trigger on table "public"."noro_empresa" from "authenticated";

revoke truncate on table "public"."noro_empresa" from "authenticated";

revoke update on table "public"."noro_empresa" from "authenticated";

revoke delete on table "public"."noro_empresa" from "service_role";

revoke insert on table "public"."noro_empresa" from "service_role";

revoke references on table "public"."noro_empresa" from "service_role";

revoke select on table "public"."noro_empresa" from "service_role";

revoke trigger on table "public"."noro_empresa" from "service_role";

revoke truncate on table "public"."noro_empresa" from "service_role";

revoke update on table "public"."noro_empresa" from "service_role";

revoke delete on table "public"."noro_fornecedores" from "anon";

revoke insert on table "public"."noro_fornecedores" from "anon";

revoke references on table "public"."noro_fornecedores" from "anon";

revoke select on table "public"."noro_fornecedores" from "anon";

revoke trigger on table "public"."noro_fornecedores" from "anon";

revoke truncate on table "public"."noro_fornecedores" from "anon";

revoke update on table "public"."noro_fornecedores" from "anon";

revoke delete on table "public"."noro_fornecedores" from "authenticated";

revoke insert on table "public"."noro_fornecedores" from "authenticated";

revoke references on table "public"."noro_fornecedores" from "authenticated";

revoke select on table "public"."noro_fornecedores" from "authenticated";

revoke trigger on table "public"."noro_fornecedores" from "authenticated";

revoke truncate on table "public"."noro_fornecedores" from "authenticated";

revoke update on table "public"."noro_fornecedores" from "authenticated";

revoke delete on table "public"."noro_fornecedores" from "service_role";

revoke insert on table "public"."noro_fornecedores" from "service_role";

revoke references on table "public"."noro_fornecedores" from "service_role";

revoke select on table "public"."noro_fornecedores" from "service_role";

revoke trigger on table "public"."noro_fornecedores" from "service_role";

revoke truncate on table "public"."noro_fornecedores" from "service_role";

revoke update on table "public"."noro_fornecedores" from "service_role";

revoke delete on table "public"."noro_interacoes" from "anon";

revoke insert on table "public"."noro_interacoes" from "anon";

revoke references on table "public"."noro_interacoes" from "anon";

revoke select on table "public"."noro_interacoes" from "anon";

revoke trigger on table "public"."noro_interacoes" from "anon";

revoke truncate on table "public"."noro_interacoes" from "anon";

revoke update on table "public"."noro_interacoes" from "anon";

revoke delete on table "public"."noro_interacoes" from "authenticated";

revoke insert on table "public"."noro_interacoes" from "authenticated";

revoke references on table "public"."noro_interacoes" from "authenticated";

revoke select on table "public"."noro_interacoes" from "authenticated";

revoke trigger on table "public"."noro_interacoes" from "authenticated";

revoke truncate on table "public"."noro_interacoes" from "authenticated";

revoke update on table "public"."noro_interacoes" from "authenticated";

revoke delete on table "public"."noro_interacoes" from "service_role";

revoke insert on table "public"."noro_interacoes" from "service_role";

revoke references on table "public"."noro_interacoes" from "service_role";

revoke select on table "public"."noro_interacoes" from "service_role";

revoke trigger on table "public"."noro_interacoes" from "service_role";

revoke truncate on table "public"."noro_interacoes" from "service_role";

revoke update on table "public"."noro_interacoes" from "service_role";

revoke delete on table "public"."noro_leads" from "anon";

revoke insert on table "public"."noro_leads" from "anon";

revoke references on table "public"."noro_leads" from "anon";

revoke select on table "public"."noro_leads" from "anon";

revoke trigger on table "public"."noro_leads" from "anon";

revoke truncate on table "public"."noro_leads" from "anon";

revoke update on table "public"."noro_leads" from "anon";

revoke delete on table "public"."noro_leads" from "authenticated";

revoke insert on table "public"."noro_leads" from "authenticated";

revoke references on table "public"."noro_leads" from "authenticated";

revoke select on table "public"."noro_leads" from "authenticated";

revoke trigger on table "public"."noro_leads" from "authenticated";

revoke truncate on table "public"."noro_leads" from "authenticated";

revoke update on table "public"."noro_leads" from "authenticated";

revoke delete on table "public"."noro_leads" from "service_role";

revoke insert on table "public"."noro_leads" from "service_role";

revoke references on table "public"."noro_leads" from "service_role";

revoke select on table "public"."noro_leads" from "service_role";

revoke trigger on table "public"."noro_leads" from "service_role";

revoke truncate on table "public"."noro_leads" from "service_role";

revoke update on table "public"."noro_leads" from "service_role";

revoke delete on table "public"."noro_newsletter" from "anon";

revoke insert on table "public"."noro_newsletter" from "anon";

revoke references on table "public"."noro_newsletter" from "anon";

revoke select on table "public"."noro_newsletter" from "anon";

revoke trigger on table "public"."noro_newsletter" from "anon";

revoke truncate on table "public"."noro_newsletter" from "anon";

revoke update on table "public"."noro_newsletter" from "anon";

revoke delete on table "public"."noro_newsletter" from "authenticated";

revoke insert on table "public"."noro_newsletter" from "authenticated";

revoke references on table "public"."noro_newsletter" from "authenticated";

revoke select on table "public"."noro_newsletter" from "authenticated";

revoke trigger on table "public"."noro_newsletter" from "authenticated";

revoke truncate on table "public"."noro_newsletter" from "authenticated";

revoke update on table "public"."noro_newsletter" from "authenticated";

revoke delete on table "public"."noro_newsletter" from "service_role";

revoke insert on table "public"."noro_newsletter" from "service_role";

revoke references on table "public"."noro_newsletter" from "service_role";

revoke select on table "public"."noro_newsletter" from "service_role";

revoke trigger on table "public"."noro_newsletter" from "service_role";

revoke truncate on table "public"."noro_newsletter" from "service_role";

revoke update on table "public"."noro_newsletter" from "service_role";

revoke delete on table "public"."noro_notificacoes" from "anon";

revoke insert on table "public"."noro_notificacoes" from "anon";

revoke references on table "public"."noro_notificacoes" from "anon";

revoke select on table "public"."noro_notificacoes" from "anon";

revoke trigger on table "public"."noro_notificacoes" from "anon";

revoke truncate on table "public"."noro_notificacoes" from "anon";

revoke update on table "public"."noro_notificacoes" from "anon";

revoke delete on table "public"."noro_notificacoes" from "authenticated";

revoke insert on table "public"."noro_notificacoes" from "authenticated";

revoke references on table "public"."noro_notificacoes" from "authenticated";

revoke select on table "public"."noro_notificacoes" from "authenticated";

revoke trigger on table "public"."noro_notificacoes" from "authenticated";

revoke truncate on table "public"."noro_notificacoes" from "authenticated";

revoke update on table "public"."noro_notificacoes" from "authenticated";

revoke delete on table "public"."noro_notificacoes" from "service_role";

revoke insert on table "public"."noro_notificacoes" from "service_role";

revoke references on table "public"."noro_notificacoes" from "service_role";

revoke select on table "public"."noro_notificacoes" from "service_role";

revoke trigger on table "public"."noro_notificacoes" from "service_role";

revoke truncate on table "public"."noro_notificacoes" from "service_role";

revoke update on table "public"."noro_notificacoes" from "service_role";

revoke delete on table "public"."noro_orcamentos" from "anon";

revoke insert on table "public"."noro_orcamentos" from "anon";

revoke references on table "public"."noro_orcamentos" from "anon";

revoke select on table "public"."noro_orcamentos" from "anon";

revoke trigger on table "public"."noro_orcamentos" from "anon";

revoke truncate on table "public"."noro_orcamentos" from "anon";

revoke update on table "public"."noro_orcamentos" from "anon";

revoke delete on table "public"."noro_orcamentos" from "authenticated";

revoke insert on table "public"."noro_orcamentos" from "authenticated";

revoke references on table "public"."noro_orcamentos" from "authenticated";

revoke select on table "public"."noro_orcamentos" from "authenticated";

revoke trigger on table "public"."noro_orcamentos" from "authenticated";

revoke truncate on table "public"."noro_orcamentos" from "authenticated";

revoke update on table "public"."noro_orcamentos" from "authenticated";

revoke delete on table "public"."noro_orcamentos" from "service_role";

revoke insert on table "public"."noro_orcamentos" from "service_role";

revoke references on table "public"."noro_orcamentos" from "service_role";

revoke select on table "public"."noro_orcamentos" from "service_role";

revoke trigger on table "public"."noro_orcamentos" from "service_role";

revoke truncate on table "public"."noro_orcamentos" from "service_role";

revoke update on table "public"."noro_orcamentos" from "service_role";

revoke delete on table "public"."noro_orcamentos_itens" from "anon";

revoke insert on table "public"."noro_orcamentos_itens" from "anon";

revoke references on table "public"."noro_orcamentos_itens" from "anon";

revoke select on table "public"."noro_orcamentos_itens" from "anon";

revoke trigger on table "public"."noro_orcamentos_itens" from "anon";

revoke truncate on table "public"."noro_orcamentos_itens" from "anon";

revoke update on table "public"."noro_orcamentos_itens" from "anon";

revoke delete on table "public"."noro_orcamentos_itens" from "authenticated";

revoke insert on table "public"."noro_orcamentos_itens" from "authenticated";

revoke references on table "public"."noro_orcamentos_itens" from "authenticated";

revoke select on table "public"."noro_orcamentos_itens" from "authenticated";

revoke trigger on table "public"."noro_orcamentos_itens" from "authenticated";

revoke truncate on table "public"."noro_orcamentos_itens" from "authenticated";

revoke update on table "public"."noro_orcamentos_itens" from "authenticated";

revoke delete on table "public"."noro_orcamentos_itens" from "service_role";

revoke insert on table "public"."noro_orcamentos_itens" from "service_role";

revoke references on table "public"."noro_orcamentos_itens" from "service_role";

revoke select on table "public"."noro_orcamentos_itens" from "service_role";

revoke trigger on table "public"."noro_orcamentos_itens" from "service_role";

revoke truncate on table "public"."noro_orcamentos_itens" from "service_role";

revoke update on table "public"."noro_orcamentos_itens" from "service_role";

revoke delete on table "public"."noro_pedidos" from "anon";

revoke insert on table "public"."noro_pedidos" from "anon";

revoke references on table "public"."noro_pedidos" from "anon";

revoke select on table "public"."noro_pedidos" from "anon";

revoke trigger on table "public"."noro_pedidos" from "anon";

revoke truncate on table "public"."noro_pedidos" from "anon";

revoke update on table "public"."noro_pedidos" from "anon";

revoke delete on table "public"."noro_pedidos" from "authenticated";

revoke insert on table "public"."noro_pedidos" from "authenticated";

revoke references on table "public"."noro_pedidos" from "authenticated";

revoke select on table "public"."noro_pedidos" from "authenticated";

revoke trigger on table "public"."noro_pedidos" from "authenticated";

revoke truncate on table "public"."noro_pedidos" from "authenticated";

revoke update on table "public"."noro_pedidos" from "authenticated";

revoke delete on table "public"."noro_pedidos" from "service_role";

revoke insert on table "public"."noro_pedidos" from "service_role";

revoke references on table "public"."noro_pedidos" from "service_role";

revoke select on table "public"."noro_pedidos" from "service_role";

revoke trigger on table "public"."noro_pedidos" from "service_role";

revoke truncate on table "public"."noro_pedidos" from "service_role";

revoke update on table "public"."noro_pedidos" from "service_role";

revoke delete on table "public"."noro_pedidos_itens" from "anon";

revoke insert on table "public"."noro_pedidos_itens" from "anon";

revoke references on table "public"."noro_pedidos_itens" from "anon";

revoke select on table "public"."noro_pedidos_itens" from "anon";

revoke trigger on table "public"."noro_pedidos_itens" from "anon";

revoke truncate on table "public"."noro_pedidos_itens" from "anon";

revoke update on table "public"."noro_pedidos_itens" from "anon";

revoke delete on table "public"."noro_pedidos_itens" from "authenticated";

revoke insert on table "public"."noro_pedidos_itens" from "authenticated";

revoke references on table "public"."noro_pedidos_itens" from "authenticated";

revoke select on table "public"."noro_pedidos_itens" from "authenticated";

revoke trigger on table "public"."noro_pedidos_itens" from "authenticated";

revoke truncate on table "public"."noro_pedidos_itens" from "authenticated";

revoke update on table "public"."noro_pedidos_itens" from "authenticated";

revoke delete on table "public"."noro_pedidos_itens" from "service_role";

revoke insert on table "public"."noro_pedidos_itens" from "service_role";

revoke references on table "public"."noro_pedidos_itens" from "service_role";

revoke select on table "public"."noro_pedidos_itens" from "service_role";

revoke trigger on table "public"."noro_pedidos_itens" from "service_role";

revoke truncate on table "public"."noro_pedidos_itens" from "service_role";

revoke update on table "public"."noro_pedidos_itens" from "service_role";

revoke delete on table "public"."noro_pedidos_timeline" from "anon";

revoke insert on table "public"."noro_pedidos_timeline" from "anon";

revoke references on table "public"."noro_pedidos_timeline" from "anon";

revoke select on table "public"."noro_pedidos_timeline" from "anon";

revoke trigger on table "public"."noro_pedidos_timeline" from "anon";

revoke truncate on table "public"."noro_pedidos_timeline" from "anon";

revoke update on table "public"."noro_pedidos_timeline" from "anon";

revoke delete on table "public"."noro_pedidos_timeline" from "authenticated";

revoke insert on table "public"."noro_pedidos_timeline" from "authenticated";

revoke references on table "public"."noro_pedidos_timeline" from "authenticated";

revoke select on table "public"."noro_pedidos_timeline" from "authenticated";

revoke trigger on table "public"."noro_pedidos_timeline" from "authenticated";

revoke truncate on table "public"."noro_pedidos_timeline" from "authenticated";

revoke update on table "public"."noro_pedidos_timeline" from "authenticated";

revoke delete on table "public"."noro_pedidos_timeline" from "service_role";

revoke insert on table "public"."noro_pedidos_timeline" from "service_role";

revoke references on table "public"."noro_pedidos_timeline" from "service_role";

revoke select on table "public"."noro_pedidos_timeline" from "service_role";

revoke trigger on table "public"."noro_pedidos_timeline" from "service_role";

revoke truncate on table "public"."noro_pedidos_timeline" from "service_role";

revoke update on table "public"."noro_pedidos_timeline" from "service_role";

revoke delete on table "public"."noro_tarefas" from "anon";

revoke insert on table "public"."noro_tarefas" from "anon";

revoke references on table "public"."noro_tarefas" from "anon";

revoke select on table "public"."noro_tarefas" from "anon";

revoke trigger on table "public"."noro_tarefas" from "anon";

revoke truncate on table "public"."noro_tarefas" from "anon";

revoke update on table "public"."noro_tarefas" from "anon";

revoke delete on table "public"."noro_tarefas" from "authenticated";

revoke insert on table "public"."noro_tarefas" from "authenticated";

revoke references on table "public"."noro_tarefas" from "authenticated";

revoke select on table "public"."noro_tarefas" from "authenticated";

revoke trigger on table "public"."noro_tarefas" from "authenticated";

revoke truncate on table "public"."noro_tarefas" from "authenticated";

revoke update on table "public"."noro_tarefas" from "authenticated";

revoke delete on table "public"."noro_tarefas" from "service_role";

revoke insert on table "public"."noro_tarefas" from "service_role";

revoke references on table "public"."noro_tarefas" from "service_role";

revoke select on table "public"."noro_tarefas" from "service_role";

revoke trigger on table "public"."noro_tarefas" from "service_role";

revoke truncate on table "public"."noro_tarefas" from "service_role";

revoke update on table "public"."noro_tarefas" from "service_role";

revoke delete on table "public"."noro_transacoes" from "anon";

revoke insert on table "public"."noro_transacoes" from "anon";

revoke references on table "public"."noro_transacoes" from "anon";

revoke select on table "public"."noro_transacoes" from "anon";

revoke trigger on table "public"."noro_transacoes" from "anon";

revoke truncate on table "public"."noro_transacoes" from "anon";

revoke update on table "public"."noro_transacoes" from "anon";

revoke delete on table "public"."noro_transacoes" from "authenticated";

revoke insert on table "public"."noro_transacoes" from "authenticated";

revoke references on table "public"."noro_transacoes" from "authenticated";

revoke select on table "public"."noro_transacoes" from "authenticated";

revoke trigger on table "public"."noro_transacoes" from "authenticated";

revoke truncate on table "public"."noro_transacoes" from "authenticated";

revoke update on table "public"."noro_transacoes" from "authenticated";

revoke delete on table "public"."noro_transacoes" from "service_role";

revoke insert on table "public"."noro_transacoes" from "service_role";

revoke references on table "public"."noro_transacoes" from "service_role";

revoke select on table "public"."noro_transacoes" from "service_role";

revoke trigger on table "public"."noro_transacoes" from "service_role";

revoke truncate on table "public"."noro_transacoes" from "service_role";

revoke update on table "public"."noro_transacoes" from "service_role";

revoke delete on table "public"."noro_update_tokens" from "anon";

revoke insert on table "public"."noro_update_tokens" from "anon";

revoke references on table "public"."noro_update_tokens" from "anon";

revoke select on table "public"."noro_update_tokens" from "anon";

revoke trigger on table "public"."noro_update_tokens" from "anon";

revoke truncate on table "public"."noro_update_tokens" from "anon";

revoke update on table "public"."noro_update_tokens" from "anon";

revoke delete on table "public"."noro_update_tokens" from "authenticated";

revoke insert on table "public"."noro_update_tokens" from "authenticated";

revoke references on table "public"."noro_update_tokens" from "authenticated";

revoke select on table "public"."noro_update_tokens" from "authenticated";

revoke trigger on table "public"."noro_update_tokens" from "authenticated";

revoke truncate on table "public"."noro_update_tokens" from "authenticated";

revoke update on table "public"."noro_update_tokens" from "authenticated";

revoke delete on table "public"."noro_update_tokens" from "service_role";

revoke insert on table "public"."noro_update_tokens" from "service_role";

revoke references on table "public"."noro_update_tokens" from "service_role";

revoke select on table "public"."noro_update_tokens" from "service_role";

revoke trigger on table "public"."noro_update_tokens" from "service_role";

revoke truncate on table "public"."noro_update_tokens" from "service_role";

revoke update on table "public"."noro_update_tokens" from "service_role";

revoke delete on table "public"."noro_users" from "anon";

revoke insert on table "public"."noro_users" from "anon";

revoke references on table "public"."noro_users" from "anon";

revoke select on table "public"."noro_users" from "anon";

revoke trigger on table "public"."noro_users" from "anon";

revoke truncate on table "public"."noro_users" from "anon";

revoke update on table "public"."noro_users" from "anon";

revoke delete on table "public"."noro_users" from "authenticated";

revoke insert on table "public"."noro_users" from "authenticated";

revoke references on table "public"."noro_users" from "authenticated";

revoke select on table "public"."noro_users" from "authenticated";

revoke trigger on table "public"."noro_users" from "authenticated";

revoke truncate on table "public"."noro_users" from "authenticated";

revoke update on table "public"."noro_users" from "authenticated";

revoke delete on table "public"."noro_users" from "service_role";

revoke insert on table "public"."noro_users" from "service_role";

revoke references on table "public"."noro_users" from "service_role";

revoke select on table "public"."noro_users" from "service_role";

revoke trigger on table "public"."noro_users" from "service_role";

revoke truncate on table "public"."noro_users" from "service_role";

revoke update on table "public"."noro_users" from "service_role";

revoke delete on table "public"."visa_countries" from "anon";

revoke insert on table "public"."visa_countries" from "anon";

revoke references on table "public"."visa_countries" from "anon";

revoke select on table "public"."visa_countries" from "anon";

revoke trigger on table "public"."visa_countries" from "anon";

revoke truncate on table "public"."visa_countries" from "anon";

revoke update on table "public"."visa_countries" from "anon";

revoke delete on table "public"."visa_countries" from "authenticated";

revoke insert on table "public"."visa_countries" from "authenticated";

revoke references on table "public"."visa_countries" from "authenticated";

revoke select on table "public"."visa_countries" from "authenticated";

revoke trigger on table "public"."visa_countries" from "authenticated";

revoke truncate on table "public"."visa_countries" from "authenticated";

revoke update on table "public"."visa_countries" from "authenticated";

revoke delete on table "public"."visa_countries" from "service_role";

revoke insert on table "public"."visa_countries" from "service_role";

revoke references on table "public"."visa_countries" from "service_role";

revoke select on table "public"."visa_countries" from "service_role";

revoke trigger on table "public"."visa_countries" from "service_role";

revoke truncate on table "public"."visa_countries" from "service_role";

revoke update on table "public"."visa_countries" from "service_role";

revoke delete on table "public"."visa_overrides" from "anon";

revoke insert on table "public"."visa_overrides" from "anon";

revoke references on table "public"."visa_overrides" from "anon";

revoke select on table "public"."visa_overrides" from "anon";

revoke trigger on table "public"."visa_overrides" from "anon";

revoke truncate on table "public"."visa_overrides" from "anon";

revoke update on table "public"."visa_overrides" from "anon";

revoke delete on table "public"."visa_overrides" from "authenticated";

revoke insert on table "public"."visa_overrides" from "authenticated";

revoke references on table "public"."visa_overrides" from "authenticated";

revoke select on table "public"."visa_overrides" from "authenticated";

revoke trigger on table "public"."visa_overrides" from "authenticated";

revoke truncate on table "public"."visa_overrides" from "authenticated";

revoke update on table "public"."visa_overrides" from "authenticated";

revoke delete on table "public"."visa_overrides" from "service_role";

revoke insert on table "public"."visa_overrides" from "service_role";

revoke references on table "public"."visa_overrides" from "service_role";

revoke select on table "public"."visa_overrides" from "service_role";

revoke trigger on table "public"."visa_overrides" from "service_role";

revoke truncate on table "public"."visa_overrides" from "service_role";

revoke update on table "public"."visa_overrides" from "service_role";

revoke delete on table "public"."visa_requirements" from "anon";

revoke insert on table "public"."visa_requirements" from "anon";

revoke references on table "public"."visa_requirements" from "anon";

revoke select on table "public"."visa_requirements" from "anon";

revoke trigger on table "public"."visa_requirements" from "anon";

revoke truncate on table "public"."visa_requirements" from "anon";

revoke update on table "public"."visa_requirements" from "anon";

revoke delete on table "public"."visa_requirements" from "authenticated";

revoke insert on table "public"."visa_requirements" from "authenticated";

revoke references on table "public"."visa_requirements" from "authenticated";

revoke select on table "public"."visa_requirements" from "authenticated";

revoke trigger on table "public"."visa_requirements" from "authenticated";

revoke truncate on table "public"."visa_requirements" from "authenticated";

revoke update on table "public"."visa_requirements" from "authenticated";

revoke delete on table "public"."visa_requirements" from "service_role";

revoke insert on table "public"."visa_requirements" from "service_role";

revoke references on table "public"."visa_requirements" from "service_role";

revoke select on table "public"."visa_requirements" from "service_role";

revoke trigger on table "public"."visa_requirements" from "service_role";

revoke truncate on table "public"."visa_requirements" from "service_role";

revoke update on table "public"."visa_requirements" from "service_role";

revoke delete on table "public"."visa_sources" from "anon";

revoke insert on table "public"."visa_sources" from "anon";

revoke references on table "public"."visa_sources" from "anon";

revoke select on table "public"."visa_sources" from "anon";

revoke trigger on table "public"."visa_sources" from "anon";

revoke truncate on table "public"."visa_sources" from "anon";

revoke update on table "public"."visa_sources" from "anon";

revoke delete on table "public"."visa_sources" from "authenticated";

revoke insert on table "public"."visa_sources" from "authenticated";

revoke references on table "public"."visa_sources" from "authenticated";

revoke select on table "public"."visa_sources" from "authenticated";

revoke trigger on table "public"."visa_sources" from "authenticated";

revoke truncate on table "public"."visa_sources" from "authenticated";

revoke update on table "public"."visa_sources" from "authenticated";

revoke delete on table "public"."visa_sources" from "service_role";

revoke insert on table "public"."visa_sources" from "service_role";

revoke references on table "public"."visa_sources" from "service_role";

revoke select on table "public"."visa_sources" from "service_role";

revoke trigger on table "public"."visa_sources" from "service_role";

revoke truncate on table "public"."visa_sources" from "service_role";

revoke update on table "public"."visa_sources" from "service_role";

revoke delete on table "public"."visa_updates" from "anon";

revoke insert on table "public"."visa_updates" from "anon";

revoke references on table "public"."visa_updates" from "anon";

revoke select on table "public"."visa_updates" from "anon";

revoke trigger on table "public"."visa_updates" from "anon";

revoke truncate on table "public"."visa_updates" from "anon";

revoke update on table "public"."visa_updates" from "anon";

revoke delete on table "public"."visa_updates" from "authenticated";

revoke insert on table "public"."visa_updates" from "authenticated";

revoke references on table "public"."visa_updates" from "authenticated";

revoke select on table "public"."visa_updates" from "authenticated";

revoke trigger on table "public"."visa_updates" from "authenticated";

revoke truncate on table "public"."visa_updates" from "authenticated";

revoke update on table "public"."visa_updates" from "authenticated";

revoke delete on table "public"."visa_updates" from "service_role";

revoke insert on table "public"."visa_updates" from "service_role";

revoke references on table "public"."visa_updates" from "service_role";

revoke select on table "public"."visa_updates" from "service_role";

revoke trigger on table "public"."visa_updates" from "service_role";

revoke truncate on table "public"."visa_updates" from "service_role";

revoke update on table "public"."visa_updates" from "service_role";

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


create schema if not exists "staging_vistos";

create table "staging_vistos"."visa_info" (
    "id" uuid,
    "country" text,
    "country_code" text,
    "flag_emoji" text,
    "general_info" jsonb,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "region" text,
    "official_visa_link" text,
    "visa_types" jsonb,
    "required_documents" jsonb,
    "process_steps" jsonb,
    "approval_tips" jsonb,
    "health_info" jsonb,
    "security_info" jsonb,
    "last_verified" date,
    "data_source" text,
    "slug" text,
    "automation_status" text,
    "priority_level" integer,
    "meta_description" text,
    "og_image_url" text
);




