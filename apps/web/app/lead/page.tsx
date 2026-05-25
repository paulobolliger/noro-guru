'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function getUTM() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v;
  });
  return utm;
}

export default function LeadCapturePage() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // UTM captured on submit
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const payload = {
      tenant_slug: 'noro',
      ...form,
      source: 'web',
      consent: true,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      ...getUTM(),
      captcha_token: 'dev-mock',
    };
    try {
      const r = await fetch('/api/ingest-lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.status === 202) {
        setStatus('success');
      } else {
        const data = await r.json().catch(() => ({}));
        setErrorMsg(data?.error || `Erro ${r.status}`);
        setStatus('error');
      }
    } catch {
      setErrorMsg('Falha na conexão. Tente novamente.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          background: '#0B1220',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div style={{ fontSize: 64 }}>✅</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>
          Recebido!
        </h1>
        <p style={{ fontSize: 16, color: '#B8C1E0', margin: 0, maxWidth: 380 }}>
          Nossa equipe entrará em contato em até 24 horas.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#342CA4',
            color: '#fff',
            borderRadius: 10,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', padding: '80px 24px 96px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Voltar
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: '0 0 8px',
          }}
        >
          Fale com a Noro Guru
        </h1>
        <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 40px', lineHeight: 1.6 }}>
          Preencha o formulário e nossa equipe entra em contato em até 24h.
        </p>

        <form
          onSubmit={submit}
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {[
            { key: 'organization_name', label: 'Nome da agência *', placeholder: 'Ex: Viagens dos Sonhos', type: 'text', required: true },
            { key: 'contact_name', label: 'Seu nome', placeholder: 'Nome completo', type: 'text', required: false },
            { key: 'email', label: 'E-mail *', placeholder: 'seuemail@agencia.com.br', type: 'email', required: true },
            { key: 'phone', label: 'WhatsApp', placeholder: '+55 11 99999-9999', type: 'tel', required: false },
          ].map((field) => (
            <div key={field.key}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#E0E3FF',
                  marginBottom: 8,
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                required={field.required}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#E0E3FF', marginBottom: 8 }}>
              Mensagem
            </label>
            <textarea
              placeholder="Conte brevemente o que você precisa..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontSize: 14,
                color: '#fff',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {status === 'error' && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 13,
                color: '#f87171',
              }}
            >
              ❌ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '14px',
              background: status === 'loading' ? '#4B5563' : '#342CA4',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
            }}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar mensagem →'}
          </button>

          <p style={{ fontSize: 12, color: '#B8C1E0', textAlign: 'center', margin: 0 }}>
            Respondemos em até 24h · Sem compromisso
          </p>
        </form>
      </div>
    </div>
  );
}
