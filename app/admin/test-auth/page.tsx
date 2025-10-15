// app/admin/test-auth/page.tsx
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);

  // Cliente "normal" front-end
  const supabase = createClientComponentClient();

  // Cliente admin usando service role (apenas para testes)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ============================
  // Testes de Conexão
  // ============================
  const testConnection = async () => {
    console.log('🧪 Testando conexão com Supabase...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    setResult({
      url,
      anonKey: anonKey?.substring(0, 20) + '...',
      serviceKey: serviceKey?.substring(0, 20) + '...',
      timestamp: new Date().toISOString(),
    });
  };

  // ============================
  // Signup / Signin / Logout
  // ============================
  const testSignUp = async () => {
    const email = 'teste@nomade.guru';
    const password = '123456';

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setResult({ type: 'signup', data, error: error?.message });
    } catch (err) {
      setResult({ type: 'signup', error: String(err) });
    }
  };

  const testSignIn = async () => {
    const email = 'teste@nomade.guru';
    const password = '123456';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setResult({
        type: 'signin',
        user: data.user?.id,
        session: data.session ? 'OK' : 'FALHOU',
        error: error?.message,
      });
    } catch (err) {
      setResult({ type: 'signin', error: String(err) });
    }
  };

  const testSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setResult({ type: 'signout', error: error.message });
    } else {
      setResult({ type: 'signout', message: 'Logout OK' });
    }
  };

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setResult({ type: 'session', session: session ? 'LOGADO' : 'DESLOGADO', user: session?.user?.email });
  };

  // ============================
  // Operações Admin (Service Key)
  // ============================
  const testAdminCRUD = async () => {
    try {
      // Criar lead
      const lead = {
        nome: 'Teste Admin',
        email: `teste_admin_${Date.now()}@nomade.guru`,
        origem: 'teste',
        status: 'novo',
      };

      const { data: createdLead, error: createError } = await supabaseAdmin
        .from('nomade_leads')
        .insert(lead)
        .select()
        .single();

      if (createError) throw createError;

      // Atualizar lead
      const { data: updatedLead, error: updateError } = await supabaseAdmin
        .from('nomade_leads')
        .update({ status: 'contatado' })
        .eq('id', createdLead.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Buscar lead pelo ID
      const { data: fetchedLead, error: fetchError } = await supabaseAdmin
        .from('nomade_leads')
        .select('*')
        .eq('id', createdLead.id)
        .single();

      if (fetchError) throw fetchError;

      // Deletar lead
      const { error: deleteError } = await supabaseAdmin
        .from('nomade_leads')
        .delete()
        .eq('id', createdLead.id);

      if (deleteError) throw deleteError;

      setResult({
        type: 'adminCRUD',
        createdLead,
        updatedLead,
        fetchedLead,
        deletedLead: true,
      });
    } catch (err: any) {
      setResult({ type: 'adminCRUD', error: String(err) });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">🧪 Teste de Autenticação e Admin</h1>

        <div className="space-y-4">
          <button
            onClick={testConnection}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            1. Testar Conexão Supabase
          </button>

          <button
            onClick={testSignUp}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            2. Criar Conta (teste@nomade.guru)
          </button>

          <button
            onClick={testSignIn}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600"
          >
            3. Fazer Login (teste@nomade.guru)
          </button>

          <button
            onClick={testSignOut}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
          >
            4. Logout
          </button>

          <button
            onClick={checkSession}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            5. Verificar Sessão Atual
          </button>

          <button
            onClick={testAdminCRUD}
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600"
          >
            6. Testar CRUD Admin (Service Role)
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Resultado:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Console do navegador:</strong> Abra F12 para ver logs detalhados</p>
        </div>
      </div>
    </div>
  );
}
