const crypto = require('node:crypto');
const setupMongo = require('./mongo')
setupMongo();
const User = require('./models/User')
const Question = require('./models/Question')
var nodemailer = require('nodemailer');
const { EMAIL_PASSWORD } = require('./utils/emailPassword');

async function getUsers() {
    const subscribedUsers = User.find({
        $or: [{ unsubscribedFromMonthly: { $exists: false } },
        { unsubscribedFromMonthly: false }]
    });
    return subscribedUsers;
}

async function getTopics() {
    const recentTopics = Question.find().sort({ datePosted: -1 }).limit(5);

    return recentTopics;
}

async function getPosts() {
    let currentWeek = new Date()

    currentWeek.setDate(currentWeek.getDate() - 7)
    const result = await Question.find({ datePosted: { $gt: currentWeek } })
    const questions = Array.isArray(result) ? result : [result];
    return questions;
}

function postsToText(questions) {
    const questionStrings = [];
    for (const question of questions) {
        let questionString = "Title: " + question.title + "\n Body: " + question.body;
        questionStrings.push(questionString);
    }

    return questionStrings.join("\n \n");

}

function getUserStatistics(user) {
    var userStats = "Your User Statistics:\n";
    userStats += "Questions Asked: " + user.asked + "\n";
    userStats += "Questions Answered: " + user.answered + "\n";
    userStats += "Question Upvotes: " + user.askedscore + "\n";
    userStats += "Answer Upvotes: " + user.answeredscore + "\n";
    return userStats;
}

async function _sendEmail(address, subject, body, transporter) {
    try {
        var sender = 'thetaxgaapadmin@thetaxgaap.com';

        var mailOptions = {
            from: sender,
            to: address,
            subject: subject,
            text: body,
        };

        //const result = await transporter.sendMail(mailOptions);
        console.log(mailOptions);
        console.log('Email sent: ' + result.response);

    } catch (e) {
        console.log(`WARNING: Email was not sent with subject "${subject}": \n${e}`)
    }
}

async function sendEmail(address, subject, body) {
    var transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net', // Office 365 server
        port: 465, // secure SMTP
        auth: {
            user: 'admin@thetaxgaap.com',
            pass: EMAIL_PASSWORD

        }
    });
    return await _sendEmail(address, subject, body, transporter);
}

async function _runScript() {
    const questions = await getTopics()

    const users = await getUsers();
    for (let i = 0; i < users.length; i++) {
        if (!users[i].unsubscribeSecret) {
            users[i].unsubscribeSecret = crypto.randomBytes(64).toString('base64url');
            await users[i].save();
        }
        const emailBody = postsToText(questions) + getUserStatistics(users[i]) + `\n <a href="https://thetaxgaap.com/unsubscribe?email=${users[i].email}&secret=${users[i].unsubscribeSecret}">Unsubscribe</a>`;
        await sendEmail(users[i].email, "Newest Topics on TheTaxGAAP", emailBody);
    }


}

async function runScript() {
    let error = null;
    try {
        await _runScript();
    } catch (e) {
        error = e;
        console.error("Error in monthlyEmail#runScript(): ", e);
        process.exit(1);
    }
    finally {
        if (!!error) {
            console.log("There is an error");
            process.exit(-1);
        }

        console.log("Successfully sent monthly email!");
        process.exit(0);

    }
}

if (require.main === module) {
    runScript()
}

module.exports = { getPosts, postsToText, _sendEmail, sendEmail }

