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

    const getTopArtistsAndGenres = async () => {

        const genresList = {}

        const { data: { items } } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${time}&limit=10&offset=0`, headers)

        items.map(({ genres }) => {
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
            artists: items.map(({ id, name, images }) => ({ id, name, images: images[0] })),
            genres: genresList
        }
    }

    const getTopTracks = async () => {
        const { data: { items } } = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${time}&limit=10&offset=0`, headers)
        return items.map(({ id, name, album, artists }) => ({ id, name, artists: artists.map(({ name }) => ( name )), images: album.images[0] }))
    }

    const user = await getUserProfile()
    const topArtistsAndGenres = await getTopArtistsAndGenres()
    const topTracks = await getTopTracks()

    console.log(topTracks);

    res.status(200).send({ user, ...topArtistsAndGenres, topTracks })
}

module.exports = { getStats }