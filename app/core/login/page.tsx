// app/core/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/core'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const logoUrl = 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png'

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}` },
        })
        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
            if (loginError) throw loginError
            router.push(redirectTo)
            router.refresh()
            return
          }
          throw signUpError
        }
        alert('Conta criada! Verifique seu e-mail para confirmar antes de fazer login.')
        setIsSignUp(false)
        setPassword('')
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        if (!data.session) throw new Error('Sessão não criada.')
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err: any) {
      let msg = err.message || 'Erro ao processar solicitação'
      if (msg.includes('Invalid login credentials')) msg = 'E-mail ou senha incorretos.'
      if (msg.includes('Email not confirmed')) msg = 'Confirme seu e-mail antes de continuar.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}` },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-guru to-noro flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-soft border border-gray-100">
        <div className="text-center mb-8">
          <Image src={logoUrl} alt="NORO" width={140} height={40} className="mx-auto h-8 w-auto mb-3" priority unoptimized />
          <h1 className="text-3xl font-display font-semibold text-noro">
            {isSignUp ? 'Criar Conta' : 'Acesso ao Painel'}
          </h1>
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-guru"
              disabled={loading}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-guru"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-full disabled:opacity-70" disabled={loading}>
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={handleGoogleLogin} disabled={loading} className="btn glass w-full text-gray-900 disabled:opacity-70">
            {loading && <Loader2 className="animate-spin" size={20} />} Continuar com Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="ml-1 font-semibold text-guru hover:text-noro"
            disabled={loading}
          >
            {isSignUp ? 'Acessar' : 'Criar Conta'}
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-700">← Voltar ao Site Principal</Link>
        </p>
      </div>
    </div>
  )
}
