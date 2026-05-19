'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function requireAuthWithTenant() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Não autenticado. Faça login para continuar.');

  const { data: tenantRow } = await supabase
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  if (!tenantRow?.tenant_id) {
    throw new Error(`Usuário ${user.id} não possui tenant vinculado.`);
  }

  return { supabase, user, tenant_id: tenantRow.tenant_id };
}

export async function generateRoteirosAction(formData: FormData) {
  const { supabase, tenant_id } = await requireAuthWithTenant();

  const destinosRaw = formData.get('input-list') as string;
  const tipo = formData.get('tipo') as string;
  const dificuldade = formData.get('dificuldade') as string;
  const categoria = formData.get('categoria') as string;

  const destinos = destinosRaw.split('\n').filter(line => line.trim() !== '');
  if (destinos.length === 0) {
    return { success: false, message: 'Nenhum destino informado.' };
  }

  const inserts = destinos.map(destino => ({
    tenant_id,
    titulo: `Roteiro para ${destino}`,
    destino,
    tipo,
    dificuldade,
    status: 'draft',
    conteudo: {
      intro: `Este é um roteiro gerado automaticamente para ${destino}.`,
      dias: [
        { dia: 1, atividade: 'Chegada e Check-in' },
        { dia: 2, atividade: 'Exploração local' },
        { dia: 3, atividade: 'Tour cultural' },
      ],
      tags: [tipo, categoria],
    },
  }));

  const { error } = await supabase.from('noro_ai_roteiros').insert(inserts);
  if (error) {
    console.error('Erro ao salvar roteiros:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/geracao/roteiros');
  return { success: true, count: inserts.length };
}

export async function generateArtigosAction(formData: FormData) {
  const { supabase, tenant_id } = await requireAuthWithTenant();

  const temasRaw = formData.get('input-list') as string;
  const categoria = formData.get('categoria') as string;
  const tom = formData.get('tom') as string;
  const tamanho = formData.get('tamanho') as string;

  const temas = temasRaw.split('\n').filter(line => line.trim() !== '');
  if (temas.length === 0) {
    return { success: false, message: 'Nenhum tema informado.' };
  }

  const inserts = temas.map(tema => ({
    tenant_id,
    titulo: tema,
    categoria,
    tom_voz: tom,
    tamanho,
    status: 'draft',
    conteudo: `# ${tema}\n\nEste é um esboço de artigo sobre ${tema} gerado em ${new Date().toLocaleDateString()}.\n\n## Introdução\n...\n\n## Desenvolvimento\n...\n\n## Conclusão\n...`,
  }));

  const { error } = await supabase.from('noro_ai_artigos').insert(inserts);
  if (error) {
    console.error('Erro ao salvar artigos:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/geracao/artigos');
  return { success: true, count: inserts.length };
}
