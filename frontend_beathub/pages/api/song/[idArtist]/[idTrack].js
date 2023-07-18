import axios from "axios"

export default async function handler(req, res) {
    const headers = req.headers.authorization
    const artistsId = req.query.idArtist
    const trackId = req.query.idTrack


    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${artistsId}&seed_tracks=${trackId}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const tracks = data.tracks.map(track => ({
            name: track.name,
            id: track.id,
            images: track.album.images[0].url,
            artist: track.artists.map(artist => artist.name),
            preview: track.preview_url
        }));
        res.status(200).send({ getSimilarTrack: tracks })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}