const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AnswerSchema = new Schema ({
    respondentID: mongoose.Schema.Types.ObjectId,
    respondent: String,
    text: String,
    date: Date,
})
AnswerSchema.virtual('votes', {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'itemId'
});

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
    datePosted: {
        type: Date,
        default: new Date()
    },
    answers: [AnswerSchema]
});
QuestionSchema.virtual('votes', {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'itemId'
});

QuestionSchema.index({title: "text", body: "text", keyword1: "text", keyword2: "text", keyword3: "text"});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question
