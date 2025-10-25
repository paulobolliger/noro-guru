import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Why from '@/sections/Why'
import Plans from '@/sections/Plans'
import HowItWorks from '@/sections/HowItWorks'
import Portfolio from '@/sections/Portfolio'
import FinalCta from '@/sections/FinalCta'
import ContactForm from '@/sections/ContactForm'
import About from '@/sections/About'

const siteUrl = 'https://noro.guru'
const metaTitle = 'NORO | Criação de Sites Inteligentes'
const metaDescription = 'Seu site, criado com inteligência. A NORO combina design, performance e automação para marcas que querem ir além.'
const ogImage = 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="NORO" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <Header />
      <main>
        <Hero />
        <Why />
        <Plans />
        <HowItWorks />
        <Portfolio />
        <FinalCta />
        <ContactForm />
        <About />
      </main>
      <Footer />
    </>
  )
}
