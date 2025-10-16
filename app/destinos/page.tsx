// app/destinos/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'; // CORRIGIDO
import { Roteiro } from '@/lib/types';
import DestinosClient from '@/components/DestinosClient';

// Função que busca os dados no servidor
async function getRoteiros(): Promise<Roteiro[]> {
  const supabase = createServerSupabaseClient(); // CORRIGIDO
  const { data, error } = await supabase
    .from('nomade_roteiros')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar roteiros:', error);
    return [];
  }
  return data as Roteiro[];
}

// O componente da página (Server Component) que busca os dados
// e os passa para o Client Component
export default async function DestinosPage() {
  const allRoteiros = await getRoteiros();
  return <DestinosClient allRoteiros={allRoteiros} />;
}
