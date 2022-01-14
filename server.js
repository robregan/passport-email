process.env.NODE_ENV !== 'production' && require('dotenv').config() // same as if statement, if left is truthy right will fire

const methodOverride = require('method-override')
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config')
const flash = require('express-flash');
const session = require('express-session')

initializePassport(
    passport,
     email => users.find(user=>users.email === email),
     id => users.find(user => user.id === id)
)


const users = []


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false})) // so we can access the forms vars inside our post request eg. req.body.email

app.use(flash()) // for error messages
app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false // saves empty value if none is there
}))

// some basic setup functions
app.use(passport.initialize())
app.use(passport.session()) // this will refer to our above session
app.use(methodOverride('_method')) // will allow us to change the method for form, instead of using post we can use the delete


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: 'bobby' })
})

app.get('/login', checkNotAuthenticated, (req, res)=> {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', { 
    sucessRedirect: '/',
    failureRedirect: '/login', 
    failureFlash: true 
}))
app.get('/register', checkNotAuthenticated, (req, res)=> {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res)=> {
   try {
       const hashedPass = await bcrypt.hash(req.body.password, 10)// second param is how many times to generate hash eg how secure
       users.push({
           id: Date.now().toString(),
           name: req.body.name,
           email: req.body.email,
           password: hashedPass
       }) 
       res.redirect('/login')
   } catch  {
       res.redirect('/register')
   }
   console.log(users)
})

app.delete('/logout', (req, res) =>{
    req.logOut() // passport sets this up will clear session and log us out 
    res.redirect('/login')
})


function checkAuthenticated(req, res, next){
    if( req.isAuthenticated() ){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return res.redirect('/')
    }
    next()
}

app.listen(3000)