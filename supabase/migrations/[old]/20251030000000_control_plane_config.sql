create table if not exists control_plane_config (
  id bigint primary key default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  limites jsonb not null default '{
    "max_usuarios_por_tenant": 5,
    "max_leads_por_tenant": 100,
    "max_armazenamento_por_tenant": 1024,
    "max_requisicoes_api_por_dia": 1000
  }'::jsonb,
  instancia jsonb not null default '{
    "modo_manutencao": false,
    "versao_minima_cli": "1.0.0",
    "versao_atual_api": "1.0.0",
    "dominios_permitidos": []
  }'::jsonb,
  cache jsonb not null default '{
    "tempo_cache_api": 300,
    "cache_habilitado": true
  }'::jsonb,
  servicos jsonb not null default '{
    "api_publica_habilitada": true,
    "registro_publico_habilitado": true,
    "convites_habilitados": true,
    "oauth_habilitado": false
  }'::jsonb,
  recursos jsonb not null default '{
    "endpoints_desabilitados": [],
    "features_beta": [],
    "features_desativadas": []
  }'::jsonb,
  constraint control_plane_config_singleton check (id = 1)
);

-- Trigger para atualizar updated_at
create or replace function update_updated_at_control_plane_config()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on control_plane_config
  for each row
  execute function update_updated_at_control_plane_config();

-- Inserir configuração inicial se não existir
insert into control_plane_config (id)
values (1)
on conflict (id) do nothing;