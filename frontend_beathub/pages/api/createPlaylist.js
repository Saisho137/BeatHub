import axios from "axios"

export default async function handler(req, res) {
    const token = req.headers.authorization
    const name = req.body.name
    const uris = req.body.uris

    const headers = {
        headers: {
            'Authorization': token
        }
    }

    try {
        const { data: { id } } = await axios.get('https://api.spotify.com/v1/me', headers)
        const user = { id }
        const body = {
            name: name,
            description: "BeatHub Recommendations!"
        }
        const { data } = await axios.post(`https://api.spotify.com/v1/users/${user.id}/playlists`, body, headers)

        const modifiedUris = uris.map((id) => {
            return "spotify:track:" + id
        })

        const itemsBody = {
            uris: modifiedUris
        }
        axios.post(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, itemsBody, headers)

        res.status(200).send({ message: "Playlist created succesfully!" })

    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}