# 08 — NORO Implementation Roadmap

> Roadmap estratégico de implantação da NORO Guru, conectando visão de produto, modelo H2B2H, billing, distribuição, fornecedores, Nomade Guru como tenant fundador e execução técnica em fases.

---

## 1. Objetivo

Este documento traduz a visão consolidada da NORO em uma sequência prática de implantação.

A NORO não deve tentar nascer completa.

Ela deve evoluir em fases, validando:

- produto;
- operação;
- pagamento;
- comissão;
- fornecedores;
- usuários;
- canais de distribuição;
- grupos;
- sites;
- IA;
- suporte.

A regra principal:

> primeiro validar fluxo econômico real; depois automatizar; depois escalar.

---

## 2. Princípio de implantação

A NORO deve ser construída como uma plataforma modular.

Cada fase precisa gerar valor mesmo antes da próxima existir.

```txt
Fase 0 — Estratégia e documentação
Fase 1 — Base SaaS / CRM / multi-tenant
Fase 2 — Propostas, produtos manuais e checkout
Fase 3 — Sites, vitrines e distribuição
Fase 4 — Grupos e líderes de viagem
Fase 5 — Billing avançado, comissão e ledger
Fase 6 — Fornecedores e APIs prioritárias
Fase 7 — Rede de consultores, creators e marketplace controlado
Fase 8 — Pagamento programado, cotas e cofre de viagem
Fase 9 — Academy, reputação e governança avançada
Fase 10 — Embedded finance e escala
```

---

## 3. Estratégia de execução

### 3.1 Não começar pelo marketplace aberto

Marketplace aberto exige:

- liquidez;
- confiança;
- reputação;
- suporte;
- governança;
- pagamentos;
- fornecedores;
- qualidade;
- resolução de conflitos.

Isso não deve ser o MVP.

### 3.2 Começar como infraestrutura operacional

O caminho mais seguro:

```txt
Nomade Guru como tenant fundador
+ poucos usuários reais
+ produtos manuais
+ checkout
+ propostas
+ comissão
+ validação operacional
```

### 3.3 Construir com operação assistida

No início, parte da operação pode ser manual ou semiautomática.

O objetivo é aprender:

- o que vende;
- o que dá margem;
- onde o cliente trava;
- onde o consultor precisa de ajuda;
- onde o financeiro quebra;
- quais produtos geram suporte.

### 3.4 Automatizar apenas o que se repete

A automação deve vir depois de fluxo validado.

Automatizar prematuramente cria software caro para problema errado.

---

## 4. Fase 0 — Consolidação estratégica

### 4.1 Objetivo

Fechar a visão da NORO antes de ajustar código.

### 4.2 Entregáveis

- `00_noro_unico_master_index.md`
- `01_unico_reverse_engineering.md`
- `02_noro_product_vision.md`
- `03_noro_business_model.md`
- `04_noro_h2b2h_marketplace.md`
- `05_noro_billing_payments_financial_layer.md`
- `06_noro_distribution_sites_and_agents.md`
- `07_noro_supplier_api_roadmap.md`
- `08_noro_implementation_roadmap.md`
- `09_gap_analysis_current_noro_vs_target_vision.md`

### 4.3 Decisões necessárias

- Qual será o MVP real?
- A Nomade será o primeiro tenant?
- Qual gateway será usado?
- Quais produtos entram primeiro?
- Quem pode vender?
- Como será calculada a comissão?
- Qual será o papel de pessoa física?

### 4.4 Status

Esta fase é a fase atual.

---

## 5. Fase 1 — Base SaaS / CRM / multi-tenant

### 5.1 Objetivo

Criar a base da plataforma.

A NORO precisa ser multi-tenant desde cedo, mesmo que simples.

### 5.2 Módulos

- autenticação;
- organizações/tenants;
- usuários;
- papéis e permissões;
- clientes;
- leads;
- oportunidades;
- tarefas;
- funil;
- configurações básicas do tenant;
- painel básico.

### 5.3 Papéis mínimos

```txt
admin_noro
tenant_owner
tenant_admin
consultant
sales_user
customer
```

Papéis futuros:

```txt
leader
creator
affiliate
supplier
finance_admin
support
```

### 5.4 Entidades mínimas

```txt
Tenant
User
Role
Customer
Lead
Opportunity
Task
Note
ActivityLog
```

### 5.5 Resultado esperado

Usuário/agência consegue:

- criar conta;
- criar organização;
- cadastrar clientes;
- registrar leads;
- acompanhar oportunidades;
- organizar tarefas.

### 5.6 Critério de conclusão

A Nomade Guru consegue usar a NORO como CRM operacional básico.

