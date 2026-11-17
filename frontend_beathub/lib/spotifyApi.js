import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1'
const MAX_RETRIES = 3

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// GET a Web API path, retrying when Spotify rate-limits the app (429)
export async function spotifyGet(path, authorization, attempt = 0) {
    try {
        const { data, status } = await axios.get(`${BASE_URL}${path}`, { headers: { Authorization: authorization } })
        return status === 204 ? null : data
    } catch (error) {
        if (error.response?.status === 429 && attempt < MAX_RETRIES) {
            const retryAfter = Number(error.response.headers['retry-after']) || 1
            await wait(retryAfter * 1000)
            return spotifyGet(path, authorization, attempt + 1)
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

export function sendSpotifyError(res, error) {
    const status = error.response?.status === 401 ? 401 : 500
    res.status(status).send({ message: status === 401 ? 'Token expired' : 'Spotify request failed' })
}
