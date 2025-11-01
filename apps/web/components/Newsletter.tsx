'use client';

import React, { useState } from 'react';

interface NewsletterProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export default function Newsletter({ variant = 'light', compact = false }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Por favor, insira um email válido');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('✨ Pronto! Verifique seu email para confirmar a inscrição.');
        setEmail('');
        
        // Auto-hide success message after 5s
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erro ao inscrever. Tente novamente.');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro de conexão. Verifique sua internet e tente novamente.');
      setTimeout(() => setStatus('idle'), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = variant === 'dark';
  
  if (compact) {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            className={`flex-1 px-4 py-2 rounded-lg ${
              isDark 
                ? 'bg-white/10 text-white placeholder-white/50 border border-white/20' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-[#1DD3C0]`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#1DD3C0] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#1DD3C0]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? '...' : 'Assinar'}
          </button>
        </form>
        {status !== 'idle' && (
          <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-4 text-4xl">📧</div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Fique por Dentro das Novidades
        </h3>
        <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Receba conteúdos exclusivos, dicas práticas e atualizações sobre gestão e tecnologia
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu melhor email"
              className={`w-full px-6 py-4 rounded-xl ${
                isDark 
                  ? 'bg-white/10 text-white placeholder-white/50 border border-white/20' 
                  : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#1DD3C0] transition-all ${
                status === 'error' ? 'border-red-500 focus:ring-red-500' : ''
              } ${
                status === 'success' ? 'border-green-500 focus:ring-green-500' : ''
              }`}
              disabled={isLoading}
              aria-label="Email para newsletter"
              aria-describedby={status !== 'idle' ? 'newsletter-status' : undefined}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1DD3C0] border-t-transparent"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-[#1DD3C0] to-[#342CA4] text-white font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_#1DD3C0] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
            aria-label={isLoading ? 'Inscrevendo...' : 'Assinar Newsletter'}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Inscrevendo...
              </span>
            ) : (
              'Assinar Newsletter'
            )}
          </button>
        </form>

        {status !== 'idle' && (
          <div 
            id="newsletter-status"
            className={`mt-4 p-4 rounded-lg animate-fade-in ${
              status === 'success' 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              {status === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <p className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Prometemos não enviar spam. Você pode cancelar a qualquer momento.
        </p>
      </div>
    </div>
  );
}
