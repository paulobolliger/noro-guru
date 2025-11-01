// apps/core/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Se o login for bem-sucedido, redireciona para a rota que tentou aceder, ou para /admin
  const redirectTo = searchParams.get('redirect') || '/admin'; 
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🚀 Autenticação iniciada:', { email, isSignUp });

    try {
      if (isSignUp) {
        console.log('🧾 Tentando criar conta...');
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
          },
        });

        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            console.log('⚠️ Usuário já existe — efetuando login direto...');
            const { error: loginError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (loginError) throw loginError;
            console.log('✅ Login automático bem-sucedido');
            router.push(redirectTo);
            router.refresh();
            return;
          }
          throw signUpError;
        }

        console.log('✅ Conta criada com sucesso:', data);
        alert('Conta criada! Verifique seu e-mail para confirmar antes de fazer login.');
        setIsSignUp(false);
        setPassword('');
      } else {
        console.log('🔑 Efetuando login...');
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;
        if (!data.session) throw new Error('Sessão não criada.');

        console.log('🎉 Login OK — redirecionando...');
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      console.error('❌ Erro de autenticação:', err);
      let msg = err.message || 'Erro ao processar solicitação';
      if (msg.includes('Invalid login credentials')) msg = 'E-mail ou senha incorretos.';
      if (msg.includes('Email not confirmed')) msg = 'Confirme seu e-mail antes de continuar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    console.log('🔵 Login com Google...');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('❌ Erro OAuth:', err);
      setError(err.message || 'Erro ao fazer login com Google');
      setLoading(false);
    }
  };

  return (
    // Esta div garante que o componente ocupe a tela inteira e centralize seu conteúdo
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Criar Conta Admin' : 'Acesso ao Painel Admin'}
          </h1>
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {/* Campo de E-mail */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Campo de Senha */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        {/* Separador ou Botão Google */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            <i className="fab fa-google"></i> Continuar com Google
          </button>
        </div>

        {/* Toggle para SignUp/SignIn */}
        <p className="mt-8 text-center text-sm text-gray-600">
          {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
            disabled={loading}
          >
            {isSignUp ? 'Aceder' : 'Criar Conta'}
          </button>
        </p>

        {/* Link para o site */}
        <p className="mt-4 text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-700">← Voltar ao Site Principal</Link>
        </p>
      </div>
    </div>
  );
}