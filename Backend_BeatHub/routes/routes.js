'use strict'

const recommenderController = require('../controllers/recommenderController')
const statisticsController = require('../controllers/statisticsController')
const userController = require('../controllers/userController')

const express = require('express')
const app = express.Router()

//Artist
app.get('/getArtist/:artist', recommenderController.getArtist)
app.get('/getSpecificArtist/:id', recommenderController.getSpecificArtist)
app.get('/getSimilarArtist/:id', recommenderController.getSimilarArtist)
app.get('/getArtistTopTracks/:id', recommenderController.getArtistTopTracks)
//Track
app.get('/getTrack/:track', recommenderController.getTrack)
app.get('/getSpecificTrack/:id', recommenderController.getSpecificTrack)
app.get('/getSimilarTracks/:idArtist/:idTrack', recommenderController.getSimilarTrack)
//Genre
app.get('/getGenre', recommenderController.getGenre)
app.get('/getTopTracksGenre/:genre', recommenderController.getTopTracksGenre)
app.get('/getTopArtistGenre/:genre', recommenderController.getTopArtistGenre)
//Save on spotify
app.post('/createPlaylist', recommenderController.createPlaylist)

//Statistics
app.get("/stats/:time?", statisticsController.getStats)
app.get('/getUserData', userController.getUserData)

module.exports = app