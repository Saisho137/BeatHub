import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head'
import { useEffect } from 'react'
import "../styles/globals.css"

export default function App({ Component, pageProps }) {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, [])

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BeatHub</title>
      </Head>
      <Component {...pageProps} />
    </>

  )
}
