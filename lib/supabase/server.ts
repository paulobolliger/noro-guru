// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type Database from '@/types/supabase'; // CORREÇÃO: Usando 'import type' sem chaves

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  // Validação das variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são necessárias.');
  }

  // Cliente tipado com a interface 'Database'
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Em Server Actions, os cabeçalhos podem ser somente de leitura.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
             // Em Server Actions, os cabeçalhos podem ser somente de leitura.
          }
        },
      },
    }
  );
}

