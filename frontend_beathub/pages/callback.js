import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { redirectToSpotifyLogin, exchangeCodeForToken } from '../lib/spotifyAuth'

export default function Callback() {
    const router = useRouter()
    const handled = useRef(false)

    useEffect(() => {
        // The authorization code can only be used once; avoid double execution
        if (handled.current) return
        handled.current = true

        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search)
            const code = params.get('code')
            const error = params.get('error')

            if (error) {
                console.error('Spotify authorization error:', error)
                await router.replace('/')
                return
            }

            if (!code) {
                // Pages redirect here when the token is missing/expired: start login
                await redirectToSpotifyLogin()
                return
            }

            try {
                await exchangeCodeForToken(code)
                const callbackUrl = sessionStorage.getItem('callback') || ''
                sessionStorage.removeItem('callback')
                await router.replace(`/${callbackUrl}`)
            } catch (err) {
                console.error(err)
                await router.replace('/')
            }
        }

        handleCallback()
    }, [])

    return null
}
