const Users = require('../models/User')
const Questions = require('../models/Question');
const Vote = require('../models/Vote');

function countVotes(votes) {
    if (!votes) {
        return 0;
    }
    let voteSum = 0;
    for(let i = 0; i < votes.length; i++){
        voteSum += votes[i].voteValue;
    }
    return voteSum;
}

function getItemId(req) {
    if (req.body.type == "Question") {
        return req.body.questionID;
    } else if (req.body.type == "Answer") {
        return req.body.answerID;
    } else {
        throw new Error(`Unexpected item type for vote when getting item ID: ${req.body.type}`)
    }
}

function getVoteValue(req) {
    if (req.body.action == "upvote") {
        return 1;
    } else if (req.body.action == "downvote") {
        return -1;
    } else if (req.body.action == "cancel") {
        return 0;
    } else {
        throw new Error(`Unexpected voting action: ${req.body.action}`)
    }
}

async function fetchRelevantItem(req) {
    const question = await Questions.findById(req.body.questionID).populate("answers answers.votes");
    if (req.body.type == "Question") {
        return question;
    }
    if (req.body.type == "Answer") {
        const answer = (question.answers || []).find(e => e._id == req.body.answerID);
        return answer;
    }

    throw new Error(`Unexpected item type for vote when fetching the relevant item: ${req.body.type}`);
}

function getRelevantUserIdFromItem(req, item) {
    if (req.body.type == "Question") {
        return item.userid;
    }
    if (req.body.type == "Answer") {
        return item.respondentID;
    }

    throw new Error(`Unexpected item type for vote when fetching the scoring user: ${req.body.type}`);
}

async function updateRelevantUserScore(req, item, voteValue) {
    const relevantUserId = getRelevantUserIdFromItem(req, item);
    const relevantUser = await Users.findById(relevantUserId);
    if (req.body.type == "Question") {
        relevantUser.askedscore += voteValue;
    } else if (req.body.type == "Answer") {
        relevantUser.answerscore += voteValue;
        relevantUser.rank += voteValue;
    } else {
        throw new Error(`Unexpected item type for vote when incrementing relevant user score: ${req.body.type}`)
    }

    await relevantUser.save();

    
    if (req.body.action == "downvote" && req.body.type == "Question") {
        notifyRelevantUser(
            relevantUser, 
            'TheTaxGaap : Someone Downvoted Your Question.',
            'You should check the site at www.thetaxgaap.com.  ' + relevantUser.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale
        );
    } else if (req.body.action == "upvote" && req.body.type == "Answer") {
        notifyRelevantUser(
            relevantUser,
            'TheTaxGaap : Congratulations! Someone Upvoted Your Answer',
            'You should check the site at www.thetaxgaap.com.  ' + relevantUser.username + ' just upvoted your question.  You can check your profile by clicking the profile tab in the menu.  Keep up the good work!'
        );
    } else if (req.body.action == "downvote" && req.body.type == "Answer") {
        notifyRelevantUser(
            relevantUser,
            'TheTaxGaap : Someone Downvoted Your Answer',
            'You should check the site at www.thetaxgaap.com.  ' + relevantUser.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale + ' Do not get discouraged.  Review the feedback you received and consider it the next time you post. Well crafted questions are ones that are drafted after thorough research has already been performed.  They contain sufficient information to allow '
        );
    }
}

function notifyRelevantUser(user, subject, text) {
    try {
        const user_email = user.email
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: 'admin',
                pass: require("fs").readFileSync("/home/thetaxgaap/PASSWORD", "utf8").trim()
            }
        });

        var sender = 'thetaxgaapadmin@thetaxgaap.com';

        var mailOptions = {
            from: sender,
            to: user_email,
            //BCC email to sender; an inbox rule can be configured
            //to automatically filter these to Sent Items (or other outbox folder)
            bcc: sender,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch(e) {
        console.log(`WARNING: Email was not sent with subject "${subject}": \n${e}`)
    }
    
    // Upvote Answer
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
        await thisQuestion.save(function (err) {
            console.log(err)
        })      
        
        // Upgrade Person who Answered's Stats
        console.log("Upgrade User's Stats")
        const respondentID = thisQuestion.answers[arrayIndex].respondentID;
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
        revisedScore = thisQuestion.answers[arrayIndex].upvotes;
        console.log(revisedScore);
        revisedScore--;
        thisQuestion.answers[arrayIndex].upvotes = revisedScore;
        console.log("After update answer")
        await thisQuestion.save(function (err) {
            console.log(err)
        })              
        
        // Downgrade User's Stats
        console.log("Downgrade User's Stats")
        const respondentID = thisQuestion.answers[arrayIndex].respondentID;
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

            var mailOptions = {
                from: 'admin@thetaxgaap.com',
                to: user_email,
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
}

module.exports = async (req, res) => {

    console.log("Inside Vote!");
    console.log("loggedIn: " + loggedIn);
    console.log(req.body);

    const itemId = getItemId(req);
    const voteValue = getVoteValue(req);

    let vote = await Vote.findOne({userId: loggedIn, itemId: itemId});
    if (!vote) {
        // no vote for this user on this item, so create one
        vote = new Vote({userId: loggedIn, itemId: itemId, itemType: req.body.type, voteValue: voteValue});
    } else if (vote.voteValue != voteValue) {
        // the user is changing their vote
        vote.voteValue = voteValue;
    }
    await vote.save();

    const relevantItem = await fetchRelevantItem(req);
    await updateRelevantUserScore(req, relevantItem, voteValue);


    const revisedScore = countVotes(relevantItem.votes);
    console.log("Revised Score: " + revisedScore);

    res.json({"revisedScore" : revisedScore, "newVoteValue": voteValue});
}