'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Algo deu errado!</h1>
      <p className="max-w-md text-lg text-noro-accent/80 mb-8">
        Ocorreu um erro inesperado. Por favor, tente recarregar a página.
      </p>
      <button
        onClick={() => reset()}
        className="bg-gradient-to-r from-noro-turquoise to-noro-purple text-white font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition-transform"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
