# NORO Foundation Sprint Plan

Status: backlog tecnico incremental.

Data de referencia: 2026-05-27

Fonte de gap: `docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md`

Fonte de arquitetura vigente: `docs/architecture/`

## 1. Objetivo

Este plano transforma a gap analysis da visao NORO em sprints tecnicas incrementais para criar a fundacao da plataforma.

O foco nao e implementar a visao completa de marketplace, IA, grupos, creators, Academy ou APIs de fornecedores. O foco e preparar a base necessaria para que esses dominios possam ser construidos depois com menor retrabalho: auth Logto, tenant canonico, dados em PostgreSQL/Drizzle, CRM minimo, propostas, checkout Asaas, comissao simples e ledger inicial.

Este documento pertence ao backlog. Ele nao substitui `docs/architecture/` como fonte de arquitetura vigente e nao deve ser lido como implementacao existente.

## 2. Principios de execucao

- Fundacao antes de marketplace.
- Asaas antes de billing avancado.
- Drizzle/Postgres antes de novos dominios.
- Logto antes de expansao de usuarios.
- Operacao manual-first antes de APIs.
- Sites/vitrines so depois de lead, proposta e checkout estarem claros.
- Supabase deve permanecer legado/transicional, sem novas dependencias ou novas chamadas em codigo novo.
- Appwrite deve permanecer eliminado.
- Stripe, Cielo, BTG e eRede devem ser tratados como historico/transicional durante a migracao financeira.
- `docs/conceito/` deve orientar a visao-alvo, nao provar implementacao atual.
- Toda sprint que tocar dados, auth, tenant ou billing precisa validar impacto nos documentos vigentes antes de virar arquitetura oficial.

## 3. Sprints propostas

### Sprint 0 - Alinhamento documental e decisoes criticas

**Objetivo**

Reduzir ambiguidade antes de codar, confirmar o recorte do MVP e bloquear novas decisoes baseadas em documentos ou caminhos legados.

**Escopo**

- Revisar divergencias entre `docs/architecture/`, `docs/apps/`, `docs/backlog/` e `docs/conceito/`.
- Confirmar quais apps continuam como alvo final: `apps/control`, `apps/core`, `apps/sites`, `apps/visa-api`, `apps/web`.
- Confirmar quais apps ficam transicionais: `apps/billing`, `apps/financeiro` ou outros.
- Confirmar dominios oficiais e remover ambiguidades documentais sobre `control`, `core`, `vistos` e `visa-api`.
- Confirmar MVP inicial: CRM minimo, propostas, checkout Asaas, comissao simples e ledger inicial.
- Criar lista aprovada de decisoes humanas pendentes.
- Confirmar politica para Supabase congelado e Appwrite eliminado.

**Fora de escopo**

- Codigo de produto.
- Schema novo.
- Migrations.
- Integracao Logto.
- Integracao Asaas.
- Migracao de dados.

**Arquivos/pastas provaveis**

- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/apps/README.md`
- `docs/apps/*.README.md`
- `docs/backlog/README.md`
- `docs/backlog/implementation/`
- `docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md`
- `scripts/README.md`

**Riscos**

- Codar antes de decidir owner dos apps.
- Corrigir documentacao sem validar estado real do codigo.
- Tratar `docs/conceito/` como arquitetura vigente.
- Reabrir Supabase ou Appwrite por conveniencia.

**Criterio de pronto**

- Recorte do MVP documentado.
- Apps alvo e apps transicionais documentados.
- Dominios oficiais sem contradicao nos docs vigentes.
- Lista de decisoes pendentes aprovada pelo Paulo.
- Nenhuma alteracao de codigo, schema ou migracao executada.

### Sprint 1 - Auth, tenant e base de dados canonica

**Objetivo**

Criar a fundacao tecnica para usuario, tenant, membership, permissao e acesso a dados usando Logto, PostgreSQL e Drizzle.

**Escopo**

- Definir schemas Drizzle iniciais para `users`, `tenants` e `tenant_memberships`.
- Definir helpers canonicos de auth: `getCurrentUser`, `requireUser`, `getSessionClaims` e `signOut`.
- Definir helpers de tenant: `resolveTenantContext` e `authorize`.
- Definir roles iniciais: `owner`, `admin`, `member`, `readonly` e `platform_admin`.
- Definir estrategia de ponte com usuarios Supabase legados sem criar dependencia nova.
- Padronizar repositorios com `tenant_id` obrigatorio para recursos operacionais.

**Fora de escopo**

- Migrar todos os modulos antigos.
- Remover Supabase fisicamente.
- Implementar billing Asaas.
- Implementar marketplace, sites ou IA.

**Arquivos/pastas provaveis**

- `packages/auth/`
- `packages/db/`
- `packages/lib/services/authService.ts`
- `apps/control/app/login/`
- `apps/control/app/(protected)/`
- `apps/core/app/(protected)/`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `scripts/README.md`

**Riscos**

- Manter Supabase Auth e Logto como dois caminhos permanentes.
- Confiar em `tenant_id` vindo do browser.
- Criar regra de permissao espalhada por app.
- Criar schema sem reconciliar dados legados necessarios.

**Criterio de pronto**

- Logto definido como runtime oficial para rotas novas.
- Tenant resolvido por sessao e membership, nao por parametro isolado.
- Repositorios novos exigem `tenant_id` quando o recurso pertence a tenant.
- Codigo novo nao cria chamadas Supabase.
- Appwrite continua ausente.

### Sprint 2 - CRM minimo em PostgreSQL/Drizzle

**Objetivo**

Recriar o fluxo minimo de CRM sobre a base canonica, sem depender de Supabase como caminho novo.

**Escopo**

- Modelar leads e clientes com `tenant_id`.
- Implementar repositorios Drizzle para leads e clientes.
- Migrar ou criar actions/rotas minimas para listar, criar, editar e consultar leads/clientes.
- Definir status e origem do lead.
- Preservar padroes uteis de `apps/control` sem carregar acoplamento legado.

**Fora de escopo**

- Automacoes complexas.
- Omnichannel completo.
- IA comercial.
- Marketplace.
- Importacao massiva de dados.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/control/app/(protected)/leads/`
- `apps/control/app/(protected)/clientes/`
- `apps/core/app/(protected)/`
- `packages/lib/services/crmService.ts`
- `docs/apps/control.README.md`
- `docs/apps/core.README.md`

**Riscos**

- Copiar queries Supabase para Drizzle sem revisar tenant.
- Misturar cliente final com usuario autenticado.
- Expandir CRM antes de fechar proposta/checkout.

**Criterio de pronto**

- Lead e cliente possuem escopo por tenant.
- CRUD minimo usa PostgreSQL/Drizzle.
- Rotas novas usam Logto e tenant context.
- Supabase permanece apenas em rotas legadas explicitamente marcadas.

### Sprint 3 - Produtos manuais e fornecedores basicos

**Objetivo**

Criar um catalogo inicial manual-first para permitir propostas sem depender de APIs de fornecedor.

**Escopo**

- Modelar produtos manuais com `tenant_id`.
- Modelar fornecedores basicos do tenant.
- Definir categorias iniciais: hospedagem, transfer, passeio, seguro, servico, outro.
- Registrar custo, preco, margem e regras simples.
- Permitir uso desses itens em proposta futura.

**Fora de escopo**

- Supplier Hub completo.
- APIs de fornecedores.
- Disponibilidade em tempo real.
- Contratos complexos.
- GDS/aereo.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/control/app/(protected)/`
- `apps/core/app/(protected)/`
- `docs/conceito/04_noro_h2b2h_marketplace.md`
- `docs/conceito/07_noro_supplier_api_roadmap.md`

**Riscos**

- Criar marketplace antes de ter catalogo interno simples.
- Modelar fornecedor global quando o dado pertence ao tenant.
- Supermodelar contratos antes do primeiro fluxo transacional.

**Criterio de pronto**

- Produto manual e fornecedor basico existem no modelo canonico.
- Itens podem ser consultados por tenant.
- Nenhuma API externa e exigida para operar o MVP.
- O desenho permite evoluir para Supplier Hub sem bloquear o presente.

### Sprint 4 - Propostas / quote builder canonico

**Objetivo**

Consolidar proposta como ponte entre CRM, produtos, checkout e comissao.

**Escopo**

- Modelar propostas, versoes, itens, custos, margem, impostos e status.
- Associar proposta a lead/cliente e tenant.
- Permitir itens manuais e itens vindos do catalogo.
- Definir status iniciais: rascunho, enviada, aceita, expirada, cancelada.
- Preservar aprendizados do quote builder existente em `apps/control`.

**Fora de escopo**

- IA avancada de roteiro.
- Assinatura digital complexa.
- Contratos juridicos completos.
- Split financeiro automatico.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/control/app/(protected)/orcamentos/`
- `apps/core/app/(protected)/orcamentos/`
- `apps/control/components/orcamentos/`
- `packages/renderer/`, se houver apresentacao publica futura.

**Riscos**

- Proposta virar apenas PDF sem conexao com checkout.
- Itens financeiros nao carregarem custo e margem.
- Ignorar versao/snapshot da proposta aceita.

**Criterio de pronto**

- Proposta aceita gera base confiavel para cobranca.
- Itens possuem snapshot de preco/custo/margem.
- Proposta pertence a tenant e cliente.
- Fluxo novo nao depende de Supabase.

### Sprint 5 - Checkout Asaas minimo

**Objetivo**

Permitir cobranca real ou piloto via Asaas para uma proposta/pedido, com webhook e status canonico.

**Escopo**

- Criar interface `PaymentProvider`.
- Criar `AsaasProvider` minimo.
- Criar cliente financeiro no gateway.
- Criar cobranca Pix, boleto ou link/checkout hospedado.
- Criar endpoint de webhook Asaas.
- Persistir payload bruto e processar evento de forma idempotente.
- Mapear status externo para status interno.

**Fora de escopo**

- Split automatico completo.
- Subcontas complexas.
- Billing SaaS completo da NORO.
- Remocao de Stripe/Cielo/BTG/eRede.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/control/`
- `apps/core/`
- `apps/billing/` apenas como referencia legada, nao como fronteira final.
- `docs/architecture/billing-asaas-migration-plan.md`
- `scripts/README.md`

**Riscos**

- Emitir cobranca sem webhook confiavel.
- Misturar billing da NORO com cobranca da agencia.
- Salvar dados sensiveis de cartao.
- Criar provider direto em tela/action.

**Criterio de pronto**

- Cobranca Asaas sandbox criada por fluxo canonico.
- Webhook salva payload bruto e evita duplicidade.
- Status interno atualiza a cobranca.
- Gateway legado permanece apenas transicional.

### Sprint 6 - Comissao simples e eventos financeiros

**Objetivo**

Registrar comissao inicial da NORO e eventos financeiros basicos derivados de pagamento.

**Escopo**

- Criar regra simples de comissao por tenant/plano.
- Aplicar snapshot da regra na cobranca/proposta.
- Registrar evento financeiro de cobranca criada, pagamento confirmado e pagamento recebido.
- Separar `platform_billing`, `agency_collections` e `commission_split`.
- Preparar dados para ledger inicial.

**Fora de escopo**

- Split automatico avancado.
- Conciliacao bancaria completa.
- DRE completa.
- Repasses complexos.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/control/`
- `apps/core/`
- `apps/financeiro/` como referencia transicional.
- `docs/architecture/billing-asaas-migration-plan.md`

**Riscos**

- Calcular comissao sem snapshot auditavel.
- Misturar receita da NORO com receita do tenant.
- Criar dependencia de provider no modelo financeiro.

**Criterio de pronto**

- Comissao simples registrada de forma auditavel.
- Eventos financeiros possuem tenant, origem e status.
- O modelo nao depende de Stripe, Cielo, BTG ou eRede.
- Base pronta para ledger inicial.

### Sprint 7 - Sites/vitrines conectados ao funil

**Objetivo**

Conectar sites e vitrines ao funil real de lead, proposta e checkout, evitando vitrines isoladas.

**Escopo**

- Resolver tenant por dominio/subdominio.
- Conectar formulario de site a lead canonico.
- Conectar produto/oferta de site a proposta ou checkout quando aplicavel.
- Reutilizar `packages/renderer` e blueprints existentes.
- Definir diferenca entre site publico e editor/backoffice.

**Fora de escopo**

- Marketplace aberto.
- SEO massivo.
- Editor visual completo.
- Dominio proprio automatizado em larga escala.

**Arquivos/pastas provaveis**

- `apps/sites/`
- `apps/web/`
- `packages/renderer/`
- `packages/types/`
- `packages/db/`
- `docs/apps/sites.README.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`

**Riscos**

- Continuar usando Supabase como persistencia de sites.
- Publicar site sem tenant resolvido.
- Gerar leads que nao entram no CRM canonico.
- Site vender sem checkout/ledger.

**Criterio de pronto**

- Site publico resolve tenant com seguranca.
- Lead vindo de site cai no CRM canonico.
- Oferta de site pode seguir para proposta/checkout.
- Persistencia nova usa PostgreSQL/Drizzle.

### Sprint 8 - Grupos basicos

**Objetivo**

Adicionar o primeiro modelo de grupos/lideres sem criar governanca financeira complexa cedo demais.

**Escopo**

- Modelar grupo com tenant, lider, participantes e status.
- Associar grupo a proposta/oferta.
- Definir papeis basicos: lider, participante, operador.
- Registrar pagamentos individuais ou consolidado como decisao operacional.
- Registrar regras minimas de cancelamento e responsabilidade.

**Fora de escopo**

- Cotas programadas completas.
- Repasse complexo.
- Marketplace de grupos.
- Afiliados/creators completos.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/core/`
- `apps/control/`
- `docs/conceito/04_noro_h2b2h_marketplace.md`
- `docs/conceito/08_noro_implementation_roadmap.md`

**Riscos**

- Criar grupo sem governanca de pagamento e cancelamento.
- Misturar lider de viagem com creator/afiliado antes de definir papeis.
- Criar comissao por grupo sem ledger.

**Criterio de pronto**

- Grupo basico existe com tenant e papeis claros.
- Grupo consegue se relacionar com proposta e cobranca.
- Regras minimas de responsabilidade estao documentadas.

### Sprint 9 - Ledger inicial

**Objetivo**

Criar o ledger minimo para rastrear eventos financeiros do fluxo transacional.

**Escopo**

- Modelar lancamentos financeiros iniciais.
- Registrar eventos de cobranca, pagamento, comissao, reembolso e cancelamento.
- Separar visao Control Plane e visao tenant.
- Conectar ledger aos eventos da Sprint 6.
- Definir consultas basicas para financeiro operacional.

**Fora de escopo**

- ERP completo.
- Contabilidade formal.
- Conciliacao bancaria avancada.
- DRE completa.
- Embedded finance.

**Arquivos/pastas provaveis**

- `packages/db/`
- `apps/control/`
- `apps/core/`
- `apps/financeiro/` como referencia transicional.
- `docs/architecture/billing-asaas-migration-plan.md`

**Riscos**

- Criar ledger depois de fluxos financeiros ja estarem espalhados.
- Permitir edicao destrutiva de eventos financeiros.
- Misturar eventos de tenant com eventos da plataforma.

**Criterio de pronto**

- Fluxo proposta -> cobranca -> pagamento -> comissao gera registros rastreaveis.
- Lancamentos possuem tenant, origem, tipo, valor e status.
- Control Plane enxerga consolidado.
- Tenant enxerga apenas seu escopo.

## 4. Decisoes pendentes antes de codar

- Qual e o MVP oficial da NORO para o primeiro ciclo executavel.
- Se `apps/control` sera o backoffice principal para a Sprint 1-6 ou se `apps/core` assumira parte do fluxo.
- Quais apps serao mantidos como produtos finais e quais ficam apenas transicionais.
- Modelo de tenant: agencia, operador, marca, unidade de negocio ou combinacao.
- Roles e permissoes minimas para owner, admin, member, readonly e platform_admin.
- Estrategia de migracao ou abandono dos dados Supabase existentes.
- Politica de coexistencia curta entre Supabase Auth e Logto.
- Conta Asaas: master apenas no MVP ou subcontas por tenant desde o inicio.
- Metodos de pagamento do MVP: Pix, boleto, cartao/link ou combinacao.
- Modelo de comissao: percentual, fixo, hibrido, por plano ou por transacao.
- Qual app sera dono das rotas financeiras canonicas.
- Se billing SaaS da NORO entra no MVP ou fica apos cobranca da agencia.
- Qual vertical vem primeiro: operacao turismo/Nomade, vistos, SafeTrip ou sites.
- Politica de IA no MVP: nenhuma, assistiva pontual ou copiloto posterior.
- Nivel minimo do ledger para aceitar cobrancas reais.

## 5. Ordem recomendada de implementacao

A primeira sprint deve ser a Sprint 0 - Alinhamento documental e decisoes criticas.

Ela deve vir antes de qualquer codigo porque o maior risco atual nao e falta de tela: e ambiguidade de fundacao. O projeto tem docs conceituais fortes, apps parcialmente sobrepostos, Supabase legado ainda presente, billing antigo espalhado e uma decisao vigente por Logto/PostgreSQL/Drizzle/Asaas. Codar antes de fechar o recorte do MVP, owner dos apps, dominios e fronteiras financeiras aumenta a chance de reescrever a mesma funcionalidade logo depois.

Depois da Sprint 0, a ordem recomendada e:

1. Sprint 1 - Auth, tenant e base de dados canonica.
2. Sprint 2 - CRM minimo em PostgreSQL/Drizzle.
3. Sprint 3 - Produtos manuais e fornecedores basicos.
4. Sprint 4 - Propostas / quote builder canonico.
5. Sprint 5 - Checkout Asaas minimo.
6. Sprint 6 - Comissao simples e eventos financeiros.
7. Sprint 7 - Sites/vitrines conectados ao funil.
8. Sprint 8 - Grupos basicos.
9. Sprint 9 - Ledger inicial.

Observacao: se a cobranca real for requisito comercial imediato, o ledger inicial pode ser antecipado em versao minima junto da Sprint 5 e aprofundado na Sprint 9.

## 6. O que NAO fazer agora

- Marketplace aberto.
- Embedded finance.
- APIs complexas de fornecedores.
- Academy.
- App nativo.
- Aereo/GDS.
- Cotas e pagamento programado completo.
- IA copiloto avancado.
- Redesign visual amplo antes da fundacao.
- Migracao completa de billing sem auth/tenant claros.
- Reativar Supabase como backend principal.
- Reintroduzir Appwrite.
- Criar novas dependencias Supabase ou Appwrite.
- Remover legado financeiro antes de preservar historico e liquidar transacoes pendentes.
- Criar sites/vitrines que nao conectam com lead, proposta e checkout.

## 7. Proximo prompt sugerido

```txt
Voce esta trabalhando no projeto NORO Guru.

Antes de qualquer analise ou alteracao, leia:

- docs/ai/AGENTS.README.md
- docs/backlog/implementation/noro-foundation-sprint-plan.md
- docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md
- docs/architecture/current-state.md
- docs/architecture/data-auth-transition.md
- docs/architecture/multi-tenant-current-model.md
- docs/architecture/domains-cloudflare-dns-current-plan.md
- docs/architecture/billing-asaas-migration-plan.md
- docs/apps/README.md
- scripts/README.md

Execute apenas a Sprint 0 - Alinhamento documental e decisoes criticas.

Regras:
- nao implemente codigo;
- nao altere schema;
- nao rode migrations;
- nao instale dependencias;
- nao mova nem apague arquivos sem relatar antes;
- trate Supabase como legado/transicional;
- trate Appwrite como eliminado;
- trate Asaas como gateway vigente;
- use docs/conceito/ como visao-alvo, nao como implementacao existente.

Entrega esperada:
- revisar divergencias documentais relevantes para Sprint 0;
- propor o recorte MVP inicial;
- listar apps alvo e apps transicionais;
- listar decisoes que dependem do Paulo;
- criar ou atualizar apenas documentos de backlog/planejamento necessarios para registrar essas decisoes pendentes.
```