---

## 6. Fase 2 — Propostas, produtos manuais e checkout

### 6.1 Objetivo

Transformar a NORO de ferramenta organizacional em infraestrutura transacional.

Sem checkout, a NORO é apenas sistema.

Com checkout, a NORO começa a participar da economia da venda.

### 6.2 Módulos

- produtos manuais;
- fornecedores manuais;
- propostas;
- itens de proposta;
- cálculo de preço;
- margem;
- comissão estimada;
- status da proposta;
- link compartilhável;
- checkout;
- status de pagamento;
- recibo/comprovante;
- anexos/vouchers.

### 6.3 Produtos iniciais recomendados

- seguro viagem;
- visto/assessoria;
- tour;
- transfer;
- pacote manual;
- grupo simples;
- consultoria de viagem;
- produtos da Nomade.

### 6.4 Entidades mínimas

```txt
Supplier
Product
Quote
QuoteItem
Sale
Payment
PaymentStatus
CommissionEstimate
Attachment
Voucher
```

### 6.5 Gateway

Escolher um gateway inicial com:

- PIX;
- boleto;
- cartão;
- parcelamento;
- API;
- webhook;
- conciliação mínima.

### 6.6 Resultado esperado

A Nomade ou um tenant piloto consegue:

```txt
criar proposta
→ enviar link
→ cliente aprovar
→ cliente pagar
→ venda ser registrada
→ comissão ser estimada
```

### 6.7 Critério de conclusão

Primeiras vendas reais processadas pela plataforma.

---

## 7. Fase 3 — Sites, vitrines e distribuição

### 7.1 Objetivo

Transformar usuários da NORO em canais de distribuição.

### 7.2 Módulos

- site/vitrine do tenant;
- página pública de consultor;
- página de produto;
- página de proposta;
- formulário de lead;
- páginas de campanha;
- link rastreável;
- origem do lead;
- CTA para WhatsApp;
- integração com CRM.

### 7.3 Templates iniciais

- agência;
- consultor;
- produto;
- campanha;
- viagem em grupo simples;
- destino.

### 7.4 Entidades

```txt
Site
Page
PageTemplate
LeadForm
Campaign
TrackingLink
LeadSource
```

### 7.5 Resultado esperado

Um usuário consegue:

```txt
publicar página
→ compartilhar link
→ captar lead
→ criar proposta
→ receber pagamento
```

### 7.6 Critério de conclusão

Pelo menos 3 tipos de página gerando leads reais.

---

## 8. Fase 4 — Grupos e líderes de viagem

### 8.1 Objetivo

Criar o módulo de alto potencial H2B2H: viagens em grupo organizadas por líderes.

### 8.2 Módulos

- criação de viagem em grupo;
- lista de participantes;
- página pública do grupo;
- preço por passageiro;
- cobrança individual;
- status por participante;
- sinal + saldo;
- comissão do líder;
- comunicação do grupo;
- documentos por passageiro.

### 8.3 Tipos de grupo

- Disney/Orlando;
- Miami;
- igreja;
- escola;
- formatura;
- terceira idade;
- cruzeiro;
- evento/congresso;
- casamento;
- esportes;
- família.

### 8.4 Entidades

```txt
GroupTrip
GroupParticipant
ParticipantPayment
GroupLeader
GroupCommission
GroupPage
PaymentSchedule
```

### 8.5 Permissões

Líder de grupo deve poder:

- visualizar interessados;
- acompanhar pagamentos;
- compartilhar link;
- ver comissão estimada;
- enviar mensagens/modelos.

Mas não deve poder:

- alterar custo de fornecedor sem permissão;
- prometer condições não aprovadas;
- sacar dinheiro diretamente;
- emitir venda sem operador responsável.

### 8.6 Resultado esperado

Um líder consegue organizar uma viagem com pagamentos individuais rastreados.

### 8.7 Critério de conclusão

Primeiro grupo real vendido/operado pela Nomade ou tenant piloto.

---

## 9. Fase 5 — Billing avançado, comissão e ledger

### 9.1 Objetivo

Fortalecer a base financeira para escala.

### 9.2 Módulos

- ledger básico;
- eventos financeiros;
- comissões por papel;
- repasses;
- fornecedor a pagar;
- plataforma a receber;
- margem líquida;
- conciliação;
- reembolsos;
- chargeback;
- relatórios financeiros.

### 9.3 Entidades

```txt
LedgerEntry
Commission
Payout
SupplierPayable
PlatformFee
Refund
Chargeback
FinancialEvent
Settlement
```

### 9.4 Eventos mínimos

