import Container from '@/components/Container'

const steps = [
  { num: '1️⃣', title: 'Briefing Inteligente' },
  { num: '2️⃣', title: 'Protótipo Visual' },
  { num: '3️⃣', title: 'Desenvolvimento' },
  { num: '4️⃣', title: 'Publicação e Suporte' },
]

export default function HowItWorks() {
  return (
    <section className="section">
      <Container>
        <div className="max-w-3xl mx-auto section-band">
          <span className="badge">Como funciona</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-noro">Do briefing ao ar, sem fricção</h2>
        </div>
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[680px] grid grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-6 flex flex-col items-center text-center">
                <div className="text-3xl">{s.num}</div>
                <div className="mt-2 font-medium">{s.title}</div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute translate-y-10 w-10 h-[2px] bg-gradient-to-r from-guru to-noro" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
