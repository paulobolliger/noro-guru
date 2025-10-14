import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- METADADOS (SEO) ---
export const metadata: Metadata = {
  title: 'Depoimentos - O que os nossos viajantes dizem',
  description: 'Veja as avaliações e experiências de clientes que viajaram com a Nomade Guru.',
};

// --- DADOS DOS DEPOIMENTOS ---
const testimonialsData = [
    {
      text: "Viajar com a Nomade Guru foi uma experiência inesquecível! Cada detalhe do roteiro parecia feito especialmente para nós. Desde a escolha dos hotéis até aos passeios secretos, sentimos que alguém realmente entendia os nossos sonhos. Já estou a planear a próxima viagem!",
      author: "Carolina M.",
      location: "São Paulo/SP",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
    },
    {
      text: "Nunca imaginei que uma viagem pudesse ser tão perfeita. A Nomade Guru cuidou de tudo: transporte, alimentação, atividades… e ainda nos deu dicas locais incríveis que fizeram toda a diferença. Foi como ter um guia e amigo ao mesmo tempo!",
      author: "Lucas R.",
      location: "Rio de Janeiro/RJ",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80"
    },
    {
      text: "Foi a nossa primeira viagem em família com crianças pequenas, e eu estava preocupada com toda a logística. A Nomade Guru tornou tudo simples e seguro, e ainda conseguimos momentos de diversão que vamos lembrar para sempre. Super recomendo!",
      author: "Mariana S.",
      location: "Curitiba/PR",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
    },
    {
      text: "A atenção ao detalhe da Nomade Guru é inacreditável. Cada dia do roteiro tinha algo único, que nem imaginávamos existir. É impossível não se apaixonar pelo jeito como eles transformam viagens em experiências inesquecíveis.",
      author: "Fernando L.",
      location: "Belo Horizonte/MG",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
    },
    {
      text: "Eu pensei que já tinha viajado muito, mas a Nomade Guru mostrou-me que há um mundo de experiências que só quem conhece de verdade consegue proporcionar. Foi uma viagem mágica, sem stress e cheia de surpresas boas.",
      author: "Isabela C.",
      location: "Porto Alegre/RS",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      text: "O suporte durante a viagem foi impecável. Tivemos um imprevisto e a equipa da Nomade Guru resolveu tudo rapidamente, permitindo que continuássemos a aproveitar as férias sem preocupações. Serviço de primeira classe!",
      author: "Ricardo P.",
      location: "Lisboa, Portugal",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    }
];

// --- COMPONENTE DA PÁGINA ---
export default function DepoimentosPage() {
  return (
    <>
      <Header onCrieRoteiroClick={() => {}} />

      <main className="pt-24 md:pt-32 bg-neutral-dark text-white">
        {/* Cabeçalho da Página */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-center text-white">
          <div className="container mx-auto px-5">
            <h1 className="text-4xl font-bold md:text-5xl">Vozes dos Nossos Viajantes</h1>
            <p className="mt-4 text-lg text-white/90">
              Histórias e memórias de quem viajou connosco.
            </p>
          </div>
        </section>

        {/* Grelha de Depoimentos */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="flex flex-col rounded-2xl bg-secondary-dark p-8 shadow-lg border border-white/5">
                  <div className="flex items-center gap-4 mb-5">
                    <Image 
                      src={testimonial.imageUrl} 
                      alt={`Foto de ${testimonial.author}`} 
                      width={60}
                      height={60}
                      className="rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <h3 className="font-bold text-white text-lg">{testimonial.author}</h3>
                      <p className="text-sm text-white/60">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="mb-4 text-yellow-400">
                    {'★'.repeat(testimonial.rating)}
                    {'☆'.repeat(5 - testimonial.rating)}
                  </div>
                  <p className="text-white/80 leading-relaxed flex-grow">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="pb-20">
            <div className="container mx-auto max-w-4xl px-5 text-center">
                <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Quer viver a sua própria experiência?</h2>
                    <p className="text-lg text-white/90 mb-6">Fale com a Nomade Guru e comece a planear a viagem que se vai tornar história.</p>
                    <Link href="/#contato" className="inline-block rounded-full bg-white px-10 py-3 font-bold text-primary shadow-lg transition-transform hover:scale-105">
                        Começar Agora ✨
                    </Link>
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
