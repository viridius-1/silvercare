  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy
  var User = require('../models/caregiver')
  var Sponsor = require('../models/careseeker')

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    Sponsor.findById(id, function (err, user) {
      if (user !== null) {
        done(err, user)
        return
      } else {
        User.findById(id, function (err, user) {
          done(err, user)
          return
        })
      }
    })
  })

  passport.use('user-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {
    User.findOne({
      email: email
    }, function (err, User) {
      if (err) return done(err)
      if (!User) {
        return done(null, false, {
          message: 'This email is not registered.'
        })
      }
      if (!User.validPassword(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        })
      }
      return done(null, User)
    })
  }
  ))

  passport.use('sponsor-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function (email, password, done) {
    Sponsor.findOne({
      email: email
    }, function (err, Sponsor) {
      if (err) return done(err)
      if (!Sponsor) {
        return done(null, false, {
          message: 'This email is not registered.'
        })
      }
      if (!Sponsor.validPassword(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        })
      }
      return done(null, Sponsor)
    })
  }
    ))

  module.exports = passport
