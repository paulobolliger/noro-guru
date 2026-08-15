# App Portal

App: `apps/portal`

Status: a parte mais madura e consistente do monorepo — auth próprio funcional, dados reais via Drizzle, Asaas já implementado. Criado em 2026-08-14 (não existia README técnico antes; a visão de produto vive em `docs/apps/portal-vision.md`, que continua sendo a fonte pra decisões de escopo/roadmap de produto).

## Papel

`apps/portal` serve dois papéis no mesmo app, resolvidos por tenant via middleware:

1. **Vitrine pública da agência** — site institucional/comercial do tenant, captação de leads.
2. **Portal B2C do cliente final** — área autenticada do viajante (propostas, pagamentos, documentos, itinerário, mensagens, emergência).

Domínio (decisão do operador, 2026-08-14): `{tenant}.agencia.noro.guru` ou domínio próprio pago (`xyz.com.br`). O portal autenticado vive no mesmo domínio da vitrine, path `/cliente` hoje (troca de nome pra `/portal` é pendência leve, não crítica). **Não existe `portal.noro.guru` como host compartilhado** — cada tenant tem seu próprio host.

Isso é diferente do nível gratuito (`{tenant}.sites.noro.guru`, `apps/sites`), que é só o front de um site gerado, sem CRM/portal atrás.

## Stack

- Next.js App Router
- TypeScript
- `packages/db` (Drizzle) — banco alvo é o Postgres central da VPS (`noro_guru_db`); historicamente desenvolvido contra Neon, reconfirmar `DATABASE_URL` antes de tratar como pronto pra produção real (ver Fase 2 do roadmap de transição)
- Asaas (`AsaasProvider`) para pagamentos — já funcional, webhook idempotente
- Resend para magic link — **depreciado** (decisão de 2026-08-14: Brevo é o provedor de email oficial); trocar quando a Fase 2/4 do roadmap chegar aqui

## Auth

Magic link próprio via email (não Logto, não Supabase Auth), cookie `portal_session_id` HTTP-only. Completamente separado dos outros apps.

**Pendência de decisão** (Fase 3 do roadmap de transição): esse magic link continua sendo o mecanismo de auth do cliente final (Nível 2 do modelo Noro/tenant/cliente), ou migra pro Keycloak (realm `noro`, via grupos/Organizations por tenant)? Não presumir nenhuma das duas — decisão do operador ainda não tomada.

## Estado atual (auditoria de 2026-05-30, ainda válida em 2026-08-14 salvo indicação contrária)

| Rota | Estado |
|---|---|
| `/` (dashboard) | Funcional — countdown, última proposta, cobrança pendente, atalhos |
| `/propostas` | Funcional |
| `/pagamentos` | Funcional — QR Pix, boleto, cartão, parcelas via Asaas |
| `/documentos` | Funcional — signed URL Supabase Storage (residual — avaliar migração de storage junto com o resto do Supabase) |
| `/itinerario`, `/mensagens`, `/emergencia` | Implementadas na Sprint Portal Fase 1B — **verificar se já foram commitadas**, a auditoria de 2026-05-30 registrou como pendente de commit |
| `/login` | Magic link via Resend (trocar por Brevo) |
| `/auth/verify`, `/auth/signout` | Fluxo de auth do magic link |
| `/proposta/[token]` | Pública, visualização + aceite inline |
| `/api/webhooks/asaas` | Idempotente |

## Diretriz

- Middleware resolve tenant por subdomínio/domínio customizado antes de qualquer render — não usar parâmetro de URL como autoridade de tenant.
- Não criar novo uso de Supabase (client ou Storage) — preferir Drizzle/Postgres central e um provider de storage a definir (Cloudflare R2 é candidato natural, já em uso via `cdn.noro.guru`).
- Não assumir Neon como banco de produção — confirmar `DATABASE_URL` aponta pro Postgres central da VPS.

## Referências

- `docs/apps/portal-vision.md` — visão de produto, fases futuras, histórico de sprints
- `docs/architecture/current-state.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/architecture/data-auth-transition.md`
- `C:\Users\paulo\0-dev\02-aplicacoes\000 norotec admin\coolify\noro-guru-transition-roadmap.md` (fora deste repo)

## Próximos Passos

1. Confirmar se a Sprint Portal Fase 1B (itinerário, mensagens, emergência) já foi commitada; se não, commitar antes de qualquer outra mudança nesses arquivos.
2. Renomear `/cliente` para `/portal` (leve, cosmético).
3. Confirmar `DATABASE_URL` de produção aponta pro Postgres central da VPS, não Neon.
4. Decidir Nível 2 do Keycloak (migrar magic link ou manter).
5. Trocar Resend por Brevo no envio do magic link.
6. Definir provider de storage definitivo pra substituir Supabase Storage em `/documentos`.
