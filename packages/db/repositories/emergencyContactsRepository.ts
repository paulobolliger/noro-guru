import { and, asc, eq, inArray, isNull, or } from 'drizzle-orm';
import { emergencyContacts, proposals, type EmergencyContactTipo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateEmergencyContactInput = {
  tenantId: string;
  proposalId?: string | null;
  tipo: EmergencyContactTipo;
  nome: string;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  observacoes?: string | null;
  ordem?: number;
  ativo?: boolean;
};

export async function getContactsByTenant(db: NoroDatabase, tenantId: string) {
  return db.query.emergencyContacts.findMany({
    where: and(eq(emergencyContacts.tenantId, tenantId), isNull(emergencyContacts.proposalId)),
    orderBy: [asc(emergencyContacts.ordem), asc(emergencyContacts.createdAt)],
  });
}

export async function getContactsByProposal(
  db: NoroDatabase,
  tenantId: string,
  proposalId: string,
) {
  return db.query.emergencyContacts.findMany({
    where: and(
      eq(emergencyContacts.tenantId, tenantId),
      eq(emergencyContacts.proposalId, proposalId),
    ),
    orderBy: [asc(emergencyContacts.ordem), asc(emergencyContacts.createdAt)],
  });
}

export async function getContactsForClient(
  db: NoroDatabase,
  tenantId: string,
  clientId: string,
) {
  // Retorna: contatos globais do tenant + contatos das propostas do cliente
  const clientProposals = await db.query.proposals.findMany({
    where: and(eq(proposals.tenantId, tenantId), eq(proposals.clientId, clientId)),
    columns: { id: true, titulo: true },
  });

  const proposalIds = clientProposals.map((p) => p.id);

  const contacts = await db.query.emergencyContacts.findMany({
    where: and(
      eq(emergencyContacts.tenantId, tenantId),
      eq(emergencyContacts.ativo, true),
      or(
        isNull(emergencyContacts.proposalId),
        proposalIds.length > 0
          ? inArray(emergencyContacts.proposalId, proposalIds)
          : isNull(emergencyContacts.proposalId),
      ),
    ),
    orderBy: [asc(emergencyContacts.ordem), asc(emergencyContacts.createdAt)],
  });

  const proposalMap = Object.fromEntries(clientProposals.map((p) => [p.id, p]));
  return contacts.map((c) => ({
    ...c,
    proposal: c.proposalId ? (proposalMap[c.proposalId] ?? null) : null,
  }));
}

export async function createContact(db: NoroDatabase, input: CreateEmergencyContactInput) {
  const [created] = await db.insert(emergencyContacts).values(input).returning();
  return created ?? null;
}

export async function updateContact(
  db: NoroDatabase,
  tenantId: string,
  contactId: string,
  input: Partial<Omit<CreateEmergencyContactInput, 'tenantId'>>,
) {
  const [updated] = await db
    .update(emergencyContacts)
    .set(input)
    .where(and(eq(emergencyContacts.id, contactId), eq(emergencyContacts.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

export async function deleteContact(
  db: NoroDatabase,
  tenantId: string,
  contactId: string,
) {
  const [deleted] = await db
    .delete(emergencyContacts)
    .where(and(eq(emergencyContacts.id, contactId), eq(emergencyContacts.tenantId, tenantId)))
    .returning();
  return deleted ?? null;
}
