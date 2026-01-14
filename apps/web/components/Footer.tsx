'use client';

import React from 'react';
import Image from 'next/image';
import NoroLogo from './icons/NoroLogo';
import { GithubIcon } from './icons/GithubIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { useModal } from './providers/modal-provider';
import Link from 'next/link';
import Button from './ui/Button';

const Footer: React.FC = () => {
  const { openModal } = useModal();

  return (
    <footer className="bg-noro-dark border-t border-noro-gray-future/30">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Coluna 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
              <Image
                src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png"
                alt="NORO Logo"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-noro-text-muted leading-relaxed">
              O núcleo inteligente que conecta, automatiza e dá vida aos seus dados com o poder da IA.
            </p>
          </div>

          {/* Coluna 2: Institucional */}
          <div>
            <h4 className="font-display font-medium text-white mb-6 text-sm uppercase tracking-widest">Institucional</h4>
            <ul className="space-y-3 text-sm text-noro-text-secondary">
              <li><Link href="/about" className="hover:text-noro-turquoise transition-colors">Sobre Nós</Link></li>
              <li><Link href="/#features" className="hover:text-noro-turquoise transition-colors">Recursos</Link></li>
              <li><Link href="/pricing" className="hover:text-noro-turquoise transition-colors">Preços</Link></li>
              <li><Link href="/suporte" className="hover:text-noro-turquoise transition-colors">Central de Ajuda</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Ecossistema */}
          <div>
            <h4 className="font-display font-medium text-white mb-6 text-sm uppercase tracking-widest">Ecossistema</h4>
            <ul className="space-y-3 text-sm text-noro-text-secondary">
              <li><Link href="/ecosystem/vistos-guru" className="hover:text-noro-turquoise transition-colors">Vistos Guru</Link></li>
              <li><Link href="/ecosystem/intelligent-websites" className="hover:text-noro-turquoise transition-colors">Sites Inteligentes</Link></li>
              <li><Link href="/ecosystem/intelligent-crm-erp" className="hover:text-noro-turquoise transition-colors">CRM/ERP</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Social */}
          <div className="flex flex-col items-start gap-6">
            <Button
              variant="outline"
              size="sm"
              onClick={openModal}
              className="w-full md:w-auto border-noro-gray-future hover:border-noro-turquoise hover:bg-noro-turquoise/10 text-noro-turquoise"
            >
              Fale com um Especialista
            </Button>

            <div className="space-y-4">
              <p className="text-xs text-noro-text-muted font-medium uppercase tracking-wider">Siga-nos</p>
              <div className="flex items-center gap-4">
                <a href="#" aria-label="LinkedIn" className="text-noro-text-muted hover:text-noro-turquoise transition-all hover:scale-110"><LinkedInIcon className="w-5 h-5" /></a>
                <a href="#" aria-label="Twitter" className="text-noro-text-muted hover:text-noro-turquoise transition-all hover:scale-110"><TwitterIcon className="w-5 h-5" /></a>
                <a href="#" aria-label="GitHub" className="text-noro-text-muted hover:text-noro-turquoise transition-all hover:scale-110"><GithubIcon className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="border-t border-noro-gray-future/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-noro-text-muted/60">
            &copy; 2025 Nomade Group. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-noro-text-muted/60">
            <Link href="/privacy-policy" className="hover:text-noro-turquoise transition-colors">Privacidade</Link>
            <Link href="/terms-of-service" className="hover:text-noro-turquoise transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
