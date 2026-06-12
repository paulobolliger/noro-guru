/**
 * Seed de dados para testar o apps/portal end-to-end.
 * Cria: tenant → user (agente) → membership → cliente → proposta → itinerário + mensagens + emergência
 *
 * Idempotente — pode ser rodado múltiplas vezes sem duplicar.
 * Uso: node scripts/seed-portal.mjs
 */
import postgres from 'postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
if (!process.env.DATABASE_URL) config({ path: join(__dirname, '../apps/control/.env.local') });

const sql = postgres(process.env.DATABASE_URL, { ssl: false, max: 1 });
const log = (msg) => console.log(`    ${msg}`);

try {
  console.log('\n🌱 Seed portal — início\n');

  // ── 1. Tenant ──────────────────────────────────────────────────────────────
  console.log('1. Tenant');
  let [t] = await sql`SELECT id FROM noro.tenants WHERE portal_slug = 'demo' LIMIT 1`;
  let tenantId = t?.id;
  if (tenantId) {
    log(`já existe: ${tenantId}`);
  } else {
    [t] = await sql`
      INSERT INTO noro.tenants
        (name, slug, legal_name, email, status, billing_status, portal_slug, portal_theme)
      VALUES (
        'Agência Demo Viagens', 'agencia-demo', 'Agência Demo Viagens Ltda',
        'contato@agenciademo.com.br', 'active', 'trialing', 'demo',
        ${JSON.stringify({
          primaryColor: '#232452', secondaryColor: '#19b8a8',
          agencyDisplayName: 'Demo Viagens', fontFamily: 'Plus Jakarta Sans',
        })}::jsonb
      ) RETURNING id`;
    tenantId = t.id;
    log(`criado: ${tenantId}`);
  }

  // ── 2. Usuário agente (cross-tenant) ───────────────────────────────────────
  console.log('2. Usuário agente');
  let [u] = await sql`SELECT id FROM noro.users WHERE email = 'agente@agenciademo.com.br' LIMIT 1`;
  let userId = u?.id;
  if (userId) {
    log(`já existe: ${userId}`);
  } else {
    [u] = await sql`
      INSERT INTO noro.users (display_name, email, status)
      VALUES ('Carlos Agente', 'agente@agenciademo.com.br', 'active')
      RETURNING id`;
    userId = u.id;
    log(`criado: ${userId}`);
  }

  // ── 3. Membership (user ↔ tenant) ──────────────────────────────────────────
  console.log('3. Membership');
  const [m] = await sql`
    SELECT id FROM noro.tenant_memberships
    WHERE tenant_id = ${tenantId} AND user_id = ${userId} LIMIT 1`;
  if (m) {
    log('já existe');
  } else {
    await sql`
      INSERT INTO noro.tenant_memberships (tenant_id, user_id, role, status)
      VALUES (${tenantId}, ${userId}, 'owner', 'active')`;
    log('criado');
  }

  // ── 4. Cliente viajante ────────────────────────────────────────────────────
  console.log('4. Cliente viajante');
  let [c] = await sql`
    SELECT id FROM noro.clients WHERE email = 'maria@email.com' AND tenant_id = ${tenantId} LIMIT 1`;
  let clientId = c?.id;
  if (clientId) {
    log(`já existe: ${clientId}`);
  } else {
    [c] = await sql`
      INSERT INTO noro.clients
        (tenant_id, tipo, nome, nome_preferido, email, whatsapp,
         passaporte_numero, passaporte_pais, status, nivel, segmento)
      VALUES (
        ${tenantId}, 'pessoa_fisica', 'Maria Oliveira Santos', 'Maria',
        'maria@email.com', '+5511999990001',
        'AB123456', 'Brasil', 'ativo', 'gold', 'lazer'
      ) RETURNING id`;
    clientId = c.id;
    log(`criado: ${clientId}`);
  }

  // ── 5. Proposta ────────────────────────────────────────────────────────────
  console.log('5. Proposta');
  let [p] = await sql`
    SELECT id FROM noro.proposals
    WHERE tenant_id = ${tenantId} AND client_id = ${clientId} LIMIT 1`;
  let proposalId = p?.id;
  if (proposalId) {
    log(`já existe: ${proposalId}`);
  } else {
    const aceiteToken = crypto.randomUUID();
    [p] = await sql`
      INSERT INTO noro.proposals (
        tenant_id, client_id, numero, titulo, versao, status,
        aceite_tipo, aceite_token,
        destino_principal, data_viagem_inicio, data_viagem_fim, num_pax,
        moeda_base, total_cents, subtotal_cents, valor_sinal_cents,
        condicoes_pagamento, validade_ate, descricao, created_by
      ) VALUES (
        ${tenantId}, ${clientId}, 'P-2026-001',
        'Europa Clássica — Paris + Roma', 1, 'enviada',
        'link_publico', ${aceiteToken},
        'Paris, França', '2026-08-10', '2026-08-22', 2,
        'BRL', 1890000, 1890000, 500000,
        'Entrada de R$ 5.000 + saldo 30 dias antes da viagem',
        '2026-07-01',
        'Roteiro de 12 dias pela Europa incluindo passagens, hotéis e transfers.',
        ${userId}
      ) RETURNING id`;
    proposalId = p.id;
    log(`criada: ${proposalId}`);

    await sql`
      INSERT INTO noro.proposal_items
        (proposal_id, tipo, nome, descricao, categoria, data_inicio, data_fim, num_pax, preco_venda_cents, ordem)
      VALUES
        (${proposalId},'manual','Passagem Aérea GRU→CDG→FCO→GRU','Ida e volta com conexão','aereo','2026-08-10','2026-08-22',2,960000,1),
        (${proposalId},'manual','Hotel Paris — 5 noites','Hotel 4★ no Marais, café incluso','hospedagem','2026-08-10','2026-08-15',2,560000,2),
        (${proposalId},'manual','Hotel Roma — 7 noites','Hotel 4★ perto do Vaticano, café incluso','hospedagem','2026-08-15','2026-08-22',2,490000,3),
        (${proposalId},'manual','Transfer + seguro viagem','Transfer privativo + seguro 30 dias','servico','2026-08-10','2026-08-22',2,188000,4)`;
    log('4 itens de proposta criados');
  }

  // ── 6. Itinerário ──────────────────────────────────────────────────────────
  console.log('6. Itinerário');
  const [ei] = await sql`SELECT id FROM noro.proposal_itinerary_items WHERE proposal_id = ${proposalId} LIMIT 1`;
  if (ei) {
    log('já existe');
  } else {
    await sql`
      INSERT INTO noro.proposal_itinerary_items
        (tenant_id, proposal_id, data, hora_inicio, tipo, titulo, local, descricao, ordem)
      VALUES
        (${tenantId},${proposalId},'2026-08-10','08:00','transporte','Embarque em Guarulhos','Aeroporto GRU — Terminal 3','Apresentação no check-in 3h antes. Voo GRU→CDG às 11:35.',1),
        (${tenantId},${proposalId},'2026-08-11','07:00','hospedagem','Check-in Hotel Paris','Le Marais Boutique Hotel, Paris','Chegada CDG às 06:15 (hora local). Transfer privativo ao hotel.',1),
        (${tenantId},${proposalId},'2026-08-11','14:00','passeio','Torre Eiffel + Champs-Élysées','Torre Eiffel, Paris','Visita guiada com ingresso antecipado. À tarde, Champs-Élysées.',2),
        (${tenantId},${proposalId},'2026-08-12','09:00','passeio','Museu do Louvre','Louvre, Paris','Visita de meio período. Ingresso incluído no pacote.',1),
        (${tenantId},${proposalId},'2026-08-12','19:00','refeicao','Jantar no Quartier Latin','Le Procope, Paris','Restaurante histórico — reserva confirmada.',2),
        (${tenantId},${proposalId},'2026-08-15','10:00','transporte','Trem Paris → Roma','Gare de Lyon, Paris','TGV Paris→Milão + Frecciarossa Milão→Roma. Chegada às 19:45.',1),
        (${tenantId},${proposalId},'2026-08-16','09:00','passeio','Coliseu + Fórum Romano','Coliseu, Roma','Tour guiado com acesso prioritário.',1),
        (${tenantId},${proposalId},'2026-08-17','10:00','passeio','Vaticano — Museus + Basílica','Museus Vaticanos, Roma','Museus, Capela Sistina e Basílica de São Pedro.',1),
        (${tenantId},${proposalId},'2026-08-22','06:00','transporte','Embarque FCO → GRU','Aeroporto Leonardo da Vinci, Roma','Transfer ao aeroporto às 06h. Voo FCO→GRU às 09:50.',1)`;
    log('9 itens de itinerário criados');
  }

  // ── 7. Mensagens ───────────────────────────────────────────────────────────
  console.log('7. Mensagens');
  const [em] = await sql`SELECT id FROM noro.proposal_messages WHERE proposal_id = ${proposalId} LIMIT 1`;
  if (em) {
    log('já existem');
  } else {
    await sql`
      INSERT INTO noro.proposal_messages
        (tenant_id, proposal_id, sender_type, sender_user_id, content, created_at)
      VALUES
        (${tenantId},${proposalId},'agent',${userId},'Olá Maria! Preparei um roteiro especial para sua viagem à Europa. Confira os detalhes e me diga o que acha! 😊', NOW() - INTERVAL '2 days'),
        (${tenantId},${proposalId},'client',NULL,'Adorei o roteiro! O Vaticano é um sonho. As malas despachadas estão incluídas nas passagens?', NOW() - INTERVAL '1 day'),
        (${tenantId},${proposalId},'agent',${userId},'Sim! As passagens já incluem 1 mala despachada de até 23kg por pessoa. Ótima escolha de destino! 🗼', NOW() - INTERVAL '20 hours')`;
    log('3 mensagens criadas');
  }

  // ── 8. Contatos de emergência ──────────────────────────────────────────────
  console.log('8. Contatos de emergência');
  const [ee] = await sql`
    SELECT id FROM noro.emergency_contacts WHERE tenant_id = ${tenantId} AND proposal_id IS NULL LIMIT 1`;
  if (ee) {
    log('já existem');
  } else {
    await sql`
      INSERT INTO noro.emergency_contacts
        (tenant_id, proposal_id, tipo, nome, telefone, whatsapp, email, observacoes, ordem, ativo)
      VALUES
        (${tenantId},NULL,'agencia','Demo Viagens — Central 24h','+551140040404','+551140040404','emergencia@agenciademo.com.br','Disponível 24h durante a viagem',1,true),
        (${tenantId},NULL,'seguradora','Assist Card Brasil','+5508007272000',NULL,NULL,'Apólice AC-2026-887654. Código: NORO2026',2,true),
        (${tenantId},${proposalId},'consulado','Consulado Brasileiro em Paris','+33144923401',NULL,'cg.paris@itamaraty.gov.br','Av. Iéna 34, Paris. Seg-Sex 09h-12h30',3,true),
        (${tenantId},${proposalId},'consulado','Consulado Brasileiro em Roma','+390655954937',NULL,'cg.roma@itamaraty.gov.br','Piazza Navona 14, Roma. Seg-Sex 09h-12h',4,true)`;
    log('4 contatos criados (2 globais + 2 por proposta)');
  }

  // ── Resumo ─────────────────────────────────────────────────────────────────
  console.log('\n✅ Seed concluído!\n');
  console.log('  Para testar o portal:');
  console.log('  • portal_slug:  demo');
  console.log('  • email login:  maria@email.com');
  console.log(`\n  IDs:`);
  console.log(`  tenant_id:   ${tenantId}`);
  console.log(`  client_id:   ${clientId}`);
  console.log(`  proposal_id: ${proposalId}`);
  console.log('');

} catch (err) {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
} finally {
  await sql.end();
}
