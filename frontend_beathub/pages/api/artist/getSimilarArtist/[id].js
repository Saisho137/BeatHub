import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const artistsId = req.query.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistsId}/related-artists`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = data.artists.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.images[0] ? artists.images[0].url : null,
        }))
        res.status(200).send({ getSimilarArtist: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}