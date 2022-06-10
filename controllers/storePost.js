
const Question = require('../models/Question')
const path = require('path')

module.exports = (req, res) => {
    console.log("Body Title: " + req.body.title)
    console.log("Body Body: " + req.body.body)
    let bodyPlainText = req.body.body.replace(/<\/?[^>]+(>|$)/g, "")
    Question.create({title: req.body.title, keyword1: req.body.keyword1, body: bodyPlainText, userid: req.session.userId}, (error, user) =>{
      console.log("Inside Question.create")
      if(error){
        console.log(error)
        const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)          
        req.flash('validationErrors',validationErrors)
        req.flash('data',req.body)
        return res.redirect('/posts/new')    
      }        
      res.redirect('/')
  })
 }
