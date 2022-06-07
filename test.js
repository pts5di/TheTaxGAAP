const mongoose = require('mongoose')
const Question = require('./models/Question')

mongoose.connect('mongodb://127.0.0.1:27017/GregLimDB', {useNewUrlParser: true})

Question.create ({
    author: 'John D. McDonald',
    body: 'This is the body of the question.',
    answers: [{
        respondent: 'Vlad the Impaler'
    }]
}, (error, question) => {
    console.log(error, question)
})