var express = require('express')
var router = express.Router()
var jobsSchema = require('../models/jobs')


router.get('/list', function (req, res) {
    jobsSchema.find({}, function (err, todos) {
      if (err) res.status(404).json({msg: 'cannot find any todos'})
      res.render('list/jobs/', {something: todos})
      })
  })








module.exports = router
