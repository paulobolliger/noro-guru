// apps/core/test-auth/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Importa o nosso novo cliente unificado

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const supabase = createClient();

  // ============================
  // Testes de Conexão
  // ============================
  const testConnection = async () => {
    console.log('🧪 Testando conexão com Supabase...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    setResult({
      type: 'connection',
      url,
      anonKey: anonKey ? `${anonKey.substring(0, 20)}...` : 'NÃO ENCONTRADA',
      timestamp: new Date().toISOString(),
    });
  };

  // ============================
  // Signup / Signin / Logout
  // ============================
  const testSignUp = async () => {
    setResult(null);
    const email = `teste-${Date.now()}@nomade.guru`;
    const password = 'password123';

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setResult({ type: 'signup', data, message: 'Conta de teste criada! Verifique o console.' });
    } catch (err: any) {
      setResult({ type: 'signup', error: err.message });
    }
  };

  const testSignIn = async () => {
    setResult(null);
    const email = prompt("Digite o email da conta de teste para entrar:", "teste@nomade.guru");
    const password = prompt("Digite a senha:", "123456");

    if (!email || !password) {
        setResult({type: 'signin', error: 'Email e senha são necessários.'});
        return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setResult({
        type: 'signin',
        user: data.user?.id,
        session: data.session ? 'OK' : 'FALHOU',
        error: error?.message,
      });
    } catch (err: any) {
      setResult({ type: 'signin', error: err.message });
    }
  };

  const testSignOut = async () => {
    setResult(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setResult({ type: 'signout', error: error.message });
    } else {
      setResult({ type: 'signout', message: 'Logout efetuado com sucesso.' });
    }
  };

  const checkSession = async () => {
    setResult(null);
    const { data: { session } } = await supabase.auth.getSession();
    setResult({ type: 'session', session: session ? 'LOGADO' : 'NÃO LOGADO', user: session?.user?.email });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🧪 Teste de Autenticação e Cliente</h1>
        <p className="text-sm text-gray-600 mb-6">
          Esta página executa testes de autenticação seguros no lado do cliente.
          As operações de administrador que requerem a `service_role_key` foram removidas por segurança.
        </p>

        <div className="space-y-4">
          <button
            onClick={testConnection}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            1. Testar Variáveis de Ambiente
          </button>

          <button
            onClick={testSignUp}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            2. Criar Nova Conta de Teste
          </button>

          <button
            onClick={testSignIn}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
          >
            3. Fazer Login
          </button>

          <button
            onClick={checkSession}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            4. Verificar Sessão Atual
          </button>

          <button
            onClick={testSignOut}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            5. Logout
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="font-bold mb-2 text-gray-700">Resultado:</h2>
            <pre className="text-xs text-gray-800 overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Abra o console do navegador (F12) para ver logs mais detalhados.</p>
        </div>
      </div>
    </div>
  );
}
