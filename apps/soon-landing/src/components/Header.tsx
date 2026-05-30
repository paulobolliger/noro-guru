import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  leadCount: number;
}

export default function Header({ onAdminClick, leadCount }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById('waitlist-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-noro-dark/95 border-b border-noro-border nav-blur py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Core Logo */}
        <a href="#" className="hover:opacity-90 transition-opacity" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <button
            onClick={() => scrollToSection('benefits-section')}
            className="text-gray-300 hover:text-noro-teal transition-colors focus:outline-none"
          >
            Módulos / Benefícios
          </button>
          <button
            onClick={() => scrollToSection('ai-intelligence-section')}
            className="text-gray-300 hover:text-noro-teal transition-colors focus:outline-none"
          >
            Inteligência IA
          </button>
          <button
            onClick={() => scrollToSection('faq-section')}
            className="text-gray-300 hover:text-noro-teal transition-colors focus:outline-none"
          >
            Dúvidas
          </button>
        </nav>

        {/* Action Button & Admin Link */}
        <div className="hidden md:flex items-center gap-4">
          <span className="px-3 py-1 bg-noro-purple/30 border border-noro-purple rounded-full text-[10px] uppercase tracking-widest text-noro-teal font-bold font-mono">
            Beta Fechado
          </span>

          <button
            onClick={onAdminClick}
            className="group flex items-center gap-1.5 text-xs text-gray-400 hover:text-noro-teal py-1.5 px-3 rounded-full border border-gray-800 hover:border-noro-teal/40 transition-all"
            title="Acessar painel administrativo secreto"
            id="admin-panel-trigger"
          >
            <Shield className="w-3.5 h-3.5 text-gray-500 group-hover:text-noro-teal transition-colors" />
            <span>Admin ({leadCount})</span>
          </button>
          
          <button
            onClick={scrollToForm}
            className="bg-noro-purple-light hover:bg-noro-purple-hover text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(107,84,232,0.3)] hover:scale-[1.02]"
            id="header-cta-desktop"
          >
            Quero meu acesso antecipado
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-noro-teal py-1.5 px-2.5 rounded-full border border-gray-800 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-noro-dark/95 border-b border-noro-border py-4 px-6 flex flex-col gap-4 animate-fade-in">
          <button
            onClick={() => scrollToSection('benefits-section')}
            className="text-left py-2 text-gray-300 hover:text-noro-teal text-base"
          >
            Módulos / Benefícios
          </button>
          <button
            onClick={() => scrollToSection('ai-intelligence-section')}
            className="text-left py-2 text-gray-300 hover:text-noro-teal text-base"
          >
            Inteligência IA
          </button>
          <button
            onClick={() => scrollToSection('faq-section')}
            className="text-left py-2 text-gray-300 hover:text-noro-teal text-base"
          >
            Dúvidas
          </button>
          
          <button
            onClick={scrollToForm}
            className="w-full bg-noro-purple-light hover:bg-noro-purple-hover text-white text-sm font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-2"
          >
            Quero meu acesso antecipado
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
