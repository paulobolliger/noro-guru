-- Minimal seeds for Control UI (idempotent-ish)
-- 1) Ensure main tenant 'noro'
insert into cp.tenants (name, slug, plan)
values ('NORO (Plataforma)', 'noro', 'pro')
on conflict (slug) do update set name = excluded.name;

-- 2) One contact for tenant 'noro'
with t as (
  select id from cp.tenants where slug = 'noro'
)
insert into cp.contacts (tenant_id, name, email, phone, role, is_primary)
select t.id, 'Contato NORO', 'contato@noro.guru', '+55 11 99999-0000', 'Admin', true
from t
where not exists (
  select 1 from cp.contacts c where c.tenant_id = t.id and c.is_primary = true
);

-- 3) One lead to visualize in UI
insert into cp.leads (organization_name, email, stage, source, value_cents)
select 'Empresa Seed', 'seed@noro.guru', 'novo', 'seed', 0
where not exists (
  select 1 from cp.leads where organization_name = 'Empresa Seed'
);

