# Relatorio De Limpeza Conceito

Data de referencia: 2026-05-27

Status: auditoria documental preparatoria. Nao representa implementacao.

## 1. Resumo Executivo

A pasta `docs/conceito/` esta consistente como base estrategica/aspiracional da NORO. Os 9 documentos principais existem, estao legiveis e formam uma sequencia coerente: origem estrategica, visao de produto, modelo de negocio, H2B2H, financeiro, distribuicao, fornecedores/APIs e roadmap.

A documentacao esta pronta para servir de base para a proxima analise de gap, desde que seja tratada explicitamente como visao alvo. A arquitetura vigente continua sendo definida por `docs/architecture/`, `docs/apps/`, `scripts/README.md` e `supabase/FROZEN.md`.

O principal cuidado para a proxima etapa e nao confundir conceitos futuros como marketplace, ledger, cotas, redes de consultores, Supplier Hub e embedded finance com codigo implementado. A proxima analise deve comparar esses alvos com o estado real do repositorio.

## 2. Validacao Do AGENTS.README

`docs/ai/AGENTS.README.md` existe e esta claro.

Ele esta alinhado com a documentacao vigente porque estabelece:

- `docs/architecture/`, `docs/apps/`, `docs/design/` e `scripts/README.md` como fontes principais de estado atual;
- `docs/backlog/` como planos futuros;
- `docs/archive/` como historico;
- `docs/conceito/` como conceitos aspiracionais;
- PostgreSQL via `DATABASE_URL`, Drizzle e Logto como direcao atual;
- Asaas como gateway financeiro principal para novos fluxos;
- Supabase como legado/transicional;
- Appwrite como alvo arquitetural eliminado.

Nao foi encontrado outro arquivo equivalente em local melhor. O caminho recomendado para agentes permanece:

```txt
docs/ai/AGENTS.README.md
```

Observacao: o arquivo cumpre bem o papel de guia generico para agentes. Ele deve permanecer separado de prompts especificos de ferramentas.

## 3. Inventario De `docs/conceito/`

| Arquivo | Classificacao | Observacao |
| --- | --- | --- |
| `00_noro_unico_master_index.md` | essencial | Indice mestre e tese central. Deve permanecer em `docs/conceito/`. |
| `01_unico_reverse_engineering.md` | essencial | Preserva origem historica da tese Unico sem reativar a marca como implementacao. |
| `02_noro_product_vision.md` | essencial | Define visao de produto alvo e MVP aspiracional. |
| `03_noro_business_model.md` | essencial | Define modelo economico, receitas, planos e riscos. |
| `04_noro_h2b2h_marketplace.md` | essencial | Define a camada H2B2H/rede humana como visao estrategica futura. |
| `05_noro_billing_payments_financial_layer.md` | essencial | Define camada financeira alvo; deve ser cruzado com plano vigente Asaas. |
| `06_noro_distribution_sites_and_agents.md` | essencial | Define distribuicao, sites, agentes, creators e canais. |
| `07_noro_supplier_api_roadmap.md` | essencial | Define Supplier/API roadmap aspiracional e abordagem manual-first. |
| `08_noro_implementation_roadmap.md` | essencial | Roadmap estrategico e ponte para a futura gap analysis. |

Nao foram encontrados arquivos duplicados, historicos ou candidatos imediatos a arquivamento dentro de `docs/conceito/`.

## 4. Validacao Dos 9 Documentos Estrategicos

