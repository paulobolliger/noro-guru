import Image from 'next/image'
import { motion } from 'framer-motion'
import Container from '@/components/Container'
import NeuralBackground from '@/components/NeuralBackground'

const logoUrl = 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969737/edited-photo_8_tsjbuv.png'

export default function Hero() {
  return (
    <section className="relative pt-20 md:pt-24 pb-6 md:pb-8 bg-hero-gradient text-white overflow-hidden">
      <NeuralBackground />
      <Container className="grid md:grid-cols-2 items-center gap-10">
        <div>
          <div className="badge mb-3 bg-white/20 text-white/90 border border-white/20">Intelligent Core by .guru</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
            Seu site, criado com inteligência.
          </h1>
          <p className="mt-3 text-white/90 max-w-xl">
            Design, performance e automação integrados pelo núcleo inteligente da NORO.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <a href="#contato" className="btn btn-secondary">Quero meu site inteligente</a>
            <a href="#servicos" className="btn glass text-white hover:bg-white/70 hover:text-noro">Ver serviços</a>
          </div>
          <p className="mt-4 text-sm text-white/80">
            Seu novo site começa com uma ideia — a NORO cuida do resto.
          </p>
        </div>
        <div className="relative flex justify-center md:justify-end">
          <motion.div
            className="relative w-56 h-56 md:w-72 md:h-72 rounded-full ring-8 ring-white/10 bg-white/10 backdrop-blur-xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full animate-glow" />
            <Image src={logoUrl} alt="Ícone NORO" fill sizes="(max-width: 768px) 224px, 288px" className="object-cover rounded-full" priority unoptimized />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
