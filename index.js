const http = require('http')
const fs = require('fs')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
        
/*
* Connect to the relevant MongoDB.
*/
mongoose.connect('mongodb://127.0.0.1:27017/GregLimDB', {useNewUrlParser: true})
//NEED TO GET INDEX SET UP FOR SERVER TBD ....                 
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
     
/*
*   Handle SignUp
*/
app.get('/signup', (req,res) => {
   res.render('signup');
})
              
/*
*   Import Validation Middleware
*/
const validateMiddleware = require("./middleware/validationMiddleware")
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
             
/*
*   Establish User Sessions
*/ 
const expressSession = require('express-session');
app.use(expressSession ({
    secret: 'secret',
    resave:false,//added 
    saveUninitialized: true //added     
}))
                         
/*
*   Flush the errors associated with a session
*   after each req, res cycle.  See also controllers/storeUser.js
*/
const flash = require('connect-flash');
app.use(flash());
                           
/*    
*   Conditionally Display New Post, Login and New User
*/ 
global.loggedIn = null;
              
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});   
const homeController = require('./controllers/home')
app.get('/', homeController)
                                     
/* 
*   Handle MyProfile
*/
const myProfileController = require("./controllers/myProfile");
app.get('/myProfile', myProfileController)
     
/*   
*   Handle Research
*/
app.get('/research', (req,res) => {
    res.render('research');
})
               
/*
* Handle Question Posts
*/
const newPostController = require('./controllers/newPost')
app.get('/posts/new', /*authMiddleware,*/ newPostController)
const storePostController = require('./controllers/storePost')
app.post('/posts/store', /*authMiddleware, */ storePostController)
                                        
/*
* Handle Research Request
*/
const researchController = require('./controllers/research')
app.get('/research', researchController)
const displaySearchResultsController = require('./controllers/displayPosts')
app.post('/display/results', displaySearchResultsController)
                                
/*  
* Display Answers
*/
const answerController = require('./controllers/displayAnswers')
app.post('/display/answers', answerController)
                 
/*
* Draft a New Answer
*/
const newAnswerController = require('./controllers/newAnswer')
app.post('/draft/answer', newAnswerController)
                               
/*
* Store a New Answer
*/
const storeAnswerController = require('./controllers/storeAnswer')
app.post('/answers/store', storeAnswerController)
                            
/*    
* Handle Voting
*/
const voteController = require('./controllers/vote')
console.log("Before /vote route")
app.post('/vote', voteController)
                  
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
const loginUserController = require('./controllers/loginUser')
app.post('/users/login', loginUserController)
                        
/*
*   Logout
*/ 
const logoutController = require('./controllers/logout')
app.get('/auth/logout', logoutController)
     
/*
*   Handle page not found
*/   
app.use((req,res) => res.render('notfound'));
                