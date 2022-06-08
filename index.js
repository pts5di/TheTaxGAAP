const http = require('http')
const fs = require('fs')
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


/*
*   Import Validation Middleware
*/
const validateMiddleware = require("./middleware/validationMiddleware")
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

/*
* Handle Question Posts
*/
const newPostController = require('./controllers/newPost')
app.get('/posts/new', authMiddleware, newPostController)
const homeController = require('./controllers/home')
app.get('/', homeController)
//const storePostController = require('./controllers/storePost')
//app.get('/post/:id', storePostController)
const getPostController = require('./controllers/getPost')
app.post('/post/store', authMiddleware, getPostController)

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
*   Login Existing User
*/
const loginController = require("./controllers/login")
app.get('/auth/login', loginController);
const loginUserController = require("./controllers/loginUser")
app.post('/users/login', loginUserController)

/*
*   Establish User Sessions
*/ 
const expressSession = require('express-session');
app.use(expressSession ({
    secret: 'secret'
}))


/*
*   Store Posted Messages in the Database
*/

const Question = require('./models/Question.js')
app.post('/posts/store', (req,res) => {
    // The model creates a new document with browser data
    Question.create(req.body,(error,question) => {
        res.redirect('/');
    })
})

/*
*   Logout
*/ 
const logoutController = require('./controllers/logout')
app.get('/auth/logout', logoutController)

/*
*   Conditionally Display New Post, Login and New User
*/ 
global.loggedIn = null;

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});

/*
*   Handle page not found
*/
app.use((req,res) => res.render('notfound'));

/*
*   Flush the errors associated with a session
*   after each req, res cycle.  See also constrollers/storeUser.js
*/
const flash = require('connect-flash');
app.use(flash());
