const express = require('express')
const { default: mongoose } = require('mongoose')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')(session)
require("dotenv").config();
const DB_Path = process.env.DB_URL;

const path = require('path')

const storeRouter = require('./routes/storeRouter')
const authRouter = require('./routes/authRouter')
const hostRouter = require('./routes/hostRouter')
const rootDir = require('./utils/pathUtils')
const errorController = require('./controllers/errors')

const app = express();
app.set('view engine','ejs')
app.set('views','views')
const store = new mongodbStore({
  uri: DB_Path,
  collection: 'sessions'
})

store.on('error', function(error) {
  console.log("Session Store Error:", error);
});

app.use(express.urlencoded())
const PORT = process.env.PORT || 3001;

app.use(session({
  secret: "my secret key",
  resave: false,
  saveUninitialized: false,
  store: store,
}))

app.use((req,res,next) =>{
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  next()
})
app.use(authRouter)
app.use(storeRouter)
app.use('/host',(req,res,next) =>{
    if(req.session.isLoggedIn){
      next()
    } else{
      res.redirect('/login')
    }
})
app.use('/host',hostRouter)
app.use(express.static(path.join(rootDir,'public')))

 
app.use(errorController.errorPage)


mongoose.connect(DB_Path).then(()=>{
  console.log('connected to database')
app.listen(PORT,()=>{
  console.log(`server is running at http://localhost:${PORT}/`)
})
}).catch(err=>{
  console.log(err)
})