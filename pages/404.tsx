import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 | NORO</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="section">
        <Container>
          <div className="max-w-3xl mx-auto section-band">
            <h2>Página não encontrada</h2>
            <p>O que você procura pode ter sido movido.</p>
          </div>
          <div className="mt-6 text-center">
            <a href="/" className="btn btn-primary">Voltar ao início</a>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

