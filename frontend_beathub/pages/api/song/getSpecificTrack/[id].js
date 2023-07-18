import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const id = req.query.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const track = {
            name: data.name,
            artistId: data.album.artists.map(artist => artist.id),
            artistName: data.album.artists.map(artist => artist.name),
            songId: id,
            images: data.album.images[0].url
        }
        res.status(200).send({ getTrack: track })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}