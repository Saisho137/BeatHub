import { spotifyGet, sendSpotifyError } from '../../../../lib/spotifyApi'

export default async function handler(req, res) {
    try {
        const data = await spotifyGet(`/search?q=${encodeURIComponent(req.query.album)}&type=album&limit=10`, req.headers.authorization)
        const albums = data.albums.items.map(album => ({
            id: album.id,
            name: `${album.name} · ${album.artists.map(artist => artist.name).join(', ')}`,
            images: album.images[0] ? album.images[0].url : null
        }))
        res.status(200).send({ getAlbum: albums })
    } catch (error) {
        sendSpotifyError(res, error)
    }
}
