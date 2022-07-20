const { typeOf } = require('mathjs');
const Question = require('../models/Question')


module.exports = async (req,res) =>{

    console.log("You are inside displayAnswers controller!")
    const thisQuestionID = req.body.questionID;
    console.log("req.body.questionID: " + thisQuestionID)
 
    const questionBody = await Question.findOne({"_id" : thisQuestionID}, {"answers": 1});   
    const answers = questionBody.answers
    answers.sort(function sortFunction(answersLow, answersHigh) {
        return answersHigh.upvotes - answersLow.upvotes;
    })
    console.log("inside else ID: " + thisQuestionID)
    console.log("answers: " + answers)
    res.render('displayAnswers', {
        thisQuestionID,
        answers
    })
 }