```txt
sale.created
payment.created
payment.confirmed
payment.failed
payment.refunded
commission.estimated
commission.confirmed
commission.available
commission.paid
supplier_payable.created
supplier_payable.paid
platform_fee.recorded
```

### 9.5 Resultado esperado

A NORO consegue responder:

- quanto entrou?
- quanto falta entrar?
- quanto é custo?
- quanto é margem?
- quanto é comissão?
- quanto a NORO ganha?
- quanto o fornecedor deve receber?
- quanto o consultor/líder deve receber?

### 9.6 Critério de conclusão

Relatório financeiro confiável por venda, tenant, consultor e produto.

---

## 10. Fase 6 — Fornecedores e APIs prioritárias

### 10.1 Objetivo

Conectar produtos reais à plataforma, sem complexidade excessiva.

### 10.2 Prioridade recomendada

```txt
1. seguro viagem
2. vistos/serviços
3. tours/experiências
4. transfers
5. hospedagem
6. cruzeiros/grupos
7. aéreo
```

### 10.3 Estratégia

Começar com Supplier Hub manual.

Depois integrar APIs.

### 10.4 Módulos

- Supplier Hub;
- regras comerciais;
- produtos globais;
- produtos do tenant;
- catálogo;
- disponibilidade manual;
- voucher;
- API abstraction layer;
- provider adapters.

### 10.5 Primeira API candidata

Possíveis candidatas:

- IMG Travel Insurance;
- outro seguro;
- Civitatis/GetYourGuide;
- LiteAPI;
- fornecedor com API simples e boa documentação.

### 10.6 Entidades

```txt
Supplier
SupplierProduct
SupplierRate
SupplierRule
SupplierIntegration
ProviderAdapter
Booking
Voucher
CancellationPolicy
```

### 10.7 Resultado esperado

Um produto de fornecedor pode ser vendido pela NORO com custo, margem, pagamento e documento vinculados.

### 10.8 Critério de conclusão

Primeira integração ou fluxo semiautomático operando ponta a ponta.

---

## 11. Fase 7 — Rede de consultores, creators e marketplace controlado

### 11.1 Objetivo

Ativar a camada humana de distribuição em escala controlada.

### 11.2 Módulos

- cadastro de consultores;
- perfis públicos;
- especialidades;
- destinos;
- aprovação;
- níveis;
- links de creator;
- campanhas;
- dashboard de comissão;
- matching manual/assistido;
- reputação interna.

### 11.3 Ordem recomendada

```txt
1. consultores conhecidos
2. creators selecionados
3. líderes de grupo
4. afiliados
5. marketplace controlado
```

### 11.4 Academy mínima

Antes de abrir a rede, criar trilhas básicas:

- como usar a NORO;
- como vender viagens;
- como criar proposta;
- como divulgar;
- como tratar pagamentos;
- ética e limites de promessa;
- suporte e responsabilidade.

### 11.5 Entidades

```txt
AdvisorProfile
Specialty
Certification
CreatorCampaign
AffiliateLink
ReputationScore
Assignment
```

### 11.6 Resultado esperado

Usuários externos conseguem gerar leads/vendas de forma rastreável.

### 11.7 Critério de conclusão

Primeiras vendas originadas por consultores/creators/líderes fora da Nomade.

---

## 12. Fase 8 — Pagamento programado, cotas e cofre de viagem

### 12.1 Objetivo

Criar uma solução brasileira para viagens futuras e presentes coletivos.

### 12.2 Módulos

- pagamento programado;
- cotas de lua de mel;
- presente de viagem;
- cofre/caixinha de viagem;
- contribuição de terceiros;
- saldo vinculado à viagem;
- regras de cancelamento;
- recibos;
- lembretes.

### 12.3 Cuidados

Não usar termos como:

- consórcio;
- investimento;
- rendimento;
- poupança;
- contemplação.

### 12.4 Entidades

```txt
TravelFund
TravelFundContribution
PaymentPlan
ScheduledPayment
GiftQuota
ContributionMessage
FundRule
```

### 12.5 Resultado esperado

Cliente ou grupo consegue pagar uma viagem ao longo do tempo ou receber contribuições.

### 12.6 Critério de conclusão

Primeira campanha de cotas/pagamento programado operada com segurança jurídica e financeira.

---

## 13. Fase 9 — Academy, reputação e governança avançada

### 13.1 Objetivo

Garantir qualidade e profissionalização da rede.

### 13.2 Módulos

- Academy;
- trilhas;
- certificações;
- testes;
- selos;
- reputação;
- avaliações;
- regras por nível;
- auditoria;
- suporte;
- política de qualidade.

