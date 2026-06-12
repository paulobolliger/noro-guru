> **[RASCUNHO — verificar contra análise nova]**
> Este documento foi produzido antes da análise completa de 2026-06-01.
> A comparação de colunas permanece válida como referência técnica para tabelas
> específicas analisadas, mas o panorama geral de cobertura estava incompleto.
> As fontes primárias atualizadas são:
> - `inventory-banco-real-2026-05-30.md` — inventário real do banco com row counts
> - `crossref-banco-codigo-2026-05-30.md` — cruzamento completo com gaps
> Não use este documento para decisões de migração sem verificar os acima.

# Comparação de Colunas — Drizzle vs Banco de Produção

Data: 2026-05-30
Fonte: `information_schema.columns` do banco `noro_guru_db` em 45.32.169.173
Status: diagnóstico — nenhuma ação tomada

Legenda:
- ✅ **compatível** — existe nos dois, nome e semântica iguais (ou renomeada óbvia)
- ⚠️ **mismatch** — existe nos dois mas com tipo, unidade ou enum incompatível
- 🔴 **só no legado** — dados em produção que não têm destino no Drizzle (risco de perda)
- 🔵 **só no Drizzle** — funcionalidade nova, sem dados existentes

---

## 1. `noro_leads` (produção) vs `noro.leads` (Drizzle)

| Coluna produção | Coluna Drizzle | Status | Observação |
|---|---|---|---|
| `id` | `id` | ✅ | uuid, mesmo padrão |
| `tenant_id` | `tenant_id` | ✅ | NOT NULL nos dois |
| `nome` | `nome` | ✅ | |
| `email` | `email` | ✅ | |
| `whatsapp` | `whatsapp` | ✅ | |
| `status` | `status` | ⚠️ | Prod: texto livre (default 'novo'). Drizzle: enum estrito (9 valores). Valores prod existentes precisam de mapeamento |
| `created_at` | `created_at` | ⚠️ | Prod: `timestamp without time zone`. Drizzle: `timestamptz`. Requer conversão de timezone |
| `updated_at` | `updated_at` | ⚠️ | Idem |
| `telefone` | `phone` | ⚠️ | Mesma semântica, nome diferente |
| `origem` | `source` | ⚠️ | Prod: texto livre. Drizzle: enum (instagram_dm / whatsapp_organico / indicacao / …) — valores existentes provavelmente não mapeiam diretamente |
| `destino_interesse` | `destinos_interesse` | ⚠️ | Prod: `text` (singular). Drizzle: `text[]` (array). Migração: envolver em array |
| `periodo_inicio` | `data_viagem_inicio` | ⚠️ | Nome diferente, mesmo tipo (date) |
| `periodo_fim` | `data_viagem_fim` | ⚠️ | Nome diferente, mesmo tipo (date) |
| `perdido_motivo` | `lost_reason` | ⚠️ | Prod: texto livre. Drizzle: enum (6 valores). Risco de perda de razões fora do enum |
| `cliente_id` | `converted_to` | ⚠️ | Mesma semântica (FK ao cliente convertido), nome diferente |
| `ultimo_contato` | `last_contact_at` | ✅ | Nome diferente, tipo compatível |
| `probabilidade_fechamento` | `lead_score` | ⚠️ | Semântica similar (0-100), nome diferente |
| `num_pessoas` | `num_pax` | ⚠️ | Nome diferente |
| `canal_preferencial` | — | 🔴 | Canal preferencial de contato (WhatsApp/telefone/email) — sem destino no Drizzle |
| `valor_estimado` | — | 🔴 | Budget em numeric/EUR — Drizzle usa `budget_min_cents`/`budget_max_cents` em centavos, conceito diferente |
| `probabilidade` | — | 🔴 | Score 0-100 — sem equivalente direto (lead_score é diferente) |
| `periodo_viagem` | — | 🔴 | Texto livre descrevendo o período — substituído por datas estruturadas no Drizzle |
| `observacoes` | — | 🔴 | Campo de notas do agente — sem equivalente no Drizzle |
| `proxima_acao` | — | 🔴 | Próxima ação agendada (texto) — sem equivalente |
| `data_proxima_acao` | — | 🔴 | Data da próxima ação — sem equivalente |
| `responsavel` | — | 🔴 | Nome do responsável como texto — Drizzle usa `assigned_to` UUID FK |
| `tags` | — | 🔴 | Array de tags — sem equivalente |
| `metadata` | — | 🔴 | JSONB genérico — sem equivalente |
| `destino` | — | 🔴 | Campo destino (duplica destino_interesse?) — sem equivalente direto |
| `mensagem` | — | 🔴 | Mensagem inicial do lead — sem equivalente |
| `tipo` | — | 🔴 | Tipo de serviço desejado (default 'roteiro_pronto') — sem equivalente; Drizzle tem `tipo_viagem` com enum diferente |
| `periodo_flexivel` | — | 🔴 | Flexibilidade do período — sem equivalente |
| `num_adultos` | — | 🔴 | Drizzle consolida em `num_pax` |
| `num_criancas` | — | 🔴 | Drizzle consolida em `num_pax` |
| `servicos_desejados` | — | 🔴 | Array de serviços — sem equivalente |
| `roteiro_ref` | — | 🔴 | Referência a roteiro pré-montado — sem equivalente |
| `telefone_whatsapp` | — | 🔴 | Boolean indicando se telefone é também WhatsApp — sem equivalente |
| — | `organization_name` | 🔵 | Empresa do lead (B2B) |
| — | `source_detail` | 🔵 | Detalhe da origem estruturada |
| — | `assigned_to` | 🔵 | FK UUID ao usuário responsável (vs texto livre no legado) |
| — | `budget_min_cents` / `budget_max_cents` | 🔵 | Orçamento em centavos com faixa min/max |
| — | `tipo_viagem` | 🔵 | Enum: lazer/corporativo/lua_de_mel/grupo/incentivo/aventura/cruzeiro |
| — | `converted_at` | 🔵 | Timestamp da conversão para cliente |

