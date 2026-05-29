# Multi-Tenant Current Model

Data de referencia: 2026-05-27

## 1. Objetivo

Este documento define o modelo multi-tenant atual/alvo da NORO.

Ele substitui `docs/multi-tenant-architecture.md` como referencia vigente. O documento antigo foi baseado em Supabase RLS e deve ser tratado apenas como historico.

## 2. Decisao Atual

| Tema | Direcao atual |
| --- | --- |
| Banco oficial | PostgreSQL via `DATABASE_URL` |
| Camada de dados | Drizzle em `packages/db` |
| Auth oficial | Logto em `packages/auth` |
| Isolamento tenant | Aplicacao + queries/repositories com `tenant_id` obrigatorio |
| Supabase RLS | Legado/transicional, nao fonte para nova implementacao |
| Appwrite | Eliminado como alvo arquitetural |
| Dominios | Conforme `docs/architecture/domains-cloudflare-dns-current-plan.md` |

## 3. Principio Central

Todo dado operacional de tenant deve ter escopo claro.

Regra:

```txt
Recurso operacional de agencia/tenant deve carregar tenant_id.
```

Excecoes precisam ser explicitas:

- catalogos globais;
- configuracoes globais da plataforma;
- templates globais;
- dados de operacao interna da NORO;
- logs globais, quando realmente nao pertencerem a um tenant.

## 4. Modelo Conceitual

```txt
NORO Platform
  -> tenants
    -> memberships
    -> users
    -> customers
    -> leads
    -> orders
    -> billing
    -> sites
    -> communication
    -> settings
```

Separacao recomendada:

| Camada | Papel |
| --- | --- |
| Plataforma NORO | Operacao global, planos, tenants, billing SaaS, suporte interno. |
| Tenant/agencia | Operacao da agencia, clientes, pedidos, sites, cobrancas e configuracoes. |
| Usuario | Identidade autenticada via Logto e permissao interna por membership. |
| Cliente final | Pessoa atendida/compradora da agencia, sempre sob tenant. |

## 5. Identidade E Membership

Logto deve responder quem e o usuario.

PostgreSQL deve responder:

- a quais tenants o usuario pertence;
- qual papel ele possui;
- se a membership esta ativa;
- quais recursos pode acessar.

Modelo recomendado:

```txt
users
- id
- email
- name
- auth_provider
- auth_subject
- legacy_supabase_user_id
- status
- created_at

tenants
- id
- name
- slug
- status
- created_at
- updated_at

tenant_memberships
- id
- tenant_id
- user_id
- role
- status
- created_at
- updated_at
```

Papeis iniciais sugeridos:

| Role | Uso |
| --- | --- |
| `owner` | Dono da agencia/tenant. |
| `admin` | Admin operacional do tenant. |
| `member` | Operacao normal. |
| `readonly` | Acesso de leitura. |
| `platform_admin` | Operacao interna NORO, fora do escopo normal de tenant. |

## 6. Resolucao Do Tenant Atual

A NORO deve resolver tenant por contexto autenticado, nao por confianca cega em parametros de URL.

Fontes possiveis:

| Fonte | Uso |
| --- | --- |
| Sessao Logto + membership | Fonte principal para app logado. |
| Rota contextual `app.noro.guru/t/{slug}` | Conveniencia de navegacao; deve validar membership. |
| Dominio de site publico | Resolver tenant do site publicado. |
| Webhook externo | Resolver por configuracao do provider/canal, assinatura e payload. |
| Admin interno | Pode selecionar tenant, mas deve auditar impersonation/acao. |

Regra:

```txt
tenant_id recebido do cliente nunca e suficiente sozinho.
```

Sempre validar contra sessao, membership, ownership do recurso ou assinatura de provider.

## 7. Dominios

Fonte oficial:

`docs/architecture/domains-cloudflare-dns-current-plan.md`

Mapa alvo:

| Dominio | Papel |
| --- | --- |
| `noro.guru` | Marketing institucional. |
| `app.noro.guru` | Produto para agencias/clientes. |
| `admin.noro.guru` | Operacao interna/Control Plane. |
| `sites.noro.guru` | Sites gerados/oferta de sites IA. |
| `api.noro.guru` | APIs tecnicas. |
| `vistos.noro.guru` | Comercial/documentacao da API de vistos. |

Modelo por tenant:

| Contexto | URL |
| --- | --- |
| Site publico gratis | `{tenant}.sites.noro.guru` |
| Site publico com dominio proprio | dominio do cliente |
| Backoffice logado | `app.noro.guru` |
| Backoffice contextual opcional | `app.noro.guru/t/{tenant}` |

Hosts legados sao apenas aliases temporarios:

- `control.noro.guru` -> `admin.noro.guru`;
- `core.noro.guru` -> `app.noro.guru`;
- `visa-api.noro.guru` -> `api.noro.guru` ou `vistos.noro.guru`.

## 8. Regras Para Dados

### Deve Ter `tenant_id`

Em geral, devem carregar `tenant_id`:

- clientes;
- leads;
- pedidos;
- orcamentos;
- tarefas;
- interacoes;
- fornecedores do tenant;
- configuracoes do tenant;
- sites gerados;
- canais de comunicacao;
- cobrancas da agencia;
- assinaturas/add-ons da agencia;
- eventos de uso cobravel.

### Pode Ser Global

Podem ser globais, se documentado:

- planos comerciais;
- catalogos base;
- templates globais;
- configuracoes da plataforma;
- usuarios como identidade canonica;
- auditoria de plataforma;
- billing da NORO em nivel de plataforma.

