  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy
  var User = require('../models/caregiver')
  var Sponsor = require('../models/careseeker')


  passport.serializeUser(function (user, done) {
    done(null, user.id)
    // console.log(user.availability);
  })


  passport.deserializeUser(function (id, done) {

      Sponsor.findById(id, function (err, user) {
        // console.log('user', user);
        if(user !== null) {
          // console.log('logged in as a sponsor', user);
          done(err, user)
          return
        } else {
            User.findById(id, function (err, user) {

              // console.log('logged in as a giver', user);
              done(err, user)
              return

            })
        }

      })
    })



  // passport.use(new LocalStrategy({
  //   usernameField: 'email',
  //   passwordField: 'password'
  // }, function (email, password, done) {
  //   User.findOne({ email: email }, function (err, user) {
  //     if (err) return done(err)
  //
  //     // If no user is found
  //     if (!user) return done(null, false)
  //
  //     // Check if the password is correct
  //     if (!user.validPassword(password)) return done(null, false)
  //     return done(null, user)
  //   })
  // }))

  // use two LocalStrategies, registered under user and sponsor names

      // add other strategies for more authentication flexibility
  passport.use('user-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      // console.log('userlocal');
      User.findOne({
        email: email
      }, function(err, User) {
        if (err) return done(err);

        if (!User) {
          return done(null, false, {
            message: 'This email is not registered.'
          });
        }
        if (!User.validPassword(password)) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        }
        return done(null, User);
      });
    }
  ));

    passport.use('sponsor-local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        function(email, password, done) {
          // console.log('sponsorlocal');
            Sponsor.findOne({
                email: email
            }, function(err, Sponsor) {
                if (err) return done(err);

                if (!Sponsor) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });
                }
                if (!Sponsor.validPassword(password)) {
                    return done(null, false, {
                        message: 'This password is not correct.'
                    });
                }
                return done(null, Sponsor);
            });
        }
    ));

  module.exports = passport
