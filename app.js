const express = require('express')
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

app.use(express.urlencoded())
app.use(storeRouter)
app.use(authRouter)
app.use('/host',hostRouter)
app.use(express.static(path.join(rootDir,'public')))

 
app.use(errorController.errorPage)

const PORT = 3001;

const DB_Path = "mongodb+srv://coding:radhe@completecoding.cqzlbjm.mongodb.net/airbnb?appName=completeCoding"

mongoose.connect(DB_Path).then(()=>{
  console.log('connected to database')
app.listen(PORT,()=>{
  console.log(`server is running at http://localhost:${PORT}/`)
})
}).catch(err=>{
  console.log(err)
})