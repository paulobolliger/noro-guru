# Sprint 0 - Alinhamento documental e decisoes criticas

Status: concluida.

Data de referencia: 2026-05-27

Fonte principal: `docs/backlog/implementation/noro-foundation-sprint-plan.md`

Fonte de arquitetura vigente: `docs/architecture/`

Fonte de visao-alvo: `docs/conceito/`

## 1. Resumo executivo

A Sprint 0 consolidou as decisoes fundacionais aprovadas pelo Paulo para reduzir ambiguidade antes da Sprint 1.

O projeto continua em transicao arquitetural: PostgreSQL/Drizzle, Logto e Asaas sao as direcoes vigentes; Supabase permanece legado/transicional; Appwrite esta eliminado; Stripe, Cielo, BTG e eRede sao legado financeiro. `docs/conceito/` segue como visao-alvo, nao como prova de implementacao.

Com as decisoes revisadas, a Sprint 0 pode ser considerada concluida para fins de planejamento. A Sprint 1 ja pode comecar, limitada a auth, tenant e base de dados canonica, sem implementar ainda CRM, checkout ou ledger.

## 2. MVP fundacional oficial

O MVP da NORO deve ser tratado como **MVP fundacional**, nao como versao descartavel ou simples demais. Ele deve criar a base real para CRM, propostas, checkout, comissao, ledger e expansoes futuras.

### Entra no MVP fundacional

- Auth, tenant e dados:
  - Logto como auth oficial;
  - PostgreSQL/Drizzle como camada nova;
  - tenants, users, memberships, roles e autorizacao central;
  - proibicao de novas chamadas Supabase em codigo novo.
- CRM da NORO em `/control`:
  - captacao, venda e gestao de tenants;
  - onboarding comercial e operacional de tenants.
- CRM dos tenants em `/core`:
  - leads;
  - clientes/passageiros;
  - operacao comercial do tenant.
- Financeiro da NORO em `/control`:
  - billing SaaS da NORO;
  - cobranca de tenants;
  - cobranca de servicos da NORO;
  - taxas NORO;
  - visao consolidada.
- Financeiro operacional dos tenants em `/core`:
  - cobranca dos clientes finais;
  - recebiveis;
  - comissoes internas;
  - financeiro operacional do tenant.
- Produtos manuais.
- Fornecedores basicos.
- Propostas e quote builder.
- Motor de calculo financeiro:
  - custo;
  - preco;
  - markup;
  - margem;
  - comissao;
  - taxas;
  - valor final;
  - snapshot financeiro da proposta.
- Checkout proprio white-label/embedded.
- Asaas como gateway financeiro vigente por tras do checkout.
- Cobranca dos tenants pela NORO.
- Cobranca dos clientes finais pelos tenants.
- Comissao simples.
- Ledger minimo.
- Arquitetura split-ready.

### Nao entra no MVP fundacional

- Marketplace aberto H2B2H.
- Embedded finance.
- APIs complexas de fornecedores.
- Academy.
- App nativo.
- Aereo/GDS.
- Cotas e pagamento programado completo.
- IA copiloto avancado.
- Redesign visual amplo antes da fundacao.
- Reserva automatica por API.
- Emissao automatica.
- Disponibilidade em tempo real.
- Hotel API.
- Tours API.
- Seguro API.
- Voucher automatico.
- Cancelamento via API.

### Fica para fase futura

- Supplier Hub completo.
- Marketplace H2B2H amplo.
- Sites/vitrines conectados ao funil, depois de lead/proposta/checkout estarem claros.
- Grupos, lideres e sites/vitrines conectados.
- Split/subcontas/repasses automatizados, se nao entrarem no primeiro commit.
- Planos complexos, add-ons sofisticados, upgrade/downgrade automatico avancado, trials elaborados e regua completa de cobranca.
- Sistema de reservas com APIs de terceiros.
- Verticais como vistos, SafeTrip e Nomade como expansoes sobre a fundacao.

## 3. Apps alvo e apps transicionais

| App | Status recomendado | Funcao recomendada | Observacoes | Decisao registrada |
| --- | --- | --- | --- | --- |
| `apps/control` | alvo final | Control Plane da NORO em `admin.noro.guru` | Backoffice principal da plataforma, CRM da NORO, onboarding, billing SaaS, cobranca de tenants, financeiro da plataforma, taxas NORO, governanca, suporte, configuracoes globais e regras globais de billing/split/ledger | Aprovado como Control Plane da NORO. |
| `apps/core` | alvo final | Portal operacional dos tenants em `app.noro.guru` | CRM dos clientes finais, leads, passageiros, produtos manuais, fornecedores do tenant, propostas, quote builder, calculo financeiro, checkout proprio, cobrancas, financeiro operacional, comissoes internas e recebiveis | Aprovado como portal operacional dos tenants. |
| `apps/sites` | alvo final / fase posterior | Runtime de sites/vitrines em `sites.noro.guru` e `*.sites.noro.guru` | Deve conectar a lead, proposta e checkout; entra depois da fundacao transacional | Aprovado como destino de sites/vitrines, mas nao prioridade da Sprint 1. |
| `apps/web` | alvo final | Site publico e marketing em `noro.guru` e `www.noro.guru` | Marketing institucional e possiveis landings publicas, sem virar fonte operacional | Mantido como alvo final de marketing. |
| `apps/visa-api` | em avaliacao | Vertical/API de vistos; endpoints tecnicos em `api.noro.guru`; `visa-api.noro.guru` em avaliacao para landing/documentacao comercial | Nao entra como dominio principal de produto logado; precisa alinhar auth, tenant e dados se virar produto | Uso final de `visa-api.noro.guru` segue em avaliacao como landing/documentacao. |
| `apps/billing` | transicional / legado | Fonte historica de billing, checkout, planos e webhooks legados | Nao e produto final separado; logica util deve ser absorvida por `/control` e `/core` | Aprovado como app transicional/legado. |
| `apps/financeiro` | transicional / base de reaproveitamento | Fonte historica de telas e logicas financeiras | Nao e produto final separado; logica util deve ser absorvida por `/control` e `/core` | Aprovado como app transicional/base de reaproveitamento. |

## 4. Decisao registrada para `/control` e `/core`

### `/control`

`/control` e o Control Plane da NORO em `admin.noro.guru`.

Responsabilidades:

- CRM da NORO para captar, vender e gerir tenants.
- Onboarding de tenants.
- Gestao de planos.
- Billing SaaS da NORO.
- Cobranca de tenants.
- Cobranca de servicos da NORO.
- Financeiro da plataforma.
- Taxas NORO.
- Visao consolidada.
- Governanca.
- Suporte aos tenants.
- Configuracoes globais.
- Fornecedores globais futuros.
- Regras globais de billing/split/ledger.

### `/core`

`/core` e o portal operacional dos tenants em `app.noro.guru`.

Responsabilidades:

- CRM dos clientes finais do tenant.
- Leads.
- Clientes/passageiros.
- Produtos manuais.
- Fornecedores do tenant.
- Propostas.
- Quote builder.
- Calculo de preco, margem e comissao.
- Checkout proprio do tenant.
- Cobranca dos clientes finais.
- Financeiro operacional do tenant.
- Comissoes internas.
- Recebiveis.
- Futuramente grupos, lideres e sites/vitrines conectados.

### Separacao obrigatoria

- `/control` opera a plataforma NORO e seus tenants.
- `/core` opera cada tenant e seus clientes finais.
- Billing da NORO contra tenants fica em `/control`.
- Cobranca do tenant contra cliente final fica em `/core`.
- Financeiro da NORO fica em `/control`.
- Financeiro operacional do tenant fica em `/core`.

Risco principal se os papeis forem misturados: CRM, billing, financeiro, comissao e ledger ficarem sem fronteira clara entre receita da plataforma e receita do tenant.

## 5. Dominios oficiais e divergencias

### Dominios oficiais

| Dominio | Papel registrado |
| --- | --- |
| `admin.noro.guru` | `/control`, Control Plane da NORO |
| `app.noro.guru` | `/core`, portal operacional dos tenants |
| `sites.noro.guru` | `/sites`, runtime de sites/vitrines |
| `*.sites.noro.guru` | `/sites`, subdominios de sites/vitrines por tenant |
| `api.noro.guru` | endpoint tecnico principal |
| `noro.guru` | marketing institucional |
| `www.noro.guru` | marketing institucional |

### Dominios legados

| Dominio | Leitura registrada |
| --- | --- |
| `control.noro.guru` | legado/alias temporario; nao usar como dominio final |
| `core.noro.guru` | legado/alias temporario; nao usar como dominio final |
| `supabase.noro.guru` | legado/transicional; nao usar como destino de arquitetura nova |

### Dominios em avaliacao

| Dominio | Leitura registrada |
| --- | --- |
| `visa-api.noro.guru` | em avaliacao para landing/documentacao comercial da vertical de vistos |
| `webhook.noro.guru` | futuro/opcional para gateway dedicado de webhooks |
| `auth.noro.guru` | futuro/opcional se houver host dedicado de auth/SSO |

### Dominio nao oficial

`vistos.noro.guru` nao e dominio oficial e nao deve ser usado.

### Divergencia documental a corrigir depois

`docs/architecture/multi-tenant-current-model.md` ainda menciona `vistos.noro.guru`. A decisao revisada e que esse dominio nao e oficial. Esse documento vigente deve ser corrigido em uma tarefa documental separada, pois esta tarefa atualiza apenas o registro de Sprint 0 e `docs/SPRINT_STATUS.md`.

## 6. Supabase, Appwrite e legado financeiro

### Supabase

Supabase deve ser tratado como runtime legado/transicional. Ele ainda pode existir em rotas antigas durante a migracao, mas nao deve orientar implementacao nova.

Nao usar em codigo novo:

- `supabase.auth`;
- novos clientes Supabase;
- novas dependencias `@supabase/*`;
- migrations/functions Supabase como caminho operacional novo;
- Supabase RLS como premissa de isolamento para codigo novo.

### Appwrite

Appwrite esta eliminado como alvo arquitetural.

Nao usar em codigo novo:

- SDK Appwrite;
- scripts Appwrite ativos;
- tipos Appwrite;
- colecoes Appwrite como modelo de dados.

### Stripe, Cielo, BTG e eRede

Stripe, Cielo, BTG e eRede sao legado financeiro. Podem servir como referencia historica ou transicional, mas nao devem orientar novos fluxos.

### Asaas

Asaas e o gateway financeiro vigente para novos fluxos. Ele deve funcionar como infraestrutura/gateway por tras do checkout proprio da NORO e dos tenants.

## 7. Asaas e checkout proprio

A NORO deve ter checkout proprio white-label/embedded.

Checkout proprio significa experiencia de pagamento dentro da marca, dominio, layout e fluxo da NORO ou do tenant. O cliente final nao deve ser redirecionado para uma tela externa com branding Asaas como fluxo principal.

Asaas deve funcionar como infraestrutura/gateway por tras, preferencialmente invisivel para o cliente final. A marca Asaas so deve aparecer se for estritamente necessario por exigencia tecnica, legal, antifraude, boleto, comprovante ou limitacao do provider.

A NORO deve controlar:

- experiencia;
- dominio;
- layout;
- tracking;
- status interno;
- ledger;
- pos-pagamento.

Regras tecnicas:

- A NORO nao deve armazenar dados sensiveis de cartao.
- Para cartao, usar API/tokenizacao/componente seguro compativel com Asaas.
- Para PIX, exibir QR Code e copia-e-cola em tela propria.
- Para boleto, exibir linha digitavel/link/PDF dentro do fluxo proprio sempre que possivel.
- Evitar o termo "checkout hospedado Asaas" como solucao principal do MVP.
- Se algum fluxo precisar de redirecionamento por limitacao tecnica inicial, marcar como fallback temporario, nao como arquitetura final.

A arquitetura deve nascer split-ready. Se split/subcontas nao forem implementados no primeiro commit, o caminho tecnico precisa ficar explicito para evitar retrabalho.

O modelo deve prever:

- `/control` cobrando tenants e servicos NORO;
- `/core` cobrando clientes finais dos tenants;
- possibilidade futura de split/subcontas/repasses automatizados.

## 8. Metodos de pagamento do MVP

Metodos desejados do MVP:

- PIX em tela propria da NORO/tenant.
- Boleto com linha digitavel/link/PDF exibido dentro do fluxo proprio sempre que possivel.
- Cartao via checkout proprio NORO, usando API/tokenizacao/componente seguro compativel com Asaas.
- Link externo/redirecionamento apenas como fallback temporario, nao como arquitetura final.

## 9. Ledger minimo

O ledger deve ser o mais detalhado possivel desde a arquitetura.

Eventos minimos antes de cobranca real:

- `payment_created`;
- `payment_confirmed`;
- `payment_failed`;
- `payment_refunded`;
- `commission_estimated`;
- `commission_confirmed`;
- `platform_fee_recorded`;
- `tenant_receivable_recorded`;
- `noro_billing_charge_created`;
- `noro_billing_charge_paid`;
- `ledger_entry_created`.

O modelo deve diferenciar:

- receita NORO;
- receita tenant;
- cobranca de cliente final;
- cobranca de tenant;
- taxa da plataforma;
- comissao;
- repasse;
- gateway fee;
- reembolso;
- cancelamento.

## 10. Billing SaaS da NORO

Billing SaaS da NORO entra no escopo fundacional.

Nao deixar para depois a capacidade de a NORO cobrar tenants.

Pode ficar para fase posterior:

- planos complexos;
- add-ons sofisticados;
- upgrade/downgrade automatico avancado;
- trials elaborados;
- regua completa de cobranca.

## 11. Sistema de reservas e APIs de terceiros

Sistema de reservas com APIs de terceiros vem depois.

O MVP deve ser:

- manual-first;
- API-ready;
- sem dependencia de fornecedores externos complexos.

O motor de calculo financeiro entra agora, porque propostas, checkout, comissao e ledger dependem dele.

### Entra agora

