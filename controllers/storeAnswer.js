const Users = require('../models/User')
const Question = require('../models/Question');


/*
*  TO BE REVISED
*/

module.exports = async (req, res) => {

    console.log("Inside storeAnswer.js")

    // Update the User's Statistics
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
    await Question.updateOne({_id: req.body.thisQuestionID}, {"$push": {"answers" : {respondent: thisUser.username, respondentID:loggedIn, text: bodyPlainText, upvotes:0, date: currentDate}}});
    res.redirect("/");
 }


/*   NEED TO ADD E-MAIL ADDITIONS 
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/