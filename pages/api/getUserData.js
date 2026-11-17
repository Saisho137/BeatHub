import { spotifyGet, sendSpotifyError } from '../../lib/spotifyApi'

export default async function handler(req, res) {
    try {
        const { display_name, images, id } = await spotifyGet('/me', req.headers.authorization)
        res.status(200).send({
            username: display_name,
            image: images.length > 0 ? images[0].url : null,
            id
        })
    } catch (error) {
        // Real status: 401 (session expired), 429 (rate limited) or 500
        sendSpotifyError(res, error)
    }
}
