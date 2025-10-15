// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script'; // Importe o componente Script

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
      <head>
        {/* Adicione esta linha para carregar os ícones */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={`${poppins.className} bg-slate-900`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}