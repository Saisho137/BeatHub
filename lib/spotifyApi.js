import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1'
const MAX_RETRIES = 3
// Only wait for short rate limits; Spotify can ask to wait minutes, which would hang the request
const MAX_RETRY_WAIT_SECONDS = 5

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const retryAfterSeconds = (error) => Number(error.response?.headers?.['retry-after']) || 1

// GET a Web API path, retrying on short rate limits (429) and transient Spotify errors (5xx)
export async function spotifyGet(path, authorization, attempt = 0) {
    try {
        const { data, status } = await axios.get(`${BASE_URL}${path}`, { headers: { Authorization: authorization } })
        return status === 204 ? null : data
    } catch (error) {
        const status = error.response?.status
        if (attempt < MAX_RETRIES) {
            if (status === 429 && retryAfterSeconds(error) <= MAX_RETRY_WAIT_SECONDS) {
                await wait(retryAfterSeconds(error) * 1000)
                return spotifyGet(path, authorization, attempt + 1)
            }
            if (status >= 500) {
                await wait(500 * (attempt + 1))
                return spotifyGet(path, authorization, attempt + 1)
            }
        }
        throw error
    }
}

// Run async tasks with limited concurrency to stay under rate limits
export async function inBatches(tasks, size = 4) {
    const results = []
    for (let i = 0; i < tasks.length; i += size) {
        results.push(...await Promise.all(tasks.slice(i, i + size).map(task => task())))
    }
    return results
}

// Forward Spotify's real status: 401 (session expired), 429 (rate limited) or 500
export function sendSpotifyError(res, error) {
    const spotifyStatus = error.response?.status
    const detail = error.response?.data?.error?.message ?? error.response?.data?.error ?? error.message

    // Visible in the server terminal (npm run dev): Spotify's own reason for the failure
    console.error('[Spotify]', spotifyStatus ?? '', error.config?.url ?? '', detail)

    if (spotifyStatus === 401) {
        res.status(401).send({ message: 'Token expired' })
    } else if (spotifyStatus === 429) {
        const retryAfter = retryAfterSeconds(error)
        res.setHeader('Retry-After', String(retryAfter))
        res.status(429).send({ message: 'Spotify rate limit reached', retryAfter })
    } else {
        res.status(500).send({ message: 'Spotify request failed' })
    }
}
