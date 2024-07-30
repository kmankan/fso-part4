/* eslint-disable no-unused-vars */
const morgan = require('morgan')
const logger = require('./logger')

// Middleware functions

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// morgan middleware for logging incoming requests
morgan.token('post', function (req, res) {
  return JSON.stringify(req.body)
})

const morganTinyWhenNotPost = morgan('tiny', {
  // skip this use of morgan if the method is a POST request
  // i.e. we use tiny for everything except POST methods
  skip: function (req, res) {return req.method === 'POST'}
})

const morganCustomForPost = morgan(':method :url :status :res[content-length] - :response-time ms :post', {
  // skip this use of morgan if the method is not a POST request
  skip: function (req, res) {return req.method !== 'POST'}
})

const correctDateTimeFormat = (request, response, next) => {
  const date = new Date()
  request.requestTime = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Australia/Sydney',
  }).format(date)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  morganTinyWhenNotPost,
  morganCustomForPost,
  correctDateTimeFormat,
  unknownEndpoint,
  errorHandler
}
