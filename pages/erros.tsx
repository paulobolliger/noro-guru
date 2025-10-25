import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default function ErrosPage() {
  return (
    <>
      <Head>
        <title>Erros | NORO</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="section">
        <Container>
          <div className="max-w-3xl mx-auto section-band">
            <h2>Diagnóstico e Resiliência</h2>
            <p>Monitoramos, detectamos e corrigimos incidentes com rapidez.</p>
          </div>
          <div className="mt-6 max-w-3xl mx-auto text-gray-700">
            <p>
              Se você chegou aqui por engano, tente voltar ao início ou nos envie uma mensagem
              com o contexto. Nosso núcleo inteligente registra falhas para melhoria contínua.
            </p>
            <div className="mt-4">
              <a href="/" className="btn btn-primary">Voltar ao início</a>
              <a href="#contato" className="btn glass ml-3 text-noro">Falar com a NORO</a>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

