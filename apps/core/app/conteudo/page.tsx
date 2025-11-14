// app/conteudo/page.tsx
'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ConteudoPage() {
  const router = useRouter();

  const mockUser = {
    email: 'dev@noro.com.br',
    nome: 'Desenvolvedor'
  };

  useEffect(() => {
    // Redirecionar para roteiros a-publicar por padrão
    router.push('/conteudo/roteiros/a-publicar');
  }, [router]);

  return (
    <MainLayout user={mockUser}>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Redirecionando...</p>
        </div>
      </div>
    </MainLayout>
  );
}
