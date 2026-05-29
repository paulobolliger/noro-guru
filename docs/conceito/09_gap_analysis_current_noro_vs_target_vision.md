# Gap analysis: NORO atual vs visao estrategica

Status: analise documental e tecnica para planejamento.

Data de referencia: 2026-05-27

Fonte de arquitetura vigente: `docs/architecture/`

Fonte de visao aspiracional: `docs/conceito/`

## 1. Resumo executivo

O projeto NORO Guru esta em uma fase de transicao arquitetural. Existe um monorepo modular com apps separados, pacotes compartilhados, documentacao vigente clara e uma direcao definida para PostgreSQL, Drizzle, Logto e Asaas. Ao mesmo tempo, parte relevante do codigo funcional ainda depende de Supabase, fluxos financeiros antigos e servicos transicionais desativados.

A distancia para a visao estrategica e alta. A visao em `docs/conceito/` descreve uma plataforma H2B2H com CRM, produtos, fornecedores, propostas, checkout, comissoes, ledger, sites, grupos, creators, marketplace, IA e verticais. O codigo atual tem pecas iniciais ou legadas de varios desses blocos, mas ainda nao possui uma fundacao canonica completa de tenant, auth, dados e financeiro para sustentar a plataforma.

O maior risco e implementar funcionalidades estrategicas novas sobre bases transicionais: Supabase legado, auth incompleto, billing antigo e modelo multi-tenant ainda nao consolidado em PostgreSQL/Drizzle.

A proxima prioridade deve ser estabilizar a fundacao: Logto operacional no runtime, modelo multi-tenant canonico em PostgreSQL/Drizzle, repositorios de dados oficiais e uma primeira linha financeira orientada a Asaas antes de expandir CRM, propostas, sites e marketplace.

## 2. Mapa visao-alvo vs. codigo atual

