// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Nomade Guru - Agência de Viagens Inteligente',
  description: 'Roteiros de viagem personalizados com inteligência artificial e curadoria humana.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} bg-slate-900`}>
        {/* Usamos Suspense porque o Header é um Client Component que usa hooks. */}
        <Suspense>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

