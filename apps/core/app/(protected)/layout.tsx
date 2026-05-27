import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { Toaster } from '@/components/ui/use-toast';
import { getCurrentUser } from '@noro/lib/services/authService';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/login?redirect=/dashboard');
  }

  const profile = {
    id: user.id,
    email: user.email,
    nome: user.name || user.email,
    role: 'admin',
    avatar_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AdminLayoutClient
        user={profile}
        notificacoes={[]}
        configSistema={null}
        companyName="NORO"
        modules={{}}
      >
        {children}
        <Toaster />
      </AdminLayoutClient>
    </Suspense>
  );
}
