import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NORO Financeiro',
  description: 'Gestão financeira inteligente para o ecossistema NORO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="container-app py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
