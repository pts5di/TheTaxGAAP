module.exports = (req, res) => {

  if(req.session.userId) {
    console.log("Inside newAnswer.js ID: " + req.body.thisQuestionID)
    res.render('newAnswer', {createPost: true, thisQuestionID: req.body.thisQuestionID, userid: loggedIn});
  } else {
    res.redirect('/auth/login')
  }

}





/*
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