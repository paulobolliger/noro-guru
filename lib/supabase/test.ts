// /lib/supabase/test.ts
// ------------------------------------------------------------
// Diagnóstico rápido do Supabase Admin
// ------------------------------------------------------------

import 'dotenv/config';
import { getSupabaseAdmin } from './admin';

async function main() {
  console.log('🔍 Iniciando teste de conexão com o Supabase Admin...\n');

  const SUPABASE_URL =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ ERRO: Variáveis de ambiente não carregadas!');
    console.error('SUPABASE_URL:', SUPABASE_URL);
    console.error('SERVICE_ROLE_KEY:', SERVICE_ROLE_KEY ? 'definida ✅' : 'faltando ❌');
    process.exit(1);
  }

  console.log('✅ Variáveis carregadas com sucesso.');
  console.log('URL:', SUPABASE_URL);
  console.log('SERVICE_ROLE_KEY: (oculta por segurança)');
  console.log('------------------------------------------------------------\n');

  try {
    const supabase = getSupabaseAdmin();

    // Teste básico de leitura
    const { data, error } = await supabase
      .from('nomade_leads')
      .select('*')
      .limit(3);

    if (error) throw error;

    console.log('📦 Teste de leitura bem-sucedido!');
    console.log(`Foram retornados ${data?.length || 0} registros.`);
    if (data && data.length > 0) {
      console.table(
        data.map((lead) => ({
          id: lead.id,
          email: lead.email,
          origem: lead.origem,
          criado_em: lead.created_at,
        }))
      );
    } else {
      console.log('ℹ️ Nenhum registro encontrado em "nomade_leads".');
    }

    console.log('\n✨ Supabase Admin está operacional!');
  } catch (err: any) {
    console.error('🚨 Erro ao conectar ao Supabase:');
    console.error(err.message);
  }

  console.log('\n🧭 Teste concluído.');
  console.log('------------------------------------------------------------\n');
}

main();
