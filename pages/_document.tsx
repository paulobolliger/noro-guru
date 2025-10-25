import Document, { Html, Head, Main, NextScript } from 'next/document'

const siteUrl = 'https://noro.guru'
const logoUrl = 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969740/edited-photo_9_dfah2v.png'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

          <meta name="theme-color" content="#342CA4" />
          <link rel="canonical" href={siteUrl} />
          <link rel="icon" href={logoUrl} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