---

## 2. `noro_clientes` (produção) vs `noro.clients` (Drizzle)

| Coluna produção | Coluna Drizzle | Status | Observação |
|---|---|---|---|
| `id` | `id` | ✅ | |
| `tenant_id` | `tenant_id` | ✅ | |
| `nome` | `nome` | ✅ | |
| `email` | `email` | ✅ | |
| `whatsapp` | `whatsapp` | ✅ | |
| `cpf` | `cpf` | ✅ | |
| `cnpj` | `cnpj` | ✅ | |
| `data_nascimento` | `data_nascimento` | ✅ | |
| `nacionalidade` | `nacionalidade` | ✅ | |
| `observacoes` | `observacoes` | ✅ | |
| `created_at` / `updated_at` | `created_at` / `updated_at` | ✅ | |
| `tipo` | `tipo` | ✅ | Enum compatível: pessoa_fisica / pessoa_juridica |
| `status` | `status` | ⚠️ | Prod: ativo/inativo (padrão). Drizzle: ativo/inativo/vip/bloqueado/prospecto — valores existentes compatíveis |
| `nivel` | `nivel` | ⚠️ | **INCOMPATÍVEL**: prod default `'bronze'`, Drizzle enum é `standard/silver/gold/platinum`. 'bronze' não existe no Drizzle |
| `segmento` | `segmento` | ⚠️ | Prod: texto livre. Drizzle: enum lazer/corporativo/grupos/incentivo |
| `origem_lead_id` | `lead_id` | ⚠️ | Mesma semântica, nome diferente |
| `agente_responsavel_id` | `assigned_to` | ⚠️ | Mesma semântica (UUID FK), nome diferente |
| `total_viagens` | `total_viagens` | ✅ | |
| `total_gasto` | `total_gasto_cents` | ⚠️ | **Unidade diferente**: prod em numeric (provavelmente EUR), Drizzle em bigint centavos BRL. Requer conversão |
| `data_ultima_viagem` | `ultima_viagem_at` | ⚠️ | Prod: `timestamptz`. Drizzle: `date`. Truncamento de hora |
| `data_proxima_viagem` | `proxima_viagem_at` | ⚠️ | Idem |
| `passaporte` | `passaporte_numero` | ⚠️ | Prod: campo único. Drizzle: separado em número/país/validade/doc_url — passaporte vai para `passaporte_numero`, resto fica vazio |
| `telefone` | `phone` | ⚠️ | Mesma semântica, nome diferente |
| `profissao` | — | 🔴 | Profissão do cliente — sem equivalente |
| `ticket_medio` | — | 🔴 | Calculado (total_gasto/total_viagens) — sem equivalente |
| `nps_score` | — | 🔴 | NPS do cliente — sem equivalente |
| `data_primeiro_contato` | — | 🔴 | Sem equivalente |
| `data_ultimo_contato` | — | 🔴 | Sem equivalente |
| `idioma_preferido` | — | 🔴 | Idioma preferencial — sem equivalente |
| `moeda_preferida` | — | 🔴 | Moeda preferida (default EUR) — sem equivalente |
| `tags` | — | 🔴 | Array de tags — sem equivalente |
| `metadata` | — | 🔴 | JSONB genérico — sem equivalente |
| `deleted_at` | — | 🔴 | **Soft delete** — Drizzle não tem soft delete. Clientes inativos no legado perderiam o timestamp de exclusão |
| `razao_social` | — | 🔴 | Sem equivalente direto (PJ usa `nome` no Drizzle) |
| `nome_fantasia` | — | 🔴 | Sem equivalente |
| `inscricao_estadual` / `inscricao_municipal` | — | 🔴 | Dados fiscais PJ — sem equivalente |
| `responsavel_nome/cargo/email/telefone` | — | 🔴 | Contato do responsável PJ — sem equivalente |
| `auth_user_id` | — | 🔴 | Vínculo com Supabase Auth — Drizzle usa `identity_links` para isso |
| — | `nome_preferido` | 🔵 | Apelido |
| — | `genero` | 🔵 | |
| — | `endereco_cidade/estado/pais` | 🔵 | |
| — | `passaporte_pais/validade/doc_url` | 🔵 | Dados complementares de passaporte |
| — | `rg` / `cnh_*` | 🔵 | |
| — | `restricoes_alimentares/medicas` | 🔵 | |
| — | `nivel_mobilidade` / `apto_atividade_fisica` | 🔵 | |
| — | `destinos_visitados/desejados` | 🔵 | |
| — | `tipo_acomodacao_pref/classe_voo_pref/viaja_com` | 🔵 | Preferências de viagem |
| — | `contato_emergencia_*` | 🔵 | Contato de emergência pessoal (diferente de `emergency_contacts` que é por viagem) |
| — | `lgpd_aceito/at/versao` | 🔵 | Conformidade LGPD |

