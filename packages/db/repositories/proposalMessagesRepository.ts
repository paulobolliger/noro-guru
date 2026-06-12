import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { proposalMessages, proposals, type MessageSenderType } from '../schema';
import type { NoroDatabase } from '../index';

export type SendMessageInput = {
  tenantId: string;
  proposalId: string;
  senderType: MessageSenderType;
  content: string;
  senderUserId?: string | null;
  senderClientId?: string | null;
};

export async function getMessagesByProposal(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  return db.query.proposalMessages.findMany({
    where: and(
      eq(proposalMessages.tenantId, tenantId),
      eq(proposalMessages.proposalId, proposalId),
    ),
    orderBy: [asc(proposalMessages.createdAt)],
  });
}

export type MessagesWithProposal = Awaited<ReturnType<typeof getMessagesByClient>>[number];

export async function getMessagesByClient(
  db: NoroDatabase,
  tenantId: string,
  clientId: string,
) {
  const clientProposals = await db.query.proposals.findMany({
    where: and(eq(proposals.tenantId, tenantId), eq(proposals.clientId, clientId)),
    columns: { id: true, titulo: true, destinoPrincipal: true },
  });

  if (clientProposals.length === 0) return [];

  const proposalIds = clientProposals.map((p) => p.id);

  const messages = await db.query.proposalMessages.findMany({
    where: and(
      eq(proposalMessages.tenantId, tenantId),
      inArray(proposalMessages.proposalId, proposalIds),
    ),
    orderBy: [asc(proposalMessages.createdAt)],
  });

  const proposalMap = Object.fromEntries(clientProposals.map((p) => [p.id, p]));
  return messages.map((m) => ({
    ...m,
    proposal: proposalMap[m.proposalId] ?? null,
  }));
}

export async function sendMessage(db: NoroDatabase, input: SendMessageInput) {
  const [created] = await db.insert(proposalMessages).values(input).returning();
  return created ?? null;
}

export async function markMessagesReadByAgent(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  // Marca como lidas as mensagens enviadas pelo cliente que o agente ainda não leu
  await db
    .update(proposalMessages)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(proposalMessages.tenantId, tenantId),
        eq(proposalMessages.proposalId, proposalId),
        eq(proposalMessages.senderType, 'client'),
        isNull(proposalMessages.readAt),
      ),
    );
}

export async function markMessagesReadByClient(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  await db
    .update(proposalMessages)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(proposalMessages.tenantId, tenantId),
        eq(proposalMessages.proposalId, proposalId),
        eq(proposalMessages.senderType, 'agent'),
        isNull(proposalMessages.readAt),
      ),
    );
}

export async function countUnreadByAgent(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  const rows = await db.query.proposalMessages.findMany({
    where: and(
      eq(proposalMessages.tenantId, tenantId),
      eq(proposalMessages.proposalId, proposalId),
      eq(proposalMessages.senderType, 'client'),
      isNull(proposalMessages.readAt),
    ),
    columns: { id: true },
  });
  return rows.length;
}
