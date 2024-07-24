const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/contacts.js')

// enable CORS
app.use(cors())
// show static content
app.use(express.static('dist'))
app.use(express.json())
// morgan middleware for logging incoming requests

morgan.token('post', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan('tiny', {
// skip this use of morgan if the method is a POST request
// i.e. we use tiny for everything except POST methods
  skip: function (req, res) {return req.method === 'POST'}
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post', {
  // skip this use of morgan if the method is not a POST request
  skip: function (req, res) {return req.method !== 'POST'}
}))

// Custom middleware to log request time
app.use((request, response, next) => {
  const date = new Date()
  request.requestTime = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Australia/Sydney',
  }).format(date)
  next()
})

// GET ALL
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      console.error('Error fetching persons:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
})

// GET SPECIFIC
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        console.log('id does not exist')
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// GET INFO on contacts
app.get('/api/info', async (request, response) => {
  const count = await Person.countDocuments()
  const allContacts = (await Person.find({})).map(person => `${person.name}<br>`).join('')
  const responseInfo =
  `
  <p>The Phonebook has information about ${count} people</p>
  <p>${allContacts}</p>
  <p>${request.requestTime}</p>
  `

  response.send(responseInfo)
})

// DELETE REQUEST
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(contactRemoved => {
      if (contactRemoved) {
        response.json({ deleted: contactRemoved })
        response.status(204).end()
      } else {
        response.json(`${id} not found. nothing deleted.`)
      }
    })
    .catch(error => {
      response.status(404).json({ error: error }) // Handle error
    })
})

// PUT REQUEST
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const updateContact = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, updateContact, { new: true, runValidators: true, context:'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

// POST REQUEST
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  // create new contact with defined db schema
  const newContact = new Person({
    name: body.name,
    number: String(body.number)
  })
  // add new contact to the db
  newContact.save()
    .then(person => {
      response.json(person)
    })
  // pass any error to middleware
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// create custom error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})