### 13.3 Trilhas recomendadas

- fundamentos de turismo;
- uso da NORO;
- atendimento consultivo;
- vendas;
- grupos;
- IA aplicada ao turismo;
- fornecedores;
- seguros;
- vistos;
- Disney/Orlando;
- cruzeiros;
- ética e compliance.

### 13.4 Entidades

```txt
Course
Lesson
Certification
Badge
Review
QualityScore
SupportCase
Policy
```

### 13.5 Resultado esperado

A NORO consegue escalar rede sem perder qualidade.

### 13.6 Critério de conclusão

Permissões importantes vinculadas a certificações ou níveis.

---

## 14. Fase 10 — Embedded finance e escala

### 14.1 Objetivo

Evoluir a camada financeira para vantagem competitiva.

### 14.2 Possibilidades

- taxas negociadas por volume;
- antecipação de recebíveis;
- crédito para viagem;
- financiamento;
- conta de pagamento via parceiro;
- wallet;
- cartão;
- split avançado;
- condições financeiras para agências;
- produtos financeiros white-label.

### 14.3 Estratégia

Começar via parceiros regulados.

A NORO não deve assumir complexidade regulatória antes de validar volume e demanda.

### 14.4 Resultado esperado

A NORO passa a oferecer condições financeiras que pequenos vendedores isoladamente não conseguiriam acessar.

### 14.5 Critério de conclusão

Primeiro produto financeiro operando com parceiro e compliance adequado.

---

## 15. MVP recomendado

O MVP inicial deve ser enxuto e transacional.

### 15.1 Entrar no MVP

- multi-tenant básico;
- usuários e papéis;
- CRM simples;
- clientes;
- leads;
- produtos manuais;
- fornecedores manuais;
- propostas;
- link de proposta;
- cálculo de margem simples;
- checkout;
- status de pagamento;
- comissão estimada;
- página/vitrine simples;
- IA para texto/roteiro/proposta;
- dashboard básico.

### 15.2 Não entrar no MVP

- marketplace aberto;
- app nativo;
- aéreo/GDS;
- múltiplas APIs;
- pagamento programado completo;
- cotas;
- fintech;
- split avançado;
- reputação pública;
- Academy completa;
- matching automático.

### 15.3 Critério de sucesso do MVP

O MVP tem sucesso se permitir:

```txt
criar uma proposta real
→ enviar ao cliente
→ receber pagamento
→ calcular margem/comissão
→ registrar produto/fornecedor
→ acompanhar status
```

---

## 16. Primeiros casos de uso recomendados

### 16.1 Caso 1 — Nomade vende seguro viagem

Objetivo:

- validar produto simples;
- testar checkout;
- testar comissão;
- testar documento;
- testar fluxo de venda.

### 16.2 Caso 2 — Nomade vende consultoria de visto

Objetivo:

- validar serviço;
- checklist;
- pagamento;
- acompanhamento;
- conexão com Vistos.Guru.

### 16.3 Caso 3 — Pacote/manual para grupo

Objetivo:

- validar GMV maior;
- cobrar passageiros;
- controlar status;
- testar líder de grupo.

### 16.4 Caso 4 — Consultor parceiro cria proposta

Objetivo:

- validar uso por terceiro;
- testar permissões;
- testar comissão;
- testar suporte.

### 16.5 Caso 5 — Site/vitrine capta lead

Objetivo:

- validar distribuição;
- rastrear origem;
- converter em proposta.

---

## 17. Arquitetura mínima sugerida

### 17.1 Domínios de negócio

```txt
Identity & Access
Tenancy
CRM
Products
Suppliers
Quotes
Sales
Payments
Commissions
Sites
Groups
AI Assistant
Reports
```

### 17.2 Serviços/módulos

```txt
auth
tenant
crm
product
supplier
quote
billing
commission
site
group
ai
notification
reporting
```

### 17.3 Eventos importantes

```txt
lead.created
quote.sent
quote.accepted
sale.created
payment.confirmed
commission.estimated
voucher.uploaded
group.participant_joined
site.lead_created
```

### 17.4 Observação

Mesmo em monólito modular, os domínios devem estar claros.

---

## 18. Dados mínimos do MVP

### 18.1 Tabelas/entidades prováveis

```txt
tenants
users
roles
memberships
customers
leads
opportunities
tasks
suppliers
products
quotes
quote_items
sales
payments
commissions
sites
pages
forms
attachments
activity_logs
```

### 18.2 Futuras tabelas

```txt
group_trips
group_participants
ledger_entries
payouts
supplier_payables
travel_funds
certifications
advisor_profiles
creator_campaigns
affiliate_links
provider_integrations
```

