// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const isHomePage = pathname === '/';

  // --- LÓGICA DE ESTILO RESTAURADA ---
  // O header tem fundo escuro se (1) o scroll passou de 50px OU (2) não estamos na página inicial.
  const hasDarkBg = scrolled || !isHomePage;

  const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    hasDarkBg ? 'bg-secondary2 shadow-lg py-2' : 'bg-white py-4'
  }`;
  
  const elementColorClass = hasDarkBg ? 'text-white' : 'text-secondary2';
  
  const linkClasses = `relative font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${elementColorClass} hover:text-primary`;

  const logoSrc = hasDarkBg
      ? 'https://res.cloudinary.com/dhqvjxgue/image/upload/c_crop,ar_4:3/v1744736404/logo_branco_sem_fundo_rucnug.png'
      : 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1744736403/logo_nomade_guru_iskhl8.png';
  // --- FIM DA LÓGICA DE ESTILO ---

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
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

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/destinos" className={linkClasses}>Destinos</Link>
          <Link href="/blog" className={linkClasses}>Blog</Link>
          <Link href="/?popup=true" className="bg-gradient-to-r from-primary to-denary text-white font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform">
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
            <Link href="/?popup=true" className="bg-gradient-to-r from-primary to-denary text-white font-bold py-3 px-8 rounded-full text-lg">
                Crie Seu Roteiro
            </Link>
        </nav>
      </div>
    </header>
  );
}

