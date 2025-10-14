import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Página Não Encontrada (404) - Nomade Guru',
  description: 'A página que procurava não foi encontrada.',
};

export default function NotFound() {
  return (
    <>
      <Header onCrieRoteiroClick={() => {}} />
      <main className="pt-24 md:pt-32 bg-neutral-dark text-white">
        <div className="flex items-center justify-center py-20 min-h-[60vh]">
          <div className="container mx-auto px-5 text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">Página Não Encontrada</h2>
            <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
              Ups! A página que está a tentar aceder não existe, foi movida ou está temporariamente indisponível.
            </p>
            <div className="mt-10">
              <Link
                href="/"
                className="inline-block rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
