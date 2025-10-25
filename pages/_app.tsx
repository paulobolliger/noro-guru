import type { AppProps } from 'next/app'
import '../styles/globals.css'
import dynamic from 'next/dynamic'

const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Chatbot />
    </>
  )
}
