import Container from '@/components/Container'

export default function FinalCta() {
  return (
    <section className="section bg-futuro">
      <Container className="text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
          Transforme sua presença digital com inteligência.
        </h2>
        <a href="#contato" className="btn mt-6 bg-core text-gray-900 hover:brightness-110">Começar Agora</a>
      </Container>
    </section>
  )
}