| Documento | Existe? | Legivel? | Funcao | Conflitos com arquitetura vigente | Permanecer em `docs/conceito/`? |
| --- | --- | --- | --- | --- | --- |
| `00_noro_unico_master_index.md` | Sim | Sim | Indice e tese consolidada NORO/Unico. | Cita caminho futuro `/docs/strategy/`, enquanto a pasta atual e `docs/conceito/`; lista gateway como decisao pendente em um ponto, mas a arquitetura vigente ja aponta Asaas. | Sim |
| `01_unico_reverse_engineering.md` | Sim | Sim | Recuperar DNA estrategico da Unico e traduzir para NORO. | Sem conflito operacional se tratado como historico conceitual; risco apenas se alguem tentar ressuscitar Unico como marca/produto ativo. | Sim |
| `02_noro_product_vision.md` | Sim | Sim | Definir visao de produto e MVP alvo. | Lista funcionalidades futuras que ainda nao devem ser assumidas como implementadas: marketplace, ledger, grupos, cotas, academy, Supplier Hub. | Sim |
| `03_noro_business_model.md` | Sim | Sim | Definir modelo economico, planos, take rate e monetizacao. | Nao conflita com estado atual, mas depende de decisoes juridicas/financeiras ainda pendentes. | Sim |
| `04_noro_h2b2h_marketplace.md` | Sim | Sim | Definir rede humana, consultores, creators, afiliados e lideres. | Marketplace/rede aberta ainda nao e arquitetura vigente nem codigo pronto; deve continuar como fase futura. | Sim |
| `05_noro_billing_payments_financial_layer.md` | Sim | Sim | Definir visao financeira ampla: checkout, comissao, ledger, repasses, cotas. | Fala em escolha de gateway ainda aberta, enquanto `docs/architecture/billing-asaas-migration-plan.md` ja define Asaas como gateway principal. | Sim |
| `06_noro_distribution_sites_and_agents.md` | Sim | Sim | Definir sites/vitrines como motor de distribuicao. | Exemplos de dominio incluem opcoes aspiracionais como `nomade.noro.guru`; vigencia atual deve seguir `sites.noro.guru` e `*.sites.noro.guru`. | Sim |
| `07_noro_supplier_api_roadmap.md` | Sim | Sim | Definir roadmap de fornecedores e APIs. | Sem conflito se mantido manual-first; nao deve justificar integracoes API antes da migracao de dados/auth/billing. | Sim |
| `08_noro_implementation_roadmap.md` | Sim | Sim | Organizar fases de implantacao e preparar gap analysis. | Deve ser confrontado com `current-state.md`; algumas fases pressupoe bases ainda transicionais no codigo atual. | Sim |

## 5. Conflitos E Riscos

### Auth

Documentacao vigente:

- Logto em `packages/auth` e a camada oficial;
- Supabase Auth e legado/transicional;
- coexistencia Supabase/Logto deve ser curta e rastreada.

Risco em `docs/conceito/`:

- Os documentos conceituais falam genericamente em usuarios, papeis e perfis, mas nao reforcam sempre Logto como auth oficial.

Acao recomendada:

- Na gap analysis, mapear cada papel estrategico para identidade Logto + memberships em PostgreSQL.

### Banco de dados

Documentacao vigente:

- PostgreSQL via `DATABASE_URL`;
- Drizzle em `packages/db`;
- Supabase client/migrations/storage como legado transicional.

Risco em `docs/conceito/`:

- Roadmaps citam varias entidades futuras, mas nao devem virar schema automaticamente.

Acao recomendada:

- O documento `09_gap_analysis_current_noro_vs_target_vision.md` deve separar entidades existentes, entidades parcialmente existentes e entidades futuras.

### Multi-tenant

Documentacao vigente:

- `tenant_id` obrigatorio para recursos operacionais de tenant;
- isolamento por aplicacao + queries/repositories;
- Supabase RLS nao e premissa nova.

Risco identificado:

- `docs/architecture/multi-tenant-current-model.md` cita `vistos.noro.guru` como comercial/documentacao da API de vistos, mas o plano DNS vigente diz que `vistos.noro.guru` nao existe e que `visa-api.noro.guru` esta em avaliacao.

Acao recomendada:

- Antes da gap analysis ou em revisao documental curta, alinhar `multi-tenant-current-model.md` ao plano DNS atual.

### Billing

Documentacao vigente:

