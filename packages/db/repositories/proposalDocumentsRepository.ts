import { and, desc, eq, inArray } from 'drizzle-orm';
import { proposalDocuments, proposals, type ProposalDocumentTipo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateDocumentInput = {
  tenantId: string;
  proposalId: string;
  name: string;
  tipo: ProposalDocumentTipo;
  fileUrl: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  uploadedBy?: string | null;
  visibleToClient?: boolean;
};

export async function getDocumentsByProposal(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  return db.query.proposalDocuments.findMany({
    where: and(
      eq(proposalDocuments.tenantId, tenantId),
      eq(proposalDocuments.proposalId, proposalId),
      eq(proposalDocuments.visibleToClient, true),
    ),
    orderBy: [desc(proposalDocuments.createdAt)],
  });
}

// Versão admin: retorna todos os documentos, incluindo ocultos para o cliente
export async function getAllDocumentsByProposal(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  return db.query.proposalDocuments.findMany({
    where: and(
      eq(proposalDocuments.tenantId, tenantId),
      eq(proposalDocuments.proposalId, proposalId),
    ),
    orderBy: [desc(proposalDocuments.createdAt)],
  });
}

export type DocumentWithProposal = Awaited<ReturnType<typeof getDocumentsByClient>>[number];

export async function getDocumentsByClient(
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

  const docs = await db.query.proposalDocuments.findMany({
    where: and(
      eq(proposalDocuments.tenantId, tenantId),
      inArray(proposalDocuments.proposalId, proposalIds),
      eq(proposalDocuments.visibleToClient, true),
    ),
    orderBy: [desc(proposalDocuments.createdAt)],
  });

  const proposalMap = Object.fromEntries(clientProposals.map((p) => [p.id, p]));
  return docs.map((d) => ({
    ...d,
    proposal: d.proposalId ? (proposalMap[d.proposalId] ?? null) : null,
  }));
}

export async function createDocument(db: NoroDatabase, input: CreateDocumentInput) {
  const [created] = await db.insert(proposalDocuments).values(input).returning();
  return created ?? null;
}

export async function deleteDocument(
  db: NoroDatabase,
  tenantId: string,
  documentId: string,
) {
  const [deleted] = await db
    .delete(proposalDocuments)
    .where(and(eq(proposalDocuments.id, documentId), eq(proposalDocuments.tenantId, tenantId)))
    .returning();
  return deleted ?? null;
}
