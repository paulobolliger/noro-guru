# Portal do Viajante — Visão Completa

## Conceito Central

O cliente não deve precisar procurar informações em e-mails, WhatsApp ou PDFs dispersos.
Tudo relacionado à viagem existe dentro de um único ambiente pessoal.

---

## Fase 1 — Beta Fechado

✅ Dashboard: próxima viagem, contagem regressiva, alertas, status de pagamentos e documentação
✅ Pagamentos: PIX inline (QR gerado de pixCopyPaste), boleto, cartão, status de parcelas
✅ Documentos: listagem agrupada por proposta, signed URL Supabase Storage, estado vazio
✅ Upload de documentos em apps/core — aba Documentos em /orcamentos/[id], upload para Supabase Storage, controle visível/oculto
✅ Itinerário: cronograma por dia com horário, tipo, local, endereço, linha do tempo no portal
✅ Chat com agência: mensagens por proposta, optimistic update no cliente, read tracking
✅ Central de emergência: WhatsApp clicável, telefone, email, contatos globais + por proposta

---

## Fase 2 — Pós-Beta (não implementar agora, mas considerar no schema)

- Concierge IA com contexto completo da viagem
- Mapa interativo (Google Maps) com hotéis, aeroportos, passeios, farmácias, hospitais
- Checklist de preparação automático e personalizado (passaporte, visto, vacinas, bagagem)
- Diário de viagem com notas e fotos — gera PDF e álbum digital ao final
- Avaliações pós-viagem (hotel, passeios, transporte, atendimento, destino)
- Perfil do viajante com preferências, restrições e documentos pessoais

---

## Fase 3 — Produto Maduro (não implementar agora)

- Biblioteca de destinos produzida pela agência (guias, roteiros, dicas, regras migratórias)
- Favoritos pessoais (hotéis, restaurantes, passeios, destinos, artigos)
- Recomendações personalizadas baseadas em histórico e perfil
- Histórico completo de viagens com fotos, PDF e álbum digital
- Notificações inteligentes (check-in liberado, mudança de voo, documento disponível)
- Área administrativa da agência integrada (CRM, ERP, emissão de vouchers, automação)

---

## Decisões de schema que a Fase 2 e 3 exigem — não bloquear

- `proposal_documents` criada na Sprint Portal Fase 1 — suporta Fase 2 (tipos variados de doc)
- Futuramente: tabelas `travel_diary`, `travel_checklist`, `travel_favorites`, `travel_ratings`
- Concierge IA vai consumir: `proposals`, `proposal_items`, `proposal_documents`, `noro.clients`
- Mapa vai consumir: `proposal_items` com coordenadas — considerar campos `lat`/`lng` futuros

---

## Regras de desenvolvimento

- Fase 2 e 3 não são codadas agora, mas o schema não pode bloquear sua implementação futura
- Sempre consultar este arquivo no início de cada sessão do portal
- Atualizar este arquivo ao concluir cada sprint — marcar itens como concluídos e registrar o commit
- Qualquer ideia nova de funcionalidade deve ser adicionada aqui antes de ser codada

---

## Histórico de sprints

- Sprint P (commit `6af5f6e`): middleware tenant por subdomínio/domínio customizado, magic link auth, `/proposta/[token]`, `/propostas`, `client_portal_sessions`
- Sprint 5 (commit `8017896`): `payment_provider_accounts`, `payment_customers`, `payment_charges`, `payment_webhook_events`, `AsaasProvider`, webhook idempotente
- Sprint Portal Fase 1 (commit `4a98933`): `/pagamentos` com QR Pix, boleto, cartão e parcelas; `/documentos` agrupado por proposta com signed URL; dashboard com countdown e dados reais; `proposal_documents` (migration 0007); `getChargesByClient`; `getDocumentsByClient`
- Sprint Portal Fase 1B (pendente de commit): upload de documentos em `/orcamentos/[id]` (apps/core); `/itinerario` (timeline por dia com tipo, local, endereço); `/mensagens` (chat com optimistic update, read tracking); `/emergencia` (WhatsApp clicável, contatos por tenant + por proposta); schemas `proposal_itinerary_items`, `proposal_messages`, `emergency_contacts` (migration 0008); `/configuracoes/emergencia` (apps/core)
