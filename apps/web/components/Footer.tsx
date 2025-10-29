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
    <footer className="bg-noro-dark border-t border-noro-dark-2">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Coluna 1: Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
             <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
              <NoroLogo className="h-10 w-10" />
              <div>
                <h3 className="font-display text-2xl font-bold text-noro-accent">NORO</h3>
                <p className="text-sm text-noro-accent/60">Intelligent Core by .guru</p>
              </div>
            </Link>
            <p className="max-w-md text-noro-accent/70 mb-6">
              O núcleo inteligente que conecta, processa e automatiza. Transformando dados em clareza e complexidade em simplicidade.
            </p>
             <button 
              onClick={openModal}
              className="border border-noro-turquoise/50 text-noro-turquoise py-2 px-6 rounded-lg hover:bg-noro-turquoise/10 transition-colors font-semibold"
            >
              Fale Conosco
            </button>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="font-bold text-noro-accent mb-4 tracking-wider">Navegação</h4>
            <ul className="space-y-3 text-noro-accent/70">
              <li><Link href="/about" className="hover:text-noro-turquoise transition-colors">Sobre</Link></li>
              <li><Link href="/#features" className="hover:text-noro-turquoise transition-colors">Features</Link></li>
              <li><Link href="/#values" className="hover:text-noro-turquoise transition-colors">Valores</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Ecossistema */}
          <div>
            <h4 className="font-bold text-noro-accent mb-4 tracking-wider">Ecossistema</h4>
            <ul className="space-y-3 text-noro-accent/70">
              <li><Link href="/ecosystem/vistos-guru" className="hover:text-noro-turquoise transition-colors">Dados para Vistos</Link></li>
              <li><Link href="/ecosystem/intelligent-websites" className="hover:text-noro-turquoise transition-colors">Sites Inteligentes</Link></li>
              <li><Link href="/ecosystem/intelligent-crm-erp" className="hover:text-noro-turquoise transition-colors">CRM/ERP Inteligente</Link></li>
              <li><Link href="/ecosystem/ittd" className="hover:text-noro-turquoise transition-colors">ITTD</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Social & Legal */}
          <div>
            <h4 className="font-bold text-noro-accent mb-4 tracking-wider">Conecte-se</h4>
            <div className="flex items-center gap-4 mb-4">
              <a href="#" aria-label="LinkedIn" className="text-noro-accent/70 hover:text-noro-turquoise transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="Twitter" className="text-noro-accent/70 hover:text-noro-turquoise transition-colors"><TwitterIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="GitHub" className="text-noro-accent/70 hover:text-noro-turquoise transition-colors"><GithubIcon className="w-6 h-6" /></a>
            </div>
            <ul className="space-y-3 text-noro-accent/70 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-noro-turquoise transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-noro-turquoise transition-colors">Termos de Serviço</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-noro-dark-2 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-noro-accent/60">
            <p>&copy; {new Date().getFullYear()} NORO by .guru. Todos os direitos reservados.</p>
            <div className="flex justify-center gap-4 mt-4 md:mt-0 font-mono text-xs text-noro-turquoise/70">
              <span>#IntelligentCore</span>
              <span>#NoroByGuru</span>
              <span>#AutomationWithSoul</span>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;