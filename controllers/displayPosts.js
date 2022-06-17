const Question = require('../models/Question')

module.exports = async (req,res) =>{
    const concatenatedString = req.body.first_term + "  " + req.body.second_term + " " + req.body.third_term + " " + req.body.fourth_term + " " + req.body.fifth_term;
    const questions = await Question.find({$text: {$search: concatenatedString } }).populate('userid');
    res.render('displayPosts',{
        questions
    })
}