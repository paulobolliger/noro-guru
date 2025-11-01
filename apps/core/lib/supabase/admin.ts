import { createClient } from '@/lib/supabase/server'

export async function getNotificacoes(userId: string, limit: number = 10) {
  const supabase = createClient()
  
  // Por enquanto retorna array vazio
  // TODO: Implementar busca de notificações quando a tabela existir
  return []
}
