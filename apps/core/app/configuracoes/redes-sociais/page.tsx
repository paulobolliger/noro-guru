// app/admin/(protected)/configuracoes/redes-sociais/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import RedesSociaisClient from './RedesSociaisClient';

export default async function RedesSociaisPage() {
  const supabase = createServerSupabaseClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('noro_users')
    .select('nome, email, role, avatar_url')
    .eq('id', user.id)
    .single();

  const fullUser = {
    id: user.id,
    nome: userProfile?.nome || null,
    email: userProfile?.email || user.email || '',
    role: userProfile?.role || 'user',
    avatar_url: userProfile?.avatar_url || null,
  };

  // Fetch existing social network configurations
  const { data: configs, error } = await supabase
    .from('social_network_configs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching social network configs:', error);
  }

  return (
    <MainLayout user={fullUser}>
      <RedesSociaisClient initialConfigs={configs || []} />
    </MainLayout>
  );
}
