const http = require('http')
const fs = require('fs')
const signupPage = fs.readFileSync('./public/signup.html')
const loginPage = fs.readFileSync('./public/login.html')
const myProfilePage = fs.readFileSync('./public/myProfile.html')
const researchPage = fs.readFileSync('./public/research.html')
const askPage = fs.readFileSync('./public/ask.html')
const homePage = fs.readFileSync('./public/index.html')
const express = require('express')
const path = require('path')

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

app.use(express.static('public'))
app.listen(4000, () => {
    console.log("App listening on port 4000.")
})

const path = require('path')

app.get('/signup', (req,res) => {
    res.sendFile(path.resolve('D:/Gregg Lim Tutorial/public/', 'signup.html'))
})

app.get('/loginpage', (req,res) => {
    res.sendFile(path.resolve('D:/Gregg Lim Tutorial/public/', 'login.html'))
})

app.get('/myProfile', (req,res) => {
    res.sendFile(path.resolve('D:/Gregg Lim Tutorial/public/', 'myProfile.html'))
})

app.get('/research', (req,res) => {
    res.sendFile(path.resolve('D:/Gregg Lim Tutorial/public/', 'research.html'))
})

app.get('/ask', (req,res) => {
    res.sendFile(path.resolve('D:/Gregg Lim Tutorial/public/', 'ask.html'))
})

app.get('/', (req,res) => {
    res.sendFile(path.resolve('D:/Gregg Lim Tutorial/public/', 'index.html'))
})

/*
const server = http.createServer((req, res) => {
    if(req.url === '/signup')
        res.end(signupPage)
    else if(req.url === '/login')
        res.end(loginPage)
    else if(req.url === '/myProfile')
        res.end(myProfilePage)
    else if(req.url === '/research')
        res.end(researchPage)
    else if(req.url === '/ask')
        res.end(askPage)
    else if(req.url === "/")
        res.end(homePage)
    else {
        res.writeHead(404)
        res.end('page not found')
    }
})


server.listen(3000)
*/