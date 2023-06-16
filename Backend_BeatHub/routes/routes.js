'use strict'

const express = require('express')

const statisticsController = require('../controllers/statisticsController')

const app = express.Router()

app.get("/stats/:time?", statisticsController.getStats)

module.exports = app