"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { 
  createDatabaseClient,
  bspIngestionsRepository,
  bspRecordsRepository,
  agencyMemosRepository,
  tenantsRepository,
  trafficDocumentsRepository,
  suppliersRepository
} from "@noro/db";
import { requireUser, logtoSessionAdapter } from "@noro/auth";
import { logtoConfig } from "@/lib/logto";
import { parseBspFile } from "@noro/lib";

// Helper to get active tenant ID for the session
export async function getActiveTenantId(): Promise<string | null> {
  const c = cookies();
  const cookieId = c.get("active_tenant_id")?.value;
  if (cookieId) return cookieId;

  // Fallback to first available tenant
  const { db, close } = createDatabaseClient();
  try {
    const list = await tenantsRepository.listTenants(db, 1);
    return list[0]?.id || null;
  } catch (err) {
    console.error("Error fetching fallback tenant ID:", err);
    return null;
  } finally {
    await close();
  }
}

// Action to retrieve all BSP and Memo data for the active tenant
export async function getBspDataAction() {
  const { db, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const activeTenantId = await getActiveTenantId();
    if (!activeTenantId) {
      return {
        success: false,
        error: "Nenhum tenant ativo encontrado.",
        tenants: [],
        activeTenantId: null,
        ingestions: [],
        records: [],
        memos: [],
        suppliers: []
      };
    }

    const [allTenants, ingestions, records, memos, suppliersList] = await Promise.all([
      tenantsRepository.listTenants(db),
      bspIngestionsRepository.getBspIngestions(db, activeTenantId),
      bspRecordsRepository.getBspRecords(db, activeTenantId),
      agencyMemosRepository.getAgencyMemosByTenant(db, activeTenantId),
      suppliersRepository.getSuppliers(db) // global suppliers for dropdown
    ]);

    return {
      success: true,
      tenants: allTenants.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
      activeTenantId,
      ingestions,
      records,
      memos,
      suppliers: suppliersList.map((s: any) => ({ id: s.id, nome: s.nome, tipo: s.tipo }))
    };
  } catch (error: any) {
    console.error("Error in getBspDataAction:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao carregar dados BSP.",
      tenants: [],
      activeTenantId: null,
      ingestions: [],
      records: [],
      memos: [],
      suppliers: []
    };
  } finally {
    await close();
  }
}

// Action to change active tenant selection
export async function switchTenantAction(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  if (!tenantId) return;

  const c = cookies();
  c.set("active_tenant_id", tenantId, { path: "/", httpOnly: true, sameSite: "lax" });
  revalidatePath("/bsp");
}

// Action to upload and parse a BSP RET/CSV file
export async function uploadBspFileAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { success: false, error: "Nenhum arquivo enviado ou arquivo está vazio." };
  }

  const activeTenantId = await getActiveTenantId();
  if (!activeTenantId) {
    return { success: false, error: "Nenhum tenant ativo selecionado." };
  }

  const { db, close } = createDatabaseClient();
  try {
    // 1. Verify admin user context
    await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const fileContent = await file.text();
    const rawRecords = parseBspFile(fileContent);
    const parsedRecords: Array<{
      ticketNumber: string;
      transactionType: string;
      issueDate: Date | null;
      billingAmount: string;
      taxAmount: string;
      commissionAmount: string;
      reconciledState: 'RECONCILED' | 'UNRECONCILED';
      matchedDocId: string | null;
      reconciledAt: Date | null;
    }> = [];

    for (const raw of rawRecords) {
      // Check if ticket exists in traffic_documents
      const doc = await db.query.trafficDocuments.findFirst({
        where: (td, { and, eq }) => and(
          eq(td.tenantId, activeTenantId),
          eq(td.docNumber, raw.ticketNumber)
        )
      });

      parsedRecords.push({
        ...raw,
        reconciledState: doc ? 'RECONCILED' : 'UNRECONCILED',
        matchedDocId: doc ? doc.id : null,
        reconciledAt: doc ? new Date() : null,
      });
    }

    if (parsedRecords.length === 0) {
      return { success: false, error: "Nenhum registro válido encontrado no arquivo. O formato deve ser TICKET;TIPO;FATURADO;TAXAS;COMISSAO" };
    }

    // Save in transaction
    await db.transaction(async (tx) => {
      const ingestion = await bspIngestionsRepository.createBspIngestion(tx, {
        tenantId: activeTenantId,
        fileName: file.name,
        fileSize: file.size,
        status: "PROCESSED",
        processedAt: new Date(),
      });

      if (!ingestion) {
        throw new Error("Falha ao registrar ingestão no banco.");
      }

      for (const rec of parsedRecords) {
        await bspRecordsRepository.createBspRecord(tx, {
          tenantId: activeTenantId,
          bspIngestionId: ingestion.id,
          ...rec,
        });
      }
    });

    revalidatePath("/bsp");
    return { success: true, count: parsedRecords.length };
  } catch (error: any) {
    console.error("Error parsing/ingesting BSP file:", error);
    return { success: false, error: error.message || "Erro durante o processamento do arquivo." };
  } finally {
    await close();
  }
}

