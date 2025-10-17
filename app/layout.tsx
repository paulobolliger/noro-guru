// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// *** Novo import para usar a condição de rota ***
import { headers } from 'next/headers'; 

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
  // ** LÓGICA CONDICIONAL ADICIONADA **
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
      <body className={`${poppins.className} ${isAdminRoute ? 'bg-gray-50 text-gray-900' : 'bg-slate-900'}`}>
        {/* Renderiza Header e Footer SOMENTE se não for rota Admin */}
        {!isAdminRoute && <Header />}
        
        {/* Se for rota Admin, o componente AdminLayoutClient do grupo (protected) irá fornecer o layout completo. */}
        <main>
          {children}
        </main>
        
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}