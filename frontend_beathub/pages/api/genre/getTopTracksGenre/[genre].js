import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const genre = req.query.genre

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=10`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })

        const tracks = data.tracks.items.map(track => ({
            name: track.name,
            id: track.id,
            images: track.album.images[0].url,
            artist: track.artists[0].name
        }))
        res.status(200).send({ getTopTracksGenre: tracks })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ message: 'Bad Request' })
    }
}
