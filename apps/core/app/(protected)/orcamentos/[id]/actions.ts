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
import { createHash } from 'crypto';

async function uploadToCloudinary(file: File, folder: string): Promise<string | null> {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    console.warn('Cloudinary credentials missing. Skipping upload.');
    return null;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash('sha1').update(toSign).digest('hex');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Cloudinary upload error response:', errBody);
      return null;
    }

    const data = await response.json();
    return data.secure_url || data.url || null;
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    return null;
  }
}

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
    const uploadedUrl = await uploadToCloudinary(file, `proposals/${tenantId}/${proposalId}`);
    if (!uploadedUrl) {
      return { success: false, error: 'Upload falhou: Erro ao fazer upload para Cloudinary.' };
    }

    const { db, close } = createDatabaseClient();
    try {
      await proposalDocumentsRepository.createDocument(db, {
        tenantId,
        proposalId,
        name,
        tipo,
        fileUrl: uploadedUrl,
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
