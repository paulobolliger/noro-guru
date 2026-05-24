'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    agency: '',
    consultores: '',
    desafio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to API
    alert('Demonstração agendada! Entraremos em contato em até 24h.');
  };

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 56px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 16px',
          }}
        >
          Agende sua demonstração
        </h1>
        <p style={{ fontSize: 18, color: '#B8C1E0', margin: 0 }}>
          30 minutos para ver o Noro Guru em ação
        </p>
      </section>

      {/* Content */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 80px 96px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
        className="px-6 md:px-20 grid-cols-1 md:grid-cols-2"
      >
        {/* Form card */}
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 40,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 28px',
            }}
          >
            Preencha seus dados
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Nome completo', key: 'name', type: 'text', placeholder: 'Seu nome' },
              { label: 'E-mail corporativo', key: 'email', type: 'email', placeholder: 'voce@agencia.com.br' },
              { label: 'WhatsApp', key: 'whatsapp', type: 'tel', placeholder: '+55 (11) 9 9999-9999' },
              { label: 'Nome da agência', key: 'agency', type: 'text', placeholder: 'Nome da sua agência' },
            ].map((field) => (
              <div key={field.key}>
                <label
                  style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#E0E3FF', marginBottom: 8 }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    background: '#1a1d35',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(52,44,164,0.6)';
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                />
              </div>
            ))}

            {/* Select fields */}
            {[
              {
                label: 'Quantos consultores?',
                key: 'consultores',
                options: ['1-5 consultores', '6-20 consultores', '20+ consultores'],
              },
              {
                label: 'Principal desafio',
                key: 'desafio',
                options: ['Organização', 'Financeiro', 'Geração de conteúdo', 'Atendimento', 'Crescimento'],
              },
            ].map((field) => (
              <div key={field.key}>
                <label
                  style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#E0E3FF', marginBottom: 8 }}
                >
                  {field.label}
                </label>
                <select
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    background: '#1a1d35',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: form[field.key as keyof typeof form] ? '#fff' : '#B8C1E0',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Selecione...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#342CA4',
                color: '#fff',
                border: 0,
                borderRadius: 10,
                padding: '14px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                marginTop: 8,
                transition: 'background .15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#3B2CA4';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#342CA4';
              }}
            >
              Agendar demonstração
            </button>
          </form>
        </div>

        {/* Info column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* What you'll see */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 20px',
              }}
            >
              O que você vai ver
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Pipeline e CRM ao vivo',
                'Geração de conteúdo com IA',
                'Atendimento omnichannel',
                'Dashboard financeiro',
                'Publicação de site',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#D1D5F0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1DD3C0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div
            style={{
              background: '#12152C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#D4AF37">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 14, color: '#D1D5F0', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 16px' }}>
              &ldquo;A demo durou 25 minutos e no final já tinha certeza que ia assinar. O consultor conhecia o mercado de viagens de verdade.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#342CA4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                JF
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#E0E3FF' }}>Juliana Fonseca</div>
                <div style={{ fontSize: 11, color: '#B8C1E0' }}>CEO · Trilha & Sonho</div>
              </div>
            </div>
          </div>

          {/* Note */}
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, textAlign: 'center' }}>
            Respondemos em até 24h · Sem compromisso
          </p>
        </div>
      </section>
    </div>
  );
}
