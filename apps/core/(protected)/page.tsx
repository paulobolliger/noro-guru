// apps/core/(protected)/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect('/login?redirect=/dashboard'); 
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard do Tenant</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Bem-vindo ao NORO Core</h2>
        <p className="text-gray-600">
          Este é o portal do tenant. Aqui você terá acesso ao sistema financeiro,
          comunicação, CRM e todos os módulos específicos do seu tenant.
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Usuário: {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}

