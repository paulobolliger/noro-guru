import type { GetServerSideProps } from 'next'

const siteUrl = 'https://noro.guru'

function generateSiteMap(paths: string[]) {
  const now = new Date().toISOString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${paths
    .map(
      (p) => `<url>
    <loc>${siteUrl}${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n  ')}
</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const staticPaths = ['/', '/sobre']
  const xml = generateSiteMap(staticPaths)
  res.setHeader('Content-Type', 'application/xml')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function SiteMap() {
  return null
}

