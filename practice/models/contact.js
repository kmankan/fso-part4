const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters'],
    required: [true, 'Name required']
  },
  number: {
    type: String,
    validate: {
      validator: function(numToCheck) {
      // regular expression to check number format validity
        return /\d{2,3}-\d+/.test(numToCheck)
      },
      message: 'Invalid number format. Required: (2-3 digits)(hyphen)(n digits that bring the total to at least 8) '
    },
    minLength: [9, 'Phone number must be minimum of 8 digits'],
    required: [true, 'Number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