---

## 19. Sequência técnica recomendada

### Sprint 1 — Fundamento

- revisar arquitetura atual;
- garantir multi-tenant;
- papéis;
- CRM básico;
- clientes/leads.

### Sprint 2 — Produtos e fornecedores manuais

- Supplier Hub básico;
- produtos;
- custos;
- preços;
- anexos.

### Sprint 3 — Propostas

- quote builder;
- itens;
- margem;
- link público;
- aceite.

### Sprint 4 — Checkout

- gateway;
- payment link;
- webhooks;
- status;
- comprovante.

### Sprint 5 — Comissão simples

- regra simples;
- comissão estimada;
- comissão confirmada;
- dashboard.

### Sprint 6 — Sites/vitrines

- template básico;
- formulário;
- lead source;
- páginas públicas.

### Sprint 7 — Grupos básicos

- grupo;
- participantes;
- pagamentos individuais;
- status.

### Sprint 8 — Ledger inicial

- eventos financeiros;
- relatórios;
- repasses manuais.

---

## 20. Auditoria do projeto atual

Após consolidar estes documentos, o próximo passo é analisar o repositório atual da NORO.

A auditoria deve responder:

1. O que já existe?
2. O que está alinhado com a visão?
3. O que precisa ser refatorado?
4. O que deve ser mantido?
5. O que deve ser descartado?
6. O que precisa entrar no schema?
7. Quais módulos faltam?
8. Qual é a próxima sprint real?
9. O código aguenta multi-tenant?
10. O billing está preparado?
11. O site builder está no caminho certo?
12. O app atual está tentando fazer coisa demais?

Documento futuro:

```txt
09_gap_analysis_current_noro_vs_target_vision.md
```

---

## 21. Prompt futuro para Codex/Claude Code

Após a auditoria, um prompt de implementação deve pedir:

```txt
Leia todos os documentos em /docs/strategy.
Compare a visão estratégica com o estado atual do código.
Mapeie módulos existentes, ausentes e desalinhados.
Não implemente nada ainda.
Gere um relatório técnico com:
- arquitetura atual
- gaps
- riscos
- schema necessário
- plano de sprints
- prioridades
- arquivos impactados
```

Depois disso, sim, a implementação pode começar.

---

## 22. Riscos de implantação

### 22.1 Tentar construir tudo ao mesmo tempo

Mitigação:

- roadmap por fases;
- MVP transacional;
- operação assistida.

### 22.2 Código atual puxar estratégia para baixo

Mitigação:

- definir visão antes da auditoria;
- confrontar código com visão, não o contrário.

### 22.3 Construir marketplace antes do financeiro

Mitigação:

- checkout e comissão primeiro.

### 22.4 Integrar APIs antes de vender manualmente

Mitigação:

- Supplier Hub manual-first.

### 22.5 Ignorar juridicamente pessoa física e grupos

Mitigação:

- papel de líder/indicador;
- operador responsável;
- contratos e termos.

### 22.6 Subestimar suporte

Mitigação:

- poucos produtos no início;
- operação assistida;
- templates;
- base de conhecimento.

---

## 23. Prioridade absoluta

A prioridade absoluta da NORO deve ser:

```txt
proposta
+ pagamento
+ margem
+ comissão
+ fornecedor
+ cliente
```

Se isso funcionar, o resto pode crescer.

Se isso não funcionar, site, IA, marketplace e app viram decoração.

---

## 24. Critérios de pronto para ir ao GitHub

Antes de confrontar o código, ter os documentos:

- visão;
- modelo de negócio;
- H2B2H;
- billing;
- distribuição;
- fornecedores;
- roadmap.

Depois, auditar o repositório.

### Checklist

```txt
[x] visão consolidada
[x] modelo de negócio
[x] H2B2H
[x] billing/financial layer
[x] distribuição/sites/agentes
[x] supplier/API roadmap
[x] implementation roadmap
[ ] gap analysis do código atual
```

---

## 25. Conclusão

A NORO deve ser implantada como uma infraestrutura modular e transacional para turismo.

O erro seria tentar começar pelo sonho completo.

O caminho correto é:

```txt
CRM simples
→ proposta
→ checkout
→ comissão
→ sites
→ grupos
→ fornecedores
→ ledger
→ rede
→ APIs
→ pagamento programado
→ embedded finance
```

A visão é grande, mas a execução precisa ser pequena, testável e cumulativa.

Frase central:

> A NORO só vira plataforma quando consegue transformar uma demanda de viagem em venda paga, com margem calculada, comissão rastreável e operação acompanhada.

Esse é o primeiro grande marco.
