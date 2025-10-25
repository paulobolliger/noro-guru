import type { GetServerSideProps } from 'next'

const siteUrl = 'https://noro.guru'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
  res.setHeader('Content-Type', 'text/plain')
  res.write(content)
  res.end()
  return { props: {} }
}

export default function Robots() {
  return null
}

