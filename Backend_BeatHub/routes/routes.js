'use strict'

const express = require('express') 
const app = express.Router()

const gameController = require('../controllers/gameController')

app.post('/getRandomTrack', gameController.getRandomSong)

module.exports = app