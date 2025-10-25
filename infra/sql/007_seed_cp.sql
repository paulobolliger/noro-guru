-- 007_seed_cp.sql — seeds iniciais

insert into cp.plans (code, name, price_cents, currency, sort_order)
values
  ('starter','Starter', 0, 'BRL', 10),
  ('pro','Pro', 9900, 'BRL', 20),
  ('enterprise','Enterprise', 0, 'BRL', 30)
on conflict (code) do nothing;

insert into cp.plan_features (plan_id, key, value)
select p.id, f.key, f.value
from cp.plans p
cross join (values
  ('users.max','3'),
  ('automations.daily','100'),
  ('storage.gb','5'),
  ('ai.tokens.month','200k')
) as f(key, value)
where p.code = 'starter'
on conflict do nothing;

insert into cp.plan_features (plan_id, key, value)
select p.id, f.key, f.value
from cp.plans p
cross join (values
  ('users.max','10'),
  ('automations.daily','1000'),
  ('storage.gb','20'),
  ('ai.tokens.month','2M')
) as f(key, value)
where p.code = 'pro'
on conflict do nothing;

insert into cp.modules_registry (code, name, is_core)
values
  ('crm','CRM', true),
  ('sales','Vendas & Orçamentos', true),
  ('finance','Financeiro', true),
  ('projects','Projetos & Tarefas', false),
  ('docs','Documentos & Contratos', false),
  ('catalog','Catálogo & Fornecedores', false),
  ('ai','IA Assist', false),
  ('integrations','Integrações Externas', false)
on conflict (code) do nothing;
