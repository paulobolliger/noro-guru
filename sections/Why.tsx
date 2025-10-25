import Container from '@/components/Container'

const items = [
  {
    emoji: '💡',
    title: 'Design Inteligente',
    text: 'Layouts que aprendem com você.'
  },
  {
    emoji: '⚡',
    title: 'Performance Real',
    text: 'Sites rápidos, seguros e escaláveis.'
  },
  {
    emoji: '🔗',
    title: 'Automação Integrada',
    text: 'Conecte CRM, formulários e analytics com um clique.'
  }
]

export default function Why() {
  return (
    <section id="servicos" className="section">
      <Container>
        <div className="max-w-3xl mx-auto section-band">
          <span className="badge hidden">Por que a NORO?</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-noro">Núcleo inteligente. Resultados consistentes.</h2>
          <p className="mt-3 text-gray-600">Tecnologia que entende, aprende e simplifica.</p>
        </div>
        <div className="mt-5 grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="card p-6">
              <div className="text-3xl">{it.emoji}</div>
              <h3 className="mt-3 font-semibold text-lg">{it.title}</h3>
              <p className="mt-1 text-gray-600">{it.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
