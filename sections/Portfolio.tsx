import Container from '@/components/Container'
import Image from 'next/image'

const projects = [
  { name: 'Nomade Guru', url: 'https://nomade.guru', image: '/assets/portfolio/nomade-guru.webp' },
  { name: 'SafeTrip Guru', url: 'https://safetrip.guru', image: '/assets/portfolio/safetrip-guru.webp' },
  { name: 'Vistos Guru', url: 'https://vistos.guru', image: '/assets/portfolio/vistos-guru.webp' },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="section bg-gradient-to-b from-white to-light/60">
      <Container>
        <div className="max-w-3xl mx-auto section-band">
          <h2>Experiências que falam por si</h2>
          <p>Resultados reais, performance e design alinhados ao propósito.</p>
        </div>
        <div className="mt-5 grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group card p-6 hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-lg text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.url.replace('https://', '')}</div>
                </div>
                <div className="text-guru group-hover:text-noro transition-colors">→</div>
              </div>
              <div className="mt-4 relative w-full overflow-hidden rounded-lg ring-1 ring-black/5">
                <div className="pt-[56%]" />
                <Image
                  src={p.image}
                  alt={`Preview ${p.name}`}
                  fill
                  className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}

