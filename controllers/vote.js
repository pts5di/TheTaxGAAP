const Users = require('../models/User')
const Questions = require('../models/Question');
const Vote = require('../models/Vote');
const { count } = require('console');

function countVotes(thisQuestion) {
    thisQuestion.populate("votes");
    let voteSum = 0;
    for(let i = 0; i < thisQuestion.votes.length; i++){
        voteSum += thisQuestion.votes[i].voteValue;
    }
    return voteSum;
}

module.exports = async (req, res) => {

    console.log("Inside Vote!")
    console.log("loggedIn: " + loggedIn)
    console.log(req.body)

    var revisedScore;

    if (req.body.action == "upvoteQuestion") {
        console.log("Inside upvoteQuestion")
        await Vote.create({userId: loggedIn, itemId: req.body.questionID, itemType: "Question", voteValue: 1});
        const thisQuestion = await Questions.findById(req.body.questionID);
        revisedScore = countVotes(thisQuestion);

        // Update User's Statistics
        const relevantUserID = thisQuestion.userid;
        const relevantUser = await Users.findById(relevantUserID);
        askedScore = relevantUser.askedscore;
        askedScore++;
        await Users.updateOne({ _id : relevantUser }, {$set : {askedscore : askedScore}})

    }

    if (req.body.action == "downvoteQuestion") {
        console.log("Inside downvoteQuestion")
        await Vote.create({userId: loggedIn, itemId: req.body.questionID, itemType: "Question", voteValue: -1});
        const thisQuestion = await Questions.findById(req.body.questionID);
        revisedScore = countVotes(thisQuestion);

        // Update User's Statistics
        const relevantUserID = thisQuestion.userid;
        const relevantUser = await Users.findById(relevantUserID);
        askedScore = relevantUser.askedscore;
        askedScore--;
        await Users.updateOne({ _id : relevantUser }, {$set : {askedscore : askedScore}})

        // Notify the Individual Who Posted the Question
        console.log("Start to notify poster")
        const userWhoPostedQuestion = await Users.findOne({_id : relevantUserID})
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
            //BCC email to sender; an inbox rule can be configured
            //to automatically filter these to Sent Items (or other outbox folder)
            bcc: sender,
            subject: 'TheTaxGaap : Someone Downvoted Your Question.',
            text: 'You should check the site at www.thetaxgaap.com.  ' + relevantUser.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    
    // Upvote Answer
    if (req.body.action == "upvoteAnswer") {
        console.log("Inside upvoteAnswer")
        const thisQuestion = await Questions.findById(req.body.questionID);
        console.log("After thisQuestion")
        const arrayIndex = req.body.index;
        const thisAnswer = thisQuestion.answers[arrayIndex];
        await Vote.create({userId: loggedIn, itemId: thisAnswer._id, itemType: "Answer", voteValue: 1});
        revisedScore = countVotes(thisAnswer);
        console.log(revisedScore);
        console.log("After update answer")
        
        // Upgrade Person who Answered's Stats
        console.log("Upgrade User's Stats")
        const respondentID = thisAnswer.respondentID;
        console.log("PersonWhoAnsweredID: " + respondentID)
        const thisRespondent = await Users.findById(respondentID);
        console.log("Update answerscore")
        var currentAnswerScore = thisRespondent.answerscore;
        currentAnswerScore++;
        
        console.log("Update rank")
        var respondentRank = thisRespondent.rank;
        respondentRank++;
        await Users.updateOne({ _id : respondentID}, {$set : {answerscore : currentAnswerScore, rank : respondentRank}});

        // Notify the Individual Who Posted the Answer
        try {

            // Now Send Email to the Person who Answered
            console.log("Start to notify respondent")
            const user_email = thisRespondent.email
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
                bcc: sender,
                subject: 'TheTaxGaap : Congratulations! Someone Upvoted Your Answer',
                text: 'Hello ' + thisRespondent.username + ':/r' + 'You should check the site at thetaxgaap.com.  Someone just upvoted an answer you provided to a question.  You can check your profile by clicking the profile tab in the menu.  Keep up the good work!'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch {

            console.log("WARNING: Email was not sent on upvote.")

        }
    }

    // Downvote Answer
    if (req.body.action == "downvoteAnswer") {
        console.log("Inside downvoteAnswer")
        const thisQuestion = await Questions.findById(req.body.questionID);
        console.log("After thisQuestion")
        const arrayIndex = req.body.index;
        const thisAnswer = thisQuestion.answers[arrayIndex];
        await Vote.create({userId: loggedIn, itemId: thisAnswer._id, itemType: "Answer", voteValue: 1});
        revisedScore = countVotes(thisAnswer);
        console.log(revisedScore);
        console.log("After update answer")

        // Downgrade User's Stats
        console.log("Downgrade User's Stats")
        const respondentID = thisAnswer.respondentID;
        console.log("RespondentID: " + respondentID)
        const thisRespondent = await Users.findById(respondentID);
        console.log("Update answerscore")
        var currentAnswerScore = thisRespondent.answerscore;
        currentAnswerScore--;
        console.log("Update rank")
        var respondentRank = thisRespondent.rank;
        respondentRank--;
        await Users.updateOne({ _id : respondentID}, {$set : {answerscore : currentAnswerScore, rank : respondentRank}});

        // Notify the Individual Who Posted the Answer
        try {
            console.log("Start to notify respondent")
            const user_email = thisRespondent.email
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
                subject: 'TheTaxGaap : Someone Downvoted Your Answer',
                text: 'You should check the site at www.thetaxgaap.com.  ' + thisRespondent.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale + ' Do not get discouraged.  Review the feedback you received and consider it the next time you post. Well crafted questions are ones that are drafted after thorough research has already been performed.  They contain sufficient information to allow '
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch {

            console.log("WARNING: Email was not sent on downvote.")

        }
        
    }


    console.log("Revised Score: " + revisedScore);

    res.json({"revisedScore" : revisedScore});
}