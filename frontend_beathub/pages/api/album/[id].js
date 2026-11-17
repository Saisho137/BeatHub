import { spotifyGet, sendSpotifyError } from '../../../lib/spotifyApi'

export default async function handler(req, res) {
    const authorization = req.headers.authorization
    const id = encodeURIComponent(req.query.id)

    try {
        const album = await spotifyGet(`/albums/${id}`, authorization)

        // Albums with more tracks than the first page: try to load the rest,
        // but keep the first page if the extra request is not allowed
        let items = album.tracks.items
        let next = album.tracks.next
        while (next) {
            try {
                const page = await spotifyGet(next.replace('https://api.spotify.com/v1', ''), authorization)
                items = items.concat(page.items)
                next = page.next
            } catch {
                next = null
            }
        }

        const tracks = items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map(({ id, name }) => ({ id, name })),
            durationMs: track.duration_ms,
            explicit: track.explicit,
            trackNumber: track.track_number,
            discNumber: track.disc_number
        }))

        res.status(200).send({
            id: album.id,
            name: album.name,
            type: album.album_type,
            releaseDate: album.release_date,
            image: album.images[0]?.url ?? null,
            artists: album.artists.map(({ id, name }) => ({ id, name })),
            totalTracks: album.total_tracks,
            totalDurationMs: tracks.reduce((sum, track) => sum + track.durationMs, 0),
            copyrights: (album.copyrights || []).map(({ text }) => text),
            tracks
        })
    } catch (error) {
        sendSpotifyError(res, error)
    }
}
