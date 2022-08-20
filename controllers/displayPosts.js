const Question = require('../models/Question')

function netVotes(question) {
    if (!question.votes) {
        return 0;
    }

    let voteSum = 0;
    for (let i = 0; i < question.votes.length; i++) {
        voteSum += question.votes[i].voteValue;
    }
    return voteSum;
}

function userVote(question) {
    if (!question.votes) {
        return 0;
    }
    for(let i = 0; i < question.votes.length; i++){
        if (question.votes[i].userId == loggedIn) {
            return question.votes[i].voteValue;
        }
    }
}

module.exports = async (req,res) =>{
    var loggedIn = req.session.userId;
    const concatenatedString = req.body.first_term + "  " + req.body.second_term + " " + req.body.third_term;
    const questions = await Question.find({$text: {$search: concatenatedString } }).populate('userid');
    let userCurrentVote = 0;
    for (let i = 0; i < questions.length; i++) {
        questions[i].upvotes = netVotes(questions[i]);
        questions[i].userVote = userVote(questions[i]);
    }
    questions.sort(function sortFunction(questionLow, questionHigh) {
        return questionHigh.upvotes - questionLow.upvotes;
    })
    res.render('displayPosts', {
        questions,
        userCurrentVote,
    })
}