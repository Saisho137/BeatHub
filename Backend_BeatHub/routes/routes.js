'use strict'

const recommenderController = require('../controllers/recommenderController')
const statisticsController = require('../controllers/statisticsController')

const express = require('express')
const app = express.Router()

//Recommender
app.get('/getArtist/:artist', recommenderController.getArtist)
app.get('/getTrack/:track', recommenderController.getTrack)
app.get('/getGenre', recommenderController.getGenre)

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

//Statistics
app.get("/stats/:time?", statisticsController.getStats)

module.exports = app