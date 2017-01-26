var express = require('express')
var router = express.Router()
var giverSchema = require('../models/caregiver')
var seekerSchema = require('../models/careseeker')
var passport = require('../config/ppConfig')
var isLoggedIn = require('../middleware/isLoggedIn')
var isLoggedIn0 = require('../middleware/isLoggedIn0')

router.get('/', function (req, res) {
  seekerSchema.find({}, function (err, todos) {
    if (err) res.status(404).json({msg: 'cannot find any todos'})
    giverSchema.find({}, function (err, todos2) {
      if (err) res.status(404).json({msg: 'cannot find any todos'})
      res.render('list/careseeker/', {something: todos, something2: todos2})
    })
  })
})

router.get('/profile', isLoggedIn0, function (req, res) {
  seekerSchema.findById(req.user.id, function (err, todos) {
    if (err) res.status(404).json({msg: 'cannot find any todos'})
    giverSchema.findById(todos.anything, function (err, todos2) {
      if (err) res.status(404).json({msg: 'cannot find any todos'})
      res.render('list/careseeker/profile', {something: todos, something2: todos2})
    })
  })
})

router.get('/signup', function (req, res) {
  res.render('list/careseeker/signup')
})

router.get('/login', function (req, res) {
  res.render('list/careseeker/login')
})

router.get('/update/:id', isLoggedIn, function (req, res) {
  seekerSchema.findById({ _id: req.params.id}, function (err, user) {
    res.render('list/careseeker/update', {something: user})
  })
})

router.post('/signup', function (req, res) {
  seekerSchema.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price,
    hour: req.body.hour,
    available: req.body.available,
    role: req.body.role,
    anything: req.body.anything

  }, function (err, createdUser) {
    if (err) {
      req.flash('error', 'Could not create user account')
      res.redirect('/careseeker/signup')
    } else {
      passport.authenticate('sponsor-local', {
        successRedirect: '/careseeker/',
        successFlash: 'Job created and logged in'
      })(req, res)
    }
  })
})

router.post('/login', passport.authenticate('sponsor-local', {
  successRedirect: '/careseeker/profile',
  failureRedirect: '/careseeker/login',
  failureFlash: 'Invalid job name and/or password',
  successFlash: 'You have logged in'
}))

router.get('/logout', function (req, res) {
  req.logout()
  // FLASH
  req.flash('success', 'You have logged out')
  res.redirect('/')
})

router.put('/update/:id', isLoggedIn, function (req, res) {
  seekerSchema.findOne({ _id: req.params.id}, function (err, todo) {
    if (req.user.role === 'caregiver') {
      seekerSchema.findOneAndUpdate({ _id: req.params.id }, {available: 'taken', anything: req.user._id}, function (err, todo) {
        if (err) res.status(422).json({msg: 'error updating taco because:' + err})
        else res.redirect('/caregiver/')
      })
    } else {
      seekerSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, todo) {
        if (err) res.status(422).json({msg: 'error updating taco because:' + err})
        else res.redirect('/careseeker/')
      })
    }
  })
})

router.delete('/profile/:id', function (req, res) {
  seekerSchema.findOneAndRemove({ _id: req.params.id }, function (err) {
    if (err) res.status(500).send({msg: 'error deleting todo'})
    else res.redirect('/careseeker/')
  })
})

module.exports = router
