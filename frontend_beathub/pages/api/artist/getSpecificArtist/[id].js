import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const artistsId = req.query.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistsId}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = {
            name: data.name,
            genres: data.genres ? data.genres : "Na",
            images: data.images[0] ? data.images[0].url : null
        }
        res.status(200).send({ getSpecificArtist: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}