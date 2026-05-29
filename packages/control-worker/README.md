# control-worker

Background worker do Control Plane, baseado em Graphile Worker.

Status: manter, mas tratar como infraestrutura em implementacao. As tasks atuais ainda sao placeholders.

## Papel

`packages/control-worker` deve executar tarefas assíncronas da plataforma NORO:

- notificacoes operacionais;
- verificacoes de SLA;
- automacoes de suporte;
- processamento futuro de eventos de billing, comunicacao e integracoes.

Ele pertence ao contexto `apps/control`/`admin.noro.guru`, nao ao portal tenant.

## Banco E Auth

Direcao oficial:

- PostgreSQL central via `DATABASE_URL`;
- Drizzle para schema e acesso de dados quando aplicavel;
- Logto como camada oficial de auth nos apps que acionam fluxos protegidos.

Supabase nao deve ser citado como requisito operacional novo. Qualquer uso remanescente deve ser tratado como legado/transicional conforme:

```txt
docs/architecture/data-auth-transition.md
docs/architecture/supabase-residue-report.md
supabase/FROZEN.md
```

## Variaveis

- `DATABASE_URL`: conexao PostgreSQL oficial.
- `WORKER_CONCURRENCY`: opcional, default 5.
- `WORKER_SCHEMA`: opcional, default `graphile_worker`.
- Provedor de email: configurar apenas quando a task de email for implementada no modelo vigente.

## Desenvolvimento Local

```bash
npm run --workspace control-worker dev
```

## Deploy

1. Build: `npm run --workspace control-worker build`.
2. Start: `npm run --workspace control-worker start`.
3. Configurar `DATABASE_URL` e variaveis de worker.
4. Manter pelo menos uma instancia ativa quando houver filas reais em producao.

## Tasks Atuais

- `support_notify_email`
- `support_sla_check`
- `support_ticket_auto_close`

As tasks ainda devem ser revisadas antes de assumir comportamento produtivo.
