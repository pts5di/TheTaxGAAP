const bcrypt = require("bcrypt")
const User = require("../models/User")

module.exports = (req, res) => {
    const  { username, password } = req.body;

    User.findOne({username:username}, (error, user) => {

        if(user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if(same) {
                    // If the user's password matches
                    // store the user's session
                    // session package saves this data on the user's browser so
                    // the same cookie will be sent back to the server with the auth id
                    req.session.userId = user._id
                    res.redirect('/')
                } else {
                    res.redirect('/auth/login')
                }
            })
        }
        else {
            res.redirect('/auth/login')
        }
    })
}