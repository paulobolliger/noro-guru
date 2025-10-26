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

// Cliente Supabase para uso no lado do servidor (ex: build-time, rotas de API, Server Actions)
// que requer privilégios de administrador (service_role).
export function createServiceRoleSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias.');
  }

  // Usa createServerClient mas com handlers de cookie vazios, pois não há contexto de request.
  // Isso é seguro porque a service_role key bypassa o RLS.
  return createServerClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        get(name: string) {
          return undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Não faz nada
        },
        remove(name: string, options: CookieOptions) {
          // Não faz nada
        },
      },
    }
  );
}
