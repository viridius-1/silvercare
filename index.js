const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const caregiverController = require('./controllers/caregiver_controller')
const careseekerController = require('./controllers/careseeker_controller')
const jobsController = require('./controllers/jobs_controller')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const path = require('path')
require('dotenv').config({ silent: true })
var passport = require('./config/ppConfig')
var flash = require('connect-flash')


const app = express()

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/silvercare')

mongoose.Promise = global.Promise

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use(ejsLayouts)

app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
//  the last 2 sentence has to be after app.use(session)
app.use(flash())

app.use(function (req, res, next) {
  // before every route, attach the flash messages and current user to res.locals, can insert anything (timestamp)
  // for user to view
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', function (req, res) {
  res.render('index')
})


app.use('/caregiver', caregiverController)
app.use('/careseeker', careseekerController)



var server = app.listen(process.env.PORT || 3000)
console.log('Server UP')

// we export the running server so we can use it in testing
module.exports = server