| Dominio estrategico | Status atual | Evidencia no codigo/documentacao | Gap identificado | Prioridade |
| --- | --- | --- | --- | --- |
| Multi-tenant | parcial / legado | `docs/architecture/multi-tenant-current-model.md`; migracoes Supabase com `tenant_id`; usos em `apps/control`, `apps/financeiro` e `packages/lib/services/tenantService.ts` | Ha modelo documentado, mas implementacao ativa ainda aparece em Supabase e parametros avulsos. Falta modelo canonico em Drizzle com resolucao/autorizacao central. | Alta |
| Auth / Logto | parcial | `packages/auth/index.ts` expoe config Logto; `packages/lib/services/authService.ts` esta desativado; `apps/control` ainda usa Supabase Auth | Logto esta definido como direcao, mas nao integrado de ponta a ponta nos apps. | Alta |
| PostgreSQL / Drizzle | parcial | `packages/db/index.ts`; `DATABASE_URL`; dependencia `drizzle-orm` | Existe cliente/conexao, mas nao foram encontrados schemas Drizzle canonicos nem repositorios por dominio. | Alta |
| Supabase legado | legado | `supabase/FROZEN.md`; `apps/control/lib/supabase*`; `packages/lib/supabase/*`; `apps/sites/lib/get-site.ts`; `apps/web/app/api/sites/generate/route.ts` | Ainda ha uso ativo em apps. Deve ser tratado como transicional e nao como base para nova implementacao. | Alta |
| CRM / leads / clientes | parcial / legado | `apps/control/app/(protected)/leads`, `clientes`; `packages/lib/services/crmService.ts`; migracoes Supabase | Existem telas e partes de fluxo, mas dependem de Supabase ou `runtimeCrud` desativado. Falta dominio CRM oficial em Drizzle. | Alta |
| Propostas / quote builder | parcial | `apps/control/app/(protected)/orcamentos`; `NovoOrcamentoForm.tsx`; rota de IA para proposta | Ha UI e logica de orcamento manual, mas o modelo nao esta consolidado na arquitetura nova. | Alta |
| Produtos manuais | parcial | Itens manuais em orcamentos com tipos, margem e comissao; docs conceituais de produtos | Nao ha catalogo canonico de produtos manuais em PostgreSQL/Drizzle. | Media |
| Fornecedores / Supplier Hub | ausente / futuro | Docs `04`, `07`, `08`; referencias conceituais | Nao foi identificada implementacao canonica de Supplier Hub, contratos, disponibilidade ou APIs de fornecedor. | Media |
| Checkout / Asaas | ausente | `docs/architecture/billing-asaas-migration-plan.md`; referencias placeholder em `apps/billing`; ausencia de cliente/webhook Asaas | Asaas e direcao vigente, mas nao ha provider, checkout, webhook ou reconciliacao implementados. | Alta |
| Billing / comissao | parcial / legado | `apps/billing` com Stripe/Cielo; `apps/control/.../pedidos/providers`; migracoes Supabase de billing | Existem fluxos antigos e transicionais, mas nao ha motor canonico de comissao alinhado a Asaas. | Alta |
| Ledger financeiro | parcial / legado | `supabase/migrations/...cp-billing-finance-stage.sql`; `apps/financeiro`; docs de billing | Ha modelagem historica e UI financeira, mas APIs e servicos aparecem desativados ou legados. Falta ledger oficial em Drizzle. | Alta |
| Sites / vitrines | parcial / legado | `apps/sites`; `packages/renderer`; `packages/types/src/blueprint`; `apps/web/app/api/sites/generate/route.ts` | Existe renderer/blueprint e gerador IA, mas leitura/gravação ainda passa por Supabase e tenant temporario. | Media |
| Grupos / lideres de viagem | futuro | Docs conceituais e roadmap | Nao foi identificada implementacao funcional de grupos, lideres, governanca ou pagamentos por grupo. | Media |
| Creators / afiliados | futuro | Docs conceituais | Nao foi identificada camada de afiliados, tracking, atribuição ou comissionamento de creators. | Baixa / Media |
| IA copiloto | parcial | Rota `apps/control/app/(protected)/api/gerar-roteiro-proposta`; `apps/web` com OpenAI; `apps/visa-api` com Gemini | Existem usos pontuais de IA, mas nao um copiloto transversal com contexto, permissoes e memoria por tenant. | Media |
| Academy | futuro | Docs conceituais | Nao foi identificada implementacao de Academy, trilhas, conteudo, progresso ou certificacao. | Baixa |
| Marketplace H2B2H | futuro | `docs/conceito/04_noro_h2b2h_marketplace.md` | O marketplace e direcao estrategica posterior; nao ha core transacional suficiente para sustenta-lo hoje. | Baixa / Media |
| APIs de fornecedores | futuro | `docs/conceito/07_noro_supplier_api_roadmap.md` | Nao ha camada padrao de adapters, credenciais, webhooks, SLA ou normalizacao de fornecedores. | Baixa / Media |
| Vistos / SafeTrip / Nomade como verticais | parcial | `apps/visa-api`; docs de dominios; docs conceituais | Visa API existe como app separado, mas ainda precisa alinhar auth, tenant, dados e dominio oficial. SafeTrip/Nomade estao mais conceituais. | Media |
| Apps e dominios | parcial | `docs/apps/README.md`; `docs/architecture/domains-cloudflare-dns-current-plan.md`; apps `control`, `core`, `sites`, `billing`, `financeiro`, `visa-api`, `web` | Ha inventario e dominios oficiais, mas alguns apps sao transicionais e documentos ainda podem divergir sobre dominios antigos. | Alta |
| Scripts / migrations / seeds | parcial / legado | `scripts/README.md`; guards de Appwrite e legado; `supabase/FROZEN.md` | Existem guards uteis, mas migracoes Supabase estao congeladas e nao ha pipeline novo de migracoes Drizzle documentado no codigo analisado. | Alta |

## 3. O que ja existe e deve ser preservado

