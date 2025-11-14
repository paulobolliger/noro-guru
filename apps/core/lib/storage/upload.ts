// lib/storage/upload.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

/**
 * Tipos de buckets disponíveis no Supabase Storage
 * Cada bucket tem suas próprias regras de segurança e isolamento por tenant
 */
export type StorageBucket =
  | 'logos'       // Logos da empresa
  | 'avatars'     // Fotos de perfil
  | 'documents'   // Documentos gerais (PDFs, contratos, etc)
  | 'images'      // Imagens de conteúdo (artigos, roteiros)
  | 'attachments' // Anexos diversos

/**
 * Configuração de limites por tipo de bucket
 */
const BUCKET_LIMITS: Record<StorageBucket, {
  maxSizeMB: number;
  allowedTypes: string[];
}> = {
  logos: {
    maxSizeMB: 2,
    allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  },
  avatars: {
    maxSizeMB: 2,
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  documents: {
    maxSizeMB: 10,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  images: {
    maxSizeMB: 5,
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  },
  attachments: {
    maxSizeMB: 10,
    allowedTypes: ['*'], // Aceita qualquer tipo
  },
};

/**
 * Resultado do upload
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Opções de upload
 */
export interface UploadOptions {
  /** Tenant ID para isolamento */
  tenantId: string;
  /** Bucket de destino */
  bucket: StorageBucket;
  /** Nome customizado do arquivo (opcional) */
  fileName?: string;
  /** Sobrescrever arquivo existente */
  upsert?: boolean;
  /** Pasta dentro do bucket (opcional) */
  folder?: string;
}

/**
 * Valida o arquivo antes do upload
 */
function validateFile(
  file: File,
  bucket: StorageBucket
): { valid: boolean; error?: string } {
  const limits = BUCKET_LIMITS[bucket];

  // Validar tamanho
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > limits.maxSizeMB) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${limits.maxSizeMB}MB`,
    };
  }

  // Validar tipo MIME
  if (limits.allowedTypes[0] !== '*' && !limits.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Permitidos: ${limits.allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Gera um nome único para o arquivo
 */
function generateFileName(originalName: string): string {
  const extension = originalName.split('.').pop();
  const uniqueId = nanoid(10);
  const timestamp = Date.now();
  return `${timestamp}_${uniqueId}.${extension}`;
}

/**
 * Constrói o path do arquivo com isolamento de tenant
 */
function buildFilePath(options: UploadOptions, fileName: string): string {
  const { tenantId, folder } = options;

  // Estrutura: {tenant_id}/{folder?}/{filename}
  const parts = [tenantId];
  if (folder) {
    parts.push(folder);
  }
  parts.push(fileName);

  return parts.join('/');
}

/**
 * Faz upload de um arquivo para o Supabase Storage
 *
 * @example
 * const result = await uploadFile(file, {
 *   tenantId: 'tenant-123',
 *   bucket: 'logos',
 *   folder: 'empresa'
 * });
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // 1. Validar arquivo
    const validation = validateFile(file, options.bucket);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // 2. Gerar nome do arquivo
    const fileName = options.fileName || generateFileName(file.name);
    const filePath = buildFilePath(options, fileName);

    // 3. Obter cliente Supabase
    const supabase = createServerSupabaseClient();

    // 4. Fazer upload
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: options.upsert || false,
      });

    if (error) {
      console.error('[Upload] Error uploading file:', error);
      return {
        success: false,
        error: `Erro ao fazer upload: ${error.message}`,
      };
    }

    // 5. Obter URL pública
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    console.error('[Upload] Unexpected error:', error);
    return {
      success: false,
      error: 'Erro inesperado ao fazer upload do arquivo',
    };
  }
}

/**
 * Remove um arquivo do Storage
 *
 * @example
 * await deleteFile('logos', 'tenant-123/empresa/logo.png');
 */
export async function deleteFile(
  bucket: StorageBucket,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('[Upload] Error deleting file:', error);
      return {
        success: false,
        error: `Erro ao deletar arquivo: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Upload] Unexpected error deleting file:', error);
    return {
      success: false,
      error: 'Erro inesperado ao deletar arquivo',
    };
  }
}

/**
 * Lista arquivos de um tenant em um bucket
 *
 * @example
 * const files = await listFiles('documents', 'tenant-123', 'contratos');
 */
export async function listFiles(
  bucket: StorageBucket,
  tenantId: string,
  folder?: string
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();

    const path = folder ? `${tenantId}/${folder}` : tenantId;

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('[Upload] Error listing files:', error);
      return {
        success: false,
        error: `Erro ao listar arquivos: ${error.message}`,
      };
    }

    return {
      success: true,
      files: data,
    };
  } catch (error: any) {
    console.error('[Upload] Unexpected error listing files:', error);
    return {
      success: false,
      error: 'Erro inesperado ao listar arquivos',
    };
  }
}

/**
 * Move um arquivo dentro do mesmo bucket
 * Útil para reorganização ou mudança de tenant
 */
export async function moveFile(
  bucket: StorageBucket,
  fromPath: string,
  toPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.storage
      .from(bucket)
      .move(fromPath, toPath);

    if (error) {
      console.error('[Upload] Error moving file:', error);
      return {
        success: false,
        error: `Erro ao mover arquivo: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Upload] Unexpected error moving file:', error);
    return {
      success: false,
      error: 'Erro inesperado ao mover arquivo',
    };
  }
}
