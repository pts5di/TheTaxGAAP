const crypto = require('node:crypto');
const setupMongo = require('./mongo')
setupMongo();
const User = require('./models/User')
const Question = require('./models/Question')
var nodemailer = require('nodemailer');
const { EMAIL_PASSWORD } = require('./utils/emailPassword');

const { JSDOM } = require('jsdom');

async function getUsers() {
    const subscribedUsers = User.find({
        $or: [{ unsubscribedFromMonthly: { $exists: false } },
        { unsubscribedFromMonthly: false }]
    });
    return subscribedUsers;
}

async function getTopics() {
    const recentTopics = Question.find().sort({ datePosted: -1 }).limit(3);

    return recentTopics;
}

const MAX_BODY_SNIPPET_LENGTH = 30;
function questionToTruncatedText(question) {
    const dom = new JSDOM(`<!DOCTYPE html>${question.body}`);
    const text = dom.window.document.body.textContent;
    return text.length <= MAX_BODY_SNIPPET_LENGTH ? text : `${text.slice(0, MAX_BODY_SNIPPET_LENGTH - 1)}…`;
}
function postsToText(questions) {
    const questionStrings = [];
    for (const question of questions) {
        let questionString = "<h3>" + question.title + "</h3><p>" + questionToTruncatedText(question) + "</p>";
        questionStrings.push(questionString);
    }

    return `<h2>Recent Posts</h2>${questionStrings.join("<br>")}`;

}

function getUserStatistics(user) {
    var userStats = "<h2>Your User Statistics</h2>";
    userStats += `<div><strong>Questions Asked: </strong> ${user.asked} </div>`;
    userStats += `<div><strong>Questions Answered: </strong> ${user.answered} </div>`;
    userStats += `<div><strong>Question Upvotes: </strong> ${user.askedscore} </div>`;
    userStats += `<div><strong>Answer Upvotes: </strong> ${user.answeredscore} </div>`;
    return userStats;
}

async function _sendEmail(address, subject, body, transporter) {
    try {
        var sender = 'thetaxgaapadmin@thetaxgaap.com';

        var mailOptions = {
            from: sender,
            to: address,
            subject: subject,
            html: body,
        };


        const result = await transporter.sendMail(mailOptions);
        //console.log(JSON.stringify(mailOptions, undefined, 2));
        console.log('Email sent: ' + result.response);


    } catch (e) {
        console.log(`WARNING: Email was not sent with subject "${subject}": \n${e}`)
    }
}

async function sendEmail(address, subject, body) {
    var transporter = nodemailer.createTransport({
        port: 25,
        tls: {
            rejectUnauthorized: false,
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
        const emailBody = [
            "<h1>Hello from The Tax GAAP!</h1>",
            "<p>This is your monthly status email showing you the latest messages that have been posted and your current statistics.</p>",
            "<p>If you need a refresher on how to use the site, there is a video posted to the landing page.</p>",
            postsToText(questions),
            getUserStatistics(users[i]),
            "<p> We hope you enjoy using the site.</p>",
            `<small><a href="https://thetaxgaap.com/unsubscribe?email=${users[i].email}&secret=${users[i].unsubscribeSecret}">Unsubscribe</a></small>`
        ].join("\n");
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

module.exports = { getTopics, postsToText, _sendEmail, sendEmail }

