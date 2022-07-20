const Question = require('../models/Question')

module.exports = async (req,res) =>{
    var loggedIn = req.session.userId;
    const concatenatedString = req.body.first_term + "  " + req.body.second_term + " " + req.body.third_term;
    const questions = await Question.find({$text: {$search: concatenatedString } }).populate('userid').sort({upvotes: -1});
    res.render('displayPosts', {
        questions
    })
}