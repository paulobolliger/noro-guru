import { createClient } from '@supabase/supabase-js';

const BUCKET = 'portal-documents';

function getStorageClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured for storage');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function createSignedDownloadUrl(
  filePath: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const supabase = getStorageClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, expiresInSeconds);
  if (error || !data) throw new Error(`Signed URL failed: ${error?.message}`);
  return data.signedUrl;
}
