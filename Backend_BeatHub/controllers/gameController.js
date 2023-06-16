'use strict'

const axios = require('axios')

const randomSong = async (req, res) => {
    const body = req.body
    const findBy = body.findBy
    const searchItem = body.searchItem
    const trackList = []

    switch (findBy) {
        case "genre":
            const { data } = await axios.get(`https://api.spotify.com/v1/search?query=genre%3A${searchItem}&type=track`,
                { headers: { Authorization: `${req.headers.authorization}` } }
            )
            data.tracks.items.map((track) => {
                trackList.push(track.id)
            })
            break
        case "playlist":
            const playlistID = searchItem.split('playlist/')[1]
            const playlist = await axios.get(`https://api.spotify.com/v1/playlists/${playlistID}`,
                { headers: { Authorization: `${req.headers.authorization}` } }
            )
            playlist.data.tracks.items.map(pl => {
                trackList.push(pl.track.id)
            })
            break
        case "artist":
            const topTracksArtist = await axios.get(`https://api.spotify.com/v1/search?query=artist%3A${searchItem}&type=track`,
                { headers: { Authorization: `${req.headers.authorization}` } }
            )
            topTracksArtist.data.tracks.items.map((track) => {
                trackList.push(track.id)
            })
            break
        default:
            res.status(400).send({ Message: "Bad Request" })
            break
    }
    const track = trackList[Math.floor(Math.random() * trackList.length)]
    res.status(200).send({ Track: track })
}

module.exports = {
    randomSong
}