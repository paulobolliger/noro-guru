import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { proposals, proposalItems, type ProposalStatus } from '../schema';
import type { NoroDatabase } from '../index';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type CreateProposalInput = {
  tenantId: string;
  titulo: string;
  numero: string;
  leadId?: string | null;
  clientId?: string | null;
  dataViagemInicio?: string | null;
  dataViagemFim?: string | null;
  numPax?: number | null;
  destinoPrincipal?: string | null;
  moedaBase?: string;
  valorSinalCents?: number | null;
  condicoesPagamento?: string | null;
  aceiteTipo?: 'manual' | 'link_publico';
  aceiteToken?: string | null;
  validadeAte?: string | null;
  descricao?: string | null;
  observacoes?: string | null;
  termosCondicoes?: string | null;
  createdBy?: string | null;
};

export type CreateProposalItemInput = {
  proposalId: string;
  tipo: 'produto_catalogo' | 'manual';
  nome: string;
  precoVendaCents: number;
  productId?: string | null;
  descricao?: string | null;
  categoria?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  numPax?: number | null;
  moedaOriginal?: string;
  taxaCambio?: string | null;
  custoBaseCents?: number | null;
  markupPercentual?: string | null;
  snapshotPricingRules?: Record<string, unknown> | null;
  ordem?: number;
};

export type ProposalFilters = {
  status?: ProposalStatus;
  leadId?: string;
  clientId?: string;
  limit?: number;
  offset?: number;
};

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

async function recalcTotals(db: NoroDatabase, proposalId: string) {
  const items = await db.query.proposalItems.findMany({
    where: eq(proposalItems.proposalId, proposalId),
  });
  const subtotal = items.reduce((sum, i) => sum + (i.precoVendaCents ?? 0), 0);
  await db
    .update(proposals)
    .set({ subtotalCents: subtotal, totalCents: subtotal, updatedAt: new Date() })
    .where(eq(proposals.id, proposalId));
}

// ---------------------------------------------------------------------------
// Proposals CRUD
// ---------------------------------------------------------------------------

export async function createProposal(db: NoroDatabase, input: CreateProposalInput) {
  const [created] = await db.insert(proposals).values(input).returning();
  return created ?? null;
}

export async function getProposalById(db: NoroDatabase, tenantId: string, proposalId: string) {
  return db.query.proposals.findFirst({
    where: and(eq(proposals.id, proposalId), eq(proposals.tenantId, tenantId)),
    with: { items: { orderBy: [asc(proposalItems.ordem)] } },
  });
}

export async function getProposalByToken(db: NoroDatabase, token: string) {
  return db.query.proposals.findFirst({
    where: eq(proposals.aceiteToken, token),
    with: { items: { orderBy: [asc(proposalItems.ordem)] } },
  });
}

export async function getProposalsByTenant(
  db: NoroDatabase,
  tenantId: string,
  filters: ProposalFilters = {},
) {
  const { status, leadId, clientId, limit = 50, offset = 0 } = filters;

  const conditions = [eq(proposals.tenantId, tenantId)];
  if (status) conditions.push(eq(proposals.status, status));
  if (leadId) conditions.push(eq(proposals.leadId, leadId));
  if (clientId) conditions.push(eq(proposals.clientId, clientId));

  return db.query.proposals.findMany({
    where: and(...conditions),
    orderBy: [desc(proposals.createdAt)],
    limit,
    offset,
  });
}

