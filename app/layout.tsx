// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { headers } from 'next/headers'; // <-- NOVO IMPORTADO

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
  // ** LÓGICA CONDICIONAL PARA ROTAS ADMIN **
  const headerList = headers();
  // Obtém o caminho atual da requisição (ex: /admin, /blog, /)
  const pathname = headerList.get('x-pathname') || '/'; 
  
  // Verifica se a rota é a área administrativa
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="pt-BR">
      <head>
        {/* Adicione esta linha para carregar os ícones */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={`${poppins.className} bg-slate-900`}>
        {/* Renderiza Header SOMENTE se não for rota Admin */}
        {!isAdminRoute && <Header />}
        
        {/* Adicionado h-screen para que o layout Admin preencha a tela */}
        <main className={isAdminRoute ? "h-screen" : undefined}>
          {children}
        </main>
        
        {/* Renderiza Footer SOMENTE se não for rota Admin */}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}