const mongoose = require('mongoose')
require('dotenv').config()

// mongoDB url
const url = process.env.MONGODB_URL;

mongoose.set('strictQuery',false)

console.log('connecting to: ', url)

mongoose.connect(url)
.then(result => {
  console.log('connected to MongoDB')
})
.catch(error => {
  console.log('error connecting to MongoDB: ', error.message)
})

// Connection events
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Database connection error:', error);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

db.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

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
      return /\d{2,3}-\d+/.test(numToCheck);
    },
    message: 'Invalid number format. Required: (2 or 3 digits)-(n digits bringing the total to at least 8) '
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

