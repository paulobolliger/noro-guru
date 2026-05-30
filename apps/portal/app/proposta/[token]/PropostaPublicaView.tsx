'use client';

import { useState } from 'react';
import { aceitarPropostaPorToken } from './actions';

type Proposal = {
  id: string;
  numero: string;
  titulo: string;
  status: string;
  totalCents: number | null;
  moedaBase: string;
  validadeAte: string | null;
  descricao: string | null;
  aceitaTipo: string | null;
  aceitaAt: Date | null;
};

export default function PropostaPublicaView({
  proposal,
  tenantName,
}: {
  proposal: Proposal;
  tenantName: string;
}) {
  const [nome, setNome] = useState('');
  const [aceita, setAceita] = useState(proposal.status === 'aceita');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAccept = ['enviada', 'visualizada'].includes(proposal.status) && !aceita;
  const totalFormatted = proposal.totalCents != null
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: proposal.moedaBase }).format(proposal.totalCents / 100)
    : '—';

  async function handleAceite() {
    if (!nome.trim()) { setError('Por favor, informe seu nome completo.'); return; }
    setLoading(true);
    setError('');
    try {
      const url = window.location.pathname;
      const token = url.split('/').pop() ?? '';
      const result = await aceitarPropostaPorToken(token, nome);
      if (result.success) setAceita(true);
      else setError('Não foi possível registrar o aceite. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{tenantName} · Proposta #{proposal.numero}</p>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{proposal.titulo}</h1>

      {proposal.descricao && (
        <p style={{ color: '#475569', marginTop: 16, lineHeight: 1.6 }}>{proposal.descricao}</p>
      )}

      <div style={{ margin: '32px 0', padding: 24, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: 13, color: '#64748b' }}>Total</p>
        <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: 4 }}>{totalFormatted}</p>
        {proposal.validadeAte && (
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
            Válido até {new Date(proposal.validadeAte).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      {aceita ? (
        <div style={{ padding: 24, background: '#f0fdf4', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: '#16a34a', fontSize: '1.1rem' }}>✓ Proposta aceita!</p>
          <p style={{ color: '#64748b', marginTop: 8 }}>
            {proposal.aceitaAt ? `Aceite registrado em ${new Date(proposal.aceitaAt).toLocaleString('pt-BR')}` : ''}
          </p>
        </div>
      ) : canAccept ? (
        <div>
          <p style={{ fontWeight: 600, marginBottom: 16 }}>Aceitar esta proposta</p>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', fontSize: 16, border: '1px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
          <button
            onClick={handleAceite}
            disabled={loading}
            style={{
              width: '100%', marginTop: 16, padding: '14px 0',
              background: '#16a34a', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 16, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Registrando…' : 'Confirmar aceite'}
          </button>
        </div>
      ) : (
        <div style={{ padding: 16, background: '#f1f5f9', borderRadius: 8, color: '#64748b', fontSize: 14 }}>
          Status: <strong>{proposal.status}</strong>
        </div>
      )}
    </main>
  );
}
