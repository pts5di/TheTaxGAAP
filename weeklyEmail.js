const setupMongo = require('./mongo')
setupMongo();

const Question = require('./models/Question')
var nodemailer = require('nodemailer');
const { EMAIL_PASSWORD } = require('./utils/emailPassword');

async function getPosts() {
    let currentWeek = new Date()

    currentWeek.setDate(currentWeek.getDate() - 7)
    const result = await Question.find({ datePosted: { $gt: currentWeek } })
    const questions = Array.isArray(result) ? result : [result];
    return questions;
}

function postsToText(questions) {
    const questionStrings = [];
    var emailBody = "";
    for (const question of questions) {
        let questionString = "Title: " + question.title + "\n Body: " + question.body;
        questionStrings.push(questionString);
    }

    if (questionStrings.length == 0) {
        emailBody = "No new posts this week!";
    }
    else {
        emailBody = questionStrings.join("\n \n");
    }
    return emailBody;

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

        const result = await transporter.sendMail(mailOptions);
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
        },
        tls: { rejectUnauthorized: false }
    });
    return await _sendEmail(address, subject, body, transporter);
}

async function _runScript() {
    const questions = await getPosts()
    const emailBody = postsToText(questions);
    await sendEmail("jmcdon35@uic.edu", "Weekly Posts on TheTaxGAAP", emailBody);

}

async function runScript() {
    let error = null;
    try {
        await _runScript();
    } catch (e) {
        error = e;
        console.error("Error in weeklyEmail#runScript(): ", e);
        process.exit(1);
    }
    finally {
        if (!!error) {
            console.log("There is an error");
            process.exit(-1);
        }

        console.log("Successfully sent weekly email!");
        process.exit(0);

    }
}

if (require.main === module) {
    runScript()
}

module.exports = { getPosts, postsToText, _sendEmail, sendEmail }

