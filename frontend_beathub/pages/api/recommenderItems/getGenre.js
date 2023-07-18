import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        res.status(200).send({ getGenre: data })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}