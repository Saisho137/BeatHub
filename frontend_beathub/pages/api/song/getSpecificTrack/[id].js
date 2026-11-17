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
            artistId: data.artists.map(artist => artist.id),
            artistName: data.artists.map(artist => artist.name),
            songId: id,
            album: data.album.name,
            albumId: data.album.id,
            albumType: data.album.album_type,
            releaseDate: data.album.release_date,
            trackNumber: data.track_number,
            totalTracks: data.album.total_tracks,
            durationMs: data.duration_ms,
            explicit: data.explicit
        }
        res.status(200).send({ getTrack: track })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ message: 'Bad Request' })
    }
}
