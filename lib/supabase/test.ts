  import 'dotenv/config';
  import { supabaseAdmin } from './admin'; // Corrigido

  async function main() {
    console.log('🔍 Iniciando teste de conexão com o Supabase Admin...\n');

    try {
      // Teste básico de leitura
      const { data, error } = await supabaseAdmin
        .from('noro_leads')
        .select('id, email, origem, created_at') // Seleciona colunas específicas
        .limit(3);

      if (error) throw error;

      console.log('📦 Teste de leitura bem-sucedido!');
      console.log(`Foram retornados ${data?.length || 0} registros.`);
      if (data && data.length > 0) {
        console.table(data);
      } else {
        console.log('ℹ️ Nenhum registro encontrado em "noro_leads".');
      }

      console.log('\n✨ Supabase Admin está operacional!');
    } catch (err: any) {
      console.error('🚨 Erro ao conectar ao Supabase:');
      console.error(err.message);
    }

    console.log('\n🧭 Teste concluído.');
  }

  main();
  
