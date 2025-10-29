Control Plane – Setup Rápido

1) Variáveis de ambiente (apps/control/.env.local)
- NEXT_PUBLIC_SUPABASE_URL=...
- NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- SUPABASE_SERVICE_ROLE_KEY=...
- SUPABASE_URL=... (opcional; usa NEXT_PUBLIC_SUPABASE_URL como fallback)
- NEXT_PUBLIC_CONTROL_URL=http://localhost:3007
- ALLOWED_ORIGINS=http://localhost:3009,http://localhost:3007

2) Aplicar schema no Supabase
- Abra o Supabase SQL Editor e cole o conteúdo de apps/control/db/migrations/001_init_control.sql
- Execute e confirme que as tabelas e a função RPC foram criadas.

3) (Opcional) Gerar tipos do Supabase
- supabase gen types typescript --project-id <PROJECT_REF> --schema public,auth > packages/types/supabase.ts

4) Rodar apenas o Control
- Na raiz: npm run dev:control

5) Validar
- http://localhost:3007/admin → redireciona para login se não autenticado
- Após login, layout protegido carrega cards (get_dashboard_metrics) e notificações
- Testar formulário público: POST/GET /api/forms/cliente/[token]

Notas
- Não altera tenant/website (nomade.guru). Tabelas “nomade_roteiros” não são usadas aqui.
- CORS é controlado por ALLOWED_ORIGINS; ajuste conforme seu domínio.
