import '../styles/globals.css'

export const metadata = {
  title: 'NORO',
  description: 'Intelligent Core by .guru',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