---

## 3. `noro_orcamentos` (produção) vs `noro.proposals` (Drizzle)

| Coluna produção | Coluna Drizzle | Status | Observação |
|---|---|---|---|
| `id` | `id` | ✅ | |
| `tenant_id` | `tenant_id` | ✅ | |
| `lead_id` | `lead_id` | ✅ | |
| `titulo` | `titulo` | ✅ | |
| `descricao` | `descricao` | ✅ | |
| `data_viagem_inicio` / `data_viagem_fim` | `data_viagem_inicio/fim` | ✅ | |
| `validade_ate` | `validade_ate` | ✅ | |
| `condicoes_pagamento` | `condicoes_pagamento` | ✅ | |
| `created_by` | `created_by` | ✅ | |
| `created_at` / `updated_at` | `created_at` / `updated_at` | ✅ | |
| `status` | `status` | ⚠️ | Valores prod: rascunho/enviada/visualizada/aceita/recusada — Drizzle adiciona 'expirada' e 'cancelada' |
| `numero_orcamento` | `numero` | ⚠️ | Nome diferente |
| `cliente_id` | `client_id` | ⚠️ | Nome diferente |
| `enviado_em` | `sent_at` | ⚠️ | Nome diferente |
| `aprovado_em` | `aceita_at` | ⚠️ | Nome diferente |
| `observacoes_internas` | `observacoes` | ⚠️ | Nome diferente |
| `moeda` | `moeda_base` | ⚠️ | Prod default 'EUR', Drizzle default 'BRL'. Conversão necessária |
| `valor_total` | `total_cents` | ⚠️ | **Unidade diferente**: prod em numeric (EUR?), Drizzle bigint centavos BRL |
| `valor_sinal` | `valor_sinal_cents` | ⚠️ | Idem — conversão de unidade necessária |
| `num_pessoas` | `num_pax` | ⚠️ | Nome diferente |
| `destinos` | `destino_principal` | ⚠️ | **Estrutura diferente**: prod é `text[]` (múltiplos destinos), Drizzle é `text` único. Perda de múltiplos destinos |
| `roteiro` | — | 🔴 | **CRÍTICO**: JSONB com itinerário embutido na proposta. No Drizzle, o itinerário foi normalizado para `proposal_itinerary_items`. Migração requer parse do JSON |
| `num_dias` | — | 🔴 | Calculado a partir de datas — sem campo próprio no Drizzle |
| `num_adultos` / `num_criancas` / `num_bebes` | — | 🔴 | Drizzle consolida em `num_pax` |
| `valor_custo` | — | 🔴 | Custo total da proposta — Drizzle rastreia custo por item (`custo_base_cents`) |
| `margem_lucro` / `margem_percentual` | — | 🔴 | Calculados — sem campo próprio no Drizzle |
| `prioridade` | — | 🔴 | Enum alta/media/baixa — sem equivalente |
| `enviado_para` | — | 🔴 | Email de destino do envio — sem equivalente |
| `visualizado_em` / `visualizado_contador` | — | 🔴 | Drizzle rastreia via mudança de status, não timestamp separado |
| `respondido_em` | — | 🔴 | Sem equivalente |
| `recusado_em` / `recusado_motivo` | — | 🔴 | Drizzle só rastreia status 'recusada', sem timestamp/motivo |
| `politica_cancelamento` | — | 🔴 | Sem equivalente |
| `observacoes_cliente` | — | 🔴 | Segunda observação — Drizzle tem só uma (`observacoes`) |
| `pdf_url` / `pdf_public_id` / `pdf_gerado_em` / `pdf_versao` | — | 🔴 | Gestão de PDF — sem equivalente |
| `template_usado` / `personalizacao` | — | 🔴 | Template e customização visual — sem equivalente |
| `tags` / `metadata` | — | 🔴 | Sem equivalente |
| `updated_by` | — | 🔴 | Quem atualizou — Drizzle só tem `created_by` |
| `deleted_at` | — | 🔴 | Soft delete — sem equivalente |
| `observacoes` | — | 🔴 | Duplicata de `observacoes_cliente` no legado |
| — | `versao` | 🔵 | Controle de versão da proposta |
| — | `subtotal_cents` / `desconto_cents` | 🔵 | Breakdown financeiro |
| — | `taxa_cambio_snapshot` / `taxa_cambio_at` | 🔵 | Snapshot histórico de câmbio |
| — | `aceite_tipo` / `aceite_token` / `aceita_por_nome` | 🔵 | Fluxo de aceite via magic link |
| — | `termos_condicoes` | 🔵 | |

