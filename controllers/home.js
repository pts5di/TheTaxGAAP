const Question = require('../models/Question')

module.exports = async (req,res) =>{
    const questions = await Question.find({}).populate('userid');   
    console.log(req.session)
    res.render('index',{
        questions
    })
}