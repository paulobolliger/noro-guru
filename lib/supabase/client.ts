// lib/supabase/client.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ ERRO: Variáveis de ambiente do Supabase Client não carregadas!");
  throw new Error("As chaves do Supabase Client não estão definidas. Verifique o .env.local.");
}

// Função exportada (para uso em componentes cliente)
export function createClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
