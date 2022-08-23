const Users = require('../models/User')
const Question = require('../models/Question');

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
    console.log("Updating the Question Database : " + req.body.thisQuestionID)
    // let bodyPlainText = req.body.body.replace(/<\/?[^>]+(>|$)/g, "");  // MAY BE DELETED IN FUTURE
    // bodyPlainText = bodyPlainText.replace(/&(nbsp|amp|quot|lt|gt);/g," ");  // MAY BE DELETED IN FUTURE
    // bodyPlainText = req.body.body; // This is when we fix formatting issue!
    const thisQuestion = await Question.findById({_id: req.body.thisQuestionID});
    let currentDate = new Date();
    console.log("after current date")
    await Question.updateOne({_id: req.body.thisQuestionID}, {"$push": {"answers" : {respondent: thisUser.username, respondentID:loggedIn, text: req.body.body, upvotes:0, date: currentDate}}});

    // Notify the Individual Who Posted the Question
    try {
      console.log("Start to notify poster")
      user_id = thisQuestion.userid;
      console.log("User_Id: " + user_id)
      console.log(typeof(user_id))
      const userWhoPostedQuestion = await Users.findOne({_id : user_id})
      console.log("found userWhoPostedQuestion")
      const user_email = userWhoPostedQuestion.email
      var nodemailer = require('nodemailer');
 
      var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587, // secure SMTP
        auth: {
          user: "admin@thetaxgaap.com",
          pass: require("fs").readFileSync("/home/thetaxgaap/PASSWORD", "utf8").trim()
        },
        tls: { rejectUnauthorized: false }
      });
      
      var sender = 'thetaxgaapadmin@thetaxgaap.com';

      var mailOptions = {
        from: sender,
        to: user_email,
        // BCC email to sender; an inbox rule can be configured 
        // to automatically filter these to Sent Items (or other outbox folder)
        bcc: sender,
        subject: 'TheTaxGaap : Someone Answered Your Question!',
        text: 'Congratulations! ' + thisUser.username + ' just tried to answer your question.  You should check the site at www.thetaxgaap.com.  You can review their answer and upvote or downvote it.  Your upvotes and downvotes impact the profile for ' + thisUser.username + '.  You can also check your own rank and status by checking the profile tab in the menu.'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
      }
      });
    } catch {
      console.log("WARNING: Email was not sent on storing of answer.")
    }

    // Now Complete - Redirect to Index
    res.redirect("/");
 }




