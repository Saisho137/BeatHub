import Layout from "../components/layout";
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    if (!token && hash) {
      const urlParams = new URLSearchParams(window.location.hash.replace('#','?'))
      let token = urlParams.get('access_token')

      window.location.hash = ''
      window.localStorage.setItem('token',token)
    }
  }, [])

  const CLIENT_ID = '39dd8906e8044b7eb1715c1a4a1867e7'
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'
  const SCOPE = 'user-read-private playlist-read-private user-read-currently-playing user-follow-read user-top-read'

  return (
    <Layout>
      <a 
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>
            Login with Spotify
          </a>
    </Layout>
  );
}