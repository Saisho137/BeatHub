import axios from "axios"

export default async function handler(req, res) {
    try {
        const token = req.headers.authorization
        const id = req.body.id
        const headers = {
            headers: {
                'Authorization': token
            }
        }
        await axios.put('https://api.spotify.com/v1/me/tracks', { ids: [id] }, headers)
        res.status(200).send({ message: 'Song Successfully Added' })
    } catch (err) {
        if (err.response && err.response.status === 401) {
            res.status(401).send({ message: 'Token missing or invalid.' })
            return
        }
        res.status(400).send({ message: err })
    }
}
