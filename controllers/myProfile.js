const Users = require('../models/User')

module.exports = async (req,res) =>{

    console.log(loggedIn)
    const thisUser = await Users.findById(loggedIn)
    
    res.render('myProfile', {
        thisUser
    })
    /*, function (err, user) {
        if (err){
            console.log(err);
        }
        else{
            console.log(user)
            console.log(user.asked)
            console.log(user.email)
            res.render('myProfile', user)
        }
    })*/
    
  /*  console.log("This is inside myProfile.js: " + req.session.userId);
    const thisUser = await Users.findOne({"_id": req.session.userId}, function (err, docs) {
        if (err){  
            console.log(err);
        }
        else{
            res.render('myProfile', {
                user
            })
        }
    }) */
}