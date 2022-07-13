const Users = require('../models/User')
const Question = require('../models/Question');


/*
*  TO BE REVISED
*/

module.exports = async (req, res) => {

    console.log("Inside storeAnswer.js")

    // Update the Respondent's Statistics
    console.log("Updating the Respondent's Statistics")
    const thisUser = await Users.findById(loggedIn)
    const newAnswered = thisUser.answered + 1
    const newRank = thisUser.rank + 1
    await Users.updateOne({ username : thisUser.username}, {$set : {answered : newAnswered, rank : newRank}})
    console.log("req.method: " + req.method)

    // Update the Question Database
    console.log("Body: " + req.body.body);
    console.log("Updating the Question Database : " + req.body.thisQuestionID)
    let bodyPlainText = req.body.body.replace(/<\/?[^>]+(>|$)/g, "");
    bodyPlainText = bodyPlainText.replace(/&(nbsp|amp|quot|lt|gt);/g," ");
    const thisQuestion = await Question.findById({_id: req.body.thisQuestionID});
    let currentDate = new Date();
    console.log("after current date")
    await Question.updateOne({_id: req.body.thisQuestionID}, {"$push": {"answers" : {respondent: thisUser.username, respondentID:loggedIn, text: bodyPlainText, upvotes:0, date: currentDate}}});

    // Notify the Individual Who Posted the Question
    console.log("Start to notify poster")
    user_id = thisQuestion.userid;
    console.log("User_Id: " + user_id)
    console.log(typeof(user_id))
    const userWhoPostedQuestion = await Users.findOne({_id : user_id})
    console.log("found userWhoPostedQuestion")
    const user_email = userWhoPostedQuestion.email
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'AOL',
      auth: {
        user: 'mcdnjmcd@aol.com',
        pass: 'TRIDENT5'
      }
    });

    var mailOptions = {
      from: 'mcdnjmcd@aol.com',
      to: user_email,
      subject: 'TheTaxGaap : Someone Answered Your Question!',
      text: 'You should check the site.  ' + thisUser.username + ' just tried to answer your question.  You can review their answer and upvote or downvote it.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
     }
    });

    // Now Complete - Redirect to Index
    res.redirect("/");
 }




