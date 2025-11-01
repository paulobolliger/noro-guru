// app/admin/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import type Database from "@noro-types/supabase";
import { createServerSupabaseClient } from "@lib/supabase/server";
import AdminLayoutClient from "@/components/AdminLayoutClient";
import { getNotificacoes } from "@lib/supabase/admin";
// NOVO: Importa a função de buscar config do sistema
import { getConfiguracaoSistema } from './configuracoes/config-actions'; 
import { getUserTenants, getActiveTenantId, setActiveTenant } from './tenants/actions';
// NOVO: Importa o Toaster
import { Toaster } from "@ui/use-toast"; // Assumindo que use-toast.tsx também exporta Toaster
// TenantSelector removido - não será mais exibido globalmente

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login?redirect=/');
  }

  const { data: userProfile } = await supabase
    .from('noro_users')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = userProfile as NomadeUser | null;

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    await supabase.auth.signOut();
    return redirect('/login?error=unauthorized');
  }

  // Busca as notificações E as configurações do sistema
  const [notificacoes, configSistema] = await Promise.all([
    getNotificacoes(user.id, 5),
    getConfiguracaoSistema()
  ]);

  const tenants = await getUserTenants();
  const activeTenantId = await getActiveTenantId();

  return (
    // O Toaster deve ser renderizado no lado do cliente, assim como o AdminLayoutClient
    <Suspense fallback={<div>A carregar layout do admin...</div>}>
      <AdminLayoutClient 
        user={profile} 
        notificacoes={notificacoes}
        configSistema={configSistema} // Passa a config para o layout do cliente
      >
        {/* REMOVIDO: TenantSelector não aparece mais em todas as páginas
        {tenants.length > 0 && (
          <div className="border-b border-border bg-card/50">
            <TenantSelector 
              tenants={tenants}
              activeTenantId={activeTenantId}
              onTenantChange={setActiveTenant}
            />
          </div>
        )}
        */}
        {children}
        {/* CRÍTICO: O Toaster deve ser incluído para renderizar as notificações */}
        <Toaster /> 
      </AdminLayoutClient>
    </Suspense>
  );
}