- Calculo de custo.
- Preco.
- Markup.
- Margem.
- Comissao.
- Taxas.
- Valor final.
- Snapshot financeiro da proposta.

### Fica para depois

- Reserva automatica por API.
- Emissao automatica.
- Disponibilidade em tempo real.
- GDS/aereo.
- Hotel API.
- Tours API.
- Seguro API.
- Voucher automatico.
- Cancelamento via API.

## 12. Decisoes registradas

- [x] MVP oficial da NORO definido como MVP fundacional.
- [x] `/control` definido como Control Plane da NORO em `admin.noro.guru`.
- [x] `/core` definido como portal operacional dos tenants em `app.noro.guru`.
- [x] `apps/billing` definido como app transicional/legado, sem status de produto final separado.
- [x] `apps/financeiro` definido como app transicional/base de reaproveitamento, sem status de produto final separado.
- [x] `admin.noro.guru` mapeado para `/control`.
- [x] `app.noro.guru` mapeado para `/core`.
- [x] `sites.noro.guru` e `*.sites.noro.guru` mapeados para `/sites`.
- [x] `api.noro.guru` definido como endpoint tecnico principal.
- [x] `visa-api.noro.guru` mantido em avaliacao para landing/documentacao comercial da vertical de vistos.
- [x] `vistos.noro.guru` definido como nao oficial e nao deve ser usado.
- [x] Asaas definido como gateway financeiro vigente.
- [x] Checkout proprio white-label/embedded definido como experiencia principal.
- [x] Link externo/redirecionamento definido apenas como fallback temporario.
- [x] Metodos de pagamento desejados do MVP definidos.
- [x] Ledger minimo definido antes de cobranca real.
- [x] Billing SaaS da NORO incluido no escopo fundacional.
- [x] Sistema de reservas com APIs de terceiros adiado para fase futura.
- [x] Motor de calculo financeiro incluido no escopo fundacional.

## 13. Decisoes ainda pendentes

Nao ha decisao critica pendente para iniciar a Sprint 1.

Decisoes taticas que podem ser detalhadas nas sprints futuras:

- modelo exato de roles/permissoes iniciais;
- estrategia de coexistencia curta entre Supabase Auth e Logto;
- estrategia de ponte com `legacy_supabase_user_id`;
- se split/subcontas entram no primeiro commit financeiro ou ficam como estrutura preparada;
- owner tecnico de cada sprint;
- detalhes de migracao ou descarte de dados Supabase legados.

## 14. Recomendacoes para atualizacao documental posterior

Depois desta decisao, devem ser atualizados em tarefas proprias:

- `docs/backlog/implementation/noro-foundation-sprint-plan.md`:
  - refletir MVP fundacional, checkout proprio, billing SaaS da NORO e arquitetura split-ready.
- `docs/architecture/current-state.md`:
  - refletir, quando aprovado como arquitetura vigente, a separacao detalhada de `/control` e `/core`.
- `docs/architecture/multi-tenant-current-model.md`:
  - remover `vistos.noro.guru` como dominio alvo.
- `docs/architecture/domains-cloudflare-dns-current-plan.md`:
  - reforcar `admin`, `app`, `sites`, `api`, `visa-api` e `vistos.noro.guru`.
- `docs/architecture/billing-asaas-migration-plan.md`:
  - trocar enfase de checkout hospedado para checkout proprio white-label/embedded;
  - registrar ledger minimo e arquitetura split-ready.
- `docs/apps/README.md` e `docs/apps/*.README.md`:
  - refletir papeis finais/transicionais dos apps.
- `docs/analise-documentacao-md-projeto.md`:
  - registrar as mudancas documentais quando incorporadas aos documentos vigentes.

## 15. Criterio de pronto da Sprint 0

Sprint 0 concluida.

Criterios atendidos:

- MVP fundacional registrado.
- Papeis de `/control` e `/core` registrados.
- Apps finais, transicionais e em avaliacao registrados.
- Dominios oficiais, legados, em avaliacao e nao oficiais registrados.
- Supabase, Appwrite e legado financeiro classificados.
- Asaas e checkout proprio registrados.
- Ledger minimo registrado.
- Billing SaaS da NORO incluido na fundacao.
- Reservas/APIs de terceiros adiadas.
- `docs/SPRINT_STATUS.md` deve ser atualizado para `concluida`.

## 16. Proximo passo

A Sprint 1 ja pode comecar.

Escopo da Sprint 1:

- Logto runtime.
- Tenants.
- Memberships.
- Roles iniciais.
- Helpers de auth.
- Helpers de tenant.
- Autorizacao central.
- PostgreSQL/Drizzle.
- Evitar novas chamadas Supabase.

Nao iniciar ainda:

- CRM completo;
- checkout Asaas;
- ledger;
- motor financeiro completo;
- sites/vitrines;
- reservas/API de terceiros.
