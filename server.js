const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config')
const flash = require('express-flash');
const session = require('express-session')

initializePassport(
    passport,
     email => users.find(user=>users.email === email)
)


const users = []


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false})) // so we can access the forms vars inside our post request eg. req.body.email 
app.use()

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'bobby' })
})

app.get('/login', (req, res)=> {
    res.render('login.ejs')
})

app.post('/login', (req, res)=>{

})
app.get('/register', (req, res)=> {
    res.render('register.ejs')
})

app.post('/register', async (req, res)=> {
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

app.listen(3000)