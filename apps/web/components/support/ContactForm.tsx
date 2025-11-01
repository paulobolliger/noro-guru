'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // TODO: Integrar com API de suporte
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular envio
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      
      // Auto-hide success message
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Erro ao enviar mensagem. Tente novamente.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.category && formData.message;

  return (
    <div className="bg-[#2E2E3A]/30 border border-[#2E2E3A] rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-[#E0E3FF] font-semibold mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#2E2E3A]/50 border border-[#2E2E3A] rounded-xl px-4 py-3 text-[#E0E3FF] placeholder:text-[#B8C1E0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
            placeholder="Seu nome"
            disabled={status === 'loading'}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[#E0E3FF] font-semibold mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#2E2E3A]/50 border border-[#2E2E3A] rounded-xl px-4 py-3 text-[#E0E3FF] placeholder:text-[#B8C1E0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
            placeholder="seu@email.com"
            disabled={status === 'loading'}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-[#E0E3FF] font-semibold mb-2">
            Categoria *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-[#2E2E3A]/50 border border-[#2E2E3A] rounded-xl px-4 py-3 text-[#E0E3FF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
            disabled={status === 'loading'}
          >
            <option value="">Selecione uma categoria</option>
            <option value="tecnico">Problema Técnico</option>
            <option value="billing">Faturamento</option>
            <option value="feature">Sugestão de Recurso</option>
            <option value="account">Configuração de Conta</option>
            <option value="integration">Integrações</option>
            <option value="other">Outro</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-[#E0E3FF] font-semibold mb-2">
            Assunto *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full bg-[#2E2E3A]/50 border border-[#2E2E3A] rounded-xl px-4 py-3 text-[#E0E3FF] placeholder:text-[#B8C1E0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
            placeholder="Resumo do problema ou dúvida"
            disabled={status === 'loading'}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-[#E0E3FF] font-semibold mb-2">
            Mensagem *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full bg-[#2E2E3A]/50 border border-[#2E2E3A] rounded-xl px-4 py-3 text-[#E0E3FF] placeholder:text-[#B8C1E0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all resize-none"
            placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
            disabled={status === 'loading'}
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 animate-fade-in">
            <p className="text-green-400 font-semibold">
              ✅ Mensagem enviada com sucesso!
            </p>
            <p className="text-green-300 text-sm mt-1">
              Nossa equipe responderá em até 24 horas no e-mail informado.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 animate-fade-in">
            <p className="text-red-400 font-semibold">
              ❌ {errorMessage}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || status === 'loading'}
          className="w-full bg-[#6C5CE7] hover:bg-[#5F4FD1] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#6C5CE7]/20 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar mensagem
            </>
          )}
        </button>

        <p className="text-[#B8C1E0] text-sm text-center">
          Tempo médio de resposta: <strong className="text-[#E0E3FF]">4 horas úteis</strong>
        </p>
      </form>
    </div>
  );
}
