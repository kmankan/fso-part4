const peopleRouter = require('express').Router()
const Person = require('../models/contact')

// GET ALL
peopleRouter.get('/', (request, response) => {
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
peopleRouter.get('/:id', (request, response, next) => {
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
peopleRouter.get('/info', async (request, response) => {
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
peopleRouter.delete('/:id', (request, response) => {
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
peopleRouter.put('/:id', (request, response, next) => {
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
peopleRouter.post('/', (request, response, next) => {
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

module.exports = peopleRouter