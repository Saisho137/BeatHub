import { spotifyGet, sendSpotifyError } from '../../lib/spotifyApi'

// Last 50 plays (Spotify limit); grouped by hour/day on the client, in the user's time zone
export default async function handler(req, res) {
    try {
        const data = await spotifyGet('/me/player/recently-played?limit=50', req.headers.authorization)
        const plays = data.items.map(({ played_at, track }) => ({
            playedAt: played_at,
            track: {
                id: track.id,
                name: track.name,
                artists: track.artists.map(artist => artist.name),
                image: (track.album.images[2] || track.album.images[0])?.url ?? null
            }
        }))
        res.status(200).send({ plays })
    } catch (error) {
        sendSpotifyError(res, error)
    }
}
