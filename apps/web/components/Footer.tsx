'use client';

import React from 'react';
import NoroLogo from './icons/NoroLogo';
import { GithubIcon } from './icons/GithubIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { useModal } from './providers/modal-provider';
import Link from 'next/link';

const Footer: React.FC = () => {
  const { openModal } = useModal();

  return (
    <footer className="bg-[#0B1220] border-t border-[#2E2E3A]">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
             <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
              <NoroLogo className="h-10 w-10" />
              <div>
                <h3 className="font-display text-2xl font-bold text-white">NORO</h3>
                <p className="text-sm text-[#1DD3C0]">Intelligent Core by .guru</p>
              </div>
            </Link>
            <p className="max-w-md text-[#B8C1E0] mb-6">
              O núcleo inteligente que conecta, automatiza e dá vida aos seus dados com o poder da IA.
            </p>
             <button 
              onClick={openModal}
              className="btn-noro-secondary font-semibold py-3 px-8 rounded-2xl"
            >
              Fale Conosco
            </button>
          </div>

          {/* Coluna 2: Links */}
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wider">Links</h4>
            <ul className="space-y-3 text-[#B8C1E0]">
              <li><Link href="/about" className="hover:text-[#1DD3C0] transition-colors">Sobre</Link></li>
              <li><Link href="/#features" className="hover:text-[#1DD3C0] transition-colors">Recursos</Link></li>
              <li><Link href="/#values" className="hover:text-[#1DD3C0] transition-colors">Valores</Link></li>
              <li><Link href="/ecosystem" className="hover:text-[#1DD3C0] transition-colors">Ecossistema</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Social & Legal */}
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wider">Conecte-se</h4>
            <div className="flex items-center gap-4 mb-6">
              <a href="#" aria-label="LinkedIn" className="text-[#1DD3C0] hover:glow-turquoise transition-all"><LinkedInIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="Twitter" className="text-[#1DD3C0] hover:glow-turquoise transition-all"><TwitterIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="GitHub" className="text-[#1DD3C0] hover:glow-turquoise transition-all"><GithubIcon className="w-6 h-6" /></a>
            </div>
            <ul className="space-y-3 text-[#B8C1E0] text-sm">
                <li><Link href="/privacy-policy" className="hover:text-[#1DD3C0] transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-[#1DD3C0] transition-colors">Termos de Serviço</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2E2E3A] pt-8 mt-8 text-center">
            <p className="text-[#B8C1E0] mb-2">&copy; 2025 Nomade Group. Todos os direitos reservados.</p>
            <p className="text-sm text-[#1DD3C0]">Versão 1.0 — Intelligent Core by .guru</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
