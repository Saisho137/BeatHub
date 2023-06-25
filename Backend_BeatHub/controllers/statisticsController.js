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

        const { data: { items } } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${time}&limit=50&offset=0`, headers)

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
            genres: Object.entries(genresList)
        }
    }

    const getTracksFeatures = async (ids, popularity) => {

        let totalPopularity = 0
        let totalHappiness = 0
        let totalDanceability = 0
        let totalEnergy = 0
        let totalAcousticness = 0
        let totalInstrumentalness = 0
        let totalLiveness = 0
        let totalSpeechiness = 0
        let count = 0

        const { data: { audio_features } } = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids.toString()}`, headers)

        audio_features.forEach(features => {
            const { valence, danceability, energy, acousticness, instrumentalness, liveness, speechiness } = features

            totalPopularity += popularity[count]
            totalHappiness += valence
            totalDanceability += danceability
            totalEnergy += energy
            totalAcousticness += acousticness
            totalInstrumentalness += instrumentalness
            totalLiveness += liveness
            totalSpeechiness += speechiness
            count++
        })

        return {
            popularity: totalPopularity / (count * 100),
            happiness: totalHappiness / count,
            danceability: totalDanceability / count,
            energy: totalEnergy / count,
            acousticness: totalAcousticness / count,
            instrumentalness: totalInstrumentalness / count,
            liveness: totalLiveness / count,
            speechiness: totalSpeechiness / count
        }
    }

    const getTopTracks = async () => {

        const songsId = []
        const popularityList = []

        const { data: { items } } = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${time}&limit=50&offset=0`, headers)

        items.map(({ id, popularity }) => {
            songsId.push(id)
            popularityList.push(popularity)
        })

        const features = await getTracksFeatures(songsId, popularityList)

        return {
            tracks: items.map(({ id, name, album, artists }) => ({ id, name, artists: artists.map(({ name }) => (name)), images: album.images[0] })),
            features
        }
    }

    try {
        const user = await getUserProfile()
        const topArtistsAndGenres = await getTopArtistsAndGenres()
        const topTracksAndFeatures = await getTopTracks()

        res.status(200).send({ user, ...topArtistsAndGenres, ...topTracksAndFeatures })
    }
    catch (error) {
        res.status(401).send({ message: 'Token expired' })
    }



}

module.exports = { getStats }