const { typeOf } = require('mathjs');
const Question = require('../models/Question')


module.exports = async (req,res) =>{

    console.log("You are inside displayAnswers controller!")
    const thisQuestionID = req.body.questionID;
    console.log("req.body.questionID: " + thisQuestionID)
 
    if (thisQuestionID == 0) {
        res.redirect("index");
    } else {    
        const questionBody = await Question.findOne({"_id" : thisQuestionID}, {"answers": 1});   
        const answers = questionBody.answers
        console.log("inside else ID: " + thisQuestionID)
        console.log("answers: " + answers)
      //  console.log("Answers[0]: " + answers[0])
      //  console.log("Answers[1]: " + answers[1])
      //  console.log("Answers[2]: " + answers[2])        
      //  console.log("Answers[0].respondent" + answers[0].respondent)
      //  console.log("Answers[0]._id: " + answers[0]._id)
        res.render('displayAnswers', {
            thisQuestionID,
            answers
        })
    }
}