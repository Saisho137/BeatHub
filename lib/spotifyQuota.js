import axios from 'axios'

// When Spotify answers 429, remember until when it asked us to wait and stop calling
// our /api routes until then. Retrying during the block does not help and the quota is
// shared by the whole developer account, so this is stored per browser (localStorage).
const BLOCKED_UNTIL_KEY = 'beathub:blockedUntil'

export function blockedForSeconds() {
    try {
        const until = Number(localStorage.getItem(BLOCKED_UNTIL_KEY)) || 0
        return Math.max(0, Math.ceil((until - Date.now()) / 1000))
    } catch {
        return 0
    }
}

const rememberBlock = (seconds) => {
    try {
        localStorage.setItem(BLOCKED_UNTIL_KEY, String(Date.now() + seconds * 1000))
    } catch {
        // storage unavailable: nothing to remember
    }
}

let installed = false

// Axios interceptors for every request made by the pages
export function installQuotaGuard() {
    if (installed || typeof window === 'undefined') return
    installed = true

    axios.interceptors.request.use((config) => {
        const seconds = blockedForSeconds()
        if (seconds > 0 && config.url?.includes('/api/')) {
            // Same shape as a real 429 from our API, so pages handle it the same way
            const error = new Error('Spotify rate limit (waiting before calling again)')
            error.config = config
            error.response = { status: 429, data: { retryAfter: seconds }, headers: {} }
            return Promise.reject(error)
        }
        return config
    })

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 429) {
                rememberBlock(Number(error.response.data?.retryAfter) || 60)
            }
            return Promise.reject(error)
        }
    )
}
