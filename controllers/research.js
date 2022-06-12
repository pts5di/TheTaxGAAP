module.exports = (req, res) => {
    if(req.session.userId) {
        res.render('research', {userid: req.session.userId});
    } else {
        res.redirect('/auth/login')
    }
}