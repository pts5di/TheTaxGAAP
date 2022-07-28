const Question = require('../models/Question')

function netVotes(question) {
    let voteSum = 0;
    for(let i = 0; i < question.votes.length; i++){
        voteSum += question.votes[i].voteValue;
    }
    return voteSum;
}
module.exports = async (req,res) =>{
    var loggedIn = req.session.userId;
    const concatenatedString = req.body.first_term + "  " + req.body.second_term + " " + req.body.third_term;
    const questions = await Question.find({$text: {$search: concatenatedString } }).populate('userid');
    for (let i = 0; i < questions.length; i++) {
        questions[i].upvotes = netVotes(questions[i]);
    }
    questions.sort(function sortFunction(questionLow, questionHigh) {
        return questionHigh.upvotes - questionLow.upvotes;
    })
    res.render('displayPosts', {
        questions
    })
}