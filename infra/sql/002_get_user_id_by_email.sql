-- 002_get_user_id_by_email.sql
-- Função utilitária para obter o ID do usuário pelo e-mail (tabela do Auth do Supabase)
create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language sql
stable
as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(p_email)
  limit 1;
$$;

