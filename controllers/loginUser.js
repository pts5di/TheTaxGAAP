const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = function (req,res) {

   // console.log("Before username, password")

    const { username,password } = req.body

   // console.log("username: " + username + " password: " + password)
    
    User.findOne({username: username},function(error,user){        

        if(user){

            console.log("Inside if(user)")

            bcrypt.compare(password, user.password, (error,same)=>{
                if(same){
                    req.session.userId = user._id
                    res.redirect('/')
                }
                else{
                    res.redirect('/auth/login')
                }
            })
        }
        else{

            console.log("Inside else")
            console.log("/auth/login::",user)
            res.redirect('/auth/login')
        }
    })
}