import React from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <>
      {/* Cabeçalho da Página */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-8 text-center text-white">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-white/90">
            Última atualização: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Conteúdo Legal */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-5">
          <div className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary prose-strong:text-white">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}