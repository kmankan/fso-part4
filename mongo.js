const mongoose = require('mongoose')
require('dotenv').config()

// if third argument for password is not given, terminate the program
if (process.argv.length === 3) {
  console.log('invalid number of arguments -- must be either 2 or 4')
  process.exit(1)
}

// store contact name
const name = process.argv[2]
// store contact number
const number = process.argv[3]


// mongoDB url
const url = process.env.MONGODB_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const contact = new Person({
  name: name,
  number: number
})

if (process.argv.length === 4) {
  contact.save()
    .then(result => {
      console.log(`new contact added to the phonebook: ${result.name} ${result.number}`)
      console.log('the phonebook:')
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    })
} else if (process.argv.length === 2) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })}