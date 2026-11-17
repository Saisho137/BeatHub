import { formatWait } from './format'

// User-facing message for a failed /api request (axios error)
export function errorMessage(error, fallback) {
    if (error.response?.status === 429) {
        const seconds = error.response.data?.retryAfter
        const wait = seconds ? `in ${formatWait(seconds)}` : 'in a moment'
        return `Spotify is limiting requests right now. Please try again ${wait}.`
    }
    return fallback
}
