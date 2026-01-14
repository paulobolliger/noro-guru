'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useModal } from './providers/modal-provider';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import Button from './ui/Button';

const ecosystemLinks = [
  { href: '/ecosystem/vistos-guru', name: 'Inteligência de Dados para Vistos' },
  { href: '/ecosystem/intelligent-websites', name: 'Criação de Sites Inteligentes' },
  { href: '/ecosystem/intelligent-crm-erp', name: 'CRM/ERP Inteligente' },
  { href: '/ecosystem/ittd', name: 'Travel & Tourism Database' },
];

const Header: React.FC = () => {
  const { openModal } = useModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(true);
    }, 150); // Delay de 150ms para evitar abertura acidental
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 py-4 px-6 md:px-12 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm" role="banner">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center" aria-label="NORO - Página inicial">
          <Image
            src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png"
            alt="NORO Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-display font-medium tracking-wide" role="navigation" aria-label="Navegação principal">
          <Link
            href="/about"
            className="text-noro-blue hover:text-noro-turquoise transition-colors focus-visible:outline-noro-turquoise"
          >
            Sobre
          </Link>

          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-noro-blue hover:text-noro-turquoise transition-colors focus-visible:outline-noro-turquoise"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              Ecossistema
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute top-full mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 animate-fade-in"
                role="menu"
                aria-label="Submenu do ecossistema"
              >
                {ecosystemLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-3 text-noro-blue hover:bg-noro-light hover:text-noro-turquoise transition-all rounded-md mx-2 font-display font-medium text-sm"
                    role="menuitem"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/#features"
            className="text-noro-blue hover:text-noro-turquoise transition-colors scroll-smooth"
          >
            Recursos
          </Link>

          <Link
            href="/pricing"
            className="text-noro-blue hover:text-noro-turquoise transition-colors"
          >
            Preços
          </Link>

          <Link
            href="/suporte"
            className="text-noro-blue hover:text-noro-turquoise transition-colors"
          >
            Suporte
          </Link>

          <button
            onClick={openModal}
            className="text-noro-blue hover:text-noro-turquoise transition-colors"
          >
            Contato
          </button>
        </nav>

        <Button variant="primary" className="hidden md:inline-flex shadow-[0_0_10px_#D4AF37]">
          Acessar Plataforma
        </Button>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-noro-blue p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-gray-200 bg-white shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link
              href="/about"
              className="text-noro-blue hover:text-noro-turquoise transition-colors font-display font-medium px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>

            <div className="px-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-noro-blue hover:text-noro-turquoise transition-colors font-display font-medium w-full py-2"
              >
                Ecossistema
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {ecosystemLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-noro-blue/80 hover:text-noro-turquoise transition-colors py-2 font-display font-medium"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#features"
              className="text-noro-blue hover:text-noro-turquoise transition-colors font-display font-medium px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recursos
            </Link>

            <Link
              href="/pricing"
              className="text-noro-blue hover:text-noro-turquoise transition-colors font-display font-medium px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preços
            </Link>

            <Link
              href="/suporte"
              className="text-noro-blue hover:text-noro-turquoise transition-colors font-display font-medium px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Suporte
            </Link>

            <button
              onClick={() => {
                openModal();
                setIsMobileMenuOpen(false);
              }}
              className="text-noro-blue hover:text-noro-turquoise transition-colors font-display font-medium text-left px-4 py-2"
            >
              Contato
            </button>

            <Button variant="primary" className="mx-4 mt-2 shadow-[0_0_10px_#D4AF37]" fullWidth>
              Acessar Plataforma
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;