'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Aguarda 2 segundos antes de mostrar o banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    
    // Recarregar para ativar analytics
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/95 backdrop-blur-lg border-t-2 border-[#342CA4]/20 shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Conteúdo */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">🍪</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Usamos Cookies
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
                  Ao continuar navegando, você concorda com nossa{' '}
                  <Link href="/privacy-policy" className="text-[#1DD3C0] hover:underline">
                    Política de Privacidade
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
            >
              Recusar
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#342CA4] to-[#1DD3C0] hover:shadow-lg rounded-lg transition-all"
            >
              Aceitar Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
