import { and, asc, eq, inArray } from 'drizzle-orm';
import { proposalItineraryItems, proposals, type ItineraryTipo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateItineraryItemInput = {
  tenantId: string;
  proposalId: string;
  titulo: string;
  tipo?: ItineraryTipo;
  data?: string | null;
  horaInicio?: string | null;
  horaFim?: string | null;
  local?: string | null;
  descricao?: string | null;
  endereco?: string | null;
  documentId?: string | null;
  ordem?: number;
};

export async function getItineraryByProposal(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  return db.query.proposalItineraryItems.findMany({
    where: and(
      eq(proposalItineraryItems.tenantId, tenantId),
      eq(proposalItineraryItems.proposalId, proposalId),
    ),
    orderBy: [asc(proposalItineraryItems.data), asc(proposalItineraryItems.ordem)],
    with: { document: { columns: { id: true, name: true, fileUrl: true } } },
  });
}

export type ItineraryItemWithProposal = Awaited<ReturnType<typeof getItineraryByClient>>[number];

export async function getItineraryByClient(
  db: NoroDatabase,
  tenantId: string,
  clientId: string,
) {
  const clientProposals = await db.query.proposals.findMany({
    where: and(eq(proposals.tenantId, tenantId), eq(proposals.clientId, clientId)),
    columns: { id: true, titulo: true, destinoPrincipal: true, dataViagemInicio: true },
  });

  if (clientProposals.length === 0) return [];

  const proposalIds = clientProposals.map((p) => p.id);

  const items = await db.query.proposalItineraryItems.findMany({
    where: and(
      eq(proposalItineraryItems.tenantId, tenantId),
      inArray(proposalItineraryItems.proposalId, proposalIds),
    ),
    orderBy: [asc(proposalItineraryItems.data), asc(proposalItineraryItems.ordem)],
    with: { document: { columns: { id: true, name: true, fileUrl: true } } },
  });

  const proposalMap = Object.fromEntries(clientProposals.map((p) => [p.id, p]));
  return items.map((item) => ({
    ...item,
    proposal: proposalMap[item.proposalId] ?? null,
  }));
}

export async function addItineraryItem(db: NoroDatabase, input: CreateItineraryItemInput) {
  const [created] = await db.insert(proposalItineraryItems).values(input).returning();
  return created ?? null;
}

export async function updateItineraryItem(
  db: NoroDatabase,
  tenantId: string,
  itemId: string,
  input: Partial<Omit<CreateItineraryItemInput, 'tenantId' | 'proposalId'>>,
) {
  const [updated] = await db
    .update(proposalItineraryItems)
    .set(input)
    .where(
      and(eq(proposalItineraryItems.id, itemId), eq(proposalItineraryItems.tenantId, tenantId)),
    )
    .returning();
  return updated ?? null;
}

export async function deleteItineraryItem(
  db: NoroDatabase,
  tenantId: string,
  itemId: string,
) {
  const [deleted] = await db
    .delete(proposalItineraryItems)
    .where(
      and(eq(proposalItineraryItems.id, itemId), eq(proposalItineraryItems.tenantId, tenantId)),
    )
    .returning();
  return deleted ?? null;
}
