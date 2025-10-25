import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Erro interno | NORO</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="section">
        <Container>
          <div className="max-w-3xl mx-auto section-band">
            <h2>O núcleo detectou uma falha</h2>
            <p>Algo saiu do previsto. Estamos resolvendo.</p>
          </div>
          <div className="mt-6 text-center flex items-center justify-center gap-3">
            <a href="/" className="btn btn-primary">Voltar ao início</a>
            <a href="#contato" className="btn glass text-noro">Falar com a NORO</a>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

