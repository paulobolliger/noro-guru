import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NORO Core - Tenant Portal',
  description: 'Portal do tenant NORO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
