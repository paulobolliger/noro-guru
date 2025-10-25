import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Container from './Container'

const logoUrl = 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all bg-white ${scrolled ? 'shadow-sm border-b border-gray-100' : 'border-b border-transparent'}`}>
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3" aria-label="NORO - Início">
          <Image
            src={logoUrl}
            alt="NORO"
            width={120}
            height={32}
            className="h-8 w-auto"
            unoptimized
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          <a href="#servicos" className="hover:text-noro transition-colors">Serviços</a>
          <a href="#portfolio" className="hover:text-noro transition-colors">Portfólio</a>
          <a href="#contato" className="hover:text-noro transition-colors">Contato</a>
          <a href="#sobre" className="hover:text-noro transition-colors">Sobre</a>
        </nav>
        <div className="hidden md:block">
          <a href="#contato" className="btn btn-primary">Solicitar um Site</a>
        </div>
      </Container>
    </header>
  )
}
