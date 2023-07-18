import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const track = req.query.track

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const tracks = data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            images: track.album.images[0].url
        }))
        res.status(200).send({ getTrack: tracks })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}
