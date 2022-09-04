const Question = require('../models/Question')
const User = require('../models/User')

module.exports = async (req,res) =>{
    const questions = await Question.find({}).populate('userid');   
    const numQuestions = await Question.count();
    const numUsers = await User.count();
    const allUsers = await User.find({});
    allUsers.sort(function sortFunction(rankLow, rankHigh) {
        return rankHigh.rank - rankLow.rank;
    })
    res.render('index',{
        questions,
        numQuestions,
        numUsers,
        allUsers,
    })
}