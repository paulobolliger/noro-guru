import Link from 'next/link';
import React from 'react';
import NoroLogo from '@/components/icons/NoroLogo';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
        <NoroLogo className="w-32 h-32 text-noro-turquoise/50 mb-8" />
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white">404</h1>
        <p className="mt-4 text-xl md:text-2xl text-noro-accent/80">Página Não Encontrada</p>
        <p className="mt-2 max-w-md text-noro-accent/70">
            A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/" className="mt-8 bg-gradient-to-r from-noro-turquoise to-noro-purple text-white font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition-transform">
            Voltar para o Início
        </Link>
    </div>
  );
};

export default NotFoundPage;
