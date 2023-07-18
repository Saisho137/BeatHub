import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const genre = req.query.genre

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=genre:${genre}&type=artist`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = data.artists.items.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.images[0].url
        }))
        res.status(200).send({ getTopArtistGenre: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}