// Action to link a BSP record manually to a traffic document
export async function manualReconcileAction(recordId: string, docId: string) {
  const activeTenantId = await getActiveTenantId();
  if (!activeTenantId) {
    return { success: false, error: "Tenant ativo não encontrado." };
  }

  const { db, close } = createDatabaseClient();
  try {
    await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const updated = await bspRecordsRepository.updateBspRecord(db, activeTenantId, recordId, {
      reconciledState: 'RECONCILED',
      reconciledAt: new Date(),
      matchedDocId: docId,
    });

    if (!updated) {
      return { success: false, error: "Registro BSP não encontrado ou não atualizado." };
    }

    revalidatePath("/bsp");
    return { success: true };
  } catch (error: any) {
    console.error("Error manualReconcileAction:", error);
    return { success: false, error: error.message || "Erro ao conciliar registro." };
  } finally {
    await close();
  }
}

// Action to create an ADM or ACM agency memo
export async function createAgencyMemoAction(data: {
  memoType: 'ADM' | 'ACM';
  memoNumber: string;
  supplierId: string;
  ticketNumber: string;
  amount: string;
  reason: string;
}) {
  const activeTenantId = await getActiveTenantId();
  if (!activeTenantId) {
    return { success: false, error: "Tenant ativo não encontrado." };
  }

  const { db, close } = createDatabaseClient();
  try {
    await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const created = await agencyMemosRepository.createAgencyMemo(db, {
      tenantId: activeTenantId,
      memoType: data.memoType,
      memoNumber: data.memoNumber,
      supplierId: data.supplierId,
      ticketNumber: data.ticketNumber || null,
      amount: data.amount,
      reason: data.reason || null,
      status: "OPEN",
    });

    if (!created) {
      return { success: false, error: "Falha ao criar o memo de disputa." };
    }

    revalidatePath("/bsp");
    return { success: true, memo: created };
  } catch (error: any) {
    console.error("Error createAgencyMemoAction:", error);
    return { success: false, error: error.message || "Erro ao criar disputa." };
  } finally {
    await close();
  }
}

// Action to update agency memo status (dispute lifecycle)
export async function updateAgencyMemoStatusAction(memoId: string, status: string) {
  const activeTenantId = await getActiveTenantId();
  if (!activeTenantId) {
    return { success: false, error: "Tenant ativo não encontrado." };
  }

  const { db, close } = createDatabaseClient();
  try {
    await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const updateObj: Record<string, any> = { status };
    if (["RESOLVED", "ACCEPTED", "REJECTED"].includes(status)) {
      updateObj.resolvedAt = new Date();
    }

    const updated = await agencyMemosRepository.updateAgencyMemo(db, activeTenantId, memoId, updateObj);

    if (!updated) {
      return { success: false, error: "Agency Memo não encontrado ou não atualizado." };
    }

    revalidatePath("/bsp");
    return { success: true };
  } catch (error: any) {
    console.error("Error updateAgencyMemoStatusAction:", error);
    return { success: false, error: error.message || "Erro ao atualizar status." };
  } finally {
    await close();
  }
}

// Action to query ticket numbers (autocomplete/manual match selector helper)
export async function searchTrafficDocumentsAction(query: string) {
  const activeTenantId = await getActiveTenantId();
  if (!activeTenantId) return [];

  const { db, close } = createDatabaseClient();
  try {
    // Find documents by number containing query
    const results = await db.query.trafficDocuments.findMany({
      where: (td, { and, eq, ilike }) => and(
        eq(td.tenantId, activeTenantId),
        ilike(td.docNumber, `%${query}%`)
      ),
      limit: 10
    });
    return results.map(doc => ({ id: doc.id, docNumber: doc.docNumber, validatingCarrier: doc.validatingCarrier }));
  } catch (err) {
    console.error("Error in searchTrafficDocumentsAction:", err);
    return [];
  } finally {
    await close();
  }
}
