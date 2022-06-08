const Question = require('../models/Question')

/*
*   The .populate ensures that the find only populates with the 
*/

module.exports = async (req,res) =>{
    const questions = await Question.find({}).populate('userid');   
    console.log(req.session)
    res.render('index',{
        questions
    })
}