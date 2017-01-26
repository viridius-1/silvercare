var mongoose = require('mongoose')

var jobSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },

  comment : {
    type: String,
    minlength: [1, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  },
})


  module.exports = mongoose.model('jobs', jobSchema)
