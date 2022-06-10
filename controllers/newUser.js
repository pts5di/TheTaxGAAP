const flash = require("connect-flash/lib/flash")

module.exports = (req, res) => {
    // This causes the register.ejs file to be rendered
    // the errors are passed from storeUser.js
    //res.render('register', {
    //    errors : null
    //})
    
    //, {
        // This Passes the Validation Errors to register.ejs
        // The errors are displayed in register.ejs
        // flash('validationErrors')
    //    errors: req.session.validationErrors /* this is used if we don't use flash */
        
    //})

    //THIS IS FROM HIS FILE
    var username = "" 
    var password = "" 
    const data = req.flash('data')[0]

    if(typeof data!="undefined"){
        username = data.username
        password = data.password
    }

    res.render('register',{
        //errors: req.session.validationErrors
        errors: req.flash('validationErrors'),
        username: username,
        password: password
    })
}