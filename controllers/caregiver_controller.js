var express = require('express')
var router = express.Router()
var giverSchema = require('../models/caregiver')
var seekerSchema = require('../models/careseeker')
var passport = require('../config/ppConfig')
var isLoggedIn = require('../middleware/isLoggedIn')

router.get('/', function (req, res) {
  seekerSchema.find({}, function (err, todos) {
    if (err) res.status(404).json({msg: 'cannot find any todos'})
    giverSchema.find({}, function (err, todos2) {
      if (err) res.status(404).json({msg: 'cannot find any todos'})
      res.render('list/caregiver/', {something: todos, something2: todos2})
    })
  })
})

router.get('/profile', isLoggedIn, function (req, res) {
  giverSchema.find({_id: req.user.id}, function (err, todos2) {
    if (err) res.status(404).json({msg: 'can  not find any todos'})
    seekerSchema.find({ anything: req.user.id }, function (err, todos) {
      if (err) res.status(404).json({msg: 'cannot find any todos'})
      res.render('list/caregiver/profile', {something: todos, something2: todos2})
    })
  })
})

router.get('/signup', function (req, res) {
  res.render('list/caregiver/signup')
})

router.get('/login', function (req, res) {
  res.render('list/caregiver/login')
})

router.get('/update/:id', function (req, res) {
  giverSchema.findById({_id: req.params.id}, function (err, user) {
  res.render('list/caregiver/update', {something: user})
  })
})

router.post('/signup', function (req, res) {
  giverSchema.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    description: req.body.description,
    location: req.body.location,
    availability: req.body.availability,
    role: req.body.role

  }, function (err, createdUser) {
    if (err) {
      req.flash('error', 'Could not create user account')
      res.redirect('/caregiver/signup')
    } else {
      passport.authenticate('user-local', {
        successRedirect: '/caregiver/',
        successFlash: 'Account created and logged in'
      })(req, res)
    }
  })
})

router.post('/login', passport.authenticate('user-local', {
  successRedirect: '/caregiver/', // add profile
  failureRedirect: '/caregiver/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}))

router.get('/logout', function (req, res) {
  req.logout()
  // FLASH
  req.flash('success', 'You have logged out')
  res.redirect('/')
})

router.put('/update/:id', function (req, res) {
  giverSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, todo) {
    if (err) res.status(422).json({msg: 'error updating taco because:' + err})
    else res.redirect('/caregiver/')
  })
})

router.delete('/profile/:id', function (req, res) {
  giverSchema.findOneAndRemove({ _id: req.params.id }, function (err) {
    if (err) res.status(500).send({msg: 'error deleting todo'})
    else res.redirect('/caregiver/')
  })
})

module.exports = router
