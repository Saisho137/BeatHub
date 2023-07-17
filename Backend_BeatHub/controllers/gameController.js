'use strict'

const axios = require('axios')

const getRandomSong = async (req, res) => {
    try {
        const body = req.body
        const findBy = body.findBy
        const searchItem = body.searchItem
        const trackList = []

        const token = req.headers.authorization

        const headers = {
            headers: {
                'Authorization': token
            }
        }

        if (!findBy || !searchItem) {
            res.status(400).send({ Message: "Bad Request" })
            return
        }

        switch (findBy) {
            case "genre":
                const genre = await axios.get(`https://api.spotify.com/v1/search?q=genre%3A${searchItem}&type=track&limit=50`, headers)
                genre.data.tracks.items.map(track => {
                    if (track.preview_url) { trackList.push(track.id) }
                })
                break
            case "playlist":
                const playlistID = searchItem.split('playlist/')[1]
                const playlist = await axios.get(`https://api.spotify.com/v1/playlists/${playlistID}`, headers)
                playlist.data.tracks.items.map(pl => {
                    if (pl.track.preview_url) { trackList.push(pl.track.id) }
                })
                break
            case "artist":
                const { data: { artists: { items } } } = await axios.get(`https://api.spotify.com/v1/search?q=artist%3A${searchItem}&type=artist&limit=1`, headers)
                const albumList = []
                const topAlbumsArtist = await axios.get(`https://api.spotify.com/v1/artists/${items[0].id}/albums?limit=50&include_groups=single,album`, headers)
                topAlbumsArtist.data.items.map(album => (albumList.push(album.id)))
                const topTracksFromAlbum = await axios.get(`https://api.spotify.com/v1/albums/${albumList[Math.floor(Math.random() * albumList.length)]}/tracks`, headers)
                topTracksFromAlbum.data.items.map((track) => {
                    if (track.preview_url) { trackList.push(track.id) }
                })
                break
            default:
                res.status(400).send({ Message: "Bad Request" })
                return
        }
        const track = trackList[Math.floor(Math.random() * trackList.length)]

        const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${track}`, headers)
        const infoTrack = {
            id: track,
            name: data.name,
            artistName: data.album.artists.map(artist => (artist.name)),
            image: data.album.images[0].url,
            preview: data.preview_url
        }
        res.status(200).send({ Track: infoTrack })

    } catch (err) {
        if (err.response && err.response.status === 401) {
            res.status(401).send({ message: 'Token missing or invalid.' })
            return
        }
        res.status(400).send({ message: 'Bad Request' })
    }
}

const saveOnSpotify = async (req, res) => {
    try {
        const token = req.headers.authorization
        const id = req.body.id
        const headers = {
            headers: {
                'Authorization': token
            }
        }
        await axios.put('https://api.spotify.com/v1/me/tracks', { ids: [id] }, headers)
        res.status(200).send({ message: 'Song Successfully Added' })
    } catch (err) {
        if (err.response && err.response.status === 401) {
            res.status(401).send({ message: 'Token missing or invalid.' })
            return
        }
        res.status(400).send({ message: err })
    }
}

module.exports = { getRandomSong, saveOnSpotify }