- Asaas e o gateway principal para novos fluxos;
- Stripe, Cielo, BTG e eRede sao legado;
- `apps/billing` nao deve orientar fronteira final do produto.

Risco em `docs/conceito/`:

- `05_noro_billing_payments_financial_layer.md` fala em escolha de gateway ainda aberta e inclui Stripe/Pagar.me/Cielo/Rede como possibilidades conceituais.

Acao recomendada:

- Na gap analysis, tratar Asaas como decisao vigente e os demais gateways apenas como legado ou referencia historica, salvo nova decisao arquitetural.

### Asaas

Documentacao vigente:

- `docs/architecture/billing-asaas-migration-plan.md` e a fonte para migracao financeira.

Risco em `docs/conceito/`:

- A visao financeira e mais ampla que o plano Asaas e inclui ledger, cotas, pagamento programado, split, embedded finance e repasses avancados.

Acao recomendada:

- Separar MVP financeiro Asaas de visao financeira futura. Nao implementar cotas/embedded finance antes de auth, tenant, modelo canonico e webhooks.

### Supabase legado

Documentacao vigente:

- Supabase ainda existe no runtime, mas e transicional;
- `supabase/FROZEN.md` e `supabase/README.md` travam migrations/functions antigas.

Risco em `docs/conceito/`:

- Os documentos conceituais nao tentam reativar Supabase, mas a proxima gap analysis pode encontrar codigo Supabase e confundir "existe" com "alvo".

Acao recomendada:

- Em toda comparacao, marcar Supabase como runtime legado/transicional.

### Appwrite eliminado

Documentacao vigente:

- Appwrite foi removido da arvore ativa e nao deve voltar.

Risco em `docs/conceito/`:

- Nao ha conflito direto nos 9 documentos. O risco vem do historico em `docs/archive/supabase-appwrite-migration.md`.

Acao recomendada:

- Manter Appwrite apenas como historico arquivado.

### Dominios

Documentacao vigente:

- Oficiais: `noro.guru`, `www.noro.guru`, `app.noro.guru`, `admin.noro.guru`, `sites.noro.guru`, `*.sites.noro.guru`, `api.noro.guru`, `visa-api.noro.guru`;
- `vistos.noro.guru` nao existe;
- `control.noro.guru` e `core.noro.guru` sao legados.

Riscos em `docs/conceito/`:

- Exemplos de distribuicao usam possibilidades como `nomade.noro.guru` e slugs em `noro.guru`;
- documentos conceituais devem ser lidos como exemplos de produto, nao como plano DNS aprovado.

Acao recomendada:

- A gap analysis deve usar `docs/architecture/domains-cloudflare-dns-current-plan.md` como fonte final para dominios.

### Apps

Documentacao vigente:

- `apps/control`: Control Plane em `admin.noro.guru`;
- `apps/core`: portal tenant em `app.noro.guru`;
- `apps/sites`: runtime de sites gerados;
- `apps/billing` e `apps/financeiro`: legados/transicionais, nao fronteira final;
- `apps/visa-api`: produto/app de vistos em revisao.

Risco em `docs/conceito/`:

- A visao estrategica cria dominios de produto maiores que os apps atuais. Isso e esperado, mas nao deve levar a implementar novas apps sem decisao arquitetural.

Acao recomendada:

- A gap analysis deve mapear dominio de negocio antes de decidir app/pacote.

### Backlog

Documentacao vigente:

- `docs/backlog/` contem propostas futuras, nao estado implementado.

Risco:

- Backlog de comunicacao, email marketing, social e redesign pode se sobrepor a partes da visao conceitual.

Acao recomendada:

- Na organizacao futura, manter backlog como execucao futura e conceito como tese estrategica. Quando uma proposta for aprovada, resumir em `docs/architecture/` ou `docs/apps/`.

## 6. Sugestao De Organizacao

Sem mover arquivos agora, a estrutura recomendada e:

