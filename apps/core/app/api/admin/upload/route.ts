// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { uploadFile, deleteFile, type StorageBucket } from '@/lib/storage/upload';

/**
 * POST /api/admin/upload
 *
 * Faz upload de um arquivo para o Supabase Storage
 *
 * Body (FormData):
 * - file: File (obrigatório)
 * - bucket: StorageBucket (obrigatório)
 * - folder: string (opcional)
 * - fileName: string (opcional)
 *
 * Retorna:
 * {
 *   success: boolean,
 *   url?: string,
 *   path?: string,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // 2. Obter tenant ID
    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant não identificado' },
        { status: 400 }
      );
    }

    // 3. Parsear FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as StorageBucket;
    const folder = formData.get('folder') as string | undefined;
    const fileName = formData.get('fileName') as string | undefined;

    // 4. Validar inputs
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    if (!bucket) {
      return NextResponse.json(
        { success: false, error: 'Bucket não especificado' },
        { status: 400 }
      );
    }

    const validBuckets: StorageBucket[] = ['logos', 'avatars', 'documents', 'images', 'attachments'];
    if (!validBuckets.includes(bucket)) {
      return NextResponse.json(
        { success: false, error: 'Bucket inválido' },
        { status: 400 }
      );
    }

    // 5. Fazer upload
    const result = await uploadFile(file, {
      tenantId,
      bucket,
      folder,
      fileName,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // 6. Log de auditoria (opcional)
    console.log('[Upload API] File uploaded:', {
      userId: user.id,
      tenantId,
      bucket,
      path: result.path,
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[Upload API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/upload
 *
 * Remove um arquivo do Storage
 *
 * Body (JSON):
 * {
 *   bucket: StorageBucket,
 *   path: string
 * }
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // 2. Obter tenant ID
    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant não identificado' },
        { status: 400 }
      );
    }

    // 3. Parsear body
    const body = await request.json();
    const { bucket, path } = body;

    if (!bucket || !path) {
      return NextResponse.json(
        { success: false, error: 'Bucket e path são obrigatórios' },
        { status: 400 }
      );
    }

    // 4. Verificar se o path pertence ao tenant (segurança)
    if (!path.startsWith(tenantId)) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado: arquivo não pertence ao tenant' },
        { status: 403 }
      );
    }

    // 5. Deletar arquivo
    const result = await deleteFile(bucket, path);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // 6. Log de auditoria
    console.log('[Upload API] File deleted:', {
      userId: user.id,
      tenantId,
      bucket,
      path,
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[Upload API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
