import Layout from "../components/layout";
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
    const hash = window.location.hash
    let token = window.sessionStorage.getItem('token')

    if (hash) {
      const urlParams = new URLSearchParams(window.location.hash.replace('#','?'))
      let token = urlParams.get('access_token')

      window.location.hash = ''
      window.sessionStorage.setItem('token',token)
    }
  }, [])

  const CLIENT_ID = '39dd8906e8044b7eb1715c1a4a1867e7'
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'
  const SCOPE = 'user-read-private playlist-read-private user-read-currently-playing user-follow-read user-top-read'

  return (
    <Layout
      authEndpoint={AUTH_ENDPOINT}
      clientId={CLIENT_ID}
      redirectUri={REDIRECT_URI}
      responseType={RESPONSE_TYPE}
      scope={SCOPE}
    >
      <a>Login with Spotify</a>
    </Layout>
  );
}