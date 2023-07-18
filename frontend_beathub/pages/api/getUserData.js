import axios from "axios"

export default async function handler(req, res) {
    const token = req.headers.authorization
    const headers = {
        headers: {
            'Authorization': token
        }
    }

    try {
        const { data: { display_name, images, id } } = await axios.get('https://api.spotify.com/v1/me', headers)

        const image = images.length > 0 ? images[0].url : null

        res.status(200).send({
            username: display_name,
            image: image,
            id: id
        })

    } catch (error) {
        res.status(401).send({ message: 'token expired' })
    }
}
