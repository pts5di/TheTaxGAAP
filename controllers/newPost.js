module.exports = (req, res) => {
    // The If Clause Checks if an Active Session is in Place
    if(req.session.userId) {
        console.log("body: " + req.body)
        console.log("session.userid: " + req.session.userId)
        
        res.render('ask', {createPost: true, userid: req.session.userId});
    } else {
        res.redirect('/auth/login')
    }

}