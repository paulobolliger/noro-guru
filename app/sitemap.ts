// app/sitemap.ts

import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server'; // CORRIGIDO

// Use uma variável de ambiente para a URL do site
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nomade.guru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient(); // CORRIGIDO

  // 1. Buscar Roteiros do Supabase
  const { data: roteiros } = await supabase
    .from('nomade_roteiros')
    .select('slug, updated_at')
    .eq('status', 'published');

  const roteirosUrls = roteiros?.map(({ slug, updated_at }) => ({
    url: `${SITE_URL}/destinos/${slug}`,
    lastModified: new Date(updated_at || new Date()),
    priority: 0.9,
  })) || [];

  // 2. Buscar Posts do Blog do Supabase
  const { data: posts } = await supabase
    .from('nomade_blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  const blogUrls = posts?.map(({ slug, updated_at }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(updated_at || new Date()),
    priority: 0.7,
  })) || [];

  // 3. Páginas Estáticas
  const staticPages = [
    '/',
    '/destinos',
    '/blog',
    '/contato',
    '/faq',
    '/privacidade',
    '/termos-de-uso',
    '/sobre',
    '/depoimentos',
  ].map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    priority: route === '/' ? 1.0 : 0.8,
  }));

  return [
    ...staticPages,
    ...roteirosUrls,
    ...blogUrls,
  ];
}
