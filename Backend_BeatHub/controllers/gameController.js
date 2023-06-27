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
                const { data } = await axios.get(`https://api.spotify.com/v1/search?query=genre%3A${searchItem}&type=track`, headers)
                data.tracks.items.map((track) => {
                    trackList.push(track.id)
                })
                break
            case "playlist":
                const playlistID = searchItem.split('playlist/')[1]
                const playlist = await axios.get(`https://api.spotify.com/v1/playlists/${playlistID}`, headers)
                playlist.data.tracks.items.map(pl => {
                    trackList.push(pl.track.id)
                })
                break
            case "artist":
                const topTracksArtist = await axios.get(`https://api.spotify.com/v1/search?query=artist%3A${searchItem}&type=track`, headers)
                topTracksArtist.data.tracks.items.map((track) => {
                    trackList.push(track.id)
                })
                break
            default:
                res.status(400).send({ Message: "Bad Request" })
                return
        }
        const track = trackList[Math.floor(Math.random() * trackList.length)]

        const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${track}`, headers)
        const infoTrack = {
            name: data.name,
            artistName: data.album.artists[0].name,
            image: data.album.images[0].url,
            preview: data.preview_url
        }
        res.status(200).send({ Track: infoTrack })

    } catch (err) {
        res.status(401).send({ message: 'Token missing or invalid.' })
    }
}

module.exports = {
    getRandomSong
}