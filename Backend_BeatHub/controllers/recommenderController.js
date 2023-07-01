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
        res.status(200).send({ getTrack: tracks});
    } catch (error) {
        res.status(500).send({ error });
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
            artistId: data.album.artists[0].id,
            songId: id,
            images: data.album.images[0].url 
        }
        res.status(200).send({ getTrack: track});
    } catch (error) {
        res.status(500).send({ error });
    }
}

const getSimilarTrack = async (req, res) => {
    const headers = req.headers.authorization
    const artistsId = req.params.idArtist
    const trackId =req.params.idTrack

    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${artistsId}&seed_tracks=${trackId}`, {
            method: 'GET',
            headers: {
                Authorization: `${headers}`,
            },
        })
        const tracks = data.tracks.map(track => ({
            name: track.name,
            images: track.album.images[0].url,
            artist: track.artists.map(artist => artist.name)
          }));
        res.status(200).send({ getSimilarTrack: tracks});
    } catch (error) {
        res.status(500).send({ error });
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
            images: artists.images[0]? artists.images[0].url: null
        }))
        res.status(200).send({ getArtist: artist});
    } catch (error) {
        res.status(500).send({ error });
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
            genres: data.genres,
            images: data.images[0].url
        }
        res.status(200).send({ getSpecificArtist: artist});
    } catch (error) {
        res.status(500).send({ error });
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
            images: artists.images[0].url

        }))
        res.status(200).send({ getSimilarArtist: artist});
    } catch (error) {
        res.status(500).send({ error });
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
            name: track.name,
            id: track.id,
            preview: track.preview_url,
            images: track.album.images[0].url
        }))
        res.status(200).send({ getArtistTopTracks: track});
    } catch (error) {
        res.status(500).send({ error });
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
        res.status(200).send({ getGenre: data});
    } catch (error) {
        res.status(500).send({ error });
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
        res.status(200).send({ getTopTracksGenre: artist});
    } catch (error) {
        res.status(500).send({ error });
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
        res.status(200).send({ getTopArtistGenre: artist});
    } catch (error) {
        res.status(500).send({ error });
    }

}


module.exports = {
    getTrack, getArtist, getGenre, getSpecificArtist, 
    getSimilarArtist, getArtistTopTracks, getSpecificTrack, 
    getSimilarTrack, getTopTracksGenre, getTopArtistGenre
}