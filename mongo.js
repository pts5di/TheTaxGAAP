// File to connect to MongoDB and set up relevant indices.
const mongoose = require('mongoose')
require('./models/Question')
require('./models/User')

function setupMongo() {
    mongoose.connect('mongodb://127.0.0.1:27017/GregLimDB', {useNewUrlParser: true})
    mongoose.syncIndexes();
}

module.exports = setupMongo