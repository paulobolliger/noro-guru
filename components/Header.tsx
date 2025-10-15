// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const pathname = usePathname();

  // Efeito para controlar o estado de rolagem
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito para definir o título da página com base na URL
  useEffect(() => {
    switch (true) {
      case pathname === '/blog':
        setPageTitle('Blog');
        break;
      case pathname.startsWith('/blog/'):
        setPageTitle('Blog');
        break;
      case pathname === '/destinos':
        setPageTitle('Destinos');
        break;
      case pathname.startsWith('/destinos/'):
        setPageTitle('Destinos');
        break;
      case pathname === '/sobre':
        setPageTitle('Sobre Nós');
        break;
      case pathname === '/depoimentos':
        setPageTitle('Depoimentos');
        break;
      case pathname === '/contato':
        setPageTitle('Contato');
        break;
      case pathname === '/faq':
        setPageTitle('FAQ');
        break;
      default:
        setPageTitle(''); // Não mostra título na página inicial
        break;
    }

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const hasDarkBg = scrolled;

  const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    hasDarkBg ? 'bg-secondary shadow-lg py-2' : 'bg-white py-4'
  }`;
  
  const elementColorClass = hasDarkBg ? 'text-white' : 'text-secondary';
  
  const linkClasses = `relative font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${elementColorClass} hover:text-primary`;

  const logoSrc = hasDarkBg
      ? 'https://res.cloudinary.com/dhqvjxgue/image/upload/c_crop,ar_4:3/v1744736404/logo_branco_sem_fundo_rucnug.png'
      : 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1744736403/logo_nomade_guru_iskhl8.png';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="relative h-14 w-40">
              <Image
                src={logoSrc}
                alt="Logo Nomade Guru"
                fill
                className="object-contain"
                sizes="160px"
                priority
              />
            </div>
          </Link>

          {/* Título da Página (só aparece com scroll) */}
          <div className={`transition-opacity duration-300 ${scrolled && pageTitle ? 'opacity-100' : 'opacity-0'}`}>
            <span className="hidden sm:block border-l border-white/20 pl-6 text-sm font-semibold text-white">
              {pageTitle}
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/destinos" className={linkClasses}>Destinos</Link>
          <Link href="/blog" className={linkClasses}>Blog</Link>
          <Link href="/?popup=true" className="bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform">
            Crie Seu Roteiro
          </Link>
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={elementColorClass}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </div>

      <div className={`fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-end">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full gap-8 -mt-16">
            <Link href="/destinos" className="text-white text-xl font-semibold">Destinos</Link>
            <Link href="/blog" className="text-white text-xl font-semibold">Blog</Link>
            <Link href="/?popup=true" className="bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-8 rounded-full text-lg">
                Crie Seu Roteiro
            </Link>
        </nav>
      </div>
    </header>
  );
}