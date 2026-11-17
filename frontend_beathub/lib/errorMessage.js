// User-facing message for a failed /api request (axios error)
export function errorMessage(error, fallback) {
    if (error.response?.status === 429) {
        const seconds = error.response.data?.retryAfter
        const wait = !seconds ? 'in a moment'
            : seconds < 90 ? `in ${seconds} seconds`
            : `in about ${Math.ceil(seconds / 60)} minutes`
        return `Spotify is limiting requests right now. Please try again ${wait}.`
    }
    return fallback
}
