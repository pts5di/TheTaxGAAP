const Users = require('../models/User')
const Questions = require('../models/Question');

module.exports = async (req, res) => {

    console.log("Inside Vote!")
    console.log("loggedIn: " + loggedIn)
    console.log(req.body)

    var revisedScore;

    if (req.body.action == "upvoteQuestion") {
        console.log("Inside upvoteQuestion")
        const thisQuestion = await Questions.findById(req.body.questionID);
        revisedScore = thisQuestion.upvotes;
        revisedScore++;
        await Questions.updateOne({ _id : thisQuestion._id}, {$set : {upvotes : revisedScore}})    
    }

    if (req.body.action == "downvoteQuestion") {
        console.log("Inside downvoteQuestion")
        const thisQuestion = await Questions.findById(req.body.questionID);
        revisedScore = thisQuestion.upvotes;
        revisedScore--;
        await Questions.updateOne({ _id : thisQuestion._id}, {$set : {upvotes : revisedScore}})    
    }

    if (req.body.action == "upvoteAnswer") {
        console.log("Inside upvoteAnswer")
        const thisQuestion = await Questions.findById(req.body.questionID);
        console.log("After thisQuestion")
        const arrayIndex = req.body.index;
        revisedScore = thisQuestion.answers[arrayIndex].upvotes;
        console.log(revisedScore);
        revisedScore++;
        thisQuestion.answers[arrayIndex].upvotes = revisedScore;
        console.log("After update answer")
        thisQuestion.save(function (err) {
            console.log(err.message)
        })        
    }

    if (req.body.action == "downvoteAnswer") {
        console.log("Inside downvoteAnswer")
        const thisQuestion = await Questions.findById(req.body.questionID);
        console.log("After thisQuestion")
        const arrayIndex = req.body.index;
        revisedScore = thisQuestion.answers[arrayIndex].upvotes;
        console.log(revisedScore);
        revisedScore--;
        thisQuestion.answers[arrayIndex].upvotes = revisedScore;
        console.log("After update answer")
        thisQuestion.save(function (err) {
            console.log(err.message)
        })                
    }


    console.log("Revised Score: " + revisedScore);

    res.json({"revisedScore" : revisedScore});
}