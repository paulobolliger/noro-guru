import { MetadataRoute } from 'next';

const YOUR_SITE_URL = 'https://www.nomade.guru';

// Interfaces para tipificar os dados do Strapi
interface StrapiDataItem {
  documentId: string;
  updatedAt: string;
}

interface StrapiResponse {
  data: StrapiDataItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) {
    console.error('URL da API do Strapi não configurada para o sitemap.');
    return [];
  }

  // 1. Buscar Roteiros
  const roteirosRes = await fetch(`${apiUrl}/api/roteiros`);
  const roteirosData: StrapiResponse = await roteirosRes.json();
  const roteirosUrls = roteirosData.data?.map(roteiro => ({
    url: `${YOUR_SITE_URL}/roteiro/${roteiro.documentId}`,
    lastModified: new Date(roteiro.updatedAt),
    priority: 0.9,
  })) || [];

  // 2. Buscar Posts do Blog
  const blogRes = await fetch(`${apiUrl}/api/blogs`);
  const blogData: StrapiResponse = await blogRes.json();
  const blogUrls = blogData.data?.map(post => ({
    url: `${YOUR_SITE_URL}/blog/${post.documentId}`,
    lastModified: new Date(post.updatedAt),
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
    url: `${YOUR_SITE_URL}${route}`,
    lastModified: new Date(),
    priority: route === '/' ? 1.0 : 0.8,
  }));

  return [
    ...staticPages,
    ...roteirosUrls,
    ...blogUrls,
  ];
}
