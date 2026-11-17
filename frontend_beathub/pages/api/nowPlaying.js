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
        sendSpotifyError(res, error)
    }
}
