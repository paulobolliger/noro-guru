-- Billing (plans, subscriptions, invoices) + Finance (ledger)

create table if not exists cp.plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  price_cents int4 not null,
  currency text not null default 'BRL',
  interval text not null default 'month',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cp.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  plan_id uuid not null references cp.plans(id) on delete restrict,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);
create index if not exists idx_cp_subs_tenant on cp.subscriptions(tenant_id);

create table if not exists cp.invoices (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references cp.subscriptions(id) on delete set null,
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  amount_cents int4 not null,
  currency text not null default 'BRL',
  status text not null default 'open',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  stripe_invoice_id text,
  created_at timestamptz not null default now()
);
create index if not exists idx_cp_invoices_tenant on cp.invoices(tenant_id);

-- Financeiro: plano de contas e lançamentos
create table if not exists cp.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  type text not null, -- asset, liability, revenue, expense, equity
  created_at timestamptz not null default now()
);

create table if not exists cp.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references cp.ledger_accounts(id) on delete restrict,
  tenant_id uuid references cp.tenants(id) on delete set null,
  amount_cents int4 not null, -- positivo para credit, negativo para debit (ou vice-versa conforme convenção)
  memo text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_cp_ledger_entries_account on cp.ledger_entries(account_id);

-- RLS (mínimo viável): authenticated pode ler; escrita faremos via server routes
alter table cp.plans enable row level security;
alter table cp.subscriptions enable row level security;
alter table cp.invoices enable row level security;
alter table cp.ledger_accounts enable row level security;
alter table cp.ledger_entries enable row level security;

do $$ begin
  execute 'drop policy if exists p_cp_plans_read on cp.plans';
  execute 'create policy p_cp_plans_read on cp.plans for select using (auth.role() = ''authenticated'')';
  execute 'drop policy if exists p_cp_subs_read on cp.subscriptions';
  execute 'create policy p_cp_subs_read on cp.subscriptions for select using (auth.role() = ''authenticated'')';
  execute 'drop policy if exists p_cp_invoices_read on cp.invoices';
  execute 'create policy p_cp_invoices_read on cp.invoices for select using (auth.role() = ''authenticated'')';
  execute 'drop policy if exists p_cp_ledger_accounts_read on cp.ledger_accounts';
  execute 'create policy p_cp_ledger_accounts_read on cp.ledger_accounts for select using (auth.role() = ''authenticated'')';
  execute 'drop policy if exists p_cp_ledger_entries_read on cp.ledger_entries';
  execute 'create policy p_cp_ledger_entries_read on cp.ledger_entries for select using (auth.role() = ''authenticated'')';
end $$;