---

## 4. `noro_orcamentos_itens` (produção) vs `noro.proposal_items` (Drizzle)

| Coluna produção | Coluna Drizzle | Status | Observação |
|---|---|---|---|
| `id` | `id` | ✅ | |
| `tipo` | `tipo` | ⚠️ | Prod: texto livre. Drizzle: enum 'produto_catalogo'/'manual' |
| `categoria` | `categoria` | ✅ | |
| `data_fim` | `data_fim` | ✅ | |
| `ordem` | `ordem` | ✅ | |
| `created_at` / `updated_at` | `created_at` / `updated_at` | ✅ | |
| `orcamento_id` | `proposal_id` | ⚠️ | Nome diferente, mesma semântica |
| `produto` | `nome` | ⚠️ | Nome diferente |
| `data_servico` | `data_inicio` | ⚠️ | Nome diferente |
| `valor_unitario_custo` | `custo_base_cents` | ⚠️ | **Unidade diferente**: prod numeric, Drizzle bigint centavos |
| `valor_unitario_venda` | `preco_venda_cents` | ⚠️ | Idem |
| `margem_percentual` | `markup_percentual` | ⚠️ | Nome diferente, mesma semântica |
| `fornecedor` | — | 🔴 | Nome do fornecedor como texto — Drizzle usa `product_id` → FK catalog |
| `fornecedor_id` | — | 🔴 | FK ao fornecedor direto no item — Drizzle vai por `products.supplier_id` |
| `hora_inicio` / `hora_fim` | — | 🔴 | Horários do serviço — no Drizzle foram para `proposal_itinerary_items`, não para itens da proposta |
| `localizador` | — | 🔴 | Código de reserva (PNR, voucher ID) — sem equivalente |
| `quantidade` | — | 🔴 | Drizzle não tem campo de quantidade por item (usa `num_pax` na proposta) |
| `unidade` | — | 🔴 | Unidade (unidade/noite/pessoa) — sem equivalente |
| `valor_total` | — | 🔴 | Total calculado (quantidade × valor_unitario) — no Drizzle é calculado via `recalcTotals()` |
| `margem` | — | 🔴 | Margem absoluta — sem equivalente direto |
| `detalhes` | — | 🔴 | JSONB com detalhes específicos do serviço — sem equivalente |
| `incluido` | — | 🔴 | Flag se item está incluído no pacote — sem equivalente |
| `opcional` | — | 🔴 | Flag de item opcional — sem equivalente |
| `observacoes` | — | 🔴 | Notas por item — sem equivalente |
| `tenant_id` | — | 🔴 | Item tem tenant_id próprio no legado. Drizzle não tem (escopo via proposal) |
| — | `product_id` | 🔵 | FK ao catálogo de produtos (novo — produtos normalizados) |
| — | `num_pax` | 🔵 | Pax por item |
| — | `moeda_original` / `taxa_cambio` | 🔵 | Multi-moeda por item |
| — | `snapshot_pricing_rules` | 🔵 | Snapshot imutável de regras de precificação após aceite |

