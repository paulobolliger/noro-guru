'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useModal } from './providers/modal-provider';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

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
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" role="navigation" aria-label="Navegação principal">
          <Link 
            href="/about" 
            className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold focus-visible:outline-[#1DD3C0]"
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
              className="flex items-center gap-1 text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold focus-visible:outline-[#1DD3C0]"
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
                    className="block px-4 py-3 text-[#342CA4] hover:bg-[#1DD3C0]/10 hover:text-[#1DD3C0] transition-all rounded-md mx-2"
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
            className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold scroll-smooth"
          >
            Recursos
          </Link>

          <Link 
            href="/pricing" 
            className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold"
          >
            Preços
          </Link>

          <Link 
            href="/suporte" 
            className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold"
          >
            Suporte
          </Link>
          
          <button 
            onClick={openModal} 
            className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold"
          >
            Contato
          </button>
        </nav>
        
        <button className="hidden md:block bg-[#D4AF37] text-[#0B1220] font-bold py-3 px-6 rounded-2xl hover:shadow-[0_0_10px_#D4AF37] hover:scale-105 transition-all duration-300">
          Acessar Plataforma
        </button>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-[#342CA4] p-2"
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
        <div className="md:hidden mt-4 py-4 border-t border-gray-200 bg-white">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/about" 
              className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            
            <div className="px-4">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="flex items-center gap-1 text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold w-full py-2"
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
                      className="block text-[#342CA4]/80 hover:text-[#1DD3C0] transition-colors py-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              href="/#features" 
              className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recursos
            </Link>

            <Link 
              href="/pricing" 
              className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preços
            </Link>

            <Link 
              href="/suporte" 
              className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Suporte
            </Link>
            
            <button 
              onClick={() => {
                openModal();
                setIsMobileMenuOpen(false);
              }} 
              className="text-[#342CA4] hover:text-[#1DD3C0] transition-colors font-semibold text-left px-4 py-2"
            >
              Contato
            </button>

            <button className="mx-4 mt-2 bg-[#D4AF37] text-[#0B1220] font-bold py-3 px-6 rounded-2xl hover:shadow-[0_0_10px_#D4AF37] transition-all">
              Acessar Plataforma
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;