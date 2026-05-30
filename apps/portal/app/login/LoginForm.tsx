'use client';

import { useState } from 'react';
import { requestMagicLink } from '@/lib/magic-link';

export default function LoginForm({
  tenantId,
  agencyDisplayName,
}: {
  tenantId: string;
  agencyDisplayName: string;
}) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = window.location.origin;
      await requestMagicLink(tenantId, email, baseUrl, agencyDisplayName);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ padding: 24, background: '#f0fdf4', borderRadius: 8, textAlign: 'center' }}>
        <p style={{ fontWeight: 600, color: '#16a34a' }}>Link enviado!</p>
        <p style={{ color: '#64748b', marginTop: 8 }}>
          Verifique sua caixa de entrada. O link expira em 15 minutos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 16,
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          boxSizing: 'border-box',
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          marginTop: 16,
          padding: '12px 0',
          background: 'var(--color-primary, #0f172a)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Enviando…' : 'Receber link de acesso'}
      </button>
    </form>
  );
}
