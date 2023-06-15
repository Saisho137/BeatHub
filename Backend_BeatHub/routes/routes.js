'use strict'

const express = require('express') 
const app = express.Router()
const loginSpotifyController = require('../controllers/loginController')

app.get('/login', loginSpotifyController.loginSpotifyUser)
app.get('/callback', loginSpotifyController.loginSpotifyCallback)

module.exports = app