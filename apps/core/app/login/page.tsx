// apps/core/app/login/page.tsx
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Se já estiver autenticado, redireciona para o dashboard
  if (user) {
    return redirect(searchParams.redirect || '/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            NORO Core
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Portal do Tenant
          </p>
        </div>
        
        {searchParams.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{searchParams.error}</p>
          </div>
        )}
        
        <LoginForm redirectTo={searchParams.redirect} />
      </div>
    </div>
  );
}