---

## 5. `noro_fornecedores` (produção) vs `noro.suppliers` (Drizzle)

| Coluna produção | Coluna Drizzle | Status | Observação |
|---|---|---|---|
| `id` | `id` | ✅ | |
| `nome` | `nome` | ✅ | |
| `website` | `website` | ✅ | |
| `pais` | `pais` | ✅ | |
| `cidade` | `cidade` | ✅ | |
| `contato_nome` | `contato_nome` | ✅ | |
| `observacoes` | `observacoes` | ✅ | |
| `created_at` / `updated_at` | `created_at` / `updated_at` | ✅ | |
| `tipo` | `tipo` | ⚠️ | Prod: texto livre. Drizzle: enum (agencia_receptiva/hotel/operadora/transporte/seguradora/outro) |
| `status` | `status` | ⚠️ | Prod: ativo/inativo. Drizzle: ativo/inativo/suspenso — compatível |
| `cnpj_nif` | `cnpj` | ⚠️ | Nome diferente (prod cobre CNPJ e NIF estrangeiro) |
| `email` | `contato_email` | ⚠️ | Prod: email da empresa. Drizzle: email do contato — semanticamente diferente |
| `telefone` | `contato_phone` | ⚠️ | Idem |
| `whatsapp` | `contato_whatsapp` | ⚠️ | Idem |
| `tenant_id` | — | 🔴 | **DIFERENÇA ARQUITETURAL**: prod tem fornecedores por tenant. Drizzle: fornecedores são globais (sem `tenant_id`). Todos os dados de fornecedores da produção pertencem a tenants específicos e não poderiam ser migrados para a tabela global do Drizzle diretamente |
| `nome_fantasia` | — | 🔴 | Sem equivalente |
| `contato_cargo` | — | 🔴 | Cargo do contato — sem equivalente |
| `inscricao_estadual` | — | 🔴 | |
| `endereco` / `estado` / `cep` | — | 🔴 | Endereço completo — Drizzle só tem cidade/pais |
| `banco` / `agencia` / `conta` / `pix` / `swift` / `iban` | — | 🔴 | Dados bancários completos — sem equivalente |
| `condicoes_pagamento` | — | 🔴 | |
| `prazo_pagamento_dias` | — | 🔴 | |
| `percentual_comissao` | — | 🔴 | Comissão padrão do fornecedor — sem equivalente |
| `desconto_padrao` | — | 🔴 | |
| `rating` / `total_avaliacoes` | — | 🔴 | Sistema de avaliação — sem equivalente |
| `motivo_bloqueio` | — | 🔴 | |
| `categorias` | — | 🔴 | Array de categorias — sem equivalente |
| `tags` / `metadata` | — | 🔴 | |
| `deleted_at` | — | 🔴 | Soft delete — sem equivalente |
| — | `api_tipo` / `api_ativo` | 🔵 | Integração com APIs (Hotelbeds, Amadeus) — novo |

