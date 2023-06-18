'use strict'

const express = require('express')

const statisticsController = require('../controllers/statisticsController')
const gameController = require('../controllers/gameController')

const app = express.Router()

app.post('/getRandomTrack', gameController.getRandomSong)
app.get("/stats/:time?", statisticsController.getStats)


module.exports = app