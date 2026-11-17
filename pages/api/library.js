import { spotifyGet, inBatches, sendSpotifyError } from '../../lib/spotifyApi'

const PAGE_SIZE = 50 // Spotify max for /me/tracks
const PAGES_PER_CHUNK = 5

// Returns one chunk (up to 250) of the user's saved tracks, starting at ?offset=
export default async function handler(req, res) {
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0)
    const authorization = req.headers.authorization

    try {
        const pages = await inBatches(
            Array.from({ length: PAGES_PER_CHUNK }, (_, i) =>
                () => spotifyGet(`/me/tracks?limit=${PAGE_SIZE}&offset=${offset + i * PAGE_SIZE}`, authorization)
            ),
            PAGES_PER_CHUNK
        )

        const tracks = pages
            .flatMap(page => page.items)
            .filter(({ track }) => track && track.id)
            .map(({ added_at, track }) => ({
                id: track.id,
                name: track.name,
                artists: track.artists.map(({ id, name }) => ({ id, name })),
                image: (track.album.images[1] || track.album.images[0])?.url ?? null,
                releaseDate: track.album.release_date,
                durationMs: track.duration_ms,
                explicit: track.explicit,
                addedAt: added_at
            }))

        res.status(200).send({ total: pages[0].total, tracks })
    } catch (error) {
        sendSpotifyError(res, error)
    }
}
