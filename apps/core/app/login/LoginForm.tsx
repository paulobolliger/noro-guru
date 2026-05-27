'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { signInWithEmailPassword } from '@noro/lib/services/authService'

const inputStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  border: '1px solid #dfe2ea',
  borderRadius: 8,
  padding: '9px 11px',
  background: '#fff',
  width: '100%',
  boxSizing: 'border-box' as const,
}

const inputFieldStyle = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: 13,
  color: '#1f2433',
  background: 'transparent',
  fontFamily: 'inherit',
}

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailPassword(email, password)
      router.push(redirectTo || '/')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#dc2626',
          }}
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: 'rgba(31,36,51,0.6)',
            display: 'block',
            marginBottom: 5,
          }}
        >
          Email
        </label>
        <div style={inputStyle}>
          <Mail size={14} color="rgba(31,36,51,0.45)" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@agencia.com.br"
            style={inputFieldStyle}
          />
        </div>
      </div>

      {/* Senha */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
          <label
            htmlFor="password"
            style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(31,36,51,0.6)' }}
          >
            Senha
          </label>
          <a
            href="#"
            style={{ fontSize: 11, color: '#232452', fontWeight: 600, textDecoration: 'none' }}
          >
            Esqueci a senha
          </a>
        </div>
        <div style={inputStyle}>
          <Lock size={14} color="rgba(31,36,51,0.45)" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputFieldStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'rgba(31,36,51,0.45)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 4,
          width: '100%',
          padding: '11px 14px',
          borderRadius: 9,
          border: 'none',
          background: loading ? 'rgba(35,36,82,0.6)' : '#232452',
          color: '#fff',
          fontSize: 13.5,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: 'inherit',
          transition: 'background .15s',
        }}
      >
        {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p
        style={{
          textAlign: 'center',
          fontSize: 12.5,
          color: 'rgba(31,36,51,0.55)',
          marginTop: 10,
        }}
      >
        Ainda não tem conta?{' '}
        <a href="#" style={{ color: '#232452', fontWeight: 600, textDecoration: 'none' }}>
          Criar conta grátis
        </a>
      </p>
    </form>
  )
}
