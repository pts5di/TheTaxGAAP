const Question = require('../models/Question')
const User = require('../models/User')

module.exports = async (req,res) =>{
    const questions = await Question.find({}).populate('userid');   
    const numQuestions = await Question.count();
    const numUsers = await User.count();
    console.log(numUsers)
    const allUsers = await User.find({});
    allUsers.sort(function sortFunction(rankLow, rankHigh) {
        return rankHigh.rank - rankLow.rank;
    })
    console.log(allUsers)
    console.log("Inside home.js: " + req.session)
    res.render('index',{
        questions,
        numQuestions,
        numUsers,
        allUsers,
    })
}