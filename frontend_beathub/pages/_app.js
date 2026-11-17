import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head'
import { Roboto } from 'next/font/google'
import { useEffect } from 'react'
import "../styles/globals.css"

// Self-hosted by Next.js at build time (no request to Google Fonts at runtime)
const roboto = Roboto({ weight: ['400', '500', '700', '900'], subsets: ['latin'], display: 'swap' })

export default function App({ Component, pageProps }) {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#121212" />
        {/* .ico for browsers without SVG favicon support; sizes="32x32" lets the SVG win elsewhere */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>BeatHub</title>
      </Head>
      <style jsx global>{`
        :root {
          --font-roboto: ${roboto.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>

  )
}
