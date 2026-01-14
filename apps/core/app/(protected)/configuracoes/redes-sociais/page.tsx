// app/admin/(protected)/configuracoes/redes-sociais/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RedesSociaisClient from './RedesSociaisClient';

export default async function RedesSociaisPage() {
  const supabase = createServerSupabaseClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login');
  }

  // Fetch existing social network configurations
  const { data: configs, error } = await supabase
    .from('social_network_configs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching social network configs:', error);
  }

  return <RedesSociaisClient initialConfigs={configs || []} />;
}
