const express = require('express')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')(session)
const DB_Path = "mongodb+srv://coding:radhe@completecoding.cqzlbjm.mongodb.net/airbnb?appName=completeCoding"

const path = require('path')

const storeRouter = require('./routes/storeRouter')
const authRouter = require('./routes/authRouter')
const hostRouter = require('./routes/hostRouter')
const rootDir = require('./utils/pathUtils')
const errorController = require('./controllers/errors')
const { default: mongoose } = require('mongoose')

const app = express();
app.set('view engine','ejs')
app.set('views','views')
const store = new mongodbStore({
  uri: DB_Path,
  collection: 'sessions'
})


app.use(express.urlencoded())
app.use(session({
  secret: "my secret key",
  resave: false,
  saveUninitialized: true,
  store: store
}))

app.use((req,res,next) =>{
  req.isLoggedIn = req.session.isLoggedIn
  next()
})
app.use(authRouter)
app.use(storeRouter)
app.use('/host',(req,res,next) =>{
    if(req.isLoggedIn){
      next()
    } else{
      res.redirect('/login')
    }
})
app.use('/host',hostRouter)
app.use(express.static(path.join(rootDir,'public')))

 
app.use(errorController.errorPage)

const PORT = 3001;

mongoose.connect(DB_Path).then(()=>{
  console.log('connected to database')
app.listen(PORT,()=>{
  console.log(`server is running at http://localhost:${PORT}/`)
})
}).catch(err=>{
  console.log(err)
})