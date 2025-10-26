import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nós - Nomade Guru',
  description: 'Conheça a história e a filosofia por trás da Nomade Guru, a sua agência de viagens inteligente.',
};

export default function SobrePage() {
  return (
    <main className="pt-20 text-white bg-neutral-dark">
      {/* Cabeçalho da Página */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-8 text-center text-white">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl font-bold md:text-5xl">A Nossa Jornada</h1>
          <p className="mt-4 text-lg text-white/90">
            Descubra a paixão e o propósito que movem a Nomade Guru.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-5 space-y-20">
          
          {/* Secção 1: Filosofia */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Nascer do sol nas montanhas" 
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold text-primary mb-6">A Nossa Filosofia de Viagem</h2>
              <p className="mb-4 text-lg leading-relaxed text-white/80">
                Na Nomade Guru, acreditamos que viajar é muito mais do que conhecer lugares — é viver experiências transformadoras, criar memórias inesquecíveis e conectar-se profundamente com culturas e pessoas ao redor do mundo.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Somos especialistas em viagens personalizadas e roteiros exclusivos, que combinam aventura, conforto e autenticidade.
              </p>
            </div>
          </div>

          {/* Secção 2: Planeamento */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left md:order-2">
              <h2 className="text-3xl font-bold text-primary mb-6">Planejada nos Mínimos Detalhes</h2>
              <p className="mb-4 text-lg leading-relaxed text-white/80">
                Cada viagem que criamos é planejada com atenção a cada detalhe — da escolha dos hotéis, transportes e passeios, até as dicas locais que só quem realmente conhece o destino pode oferecer.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Nosso objetivo é transformar o sonho da viagem perfeita em realidade. A Nomade Guru transforma suas ideias em roteiros sob medida.
              </p>
            </div>
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl md:order-1">
               <Image 
                 src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                 alt="Pessoa a olhar para um mapa numa cidade histórica" 
                 layout="fill"
                 objectFit="cover"
               />
            </div>
          </div>
          
          {/* Secção 3: Porquê escolher-nos */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
               <Image 
                 src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                 alt="Bússola e mapa numa mesa de madeira"
                 layout="fill"
                 objectFit="cover"
               />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold text-primary mb-6">Por Que Escolher a Nomade Guru</h2>
              <ul className="space-y-4 text-lg text-white/80 list-disc list-inside">
                <li><strong>Expertise local e global:</strong> trabalhamos com parceiros de confiança em todo o mundo.</li>
                <li><strong>Suporte completo:</strong> atendimento antes, durante e depois da viagem, para que você viaje tranquilo.</li>
                <li><strong>Personalização total:</strong> cada roteiro é único, pensado especialmente para você.</li>
                <li><strong>Segurança e transparência:</strong> seguimos rigorosamente normas de segurança e práticas éticas em todas as etapas.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Final (igual ao da página de depoimentos) */}
      <section className="pb-16">
        <div className="container mx-auto max-w-4xl px-5 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Quer viver a sua própria experiência?</h2>
            <p className="text-lg text-white/90 mb-6">Fale com a Nomade Guru e comece a planejar a viagem que se vai tornar história.</p>
            <Link href="/?popup=true" className="inline-block rounded-full bg-white px-10 py-3 font-bold text-primary shadow-lg transition-transform hover:scale-105">
              Começar Agora ✨
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}