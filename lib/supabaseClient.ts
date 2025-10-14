import { createClient } from '@supabase/supabase-js'

// As variáveis de ambiente são carregadas a partir do ficheiro .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validar que as variáveis de ambiente foram definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis SUPABASE_URL e SUPABASE_ANON_KEY devem ser definidas no ficheiro .env.local')
}

// Criar e exportar o cliente Supabase para ser usado em toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
