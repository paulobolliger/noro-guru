    // apps/core/debug/page.tsx
    // Esta página é um Componente de Servidor e roda apenas no backend.

    export default function DebugPage() {
      // Tentamos ler as variáveis de ambiente diretamente do processo do servidor.
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      const urlStatus = supabaseUrl ? 'Carregada ✅' : 'Faltando ❌';
      const keyStatus = serviceKey ? 'Carregada ✅' : 'Faltando ❌';

      return (
        <div style={{ fontFamily: 'monospace', padding: '40px', backgroundColor: '#0c0e1a', color: 'white', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            Diagnóstico de Variáveis de Ambiente (Lado do Servidor)
          </h1>
          <p style={{ fontSize: '16px', marginTop: '20px' }}>
            Esta página mostra o status das variáveis de ambiente que o servidor Next.js conseguiu ler do seu arquivo `.env.local`.
          </p>
          <div style={{ marginTop: '30px', fontSize: '18px', lineHeight: '1.8' }}>
            <p>
              <span style={{ color: '#888' }}>process.env.SUPABASE_URL: </span>
              <span style={{ fontWeight: 'bold', color: supabaseUrl ? '#22c55e' : '#ef4444' }}>
                {urlStatus}
              </span>
            </p>
            <p>
              <span style={{ color: '#888' }}>process.env.SUPABASE_SERVICE_ROLE_KEY: </span>
              <span style={{ fontWeight: 'bold', color: serviceKey ? '#22c55e' : '#ef4444' }}>
                {keyStatus}
              </span>
            </p>
          </div>
          {(!supabaseUrl || !serviceKey) && (
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#ef444420', border: '1px solid #ef4444', borderRadius: '8px' }}>
              <h2 style={{ color: '#ef4444' }}>Ação Necessária</h2>
              <p>Uma ou mais variáveis estão faltando. Por favor, confirme que:</p>
              <ol style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>O arquivo chamado exatamente <strong>.env.local</strong> existe na pasta raiz do seu projeto.</li>
                <li>Você <strong>reiniciou completamente</strong> o servidor de desenvolvimento (Ctrl + C e depois `npm run dev`) após criar ou modificar o arquivo.</li>
              </ol>
            </div>
          )}
        </div>
      );
    }
    