---

## Resumo de riscos por tabela

| Tabela | Compatíveis | Mismatch | Só legado 🔴 | Só Drizzle 🔵 | Risco principal |
|---|---|---|---|---|---|
| `noro_leads` | 8 | 9 | 18 | 6 | Campos de texto livre viram enums; dados ricos (tags/metadata/observacoes) sem destino |
| `noro_clientes` | 10 | 9 | 14 | 15 | `nivel='bronze'` inválido no Drizzle; soft delete perdido; `total_gasto` muda de unidade |
| `noro_orcamentos` | 9 | 10 | 17 | 6 | `roteiro` JSONB → `proposal_itinerary_items` requer parse; múltiplos destinos → campo único |
| `noro_orcamentos_itens` | 5 | 7 | 13 | 5 | `tenant_id` só no legado; `localizador` perdido; horas do serviço mudaram de tabela |
| `noro_fornecedores` | 8 | 7 | 14 | 2 | **Arquitetural**: legado é por-tenant, Drizzle é global; dados bancários sem destino |

---

## Incompatibilidades críticas (bloqueantes para migração direta)

1. **`noro_clientes.nivel = 'bronze'`** — enum do Drizzle não tem 'bronze' (tem standard/silver/gold/platinum). Requer mapeamento antes de qualquer INSERT.
2. **`noro_fornecedores.tenant_id`** — Drizzle trata fornecedores como globais. Migração direta perderia o isolamento por tenant.
3. **`noro_orcamentos.roteiro` (JSONB)** — itinerário embutido na proposta. Drizzle normalizou em `proposal_itinerary_items`. Migração requer ETL com parse JSON.
4. **Unidades monetárias** — produção em numeric/EUR, Drizzle em bigint centavos/BRL. Toda a coluna financeira requer conversão (taxa de câmbio histórica).
5. **Timestamps sem timezone** — `noro_leads.created_at` é `timestamp without time zone`. Drizzle usa `timestamptz`. Requer definição de timezone de referência.
