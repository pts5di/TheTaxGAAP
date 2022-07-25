module.exports = (req, res) => {

  if(req.session.userId) {
    console.log("Inside newAnswer.js ID: " + req.body.thisQuestionID)
    res.render('newAnswer', {createPost: true, thisQuestionID: req.body.thisQuestionID, userid: loggedIn});
  } else {
    res.redirect('/auth/login')
  }

}
