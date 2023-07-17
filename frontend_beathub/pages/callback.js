import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Callback() {
    const router = useRouter()

    const CLIENT_ID = '39dd8906e8044b7eb1715c1a4a1867e7'
    const REDIRECT_URI = "http://localhost:3000/callback"
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const RESPONSE_TYPE = 'token'
    const SCOPE = 'user-read-private playlist-read-private user-read-currently-playing user-follow-read user-top-read playlist-modify-public playlist-modify-private user-library-modify'

    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`

    useEffect(() => {
        const getToken = async () => {
            const hash = window.location.hash
            if (!hash) {
                router.replace(url)
            } else {
                const urlParams = new URLSearchParams(hash.replace('#', '?'))
                const token = urlParams.get('access_token')
                sessionStorage.setItem('token', token)
                const callbackUrl = sessionStorage.getItem('callback')
                await router.push(`/${callbackUrl}`)
            }
        }

        getToken()
    }, [])
}