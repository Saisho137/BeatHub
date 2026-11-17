import { spotifyGet, sendSpotifyError } from '../../lib/spotifyApi'

export default async function handler(req, res) {
    try {
        const data = await spotifyGet('/me/player/currently-playing', req.headers.authorization)

        // 204 (nothing playing) or a podcast episode: nothing to show
        if (!data || !data.item || data.currently_playing_type !== 'track') {
            res.status(200).send({ track: null })
            return
        }

        const { item } = data
        res.status(200).send({
            isPlaying: data.is_playing,
            track: {
                id: item.id,
                name: item.name,
                artists: item.artists.map(artist => artist.name)
            }
        })
    } catch (error) {
        if (error.response?.status === 401) {
            sendSpotifyError(res, error)
            return
        }
        // Decorative widget: after the retries, hide it instead of failing the request
        console.error('[Spotify] now playing unavailable:', error.response?.status ?? error.message)
        res.status(200).send({ track: null })
    }
}
