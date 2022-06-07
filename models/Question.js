const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const QuestionSchema = new Schema ({
    username: String,
    title: String,
    keyword1: String,
    keyword2: String,
    keyword3: String,
    body: String,
    upvotes: Number,
    datePosted: {
        type: Date,
        default: new Date()
    },
    answers: [{
        respondent: String,
        text: String,
        upvotes: Number
    }]
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question