```txt
docs/
  ai/
    AGENTS.README.md
  architecture/
    current-state.md
    data-auth-transition.md
    multi-tenant-current-model.md
    domains-cloudflare-dns-current-plan.md
    billing-asaas-migration-plan.md
    supabase-residue-report.md
  apps/
    README.md
    *.README.md
  conceito/
    00_noro_unico_master_index.md
    01_unico_reverse_engineering.md
    02_noro_product_vision.md
    03_noro_business_model.md
    04_noro_h2b2h_marketplace.md
    05_noro_billing_payments_financial_layer.md
    06_noro_distribution_sites_and_agents.md
    07_noro_supplier_api_roadmap.md
    08_noro_implementation_roadmap.md
    RELATORIO_LIMPEZA_CONCEITO.md
    09_gap_analysis_current_noro_vs_target_vision.md
  backlog/
    README.md
    communication/
    email-marketing/
    social-integrations/
    web-redesign/
  archive/
    historico e documentos obsoletos
```

Recomendacoes:

1. Manter `docs/conceito/` como area estrategica aspiracional.
2. Nao mover para `docs/strategy/` agora, apesar de alguns documentos citarem esse caminho como destino ideal.
3. Criar o proximo documento `09_gap_analysis_current_noro_vs_target_vision.md` na mesma pasta `docs/conceito/`.
4. Se no futuro a nomenclatura `strategy` for preferida, mover em uma sprint documental propria, atualizando links e `docs/analise-documentacao-md-projeto.md`.
5. Antes da gap analysis, considerar corrigir a divergencia `vistos.noro.guru` em `docs/architecture/multi-tenant-current-model.md`.

## 7. Proximo Passo Recomendado

E seguro avancar para:

```txt
docs/conceito/09_gap_analysis_current_noro_vs_target_vision.md
```

Condicoes para essa proxima etapa:

- tratar `docs/conceito/` como visao alvo, nao como implementacao;
- usar `docs/architecture/current-state.md` como estado consolidado;
- verificar o codigo real antes de concluir que algo existe;
- separar legado transicional de arquitetura futura;
- marcar Supabase como transicional, Appwrite como eliminado e Asaas como direcao vigente;
- nao alterar codigo, schema ou migrations durante a analise de gap.

## Arquivos Lidos Nesta Auditoria

Leitura obrigatoria:

- `docs/ai/AGENTS.README.md`
- `docs/architecture/current-state.md`
- `docs/analise-documentacao-md-projeto.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/multi-tenant-current-model.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/apps/README.md`
- `scripts/README.md`

Leitura de conceito:

- `docs/conceito/00_noro_unico_master_index.md`
- `docs/conceito/01_unico_reverse_engineering.md`
- `docs/conceito/02_noro_product_vision.md`
- `docs/conceito/03_noro_business_model.md`
- `docs/conceito/04_noro_h2b2h_marketplace.md`
- `docs/conceito/05_noro_billing_payments_financial_layer.md`
- `docs/conceito/06_noro_distribution_sites_and_agents.md`
- `docs/conceito/07_noro_supplier_api_roadmap.md`
- `docs/conceito/08_noro_implementation_roadmap.md`

Leitura complementar:

- `docs/backlog/README.md`
- `docs/codebase-unused-legacy-audit.md`
- `docs/apps/control.README.md`
- `docs/apps/core.README.md`
- `docs/apps/sites.README.md`
- `docs/apps/visa-api.README.md`

Inventarios e buscas executados:

- lista de arquivos em `docs/conceito/`
- lista de arquivos `.md` em `docs/backlog/`
- lista de arquivos `.md` em `docs/archive/`
- busca por referencias sensiveis em `docs/`: `vistos.noro`, `visa-api`, `control.noro`, `core.noro`, `Appwrite`, `Supabase`, `Stripe`, `Cielo`, `BTG`, `Asaas`, `Logto`, `DATABASE_URL`, `Drizzle`

## Arquivo Criado

- `docs/conceito/RELATORIO_LIMPEZA_CONCEITO.md`
