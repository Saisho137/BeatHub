'use strict'

const axios = require('axios')

const getStats = async (req, res) => {
    const time = req.params.time ?? "short_term"
    const token = req.headers.authorization

    const headers = {
        headers: {
            'Authorization': token
        }
    }

    const getUserProfile = async () => {
        const { data: { id, display_name, followers, images, country } } = await axios.get('https://api.spotify.com/v1/me', headers)
        return { id, display_name, followers, images, country }
    }

    const getTopArtistsAndGenres = async (id) => {

        const genresList = {}

        const { data: { items } } = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0', headers)

        items.map(({ genres }) => {
            console.log(genres);
            for (const genre of genres) {
                if (genresList.hasOwnProperty(genre)) {
                    genresList[genre]++
                }
                else {
                    genresList[genre] = 1
                }
            }
        })

        return {
            artists: items.map(({ id, images, name }) => ({ id, images: images[0], name })),
            genres: genresList
        }
    }

    const user = await getUserProfile()
    const topArtistsAndGenres = await getTopArtistsAndGenres()

    res.status(200).send({ user, ...topArtistsAndGenres })
}

module.exports = { getStats }