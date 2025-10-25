import Container from '@/components/Container'

const plans = [
  {
    name: 'Start',
    desc: 'Landing page profissional',
    features: ['Design responsivo', 'SEO essencial', 'Deploy na Vercel'],
  },
  {
    name: 'Pro',
    desc: 'Site institucional completo',
    features: ['Páginas internas', 'Blog básico', 'Integrações essenciais'],
  },
  {
    name: 'Elite',
    desc: 'Site com CRM, automação e e-commerce',
    features: ['Automação avançada', 'CRM integrado', 'E-commerce e Analytics'],
    highlight: true,
  },
]

export default function Plans() {
  return (
    <section className="section bg-light/60">
      <Container>
        <div className="max-w-3xl mx-auto section-band">
          <span className="badge">Planos e Serviços</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-noro">Escolha o núcleo certo</h2>
          <p className="mt-3 text-gray-600">Valor percebido alto, complexidade sob controle.</p>
        </div>
        <div className="mt-5 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`card p-6 relative ${p.highlight ? 'ring-2 ring-core' : ''}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-6 badge bg-core text-gray-900">Mais completo</span>
              )}
              <h3 className="font-display text-xl font-semibold text-noro">{p.name}</h3>
              <p className="mt-1 text-gray-600">{p.desc}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-core" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contato" className="btn btn-primary mt-6 w-full">Solicitar Proposta</a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
