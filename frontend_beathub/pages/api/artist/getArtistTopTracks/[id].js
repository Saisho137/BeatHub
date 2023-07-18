import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const artistsId = req.query.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistsId}/top-tracks?market=ES`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const track = data.tracks.map(track => ({
            artist: track.album.artists.map(artist => artist.name),
            name: track.name,
            id: track.id,
            preview: track.preview_url,
            images: track.album.images[0].url
        }))
        res.status(200).send({ getArtistTopTracks: track })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}