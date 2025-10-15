import Link from 'next/link';
import Image from 'next/image';

// Este é um Server Component, pois não precisa de interatividade (useState, etc.)
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0c0e1a] text-white/70">
      <div className="container mx-auto px-5 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Coluna Sobre */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 inline-block">
              <Image src="https://res.cloudinary.com/dhqvjxgue/image/upload/c_crop,ar_4:3/v1744736404/logo_branco_sem_fundo_rucnug.png" alt="Logo Nomade Guru" width={150} height={38} />
            </Link>
            <p className="text-sm leading-relaxed pr-5">
              Roteiros de viagem personalizados com inteligência artificial e curadoria humana, para você viajar com propósito e viver com liberdade.
            </p>
          </div>

          {/* Coluna Navegação */}
          <div>
            <h3 className="font-semibold text-white mb-5">Navegação</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link href="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/destinos" className="hover:text-primary transition-colors">Destinos</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/depoimentos" className="hover:text-primary transition-colors">Depoimentos</Link></li>
              <li><Link href="/loja" className="hover:text-primary transition-colors">Loja Online</Link></li>
            </ul>
          </div>

          {/* Coluna Suporte */}
          <div>
            <h3 className="font-semibold text-white mb-5">Suporte</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link></li>
              <li><Link href="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Coluna Social */}
          <div>
            <h3 className="font-semibold text-white mb-5">Siga-nos</h3>
            {/* Ícones de redes sociais adicionados aqui */}
            <div className="flex gap-4">
              <a href="https://www.facebook.com/nomadeguru" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-xl transition hover:text-primary"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/nomade.guru/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-xl transition hover:text-primary"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.youtube.com/@NomadeGuru" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-xl transition hover:text-primary"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="text-xl transition hover:text-primary"><i className="fa-brands fa-spotify"></i></a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <p className="text-center text-xs text-white/50">
          © 2009–{new Date().getFullYear()} Nomade Guru TAC Ltda — Inspiring purposeful travel. All rights reserved
        </p>
      </div>
    </footer>
  );
}