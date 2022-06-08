
const Question = require('../models/Question')
const path = require('path')

module.exports = (req,res) => {    
    Question.create(req.body, (error, user) =>{
        if(error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.session.validationErrors = validationErrors
        } else {
            userid: req.session.userId
        }
        res.redirect('/')
    })

}

