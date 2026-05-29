import { and, desc, eq, sql } from 'drizzle-orm';
import { clients, type ClientStatus, type ClientTipo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateClientInput = {
  tenantId: string;
  leadId?: string | null;
  tipo: ClientTipo;
  nome: string;
  nomePreferido?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  dataNascimento?: string | null;
  genero?: string | null;
  nacionalidade?: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  enderecoCidade?: string | null;
  enderecoEstado?: string | null;
  enderecoPais?: string;
  passaporteNumero?: string | null;
  passaportePais?: string | null;
  passaporteValidade?: string | null;
  passaporteDocUrl?: string | null;
  rg?: string | null;
  cnhNumero?: string | null;
  cnhValidade?: string | null;
  cnhCategorias?: string[] | null;
  restricoesAlimentares?: string[] | null;
  restricoesMedicas?: string | null;
  nivelMobilidade?: string | null;
  aptoAtividadeFisica?: boolean | null;
  status?: ClientStatus;
  nivel?: string | null;
  segmento?: string | null;
  assignedTo?: string | null;
  destinosVisitados?: string[] | null;
  destinosDesejados?: string[] | null;
  tipoAcomodacaoPref?: string | null;
  classeVooPref?: string | null;
  viajacom?: string[] | null;
  contatoEmergenciaNome?: string | null;
  contatoEmergenciaPhone?: string | null;
  contatoEmergenciaParentesco?: string | null;
  lgpdAceito?: boolean;
  lgpdAceitoAt?: Date | null;
  lgpdVersao?: string | null;
  observacoes?: string | null;
};

export type UpdateClientInput = Partial<Omit<CreateClientInput, 'tenantId'>>;

export type ClientFilters = {
  status?: ClientStatus;
  assignedTo?: string;
  segmento?: string;
  limit?: number;
  offset?: number;
};

export async function createClient(db: NoroDatabase, input: CreateClientInput) {
  const [created] = await db.insert(clients).values(input).returning();
  return created ?? null;
}

export async function getClientById(db: NoroDatabase, tenantId: string, clientId: string) {
  return db.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.tenantId, tenantId)),
  });
}

export async function getClientsByTenant(
  db: NoroDatabase,
  tenantId: string,
  filters: ClientFilters = {},
) {
  const { status, assignedTo, segmento, limit = 100, offset = 0 } = filters;

  const conditions = [eq(clients.tenantId, tenantId)];
  if (status) conditions.push(eq(clients.status, status));
  if (assignedTo) conditions.push(eq(clients.assignedTo, assignedTo));
  if (segmento) conditions.push(eq(clients.segmento, segmento as any));

  return db.query.clients.findMany({
    where: and(...conditions),
    orderBy: [desc(clients.createdAt)],
    limit,
    offset,
  });
}

export async function getClientByLeadId(db: NoroDatabase, tenantId: string, leadId: string) {
  return db.query.clients.findFirst({
    where: and(eq(clients.leadId, leadId), eq(clients.tenantId, tenantId)),
  });
}

export async function updateClient(
  db: NoroDatabase,
  tenantId: string,
  clientId: string,
  input: UpdateClientInput,
) {
  const [updated] = await db
    .update(clients)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(clients.id, clientId), eq(clients.tenantId, tenantId)))
    .returning();
  return updated ?? null;
}

export async function deleteClient(db: NoroDatabase, tenantId: string, clientId: string) {
  const [deleted] = await db
    .delete(clients)
    .where(and(eq(clients.id, clientId), eq(clients.tenantId, tenantId)))
    .returning();
  return deleted ?? null;
}

export async function getClientsCountByStatus(db: NoroDatabase, tenantId: string) {
  const rows = await db
    .select({ status: clients.status, count: sql<number>`count(*)::int` })
    .from(clients)
    .where(eq(clients.tenantId, tenantId))
    .groupBy(clients.status);

  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {});
}
