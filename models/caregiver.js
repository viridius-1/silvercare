var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var giverSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  },
  description: {
    type: String,
    minlength: [1, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  },
  location: {
    type: String,
    required: true,
    minlength: [1, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  },
  availability: {
    type: String,
    minlength: [1, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  },
  role: {
    type: String,
    required: true
  }

})
giverSchema.pre('save', function (next) {
  var user = this
       // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
       // hash the password
  var hash = bcrypt.hashSync(user.password, 10)
      // Override the cleartext password with the hashed one
  user.password = hash
  next()
})

giverSchema.methods.validPassword = function (password) {
    // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password)
}

giverSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    // delete the password from the JSON data, and return
    delete ret.password
    return ret
  }
}

module.exports = mongoose.model('caregiver', giverSchema)