- Separacao em monorepo com `apps/` e `packages/`, adequada para a visao modular da NORO.
- `packages/db` como ponto oficial para PostgreSQL via `DATABASE_URL`.
- `packages/auth` como ponto oficial para configuracao Logto.
- `docs/architecture/` como fonte de verdade da arquitetura vigente.
- `docs/conceito/` como camada estrategica aspiracional, sem status de implementacao.
- `scripts/guard-no-appwrite.mjs`, que ajuda a manter Appwrite eliminado.
- `scripts/guard-legacy-references.mjs`, que ajuda a impedir expansao indevida de Supabase e billing legado.
- `apps/control` como base operacional historica para CRM, clientes, orcamentos e pedidos.
- `packages/renderer` e `packages/types/src/blueprint`, que apontam para uma fundacao reaproveitavel de sites/vitrines.
- `apps/sites` como app candidato para vitrines, desde que migrado para dados e tenant canonicos.
- `apps/visa-api` como vertical existente para vistos, ainda precisando alinhar arquitetura.
- Documentacao de transicao em `data-auth-transition`, `multi-tenant-current-model` e `billing-asaas-migration-plan`.

## 4. O que existe mas esta legado/transicional

- `supabase/`: congelado por `supabase/FROZEN.md`; nao deve orientar implementacao nova.
- Clientes Supabase em `apps/control`, `apps/sites`, `apps/web` e `packages/lib/supabase`.
- Supabase Auth em `apps/control`, apesar da decisao vigente por Logto.
- Migracoes Supabase com CRM, billing, finance, sites e tenant: uteis como historico, nao como fonte de execucao.
- `packages/lib/services/runtimeCrud.ts`: camada transicional desativada que bloqueia servicos antigos.
- `packages/lib/services/crmService.ts`, `financeiroService.ts`, `tenantService.ts` e `visaService.ts`: dependem de camada desativada ou conceitos antigos.
- `apps/billing`: contem fluxo legado com Stripe/Cielo e nao representa o futuro Asaas.
- Providers de pagamento antigos em `apps/control` e `apps/core`, incluindo Stripe, Cielo, BTG e eRede.
- `apps/financeiro`: possui UI e rotas, mas muitas APIs estao desativadas com status 410 ou dependem de modelo antigo.
- `apps/core`: contem varias actions legadas desativadas.
- Referencias antigas a dominios como `control`, `core` e dominio de vistos quando usadas como destino final.
- Appwrite: eliminado como alvo arquitetural; deve continuar bloqueado.

## 5. O que esta parcialmente construido

- Fundacao PostgreSQL/Drizzle: existe cliente e dependencia, mas falta schema e camada de repositorios.
- Fundacao Logto: existe configuracao, mas falta uso runtime real nos apps.
- Multi-tenant: existe documentacao e rastros de `tenant_id`, mas falta resolucao/autorizacao central fora de Supabase.
- CRM: telas e fluxos em `apps/control`, mas ainda presos a Supabase ou a servicos desativados.
- Quote builder: ha formulario de orcamento com itens, margem e comissao, mas sem modelo canonico.
- Sites/vitrines: renderer e blueprints existem, mas persistencia e tenant ainda dependem de Supabase.
- IA: existem usos pontuais para roteiros/propostas, geracao de sites e visto, mas nao um copiloto de plataforma.
- Financeiro: ha app e modelagens historicas, mas falta ledger oficial e integracao com Asaas.
- Vertical de vistos: existe app, mas precisa ser integrado ao modelo comum de auth, tenant e dados.

## 6. O que esta ausente

