'use strict'

const recommenderController = require('../controllers/recommenderController')

const express = require('express')
const app = express.Router()

//Artist
app.get('/getSpecificArtist/:id', recommenderController.getSpecificArtist)
app.get('/getSimilarArtist/:id', recommenderController.getSimilarArtist)
app.get('/getArtistTopTracks/:id', recommenderController.getArtistTopTracks)
//Track
app.get('/getSpecificTrack/:id', recommenderController.getSpecificTrack)
app.get('/getSimilarTracks/:idArtist/:idTrack', recommenderController.getSimilarTrack)
//Genre
app.get('/getTopTracksGenre/:genre', recommenderController.getTopTracksGenre)
app.get('/getTopArtistGenre/:genre', recommenderController.getTopArtistGenre)

module.exports = app