// lib/supabase/cp.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type Database from "@/types/supabase";

/**
 * Cria um client Supabase já apontando explicitamente para o schema "cp".
 * Força o uso do service_role e aplica prefixo automático para todas as queries.
 */
export function supabaseServerAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias."
    );
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      },
    }
  );

  /**
   * Função auxiliar: executa qualquer query dentro do schema cp
   */
  function fromCp<T = any>(table: string) {
    return supabase.from<T>(`cp.${table}`);
  }

  /**
   * Função auxiliar: chama RPCs do schema cp
   */
  function rpcCp(fn: string, params?: Record<string, any>) {
    return supabase.rpc(`cp.${fn}`, params);
  }

  // Retorna o supabase original + helpers
  return Object.assign(supabase, { fromCp, rpcCp });
}

