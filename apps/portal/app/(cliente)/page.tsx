// Dashboard do viajante — UI completa na Sprint 7
export default function ClienteDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
        Meu painel de viagens
      </h1>
      <p style={{ color: '#64748b' }}>
        Aqui você encontrará suas propostas, pagamentos e documentos de viagem.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 32 }}>
        {[
          { label: 'Propostas', href: '/cliente/propostas', emoji: '📋' },
          { label: 'Pagamentos', href: '/cliente/pagamentos', emoji: '💳' },
          { label: 'Documentos', href: '/cliente/documentos', emoji: '📄' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: 24,
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color .15s',
            }}
          >
            <span style={{ fontSize: 32 }}>{item.emoji}</span>
            <p style={{ fontWeight: 600, marginTop: 12 }}>{item.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