- Schemas Drizzle canonicos para tenants, users, memberships, leads, clientes, produtos, propostas, pedidos, pagamentos, comissoes e ledger.
- Integracao Logto completa nos apps.
- Cliente Asaas, webhooks Asaas, conciliacao e modelo de charge/payment/subscription vigente.
- Motor simples de comissao com regras auditaveis.
- Ledger financeiro canonico em PostgreSQL/Drizzle.
- Supplier Hub com fornecedores, contratos, disponibilidade, tarifas, credenciais e normalizacao.
- Catalogo de produtos manuais e produtos de fornecedores.
- Fluxo transacional completo: lead -> cliente -> proposta -> checkout -> pagamento -> comissao -> ledger.
- Grupos e lideres de viagem com governanca, cotas, repasses e papeis.
- Creators/afiliados com tracking, atribuição e pagamento.
- Academy com conteudo, trilhas, progresso e permissao por perfil.
- Marketplace H2B2H funcional.
- API padronizada para fornecedores externos.
- Politica operacional para quais apps serao preservados, migrados, fundidos ou arquivados.

## 7. Riscos tecnicos

- Multi-tenant: risco de divergencia entre tenant em URL, tenant em auth, tenant em dados e tenant usado em billing.
- Auth: risco de manter Supabase Auth ativo em parte do produto enquanto Logto e a arquitetura vigente.
- Dados: risco de duplicar modelos entre Supabase historico, Drizzle novo e servicos transicionais desativados.
- Billing: risco alto de misturar Stripe/Cielo/BTG/eRede com Asaas antes de definir o modelo financeiro oficial.
- Supabase legado: risco de reativar migracoes congeladas ou usar tabelas antigas como base de produto novo.
- Dominios: risco de documentos antigos induzirem uso de dominios que nao sao finais.
- Acoplamento entre apps: `control`, `core`, `billing`, `financeiro`, `sites` e `web` tem responsabilidades sobrepostas.
- Documentacao divergente: docs conceituais sao ricas, mas nao podem ser lidas como implementacao.
- Marketplace/API/fintech prematuros: construir essas camadas antes de ledger, tenant, auth e checkout aumenta custo de retrabalho.

## 8. Riscos de produto

- Tentar construir CRM, marketplace, sites, IA, grupos, fornecedores e financeiro ao mesmo tempo pode diluir o MVP.
- Confundir CRM com plataforma: CRM e um primeiro fluxo, nao a arquitetura inteira.
- Marketplace cedo demais pode criar promessa comercial sem inventario, pagamento, SLA e governanca.
- IA como maquiagem: IA sem dados confiaveis, permissoes e workflows claros tende a gerar demonstracao, nao produto.
- Sites sem transacao viram vitrine isolada, sem fechar o ciclo de venda.
- Billing sem ledger cria cobranca sem rastreabilidade financeira.
- Grupos sem governanca criam risco de responsabilidade, repasse, cancelamento e suporte.
- Verticais como vistos, SafeTrip e Nomade precisam compartilhar fundacao, nao virar produtos paralelos desconectados.

## 9. Prioridade recomendada de implementacao

- Sprint 0 - ajustes documentais e alinhamentos criticos: corrigir divergencias de dominios, confirmar MVP, congelar ainda mais referencias legadas e decidir quais apps seguem ativos.
- Sprint 1 - multi-tenant/auth/dados: Logto runtime, tenants/memberships em Drizzle, autorizacao central e repositorios base.
- Sprint 2 - CRM/leads/clientes: migrar o fluxo minimo para PostgreSQL/Drizzle e remover dependencia operacional de Supabase no caminho novo.
- Sprint 3 - produtos manuais/fornecedores basicos: criar catalogo manual, fornecedores simples e precificacao inicial.
- Sprint 4 - propostas: consolidar quote builder, itens, margem, versoes, status e aceite.
- Sprint 5 - checkout Asaas: implementar provider Asaas, cobranca, webhook, idempotencia e estados de pagamento.
- Sprint 6 - comissao simples: calcular comissao por proposta/pagamento e registrar eventos auditaveis.
- Sprint 7 - sites/vitrines: conectar blueprints/sites ao tenant e ao funil transacional canonico.
- Sprint 8 - grupos basicos: criar entidade de grupo, lider, participantes, proposta coletiva e regras minimas.
- Sprint 9 - ledger inicial: consolidar lancamentos financeiros de pagamento, comissao, repasse e conciliacao.

