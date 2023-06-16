'use strict'

const recommenderController = require('../controllers/recommenderController')

const express = require('express') 
const app = express.Router()

//Get artist
app.get('/getTrack', recommenderController.getTrack)


module.exports = app