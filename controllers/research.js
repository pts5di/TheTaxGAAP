const Question = require('../models/Question')

module.exports = async (req, res) => {
   
    const keywords = await Question.find({}, {_id:0, keyword1:1}).sort({x:-1});
    const userid = req.session.userId;

    if(req.session.userId) {
        console.log("Inside res.render research");
        console.log(keywords)
        res.render('research', {     
            keywords,
            userid
        });
    } else {
        res.redirect('/auth/login')
    }
}