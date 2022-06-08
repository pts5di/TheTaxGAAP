const Question = require('../models/Question')

module.exports = async (req,res) =>{
    const question = await Question.findById(req.params.id).populate('userid');
    res.render('post',{
        question
    })
}