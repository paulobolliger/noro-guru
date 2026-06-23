import { and, eq } from 'drizzle-orm';
import { bspIngestions } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateBspIngestionInput = {
  tenantId: string;
  fileName: string;
  fileSize: number;
  status?: string;
  errorLog?: string | null;
  processedAt?: Date | null;
};

export type UpdateBspIngestionInput = Partial<CreateBspIngestionInput>;

export async function createBspIngestion(db: NoroDatabase, input: CreateBspIngestionInput) {
  const [created] = await db.insert(bspIngestions).values(input).returning();
  return created ?? null;
}

export async function getBspIngestionById(db: NoroDatabase, tenantId: string, ingestionId: string) {
  return db.query.bspIngestions.findFirst({
    where: and(eq(bspIngestions.tenantId, tenantId), eq(bspIngestions.id, ingestionId)),
  });
}

export async function getBspIngestions(db: NoroDatabase, tenantId: string) {
  return db.query.bspIngestions.findMany({
    where: eq(bspIngestions.tenantId, tenantId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function updateBspIngestion(
  db: NoroDatabase,
  tenantId: string,
  ingestionId: string,
  input: UpdateBspIngestionInput
) {
  const [updated] = await db
    .update(bspIngestions)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(bspIngestions.tenantId, tenantId), eq(bspIngestions.id, ingestionId)))
    .returning();
  return updated ?? null;
}

export async function deleteBspIngestion(db: NoroDatabase, tenantId: string, ingestionId: string) {
  const [deleted] = await db
    .delete(bspIngestions)
    .where(and(eq(bspIngestions.tenantId, tenantId), eq(bspIngestions.id, ingestionId)))
    .returning();
  return deleted ?? null;
}
