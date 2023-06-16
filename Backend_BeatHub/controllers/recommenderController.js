'use strict'

const axios = require('axios')

const getTrack = async (req, res) => {
    const headers = req.headers.authorization

    try {
        const { data } = await axios.get('https://api.spotify.com/v1/search?q=stay&type=track', {
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

/* const getSimilar = async (req, res) => {
    const token = 'BQB4m9-nXPla686Gg8O17mfGGKWr2GO0HGgBaDQsRdXIGPq61tYQYsJcUBeJHyh3saoh1-Fi1wgzRhfzQeUbORtdGnuvoJcLpQKrMyBGsvt7FP6k578zeyi_LHXhT5QpnwEdq0HJenartsc2SLyXOELdBR7czQ7PbX8-07gh3Jl9PwP9iGvSmq67jvPIcEByWLfm5tvajQlNpOUX-exl5kXiU88Kp2_yzOI'; // Replace with your actual access token

    try {
        const { data } = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Token is valid:', data);
    } catch (error) {
        console.error('Error validating token:', error);
    }
}; */


module.exports = {
    getTrack
}