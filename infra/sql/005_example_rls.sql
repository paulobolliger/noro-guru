-- 005_example_rls.sql
-- Exemplo: RLS numa tabela de um schema de tenant (ex.: tenant_acme.contacts)
-- Requer que o JWT inclua claim 'email' e a app valide o tenant por subdomínio/caminho.
-- Ajuste conforme sua tabela e vínculo de usuário.

-- enable RLS
-- alter table tenant_acme.contacts enable row level security;

-- política básica permitindo apenas usuários autenticados
-- create policy contacts_authenticated on tenant_acme.contacts
--   for select
--   to authenticated
--   using (true);

-- Para writes, crie políticas adicionais (insert/update/delete) conforme regra de negócio.