Academy, creators, marketplace H2B2H amplo, APIs de fornecedores e embedded finance devem vir depois que o fluxo transacional minimo estiver confiavel.

## 10. Decisoes que precisam de aprovacao humana

- Qual e o MVP oficial: CRM + propostas + checkout ou outro recorte.
- Se `apps/control` sera migrado, substituido por `apps/core` ou mantido como backoffice transicional.
- Quais apps devem permanecer como produtos finais: `control`, `core`, `billing`, `financeiro`, `sites`, `visa-api`, `web`.
- Como Nomade entra: tenant inicial, vertical, parceiro ou exemplo conceitual.
- Modelo multi-tenant final: tenant por agencia, por operador, por marca ou por unidade de negocio.
- Regras de permissao por papel: owner, admin, consultor, financeiro, lider de grupo, creator e fornecedor.
- Modelo Asaas: conta unica, subcontas, split, boleto, pix, cartao, assinatura e antecipacao.
- Modelo de comissao: por consultor, produto, fornecedor, grupo, creator, margem ou regra customizada.
- Nivel minimo do ledger para o MVP.
- Politica de migracao ou descarte de dados Supabase.
- Qual vertical vem primeiro: turismo/Nomade, vistos, SafeTrip ou sites.
- Quando iniciar marketplace e Supplier APIs sem comprometer o core transacional.
- Politica de IA: provedor, custos, logs, privacidade, contexto e limites por tenant.

## 11. Recomendacoes finais

O projeto esta pronto para uma implementacao focada de fundacao e para refatoracao orientada por arquitetura. Ele ainda nao esta pronto para implementar a visao completa de marketplace, fintech, Supplier APIs, Academy, creators e grupos em paralelo.

A recomendacao e tratar o proximo ciclo como construcao do trilho principal: tenant, auth, dados, CRM minimo, proposta, checkout Asaas, comissao simples e ledger inicial. So depois disso sites, grupos, IA e marketplace devem ser conectados como extensoes do fluxo transacional, nao como ilhas.

Tambem e recomendado manter `docs/conceito/` como referencia estrategica e atualizar `docs/architecture/` apenas quando houver decisao aprovada e implementacao real. Qualquer novo desenvolvimento deve evitar Supabase e Appwrite, e deve considerar Stripe, Cielo, BTG e eRede como historico/transicional.

## Arquivos lidos

- `docs/ai/AGENTS.README.md`
- `docs/conceito/RELATORIO_LIMPEZA_CONCEITO.md`
- `docs/architecture/current-state.md`
- `docs/analise-documentacao-md-projeto.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/apps/README.md`
- `scripts/README.md`
- `docs/conceito/00_noro_unico_master_index.md`
- `docs/conceito/01_unico_reverse_engineering.md`
- `docs/conceito/02_noro_product_vision.md`
- `docs/conceito/03_noro_business_model.md`
- `docs/conceito/04_noro_h2b2h_marketplace.md`
- `docs/conceito/05_noro_billing_payments_financial_layer.md`
- `docs/conceito/06_noro_distribution_sites_and_agents.md`
- `docs/conceito/07_noro_supplier_api_roadmap.md`
- `docs/conceito/08_noro_implementation_roadmap.md`

## Arquivos e areas analisados no codigo

- `package.json`
- `turbo.json`
- `apps/`
- `apps/control/`
- `apps/core/`
- `apps/sites/`
- `apps/billing/`
- `apps/financeiro/`
- `apps/visa-api/`
- `apps/web/`
- `packages/`
- `packages/db/`
- `packages/auth/`
- `packages/lib/`
- `packages/renderer/`
- `packages/types/`
- `scripts/`
- `supabase/`

## Arquivo criado

- `docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md`
