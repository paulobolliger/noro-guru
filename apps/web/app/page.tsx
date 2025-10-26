import { createServerSupabaseClient } from "@lib/supabase/server"; // CORRIGIDO
import { Roteiro } from "@lib/types";
import HomePageClient from "@/components/HomePageClient";

async function getDestinosDestaque(): Promise<Roteiro[]> {
  const supabase = createServerSupabaseClient(); // CORRIGIDO
  const { data, error } = await supabase
    .from('nomade_roteiros')
    .select('*')
    .eq('status', 'published')
    .eq('destaque', true)
    .limit(6);

  if (error) {
    console.error('Erro ao buscar destinos em destaque:', error);
    return [];
  }
  return data;
}

export default async function Home() {
  const destinosDestaque = await getDestinosDestaque();

  return <HomePageClient destinosDestaque={destinosDestaque} />;
}
