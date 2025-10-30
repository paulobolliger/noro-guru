# Support module roadmap

## Implementado nesta fase
- API `/api/support/*` integrada ao Supabase com Edge Function para e-mails.
- Inbox `/control/support` com filtros, criação de ticket e ligação ao detalhe.
- Detalhe `/control/support/[id]` com atualização de status/prioridade e respostas.
- Cron jobs via `pg_cron` (`support_sla_sweep`, `support_auto_close_sweep`).

## Pendentes para /web
- Criar `/web/support` com formulário público ou autenticado para abertura de tickets.
- Permitir anexos (Supabase Storage) e campos customizados/roteamento por produto.
- Conectar confirmação por e-mail para o solicitante (Edge Function já suporta).

## Pendentes para /core (tenants)
- Expor inbox simplificada para tenants (`/core/support`), respeitando `tenant_id` e roles.
- Permitir comentários internos entre tenant e equipe NORO.
- Painel de métricas de tickets por tenant (volume, SLA, satisfação).

## Observações operacionais
- Configurar `SUPPORT_FUNCTION_SECRET` e `SERVICE_ROLE_KEY` sempre que clonar o projeto.
- Verificar `supabase/migrations/20251029131000_support_cron.sql` em novos ambientes.
- Considerar logs adicionais (por exemplo `support_notifications_log`) para auditoria futura.
