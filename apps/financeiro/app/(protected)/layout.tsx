import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from './components/sidebar';
import { Toaster } from '@noro/ui';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Descomentar quando integrar autenticação
  // const supabase = createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect('/login');
  // }

  // MODO DESENVOLVIMENTO: Bypass de autenticação
  // Remover quando integrar com o control plane

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </>
  );
}
