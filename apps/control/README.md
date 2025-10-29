Control Plane (apps/control)

Visão
- Control Plane orquestra tenants/sistemas (Core), billing por serviços e governança. Não trata “roteiros” do website. Dados aqui são operacionais: usuários/admins do control, leads de serviço, tarefas, notificações e clientes para fluxos públicos (ex.: atualização cadastral).

Pré‑requisitos
- Supabase projeto do Control com Auth habilitado.
- Variáveis em apps/control/.env.local:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_URL (opcional; usa a pública como fallback)
  - NEXT_PUBLIC_CONTROL_URL (ex.: http://localhost:3007)
  - ALLOWED_ORIGINS (ex.: http://localhost:3007,http://localhost:3009)

Bootstrap do banco
1) No Supabase SQL Editor do projeto do Control, execute:
   - apps/control/db/bootstrap.sql
   - Antes de executar, ajuste o email na linha marcada (ADMIN_EMAIL) para promover o admin.

Seeds rápidos (alternativa)
- apps/control/db/seeds.sql promove admin, cria lead de serviço, tarefa, notificação e cliente + token de teste.

Rodando somente o Control
- Comando: `npm run dev:control`
- Acesso: `http://localhost:3007/admin`
  - Sem login → redirect para login
  - Com perfil admin (noro_users.role='admin') → layout protegido renderiza

Endpoints úteis (Control)
- `GET /api/forms/cliente/[token]` → retorna dados do cliente para formulário público
- `POST /api/forms/cliente/[token]` → atualiza dados do cliente e invalida token
- CORS controlado por `ALLOWED_ORIGINS`

Verificações SQL
- `SELECT public.get_dashboard_metrics(30);`
- `SELECT id,email FROM auth.users ORDER BY created_at DESC LIMIT 20;`
- `SELECT * FROM public.noro_users ORDER BY created_at DESC LIMIT 20;`
- `SELECT * FROM public.noro_notificacoes ORDER BY created_at DESC LIMIT 5;`
- `SELECT * FROM public.noro_update_tokens ORDER BY expires_at DESC LIMIT 1;`

Notas
- Warnings ENOWORKSPACES/EPERM em dev no Windows são benignos.
- Não altera o tenant/website (nomade.guru). O Control não depende de `nomade_roteiros`.
- Após estabilizar, gere tipos com o CLI do Supabase e preencha `packages/types/supabase.ts`.

