-- Create public views for tables located in cp schema so PostgREST (Supabase) can expose them

create or replace view public.subscription_plans as
  select * from cp.subscription_plans;

-- You can add additional public views here if other pages expect plain 'public' tables
-- e.g. create or replace view public.tenants as select * from cp.tenants;
