'use client';

import React, { useState, useRef, useEffect } from 'react';
import NoroLogo from './icons/NoroLogo';
import { useModal } from './providers/modal-provider';
import Link from 'next/link';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 py-4 px-6 md:px-12 bg-noro-dark/80 backdrop-blur-lg border-b border-noro-dark-2/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <NoroLogo className="h-8 w-8" />
          <span className="font-display text-2xl font-bold text-noro-accent tracking-wider">NORO</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/about" className="text-noro-accent/80 hover:text-noro-turquoise transition-colors">Sobre</Link>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-1 text-noro-accent/80 hover:text-noro-turquoise transition-colors"
            >
              Ecossistema
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full mt-3 w-64 bg-noro-dark-2 border border-noro-gray-future rounded-lg shadow-lg animate-fade-in py-2">
                {ecosystemLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-noro-accent/80 hover:bg-noro-dark hover:text-noro-turquoise transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/#features" className="text-noro-accent/80 hover:text-noro-turquoise transition-colors">Features</Link>
          <button onClick={openModal} className="text-noro-accent/80 hover:text-noro-turquoise transition-colors">Contato</button>
        </nav>
        <button className="hidden md:block bg-gradient-to-r from-noro-blue to-noro-purple text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
          Acessar Plataforma
        </button>
      </div>
    </header>
  );
};

export default Header;