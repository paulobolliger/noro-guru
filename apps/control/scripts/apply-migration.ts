import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

if (process.env.NORO_ALLOW_LEGACY_DB_SCRIPT !== 'I_UNDERSTAND_THIS_TOUCHES_DATA') {
  throw new Error(
    'Legacy database script is frozen. Set NORO_ALLOW_LEGACY_DB_SCRIPT=I_UNDERSTAND_THIS_TOUCHES_DATA only after an audited rollback plan.',
  );
}

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('📋 Verificando se a coluna "source" já existe...');
  
  // Primeiro, vamos verificar se a coluna já existe tentando fazer uma query
  const { data: testData, error: testError } = await supabase
    .schema('cp')
    .from('support_tickets')
    .select('id, source')
    .limit(1);
  
  if (!testError) {
    console.log('✅ Coluna "source" já existe na tabela!');
    console.log('� Dados de teste:', testData);
    return;
  }
  
  if (testError.code === '42703') { // Column does not exist
    console.log('⚠️  Coluna "source" não existe. Vamos criá-la...');
    console.log('\n⚠️  ATENÇÃO: Não é possível executar ALTER TABLE via Supabase client.');
    console.log('� Por favor, execute o SQL abaixo manualmente no Supabase Dashboard:');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`
-- Add source column to support_tickets
ALTER TABLE cp.support_tickets
ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual';

COMMENT ON COLUMN cp.support_tickets.source IS 'Origin of the ticket: manual, website, tenant_dashboard, api, email';

-- Create index for common queries filtering by source
CREATE INDEX IF NOT EXISTS idx_support_tickets_source ON cp.support_tickets(source);
    `);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔗 Acesse: https://supabase.com/dashboard/project/eqewshxuxefbctdfnbuj/editor');
    console.log('💡 SQL Editor → New Query → Cole e Execute o SQL acima');
    return;
  }
  
  console.error('❌ Erro inesperado ao verificar:', testError);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Erro:', err);
    process.exit(1);
  });
