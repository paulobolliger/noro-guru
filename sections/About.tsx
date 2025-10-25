import Container from '@/components/Container'

export default function About() {
  return (
    <section id="sobre" className="section">
      <Container>
        <div className="max-w-3xl">
          <span className="badge">Sobre a NORO</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-noro">O núcleo inteligente do ecossistema .guru</h2>
          <p className="mt-3 text-gray-700">
            A NORO é o cérebro digital que conecta tecnologia, design e automação. Nossa missão é
            conectar e automatizar sistemas, pessoas e dados de forma inteligente, acessível e intuitiva.
          </p>
        </div>
      </Container>
    </section>
  )
}

