// apps/control/lib/supabase/admin.ts
// Server-side Supabase client using the Service Role for Control Plane admin operations.
// Bypasses RLS for platform governance actions (cp.*). Use only on the server.

import { createClient } from '@supabase/supabase-js';

export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE envs for admin client');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'X-Client-Info': 'noro-control-admin' } },
  });
}