export async function updateProposal(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
  input: Partial<Omit<CreateProposalInput, 'tenantId' | 'numero'>>,
) {
  const [updated] = await db
    .update(proposals)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(proposals.id, proposalId), eq(proposals.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

export async function sendProposal(db: NoroDatabase, tenantId: string, proposalId: string) {
  const proposal = await getProposalById(db, tenantId, proposalId);
  if (!proposal) return null;

  const [updated] = await db
    .update(proposals)
    .set({
      status: 'enviada',
      versao: proposal.versao + 1,
      sentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(proposals.id, proposalId), eq(proposals.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

// Acionado automaticamente quando cliente acessa via aceite_token
export async function markProposalVisualizadaByToken(db: NoroDatabase, token: string) {
  const proposal = await getProposalByToken(db, token);
  if (!proposal || proposal.status !== 'enviada') return proposal;

  const [updated] = await db
    .update(proposals)
    .set({ status: 'visualizada', updatedAt: new Date() })
    .where(eq(proposals.aceiteToken, token))
    .returning();
  return updated ?? null;
}

export async function acceptProposal(
  db: NoroDatabase,
  token: string,
  aceitaPorNome?: string,
) {
  const proposal = await getProposalByToken(db, token);
  if (!proposal) return null;
  if (!['enviada', 'visualizada'].includes(proposal.status)) return null;

  const [updated] = await db
    .update(proposals)
    .set({
      status: 'aceita',
      aceitaAt: new Date(),
      aceitaPorNome: aceitaPorNome ?? null,
      updatedAt: new Date(),
    })
    .where(eq(proposals.aceiteToken, token))
    .returning();
  return updated ?? null;
}

export async function updateProposalStatus(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
  status: ProposalStatus,
) {
  const [updated] = await db
    .update(proposals)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(proposals.id, proposalId), eq(proposals.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

export async function deleteProposal(db: NoroDatabase, tenantId: string, proposalId: string) {
  await db.delete(proposalItems).where(eq(proposalItems.proposalId, proposalId));
  const [deleted] = await db
    .delete(proposals)
    .where(and(eq(proposals.id, proposalId), eq(proposals.tenantId, tenantId)))
    .returning();
  return deleted ?? null;
}

export async function generateProposalNumber(db: NoroDatabase, tenantId: string) {
  const year = new Date().getFullYear();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(proposals)
    .where(and(eq(proposals.tenantId, tenantId)));
  const seq = ((row?.count ?? 0) + 1).toString().padStart(4, '0');
  return `${year}-${seq}`;
}

// ---------------------------------------------------------------------------
// Proposal items CRUD
// ---------------------------------------------------------------------------

export async function addProposalItem(db: NoroDatabase, input: CreateProposalItemInput) {
  const [created] = await db.insert(proposalItems).values(input).returning();
  if (created) await recalcTotals(db, input.proposalId);
  return created ?? null;
}

export async function updateProposalItem(
  db: NoroDatabase,
  tenantId: string,
  itemId: string,
  input: Partial<Omit<CreateProposalItemInput, 'proposalId'>>,
) {
  // Busca o item para checar se a proposta está aceita
  const item = await db.query.proposalItems.findFirst({
    where: eq(proposalItems.id, itemId),
    with: { proposal: true },
  });

  if (!item) return null;
  if (item.proposal.tenantId !== tenantId) return null;

  // Bloqueio de imutabilidade: snapshot_pricing_rules não pode ser alterado após aceite
  if (item.proposal.aceitaAt && 'snapshotPricingRules' in input) {
    throw new Error(
      'snapshot_pricing_rules é imutável após o aceite da proposta.',
    );
  }

  const [updated] = await db
    .update(proposalItems)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(proposalItems.id, itemId))
    .returning();

  if (updated) await recalcTotals(db, item.proposalId);
  return updated ?? null;
}

export async function removeProposalItem(
  db: NoroDatabase,
  tenantId: string,
  itemId: string,
) {
  const item = await db.query.proposalItems.findFirst({
    where: eq(proposalItems.id, itemId),
    with: { proposal: true },
  });

  if (!item || item.proposal.tenantId !== tenantId) return null;

  const [deleted] = await db
    .delete(proposalItems)
    .where(eq(proposalItems.id, itemId))
    .returning();

  if (deleted) await recalcTotals(db, item.proposalId);
  return deleted ?? null;
}

export async function reorderProposalItems(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
  orderedIds: string[],
) {
  const proposal = await db.query.proposals.findFirst({
    where: and(eq(proposals.id, proposalId), eq(proposals.tenantId, tenantId)),
  });
  if (!proposal) return false;

  await Promise.all(
    orderedIds.map((id, idx) =>
      db
        .update(proposalItems)
        .set({ ordem: idx, updatedAt: new Date() })
        .where(and(eq(proposalItems.id, id), eq(proposalItems.proposalId, proposalId))),
    ),
  );
  return true;
}

export async function getProposalsCountByStatus(db: NoroDatabase, tenantId: string) {
  const rows = await db
    .select({ status: proposals.status, count: sql<number>`count(*)::int` })
    .from(proposals)
    .where(eq(proposals.tenantId, tenantId))
    .groupBy(proposals.status);

  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {});
}
