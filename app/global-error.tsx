'use client'; // Este ficheiro TEM de ser um Client Component

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Pode-se enviar o erro para um serviço de logging como Sentry, LogRocket, etc.
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="bg-neutral-dark text-white">
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center p-5">
              <h1 className="text-6xl md:text-8xl font-bold text-primary">Erro</h1>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">Ups! Algo correu mal.</h2>
              <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
                A nossa equipa já foi notificada do problema. Por favor, tente novamente mais tarde.
              </p>
              <div className="mt-10 space-x-4">
                 <button
                  onClick={() => reset()}
                  className="inline-block rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Tentar Novamente
                </button>
                <Link
                  href="/"
                  className="inline-block rounded-full bg-secondary-dark px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Ir para a Página Inicial
                </Link>
              </div>
            </div>
        </div>
      </body>
    </html>
  );
}
