'use strict'

const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect('mongodb://127.0.0.1:27017/BeatHubDB')
    .then(
        () => {
            console.log("Succesful connection with DDBB.")
            app.listen(8698, function () {
                console.log("Server has been Initilized.")
            })
        })
    .catch((err) => {
        console.log("Failed to connect to DDBB.")
        console.log(err)
    })