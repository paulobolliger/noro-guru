-- Enum para roles do control plane
create type control_plane_role as enum (
  'super_admin',
  'admin',
  'operador',
  'auditor',
  'readonly'
);

-- Enum para status do usuário
create type user_status as enum (
  'ativo',
  'inativo',
  'pendente',
  'bloqueado'
);

-- Enum para tipos de atividade
create type activity_type as enum (
  'login',
  'logout',
  'configuracao_alterada',
  'tenant_criado',
  'tenant_alterado',
  'usuario_criado',
  'usuario_alterado',
  'permissao_alterada',
  'api_key_criada',
  'webhook_configurado'
);

-- Tabela de usuários do control plane
create table if not exists control_plane_users (
  id uuid primary key default uuid_generate_v4(),
  nome text,
  email text not null unique,
  role control_plane_role not null default 'readonly',
  avatar_url text,
  ultimo_acesso timestamp with time zone,
  status user_status not null default 'pendente',
  two_factor_enabled boolean not null default false,
  permissoes jsonb not null default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de log de atividades
create table if not exists control_plane_user_activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references control_plane_users(id),
  tipo activity_type not null,
  descricao text not null,
  metadata jsonb not null default '{}',
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para atualizar updated_at
create or replace function update_updated_at_control_plane_users()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on control_plane_users
  for each row
  execute function update_updated_at_control_plane_users();

-- Inserir super admin inicial se não existir
insert into control_plane_users (
  email,
  role,
  status,
  nome
) values (
  'admin@noroguru.com',
  'super_admin',
  'ativo',
  'Super Admin'
) on conflict (email) do nothing;