module.exports = (req, res) => {
    // The If Clause Checks if an Active Session is in Place
    if(req.session.userId) {
        res.render('ask', {createPost: true});
    }
    res.redirect('/auth/login')
}