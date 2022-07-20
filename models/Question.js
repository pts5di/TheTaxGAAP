const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AnswerSchema = new Schema ({
    respondentID: mongoose.Schema.Types.ObjectId,
    respondent: String,
    text: String,
    date: Date,
    upvotes: Number
})

const QuestionSchema = new Schema ({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    title: String,
    keyword1: String,
    keyword2: String,
    keyword3: String,
    body: String,
    upvotes: {
        type: Number,
        default: 0
    },
    datePosted: {
        type: Date,
        default: new Date()
    },
    answers: [AnswerSchema]
});

QuestionSchema.index({title: "text", body: "text", keyword1: "text", keyword2: "text", keyword3: "text"});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question