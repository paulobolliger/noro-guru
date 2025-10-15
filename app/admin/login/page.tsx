// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* ... resto do JSX permanece igual ... */}
    </div>
  );
}