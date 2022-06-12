const Question = require('../models/Question')

module.exports = async (req,res) =>{
    const question = await Question.findOne({});
    res.render('displayPosts',{
        question
    })
}