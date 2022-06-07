const http = require('http')
const fs = require('fs')
//const signupPage = fs.readFileSync('./public/signup.html')
//const loginPage = fs.readFileSync('./public/login.html')
//const myProfilePage = fs.readFileSync('./public/myProfile.html')
//const researchPage = fs.readFileSync('./public/research.html')
//const askPage = fs.readFileSync('./public/ask.html')
//const homePage = fs.readFileSync('./public/index.html')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

/*
* Connect to the relevant MongoDB.
*/
mongoose.connect('mongodb://127.0.0.1:27017/GregLimDB', {useNewUrlParser: true})

/* 
* Calls Express as a function to begin a new express app.
* The second argument is a callback function that begins when
* the servers start listening.  The "new" in front of express
* is used for nodemon so that we can start afresh each time we save.
*/
const app = new express()

/*
*  EJS is our templating engine.
*/
const ejs = require('ejs')
app.set('view engine', 'ejs')

/*
*   Body Parser Middleware used to read body of POSTs.
*   You can access with req.body.title or req.body.message etc.
*/
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

/*
*   Start Listening
*/

app.use(express.static('public'))
app.listen(4000, () => {
    console.log("App listening on port 4000.")
})


app.get('/signup', (req,res) => {
   res.render('signup');
})

app.get('/login', (req,res) => {
    res.render('login');
})

app.get('/myProfile', (req,res) => {
    res.render('myProfile');
})

app.get('/research', (req,res) => {
    res.render('research');
})

app.get('/posts/new', (req,res) => {
    res.render('ask');
})

app.get('/', async (req,res) => {
    const questions = await Question.find({})
    res.render('index', {
        questions: questions
    });
})


/*
*   Register New User
*/
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
app.get('/auth/register', newUserController)
app.post('/users/register', storeUserController)

/*
*   Store Posted Messages in the Database
*/
//const validateMiddleware = require("./middleware/validateMiddleware")
const Question = require('./models/Question.js')
app.post('/posts/store', (req,res) => {
    // The model creates a new document with browser data
    Question.create(req.body,(error,question) => {
        res.redirect('/');
    })
})