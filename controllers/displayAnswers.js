const { typeOf } = require('mathjs');
const Question = require('../models/Question')

function netVotes(answer) {
    if (!answer.votes) {
        return 0;
    }
    let voteSum = 0;
    for(let i = 0; i < answer.votes.length; i++){
        voteSum += answer.votes[i].voteValue;
    }
    return voteSum;
}

function userVote(answer) {
    if (!answer.votes) {
        return 0;
    }
    for(let i = 0; i < answer.votes.length; i++){
        if (answer.votes[i].userId == loggedIn) {
            return answer.votes[i].voteValue;
        }
    }
}

module.exports = async (req,res) =>{

    console.log("You are inside displayAnswers controller!")
    const thisQuestionID = req.body.questionID;
    // console.log("req.body.questionID: " + thisQuestionID)
 
    const questionBody = await Question.findOne({"_id" : thisQuestionID}, {"answers": 1}).populate("answers.votes");  
    const answers = questionBody.answers || []
    let userCurrentVote = 0;
    for (let i = 0; i < answers.length; i++) {
        answers[i].upvotes = netVotes(answers[i]);
        answers[i].userVote = userVote(answers[i]);
    }
    answers.sort(function sortFunction(answersLow, answersHigh) {
        return answersHigh.upvotes - answersLow.upvotes;
    })
    // console.log("inside else ID: " + thisQuestionID)
    // console.log("answers: " + answers)
    res.render('displayAnswers', {
        thisQuestionID,
        answers,
    })
 }