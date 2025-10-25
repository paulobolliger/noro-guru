import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default function SobrePage() {
  return (
    <>
      <Head>
        <title>Sobre | NORO – Intelligent Core by .guru</title>
        <meta name="description" content="A NORO é o núcleo inteligente do ecossistema .guru — o cérebro digital que conecta tecnologia, design e automação." />
      </Head>
      <Header />
      <main>
        <section className="section">
          <Container>
            <div className="max-w-3xl mx-auto section-band">
              <h2>Intelligent Core by .guru</h2>
              <p>Conectamos sistemas, pessoas e dados com clareza e automação.</p>
            </div>
            <div className="mt-6 max-w-3xl mx-auto text-gray-700 space-y-4">
              <p>
                A NORO é o cérebro digital do ecossistema .guru. Nosso foco é unir design, performance e automação
                para transformar sites em plataformas inteligentes. Entregamos experiências rápidas, acessíveis e escaláveis.
              </p>
              <p>
                Missão: conectar e automatizar processos, simplificando o complexo. O que você chama de caos, a NORO
                chama de dados organizados.
              </p>
              <ul className="list-disc pl-6">
                <li>Design inteligente orientado a dados</li>
                <li>Performance real e segurança por padrão</li>
                <li>Integrações com CRM, formulários e analytics</li>
              </ul>
              <div className="pt-2">
                <a href="#contato" className="btn btn-primary">Solicitar um Site</a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}

