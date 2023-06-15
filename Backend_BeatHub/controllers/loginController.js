const client_id = '39dd8906e8044b7eb1715c1a4a1867e7'
const redirect_uri = 'http://localhost:8080/callback'
const querystring = require('querystring');

const loginSpotifyUser = (req, res) => {
    const scope = 'user-read-private user-read-email'

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri
        })
    )
}

const loginSpotifyCallback = (req, res) => {
    const code = req.query.code || null
    const state = req.query.state || null

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }))
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        }
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var token = body.access_token
            }
        })
    }
    
}
module.exports = {
    loginSpotifyUser,
    loginSpotifyCallback
}

