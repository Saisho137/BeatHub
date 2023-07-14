'use strict'

const axios = require('axios')

//TRACK ENDPOINTS
const getTrack = async (req, res) => {
    const headers = req.headers.authorization
    const track = req.params.track

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const tracks = data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            images: track.album.images[0].url
        }))
        res.status(200).send({ getTrack: tracks })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}

const getSpecificTrack = async (req, res) => {
    const headers = req.headers.authorization
    const id = req.params.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const track = {
            name: data.name,
            artistId: data.album.artists.map(artist => artist.id),
            artistName: data.album.artists.map(artist => artist.name),
            songId: id,
            images: data.album.images[0].url
        }
        res.status(200).send({ getTrack: track })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}

const getSimilarTrack = async (req, res) => {
    const headers = req.headers.authorization
    const artistsId = req.params.idArtist
    const trackId = req.params.idTrack

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${artistsId}&seed_tracks=${trackId}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const tracks = data.tracks.map(track => ({
            name: track.name,
            id: track.id,
            images: track.album.images[0].url,
            artist: track.artists.map(artist => artist.name),
            preview: track.preview_url
        }));
        res.status(200).send({ getSimilarTrack: tracks })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}

const createPlaylist = async (req, res) => {
    const token = req.headers.authorization
    const name = req.body.name
    const uris = req.body.uris

    const headers = {
        headers: {
            'Authorization': token
        }
    }

    try {
        const response = await axios.get('http://localhost:8080/getUserData', headers)
        let { id } = response.data
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
        axios.post(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, itemsBody, headers )

        res.status(200).send({message: "Playlist created succesfully!" })

    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}



//ARTIST ENDPOINTS
const getArtist = async (req, res) => {
    const headers = req.headers.authorization
    const artists = req.params.artist

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${artists}&type=artist`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = data.artists.items.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.images[0] ? artists.images[0].url : null

        }))
        res.status(200).send({ getArtist: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }

}

const getSpecificArtist = async (req, res) => {
    const headers = req.headers.authorization
    const artistsId = req.params.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistsId}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = {
            name: data.name,
            genres: data.genres ? data.genres : "Na",
            images: data.images[0] ? data.images[0].url : null
        }
        res.status(200).send({ getSpecificArtist: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}

const getSimilarArtist = async (req, res) => {
    const headers = req.headers.authorization
    const artistsId = req.params.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistsId}/related-artists`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = data.artists.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.images[0] ? artists.images[0].url : null,
        }))
        res.status(200).send({ getSimilarArtist: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}

const getArtistTopTracks = async (req, res) => {
    const headers = req.headers.authorization
    const artistsId = req.params.id

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistsId}/top-tracks?market=ES`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const track = data.tracks.map(track => ({
            artist: track.album.artists.map(artist => artist.name),
            name: track.name,
            id: track.id,
            preview: track.preview_url,
            images: track.album.images[0].url
        }))
        res.status(200).send({ getArtistTopTracks: track })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }
}

//GENRE ENDPOINTS
const getGenre = async (req, res) => {
    const headers = req.headers.authorization

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds
        `, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        res.status(200).send({ getGenre: data })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }

}

const getTopTracksGenre = async (req, res) => {
    const headers = req.headers.authorization
    const genre = req.params.genre


    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=genre:${genre}&type=track
        `, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })

        const artist = data.tracks.items.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.album.images[0].url,
            preview: artists.preview_url,
            artist: artists.artists[0].name
        }))
        res.status(200).send({ getTopTracksGenre: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }

}

const getTopArtistGenre = async (req, res) => {
    const headers = req.headers.authorization
    const genre = req.params.genre


    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/search?q=genre:${genre}&type=artist
        `, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const artist = data.artists.items.map(artists => ({
            name: artists.name,
            id: artists.id,
            images: artists.images[0].url
        }))
        res.status(200).send({ getTopArtistGenre: artist })
    } catch (error) {
        if (error.response && error.response.status == 401) {
            res.status(401).send({ message: 'token expired' })
            return
        }
        res.status(400).send({ error })
    }

}


module.exports = {
    getTrack, getArtist, getGenre, getSpecificArtist,
    getSimilarArtist, getArtistTopTracks, getSpecificTrack,
    getSimilarTrack, getTopTracksGenre, getTopArtistGenre, createPlaylist
}