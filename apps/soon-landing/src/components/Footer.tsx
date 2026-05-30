import React from 'react';
import Logo from './Logo';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-noro-dark border-t border-noro-purple/15 relative overflow-hidden" id="noro-landing-footer">
      {/* Background flare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-noro-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-noro-purple/10 pb-8 mb-8">
          
          {/* Trademark & Mission */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <Logo showSubmark={true} />
            <p className="text-xs text-gray-400 max-w-sm mt-1 leading-relaxed">
              O sistema operacional inteligente (IOC) feito sob medida para otimizar vendas, organizar comissões e criar propostas impecáveis com Inteligência Artificial para agências brasileiras.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-noro-teal transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-noro-teal transition-colors">Políticas de Privacidade</a>
            <a href="#" className="hover:text-noro-teal transition-colors">Segurança Cibernética</a>
            <a href="#" className="hover:text-noro-teal transition-colors">Status do Servidor</a>
            <a href="#" className="hover:text-noro-teal transition-colors">Documentação da API</a>
          </div>
        </div>

        {/* Bottom copyright details & scroll top */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-noro-teal" />
            <span>© 2024 NORO Guru. Intelligent Operational Core for Travel.</span>
          </div>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 hover:text-white border border-noro-purple/10 hover:border-noro-teal/30 py-1.5 px-3 rounded-full transition-all text-[11px] font-mono tracking-tight cursor-pointer"
            id="scroll-to-top-btn"
          >
            VOLTAR AO TOPO
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
