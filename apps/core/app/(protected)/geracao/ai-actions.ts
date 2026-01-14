'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function generateRoteirosAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  
  // 1. Identificar Usuário e Tenant
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Buscar Tenant do Usuário (fallback seguro)
  let tenant_id;
  const { data: userRole } = await supabase
    .from('cp.user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
    
  tenant_id = userRole?.tenant_id;
  
  // Se não achar tenant (ex: admin global sem tenant fixo), usa o tenant 'noro' por padrão
  if (!tenant_id) {
       const { data: tenants } = await supabase.from('cp.tenants').select('id').eq('slug', 'noro').single();
       tenant_id = tenants?.id;
  }

  if (!tenant_id) throw new Error('Tenant not found');

  // 2. Extrair Dados do Form
  const destinosRaw = formData.get('input-list') as string;
  const tipo = formData.get('tipo') as string;
  const dificuldade = formData.get('dificuldade') as string;
  const categoria = formData.get('categoria') as string;

  const destinos = destinosRaw.split('\n').filter(line => line.trim() !== '');

  // 3. Processar (Simulação de IA por enquanto / Placeholder)
  const inserts = destinos.map(destino => ({
    tenant_id,
    titulo: `Roteiro para ${destino}`,
    destino: destino,
    tipo,
    dificuldade,
    status: 'draft',
    conteudo: {
        intro: `Este é um roteiro gerado automaticamente para ${destino}.`,
        dias: [
            { dia: 1, atividade: "Chegada e Check-in" },
            { dia: 2, atividade: "Exploração local" },
            { dia: 3, atividade: "Tour cultural" }
        ],
        tags: [tipo, categoria]
    }
  }));

  // 4. Salvar no Banco
  const { error } = await supabase.from('noro_ai_roteiros').insert(inserts);

  if (error) {
    console.error('Erro ao salvar roteiros:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/geracao/roteiros');
  return { success: true, count: inserts.length };
}

export async function generateArtigosAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  
  // 1. Identificar Usuário e Tenant
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  let tenant_id;
  const { data: userRole } = await supabase
    .from('cp.user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
    
  tenant_id = userRole?.tenant_id;
  
  if (!tenant_id) {
       const { data: tenants } = await supabase.from('cp.tenants').select('id').eq('slug', 'noro').single();
       tenant_id = tenants?.id;
  }

  if (!tenant_id) throw new Error('Tenant not found');

  // 2. Extrair Dados
  const temasRaw = formData.get('input-list') as string;
  const categoria = formData.get('categoria') as string;
  const tom = formData.get('tom') as string;
  const tamanho = formData.get('tamanho') as string;

  const temas = temasRaw.split('\n').filter(line => line.trim() !== '');

  // 3. Processar (Simulação)
  const inserts = temas.map(tema => ({
    tenant_id,
    titulo: tema,
    categoria,
    tom_voz: tom,
    tamanho,
    status: 'draft',
    conteudo: `# ${tema}\n\nEste é um esboço de artigo sobre ${tema} gerado em ${new Date().toLocaleDateString()}.\n\n## Introdução\n...\n\n## Desenvolvimento\n...\n\n## Conclusão\n...`
  }));

  // 4. Salvar
  const { error } = await supabase.from('noro_ai_artigos').insert(inserts);

  if (error) {
    console.error('Erro ao salvar artigos:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/geracao/artigos');
  return { success: true, count: inserts.length };
}
