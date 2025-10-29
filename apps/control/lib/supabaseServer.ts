// apps/control/lib/supabaseServer.ts
// Server-side Supabase client bound to Next.js App Router cookies (RLS-aware)

import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!url || !anonKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const cookieStore = cookies();
  const hdrs = headers();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
    headers: {
      // forward limited headers to improve auth context in SSR
      'X-Forwarded-For': hdrs.get('x-forwarded-for') || undefined,
      'User-Agent': hdrs.get('user-agent') || undefined,
    },
  });
}

