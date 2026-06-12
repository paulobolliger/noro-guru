'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@noro/lib/services/authService';
import { getCurrentTenantId } from '@/lib/tenant-helper';
import {
  createDatabaseClient,
  proposalDocumentsRepository,
  proposalItineraryRepository,
  proposalMessagesRepository,
  emergencyContactsRepository,
  type ProposalDocumentTipo,
  type ItineraryTipo,
  type EmergencyContactTipo,
} from '@noro/db';
import { getSupabaseAdmin } from '@noro/lib/supabase/admin';

const BUCKET = 'portal-documents';

async function getAuthContext() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = await getCurrentTenantId(user.id);
  return { userId: user.id, tenantId };
}

// ---------------------------------------------------------------------------
// Documentos
// ---------------------------------------------------------------------------

export async function uploadDocumentAction(proposalId: string, formData: FormData) {
  const { userId, tenantId } = await getAuthContext();

  const file = formData.get('file') as File | null;
  const name = (formData.get('name') as string | null)?.trim();
  const tipo = (formData.get('tipo') as ProposalDocumentTipo | null) ?? 'outro';
  const visibleToClient = formData.get('visibleToClient') !== 'false';

  if (!file || !file.size || !name) {
    return { success: false, error: 'Arquivo e nome são obrigatórios.' };
  }

  try {
    const ext = file.name.split('.').pop() ?? '';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${tenantId}/${proposalId}/${Date.now()}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const admin = getSupabaseAdmin();
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: false });

    if (uploadError) {
      return { success: false, error: `Upload falhou: ${uploadError.message}` };
    }

    const { db, close } = createDatabaseClient();
    try {
      await proposalDocumentsRepository.createDocument(db, {
        tenantId,
        proposalId,
        name,
        tipo,
        fileUrl: path,
        mimeType: file.type || null,
        sizeBytes: file.size,
        uploadedBy: userId,
        visibleToClient,
      });
    } finally {
      await close();
    }

    revalidatePath(`/orcamentos/${proposalId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro inesperado no upload.' };
  }
}

export async function deleteDocumentAction(proposalId: string, documentId: string) {
  const { tenantId } = await getAuthContext();
  const { db, close } = createDatabaseClient();
  try {
    await proposalDocumentsRepository.deleteDocument(db, tenantId, documentId);
    revalidatePath(`/orcamentos/${proposalId}`);
    return { success: true };
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Itinerário
// ---------------------------------------------------------------------------

export async function addItineraryItemAction(proposalId: string, formData: FormData) {
  const { tenantId } = await getAuthContext();

  const titulo = (formData.get('titulo') as string | null)?.trim();
  if (!titulo) return { success: false, error: 'Título é obrigatório.' };

  const { db, close } = createDatabaseClient();
  try {
    await proposalItineraryRepository.addItineraryItem(db, {
      tenantId,
      proposalId,
      titulo,
      tipo: (formData.get('tipo') as ItineraryTipo | null) ?? 'outro',
      data: (formData.get('data') as string | null) || null,
      horaInicio: (formData.get('horaInicio') as string | null) || null,
      horaFim: (formData.get('horaFim') as string | null) || null,
      local: (formData.get('local') as string | null) || null,
      descricao: (formData.get('descricao') as string | null) || null,
      endereco: (formData.get('endereco') as string | null) || null,
    });
    revalidatePath(`/orcamentos/${proposalId}`);
    return { success: true };
  } finally {
    await close();
  }
}

export async function deleteItineraryItemAction(proposalId: string, itemId: string) {
  const { tenantId } = await getAuthContext();
  const { db, close } = createDatabaseClient();
  try {
    await proposalItineraryRepository.deleteItineraryItem(db, tenantId, itemId);
    revalidatePath(`/orcamentos/${proposalId}`);
    return { success: true };
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Mensagens
// ---------------------------------------------------------------------------

export async function sendAgentMessageAction(proposalId: string, formData: FormData) {
  const { userId, tenantId } = await getAuthContext();

  const content = (formData.get('content') as string | null)?.trim();
  if (!content) return { success: false, error: 'Mensagem não pode estar vazia.' };

  const { db, close } = createDatabaseClient();
  try {
    await proposalMessagesRepository.sendMessage(db, {
      tenantId,
      proposalId,
      senderType: 'agent',
      senderUserId: userId,
      content,
    });
    await proposalMessagesRepository.markMessagesReadByAgent(db, tenantId, proposalId);
    revalidatePath(`/orcamentos/${proposalId}`);
    return { success: true };
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Emergência (por proposta)
// ---------------------------------------------------------------------------

export async function addEmergencyContactAction(proposalId: string | null, formData: FormData) {
  const { tenantId } = await getAuthContext();

  const nome = (formData.get('nome') as string | null)?.trim();
  if (!nome) return { success: false, error: 'Nome é obrigatório.' };

  const { db, close } = createDatabaseClient();
  try {
    await emergencyContactsRepository.createContact(db, {
      tenantId,
      proposalId: proposalId || null,
      tipo: (formData.get('tipo') as EmergencyContactTipo | null) ?? 'outro',
      nome,
      telefone: (formData.get('telefone') as string | null) || null,
      whatsapp: (formData.get('whatsapp') as string | null) || null,
      email: (formData.get('email') as string | null) || null,
      observacoes: (formData.get('observacoes') as string | null) || null,
    });
    if (proposalId) {
      revalidatePath(`/orcamentos/${proposalId}`);
    } else {
      revalidatePath('/configuracoes/emergencia');
    }
    return { success: true };
  } finally {
    await close();
  }
}

export async function deleteEmergencyContactAction(
  proposalId: string | null,
  contactId: string,
) {
  const { tenantId } = await getAuthContext();
  const { db, close } = createDatabaseClient();
  try {
    await emergencyContactsRepository.deleteContact(db, tenantId, contactId);
    if (proposalId) {
      revalidatePath(`/orcamentos/${proposalId}`);
    } else {
      revalidatePath('/configuracoes/emergencia');
    }
    return { success: true };
  } finally {
    await close();
  }
}