### Precisa De Decisao Explicita

Itens que nao devem ficar ambiguos:

- templates de comunicacao;
- campanhas;
- comissoes;
- transacoes financeiras;
- logs de auditoria;
- assets reutilizaveis.

Se o dado puder afetar uma agencia especifica, a opcao padrao deve ser incluir `tenant_id`.

## 9. Padrao De Acesso A Dados

Codigo novo deve usar repositorios/servicos sobre `packages/db`.

Padrao desejado:

```txt
Route/Action
  -> requireUser()
  -> resolveTenantContext()
  -> authorize()
  -> repository com tenant_id obrigatorio
```

Exemplo conceitual:

```ts
const user = await requireUser()
const tenant = await resolveTenantContext(user, params)
await authorize(user, tenant.id, 'customers:read')

const customers = await customerRepository.listByTenant(tenant.id)
```

Evitar:

- queries sem `tenant_id` em recursos de tenant;
- confiar em `tenant_id` vindo do browser;
- duplicar isolamento em varias camadas sem padrao;
- criar nova dependencia Supabase Client para dados novos.

## 10. Autorizacao

Autorizacao deve ser aplicada antes de acessar dados sensiveis.

Camadas:

| Camada | Responsabilidade |
| --- | --- |
| Auth | Validar sessao/usuario via Logto. |
| Tenant context | Resolver tenant ativo e membership. |
| Authorization | Validar role/permissao. |
| Repository | Executar queries sempre escopadas. |
| Audit | Registrar acoes sensiveis. |

## 11. Admin E Impersonation

`admin.noro.guru` pode precisar operar tenants.

Regras:

- `platform_admin` nao deve burlar auditoria;
- troca de tenant deve ser registrada;
- acoes em nome de tenant devem guardar quem executou;
- operacao interna deve ser separada de usuario normal do tenant;
- suporte/impersonation precisa de motivo e log.

## 12. Relacao Com Billing Asaas

Billing depende de tenant bem resolvido.

Antes de liberar cobrancas reais, cada evento financeiro deve carregar:

- `tenant_id`;
- cliente/pedido associado, quando houver;
- tipo de dominio financeiro;
- provider;
- status canonico;
- payload/evento idempotente.

Separacao financeira:

| Dominio | Escopo |
| --- | --- |
| `platform_billing` | NORO cobra agencia: mensalidade, setup, add-ons. |
| `agency_collections` | Agencia cobra cliente final. |
| `commission_split` | NORO recebe comissao/split. |

Fonte:

`docs/architecture/billing-asaas-migration-plan.md`

## 13. Relacao Com Sites

Sites publicos devem resolver tenant por dominio/subdominio:

```txt
{tenant}.sites.noro.guru
dominio-proprio-do-tenant.com.br
```

O site publico nao deve depender de sessao do app.

O editor/backoffice do site deve ficar no app logado:

```txt
app.noro.guru/t/{tenant}/sites/...
```

## 14. Relacao Com API E Webhooks

Endpoints tecnicos devem usar `api.noro.guru`.

Quando um webhook externo chegar:

1. validar assinatura/token do provider;
2. persistir payload bruto;
3. resolver tenant por configuracao interna;
4. processar de forma idempotente;
5. aplicar efeito no recurso do tenant.

Nao usar `tenant_id` na URL como unico mecanismo de seguranca.

## 15. Migracao Do Modelo Antigo

O documento antigo baseado em Supabase/RLS foi arquivado em:

```txt
docs/archive/supabase-rls-multi-tenant-architecture.md
```

Durante a migracao:

- Supabase pode existir temporariamente em rotas legadas;
- codigo novo nao deve depender de `supabase.auth`;
- codigo novo nao deve depender de RLS Supabase como mecanismo principal;
- repositorios Drizzle devem receber `tenant_id` explicitamente;
- o plano de auth/dados deve seguir `docs/architecture/data-auth-transition.md`.

## 16. Checklist De Implementacao

### Sprint 0: Base

- [ ] Confirmar tabelas `users`, `tenants` e `tenant_memberships` no schema Drizzle.
- [ ] Definir helper `resolveTenantContext()`.
- [ ] Definir helper `authorize()`.
- [ ] Definir roles/permissoes iniciais.

### Sprint 1: Repositories

- [ ] Padronizar repositories com `tenant_id` obrigatorio.
- [ ] Revisar queries sem escopo em recursos de tenant.
- [ ] Criar testes de isolamento para recursos criticos.

### Sprint 2: Apps

- [ ] Aplicar modelo no app logado.
- [ ] Aplicar modelo no admin.
- [ ] Aplicar modelo em sites gerados.
- [ ] Aplicar modelo em API/webhooks.

### Sprint 3: Limpeza Legada

- [ ] Remover referencias a Supabase RLS como arquitetura ativa.
- [ ] Atualizar docs de apps afetados.
- [ ] Garantir que documentos vigentes apontem para este arquivo.

## 17. Documentos Relacionados

| Documento | Uso |
| --- | --- |
| `docs/architecture/current-state.md` | Estado atual consolidado. |
| `docs/architecture/data-auth-transition.md` | Transicao de Supabase/Auth para Logto/PostgreSQL/Drizzle. |
| `docs/architecture/supabase-residue-report.md` | Residuos Supabase ainda existentes. |
| `docs/architecture/domains-cloudflare-dns-current-plan.md` | Dominios oficiais e legados. |
| `docs/architecture/billing-asaas-migration-plan.md` | Billing e relacao financeira por tenant. |
| `scripts/README.md` | Politica para migrations e scripts. |
