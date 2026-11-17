import { spotifyGet, inBatches, sendSpotifyError } from '../../../../lib/spotifyApi'

const PAGE_SIZE = 10 // Spotify max for this endpoint in Development Mode
const MAX_RELEASES = 200

export default async function handler(req, res) {
    const authorization = req.headers.authorization
    const path = (offset) =>
        `/artists/${encodeURIComponent(req.query.id)}/albums?include_groups=album,single&limit=${PAGE_SIZE}&offset=${offset}`

    try {
        const first = await spotifyGet(path(0), authorization)
        const total = Math.min(first.total, MAX_RELEASES)

        const offsets = []
        for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) offsets.push(offset)
        const rest = await inBatches(offsets.map(offset => () => spotifyGet(path(offset), authorization)))

        const seen = new Set()
        const releases = [first, ...rest]
            .flatMap(page => page.items)
            .map(album => ({
                id: album.id,
                name: album.name,
                type: album.album_type,
                releaseDate: album.release_date,
                totalTracks: album.total_tracks,
                image: (album.images[1] || album.images[0])?.url ?? null
            }))
            // Spotify can list the same release twice (e.g. clean/explicit versions)
            .filter(release => {
                const key = `${release.type}|${release.name.toLowerCase()}`
                if (seen.has(key)) return false
                seen.add(key)
                return true
            })
            .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))

        res.status(200).send({ releases, truncated: first.total > MAX_RELEASES })
    } catch (error) {
        sendSpotifyError(res, error)
    }
}
