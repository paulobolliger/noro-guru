// app/admin/(protected)/social/posts/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import SocialPostsClient from '@/components/admin/social/SocialPostsClient';

export const metadata = {
  title: 'Posts Sociais | Nomade Guru Admin',
  description: 'Gerencie posts para redes sociais',
};

export default async function SocialPostsPage() {
  const supabase = createServerSupabaseClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
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

  // Fetch initial posts
  const { data: posts } = await supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Check Upload-Post connection status
  const { data: socialConfig } = await supabase
    .from('social_network_configs')
    .select('*')
    .limit(1)
    .single();

  const isUploadPostConnected =
    socialConfig?.active_provider === 'upload-post' &&
    socialConfig?.status === 'connected';

  return (
    <MainLayout user={fullUser}>
      <SocialPostsClient
        initialPosts={posts || []}
        isUploadPostConnected={isUploadPostConnected}
      />
    </MainLayout>
  );
}
