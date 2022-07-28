const { typeOf } = require('mathjs');
const Question = require('../models/Question')

function netVotes(answer) {
    let voteSum = 0;
    for(let i = 0; i < answer.votes.length; i++){
        voteSum += answer.votes[i].voteValue;
    }
    return voteSum;
}

module.exports = async (req,res) =>{

    console.log("You are inside displayAnswers controller!")
    const thisQuestionID = req.body.questionID;
    // console.log("req.body.questionID: " + thisQuestionID)
 
    const questionBody = await Question.findOne({"_id" : thisQuestionID}, {"answers": 1}).populate("answers.votes");  
    const answers = questionBody.answers
    for (let i = 0; i < answers.length; i++) {
        answers[i].upvotes = netVotes(answers[i]);
    }
    answers.sort(function sortFunction(answersLow, answersHigh) {
        return answersHigh.upvotes - answersLow.upvotes;
    })
    // console.log("inside else ID: " + thisQuestionID)
    // console.log("answers: " + answers)
    res.render('displayAnswers', {
        thisQuestionID,
        answers
    })
 }