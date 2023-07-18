import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const artists = req.query.artist

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${artists}&type=artist`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = data.artists.items.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.images[0] ? artists.images[0].url : null

        }))
        res.status(200).send({ getArtist: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}