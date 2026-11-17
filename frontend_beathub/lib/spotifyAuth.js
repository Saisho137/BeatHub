// Spotify Authorization Code flow with PKCE.
// The Implicit Grant flow (response_type=token) was removed by Spotify,
// so the browser now receives a `code` and exchanges it for a token.

// Set NEXT_PUBLIC_SPOTIFY_CLIENT_ID in .env.local (local) and in Vercel (production).
// The Client ID is public by design; never put the Client Secret here.
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
// Read-only scopes: profile, top items, saved songs, followed artists, playlists,
// recently played and currently playing
const SCOPE = 'user-read-private user-top-read user-library-read user-follow-read playlist-read-private user-read-recently-played user-read-currently-playing'
const VERIFIER_KEY = 'spotify_code_verifier'

// Must match EXACTLY one of the Redirect URIs registered in the Spotify dashboard.
const getRedirectUri = () => `${window.location.origin}/callback`

const base64UrlEncode = (bytes) =>
    btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

const generateCodeVerifier = () => {
    const bytes = new Uint8Array(64)
    window.crypto.getRandomValues(bytes)
    return base64UrlEncode(bytes)
}

const generateCodeChallenge = async (verifier) => {
    const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    return base64UrlEncode(digest)
}

export const redirectToSpotifyLogin = async () => {
    if (!CLIENT_ID) {
        throw new Error('NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not set (see .env.example)')
    }
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    // localStorage so the verifier survives the round-trip to Spotify
    localStorage.setItem(VERIFIER_KEY, verifier)

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: getRedirectUri(),
        scope: SCOPE,
        code_challenge_method: 'S256',
        code_challenge: challenge,
    })
    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`
}

export const exchangeCodeForToken = async (code) => {
    const verifier = localStorage.getItem(VERIFIER_KEY)
    if (!verifier) throw new Error('Missing PKCE code verifier')

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: getRedirectUri(),
            code_verifier: verifier,
        }),
    })
    localStorage.removeItem(VERIFIER_KEY)

    if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status} ${await response.text()}`)
    }
    const data = await response.json()
    sessionStorage.setItem('token', data.access_token)
    sessionStorage.setItem('tokenTimestamp', Date.now())
    return data.access_token
}
