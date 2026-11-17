import axios from "axios"

export default async function handler(req, res) {
    const time = req.query.time ?? "short_term"
    const token = req.headers.authorization

    const headers = {
        headers: {
            'Authorization': token
        }
    }

    const getUserProfile = async () => {
        const { data: { id, display_name, images } } = await axios.get('https://api.spotify.com/v1/me', headers)
        return { id, display_name, images }
    }

    const getTopArtistsAndGenres = async () => {

        const genresList = {}

        const { data: { items } } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${time}&limit=50&offset=0`, headers)

        items.map(({ genres }) => {
            for (const genre of genres ?? []) {
                if (genresList.hasOwnProperty(genre)) {
                    genresList[genre]++
                }
                else {
                    genresList[genre] = 1
                }
            }
        })

        return {
            artists: items.map(({ id, name, images }) => ({ id, name, images: images[0] })),
            genres: Object.entries(genresList)
        }
    }

    const getTopTracks = async () => {

        const { data: { items } } = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${time}&limit=50&offset=0`, headers)

        return {
            tracks: items.map(({ id, name, album, artists }) => ({ id, name, artists: artists.map(({ name }) => (name)), images: album.images[0] }))
        }
    }

    try {
        const user = await getUserProfile()
        const topArtistsAndGenres = await getTopArtistsAndGenres()
        const topTracks = await getTopTracks()

        res.status(200).send({ user, ...topArtistsAndGenres, ...topTracks })
    }
    catch (error) {
        const status = error.response?.status === 401 ? 401 : 500
        res.status(status).send({ message: status === 401 ? 'Token expired' : 'Could not load statistics' })
    }
}
