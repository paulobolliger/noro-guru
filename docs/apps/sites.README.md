# App Sites

App: `apps/sites`

Status: runtime de sites gerados. Manter como app separado e alinhar com o plano de dominios.

## Papel

`apps/sites` e o runtime publico dos sites gerados pela NORO.

Dominio principal:

```txt
sites.noro.guru
```

Wildcard atual na Cloudflare:

```txt
*.sites.noro.guru
```

## Responsabilidades

- Resolver sites publicados por subdominio ou dominio proprio.
- Renderizar paginas geradas usando `@noro/renderer`.
- Servir paginas publicas de agencias/tenants.
- Integrar com o modelo multi-tenant atual.

## Diretrizes

- Nao usar Supabase como direcao nova de dados.
- Alinhar persistencia com PostgreSQL/Drizzle.
- Seguir `docs/architecture/domains-cloudflare-dns-current-plan.md` para DNS.
- Seguir `docs/architecture/multi-tenant-current-model.md` para resolucao de tenant.

## Referencias

- `docs/architecture/current-state.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/architecture/supabase-residue-report.md`
